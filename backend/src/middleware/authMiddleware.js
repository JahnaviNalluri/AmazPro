const jwt = require("jsonwebtoken");
const User = require("../models/Users");

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

const protect = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "Not authorized" });
        }

        const decoded = jwt.verify(token, JWT_SECRET);

        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        req.user = user;

        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
};

const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: "Not authorized" });
        }

        if (!roles.includes(req.user.role)) {
            console.log(req.user.role);
            
            return res.status(403).json({ message: "Access denied" });
        }

        next();
    };
};

module.exports = {
    protect,
    authorize
};
