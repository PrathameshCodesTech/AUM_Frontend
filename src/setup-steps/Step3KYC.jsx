import React, { useState } from 'react';
import toast from 'react-hot-toast';
import kycService from '../services/kycService';

const Step3KYC = ({ onNext, onPrevious }) => {
  const [subStep, setSubStep] = useState(1); // 1: Aadhaar, 2: PAN, 3: Bank
  const [loading, setLoading] = useState(false);
  const [retriesLeft, setRetriesLeft] = useState(5);

  // Aadhaar
  const [aadhaarFile, setAadhaarFile] = useState(null);
  const [yob, setYob] = useState('');
  const [fullName, setFullName] = useState('');
  const [aadhaarVerified, setAadhaarVerified] = useState(false);

  // PAN
  const [panNumber, setPanNumber] = useState('');
  const [panVerified, setPanVerified] = useState(false);
  const [panAadhaarLinked, setPanAadhaarLinked] = useState(false);

  // Bank
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [bankVerified, setBankVerified] = useState(false);

  // ==================== ICONS ====================
  const renderIcon = (iconName) => {
    const icons = {
      document: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M14 2V8H20" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      lock: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <rect x="3" y="11" width="18" height="11" rx="2" strokeWidth="2"/>
          <path d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11" strokeWidth="2"/>
        </svg>
      ),
      warning: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M10.29 3.86L1.82 18C1.64537 18.3024 1.55296 18.6453 1.55199 18.9945C1.55101 19.3437 1.64151 19.6871 1.81445 19.9905C1.98738 20.2939 2.23675 20.5467 2.53773 20.7239C2.83871 20.901 3.18082 20.9962 3.53 21H20.47C20.8192 20.9962 21.1613 20.901 21.4623 20.7239C21.7633 20.5467 22.0126 20.2939 22.1856 19.9905C22.3585 19.6871 22.449 19.3437 22.448 18.9945C22.447 18.6453 22.3546 18.3024 22.18 18L13.71 3.86C13.5317 3.56611 13.2807 3.32312 12.9812 3.15448C12.6817 2.98585 12.3437 2.89725 12 2.89725C11.6563 2.89725 11.3183 2.98585 11.0188 3.15448C10.7193 3.32312 10.4683 3.56611 10.29 3.86V3.86Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 9V13M12 17H12.01" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      card: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <rect x="1" y="4" width="22" height="16" rx="2" strokeWidth="2"/>
          <path d="M1 10H23" strokeWidth="2"/>
        </svg>
      ),
      check: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M20 6L9 17L4 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      bank: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M3 21H21M3 10H21M5 6L12 3L19 6M4 10V21M8 10V21M12 10V21M16 10V21M20 10V21" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      money: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="10" strokeWidth="2"/>
          <path d="M12 6V12L16 14" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      skip: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M5 4L19 12L5 20V4Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M19 5V19" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    };
    return icons[iconName] || null;
  };

  // ==================== AADHAAR ====================
  const handleAadhaarUpload = async () => {
    if (!aadhaarFile) {
      toast.error('Please select an Aadhaar PDF file');
      return;
    }

    if (!yob || yob.length !== 4) {
      toast.error('Please enter your Year of Birth (4 digits)');
      return;
    }

    if (!fullName || fullName.trim().length < 3) {
      toast.error('Please enter your Full Name');
      return;
    }

    if (aadhaarFile.size > 5 * 1024 * 1024) {
      toast.error('File size should be less than 5MB');
      return;
    }

    setLoading(true);
    try {
      const response = await kycService.uploadAadhaar(aadhaarFile, yob, fullName);

      if (response.success) {
        toast.success('Aadhaar verified successfully!');
        setAadhaarVerified(true);
        setSubStep(2); // Move to PAN verification
      }
    } catch (error) {
      if (error.error === 'retry_limit_exceeded') {
        toast.error(error.message);
        setRetriesLeft(0);
      } else {
        toast.error(error.message || error.errors?.pdf_file?.[0] || 'Aadhaar verification failed');
        if (error.retries_left !== undefined) {
          setRetriesLeft(error.retries_left);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  // ==================== PAN ====================
  const handlePANVerify = async () => {
    if (!panNumber || panNumber.length !== 10) {
      toast.error('Please enter a valid 10-character PAN number');
      return;
    }

    setLoading(true);
    try {
      const response = await kycService.verifyPAN(panNumber);

      if (response.success) {
        toast.success('PAN verified successfully!');
        setPanVerified(true);
        setPanAadhaarLinked(response.data?.aadhaar_linked || false);
        
        if (!response.data?.aadhaar_linked) {
          toast('PAN and Aadhaar are not linked. Please link them for full access.', {
            duration: 5000,
            icon: '⚠️',
          });
        }
        
        setSubStep(3); // Move to Bank verification
      }
    } catch (error) {
      toast.error(error.message || 'PAN verification failed');
    } finally {
      setLoading(false);
    }
  };

  // ==================== BANK ====================
  const handleBankVerify = async () => {
    if (!accountNumber || !ifscCode) {
      toast.error('Please enter account number and IFSC code');
      return;
    }

    if (ifscCode.length !== 11) {
      toast.error('IFSC code should be 11 characters');
      return;
    }

    setLoading(true);
    try {
      const response = await kycService.verifyBank(accountNumber, ifscCode);

      if (response.success) {
        toast.success('Bank account verified successfully!');
        setBankVerified(true);
        onNext(); // Complete KYC
      }
    } catch (error) {
      toast.error(error.message || 'Bank verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSkipBank = async () => {
    try {
      await kycService.skipBank();
      toast.success('Bank verification skipped. You can add it later.');
      onNext(); // Complete KYC without bank
    } catch (error) {
      toast.error('Failed to skip bank verification');
    }
  };

  // ==================== RENDER ====================
  return (
    <div className="step-form">
      {/* Sub-step Progress */}
      <div className="kyc-substep-progress">
        <div className={`substep-indicator ${subStep >= 1 ? 'active' : ''}`}>
          <span>1</span>
          <label>Aadhaar</label>
        </div>
        <div className="substep-line"></div>
        <div className={`substep-indicator ${subStep >= 2 ? 'active' : ''}`}>
          <span>2</span>
          <label>PAN</label>
        </div>
        <div className="substep-line"></div>
        <div className={`substep-indicator ${subStep >= 3 ? 'active' : ''}`}>
          <span>3</span>
          <label>Bank</label>
        </div>
      </div>

      {/* ==================== SUB-STEP 1: AADHAAR ==================== */}
      {subStep === 1 && (
        <div className="kyc-substep">
          <h3>Upload Aadhaar Card</h3>
          <p className="form-subtitle">Please upload your eAadhaar PDF file and provide details</p>

          <div className="form-row">
            <div className="form-group">
              <label>Full Name (as on Aadhaar) *</label>
              <input
                type="text"
                placeholder="Enter full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>Year of Birth *</label>
              <input
                type="text"
                placeholder="YYYY (e.g., 1990)"
                value={yob}
                onChange={(e) => setYob(e.target.value.replace(/\D/g, ''))}
                maxLength="4"
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Aadhaar PDF File *</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setAadhaarFile(e.target.files[0])}
              disabled={loading || retriesLeft === 0}
            />
            {aadhaarFile && (
              <span className="file-name">{aadhaarFile.name}</span>
            )}
          </div>

          <div className="info-box">
            <p className="info-item">
              {renderIcon('document')} Upload eAadhaar PDF (Max 5MB)
            </p>
            <p className="info-item">
              {renderIcon('lock')} Your data is encrypted and secure
            </p>
            {retriesLeft < 5 && retriesLeft > 0 && (
              <p className="info-item retry-warning">
                {renderIcon('warning')} Retries left: {retriesLeft}
              </p>
            )}
            {retriesLeft === 0 && (
              <p className="info-item retry-error">
                {renderIcon('warning')} Maximum retries reached. Please try again after 10 minutes.
              </p>
            )}
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onPrevious} disabled={loading}>
              Previous
            </button>
            <button
              type="button"
              className="btn-primary"
              onClick={handleAadhaarUpload}
              disabled={loading || !aadhaarFile || !yob || !fullName || retriesLeft === 0}
            >
              {loading ? 'Verifying...' : 'Verify Aadhaar'}
            </button>
          </div>
        </div>
      )}

      {/* ==================== SUB-STEP 2: PAN ==================== */}
      {subStep === 2 && (
        <div className="kyc-substep">
          <h3>Verify PAN Card</h3>
          <p className="form-subtitle">Enter your PAN card number</p>

          <div className="form-group">
            <label>PAN Number *</label>
            <input
              type="text"
              placeholder="ABCDE1234F"
              value={panNumber}
              onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
              maxLength="10"
              disabled={loading}
              style={{ textTransform: 'uppercase' }}
            />
          </div>

          <div className="info-box">
            <p className="info-item">
              {renderIcon('card')} Enter 10-character PAN number
            </p>
            <p className="info-item">
              {renderIcon('check')} Will be verified with Income Tax Department
            </p>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={() => setSubStep(1)} disabled={loading}>
              Previous
            </button>
            <button
              type="button"
              className="btn-primary"
              onClick={handlePANVerify}
              disabled={loading || panNumber.length !== 10}
            >
              {loading ? 'Verifying...' : 'Verify PAN'}
            </button>
          </div>
        </div>
      )}

      {/* ==================== SUB-STEP 3: BANK ==================== */}
      {subStep === 3 && (
        <div className="kyc-substep">
          <h3>Verify Bank Account (Optional)</h3>
          <p className="form-subtitle">Add your bank account for withdrawals</p>

          <div className="form-row">
            <div className="form-group">
              <label>Account Number</label>
              <input
                type="text"
                placeholder="1234567890"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>IFSC Code</label>
              <input
                type="text"
                placeholder="SBIN0001234"
                value={ifscCode}
                onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                maxLength="11"
                disabled={loading}
                style={{ textTransform: 'uppercase' }}
              />
            </div>
          </div>

          <div className="info-box">
            <p className="info-item">
              {renderIcon('bank')} Bank verification is optional
            </p>
            <p className="info-item">
              {renderIcon('money')} Required for investment withdrawals
            </p>
            <p className="info-item">
              {renderIcon('skip')} You can skip and add later
            </p>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={() => setSubStep(2)} disabled={loading}>
              Previous
            </button>
            <button
              type="button"
              className="btn-tertiary"
              onClick={handleSkipBank}
              disabled={loading}
            >
              Skip for Now
            </button>
            <button
              type="button"
              className="btn-primary"
              onClick={handleBankVerify}
              disabled={loading || !accountNumber || !ifscCode}
            >
              {loading ? 'Verifying...' : 'Verify Bank'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Step3KYC;