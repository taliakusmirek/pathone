import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Rocket, ChevronRight, ChevronLeft, AlertCircle, Upload, X } from 'lucide-react';

interface FormData {
  // Part 1: Background Information
  salutation: string;
  firstName: string;
  lastName: string;
  countryOfBirth: string;
  petitionCategories: string[];
  currentVisaStatus: string;
  fieldOfStudy: string;
  otherFieldOfStudy: string;
  
  // Academic Degrees
  degrees: Array<{
    type: string;
    major: string;
    university: string;
    yearAwarded: string;
    relatedToEndeavor: string;
  }>;
  
  currentDegree: {
    type: string;
    major: string;
    university: string;
    expectedGraduation: string;
    relatedToEndeavor: string;
  };
  
  // Employment
  currentlyEmployed: string;
  highestPosition: string;
  
  // Achievements
  awards: string;
  professionalMemberships: string;
  publishedMaterials: string;
  citationProfileLink: string;
  numberOfCitations: string;
  totalPublications: string;
  mostRecentArticleYear: string;
  noPublications: boolean;
  papersReviewed: string;
  reviewEvidenceConfirmed: boolean;
  patents: string;
  funding: string;
  
  // Future Plans
  continueResearch: string;
  expectedPublicationDate: string;
  workAligned: string;
  
  // Documents
  resume: File | null;
  supportingDocuments: File[];
  publications: File[];
  awardsCertificates: File[];
  patentsDocuments: File[];
  fundingDocuments: File[];
  reviewEvidence: File[];
}

