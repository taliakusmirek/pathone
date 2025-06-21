import React, { useState } from 'react';
import { 
  Home, 
  Download, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  FileText, 
  Users, 
  Settings,
  Calendar,
  MessageCircle
} from 'lucide-react';

interface ApplicationStatus {
  status: 'in-progress' | 'completed' | 'pending';
  step: string;
  description: string;
  completed: boolean;
  dueDate?: string;
}

interface DownloadItem {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'template';
  size: string;
  uploadedAt: Date;
  url: string;
}

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const applicationStatus: ApplicationStatus[] = [
    {
      status: 'completed',
      step: 'Eligibility Assessment',
      description: 'Your profile has been analyzed',
      completed: true
    },
    {
      status: 'completed',
      step: 'Package Purchase',
      description: 'Premium package purchased',
      completed: true
    },
    {
      status: 'completed',
      step: 'Document Upload',
      description: 'All supporting documents uploaded',
      completed: true
    },
    {
      status: 'in-progress',
      step: 'Application Review',
      description: 'Lawyer reviewing your case',
      completed: false,
      dueDate: '2024-02-15'
    },
    {
      status: 'pending',
      step: 'USCIS Filing',
      description: 'Submit to USCIS',
      completed: false,
      dueDate: '2024-03-01'
    }
  ];

  const downloads: DownloadItem[] = [
    {
      id: '1',
      name: 'I-140 Petition (EB-1A)',
      type: 'pdf',
      size: '2.4 MB',
      uploadedAt: new Date('2024-01-15'),
      url: '#'
    },
    {
      id: '2',
      name: 'Supporting Documents Package',
      type: 'pdf',
      size: '15.7 MB',
      uploadedAt: new Date('2024-01-15'),
      url: '#'
    },
    {
      id: '3',
      name: 'Cover Letter Template',
      type: 'template',
      size: '45 KB',
      uploadedAt: new Date('2024-01-15'),
      url: '#'
    },
    {
      id: '4',
      name: 'Evidence Checklist',
      type: 'pdf',
      size: '1.2 MB',
      uploadedAt: new Date('2024-01-15'),
      url: '#'
    }
  ];

  const nextSteps = [
    {
      title: 'Schedule Lawyer Consultation',
      description: 'Book a 1-hour consultation with your assigned lawyer',
      action: 'Schedule Now',
      icon: Calendar,
      priority: 'high'
    },
    {
      title: 'Join Support Community',
      description: 'Connect with other applicants in our Slack group',
      action: 'Join Group',
      icon: Users,
      priority: 'medium'
    },
    {
      title: 'Review Application Package',
      description: 'Review your generated documents before filing',
      action: 'Review',
      icon: FileText,
      priority: 'high'
    }
  ];

  const getStatusIcon = (status: ApplicationStatus['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-success-600" />;
      case 'in-progress':
        return <Clock className="w-5 h-5 text-primary-600" />;
      case 'pending':
        return <AlertTriangle className="w-5 h-5 text-warning-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: ApplicationStatus['status']) => {
    switch (status) {
      case 'completed':
        return 'text-success-600';
      case 'in-progress':
        return 'text-primary-600';
      case 'pending':
        return 'text-warning-600';
      default:
        return '';
    }
  };

  const handleDownload = (item: DownloadItem) => {
    // In a real app, this would trigger a download
    console.log('Downloading:', item.name);
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Status Overview */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Status</h3>
        <div className="space-y-4">
          {applicationStatus.map((step, index) => (
            <div key={index} className="flex items-start">
              <div className="mr-4 mt-1">
                {getStatusIcon(step.status)}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className={`font-medium ${getStatusColor(step.status)}`}>
                    {step.step}
                  </h4>
                  {step.dueDate && (
                    <span className="text-sm text-gray-500">
                      Due: {new Date(step.dueDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Next Steps */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Next Steps</h3>
        <div className="space-y-4">
          {nextSteps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <IconComponent className="w-5 h-5 text-primary-600 mr-3" />
                  <div>
                    <h4 className="font-medium text-gray-900">{step.title}</h4>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </div>
                </div>
                <button className="btn-primary text-sm px-4 py-2">
                  {step.action}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="card text-center">
          <div className="text-3xl font-bold text-primary-600 mb-2">3/5</div>
          <div className="text-gray-600">Steps Completed</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-success-600 mb-2">85%</div>
          <div className="text-gray-600">Success Probability</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-warning-600 mb-2">15</div>
          <div className="text-gray-600">Days Remaining</div>
        </div>
      </div>
    </div>
  );

  const renderDownloads = () => (
    <div className="space-y-6">
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Documents</h3>
        <div className="space-y-4">
          {downloads.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <FileText className="w-5 h-5 text-primary-600 mr-3" />
                <div>
                  <h4 className="font-medium text-gray-900">{item.name}</h4>
                  <p className="text-sm text-gray-600">
                    {item.size} • {item.uploadedAt.toLocaleDateString()}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleDownload(item)}
                className="btn-secondary text-sm px-4 py-2"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTimeline = () => (
    <div className="space-y-6">
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Timeline</h3>
        <div className="space-y-6">
          <div className="flex items-start">
            <div className="w-3 h-3 bg-success-600 rounded-full mt-2 mr-4"></div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">Application Submitted</h4>
              <p className="text-sm text-gray-600">January 15, 2024</p>
              <p className="text-sm text-gray-500 mt-1">Your EB-1A application has been submitted to USCIS</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="w-3 h-3 bg-primary-600 rounded-full mt-2 mr-4"></div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">USCIS Receipt Notice</h4>
              <p className="text-sm text-gray-600">Expected: January 22, 2024</p>
              <p className="text-sm text-gray-500 mt-1">You'll receive a receipt notice with your case number</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="w-3 h-3 bg-gray-300 rounded-full mt-2 mr-4"></div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">Case Processing</h4>
              <p className="text-sm text-gray-600">Expected: 6-12 months</p>
              <p className="text-sm text-gray-500 mt-1">USCIS will review your application and supporting documents</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="w-3 h-3 bg-gray-300 rounded-full mt-2 mr-4"></div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">Decision</h4>
              <p className="text-sm text-gray-600">Expected: July 2024 - January 2025</p>
              <p className="text-sm text-gray-500 mt-1">You'll receive approval, denial, or request for evidence</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAccount = () => (
    <div className="space-y-6">
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input type="text" className="input-field" defaultValue="John Doe" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input type="email" className="input-field" defaultValue="john@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            <input type="tel" className="input-field" defaultValue="+1 (555) 123-4567" />
          </div>
          <button className="btn-primary">Save Changes</button>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Billing Information</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Premium Package</h4>
              <p className="text-sm text-gray-600">Purchased on January 15, 2024</p>
            </div>
            <span className="font-semibold text-gray-900">$997</span>
          </div>
          <button className="btn-secondary w-full">Download Invoice</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <span className="text-xl font-bold text-gray-900">PathOne</span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-gray-600 hover:text-gray-900">
                <MessageCircle className="w-5 h-5" />
              </button>
              <button className="text-gray-600 hover:text-gray-900">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, John!</h1>
          <p className="text-gray-600">Here's the latest on your EB-1A application</p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', name: 'Overview', icon: Home },
                { id: 'downloads', name: 'Downloads', icon: Download },
                { id: 'timeline', name: 'Timeline', icon: Clock },
                { id: 'account', name: 'Account', icon: Settings }
              ].map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <IconComponent className="w-4 h-4 mr-2" />
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'downloads' && renderDownloads()}
          {activeTab === 'timeline' && renderTimeline()}
          {activeTab === 'account' && renderAccount()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 