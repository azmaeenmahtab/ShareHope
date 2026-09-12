const jwt = require('jsonwebtoken');

const verifyTokenMiddleware = (req, res, next) => {
    const token = req.cookies?.token || req.headers?.authorization?.replace(/^Bearer\s+/i, '');

    if (!token) {
        console.warn('[verifyTokenMiddleware] Rejected: No token found in cookies or Authorization header. Cookies:', req.cookies);
        return res.status(401).json({
            success: false,
            message: "You must be logged in to submit a request. Please log in first.",
        });
    }

    console.log('[verifyTokenMiddleware] Token found:', token.substring(0, 15) + '...');

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decodedToken;

        console.log('[verifyTokenMiddleware] Passed successfully. User:', req.user.email || req.user);
        next();
    } catch (err) {
        console.warn('[verifyTokenMiddleware] Rejected: Invalid or expired token:', err.message);
        return res.status(401).json({
            success: false,
            message: "Invalid or expired session. Please log in again.",
        });
    }
};

module.exports = {verifyTokenMiddleware}