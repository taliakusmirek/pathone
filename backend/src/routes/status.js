import { Router } from "express";
import { prisma } from "../utils/db.js";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();

/**
 * GET /status
 * Get user's application status
 */
router.get("/", authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;

        let applicationStatus = await prisma.applicationStatus.findUnique({
            where: { userId },
            include: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
            },
        });

        // Create initial status if it doesn't exist
        if (!applicationStatus) {
            applicationStatus = await prisma.applicationStatus.create({
                data: {
                    userId,
                    currentStep: "eligibility",
                },
                include: {
                    user: {
                        select: {
                            firstName: true,
                            lastName: true,
                            email: true,
                        },
                    },
                },
            });
        }

        res.json({
            success: true,
            status: applicationStatus,
        });
    } catch (error) {
        console.error("Get status error:", error);
        res.status(500).json({
            error: "Failed to retrieve application status",
            code: "STATUS_RETRIEVAL_FAILED",
        });
    }
});

/**
 * PUT /status/step
 * Update application step and mark milestones
 */
router.put("/step", authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { step, completed = true } = req.body;

        const validSteps = [
            "eligibility",
            "payment",
            "documents",
            "review",
            "uscis",
            "completed",
        ];

        if (!validSteps.includes(step)) {
            return res.status(400).json({
                error: "Invalid step",
                code: "INVALID_STEP",
            });
        }

        // Get or create application status
        let applicationStatus = await prisma.applicationStatus.findUnique({
            where: { userId },
        });

        if (!applicationStatus) {
            applicationStatus = await prisma.applicationStatus.create({
                data: {
                    userId,
                    currentStep: step,
                },
            });
        }

        // Prepare update data based on step
        const now = new Date();
        const updateData = {
            currentStep: step,
            updatedAt: now,
        };

        // Mark completed milestones with timestamps
        if (completed) {
            switch (step) {
                case "eligibility":
                    updateData.eligibilityCompleted = true;
                    updateData.eligibilityCompletedAt = now;
                    break;
                case "payment":
                    updateData.packagePurchased = true;
                    updateData.packagePurchasedAt = now;
                    break;
                case "documents":
                    updateData.documentsUploaded = true;
                    updateData.documentsUploadedAt = now;
                    break;
                case "review":
                    updateData.applicationReviewed = true;
                    updateData.applicationReviewedAt = now;
                    break;
                case "uscis":
                    updateData.uscisSubmitted = true;
                    updateData.uscisSubmittedAt = now;
                    break;
            }
        }

        // Update application status
        const updatedStatus = await prisma.applicationStatus.update({
            where: { userId },
            data: updateData,
            include: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
            },
        });

        res.json({
            success: true,
            status: updatedStatus,
            message: `Step '${step}' ${completed ? "completed" : "updated"} successfully`,
        });
    } catch (error) {
        console.error("Update status error:", error);
        res.status(500).json({
            error: "Failed to update application status",
            code: "STATUS_UPDATE_FAILED",
        });
    }
});

/**
 * GET /status/progress
 * Get detailed progress information for dashboard
 */
router.get("/progress", authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;

        const applicationStatus = await prisma.applicationStatus.findUnique({
            where: { userId },
        });

        if (!applicationStatus) {
            // Return default progress if no status exists
            return res.json({
                success: true,
                progress: {
                    currentStep: "eligibility",
                    completionPercentage: 0,
                    stepsCompleted: 0,
                    totalSteps: 5,
                    milestones: [],
                },
            });
        }

        // Calculate progress
        const milestones = [
            {
                step: "eligibility",
                title: "Eligibility Assessment",
                description: "Complete EB-1A eligibility form",
                completed: applicationStatus.eligibilityCompleted,
                completedAt: applicationStatus.eligibilityCompletedAt,
                status: applicationStatus.eligibilityCompleted
                    ? "completed"
                    : applicationStatus.currentStep === "eligibility"
                      ? "in-progress"
                      : "pending",
            },
            {
                step: "payment",
                title: "Package Purchase",
                description: "Purchase application package",
                completed: applicationStatus.packagePurchased,
                completedAt: applicationStatus.packagePurchasedAt,
                status: applicationStatus.packagePurchased
                    ? "completed"
                    : applicationStatus.currentStep === "payment"
                      ? "in-progress"
                      : "pending",
            },
            {
                step: "documents",
                title: "Document Upload",
                description: "Upload supporting documents",
                completed: applicationStatus.documentsUploaded,
                completedAt: applicationStatus.documentsUploadedAt,
                status: applicationStatus.documentsUploaded
                    ? "completed"
                    : applicationStatus.currentStep === "documents"
                      ? "in-progress"
                      : "pending",
            },
            {
                step: "review",
                title: "Application Review",
                description: "Legal review and preparation",
                completed: applicationStatus.applicationReviewed,
                completedAt: applicationStatus.applicationReviewedAt,
                status: applicationStatus.applicationReviewed
                    ? "completed"
                    : applicationStatus.currentStep === "review"
                      ? "in-progress"
                      : "pending",
                dueDate:
                    applicationStatus.currentStep === "review"
                        ? "2024-02-14"
                        : null,
            },
            {
                step: "uscis",
                title: "USCIS Filing",
                description: "Submit to USCIS",
                completed: applicationStatus.uscisSubmitted,
                completedAt: applicationStatus.uscisSubmittedAt,
                status: applicationStatus.uscisSubmitted
                    ? "completed"
                    : applicationStatus.currentStep === "uscis"
                      ? "in-progress"
                      : "pending",
                dueDate:
                    applicationStatus.currentStep === "uscis"
                        ? "2024-02-29"
                        : null,
            },
        ];

        const stepsCompleted = milestones.filter((m) => m.completed).length;
        const completionPercentage = Math.round(
            (stepsCompleted / milestones.length) * 100
        );

        res.json({
            success: true,
            progress: {
                currentStep: applicationStatus.currentStep,
                completionPercentage,
                stepsCompleted,
                totalSteps: milestones.length,
                milestones,
            },
        });
    } catch (error) {
        console.error("Get progress error:", error);
        res.status(500).json({
            error: "Failed to retrieve progress information",
            code: "PROGRESS_RETRIEVAL_FAILED",
        });
    }
});

export default router;
