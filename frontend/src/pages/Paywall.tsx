import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Star, ArrowLeft, CreditCard, Shield, Clock, Users } from 'lucide-react';
import { PaymentPlan } from '../types';

const Paywall: React.FC = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<string>('basic');

  const plans: PaymentPlan[] = [
    {
      id: 'basic',
      name: 'Basic Package',
      price: 497,
      features: [
        'AI-prefilled I-140 (EB-1A) or I-129 (O-1) draft',
        'Custom legal packet (PDF)',
        'Full checklist for evidence + templates',
        'Email support'
      ]
    },
    {
      id: 'premium',
      name: 'Premium Package',
      price: 997,
      popular: true,
      features: [
        'Everything in Basic',
        'Invite to Slack/WhatsApp group',
        'Priority support',
        'Document review by AI',
        '30-day money-back guarantee'
      ]
    },
    {
      id: 'ultimate',
      name: 'Ultimate Package',
      price: 1997,
      features: [
        'Everything in Premium',
        '1-hour consultation with immigration lawyer',
        'Full application review',
        'Priority processing',
        'Lifetime access to updates'
      ]
    }
  ];

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
  };

  const handlePurchase = () => {
    // In a real app, this would integrate with Stripe
    navigate('/documents');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={() => navigate('/result')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4 mx-auto"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Results
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Unlock Your Full Package
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose the package that best fits your needs and get started on your visa application journey
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`card relative ${
                plan.popular ? 'ring-2 ring-primary-500 shadow-lg' : ''
              } ${selectedPlan === plan.id ? 'bg-primary-50 border-primary-300' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center">
                    <Star className="w-4 h-4 mr-1" />
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                  <span className="text-gray-600">/one-time</span>
                </div>
                <button
                  onClick={() => handleSelectPlan(plan.id)}
                  className={`w-full py-3 px-4 rounded-lg border-2 transition-colors ${
                    selectedPlan === plan.id
                      ? 'border-primary-600 bg-primary-600 text-white'
                      : 'border-gray-300 text-gray-700 hover:border-primary-600'
                  }`}
                >
                  {selectedPlan === plan.id ? 'Selected' : 'Select Plan'}
                </button>
              </div>

              <div className="space-y-3">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-success-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Purchase Section */}
        <div className="card max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Complete Your Purchase
            </h2>
            <p className="text-gray-600">
              Secure payment powered by Stripe
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Selected Plan:</span>
              <span className="font-semibold text-gray-900">
                {plans.find(p => p.id === selectedPlan)?.name}
              </span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-gray-700">Total:</span>
              <span className="text-2xl font-bold text-gray-900">
                ${plans.find(p => p.id === selectedPlan)?.price}
              </span>
            </div>
          </div>

          <button
            onClick={handlePurchase}
            className="w-full btn-primary text-lg py-4 flex items-center justify-center"
          >
            <CreditCard className="w-5 h-5 mr-2" />
            Pay Securely & Continue
          </button>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500">
              You'll be redirected to Stripe for secure payment
            </p>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-success-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Secure & Private</h3>
            <p className="text-gray-600 text-sm">
              Your data is encrypted and never shared with third parties
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Clock className="w-6 h-6 text-primary-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Instant Access</h3>
            <p className="text-gray-600 text-sm">
              Get your documents immediately after payment
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-warning-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Expert Support</h3>
            <p className="text-gray-600 text-sm">
              Access to our community and expert guidance
            </p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-12 card max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                What if I'm not satisfied?
              </h3>
              <p className="text-gray-600">
                We offer a 30-day money-back guarantee for Premium and Ultimate packages. If you're not completely satisfied, we'll refund your purchase.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                How long does it take to get my documents?
              </h3>
              <p className="text-gray-600">
                You'll receive your AI-prefilled documents immediately after payment. The full legal packet will be generated within 24 hours.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Can I upgrade my plan later?
              </h3>
              <p className="text-gray-600">
                Yes, you can upgrade to a higher tier at any time. We'll credit your previous purchase toward the new plan.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Paywall; 