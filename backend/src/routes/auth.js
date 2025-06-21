import { Router } from "express";
import { prisma } from "../utils/db.js";
import {
    hashPassword,
    comparePassword,
    generateToken,
    generateRefreshToken,
    verifyToken,
} from "../utils/auth.js";
import {
    validateRequest,
    signupSchema,
    loginSchema,
    refreshTokenSchema,
} from "../utils/validation.js";

const router = Router();

/**
 * POST /auth/signup
 * Register a new user
 */
router.post("/signup", validateRequest(signupSchema), async (req, res) => {
    try {
        const { email, password } = req.validatedData;

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return res.status(409).json({
                error: "User already exists",
                code: "USER_EXISTS",
            });
        }

        // Hash password
        const passHash = await hashPassword(password);

        // Create user
        const user = await prisma.user.create({
            data: {
                email,
                passHash,
            },
            select: {
                id: true,
                email: true,
                createdAt: true,
            },
        });

        // Generate tokens
        const tokenPayload = {
            userId: user.id,
            email: user.email,
        };
        const accessToken = generateToken(tokenPayload);
        const refreshToken = generateRefreshToken(tokenPayload);

        res.status(201).json({
            message: "User created successfully",
            user,
            tokens: {
                accessToken,
                refreshToken,
                expiresIn: process.env.JWT_EXPIRES_IN || "24h",
            },
        });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({
            error: "Internal server error",
            code: "SIGNUP_FAILED",
        });
    }
});

/**
 * POST /auth/login
 * Authenticate user and return tokens
 */
router.post("/login", validateRequest(loginSchema), async (req, res) => {
    try {
        const { email, password } = req.validatedData;

        // Find user
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return res.status(401).json({
                error: "Invalid credentials",
                code: "INVALID_CREDENTIALS",
            });
        }

        // Verify password
        const isValidPassword = await comparePassword(password, user.passHash);
        if (!isValidPassword) {
            return res.status(401).json({
                error: "Invalid credentials",
                code: "INVALID_CREDENTIALS",
            });
        }

        // Generate tokens
        const tokenPayload = {
            userId: user.id,
            email: user.email,
        };
        const accessToken = generateToken(tokenPayload);
        const refreshToken = generateRefreshToken(tokenPayload);

        res.json({
            message: "Login successful",
            user: {
                id: user.id,
                email: user.email,
                createdAt: user.createdAt,
            },
            tokens: {
                accessToken,
                refreshToken,
                expiresIn: process.env.JWT_EXPIRES_IN || "24h",
            },
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            error: "Internal server error",
            code: "LOGIN_FAILED",
        });
    }
});

/**
 * POST /auth/refresh
 * Refresh access token using refresh token
 */
router.post(
    "/refresh",
    validateRequest(refreshTokenSchema),
    async (req, res) => {
        try {
            const { refreshToken } = req.validatedData;

            // Verify refresh token
            const decoded = verifyToken(refreshToken);

            // Check if user still exists
            const user = await prisma.user.findUnique({
                where: { id: decoded.userId },
            });

            if (!user) {
                return res.status(401).json({
                    error: "User not found",
                    code: "USER_NOT_FOUND",
                });
            }

            // Generate new tokens
            const tokenPayload = {
                userId: user.id,
                email: user.email,
            };
            const newAccessToken = generateToken(tokenPayload);
            const newRefreshToken = generateRefreshToken(tokenPayload);

            res.json({
                message: "Tokens refreshed successfully",
                tokens: {
                    accessToken: newAccessToken,
                    refreshToken: newRefreshToken,
                    expiresIn: process.env.JWT_EXPIRES_IN || "24h",
                },
            });
        } catch (error) {
            if (
                error.name === "TokenExpiredError" ||
                error.name === "JsonWebTokenError"
            ) {
                return res.status(401).json({
                    error: "Invalid refresh token",
                    code: "INVALID_REFRESH_TOKEN",
                });
            }

            console.error("Refresh token error:", error);
            res.status(500).json({
                error: "Internal server error",
                code: "REFRESH_FAILED",
            });
        }
    }
);

/**
 * GET /auth/me
 * Get current user info (protected route)
 */
router.get("/me", async (req, res) => {
    // This will be used with authenticateToken middleware
    res.json({
        message: "User info endpoint - implement with auth middleware",
    });
});

export default router;
