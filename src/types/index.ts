export interface User {
  id: string;
  name: string;
  email: string;
  country: string;
  age: number;
  educationLevel: string;
}

export interface EligibilityData {
  user: User;
  startupAchievements: {
    funding: string;
    traction: string;
    awards: string[];
    patents: string[];
  };
  media: string[];
  speakingExperience: string[];
  publications: string[];
  references: string[];
  usContacts: string[];
}

export interface EligibilityResult {
  status: 'likely-eligible' | 'borderline' | 'not-likely-eligible';
  confidence: number;
  visaType: 'EB-1A' | 'O-1' | 'both' | 'none';
  reasoning: string[];
  nextSteps: string[];
}

export interface PaymentPlan {
  id: string;
  name: string;
  price: number;
  features: string[];
  popular?: boolean;
}

export interface Document {
  id: string;
  name: string;
  type: 'resume' | 'award' | 'media' | 'publication' | 'reference';
  url: string;
  uploadedAt: Date;
}

export interface FormData {
  currentStep: number;
  totalSteps: number;
  data: Partial<EligibilityData>;
} 