const router = require ("express").Router();
const UserController = require("../controllers/user.controller");
const AuthController = require("../controllers/auth.controller");
const verifyToken = require("../middlewares/verifyToken.middleware");

router.post('/register', AuthController.register);
router.get('/confirm/:id', AuthController.confirm);
router.post('/login', AuthController.login)
router.post('/verify-otp', verifyToken, AuthController.verifyOtp)
router.post('/generate-apikey', AuthController.generateApikey)
router.post('/invalidate-apikey', AuthController.invalidateApikey)
router.get("/", UserController.fetchAll);
router.delete('/:id', UserController.deleteUser);


module.exports = router;