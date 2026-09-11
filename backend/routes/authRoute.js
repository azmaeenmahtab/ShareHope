const express = require('express');
const router = express.Router();
const { loginController, signupController } = require('../controllers/authController');

router.post('/signup', signupController);
router.post('/login', loginController);

module.exports = router;