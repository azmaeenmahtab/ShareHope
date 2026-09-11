const { signupService, loginService } = require('../services/authService');

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    const { user, token } = await loginService({ email, password });

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Login failed',
    });
  }
};

const signupController = async (req, res) => {
  try {
    const { name, email, password, role } = req.body || {};

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, password and role',
      });
    }

    const user = await signupService(req.body);

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Signup failed',
    });
  }
};

module.exports = {
  loginController,
  signupController,
  LoginController: loginController,
  SignupController: signupController,
};