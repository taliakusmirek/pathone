import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Star, Clock, MessageCircle, ArrowLeft, CheckCircle, Calendar } from 'lucide-react';

interface Lawyer {
  id: string;
  name: string;
  firm: string;
  rating: number;
  reviews: number;
  experience: string;
  specialties: string[];
  price: number;
  availability: string;
  image: string;
}

const SecondOpinion: React.FC = () => {
  const navigate = useNavigate();
  const [selectedLawyer, setSelectedLawyer] = useState<string>('');
  const [selectedService, setSelectedService] = useState<string>('');

  const lawyers: Lawyer[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      firm: 'Immigration Partners LLP',
      rating: 4.9,
      reviews: 127,
      experience: '15+ years',
      specialties: ['EB-1A', 'O-1', 'Startup Visas'],
      price: 500,
      availability: 'Next week',
      image: '👩‍💼'
    },
    {
      id: '2',
      name: 'Michael Chen',
      firm: 'Tech Immigration Law',
      rating: 4.8,
      reviews: 89,
      experience: '12+ years',
      specialties: ['EB-1A', 'O-1', 'L-1A'],
      price: 450,
      availability: 'This week',
      image: '👨‍💼'
    },
    {
      id: '3',
      name: 'Dr. Emily Rodriguez',
      firm: 'Global Talent Law',
      rating: 4.9,
      reviews: 203,
      experience: '18+ years',
      specialties: ['EB-1A', 'O-1', 'Academic Visas'],
      price: 600,
      availability: 'Next week',
      image: '👩‍⚖️'
    }
  ];

  const services = [
    {
      id: 'review',
      name: 'Application Review',
      description: 'Comprehensive review of your petition and supporting documents',
      price: 300,
      duration: '3-5 business days',
      features: ['Document analysis', 'Strategy recommendations', 'Written feedback']
    },
    {
      id: 'consultation',
      name: '1-Hour Consultation',
      description: 'Direct consultation with an immigration lawyer',
      price: 500,
      duration: '1 hour',
      features: ['Video call', 'Q&A session', 'Action plan']
    },
    {
      id: 'full-service',
      name: 'Full Service',
      description: 'Complete handling of your application from start to finish',
      price: 2500,
      duration: '2-3 months',
      features: ['Document preparation', 'USCIS filing', 'Case management']
    }
  ];

  const handleSelectLawyer = (lawyerId: string) => {
    setSelectedLawyer(lawyerId);
  };

  const handleSelectService = (serviceId: string) => {
    setSelectedService(serviceId);
  };

  const handleBookConsultation = () => {
    // In a real app, this would integrate with a booking system
    alert('Booking system would be integrated here');
  };

  const selectedLawyerData = lawyers.find(l => l.id === selectedLawyer);
  const selectedServiceData = services.find(s => s.id === selectedService);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/result')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Results
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Get Expert Legal Review
          </h1>
          <p className="text-gray-600">
            Connect with vetted immigration lawyers for a second opinion on your case
          </p>
        </div>

        {/* Services Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Choose Your Service</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {services.map((service) => (
              <div
                key={service.id}
                className={`card cursor-pointer transition-all ${
                  selectedService === service.id
                    ? 'ring-2 ring-primary-500 bg-primary-50 border-primary-300'
                    : 'hover:shadow-md'
                }`}
                onClick={() => handleSelectService(service.id)}
              >
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{service.name}</h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <div className="text-3xl font-bold text-primary-600 mb-2">
                    ${service.price}
                  </div>
                  <div className="text-sm text-gray-500 mb-4">
                    <Clock className="w-4 h-4 inline mr-1" />
                    {service.duration}
                  </div>
                </div>

                <ul className="space-y-2">
                  {service.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-success-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Lawyers Section */}
        {selectedService && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Your Lawyer</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {lawyers.map((lawyer) => (
                <div
                  key={lawyer.id}
                  className={`card cursor-pointer transition-all ${
                    selectedLawyer === lawyer.id
                      ? 'ring-2 ring-primary-500 bg-primary-50 border-primary-300'
                      : 'hover:shadow-md'
                  }`}
                  onClick={() => handleSelectLawyer(lawyer.id)}
                >
                  <div className="text-center mb-4">
                    <div className="text-4xl mb-3">{lawyer.image}</div>
                    <h3 className="text-lg font-bold text-gray-900">{lawyer.name}</h3>
                    <p className="text-gray-600 text-sm">{lawyer.firm}</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-center">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(lawyer.rating)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="ml-2 text-sm text-gray-600">
                        {lawyer.rating} ({lawyer.reviews} reviews)
                      </span>
                    </div>

                    <div className="text-center">
                      <span className="text-sm text-gray-600">{lawyer.experience} experience</span>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Specialties:</h4>
                      <div className="flex flex-wrap gap-1">
                        {lawyer.specialties.map((specialty) => (
                          <span
                            key={specialty}
                            className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Starting at:</span>
                      <span className="font-semibold text-gray-900">${lawyer.price}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Available:</span>
                      <span className="text-success-600">{lawyer.availability}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Booking Section */}
        {selectedLawyer && selectedService && (
          <div className="card max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Book Your Consultation
            </h2>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-700">Selected Service:</span>
                  <span className="font-semibold text-gray-900">{selectedServiceData?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Selected Lawyer:</span>
                  <span className="font-semibold text-gray-900">{selectedLawyerData?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Duration:</span>
                  <span className="font-semibold text-gray-900">{selectedServiceData?.duration}</span>
                </div>
                <div className="flex justify-between border-t pt-3">
                  <span className="text-gray-700">Total:</span>
                  <span className="text-2xl font-bold text-gray-900">
                    ${selectedServiceData?.price}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleBookConsultation}
                className="w-full btn-primary text-lg py-4 flex items-center justify-center"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Schedule Consultation
              </button>

              <button
                onClick={() => navigate('/dashboard')}
                className="w-full btn-secondary text-lg py-4 flex items-center justify-center"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Send Message Instead
              </button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                You'll be redirected to our booking system to schedule your consultation
              </p>
            </div>
          </div>
        )}

        {/* Why Choose Us */}
        <div className="mt-12 card max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Why Choose PathOne's Lawyer Network?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Vetted Experts</h3>
              <p className="text-gray-600 text-sm">
                All lawyers are pre-screened with proven track records in EB-1A and O-1 cases
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-success-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Success Guarantee</h3>
              <p className="text-gray-600 text-sm">
                Many lawyers offer success-based pricing and money-back guarantees
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-6 h-6 text-warning-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Direct Communication</h3>
              <p className="text-gray-600 text-sm">
                Connect directly with lawyers through our secure messaging system
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecondOpinion; 