import bcrypt from 'bcryptjs';
import User from '../models/User.model.js';
import Role from '../models/Role.model.js';
import Organization from '../models/Organization.model.js';

export const seedUsers = async () => {
  const adminRole = await Role.findOne({ name: 'admin' });
  const memberRole = await Role.findOne({ name: 'member' });
 
  if (!adminRole || !memberRole) {
    throw new Error('Run role seeder before user seeder');
  }
 
  const defaults = [
    {
      name: 'Super Admin',
      email: 'admin@trackflow.dev',
      password: 'Admin@1234',
      role: adminRole._id
    },
    {
      name: 'Default Member',
      email: 'member@trackflow.dev',
      password: 'Member@1234',
      role: memberRole._id
    }
  ];
 
  for (const userData of defaults) {
    const exists = await User.findOne({ email: userData.email });
    if (exists) {
      console.log(`User seeded: ${userData.email} (skipped, already exists)`);
      continue;
    }

    const hashed = await bcrypt.hash(userData.password, 12);
    await User.create(userData);
    console.log(`User seeded: ${userData.email}`);

    const user = await User.findOne({ email: userData.email });
    console.log(`User seeded/updated: ${userData.email}`);
  }
 
  const adminUser = await User.findOne({ email: 'admin@trackflow.dev' });
  if (adminUser) {
    const org = await Organization.findOneAndUpdate(
      { slug: 'trackflow-hq' },
      {
        $setOnInsert: {
          name: 'TrackFlow HQ',
          slug: 'trackflow-hq',
          createdBy: adminUser._id
        }
      },
      { upsert: true, new: true }
    );
 
    // Assign organization to all default users
    await User.updateMany(
      { email: { $in: ['admin@trackflow.dev', 'member@trackflow.dev'] } },
      { organization: org._id }
    );
  }
};
