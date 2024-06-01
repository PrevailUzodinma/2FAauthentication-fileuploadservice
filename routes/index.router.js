const router = require ("express").Router();
const userRouter = require("../routes/user.router.js")
const fileRouter = require("../routes/file.router.js");


router.use("/users", userRouter);
router.use("/files", fileRouter);

module.exports = router; 
