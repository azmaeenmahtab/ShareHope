const jwt = require('jsonwebtoken');

const verifyTokenMiddleware = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized",
        });
    }

    console.log('cookie token found is : ', token)

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decodedToken;

        

        console.log('middleware passed successfully. user data is in req.user : ', req.user);
        next();
    } catch (err) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token",
        });
    }
};

module.exports = {verifyTokenMiddleware}