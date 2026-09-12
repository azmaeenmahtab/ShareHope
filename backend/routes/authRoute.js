const express = require('express');
const router = express.Router();
const { loginController, signupController, authMeController } = require('../controllers/authController');
const { verifyTokenMiddleware } = require('../middlewares/verifyToken');

router.post('/signup', signupController);
router.post('/login', loginController);
router.get('/me', verifyTokenMiddleware, authMeController);

module.exports = router;