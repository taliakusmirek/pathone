import { z } from "zod";

// Auth validation schemas
export const signupSchema = z.object({
    email: z.string().email("Invalid email format"),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
            "Password must contain at least one lowercase letter, one uppercase letter, and one number"
        ),
});

export const loginSchema = z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(1, "Password is required"),
});

export const refreshTokenSchema = z.object({
    refreshToken: z.string().min(1, "Refresh token is required"),
});

/**
 * Validation middleware factory
 * @param {z.ZodSchema} schema - Zod validation schema
 * @returns {Function} Express middleware function
 */
export const validateRequest = (schema) => {
    return (req, res, next) => {
        try {
            const validated = schema.parse(req.body);
            req.validatedData = validated;
            next();
        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({
                    error: "Validation failed",
                    details: error.errors.map((err) => ({
                        field: err.path.join("."),
                        message: err.message,
                    })),
                });
            }
            return res.status(500).json({ error: "Validation error" });
        }
    };
};
