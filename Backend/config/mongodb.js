import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("db connected");
    });

    mongoose.connection.on("error", (err) => {
      console.error("Mongoose connection error:", err);
    });

    const uri = `${process.env.MONGO_URL}/booking`;
    // Avoid printing credentials in logs
    console.log(
      "Connecting to MongoDB:",
      uri.replace(/:\/\/.*@/, "://<user>:<pass>@")
    );

    await mongoose.connect(uri);
    console.log("MongoDB connection established");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);

    if (
      error.code === "ENOTFOUND" ||
      error.code === "ECONNREFUSED" ||
      error.syscall === "querySrv"
    ) {
      console.error(
        "DNS or connection issue detected. Check your internet connection, the Atlas cluster name, and make sure your IP is allowlisted in MongoDB Atlas (or use 0.0.0.0/0 for testing)."
      );
    }

    process.exit(1);
  }
};

export default connectDB;
