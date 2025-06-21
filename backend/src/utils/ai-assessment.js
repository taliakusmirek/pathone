const EB1A_CRITERIA = [
    "1. Receipt of major internationally recognized awards",
    "2. Membership in associations requiring outstanding achievements",
    "3. Published material about the person in professional publications",
    "4. Participation as a judge of others' work",
    "5. Original scientific, scholarly, or business contributions",
    "6. Authorship of scholarly articles in professional journals",
    "7. Display of work at artistic exhibitions or showcases",
    "8. Leading/critical role in distinguished organizations",
    "9. High salary or remuneration",
    "10. Commercial success in the performing arts"
];

const HUGGING_FACE_TOKEN = process.env.HUGGING_FACE_TOKEN;
const MODEL_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3";

/**
 * Assess EB1A eligibility using Hugging Face AI model
 */
export async function assessEB1AEligibility({ name, countryOfOrigin, achievements }) {
    try {
        // Format achievements for the prompt
        const achievementsText = formatAchievements(achievements);
        
        // Create the prompt
        const prompt = createAssessmentPrompt(name, countryOfOrigin, achievementsText);
        
        // Call Hugging Face API
        const response = await fetch(MODEL_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${HUGGING_FACE_TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                inputs: prompt,
                parameters: {
                    max_new_tokens: 500,
                    temperature: 0.3,
                    top_p: 0.9,
                    do_sample: true
                }
            })
        });

        if (!response.ok) {
            throw new Error(`Hugging Face API error: ${response.status}`);
        }

        const data = await response.json();
        const aiResponse = data[0]?.generated_text || "";
        
        // Parse AI response
        const assessment = parseAIResponse(aiResponse);
        
        return assessment;
    } catch (error) {
        console.error("AI assessment error:", error);
        
        // Fallback to basic assessment if AI fails
        return fallbackAssessment(achievements);
    }
}

/**
 * Create the assessment prompt for the AI model
 */
function createAssessmentPrompt(name, countryOfOrigin, achievementsText) {
    return `You are an AI immigration lawyer who specializes in Eb1a extraordinary ability green card applications. You're primary job is to qualify if someone fulfills the criteria of the EB1a application (as listed in the 10 criterias below). You are evaluating if the applicant has the potential to successfully get their green card application approved.

EB1A CRITERIA:
${EB1A_CRITERIA.join('\n')}

The input is the person's data collection input from a form, specifically name, country of origin, and their achievements. You now take that information, match their achievements to each criteria. If they fulfill at least 3 criteria in a meaningful way, please categorize them as a viable applicant. If they do not meet at least 3 criteria in a meaningful way, they do not qualify.

APPLICANT INFORMATION:
Name: ${name}
Country of Origin: ${countryOfOrigin}
Achievements: ${achievementsText}

CONFIDENCE CALCULATION:
- 90-95%: Clear evidence for 4+ criteria with strong achievements
- 80-89%: Good evidence for 3-4 criteria with solid achievements  
- 70-79%: Moderate evidence for 3 criteria with some achievements
- 60-69%: Weak evidence for 2-3 criteria, borderline case
- Below 60%: Insufficient evidence for meaningful criteria

The output must be in this exact JSON format:
{
    "isEligible": true/false,
    "criteriaMet": [list of criteria numbers that are met],
    "reasoning": "detailed explanation of the assessment",
    "confidence": [number between 60-95 based on evidence strength]
}

Please provide only the JSON response, no additional text.`;
}

/**
 * Format achievements for the prompt
 */
function formatAchievements(achievements) {
    if (typeof achievements === 'string') {
        return achievements;
    }
    
    if (Array.isArray(achievements)) {
        return achievements.join(', ');
    }
    
    if (typeof achievements === 'object') {
        const parts = [];
        
        if (achievements.user) {
            parts.push(`Education: ${achievements.user.educationLevel || 'Not specified'}`);
        }
        
        if (achievements.startupAchievements) {
            const sa = achievements.startupAchievements;
            if (sa.funding) parts.push(`Funding: ${sa.funding}`);
            if (sa.traction) parts.push(`Traction: ${sa.traction}`);
            if (sa.awards?.length) parts.push(`Awards: ${sa.awards.join(', ')}`);
            if (sa.patents?.length) parts.push(`Patents: ${sa.patents.join(', ')}`);
        }
        
        if (achievements.media?.length) {
            parts.push(`Media Coverage: ${achievements.media.join(', ')}`);
        }
        
        if (achievements.speakingExperience?.length) {
            parts.push(`Speaking Experience: ${achievements.speakingExperience.join(', ')}`);
        }
        
        if (achievements.publications?.length) {
            parts.push(`Publications: ${achievements.publications.join(', ')}`);
        }
        
        if (achievements.references?.length) {
            parts.push(`References: ${achievements.references.join(', ')}`);
        }
        
        return parts.join('; ');
    }
    
    return String(achievements);
}

