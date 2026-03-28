import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../server/models/User.model.js';
import Organization from '../server/models/Organization.model.js';

dotenv.config({ path: '../server/.env' });

async function fix() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');

    const org = await Organization.findOne({ slug: 'trackflow-hq' });
    if (!org) {
      console.error('Org not found');
      process.exit(1);
    }

    const result = await User.updateMany(
      { email: { $in: ['admin@trackflow.dev', 'member@trackflow.dev'] } },
      { organization: org._id }
    );

    console.log(`Updated ${result.modifiedCount} users`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

fix();
