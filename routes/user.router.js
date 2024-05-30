const router = require ("express").Router();
const UserController = require("../controllers/user.controller");

router.post('/register', UserController.register);
router.get('/confirm/:id', UserController.confirm);
router.delete('/:id', UserController.deleteUser);


module.exports = router;