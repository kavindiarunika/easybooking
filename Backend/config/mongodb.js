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
      uri.replace(/:\/\/.*@/, "://<user>:<pass>@"),
    );

    // Use safer connection options and allow longer server selection time
    const options = {
      serverSelectionTimeoutMS: 30000, // 30s to select a server
      socketTimeoutMS: 45000,
    };

    // Retry loop to handle transient DNS or network issues (e.g., Atlas allowlist delays)
    const maxRetries = 5;
    let attempt = 0;
    while (attempt < maxRetries) {
      try {
        attempt++;
        await mongoose.connect(uri, options);
        console.log("MongoDB connection established");
        break;
      } catch (err) {
        console.error(
          `MongoDB connection attempt ${attempt} failed:`,
          err.message || err,
        );
        if (attempt >= maxRetries) throw err;
        const delay = attempt * 2000; // incremental backoff
        console.log(`Retrying to connect in ${delay}ms...`);
        await new Promise((r) => setTimeout(r, delay));
      }
    }
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);

    if (
      error.code === "ENOTFOUND" ||
      error.code === "ECONNREFUSED" ||
      error.syscall === "querySrv"
    ) {
      console.error(
        "DNS or connection issue detected. Check your internet connection, the Atlas cluster name, and make sure your IP is allowlisted in MongoDB Atlas (or use 0.0.0.0/0 for testing).",
      );
    }

    process.exit(1);
  }
};

export default connectDB;
