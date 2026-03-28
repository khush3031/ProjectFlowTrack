import Project from '../models/Project.model.js';
import User from '../models/User.model.js';
import { scopeToOrg } from '../middleware/org.middleware.js';

export const createProject = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    const existing = await Project.findOne({ name, organization: req.org._id });
    if (existing) {
      return res.status(409).json({ message: 'A project with this name already exists' });
    }

    const newProject = await Project.create({
      name,
      description: description || '',
      organization: req.org._id,
      createdBy: req.user._id,
      members: [req.user._id],
    });

    const populated = await Project.findById(newProject._id)
      .populate('createdBy', 'name email')
      .populate({ path: 'members', select: 'name email role', populate: { path: 'role', select: 'name' } });

    return res.status(201).json({ message: 'Project created', project: populated });
  } catch (err) {
    next(err);
  }
};

export const getAllProjects = async (req, res, next) => {
  try {
    const isAdmin = req.user.role?.name === 'admin';
    const filter = isAdmin
      ? scopeToOrg(req)
      : { ...scopeToOrg(req), members: req.user._id };

    const projects = await Project.find(filter)
      .populate('createdBy', 'name email')
      .populate({ path: 'members', select: 'name email role', populate: { path: 'role', select: 'name' } })
      .sort({ createdAt: -1 });

    return res.status(200).json({ projects });
  } catch (err) {
    next(err);
  }
};

export const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, ...scopeToOrg(req) })
      .populate('createdBy', 'name email')
      .populate({ path: 'members', select: 'name email role', populate: { path: 'role', select: 'name' } });

    if (!project) return res.status(404).json({ message: 'Project not found' });

    const isAdmin = req.user.role?.name === 'admin';
    const isMember = project.members.some(m => m._id.toString() === req.user._id.toString());

    if (!isAdmin && !isMember) {
      return res.status(403).json({ message: 'Access denied' });
    }

    return res.status(200).json({ project });
  } catch (err) {
    next(err);
  }
};

export const updateProject = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    const project = await Project.findOne({ _id: req.params.id, ...scopeToOrg(req) });
    if (!project) return res.status(404).json({ message: 'Project not found' });

    if (name && name !== project.name) {
      const existing = await Project.findOne({
        name,
        ...scopeToOrg(req),
        _id: { $ne: req.params.id },
      });
      if (existing) return res.status(409).json({ message: 'A project with this name already exists' });
    }

    project.name        = name        ?? project.name;
    project.description = description ?? project.description;
    await project.save();

    const populated = await Project.findById(project._id)
      .populate('createdBy', 'name email')
      .populate({ path: 'members', select: 'name email role', populate: { path: 'role', select: 'name' } });

    return res.status(200).json({ message: 'Project updated', project: populated });
  } catch (err) {
    next(err);
  }
};

export const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findOneAndDelete({ _id: req.params.id, ...scopeToOrg(req) });
    if (!project) return res.status(404).json({ message: 'Project not found' });
    return res.status(200).json({ message: 'Project deleted' });
  } catch (err) {
    next(err);
  }
};

export const addMember = async (req, res, next) => {
  try {
    const { userId } = req.body;

    const project = await Project.findOne({ _id: req.params.id, ...scopeToOrg(req) });
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const targetUser = await User.findOne({ _id: userId, ...scopeToOrg(req) });
    if (!targetUser) return res.status(404).json({ message: 'User not found in your organization' });

    if (project.members.includes(userId)) {
      return res.status(409).json({ message: 'User is already a project member' });
    }

    project.members.push(userId);
    await project.save();

    const populated = await Project.findById(project._id)
      .populate('createdBy', 'name email')
      .populate({ path: 'members', select: 'name email role', populate: { path: 'role', select: 'name' } });

    return res.status(200).json({ message: 'Member added', project: populated });
  } catch (err) {
    next(err);
  }
};

export const removeMember = async (req, res, next) => {
  try {
    const { id, userId } = req.params;

    const project = await Project.findOne({ _id: id, ...scopeToOrg(req) });
    if (!project) return res.status(404).json({ message: 'Project not found' });

    if (project.createdBy.toString() === userId) {
      return res.status(400).json({ message: 'Cannot remove the project creator' });
    }

    project.members = project.members.filter(m => m.toString() !== userId);
    await project.save();

    const populated = await Project.findById(project._id)
      .populate('createdBy', 'name email')
      .populate({ path: 'members', select: 'name email role', populate: { path: 'role', select: 'name' } });

    return res.status(200).json({ message: 'Member removed', project: populated });
  } catch (err) {
    next(err);
  }
};
