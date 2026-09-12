const express = require('express');
const router = express.Router();
const { loginController, signupController, authMeController, logoutController } = require('../controllers/authController');
const { verifyTokenMiddleware } = require('../middlewares/verifyToken');

router.post('/signup', signupController);
router.post('/login', loginController);
router.get('/me', verifyTokenMiddleware, authMeController);
router.post('/logout', verifyTokenMiddleware, logoutController);

module.exports = router;