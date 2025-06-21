import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle, Star, Users, Zap, TrendingUp, Clock, Sparkles, Rocket, Shield, Globe, FileText, LogOut } from 'lucide-react';
import useAuthStore from '../stores/authStore';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuthStore();
  const [isVisible, setIsVisible] = useState(false);
  const [stats, setStats] = useState({ success: 0, savings: 0, time: 0 });
  const [dotsExploded, setDotsExploded] = useState(false);
  const [sectionsVisible, setSectionsVisible] = useState({
    features: false,
    howItWorks: false,
    stats: false,
    pricing: false,
    cta: false
  });

  useEffect(() => {
    setIsVisible(true);
    
    // Trigger dot explosion after a short delay
    const explosionTimer = setTimeout(() => {
      setDotsExploded(true);
    }, 300);
    
    // Animate stats when they come into view
    const statsTimer = setTimeout(() => {
      setStats({ success: 95, savings: 50, time: 6 });
    }, 1000);

    // Intersection Observer for section animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          // Map section IDs to state keys
          const stateKeyMap: { [key: string]: string } = {
            'features': 'features',
            'how-it-works': 'howItWorks',
            'stats': 'stats',
            'pricing': 'pricing',
            'cta': 'cta'
          };
          
          const stateKey = stateKeyMap[sectionId];
          if (stateKey) {
            setSectionsVisible(prev => ({
              ...prev,
              [stateKey]: true
            }));
          }
        }
      });
    }, { threshold: 0.1 });

    // Observe all sections
    const sections = ['features', 'how-it-works', 'stats', 'pricing', 'cta'];
    sections.forEach(id => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => {
      clearTimeout(explosionTimer);
      clearTimeout(statsTimer);
      observer.disconnect();
    };
  }, []);

  const handleCheckEligibility = () => {
    navigate('/eligibility');
  };

  const handleAuthAction = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  };

  const handleSignOut = () => {
    navigate('/');
    logout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
      {/* Navigation */}
      <nav className="px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <Rocket className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">PathOne</span>
            </button>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <a href="#how-it-works" className="text-gray-600 hover:text-gray-900">How it Works</a>
            <a href="#pricing" className="text-gray-600 hover:text-gray-900">Pricing</a>
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <button 
                  onClick={handleAuthAction}
                  className="btn-secondary"
                >
                  My Dashboard
                </button>
                <button
                  onClick={handleSignOut}
                  className="text-gray-600 hover:text-red-600 transition-colors duration-150 p-2 rounded-lg hover:bg-gray-100"
                  title="Sign Out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button 
                onClick={handleAuthAction}
                className="btn-secondary"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section with Blue Ombre Overlay */}
      <div className="relative">
        {/* Blue Ombre Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/10 via-blue-500/5 to-transparent"></div>
        
        {/* Floating Particles - Explosion Effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Dots around the main headline */}
          <div className={`absolute top-16 left-8 w-2 h-2 bg-blue-400 rounded-full transition-all duration-1000 ease-out ${dotsExploded ? 'opacity-100 animate-pulse' : 'opacity-0 scale-0 translate-x-0 translate-y-0'}`} style={{ animationDelay: '0s' }}></div>
          <div className={`absolute top-20 right-12 w-1 h-1 bg-blue-300 rounded-full transition-all duration-1000 ease-out ${dotsExploded ? 'opacity-100 animate-pulse' : 'opacity-0 scale-0 translate-x-0 translate-y-0'}`} style={{ animationDelay: '0.1s' }}></div>
          <div className={`absolute top-24 left-1/2 w-1.5 h-1.5 bg-blue-500 rounded-full transition-all duration-1000 ease-out ${dotsExploded ? 'opacity-100 animate-pulse' : 'opacity-0 scale-0 translate-x-0 translate-y-0'}`} style={{ animationDelay: '0.2s' }}></div>
          
          {/* Dots around "international founders" */}
          <div className={`absolute top-32 right-1/4 w-1 h-1 bg-blue-300 rounded-full transition-all duration-1000 ease-out ${dotsExploded ? 'opacity-100 animate-pulse' : 'opacity-0 scale-0 translate-x-0 translate-y-0'}`} style={{ animationDelay: '0.3s' }}></div>
          <div className={`absolute top-36 right-1/3 w-1.5 h-1.5 bg-blue-400 rounded-full transition-all duration-1000 ease-out ${dotsExploded ? 'opacity-100 animate-pulse' : 'opacity-0 scale-0 translate-x-0 translate-y-0'}`} style={{ animationDelay: '0.4s' }}></div>
          <div className={`absolute top-40 left-3/4 w-1 h-1 bg-blue-500 rounded-full transition-all duration-1000 ease-out ${dotsExploded ? 'opacity-100 animate-pulse' : 'opacity-0 scale-0 translate-x-0 translate-y-0'}`} style={{ animationDelay: '0.5s' }}></div>
          
          {/* Dots around "U.S. green card or visa?" */}
          <div className={`absolute top-48 right-1/6 w-1.5 h-1.5 bg-blue-400 rounded-full transition-all duration-1000 ease-out ${dotsExploded ? 'opacity-100 animate-pulse' : 'opacity-0 scale-0 translate-x-0 translate-y-0'}`} style={{ animationDelay: '0.6s' }}></div>
          <div className={`absolute top-52 right-1/4 w-1 h-1 bg-blue-300 rounded-full transition-all duration-1000 ease-out ${dotsExploded ? 'opacity-100 animate-pulse' : 'opacity-0 scale-0 translate-x-0 translate-y-0'}`} style={{ animationDelay: '0.7s' }}></div>
          <div className={`absolute top-56 left-2/3 w-1 h-1 bg-blue-500 rounded-full transition-all duration-1000 ease-out ${dotsExploded ? 'opacity-100 animate-pulse' : 'opacity-0 scale-0 translate-x-0 translate-y-0'}`} style={{ animationDelay: '0.8s' }}></div>
          
          {/* Dots around the description text */}
          <div className={`absolute top-64 right-1/3 w-1 h-1 bg-blue-300 rounded-full transition-all duration-1000 ease-out ${dotsExploded ? 'opacity-100 animate-pulse' : 'opacity-0 scale-0 translate-x-0 translate-y-0'}`} style={{ animationDelay: '0.9s' }}></div>
          <div className={`absolute top-68 right-1/2 w-1.5 h-1.5 bg-blue-400 rounded-full transition-all duration-1000 ease-out ${dotsExploded ? 'opacity-100 animate-pulse' : 'opacity-0 scale-0 translate-x-0 translate-y-0'}`} style={{ animationDelay: '1.0s' }}></div>
          <div className={`absolute top-72 left-5/6 w-1 h-1 bg-blue-500 rounded-full transition-all duration-1000 ease-out ${dotsExploded ? 'opacity-100 animate-pulse' : 'opacity-0 scale-0 translate-x-0 translate-y-0'}`} style={{ animationDelay: '1.1s' }}></div>
          
          {/* Dots around the CTA button */}
          <div className={`absolute top-80 right-1/8 w-1.5 h-1.5 bg-blue-400 rounded-full transition-all duration-1000 ease-out ${dotsExploded ? 'opacity-100 animate-pulse' : 'opacity-0 scale-0 translate-x-0 translate-y-0'}`} style={{ animationDelay: '1.2s' }}></div>
          <div className={`absolute top-84 right-1/6 w-1 h-1 bg-blue-300 rounded-full transition-all duration-1000 ease-out ${dotsExploded ? 'opacity-100 animate-pulse' : 'opacity-0 scale-0 translate-x-0 translate-y-0'}`} style={{ animationDelay: '1.3s' }}></div>
          <div className={`absolute top-88 right-2/5 w-1 h-1 bg-blue-500 rounded-full transition-all duration-1000 ease-out ${dotsExploded ? 'opacity-100 animate-pulse' : 'opacity-0 scale-0 translate-x-0 translate-y-0'}`} style={{ animationDelay: '1.4s' }}></div>
          <div className={`absolute top-92 right-3/4 w-1.5 h-1.5 bg-blue-400 rounded-full transition-all duration-1000 ease-out ${dotsExploded ? 'opacity-100 animate-pulse' : 'opacity-0 scale-0 translate-x-0 translate-y-0'}`} style={{ animationDelay: '1.5s' }}></div>
          
          {/* Dots around social proof */}
          <div className={`absolute top-100 right-1/12 w-1 h-1 bg-blue-300 rounded-full transition-all duration-1000 ease-out ${dotsExploded ? 'opacity-100 animate-pulse' : 'opacity-0 scale-0 translate-x-0 translate-y-0'}`} style={{ animationDelay: '1.6s' }}></div>
          <div className={`absolute top-104 right-1/12 w-1.5 h-1.5 bg-blue-500 rounded-full transition-all duration-1000 ease-out ${dotsExploded ? 'opacity-100 animate-pulse' : 'opacity-0 scale-0 translate-x-0 translate-y-0'}`} style={{ animationDelay: '1.7s' }}></div>
          <div className={`absolute top-108 left-11/12 w-1 h-1 bg-blue-400 rounded-full transition-all duration-1000 ease-out ${dotsExploded ? 'opacity-100 animate-pulse' : 'opacity-0 scale-0 translate-x-0 translate-y-0'}`} style={{ animationDelay: '1.8s' }}></div>
          <div className={`absolute top-112 right-11/12 w-1.5 h-1.5 bg-blue-300 rounded-full transition-all duration-1000 ease-out ${dotsExploded ? 'opacity-100 animate-pulse' : 'opacity-0 scale-0 translate-x-0 translate-y-0'}`} style={{ animationDelay: '1.9s' }}></div>
          
          {/* Extra scattered dots for density - redistributed */}
          <div className={`absolute top-28 right-1/5 w-1 h-1 bg-blue-400 rounded-full transition-all duration-1000 ease-out ${dotsExploded ? 'opacity-100 animate-pulse' : 'opacity-0 scale-0 translate-x-0 translate-y-0'}`} style={{ animationDelay: '2.0s' }}></div>
          <div className={`absolute top-44 right-1/5 w-1.5 h-1.5 bg-blue-300 rounded-full transition-all duration-1000 ease-out ${dotsExploded ? 'opacity-100 animate-pulse' : 'opacity-0 scale-0 translate-x-0 translate-y-0'}`} style={{ animationDelay: '2.1s' }}></div>
          <div className={`absolute top-60 right-4/5 w-1 h-1 bg-blue-500 rounded-full transition-all duration-1000 ease-out ${dotsExploded ? 'opacity-100 animate-pulse' : 'opacity-0 scale-0 translate-x-0 translate-y-0'}`} style={{ animationDelay: '2.2s' }}></div>
          <div className={`absolute top-76 right-4/5 w-1.5 h-1.5 bg-blue-400 rounded-full transition-all duration-1000 ease-out ${dotsExploded ? 'opacity-100 animate-pulse' : 'opacity-0 scale-0 translate-x-0 translate-y-0'}`} style={{ animationDelay: '2.3s' }}></div>
          
          {/* A few strategic left dots for balance */}
          <div className={`absolute top-36 left-1/4 w-1 h-1 bg-blue-300 rounded-full transition-all duration-1000 ease-out ${dotsExploded ? 'opacity-100 animate-pulse' : 'opacity-0 scale-0 translate-x-0 translate-y-0'}`} style={{ animationDelay: '2.4s' }}></div>
          <div className={`absolute top-68 left-1/3 w-1.5 h-1.5 bg-blue-400 rounded-full transition-all duration-1000 ease-out ${dotsExploded ? 'opacity-100 animate-pulse' : 'opacity-0 scale-0 translate-x-0 translate-y-0'}`} style={{ animationDelay: '2.5s' }}></div>
          <div className={`absolute top-96 left-1/8 w-1 h-1 bg-blue-500 rounded-full transition-all duration-1000 ease-out ${dotsExploded ? 'opacity-100 animate-pulse' : 'opacity-0 scale-0 translate-x-0 translate-y-0'}`} style={{ animationDelay: '2.6s' }}></div>
        </div>
        
        <div className="px-6 py-16 md:py-24 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <div className={`inline-flex items-center px-4 py-2 bg-primary-100 text-primary-800 rounded-full text-sm font-medium mb-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <Sparkles className="w-4 h-4 mr-2 animate-spin" style={{ animationDuration: '3s' }} />
                Trusted by top 1% founders worldwide
              </div>
              <h1 className={`text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                Hey international founders, <br /> do you qualify for the<br />
                <span className="text-primary-600">
                  U.S. green card or visa?
                </span>
              </h1>
              <p className={`text-xl text-gray-600 mb-8 max-w-2xl mx-auto transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                AI-assisted EB-1A / O-1 visa eligibility screening + auto-prefilled petition for global builders.
                Save thousands in legal fees <br /> and months of time.
              </p>
              <div className={`transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <button 
                  onClick={handleCheckEligibility}
                  className="group bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold text-lg px-8 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 relative overflow-hidden"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                  <span className="relative flex items-center">
                    <Rocket className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                    Check My Eligibility
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
              </div>
            </div>

            {/* Social Proof with Animation */}
            <div className={`mt-12 transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <p className="text-sm text-gray-500 mb-4">Trusted by founders from</p>
              <div className="flex items-center justify-center space-x-8 opacity-60">
                {['YC', 'Techstars', '500 Startups', 'AngelPad'].map((company, index) => (
                  <div 
                    key={company}
                    className="text-lg font-semibold text-gray-400 hover:text-primary-600 transition-colors duration-300 cursor-pointer"
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    {company}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="px-6 py-16 bg-white relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-50 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-primary-50 to-transparent rounded-full blur-3xl"></div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <div className={`transition-all duration-1000 ${sectionsVisible.features ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Why choose PathOne?
              </h2>
              <p className="text-lg text-gray-600">
                Streamlined process designed for exceptional founders
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className={`group card text-center transform transition-all duration-700 hover:scale-105 hover:shadow-2xl hover:-translate-y-2 ${sectionsVisible.features ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '200ms' }}>
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                <Zap className="w-10 h-10 text-white group-hover:animate-pulse" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 group-hover:text-blue-600 transition-colors">AI-Powered Screening</h3>
              <p className="text-gray-600 mb-4">
                Get instant eligibility assessment with 95% accuracy using our advanced AI
              </p>
              <div className="flex items-center justify-center text-sm text-blue-600 font-medium group-hover:scale-105 transition-transform">
                <TrendingUp className="w-4 h-4 mr-1" />
                Real-time analysis
              </div>
              <div className="mt-4 p-3 bg-blue-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="text-xs text-blue-700">⚡ Processes in under 30 seconds</div>
              </div>
            </div>

            <div className={`group card text-center transform transition-all duration-700 hover:scale-105 hover:shadow-2xl hover:-translate-y-2 ${sectionsVisible.features ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '400ms' }}>
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                <Shield className="w-10 h-10 text-white group-hover:animate-pulse" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 group-hover:text-green-600 transition-colors">Auto-Prefilled Forms</h3>
              <p className="text-gray-600 mb-4">
                Save weeks of work with AI-generated I-140 and I-129 petition drafts
              </p>
              <div className="flex items-center justify-center text-sm text-green-600 font-medium group-hover:scale-105 transition-transform">
                <Clock className="w-4 h-4 mr-1" />
                Save 40+ hours
              </div>
              <div className="mt-4 p-3 bg-green-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="text-xs text-green-700">🛡️ USCIS-compliant templates</div>
              </div>
            </div>

            <div className={`group card text-center transform transition-all duration-700 hover:scale-105 hover:shadow-2xl hover:-translate-y-2 ${sectionsVisible.features ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '600ms' }}>
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                <Globe className="w-10 h-10 text-white group-hover:animate-pulse" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 group-hover:text-purple-600 transition-colors">Expert Network</h3>
              <p className="text-gray-600 mb-4">
                Connect with vetted immigration lawyers and get second opinions
              </p>
              <div className="flex items-center justify-center text-sm text-purple-600 font-medium group-hover:scale-105 transition-transform">
                <Users className="w-4 h-4 mr-1" />
                200+ lawyers
              </div>
              <div className="mt-4 p-3 bg-purple-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="text-xs text-purple-700">🌍 Global expert network</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How it Works Section */}
      <div id="how-it-works" className="px-6 py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="transition-all duration-1000">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                How it Works
              </h2>
              <p className="text-lg text-gray-600">
                Simple 3-step process to get your visa application ready
              </p>
            </div>
          </div>

          {/* Timeline Process */}
          <div className="relative">
            {/* Connecting Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary-500 to-primary-300 transform -translate-x-1/2 hidden md:block"></div>
            
            {/* Step 1 */}
            <div className="relative mb-16 md:mb-24" style={{ transitionDelay: '200ms' }}>
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 md:pr-12 mb-8 md:mb-0">
                  <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-4">
                        <span className="text-white font-bold text-xl">1</span>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900">Complete Assessment</h3>
                    </div>
                    <p className="text-gray-600 mb-4">
                      Answer a few questions about your background, achievements, and goals. Our AI analyzes your profile in seconds.
                    </p>
                    <div className="flex items-center text-sm text-blue-600">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>2-3 minutes</span>
                    </div>
                  </div>
                </div>
                
                <div className="md:w-1/2 md:pl-12">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-3">What you'll get:</h4>
                    <ul className="space-y-2 text-sm text-blue-800">
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2 text-blue-600" />
                        Instant eligibility score
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2 text-blue-600" />
                        Recommended visa type
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2 text-blue-600" />
                        Success probability
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative mb-16 md:mb-24" style={{ transitionDelay: '400ms' }}>
              <div className="flex flex-col md:flex-row-reverse items-center">
                <div className="md:w-1/2 md:pl-12 mb-8 md:mb-0">
                  <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mr-4">
                        <span className="text-white font-bold text-xl">2</span>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900">Get Your Package</h3>
                    </div>
                    <p className="text-gray-600 mb-4">
                      Receive AI-generated forms, supporting documents, and a complete application strategy tailored to your case.
                    </p>
                    <div className="flex items-center text-sm text-green-600">
                      <FileText className="w-4 h-4 mr-2" />
                      <span>Complete package ready</span>
                    </div>
                  </div>
                </div>
                
                <div className="md:w-1/2 md:pr-12">
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
                    <h4 className="font-semibold text-green-900 mb-3">Package includes:</h4>
                    <ul className="space-y-2 text-sm text-green-800">
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                        Pre-filled I-140/I-129 forms
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                        Supporting documents
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                        Application strategy
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative" style={{ transitionDelay: '600ms' }}>
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 md:pr-12 mb-8 md:mb-0">
                  <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mr-4">
                        <span className="text-white font-bold text-xl">3</span>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900">Submit & Track</h3>
                    </div>
                    <p className="text-gray-600 mb-4">
                      Submit your application with confidence. Track your progress and get updates throughout the process.
                    </p>
                    <div className="flex items-center text-sm text-purple-600">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      <span>Track your progress</span>
                    </div>
                  </div>
                </div>
                
                <div className="md:w-1/2 md:pl-12">
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
                    <h4 className="font-semibold text-purple-900 mb-3">Ongoing support:</h4>
                    <ul className="space-y-2 text-sm text-purple-800">
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2 text-purple-600" />
                        Application tracking
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2 text-purple-600" />
                        Status updates
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2 text-purple-600" />
                        Expert guidance
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div id="stats" className="px-6 py-16 bg-gradient-to-r from-primary-600 to-primary-700 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-10 left-10 w-4 h-4 bg-white/20 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
        <div className="absolute top-20 right-20 w-3 h-3 bg-white/30 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-10 left-1/4 w-2 h-2 bg-white/25 rounded-full animate-bounce" style={{ animationDelay: '2s' }}></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className={`transition-all duration-1000 ${sectionsVisible.stats ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h3 className="text-2xl font-bold text-white mb-8 flex items-center justify-center">
              <Sparkles className="w-6 h-6 mr-2 animate-pulse" />
              Trusted by founders worldwide
              <Sparkles className="w-6 h-6 ml-2 animate-pulse" />
            </h3>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 text-white">
            <div className={`transform transition-all duration-700 hover:scale-110 hover:rotate-1 ${sectionsVisible.stats ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '200ms' }}>
              <div className="group bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 cursor-pointer">
                <div className="text-4xl font-bold mb-2 text-white group-hover:text-yellow-300 transition-colors">{stats.success}%</div>
                <div className="text-primary-100 font-medium">Success Rate</div>
                <div className="text-xs text-primary-200 mt-2">Based on 500+ applications</div>
                <div className="mt-3 w-full bg-white/20 rounded-full h-2">
                  <div className="bg-yellow-400 h-2 rounded-full transition-all duration-1000" style={{ width: `${stats.success}%` }}></div>
                </div>
              </div>
            </div>
            <div className={`transform transition-all duration-700 hover:scale-110 hover:-rotate-1 ${sectionsVisible.stats ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '400ms' }}>
              <div className="group bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 cursor-pointer">
                <div className="text-4xl font-bold mb-2 text-white group-hover:text-green-300 transition-colors">${stats.savings}K+</div>
                <div className="text-primary-100 font-medium">Legal Fees Saved</div>
                <div className="text-xs text-primary-200 mt-2">Average per applicant</div>
                <div className="mt-3 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-400 animate-pulse" />
                </div>
              </div>
            </div>
            <div className={`transform transition-all duration-700 hover:scale-110 hover:rotate-1 ${sectionsVisible.stats ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '600ms' }}>
              <div className="group bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 cursor-pointer">
                <div className="text-4xl font-bold mb-2 text-white group-hover:text-blue-300 transition-colors">{stats.time} Months</div>
                <div className="text-primary-100 font-medium">Time Saved</div>
                <div className="text-xs text-primary-200 mt-2">vs traditional process</div>
                <div className="mt-3 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-blue-400 animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div id="pricing" className="px-6 py-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className={`transition-all duration-1000 ${sectionsVisible.pricing ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Choose Your Plan
              </h2>
              <p className="text-lg text-gray-600">
                Start with a free assessment, then choose the package that fits your needs
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Basic Plan */}
            <div className={`card transform transition-all duration-700 hover:scale-105 hover:shadow-xl ${sectionsVisible.pricing ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '200ms' }}>
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Basic</h3>
                <div className="text-4xl font-bold text-gray-900 mb-2">$497</div>
                <p className="text-gray-600">One-time payment</p>
              </div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">AI Eligibility Assessment</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Basic Form Templates</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Document Checklist</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Email Support</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">30-day access</span>
                </li>
              </ul>
              
              <button 
                onClick={handleCheckEligibility}
                className="w-full btn-secondary"
              >
                Get Started
              </button>
            </div>

            {/* Premium Plan */}
            <div className={`card transform transition-all duration-700 hover:scale-105 hover:shadow-xl border-2 border-primary-500 relative ${sectionsVisible.pricing ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '400ms' }}>
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-medium">Most Popular</span>
              </div>
              
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Premium</h3>
                <div className="text-4xl font-bold text-gray-900 mb-2">$997</div>
                <p className="text-gray-600">One-time payment</p>
              </div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700 font-medium">Everything in Basic</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">AI-Prefilled Petition Forms</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Custom Cover Letters</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Lawyer Review (1 hour)</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Priority Support</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Lifetime Access</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Community Access</span>
                </li>
              </ul>
              
              <button 
                onClick={handleCheckEligibility}
                className="w-full btn-primary"
              >
                Get Premium
              </button>
            </div>
          </div>

          {/* Money-back guarantee */}
          <div className="text-center mt-8">
            <div className={`inline-flex items-center px-4 py-2 bg-green-50 text-green-700 rounded-lg ${sectionsVisible.pricing ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '600ms' }}>
              <Shield className="w-5 h-5 mr-2" />
              <span className="font-medium">30-day money-back guarantee</span>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div id="cta" className="px-6 py-16 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-blue-100 rounded-full opacity-20 -translate-x-16 -translate-y-16 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-24 h-24 bg-primary-100 rounded-full opacity-30 translate-x-12 translate-y-12 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-0 w-16 h-16 bg-green-100 rounded-full opacity-15 -translate-x-8 animate-bounce" style={{ animationDelay: '2s' }}></div>
        
        <div className="max-w-2xl mx-auto text-center relative z-10">
          <div className={`transition-all duration-1000 ${sectionsVisible.cta ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to start your journey?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Join hundreds of founders who've successfully <br /> obtained their visas through PathOne
            </p>
          </div>
          
          <div className={`transition-all duration-1000 delay-300 ${sectionsVisible.cta ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <button 
              onClick={handleCheckEligibility}
              className="group bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold text-lg px-8 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 relative overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
              <span className="relative flex items-center">
                <Rocket className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                Check My Eligibility Now
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
            
            <div className="mt-6 flex items-center justify-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center hover:text-green-600 transition-colors cursor-pointer">
                <CheckCircle className="w-4 h-4 text-green-500 mr-1 animate-pulse" />
                No credit card required
              </div>
              <div className="flex items-center hover:text-blue-600 transition-colors cursor-pointer">
                <Clock className="w-4 h-4 text-blue-500 mr-1 animate-pulse" />
                2-minute assessment
              </div>
            </div>
            
            {/* Trust Badges */}
            <div className="mt-8 flex items-center justify-center space-x-4 opacity-60">
              <div className="flex items-center text-xs text-gray-400">
                <Shield className="w-3 h-3 mr-1" />
                SOC 2 Compliant
              </div>
              <div className="flex items-center text-xs text-gray-400">
                <Globe className="w-3 h-3 mr-1" />
                Global Support
              </div>
              <div className="flex items-center text-xs text-gray-400">
                <Star className="w-3 h-3 mr-1" />
                4.9/5 Rating
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="px-6 py-8 bg-gray-900 text-white">
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

export default LandingPage; 