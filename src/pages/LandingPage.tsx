import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle, Star, Users, Award } from 'lucide-react';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleCheckEligibility = () => {
    navigate('/eligibility');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
      {/* Navigation */}
      <nav className="px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <span className="text-xl font-bold text-gray-900">PathOne</span>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <a href="#how-it-works" className="text-gray-600 hover:text-gray-900">How it works</a>
            <a href="#pricing" className="text-gray-600 hover:text-gray-900">Pricing</a>
            <button className="btn-secondary">Sign In</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="px-6 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center px-4 py-2 bg-primary-100 text-primary-800 rounded-full text-sm font-medium mb-6">
              <Star className="w-4 h-4 mr-2" />
              Trusted by top 1% founders worldwide
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Top 1% founders — see if you qualify for a{' '}
              <span className="text-primary-600">U.S. green card or visa</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              AI-assisted EB-1A / O-1 visa eligibility screening + auto-prefilled petition for global builders.
              Save thousands in legal fees and months of time.
            </p>
            <button 
              onClick={handleCheckEligibility}
              className="btn-primary text-lg px-8 py-4 flex items-center mx-auto"
            >
              Check My Eligibility
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          </div>

          {/* Social Proof */}
          <div className="mt-12">
            <p className="text-sm text-gray-500 mb-4">Trusted by founders from</p>
            <div className="flex items-center justify-center space-x-8 opacity-60">
              <div className="text-lg font-semibold text-gray-400">YC</div>
              <div className="text-lg font-semibold text-gray-400">Techstars</div>
              <div className="text-lg font-semibold text-gray-400">500 Startups</div>
              <div className="text-lg font-semibold text-gray-400">AngelPad</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="px-6 py-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why choose PathOne?
            </h2>
            <p className="text-lg text-gray-600">
              Streamlined process designed for exceptional founders
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI-Powered Screening</h3>
              <p className="text-gray-600">
                Get instant eligibility assessment with 95% accuracy using our advanced AI
              </p>
            </div>

            <div className="card text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Award className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Auto-Prefilled Forms</h3>
              <p className="text-gray-600">
                Save weeks of work with AI-generated I-140 and I-129 petition drafts
              </p>
            </div>

            <div className="card text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Expert Network</h3>
              <p className="text-gray-600">
                Connect with vetted immigration lawyers and get second opinions
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="px-6 py-16 bg-primary-600">
        <div className="max-w-4xl mx-auto text-center">
          <div className="grid md:grid-cols-3 gap-8 text-white">
            <div>
              <div className="text-3xl font-bold mb-2">95%</div>
              <div className="text-primary-100">Success Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">$50K+</div>
              <div className="text-primary-100">Legal Fees Saved</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">6 Months</div>
              <div className="text-primary-100">Time Saved</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="px-6 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to start your journey?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join hundreds of founders who've successfully obtained their visas through PathOne
          </p>
          <button 
            onClick={handleCheckEligibility}
            className="btn-primary text-lg px-8 py-4"
          >
            Check My Eligibility Now
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="px-6 py-8 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-primary-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">P</span>
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

export default LandingPage; 