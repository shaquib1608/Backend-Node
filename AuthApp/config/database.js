const mongoose = require("mongoose");
require("dotenv").config();

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log("✅ MongoDB Connection Successful");

    // 🛠 Debugging: Show the current database name
    console.log("Connected to Database:", mongoose.connection.name);
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};

module.exports = dbConnect;

// const mongoose = require("mongoose");
// require("dotenv").config();

// exports.connect = () => {
//   mongoose
//     .connect(process.env.DATABASE_URL, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     })
//     .then(() => {
//       console.log("Database Connection established");
//     })
//     .catch((err) => {
//       // console.error(err)
//       console.log("Connection Issues with Database");
//       process.exit(1);
//     });
// };