const EB1AForm: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    salutation: '',
    firstName: '',
    lastName: '',
    countryOfBirth: '',
    petitionCategories: [],
    currentVisaStatus: '',
    fieldOfStudy: '',
    otherFieldOfStudy: '',
    degrees: [{
      type: '',
      major: '',
      university: '',
      yearAwarded: '',
      relatedToEndeavor: ''
    }],
    currentDegree: {
      type: '',
      major: '',
      university: '',
      expectedGraduation: '',
      relatedToEndeavor: ''
    },
    currentlyEmployed: '',
    highestPosition: '',
    awards: '',
    professionalMemberships: '',
    publishedMaterials: '',
    citationProfileLink: '',
    numberOfCitations: '',
    totalPublications: '',
    mostRecentArticleYear: '',
    noPublications: false,
    papersReviewed: '',
    reviewEvidenceConfirmed: false,
    patents: '',
    funding: '',
    continueResearch: '',
    expectedPublicationDate: '',
    workAligned: '',
    resume: null,
    supportingDocuments: [],
    publications: [],
    awardsCertificates: [],
    patentsDocuments: [],
    fundingDocuments: [],
    reviewEvidence: []
  });

  const totalSteps = 4;

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDegreeChange = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      degrees: prev.degrees.map((degree, i) => 
        i === index ? { ...degree, [field]: value } : degree
      )
    }));
  };

  const addDegree = () => {
    setFormData(prev => ({
      ...prev,
      degrees: [...prev.degrees, {
        type: '',
        major: '',
        university: '',
        yearAwarded: '',
        relatedToEndeavor: ''
      }]
    }));
  };

  const removeDegree = (index: number) => {
    setFormData(prev => ({
      ...prev,
      degrees: prev.degrees.filter((_, i) => i !== index)
    }));
  };

  const handleCurrentDegreeChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      currentDegree: {
        ...prev.currentDegree,
        [field]: value
      }
    }));
  };

  const handleFileUpload = (field: keyof FormData, file: File | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: file
    }));
  };

  const handleMultipleFileUpload = (field: keyof FormData, files: File[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: files
    }));
  };

  const removeFile = (field: keyof FormData, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: Array.isArray(prev[field]) ? (prev[field] as File[]).filter((_, i) => i !== index) : prev[field]
    }));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    // Handle form submission
    console.log('Form submitted:', formData);
    navigate('/eligibility-result');
  };

  const fieldOfStudyOptions = [
    // Engineering & Technology
    'Aerospace Engineering', 'Biomedical Engineering', 'Chemical Engineering', 'Civil Engineering', 
    'Computer Engineering', 'Electrical Engineering', 'Environmental Engineering', 'Industrial Engineering', 
    'Materials Engineering', 'Mechanical Engineering', 'Software Engineering',
    
    // Computer Science & IT
    'Computer Science', 'Information Technology', 'Data Science', 'Cybersecurity', 
    'Artificial Intelligence', 'Bioinformatics',
    
    // Physical Sciences
    'Physics', 'Chemistry', 'Materials Science', 'Mathematics', 'Statistics', 'Astrophysics',
    
    // Life Sciences
    'Biology', 'Biochemistry', 'Biotechnology', 'Genetics', 'Microbiology', 'Neuroscience',
    
    // Medical & Health Sciences
    'Medicine', 'Dentistry', 'Pharmacy', 'Nursing', 'Public Health', 'Veterinary Medicine',
    
    // Business & Economics
    'Business Administration', 'Economics', 'Finance', 'Accounting', 'Marketing', 'Management',
    
    // Social Sciences
    'Psychology', 'Sociology', 'Political Science', 'International Relations', 'Anthropology', 'Geography',
    
    // Earth & Environmental Sciences
    'Geology', 'Environmental Science', 'Meteorology', 'Oceanography',
    
    // Agriculture & Food
    'Agriculture', 'Food Science', 'Forestry',
    
    // Arts & Humanities
    'Architecture', 'Art and Design', 'Music', 'Literature', 'History', 'Philosophy',
    
    // Education & Communication
    'Education', 'Law', 'Communications', 'Journalism',
    
    'Other'
  ];

  const renderStep1 = () => (
    <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Part 1: Background Information</h2>
        <p className="text-gray-600">Let's start with your basic information and preferred petition category.</p>
      </div>

      {/* Name and Salutation */}
      <div className="card mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">1. Name and Salutation</h3>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Salutation</label>
            <select 
              value={formData.salutation}
              onChange={(e) => handleInputChange('salutation', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Select...</option>
              <option value="Mr.">Mr.</option>
              <option value="Ms.">Ms.</option>
              <option value="Dr.">Dr.</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter your first name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter your last name"
            />
          </div>
        </div>
      </div>

      {/* Country of Birth */}
      <div className="card mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">2. Country of Birth</h3>
        <input
          type="text"
          value={formData.countryOfBirth}
          onChange={(e) => handleInputChange('countryOfBirth', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="As shown on your birth certificate or passport"
        />
      </div>

      {/* Petition Category */}
      <div className="card mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">3. Petition Category</h3>
        <p className="text-sm text-gray-600 mb-4">Please select the type(s) of petition you are considering:</p>
        <div className="space-y-3">
          {[
            { text: 'EB-2 NIW (National Interest Waiver – self-petitioned)', disabled: true },
            { text: 'EB-1A (Alien of Extraordinary Ability – self-petitioned)', disabled: false },
            { text: 'EB-1B (Outstanding Researcher/Professor – employer-sponsored)', disabled: true },
            { text: 'O-1A (Extraordinary Ability – employer-sponsored)', disabled: true },
            { text: 'I\'m not sure. Please recommend based on my credentials.', disabled: true }
          ].map((category) => (
            <label key={category.text} className={`flex items-center space-x-3 ${category.disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer group'}`}>
              <input
                type="checkbox"
                checked={formData.petitionCategories.includes(category.text)}
                onChange={(e) => {
                  if (!category.disabled && e.target.checked) {
                    handleInputChange('petitionCategories', [...formData.petitionCategories, category.text]);
                  } else if (!category.disabled) {
                    handleInputChange('petitionCategories', formData.petitionCategories.filter(c => c !== category.text));
                  }
                }}
                disabled={category.disabled}
                className={`w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500 ${category.disabled ? 'cursor-not-allowed' : ''}`}
              />
              <span className={`text-gray-700 ${!category.disabled ? 'group-hover:text-primary-600 transition-colors' : ''}`}>{category.text}</span>
            </label>
          ))}
        </div>
        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> This form is specifically designed for EB-1A (Alien of Extraordinary Ability) applications. 
            Other petition types will be available in future updates.
          </p>
        </div>
      </div>

      {/* Current Visa Status */}
      <div className="card mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">4. Current Visa Status</h3>
        <select 
          value={formData.currentVisaStatus}
          onChange={(e) => handleInputChange('currentVisaStatus', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="">Select your current visa status...</option>
          <option value="F-1">F-1</option>
          <option value="OPT">OPT</option>
          <option value="H-1B">H-1B</option>
          <option value="J-1">J-1</option>
          <option value="O-1">O-1</option>
          <option value="Not in the U.S.">Not in the U.S.</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* Field of Study */}
      <div className="card mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">5. Field of Study</h3>
        <select 
          value={formData.fieldOfStudy}
          onChange={(e) => handleInputChange('fieldOfStudy', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent mb-4"
        >
          <option value="">Select your field of study...</option>
          {fieldOfStudyOptions.map((field) => (
            <option key={field} value={field}>{field}</option>
          ))}
        </select>
        {formData.fieldOfStudy === 'Other' && (
          <input
            type="text"
            value={formData.otherFieldOfStudy}
            onChange={(e) => handleInputChange('otherFieldOfStudy', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Please specify your field of study"
          />
        )}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Part 2: Academic Background & Achievements</h2>
        <p className="text-gray-600">Tell us about your education and professional achievements.</p>
      </div>

      {/* Academic Degrees */}
      <div className="card mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">6. Academic Degrees</h3>
        <p className="text-sm text-gray-600 mb-4">Please list all degrees you have earned:</p>
        
        {formData.degrees.map((degree, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-medium text-gray-900">Degree {index + 1}</h4>
              {formData.degrees.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeDegree(index)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              )}
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select 
                  value={degree.type}
                  onChange={(e) => handleDegreeChange(index, 'type', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Select degree type...</option>
                  <option value="Bachelor's Degree">Bachelor's Degree</option>
                  <option value="Master's Degree">Master's Degree</option>
                  <option value="PhD/Doctorate">PhD/Doctorate</option>
                  <option value="Professional Degree (JD, MD, etc.)">Professional Degree (JD, MD, etc.)</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Major</label>
                <input
                  type="text"
                  value={degree.major}
                  onChange={(e) => handleDegreeChange(index, 'major', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., Electrical Engineering"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">University Name</label>
                <input
                  type="text"
                  value={degree.university}
                  onChange={(e) => handleDegreeChange(index, 'university', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., Stanford University"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Year Awarded</label>
                <input
                  type="text"
                  value={degree.yearAwarded}
                  onChange={(e) => handleDegreeChange(index, 'yearAwarded', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="YYYY"
                />
              </div>
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Is this degree related to your proposed endeavor or future work in the U.S.?
              </label>
              <select 
                value={degree.relatedToEndeavor}
                onChange={(e) => handleDegreeChange(index, 'relatedToEndeavor', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select...</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
                <option value="Not Sure">Not Sure</option>
              </select>
            </div>
          </div>
        ))}
        
        <button
          type="button"
          onClick={addDegree}
          className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-primary-500 hover:text-primary-600 transition-colors"
        >
          + Add Another Degree
        </button>
      </div>

      {/* Current Degree */}
      <div className="card mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Currently Enrolled Degree Program</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <select 
              value={formData.currentDegree.type}
              onChange={(e) => handleCurrentDegreeChange('type', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Select degree type...</option>
              <option value="Master's Degree">Master's Degree</option>
              <option value="PhD/Doctorate">PhD/Doctorate</option>
              <option value="Professional Degree (JD, MD, etc.)">Professional Degree (JD, MD, etc.)</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Major</label>
            <input
              type="text"
              value={formData.currentDegree.major}
              onChange={(e) => handleCurrentDegreeChange('major', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="e.g., Electrical Engineering"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">University Name</label>
            <input
              type="text"
              value={formData.currentDegree.university}
              onChange={(e) => handleCurrentDegreeChange('university', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="e.g., Stanford University"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Expected Graduation Date</label>
            <input
              type="text"
              value={formData.currentDegree.expectedGraduation}
              onChange={(e) => handleCurrentDegreeChange('expectedGraduation', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="MM/YYYY"
            />
          </div>
        </div>
        
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Is this degree related to your proposed endeavor or future work in the U.S.?
          </label>
          <select 
            value={formData.currentDegree.relatedToEndeavor}
            onChange={(e) => handleCurrentDegreeChange('relatedToEndeavor', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Select...</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
            <option value="Not Sure">Not Sure</option>
          </select>
        </div>
      </div>

      {/* Employment */}
      <div className="card mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">7. Employment Information</h3>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Are you currently employed?</label>
          <select 
            value={formData.currentlyEmployed}
            onChange={(e) => handleInputChange('currentlyEmployed', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Select...</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Highest Position Ever Held
          </label>
          <textarea
            value={formData.highestPosition}
            onChange={(e) => handleInputChange('highestPosition', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            rows={3}
            placeholder="What is the highest position you have ever held and at which company/organization? Please include job title and organization name."
          />
        </div>
      </div>

      {/* Awards and Recognition */}
      <div className="card mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">8. Awards and Recognition</h3>
        <textarea
          value={formData.awards}
          onChange={(e) => handleInputChange('awards', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          rows={4}
          placeholder="Have you won any nationally or internationally recognized prizes or awards for excellence in your field? If yes, please list the awards, including the name of the award, granting organization, year received, and significance. If no, enter 'None'."
        />
      </div>

      {/* Professional Memberships */}
      <div className="card mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">9. Professional Memberships</h3>
        <textarea
          value={formData.professionalMemberships}
          onChange={(e) => handleInputChange('professionalMemberships', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          rows={4}
          placeholder="Are you a member of any professional associations that require outstanding achievement as a condition of membership in your field? If yes, please list the organizations and explain the membership requirements. If no, enter 'None'."
        />
      </div>

      {/* Published Materials */}
      <div className="card mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">10. Published Materials About Your Work</h3>
        <textarea
          value={formData.publishedMaterials}
          onChange={(e) => handleInputChange('publishedMaterials', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          rows={4}
          placeholder="Has there been any published material about you or your work in professional journals, trade publications, or major media? If yes, please list each publication including: (1) Title of article, (2) Date of publication, (3) Author name, (4) Publication name. If no, enter 'None'."
        />
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Part 3: Research & Publications</h2>
        <p className="text-gray-600">Tell us about your research contributions and impact.</p>
      </div>

      {/* Citation Profile */}
      <div className="card mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">11. Citation Profile Link</h3>
        <input
          type="url"
          value={formData.citationProfileLink}
          onChange={(e) => handleInputChange('citationProfileLink', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="Please provide a link to your Google Scholar, ResearchGate, Impactio, or other citation database profile"
        />
        <p className="text-sm text-gray-600 mt-2">The citation database profile link is required.</p>
      </div>

      {/* Citations and Publications */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">12. Number of Citations</h3>
          <input
            type="number"
            value={formData.numberOfCitations}
            onChange={(e) => handleInputChange('numberOfCitations', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Enter total citations"
          />
          <p className="text-sm text-gray-600 mt-2">Please enter the highest total count from the available databases.</p>
        </div>
        
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">13. Number of Total Publications</h3>
          <input
            type="number"
            value={formData.totalPublications}
            onChange={(e) => handleInputChange('totalPublications', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Enter total publications"
          />
          <p className="text-sm text-gray-600 mt-2">Include peer-reviewed journal articles and conference papers.</p>
        </div>
      </div>

      {/* Most Recent Article */}
      <div className="card mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">14. Year of Most Recent Research Article</h3>
        <input
          type="text"
          value={formData.mostRecentArticleYear}
          onChange={(e) => handleInputChange('mostRecentArticleYear', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="YYYY"
        />
        <p className="text-sm text-gray-600 mt-2">Do not include manuscripts that are still under review.</p>
        
        <div className="mt-4">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.noPublications}
              onChange={(e) => handleInputChange('noPublications', e.target.checked)}
              className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <span className="text-gray-700">I do not have any publications.</span>
          </label>
        </div>
      </div>

      {/* Papers Reviewed */}
      <div className="card mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">15. Number of Papers Reviewed</h3>
        <input
          type="number"
          value={formData.papersReviewed}
          onChange={(e) => handleInputChange('papersReviewed', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="Enter number of papers reviewed"
        />
        <p className="text-sm text-gray-600 mt-2">Please enter the total number of peer-reviewed journal or conference papers you have reviewed as an invited peer reviewer.</p>
        
        <div className="mt-4">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.reviewEvidenceConfirmed}
              onChange={(e) => handleInputChange('reviewEvidenceConfirmed', e.target.checked)}
              className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <span className="text-gray-700">I confirm that the above number can be supported by evidence (e.g., thank-you emails, editorial system logs).</span>
          </label>
        </div>
      </div>

      {/* Patents */}
      <div className="card mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">16. Patents</h3>
        <select 
          value={formData.patents}
          onChange={(e) => handleInputChange('patents', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="">Select...</option>
          <option value="Yes – Please list them.">Yes – Please list them.</option>
          <option value="No">No</option>
        </select>
      </div>

      {/* Funding */}
      <div className="card mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">17. Funding</h3>
        <select 
          value={formData.funding}
          onChange={(e) => handleInputChange('funding', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="">Select...</option>
          <option value="Yes – Specify the source(s) and scope (e.g., NIH, NSF, national agencies).">Yes – Specify the source(s) and scope (e.g., NIH, NSF, national agencies).</option>
          <option value="No">No</option>
        </select>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Part 4: Documents & Final Information</h2>
        <p className="text-gray-600">Upload your supporting documents and confirm your information.</p>
      </div>

      {/* Resume Upload */}
      <div className="card mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">20. Resume/CV Upload</h3>
        <p className="text-sm text-gray-600 mb-4">
          Please upload your current resume or CV. This will be used to extract information for your EB-1A application forms.
        </p>
        
        {!formData.resume ? (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 transition-colors">
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <label className="cursor-pointer">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload('resume', file);
                }}
                className="hidden"
              />
              <span className="text-primary-600 hover:text-primary-700 font-medium">Click to upload resume</span>
              <span className="text-gray-500"> or drag and drop</span>
            </label>
            <p className="text-xs text-gray-500 mt-2">PDF, DOC, or DOCX (Max 10MB)</p>
          </div>
        ) : (
          <div className="border border-green-200 bg-green-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Upload className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-green-900">{formData.resume.name}</p>
                  <p className="text-sm text-green-700">{formatFileSize(formData.resume.size)}</p>
                </div>
              </div>
              <button
                onClick={() => handleFileUpload('resume', null)}
                className="text-red-500 hover:text-red-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Publications Upload */}
      <div className="card mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">21. Publications & Research Papers</h3>
        <p className="text-sm text-gray-600 mb-4">
          Upload your published research papers, articles, and publications. These are crucial for demonstrating your extraordinary ability.
        </p>
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 transition-colors">
          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <label className="cursor-pointer">
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              multiple
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                handleMultipleFileUpload('publications', files);
              }}
              className="hidden"
            />
            <span className="text-primary-600 hover:text-primary-700 font-medium">Click to upload publications</span>
            <span className="text-gray-500"> or drag and drop</span>
          </label>
          <p className="text-xs text-gray-500 mt-2">PDF, DOC, or DOCX files (Max 10MB each)</p>
        </div>
        
        {formData.publications.length > 0 && (
          <div className="mt-4 space-y-2">
            {formData.publications.map((file, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <Upload className="w-3 h-3 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{file.name}</p>
                    <p className="text-sm text-gray-600">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <button
                  onClick={() => removeFile('publications', index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Awards & Certificates */}
      <div className="card mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">22. Awards & Recognition Certificates</h3>
        <p className="text-sm text-gray-600 mb-4">
          Upload certificates, awards, and recognition documents that demonstrate your extraordinary ability.
        </p>
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 transition-colors">
          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <label className="cursor-pointer">
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              multiple
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                handleMultipleFileUpload('awardsCertificates', files);
              }}
              className="hidden"
            />
            <span className="text-primary-600 hover:text-primary-700 font-medium">Click to upload awards</span>
            <span className="text-gray-500"> or drag and drop</span>
          </label>
          <p className="text-xs text-gray-500 mt-2">PDF, JPG, or PNG files (Max 10MB each)</p>
        </div>
        
        {formData.awardsCertificates.length > 0 && (
          <div className="mt-4 space-y-2">
            {formData.awardsCertificates.map((file, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Upload className="w-3 h-3 text-yellow-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{file.name}</p>
                    <p className="text-sm text-gray-600">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <button
                  onClick={() => removeFile('awardsCertificates', index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Patents Documents */}
      {formData.patents === "Yes – Please list them." && (
        <div className="card mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">23. Patent Documents</h3>
          <p className="text-sm text-gray-600 mb-4">
            Upload your patent documents and certificates.
          </p>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 transition-colors">
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <label className="cursor-pointer">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                multiple
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  handleMultipleFileUpload('patentsDocuments', files);
                }}
                className="hidden"
              />
              <span className="text-primary-600 hover:text-primary-700 font-medium">Click to upload patents</span>
              <span className="text-gray-500"> or drag and drop</span>
            </label>
            <p className="text-xs text-gray-500 mt-2">PDF, DOC, or DOCX files (Max 10MB each)</p>
          </div>
          
          {formData.patentsDocuments.length > 0 && (
            <div className="mt-4 space-y-2">
              {formData.patentsDocuments.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                      <Upload className="w-3 h-3 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{file.name}</p>
                      <p className="text-sm text-gray-600">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile('patentsDocuments', index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Funding Documents */}
      {formData.funding === "Yes – Specify the source(s) and scope (e.g., NIH, NSF, national agencies)." && (
        <div className="card mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">24. Funding Documents</h3>
          <p className="text-sm text-gray-600 mb-4">
            Upload documents related to your research funding and grants.
          </p>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 transition-colors">
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <label className="cursor-pointer">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                multiple
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  handleMultipleFileUpload('fundingDocuments', files);
                }}
                className="hidden"
              />
              <span className="text-primary-600 hover:text-primary-700 font-medium">Click to upload funding docs</span>
              <span className="text-gray-500"> or drag and drop</span>
            </label>
            <p className="text-xs text-gray-500 mt-2">PDF, DOC, or DOCX files (Max 10MB each)</p>
          </div>
          
          {formData.fundingDocuments.length > 0 && (
            <div className="mt-4 space-y-2">
              {formData.fundingDocuments.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <Upload className="w-3 h-3 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{file.name}</p>
                      <p className="text-sm text-gray-600">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile('fundingDocuments', index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Review Evidence */}
      {formData.reviewEvidenceConfirmed && (
        <div className="card mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">25. Peer Review Evidence</h3>
          <p className="text-sm text-gray-600 mb-4">
            Upload evidence of your peer review activities (thank-you emails, editorial system logs, etc.).
          </p>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 transition-colors">
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <label className="cursor-pointer">
              <input
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                multiple
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  handleMultipleFileUpload('reviewEvidence', files);
                }}
                className="hidden"
              />
              <span className="text-primary-600 hover:text-primary-700 font-medium">Click to upload review evidence</span>
              <span className="text-gray-500"> or drag and drop</span>
            </label>
            <p className="text-xs text-gray-500 mt-2">PDF, DOC, DOCX, JPG, or PNG files (Max 10MB each)</p>
          </div>
          
          {formData.reviewEvidence.length > 0 && (
            <div className="mt-4 space-y-2">
              {formData.reviewEvidence.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center">
                      <Upload className="w-3 h-3 text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{file.name}</p>
                      <p className="text-sm text-gray-600">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile('reviewEvidence', index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Continue Research */}
      <div className="card mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">26. Research Continuity</h3>
        <p className="text-sm text-gray-600 mb-4">
          Do you continue to conduct research and publish papers that are aligned with your proposed endeavor?
        </p>
        <select 
          value={formData.continueResearch}
          onChange={(e) => handleInputChange('continueResearch', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="">Select...</option>
          <option value="Yes, I am still active in conducting research and publishing papers.">Yes, I am still active in conducting research and publishing papers.</option>
          <option value="No, I will stop conducting research or publishing papers altogether.">No, I will stop conducting research or publishing papers altogether.</option>
        </select>
        
        {formData.continueResearch === "Yes, I am still active in conducting research and publishing papers." && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              I expect to publish another paper in:
            </label>
            <input
              type="text"
              value={formData.expectedPublicationDate}
              onChange={(e) => handleInputChange('expectedPublicationDate', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="MM/YYYY"
            />
          </div>
        )}
      </div>

      {/* Work Alignment */}
      <div className="card mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">27. Work Alignment</h3>
        <p className="text-sm text-gray-600 mb-4">
          Is your planned work aligned with your prior education, publications, and citations?
        </p>
        <select 
          value={formData.workAligned}
          onChange={(e) => handleInputChange('workAligned', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="">Select...</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>

      {/* Final Confirmation */}
      <div className="card bg-blue-50 border-blue-200">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Important Information</h3>
            <ul className="text-sm text-blue-800 space-y-2">
              <li>• This evaluation is free and confidential</li>
              <li>• We will review your information and respond within 24 business hours</li>
              <li>• Please check your email, including spam folder, for our response</li>
              <li>• All information provided will be kept strictly confidential</li>
              <li>• Your documents will be used to auto-fill official EB-1A application forms</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      default:
        return renderStep1();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
      {/* Navigation */}
      <nav className="px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <Rocket className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">PathOne</span>
          </div>
          <button 
            onClick={() => navigate('/')}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            ← Back to Home
          </button>
        </div>
      </nav>

      {/* Progress Bar */}
      <div className="px-6 py-4 bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round((currentStep / totalSteps) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-primary-600 to-primary-700 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {renderStepContent()}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-8 pt-8 border-t border-gray-200">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all duration-300 ${
                currentStep === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Previous</span>
            </button>

            <div className="flex items-center space-x-4">
              {currentStep < totalSteps ? (
                <button
                  onClick={nextStep}
                  className="flex items-center space-x-2 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <span>Next</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Rocket className="w-5 h-5" />
                  <span>Submit Application</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="px-6 py-8 bg-gray-900 text-white mt-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                <Rocket className="w-3 h-3 text-white" />
              </div>
              <span className="font-semibold">PathOne</span>
            </div>
            <div className="text-sm text-gray-400">
              © 2024 PathOne. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default EB1AForm; 