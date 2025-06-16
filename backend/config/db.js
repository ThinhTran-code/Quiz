const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config(); // Cho phep doc. cac bien moi truong tu .env

const connectionDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB successfully");
    } catch (error) {
        console.log("Connect to MongoDB failed" + error);
        process.exit(1);
    }
};
module.exports = connectionDB;
