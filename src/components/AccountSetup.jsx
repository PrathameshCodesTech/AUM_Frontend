import React, { useState } from 'react';
import Step2PersonalDetails from '../setup-steps/Step2PersonalDetails';
import Step3KYC from '../setup-steps/Step3KYC';
import '../styles/AccountSetup.css';

const AccountSetup = ({ onComplete, onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);

  const handleNext = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const steps = [
    { number: 1, label: 'Personal Details', component: Step2PersonalDetails },
    { number: 2, label: 'KYC Verification', component: Step3KYC },
  ];

  const CurrentStepComponent = steps[currentStep - 1].component;
  const progress = (currentStep / steps.length) * 100;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>

        {/* Progress Bar */}
        <div className="setup-progress">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
          <div className="progress-steps">
            {steps.map((step) => (
              <div
                key={step.number}
                className={`progress-step ${currentStep >= step.number ? 'active' : ''} ${
                  currentStep === step.number ? 'current' : ''
                }`}
              >
                <div className="step-circle">{step.number}</div>
                <span className="step-label">{step.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Current Step Content */}
        <div className="step-content">
          <CurrentStepComponent onNext={handleNext} onPrevious={handlePrevious} />
        </div>
      </div>
    </div>
  );
};

export default AccountSetup;