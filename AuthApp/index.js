// const express = require("express");
// const app = express();

// app.use(express.json());

// require("dotenv").config();

// const dbConnect = require("./config/database");
// dbConnect();

// const PORT = process.env.PORT || 3000;

// // require("./config/database").connect();

// //route import and mount
// const user = require("./routes/user");
// app.use("/api/v1", user);

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

const express = require("express");
const app = express();

require("dotenv").config();

const PORT = process.env.PORT || 3000;

//import cookie parser
const cookieparser = require("cookie-parser");

app.use(cookieparser());
app.use(express.json());

// require("./config/database").connect();
const dbConnect = require("./config/database");
dbConnect();

// route import and mount
const user = require("./routes/user");
app.use("/api/v1", user);

// Activate
app.listen(PORT, () => {
  console.log("Server Run at ", PORT);
});

app.get("/", (req, res) => {
  res.send("<h1>Auth App</h1>");
});
