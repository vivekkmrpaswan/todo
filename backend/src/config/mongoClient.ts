import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

export const connectToMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);

    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err);
  }
};
