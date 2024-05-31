const router = require ("express").Router();
const userRouter = require("../routes/user.router.js");

router.use("/users", userRouter);

module.exports = router; 
