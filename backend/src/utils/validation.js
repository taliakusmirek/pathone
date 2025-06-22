import { z } from "zod";

// Auth validation schemas
export const signupSchema = z.object({
    email: z.string().email("Invalid email format"),
    firstName: z
        .string()
        .min(1, "First name is required")
        .max(50, "First name must be less than 50 characters"),
    lastName: z
        .string()
        .min(1, "Last name is required")
        .max(50, "Last name must be less than 50 characters"),
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

// EB1A Assessment validation schema
export const eb1aAssessmentSchema = z.object({
    name: z.string().min(1, "Name is required"),
    countryOfOrigin: z.string().min(1, "Country of origin is required"),
    achievements: z.union([
        z.string(),
        z.array(z.string()),
        z.object({
            user: z
                .object({
                    educationLevel: z.string().optional(),
                })
                .optional(),
            startupAchievements: z
                .object({
                    funding: z.string().optional(),
                    traction: z.string().optional(),
                    awards: z.array(z.string()).optional(),
                    patents: z.array(z.string()).optional(),
                })
                .optional(),
            media: z.array(z.string()).optional(),
            speakingExperience: z.array(z.string()).optional(),
            publications: z.array(z.string()).optional(),
            references: z.array(z.string()).optional(),
            usContacts: z.array(z.string()).optional(),
        }),
    ]),
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
