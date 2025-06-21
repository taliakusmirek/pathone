const EB1A_CRITERIA = [
    "1. Receipt of a less-recognized national or international award for excellence in the field of endeavor",
    "2. Membership in associations requiring outstanding achievements of their members, as judged by recognized national or international experts",
    "3. Published material in professional or major trade publications, or in other major media, relating to the alien's work",
    "4. Participation, either individually or on a panel, as a judge of others' works in the same or a related field",
    "5. Original scientific, scholarly, artistic, athletic, or business-related contributions that have had a demonstrably major significance in the alien's field",
    "6. Authorship of scholarly articles in professional or major trade publications, or in other major media, in the field",
    "7. Display of work at artistic exhibitions or showcases",
    "8. Assuming a leading or critical role in an organization or establishment with a distinguished reputation",
    "9. Commanding and holding a high salary, or significantly high remuneration for services, relative to others in the field",
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
    return `You are an AI immigration lawyer who specializes in EB-1A extraordinary ability green card applications. You're evaluating if someone fulfills the criteria for EB-1A approval.

EB-1A CRITERIA (First Tier - Must meet at least 3 of 10):
${EB1A_CRITERIA.join('\n')}

SECOND TIER REQUIREMENTS (Final Merits Determination):
- Sustained national or international acclaim in the field
- High level of expertise indicating the alien is among a small percentage at the very top of the field
- Current acclaim at the time of filing (not just past achievements)

APPLICANT INFORMATION:
Name: ${name}
Country of Origin: ${countryOfOrigin}
Achievements: ${achievementsText}

CONFIDENCE CALCULATION (Higher scoring for stronger cases):
- 95-98%: Clear evidence for 5+ criteria with exceptional achievements and sustained acclaim
- 90-94%: Strong evidence for 4+ criteria with major achievements and national/international recognition
- 85-89%: Good evidence for 3-4 criteria with solid achievements and field recognition
- 80-84%: Moderate evidence for 3 criteria with some achievements and emerging recognition
- 75-79%: Weak evidence for 2-3 criteria, borderline case but potentially viable
- Below 75%: Insufficient evidence for meaningful criteria

The output must be in this exact JSON format:
{
    "isEligible": true/false,
    "criteriaMet": [list of criteria numbers that are met],
    "reasoning": "detailed explanation of the assessment including both first and second tier analysis",
    "confidence": [number between 75-98 based on evidence strength and acclaim level]
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
            
            // Validate and adjust confidence with higher range
            let confidence = parsed.confidence || 75;
            if (typeof confidence === 'number') {
                confidence = Math.min(98, Math.max(75, confidence)); // Clamp between 75-98
            } else {
                confidence = 80; // Default confidence (higher baseline)
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
        
        // Better confidence estimation based on response content with higher baseline
        let confidence = 80; // Default moderate confidence (higher baseline)
        if (aiResponse.toLowerCase().includes('exceptional') || aiResponse.toLowerCase().includes('outstanding')) {
            confidence = 95;
        } else if (aiResponse.toLowerCase().includes('strong') || aiResponse.toLowerCase().includes('excellent')) {
            confidence = 90;
        } else if (aiResponse.toLowerCase().includes('good') || aiResponse.toLowerCase().includes('solid')) {
            confidence = 85;
        } else if (aiResponse.toLowerCase().includes('weak') || aiResponse.toLowerCase().includes('insufficient')) {
            confidence = 75;
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
    
    // Enhanced scoring logic with higher confidence and better criteria matching
    
    // Criterion 1: Awards
    if (achievements.startupAchievements?.awards?.length >= 2) {
        score += 25;
        criteriaMet.push(1);
        reasoning.push("Multiple awards indicate national/international recognition");
    } else if (achievements.startupAchievements?.awards?.length >= 1) {
        score += 20;
        criteriaMet.push(1);
        reasoning.push("Award recognition in the field");
    }
    
    // Criterion 2: Membership in prestigious associations
    if (achievements.references?.length >= 3) {
        score += 20;
        criteriaMet.push(2);
        reasoning.push("Strong professional network indicates association membership");
    }
    
    // Criterion 3: Published material/media coverage
    if (achievements.media?.length >= 3) {
        score += 25;
        criteriaMet.push(3);
        reasoning.push("Significant media coverage in professional publications");
    } else if (achievements.media?.length >= 1) {
        score += 20;
        criteriaMet.push(3);
        reasoning.push("Media coverage in professional publications");
    }
    
    // Criterion 4: Participation as judge/reviewer
    if (achievements.speakingExperience?.length >= 2) {
        score += 20;
        criteriaMet.push(4);
        reasoning.push("Speaking experience indicates leadership and judging roles");
    }
    
    // Criterion 5: Original contributions
    if (achievements.startupAchievements?.patents?.length >= 2) {
        score += 25;
        criteriaMet.push(5);
        reasoning.push("Multiple patents indicate major contributions to the field");
    } else if (achievements.startupAchievements?.patents?.length >= 1) {
        score += 20;
        criteriaMet.push(5);
        reasoning.push("Patent indicates original contribution to the field");
    }
    
    // Criterion 6: Authorship of scholarly articles
    if (achievements.publications?.length >= 3) {
        score += 25;
        criteriaMet.push(6);
        reasoning.push("Multiple publications in professional journals");
    } else if (achievements.publications?.length >= 1) {
        score += 20;
        criteriaMet.push(6);
        reasoning.push("Publication in professional journals");
    }
    
    // Criterion 7: Display of work (typically for artists)
    // This might not apply to most startup founders, but could be relevant for some
    
    // Criterion 8: Leading role in distinguished organization
    if (achievements.startupAchievements?.funding === '50m+') {
        score += 25;
        criteriaMet.push(8);
        reasoning.push("Major funding indicates leading role in distinguished organization");
    } else if (achievements.startupAchievements?.funding === '5m-50m') {
        score += 20;
        criteriaMet.push(8);
        reasoning.push("Significant funding indicates leadership role");
    }
    
    // Criterion 9: High salary/remuneration
    if (achievements.startupAchievements?.funding === '50m+') {
        score += 25;
        criteriaMet.push(9);
        reasoning.push("Major funding indicates high remuneration relative to field");
    } else if (achievements.startupAchievements?.funding === '5m-50m') {
        score += 20;
        criteriaMet.push(9);
        reasoning.push("Significant funding indicates high remuneration");
    }
    
    // Criterion 10: Commercial success
    if (achievements.startupAchievements?.traction === '100k+ users') {
        score += 25;
        criteriaMet.push(10);
        reasoning.push("Exceptional user traction indicates major commercial success");
    } else if (achievements.startupAchievements?.traction === '10k+ users') {
        score += 20;
        criteriaMet.push(10);
        reasoning.push("Strong user traction indicates commercial success");
    }
    
    // Bonus points for sustained acclaim indicators
    if (achievements.media?.length >= 5) {
        score += 10; // Bonus for sustained media attention
        reasoning.push("Sustained media attention indicates ongoing acclaim");
    }
    
    if (achievements.publications?.length >= 5) {
        score += 10; // Bonus for sustained scholarly contributions
        reasoning.push("Multiple publications indicate sustained scholarly contributions");
    }
    
    // Calculate confidence based on score with higher baseline
    let confidence = Math.min(98, Math.max(75, 75 + (score * 0.8)));
    
    // Ensure minimum confidence for eligible cases
    if (score >= 60) {
        confidence = Math.max(confidence, 80);
    }
    
    return {
        isEligible: score >= 60, // Need at least 60 points to be eligible (higher threshold)
        criteriaMet: [...new Set(criteriaMet)], // Remove duplicates
        reasoning: reasoning.join('; ') || "Basic assessment completed",
        confidence: Math.round(confidence)
    };
} 