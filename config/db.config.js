const mongoose = require("mongoose");
require("dotenv").config();
const dns = require("dns");

dns.setServers(["1.1.1.1", "8.8.8.8"]);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("MongoDB connected!");
  } catch (error) {
    console.log("MongoDB connection failed!", error);
  }
};

module.exports = connectDB;
