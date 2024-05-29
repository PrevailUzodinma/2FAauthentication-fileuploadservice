const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/mongodb");
const app = express();

// Connect to Database
connectDB();

// allow requests from any origin
app.use(cors({}));

// logger middleware: log endpoints called
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// start the server and listen
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
