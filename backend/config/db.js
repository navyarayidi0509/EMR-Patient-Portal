import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables from the .env file
dotenv.config();

// Function responsible for connecting the app to MongoDB
const connectDB = async () => {
  try {
    // Attempt to connect using the connection string stored in MONGO_URI
    await mongoose.connect(process.env.MONGO_URI);

    // Log a success message if the connection works
    console.log("MongoDB Connected ✅");
  } catch (error) {
    // If connection fails, log the error
    console.error("MongoDB Error ❌", error);

    // Exit the process so the app doesn't run without a database
    process.exit(1);
  }
};

export default connectDB; // export the function so it can be used in server startup (e.g., server.js or app.js)