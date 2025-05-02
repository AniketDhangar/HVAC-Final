import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DATABASE_URL);
    console.log("Connected to MongoDB:", conn.connection.name);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
export { connectDB };
