import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { EligibilityData } from '../types';

const EligibilityForm: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<EligibilityData>>({
    user: {
      id: '',
      name: '',
      email: '',
      country: '',
      age: 0,
      educationLevel: ''
    },
    startupAchievements: {
      funding: '',
      traction: '',
      awards: [],
      patents: []
    },
    media: [],
    speakingExperience: [],
    publications: [],
    references: [],
    usContacts: []
  });

  const totalSteps = 6;

  const steps = [
    { id: 1, title: 'Basic Info', description: 'Name, country, age' },
    { id: 2, title: 'Education', description: 'Education level' },
    { id: 3, title: 'Startup Achievements', description: 'Funding, traction, awards' },
    { id: 4, title: 'Media & Press', description: 'Media coverage and press' },
    { id: 5, title: 'Speaking & Publications', description: 'Speaking experience and publications' },
    { id: 6, title: 'References', description: 'References and US contacts' }
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleUserInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      user: {
        ...prev.user!,
        [field]: value
      }
    }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Submit form and navigate to results
      navigate('/result', { state: { formData } });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                className="input-field"
                value={formData.user?.name || ''}
                onChange={(e) => handleUserInputChange('name', e.target.value)}
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                className="input-field"
                value={formData.user?.email || ''}
                onChange={(e) => handleUserInputChange('email', e.target.value)}
                placeholder="Enter your email address"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country of Origin
              </label>
              <input
                type="text"
                className="input-field"
                value={formData.user?.country || ''}
                onChange={(e) => handleUserInputChange('country', e.target.value)}
                placeholder="Enter your country of origin"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Age
              </label>
              <input
                type="number"
                className="input-field"
                value={formData.user?.age || ''}
                onChange={(e) => handleUserInputChange('age', parseInt(e.target.value))}
                placeholder="Enter your age"
                min="18"
                max="100"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Highest Education Level
              </label>
              <select
                className="input-field"
                value={formData.user?.educationLevel || ''}
                onChange={(e) => handleUserInputChange('educationLevel', e.target.value)}
              >
                <option value="">Select education level</option>
                <option value="high-school">High School</option>
                <option value="bachelors">Bachelor's Degree</option>
                <option value="masters">Master's Degree</option>
                <option value="phd">PhD</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Funding Raised (USD)
              </label>
              <select
                className="input-field"
                value={formData.startupAchievements?.funding || ''}
                onChange={(e) => handleInputChange('startupAchievements', {
                  ...formData.startupAchievements,
                  funding: e.target.value
                })}
              >
                <option value="">Select funding range</option>
                <option value="0-50k">$0 - $50K</option>
                <option value="50k-500k">$50K - $500K</option>
                <option value="500k-5m">$500K - $5M</option>
                <option value="5m-50m">$5M - $50M</option>
                <option value="50m+">$50M+</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Traction
              </label>
              <select
                className="input-field"
                value={formData.startupAchievements?.traction || ''}
                onChange={(e) => handleInputChange('startupAchievements', {
                  ...formData.startupAchievements,
                  traction: e.target.value
                })}
              >
                <option value="">Select traction level</option>
                <option value="idea-stage">Idea Stage</option>
                <option value="mvp">MVP Built</option>
                <option value="early-users">Early Users</option>
                <option value="growing">Growing User Base</option>
                <option value="scaling">Scaling</option>
                <option value="profitable">Profitable</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Awards & Recognition (comma-separated)
              </label>
              <input
                type="text"
                className="input-field"
                value={formData.startupAchievements?.awards?.join(', ') || ''}
                onChange={(e) => handleInputChange('startupAchievements', {
                  ...formData.startupAchievements,
                  awards: e.target.value.split(',').map(a => a.trim()).filter(a => a)
                })}
                placeholder="e.g., YC W24, Forbes 30 Under 30, TechCrunch Disrupt Winner"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Patents (comma-separated)
              </label>
              <input
                type="text"
                className="input-field"
                value={formData.startupAchievements?.patents?.join(', ') || ''}
                onChange={(e) => handleInputChange('startupAchievements', {
                  ...formData.startupAchievements,
                  patents: e.target.value.split(',').map(p => p.trim()).filter(p => p)
                })}
                placeholder="e.g., US Patent 1234567, International Patent 7654321"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Media Coverage & Press (comma-separated)
              </label>
              <input
                type="text"
                className="input-field"
                value={formData.media?.join(', ') || ''}
                onChange={(e) => handleInputChange('media', e.target.value.split(',').map(m => m.trim()).filter(m => m))}
                placeholder="e.g., TechCrunch, Forbes, The New York Times, Bloomberg"
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Speaking Experience (comma-separated)
              </label>
              <input
                type="text"
                className="input-field"
                value={formData.speakingExperience?.join(', ') || ''}
                onChange={(e) => handleInputChange('speakingExperience', e.target.value.split(',').map(s => s.trim()).filter(s => s))}
                placeholder="e.g., TEDx, SXSW, Web Summit, TechCrunch Disrupt"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Publications & Papers (comma-separated)
              </label>
              <input
                type="text"
                className="input-field"
                value={formData.publications?.join(', ') || ''}
                onChange={(e) => handleInputChange('publications', e.target.value.split(',').map(p => p.trim()).filter(p => p))}
                placeholder="e.g., Nature, Science, IEEE, ACM"
              />
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Potential References (comma-separated)
              </label>
              <input
                type="text"
                className="input-field"
                value={formData.references?.join(', ') || ''}
                onChange={(e) => handleInputChange('references', e.target.value.split(',').map(r => r.trim()).filter(r => r))}
                placeholder="e.g., John Doe (CEO at TechCorp), Jane Smith (Professor at Stanford)"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Existing US Contacts (optional, comma-separated)
              </label>
              <input
                type="text"
                className="input-field"
                value={formData.usContacts?.join(', ') || ''}
                onChange={(e) => handleInputChange('usContacts', e.target.value.split(',').map(c => c.trim()).filter(c => c))}
                placeholder="e.g., Immigration lawyer, US employer, US university"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Am I qualified?
          </h1>
          <p className="text-gray-600">
            Let's assess your eligibility for EB-1A or O-1 visas
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  step.id <= currentStep 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-gray-200 text-gray-400'
                }`}>
                  {step.id < currentStep ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-medium">{step.id}</span>
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-2 ${
                    step.id < currentStep ? 'bg-primary-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <span className="text-sm text-gray-600">
              Step {currentStep} of {totalSteps}: {steps[currentStep - 1].title}
            </span>
          </div>
        </div>

        {/* Form Content */}
        <div className="card">
          {renderStepContent()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className={`flex items-center px-6 py-3 rounded-lg border ${
              currentStep === 1
                ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </button>
          <button
            onClick={handleNext}
            className="btn-primary flex items-center"
          >
            {currentStep === totalSteps ? 'Submit & Check Eligibility' : 'Next'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EligibilityForm; 