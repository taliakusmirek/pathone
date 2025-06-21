import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, Award, Users, Download, ArrowLeft, CheckCircle, X } from 'lucide-react';
import { Document } from '../types';

const DocumentIntake: React.FC = () => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);

  const documentTypes = [
    { id: 'resume', name: 'Resume / CV', icon: FileText, required: true },
    { id: 'award', name: 'Awards & Certificates', icon: Award, required: false },
    { id: 'media', name: 'Media Coverage', icon: FileText, required: false },
    { id: 'publication', name: 'Publications & Papers', icon: FileText, required: false },
    { id: 'reference', name: 'Reference Letters', icon: Users, required: false }
  ];

  const handleFileUpload = (type: string, files: FileList | null) => {
    if (!files) return;

    const newDocs: Document[] = Array.from(files).map((file, index) => ({
      id: `${type}-${Date.now()}-${index}`,
      name: file.name,
      type: type as Document['type'],
      url: URL.createObjectURL(file),
      uploadedAt: new Date()
    }));

    setDocuments(prev => [...prev, ...newDocs]);
  };

  const handleRemoveDocument = (docId: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== docId));
  };

  const handleGeneratePackage = async () => {
    setIsGenerating(true);
    // Simulate package generation
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsGenerating(false);
    navigate('/dashboard');
  };

  const getDocumentsByType = (type: string) => {
    return documents.filter(doc => doc.type === type);
  };

  const renderUploadSection = () => {
    return (
      <div className="space-y-6">
        {documentTypes.map((docType) => {
          const IconComponent = docType.icon;
          const typeDocuments = getDocumentsByType(docType.id);
          
          return (
            <div key={docType.id} className="card">
              <div className="flex items-center mb-4">
                <IconComponent className="w-6 h-6 text-primary-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">{docType.name}</h3>
                {docType.required && (
                  <span className="ml-2 text-sm text-red-600">*Required</span>
                )}
              </div>

              {typeDocuments.length > 0 ? (
                <div className="space-y-2">
                  {typeDocuments.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <FileText className="w-5 h-5 text-gray-500 mr-3" />
                        <span className="text-gray-700">{doc.name}</span>
                      </div>
                      <button
                        onClick={() => handleRemoveDocument(doc.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 mb-2">No {docType.name.toLowerCase()} uploaded yet</p>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileUpload(docType.id, e.target.files)}
                    className="hidden"
                    id={`upload-${docType.id}`}
                  />
                  <label
                    htmlFor={`upload-${docType.id}`}
                    className="btn-secondary cursor-pointer inline-flex items-center"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload {docType.name}
                  </label>
                </div>
              )}

              {typeDocuments.length > 0 && (
                <div className="mt-4">
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileUpload(docType.id, e.target.files)}
                    className="hidden"
                    id={`upload-more-${docType.id}`}
                  />
                  <label
                    htmlFor={`upload-more-${docType.id}`}
                    className="text-primary-600 hover:text-primary-800 cursor-pointer text-sm"
                  >
                    + Add more {docType.name.toLowerCase()}
                  </label>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderReviewSection = () => {
    return (
      <div className="space-y-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Document Summary</h3>
          <div className="space-y-3">
            {documentTypes.map((docType) => {
              const typeDocuments = getDocumentsByType(docType.id);
              return (
                <div key={docType.id} className="flex items-center justify-between">
                  <span className="text-gray-700">{docType.name}:</span>
                  <span className="font-medium text-gray-900">
                    {typeDocuments.length} file{typeDocuments.length !== 1 ? 's' : ''}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">What You'll Receive</h3>
          <div className="space-y-3">
            <div className="flex items-start">
              <CheckCircle className="w-5 h-5 text-success-600 mr-3 mt-0.5" />
              <div>
                <h4 className="font-medium text-gray-900">Complete I-140 Petition</h4>
                <p className="text-sm text-gray-600">AI-prefilled with your information and achievements</p>
              </div>
            </div>
            <div className="flex items-start">
              <CheckCircle className="w-5 h-5 text-success-600 mr-3 mt-0.5" />
              <div>
                <h4 className="font-medium text-gray-900">Supporting Documents</h4>
                <p className="text-sm text-gray-600">Organized evidence package with your uploaded materials</p>
              </div>
            </div>
            <div className="flex items-start">
              <CheckCircle className="w-5 h-5 text-success-600 mr-3 mt-0.5" />
              <div>
                <h4 className="font-medium text-gray-900">Cover Letter</h4>
                <p className="text-sm text-gray-600">Professional cover letter highlighting your case</p>
              </div>
            </div>
            <div className="flex items-start">
              <CheckCircle className="w-5 h-5 text-success-600 mr-3 mt-0.5" />
              <div>
                <h4 className="font-medium text-gray-900">Submission Checklist</h4>
                <p className="text-sm text-gray-600">Step-by-step guide for filing your application</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/paywall')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Payment
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Document Intake & Package Generation
          </h1>
          <p className="text-gray-600">
            Upload your supporting documents to generate your complete application package
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            <div className={`flex items-center ${currentStep >= 1 ? 'text-primary-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-200'
              }`}>
                {currentStep > 1 ? <CheckCircle className="w-5 h-5" /> : '1'}
              </div>
              <span className="ml-2 font-medium">Upload Documents</span>
            </div>
            <div className={`w-16 h-0.5 ${currentStep >= 2 ? 'bg-primary-600' : 'bg-gray-200'}`} />
            <div className={`flex items-center ${currentStep >= 2 ? 'text-primary-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-200'
              }`}>
                {currentStep > 2 ? <CheckCircle className="w-5 h-5" /> : '2'}
              </div>
              <span className="ml-2 font-medium">Review & Generate</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mb-8">
          {currentStep === 1 ? renderUploadSection() : renderReviewSection()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={() => setCurrentStep(currentStep - 1)}
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

          {currentStep === 1 ? (
            <button
              onClick={() => setCurrentStep(2)}
              disabled={documents.length === 0}
              className={`flex items-center px-6 py-3 rounded-lg ${
                documents.length === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'btn-primary'
              }`}
            >
              Review & Generate
              <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
            </button>
          ) : (
            <button
              onClick={handleGeneratePackage}
              disabled={isGenerating}
              className="btn-primary flex items-center"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Generating Package...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Generate Package
                </>
              )}
            </button>
          )}
        </div>

        {/* Tips */}
        <div className="mt-8 card bg-primary-50 border-primary-200">
          <h3 className="font-semibold text-primary-900 mb-3">Tips for Better Results</h3>
          <ul className="space-y-2 text-sm text-primary-800">
            <li>• Upload high-quality scans of original documents</li>
            <li>• Include all relevant awards, media coverage, and publications</li>
            <li>• Reference letters should be on official letterhead</li>
            <li>• Ensure all documents are in English or include translations</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DocumentIntake; 