/**
 * Parse AI response to extract assessment data
 */
function parseAIResponse(aiResponse) {
    try {
        // Try to extract JSON from the response
        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            
            // Validate and adjust confidence
            let confidence = parsed.confidence || 50;
            if (typeof confidence === 'number') {
                confidence = Math.min(95, Math.max(60, confidence)); // Clamp between 60-95
            } else {
                confidence = 75; // Default confidence
            }
            
            return {
                isEligible: Boolean(parsed.isEligible),
                criteriaMet: Array.isArray(parsed.criteriaMet) ? parsed.criteriaMet : [],
                reasoning: parsed.reasoning || "AI assessment completed",
                confidence
            };
        }
        
        // Fallback parsing if JSON extraction fails
        const isEligible = aiResponse.toLowerCase().includes('eligible') || 
                          aiResponse.toLowerCase().includes('yes') ||
                          aiResponse.toLowerCase().includes('qualify');
        
        // Better confidence estimation based on response content
        let confidence = 75; // Default moderate confidence
        if (aiResponse.toLowerCase().includes('strong') || aiResponse.toLowerCase().includes('excellent')) {
            confidence = 85;
        } else if (aiResponse.toLowerCase().includes('weak') || aiResponse.toLowerCase().includes('insufficient')) {
            confidence = 65;
        }
        
        return {
            isEligible,
            criteriaMet: [],
            reasoning: aiResponse || "AI assessment completed",
            confidence
        };
    } catch (error) {
        console.error("Error parsing AI response:", error);
        return fallbackAssessment();
    }
}

/**
 * Fallback assessment when AI fails
 */
function fallbackAssessment(achievements = {}) {
    let score = 0;
    const criteriaMet = [];
    const reasoning = [];
    
    // Enhanced scoring logic with better weighting
    if (achievements.startupAchievements?.funding === '5m-50m') {
        score += 20;
        criteriaMet.push(9); // High salary/remuneration
        reasoning.push("Significant funding indicates high remuneration");
    } else if (achievements.startupAchievements?.funding === '50m+') {
        score += 25;
        criteriaMet.push(9);
        reasoning.push("Major funding indicates exceptional remuneration");
    }
    
    if (achievements.startupAchievements?.traction === '10k+ users') {
        score += 15;
        criteriaMet.push(10); // Commercial success
        reasoning.push("Strong user traction indicates commercial success");
    } else if (achievements.startupAchievements?.traction === '100k+ users') {
        score += 20;
        criteriaMet.push(10);
        reasoning.push("Exceptional user traction indicates major commercial success");
    }
    
    if (achievements.startupAchievements?.awards?.length >= 2) {
        score += 20;
        criteriaMet.push(1); // Major awards
        reasoning.push("Multiple awards indicate recognition");
    }
    
    if (achievements.media?.length >= 3) {
        score += 15;
        criteriaMet.push(3); // Published material
        reasoning.push("Media coverage indicates published material about achievements");
    }
    
    if (achievements.speakingExperience?.length >= 2) {
        score += 15;
        criteriaMet.push(4); // Participation as judge
        reasoning.push("Speaking experience indicates leadership role");
    }
    
    if (achievements.publications?.length >= 2) {
        score += 15;
        criteriaMet.push(6); // Authorship
        reasoning.push("Publications indicate scholarly contributions");
    }
    
    // Calculate confidence based on score
    let confidence = Math.min(95, Math.max(60, 60 + (score * 0.7)));
    
    return {
        isEligible: score >= 45, // Need at least 45 points to be eligible
        criteriaMet: [...new Set(criteriaMet)], // Remove duplicates
        reasoning: reasoning.join('; ') || "Basic assessment completed",
        confidence: Math.round(confidence)
    };
} 