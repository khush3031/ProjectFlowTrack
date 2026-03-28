import crypto from 'crypto';
import Organization from '../models/Organization.model.js';
import Invitation from '../models/Invitation.model.js';
import User from '../models/User.model.js';
import Role from '../models/Role.model.js';
import { scopeToOrg } from '../middleware/org.middleware.js';

export const createOrganization = async (req, res, next) => {
  try {
    const { name } = req.body;

    const slug = name.toLowerCase().trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');

    const existingOrg = await Organization.findOne({ slug });
    if (existingOrg) {
      return res.status(409).json({ message: 'Organization with a similar name already exists' });
    }

    const org = await Organization.create({ name, slug, createdBy: req.user._id });
    
    // Assign admin role to the creator
    const adminRole = await Role.findOne({ name: 'admin' });
    if (adminRole) {
      req.user.role = adminRole._id;
    }
    
    req.user.organization = org._id;
    await req.user.save();

    // Populate role to return accurate name
    await req.user.populate('role');

    return res.status(201).json({
      message: 'Organization created',
      organization: { id: org._id, name: org.name, slug: org.slug },
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role?.name,
        organization: req.user.organization
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getMyOrganization = async (req, res, next) => {
  try {
    const members = await User.find(scopeToOrg(req))
      .populate('role', 'name')
      .select('name email role createdAt');

    return res.status(200).json({
      organization: {
        id: req.org._id,
        name: req.org.name,
        slug: req.org.slug,
        createdBy: req.org.createdBy
      },
      members: members.map(m => ({
        id: m._id,
        name: m.name,
        email: m.email,
        role: m.role?.name,
        createdAt: m.createdAt
      }))
    });
  } catch (error) {
    next(error);
  }
};

export const inviteUser = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (email === req.user.email) {
      return res.status(400).json({ message: 'You cannot invite yourself' });
    }

    const existingMember = await User.findOne({ email, organization: req.org._id });
    if (existingMember) {
      return res.status(409).json({ message: 'User is already a member of this organization' });
    }

    const pendingInvite = await Invitation.findOne({
      email,
      organization: req.org._id,
      status: 'pending',
      expiresAt: { $gt: new Date() }
    });

    if (pendingInvite) {
      return res.status(409).json({ message: 'A pending invitation already exists for this email' });
    }

    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000);

    const invitation = await Invitation.create({
      email,
      organization: req.org._id,
      invitedBy: req.user._id,
      token,
      expiresAt
    });

    return res.status(201).json({
      message: 'Invitation sent',
      invitation: {
        id: invitation._id,
        email: invitation.email,
        token: invitation.token,
        expiresAt: invitation.expiresAt
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getInvitationInfo = async (req, res, next) => {
  try {
    const { token } = req.params;
    const invitation = await Invitation.findOne({ token }).populate('organization', 'name');

    if (!invitation) {
      return res.status(404).json({ message: 'Invitation not found' });
    }
    if (invitation.status !== 'pending') {
      return res.status(400).json({ message: 'Invitation has already been used' });
    }
    if (invitation.expiresAt < new Date()) {
      return res.status(400).json({ message: 'Invitation has expired' });
    }

    return res.status(200).json({
      email: invitation.email,
      orgName: invitation.organization?.name || '',
    });
  } catch (error) {
    next(error);
  }
};

export const acceptInvitation = async (req, res, next) => {
  try {
    const { token } = req.params;

    const invitation = await Invitation.findOne({ token });
    if (!invitation) {
      return res.status(404).json({ message: 'Invitation not found' });
    }

    if (invitation.status !== 'pending') {
      return res.status(400).json({ message: 'Invitation has already been used' });
    }

    if (invitation.expiresAt < new Date()) {
      invitation.status = 'expired';
      await invitation.save();
      return res.status(400).json({ message: 'Invitation has expired' });
    }

    const user = await User.findOne({ email: invitation.email });
    if (!user) {
      return res.status(404).json({ message: 'No account found for this email. Please register first.' });
    }

    if (user.organization) {
      return res.status(409).json({ message: 'You already belong to an organization' });
    }

    user.organization = invitation.organization;
    await user.save();

    invitation.status = 'accepted';
    await invitation.save();

    return res.status(200).json({ message: 'Invitation accepted. You have joined the organization.' });
  } catch (error) {
    next(error);
  }
};

export const removeMember = async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (userId === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot remove yourself' });
    }

    const user = await User.findOne({ _id: userId, organization: req.org._id });
    if (!user) {
      return res.status(404).json({ message: 'Member not found in your organization' });
    }

    user.organization = null;
    await user.save();

    return res.status(200).json({ message: 'Member removed from organization' });
  } catch (error) {
    next(error);
  }
};

export const getUnassignedUsers = async (req, res, next) => {
  try {
    const { email } = req.query;
    const filter = { organization: null };
    
    if (email) {
      filter.email = { $regex: email, $options: 'i' };
    }

    const users = await User.find(filter)
      .limit(10)
      .select('name email');

    return res.status(200).json({ users });
  } catch (error) {
    next(error);
  }
};

export const addMemberDirectly = async (req, res, next) => {
  try {
    const { userId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.organization) {
      return res.status(409).json({ message: 'User already belongs to an organization' });
    }

    user.organization = req.org._id;
    await user.save();

    return res.status(200).json({ 
      message: 'Member added directly', 
      member: { id: user._id, name: user.name, email: user.email } 
    });
  } catch (error) {
    next(error);
  }
};
