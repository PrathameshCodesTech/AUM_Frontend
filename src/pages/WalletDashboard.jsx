import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import walletService from '../services/walletService';
import '../styles/WalletDashboard.css';

const WalletDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [walletData, setWalletData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [showAddFundsModal, setShowAddFundsModal] = useState(false);
  const [amount, setAmount] = useState('');
  const [addingFunds, setAddingFunds] = useState(false);

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    setLoading(true);
    try {
      // Get or create wallet
      const balanceResponse = await walletService.getBalance();
      
      if (balanceResponse.success) {
        setWalletData(balanceResponse.data);
      }

      // Fetch transactions
      const txnResponse = await walletService.getTransactions();
      if (txnResponse.success) {
        setTransactions(txnResponse.data);
      }
    } catch (error) {
      // If wallet doesn't exist, create it
      if (error.message?.includes('not found')) {
        try {
          await walletService.createWallet();
          fetchWalletData(); // Retry after creating wallet
        } catch (createError) {
          toast.error('Failed to create wallet');
        }
      } else {
        toast.error(error.message || 'Failed to load wallet data');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddFunds = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setAddingFunds(true);
    try {
      // Mock payment - in real scenario, integrate Razorpay here
      const mockPaymentId = `mock_${Date.now()}`;
      
      const response = await walletService.addFunds(amount, 'mock_payment', mockPaymentId);
      
      if (response.success) {
        toast.success('Funds added successfully!');
        setShowAddFundsModal(false);
        setAmount('');
        fetchWalletData(); // Refresh wallet data
      }
    } catch (error) {
      toast.error(error.message || 'Failed to add funds');
    } finally {
      setAddingFunds(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTransactionIcon = (type) => {
    if (type === 'credit') {
      return (
        <div className="txn-icon credit">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 5V19M5 12L12 5L19 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      );
    }
    return (
      <div className="txn-icon debit">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M12 19V5M5 12L12 19L19 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    );
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      completed: 'success',
      pending: 'warning',
      failed: 'error',
      processing: 'info'
    };
    
    return (
      <span className={`status-badge ${statusColors[status] || 'default'}`}>
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="wallet-loading">
        <div className="loading-spinner">Loading wallet...</div>
      </div>
    );
  }

  return (
    <div className="wallet-dashboard-page">
      <div className="wallet-container">
        <div className="wallet-header">
          <div>
            <h1>Digital Assets Wallet</h1>
            <p className="wallet-subtitle">Manage your funds and investments</p>
          </div>
          <button className="btn-primary" onClick={() => setShowAddFundsModal(true)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Add Funds
          </button>
        </div>

        {/* Balance Cards */}
        <div className="balance-cards">
          <div className="balance-card main">
            <div className="balance-header">
              <span className="balance-label">Available Balance</span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
                <path d="M2 10H22" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
            <div className="balance-amount">{formatCurrency(walletData?.balance || 0)}</div>
            <div className="balance-footer">
              <span className="balance-info">Last updated: Just now</span>
            </div>
          </div>

          <div className="balance-card">
            <div className="balance-header">
              <span className="balance-label">Ledger Balance</span>
            </div>
            <div className="balance-amount secondary">
              {formatCurrency(walletData?.ledger_balance || 0)}
            </div>
            <div className="balance-footer">
              <span className="balance-info">Including pending</span>
            </div>
          </div>

          <div className="balance-card">
            <div className="balance-header">
              <span className="balance-label">Quick Actions</span>
            </div>
            <div className="quick-actions">
              <button className="action-btn" onClick={() => navigate('/properties')}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2"/>
                </svg>
                Browse Properties
              </button>
              <button className="action-btn" onClick={() => navigate('/portfolio')}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
                  <rect x="14" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
                  <rect x="3" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
                  <rect x="14" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
                </svg>
                My Portfolio
              </button>
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div className="transactions-section">
          <div className="section-header">
            <h2>Transaction History</h2>
            <span className="txn-count">{transactions.length} transactions</span>
          </div>

          {transactions.length === 0 ? (
            <div className="no-transactions">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                <path d="M9 11L12 14L22 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M21 12V19C21 19.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <p>No transactions yet</p>
              <button className="btn-secondary" onClick={() => setShowAddFundsModal(true)}>
                Add Funds to Get Started
              </button>
            </div>
          ) : (
            <div className="transactions-list">
              {transactions.map((txn) => (
                <div key={txn.id} className="transaction-item">
                  {getTransactionIcon(txn.transaction_type)}
                  
                  <div className="txn-details">
                    <div className="txn-main">
                      <span className="txn-purpose">{txn.purpose}</span>
                      {getStatusBadge(txn.status)}
                    </div>
                    <div className="txn-meta">
                      <span className="txn-id">#{txn.transaction_id}</span>
                      <span className="txn-date">{formatDate(txn.created_at)}</span>
                    </div>
                    {txn.description && (
                      <span className="txn-description">{txn.description}</span>
                    )}
                  </div>

                  <div className={`txn-amount ${txn.transaction_type}`}>
                    {txn.transaction_type === 'credit' ? '+' : '-'}
                    {formatCurrency(txn.amount)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Funds Modal */}
      {showAddFundsModal && (
        <div className="modal-overlay" onClick={() => setShowAddFundsModal(false)}>
          <div className="modal-content add-funds-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowAddFundsModal(false)}>
              ×
            </button>
            
            <h2>Add Funds to Wallet</h2>
            <p className="modal-subtitle">Enter the amount you want to add</p>

            <div className="input-group">
              <label>Amount (₹)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                min="1"
                step="1"
              />
            </div>

            <div className="quick-amounts">
              <button onClick={() => setAmount('5000')}>₹5,000</button>
              <button onClick={() => setAmount('10000')}>₹10,000</button>
              <button onClick={() => setAmount('25000')}>₹25,000</button>
              <button onClick={() => setAmount('50000')}>₹50,000</button>
            </div>

            <div className="payment-note">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 16V12M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <span>This is a mock payment for testing. In production, you'll be redirected to payment gateway.</span>
            </div>

            <div className="modal-actions">
              <button 
                className="btn-cancel" 
                onClick={() => setShowAddFundsModal(false)}
                disabled={addingFunds}
              >
                Cancel
              </button>
              <button 
                className="btn-confirm" 
                onClick={handleAddFunds}
                disabled={addingFunds || !amount}
              >
                {addingFunds ? 'Processing...' : 'Add Funds'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletDashboard;