import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import EligibilityForm from './pages/EligibilityForm';
import EligibilityResult from './pages/EligibilityResult';
import Paywall from './pages/Paywall';
import DocumentIntake from './pages/DocumentIntake';
import SecondOpinion from './pages/SecondOpinion';
import Dashboard from './pages/Dashboard';
import EB1AForm from './pages/EB1AForm';

function App() {
  return (
    <Router>
      <div className="App min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/eligibility" element={<EligibilityForm />} />
          <Route path="/result" element={<EligibilityResult />} />
          <Route path="/paywall" element={<Paywall />} />
          <Route path="/documents" element={<DocumentIntake />} />
          <Route path="/second-opinion" element={<SecondOpinion />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/eb1a-form" element={<EB1AForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
