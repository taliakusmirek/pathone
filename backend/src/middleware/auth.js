import { verifyToken } from "../utils/auth.js";

/**
 * Authentication middleware
 * Verifies JWT token from Authorization header
 */
export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({
            error: "Access token required",
            code: "TOKEN_MISSING",
        });
    }

    try {
        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                error: "Token expired",
                code: "TOKEN_EXPIRED",
            });
        } else if (error.name === "JsonWebTokenError") {
            return res.status(401).json({
                error: "Invalid token",
                code: "TOKEN_INVALID",
            });
        } else {
            return res.status(500).json({
                error: "Token verification failed",
                code: "TOKEN_VERIFICATION_FAILED",
            });
        }
    }
};

/**
 * Optional authentication middleware
 * Sets req.user if token is valid, but doesn't reject if missing
 */
export const optionalAuth = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        req.user = null;
        return next();
    }

    try {
        const decoded = verifyToken(token);
        req.user = decoded;
    } catch (error) {
        req.user = null;
    }

    next();
};
