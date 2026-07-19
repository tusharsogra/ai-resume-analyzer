import mongoose from "mongoose";


async function connectDb() {
  try {
    const MONGO_URI = process.env.MONGO_URI;
    if (!MONGO_URI) {
      throw new Error("Please provide MONGO_URI in .env");
    }

    await mongoose.connect(MONGO_URI);
    console.log("Database connected successfully");
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export default connectDb;