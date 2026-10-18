import mongoose from 'mongoose';

async function connectDB() {
  try {
    const connect = await mongoose.connect(process.env.DB_CONNECTION);
    console.log('[Database] Database connection OK');
  } catch (error) {
    console.log('[Database] Database connection error');
    console.log(error);
    process.exit(1);
  }
}

export default connectDB;
