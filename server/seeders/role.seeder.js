import Role from '../models/Role.model.js';

export const seedRoles = async () => {
  const roles = ['admin', 'member'];
  for (const name of roles) {
    await Role.updateOne({ name }, { $setOnInsert: { name } }, { upsert: true });
  }
  console.log('Roles seeded: admin, member');
};
