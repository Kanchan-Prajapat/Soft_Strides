import mongoose from "mongoose";

export const connectDB = async () => {
  try {

    console.log("MONGO URI:");
    console.log(process.env.MONGO_URI);

    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log("✅ MongoDB Connected");

  } catch (error) {

    console.log("❌ FULL ERROR:");
    console.log(error);

    console.log("❌ DB Error:", error.message);

    process.exit(1);
  }
};