import mongoose from 'mongoose';
import 'dotenv/config';
import { seedRoles } from './role.seeder.js';
import { seedUsers } from './user.seeder.js';

const connectAndSeed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await seedRoles();
    await seedUsers();
    await mongoose.disconnect();
    console.log('Seeders complete');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

connectAndSeed();
