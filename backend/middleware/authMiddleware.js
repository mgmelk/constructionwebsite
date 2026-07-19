const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
    let token;

    // Check Authorization header
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            // Get token from header
            token = req.headers.authorization.split(" ")[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Save user data in request
            req.user = decoded;

            next();

        } catch (error) {
            return res.status(401).json({
                message: "Invalid token"
            });
        }
    }

    if (!token) {
        return res.status(401).json({
            message: "No token provided"
        });
    }
};

module.exports = protect;