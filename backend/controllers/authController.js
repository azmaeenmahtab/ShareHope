const { signupService, loginService, authMeService } = require('../services/authService');

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

    res.cookie("token", token, {
  httpOnly: true, // JavaScript cannot access it (XSS protection)
  secure: process.env.NODE_ENV === "production", // HTTPS in production
  sameSite: "lax", // CSRF protection
  maxAge: 24 * 60 * 60 * 1000, // 1 day in ms
});

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

const authMeController = async (req, res) => {
  const user = req.user;
  try {

    const userData = await authMeService(user.email);

    return res.status(200).json({
      success: true,
      message: "User found",
      user: userData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
}

module.exports = {
  loginController,
  signupController,
  authMeController,
  LoginController: loginController,
  SignupController: signupController,
};