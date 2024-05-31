const router = require ("express").Router();
const UserController = require("../controllers/user.controller");
const verifyToken = require("../middlewares/verifyToken.middleware");

router.post('/register', UserController.register);
router.get('/confirm/:id', UserController.confirm);
router.post('/login', UserController.login)
router.post('/verify-otp', verifyToken, UserController.verifyOtp)
router.get("/", UserController.fetchAll);
router.delete('/:id', UserController.deleteUser);


module.exports = router;