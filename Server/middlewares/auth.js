const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
};

module.exports = { authenticateToken };
