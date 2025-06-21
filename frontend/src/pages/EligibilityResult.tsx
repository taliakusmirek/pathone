import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, AlertTriangle, ArrowRight, Download, Users, Award, FileText } from 'lucide-react';
import { EligibilityData } from '../types';

type EligibilityResultType = {
  status: 'likely-eligible' | 'borderline' | 'not-likely-eligible';
  confidence: number;
  visaType: 'EB-1A' | 'O-1' | 'both' | 'none';
  reasoning: string[];
  nextSteps: string[];
  criteriaMet: number[];
};

type AIAssessment = {
  isEligible: boolean;
  criteriaMet: number[];
  reasoning: string;
  confidence: number;
  assessmentId?: number;
};

const EligibilityResult: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [result, setResult] = useState<EligibilityResultType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const processAssessment = async () => {
      setLoading(true);
      
      const formData = location.state?.formData as EligibilityData;
      const aiAssessment = location.state?.aiAssessment as AIAssessment;
      
      if (aiAssessment) {
        // Use AI assessment results
        const processedResult = processAIAssessment(aiAssessment, formData);
        setResult(processedResult);
      } else {
        // Fallback to mock assessment
        await new Promise(resolve => setTimeout(resolve, 2000));
        const mockResult = generateMockResult(formData);
        setResult(mockResult);
      }
      
      setLoading(false);
    };

    processAssessment();
  }, [location.state]);

  const processAIAssessment = (aiAssessment: AIAssessment, formData: EligibilityData): EligibilityResultType => {
    const status = aiAssessment.isEligible ? 'likely-eligible' : 'not-likely-eligible';
    const visaType = aiAssessment.isEligible ? 'EB-1A' : 'none';
    
    // Convert AI reasoning to array format
    const reasoning = aiAssessment.reasoning.split(';').map(r => r.trim()).filter(r => r);
    
    // Generate next steps based on eligibility
    const nextSteps = aiAssessment.isEligible ? [
      'Proceed with full EB-1A application package',
      'Upload supporting documents',
      'Connect with immigration lawyer for review',
      'Prepare evidence for criteria met'
    ] : [
      'Focus on building stronger credentials',
      'Consider alternative visa categories',
      'Work with immigration consultant for guidance',
      'Strengthen your profile with additional achievements'
    ];

    return {
      status,
      confidence: aiAssessment.confidence,
      visaType,
      reasoning,
      nextSteps,
      criteriaMet: aiAssessment.criteriaMet
    };
  };

  const generateMockResult = (formData: EligibilityData): EligibilityResultType => {
    // Simple scoring algorithm
    let score = 0;
    const reasoning: string[] = [];
    const nextSteps: string[] = [];

    // Basic scoring
    if (formData.user?.educationLevel === 'phd') score += 20;
    if (formData.user?.educationLevel === 'masters') score += 15;
    if (formData.user?.educationLevel === 'bachelors') score += 10;

    if (formData.startupAchievements?.funding === '5m-50m') score += 25;
    if (formData.startupAchievements?.funding === '50m+') score += 30;
    if (formData.startupAchievements?.funding === '500k-5m') score += 20;

    if (formData.startupAchievements?.awards?.length > 0) {
      score += formData.startupAchievements.awards.length * 5;
      reasoning.push(`Strong recognition with ${formData.startupAchievements.awards.length} awards`);
    }

    if (formData.media?.length > 0) {
      score += formData.media.length * 3;
      reasoning.push(`Media coverage in ${formData.media.length} outlets`);
    }

    if (formData.speakingExperience?.length > 0) {
      score += formData.speakingExperience.length * 4;
      reasoning.push(`Speaking experience at ${formData.speakingExperience.length} events`);
    }

    if (formData.publications?.length > 0) {
      score += formData.publications.length * 5;
      reasoning.push(`Published in ${formData.publications.length} publications`);
    }

    if (formData.startupAchievements?.patents?.length > 0) {
      score += formData.startupAchievements.patents.length * 8;
      reasoning.push(`Intellectual property with ${formData.startupAchievements.patents.length} patents`);
    }

    // Determine status
    let status: EligibilityResultType['status'];
    let confidence: number;
    let visaType: EligibilityResultType['visaType'];

    if (score >= 70) {
      status = 'likely-eligible';
      confidence = Math.min(95, 70 + Math.random() * 20);
      visaType = score >= 80 ? 'both' : 'EB-1A';
      nextSteps.push('Proceed with full application package');
      nextSteps.push('Upload supporting documents');
      nextSteps.push('Connect with immigration lawyer for review');
    } else if (score >= 40) {
      status = 'borderline';
      confidence = 50 + Math.random() * 20;
      visaType = 'EB-1A';
      nextSteps.push('Strengthen your profile with additional achievements');
      nextSteps.push('Consider O-1 visa as alternative');
      nextSteps.push('Get expert consultation for strategy');
    } else {
      status = 'not-likely-eligible';
      confidence = 30 + Math.random() * 20;
      visaType = 'none';
      nextSteps.push('Focus on building stronger credentials');
      nextSteps.push('Consider alternative visa categories');
      nextSteps.push('Work with immigration consultant for guidance');
    }

    return {
      status,
      confidence: Math.round(confidence),
      visaType,
      reasoning,
      nextSteps,
      criteriaMet: []
    };
  };

  const getStatusIcon = () => {
    if (!result) return null;
    
    switch (result.status) {
      case 'likely-eligible':
        return <CheckCircle className="w-12 h-12 text-success-600" />;
      case 'borderline':
        return <AlertTriangle className="w-12 h-12 text-warning-600" />;
      case 'not-likely-eligible':
        return <XCircle className="w-12 h-12 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = () => {
    if (!result) return '';
    
    switch (result.status) {
      case 'likely-eligible':
        return 'text-success-600';
      case 'borderline':
        return 'text-warning-600';
      case 'not-likely-eligible':
        return 'text-red-600';
      default:
        return '';
    }
  };

  const getStatusText = () => {
    if (!result) return '';
    
    switch (result.status) {
      case 'likely-eligible':
        return 'Likely Eligible';
      case 'borderline':
        return 'Borderline';
      case 'not-likely-eligible':
        return 'Not Likely Eligible';
      default:
        return '';
    }
  };

  const handleUnlockPackage = () => {
    navigate('/paywall');
  };

  const getCriteriaText = (criteriaNumber: number): string => {
    const criteriaMap: Record<number, string> = {
      1: "Receipt of nationally or internationally recognized prizes or awards for excellence",
      2: "Membership in associations that require outstanding achievements",
      3: "Published material about the individual in professional or major trade publications",
      4: "Participation as a judge of others' work",
      5: "Original contributions of major significance",
      6: "Authorship of scholarly articles",
      7: "Artistic exhibitions or showcases",
      8: "Leading/critical role in distinguished organizations",
      9: "High salary or remuneration",
      10: "Commercial success in the performing arts"
    };
    return criteriaMap[criteriaNumber] || `Criteria ${criteriaNumber}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Analyzing your profile...
          </h2>
          <p className="text-gray-600">
            Our AI is assessing your eligibility for EB-1A and O-1 visas
          </p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            No data found
          </h2>
          <button 
            onClick={() => navigate('/dashboard')}
            className="btn-primary"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Your Eligibility Assessment
          </h1>
          <p className="text-lg text-gray-600">
            Based on your profile, here's what we found
          </p>
        </div>

        {/* Result Card */}
        <div className="card mb-8">
          <div className="flex flex-col items-center justify-center text-center mb-6">
            <div className="flex items-center justify-center mb-4">
              {getStatusIcon()}
            </div>
            <h2 className={`text-2xl font-bold ${getStatusColor()}`}>
              {getStatusText()}
            </h2>
            <p className="text-gray-600 mt-2">
              {result.confidence}% confidence level
            </p>
          </div>

          {/* Visa Type */}
          {result.visaType !== 'none' && (
            <div className="bg-primary-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-primary-900 mb-2">
                Recommended Visa Type
              </h3>
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-primary-600" />
                <span className="text-primary-800 font-medium">
                  {result.visaType === 'both' ? 'EB-1A and O-1' : result.visaType}
                </span>
              </div>
            </div>
          )}

          {/* Reasoning */}
          {result.reasoning.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">
                Key Strengths
              </h3>
              <ul className="space-y-2">
                {result.reasoning.map((reason, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* EB1A Criteria Met */}
          {result.criteriaMet && result.criteriaMet.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">
                EB1A Criteria Met ({result.criteriaMet.length}/10)
              </h3>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <ul className="space-y-2">
                  {result.criteriaMet.map((criteriaNumber) => (
                    <li key={criteriaNumber} className="flex items-start">
                      <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 text-sm font-medium">
                        {criteriaNumber}
                      </div>
                      <span className="text-green-800">{getCriteriaText(criteriaNumber)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Next Steps */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">
              Next Steps
            </h3>
            <ul className="space-y-2">
              {result.nextSteps.map((step, index) => (
                <li key={index} className="flex items-start">
                  <div className="w-5 h-5 bg-primary-100 rounded-full flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                    <span className="text-primary-600 text-xs font-medium">{index + 1}</span>
                  </div>
                  <span className="text-gray-700">{step}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {(result.status === 'likely-eligible' || result.status === 'borderline') && (
            <button
              onClick={handleUnlockPackage}
              className="btn-primary flex items-center justify-center"
            >
              <Download className="w-5 h-5 mr-2" />
              Unlock Full Package
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          )}
          
          <button
            onClick={() => navigate('/second-opinion')}
            className="btn-secondary flex items-center justify-center"
          >
            <Users className="w-5 h-5 mr-2" />
            Get Lawyer Review
          </button>
          
          <button
            onClick={() => navigate('/dashboard')}
            className="btn-secondary flex items-center justify-center"
          >
            Back to Dashboard
          </button>
        </div>

        {/* Additional Info */}
        {(result.status === 'likely-eligible' || result.status === 'borderline') && (
          <div className="mt-8 card bg-primary-50 border-primary-200">
            <h3 className="font-semibold text-primary-900 mb-3">
              What's included in the full package?
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start">
                <FileText className="w-5 h-5 text-primary-600 mr-2 mt-0.5" />
                <div>
                  <h4 className="font-medium text-primary-900">AI-Prefilled Forms</h4>
                  <p className="text-sm text-primary-700">Complete I-140 or I-129 petition drafts</p>
                </div>
              </div>
              <div className="flex items-start">
                <Award className="w-5 h-5 text-primary-600 mr-2 mt-0.5" />
                <div>
                  <h4 className="font-medium text-primary-900">Legal Packet</h4>
                  <p className="text-sm text-primary-700">Custom PDF with all required documents</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-primary-600 mr-2 mt-0.5" />
                <div>
                  <h4 className="font-medium text-primary-900">Evidence Checklist</h4>
                  <p className="text-sm text-primary-700">Complete checklist and templates</p>
                </div>
              </div>
              <div className="flex items-start">
                <Users className="w-5 h-5 text-primary-600 mr-2 mt-0.5" />
                <div>
                  <h4 className="font-medium text-primary-900">Support Community</h4>
                  <p className="text-sm text-primary-700">Access to Slack/WhatsApp group</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EligibilityResult; 