import { Router } from "express";
import { prisma } from "../utils/db.js";
import { validateRequest, eb1aAssessmentSchema } from "../utils/validation.js";
import { assessEB1AEligibility } from "../utils/ai-assessment.js";

const router = Router();

/**
 * POST /eb1a/assess
 * Assess EB1A eligibility using AI
 */
router.post("/assess", validateRequest(eb1aAssessmentSchema), async (req, res) => {
    try {
        const { name, countryOfOrigin, achievements } = req.validatedData;

        // Call AI assessment
        const assessment = await assessEB1AEligibility({
            name,
            countryOfOrigin,
            achievements
        });

        // Store assessment result in database
        const assessmentRecord = await prisma.eb1aAssessment.create({
            data: {
                name,
                countryOfOrigin,
                achievements: JSON.stringify(achievements),
                isEligible: assessment.isEligible,
                criteriaMet: assessment.criteriaMet,
                reasoning: assessment.reasoning,
                confidence: assessment.confidence
            }
        });

        res.json({
            success: true,
            assessment: {
                isEligible: assessment.isEligible,
                criteriaMet: assessment.criteriaMet,
                reasoning: assessment.reasoning,
                confidence: assessment.confidence,
                assessmentId: assessmentRecord.id
            }
        });
    } catch (error) {
        console.error("EB1A assessment error:", error);
        res.status(500).json({
            error: "Failed to assess EB1A eligibility",
            code: "ASSESSMENT_FAILED"
        });
    }
});

/**
 * GET /eb1a/assessment/:id
 * Get assessment result by ID
 */
router.get("/assessment/:id", async (req, res) => {
    try {
        const { id } = req.params;
        
        const assessment = await prisma.eb1aAssessment.findUnique({
            where: { id: parseInt(id) }
        });

        if (!assessment) {
            return res.status(404).json({
                error: "Assessment not found",
                code: "ASSESSMENT_NOT_FOUND"
            });
        }

        res.json({
            success: true,
            assessment: {
                id: assessment.id,
                name: assessment.name,
                countryOfOrigin: assessment.countryOfOrigin,
                achievements: JSON.parse(assessment.achievements),
                isEligible: assessment.isEligible,
                criteriaMet: assessment.criteriaMet,
                reasoning: assessment.reasoning,
                confidence: assessment.confidence,
                createdAt: assessment.createdAt
            }
        });
    } catch (error) {
        console.error("Get assessment error:", error);
        res.status(500).json({
            error: "Failed to retrieve assessment",
            code: "RETRIEVAL_FAILED"
        });
    }
});

export default router; 