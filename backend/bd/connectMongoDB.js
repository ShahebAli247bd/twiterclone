import mongoose from "mongoose";
export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(
      "Mongodb connection established",
      conn.connection.host,
      conn.connection.port
    );
  } catch (error) {
    console.log("MongoDB connection failed,", error.message);
    process.exit(1);
  }
};
