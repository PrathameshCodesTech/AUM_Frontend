import React from 'react';
import '../../styles/admin/InvestmentWorkflowProgress.css';

const InvestmentWorkflowProgress = ({ investment }) => {
  const steps = [
    {
      key: 'submitted',
      label: 'Payment Submitted',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M9 11L12 14L22 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M21 12V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      completed: true
    },
    {
      key: 'payment_verified',
      label: 'Payment Verified',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
          <path d="M2 10H22" stroke="currentColor" strokeWidth="2"/>
        </svg>
      ),
      completed: ['payment_approved', 'approved', 'completed'].includes(investment.status)
    },
    {
      key: 'investment_approved',
      label: 'Investment Approved',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.7088 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.85999" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M22 4L12 14.01L9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      completed: ['approved', 'completed'].includes(investment.status)
    },
    {
      key: 'completed',
      label: 'Completed',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.7088 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.85999" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M22 4L12 14.01L9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      completed: investment.payment_completed
    }
  ];

  const getCurrentStep = () => {
    if (investment.payment_completed) return 3;
    if (investment.status === 'approved') return 2;
    if (investment.status === 'payment_approved') return 1;
    if (investment.status === 'pending_payment') return 0;
    return 0;
  };

  const currentStep = getCurrentStep();

  return (
    <div className="investment-workflow">
      <div className="workflow-steps">
        {steps.map((step, index) => (
          <React.Fragment key={step.key}>
            <div className={`workflow-step ${step.completed ? 'completed' : ''} ${index === currentStep ? 'current' : ''}`}>
              <div className="step-icon">
                {step.icon}
              </div>
              <div className="step-content">
                <span className="step-label">{step.label}</span>
                {step.completed && (
                  <span className="step-status">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                      <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                    </svg>
                    Done
                  </span>
                )}
                {!step.completed && index === currentStep && (
                  <span className="step-status pending">In Progress</span>
                )}
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className={`workflow-connector ${step.completed ? 'completed' : ''}`} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default InvestmentWorkflowProgress;