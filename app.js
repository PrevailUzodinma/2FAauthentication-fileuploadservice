const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/mongodb");
const router = require("./routes/index.router");
const app = express();

// Connect to Database
connectDB();

// allow requests from any origin
app.use(cors({}));

// middleware to parse JSON bodies
app.use(express.json());

// middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// logger middleware: log endpoints called
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// use router
app.use('/api/v1/', router)

// start the server and listen
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
