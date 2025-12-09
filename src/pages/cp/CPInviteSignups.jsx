import React, { useState, useEffect } from 'react';
import { FiSearch, FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import CPHeader from '../../components/cp/CPHeader';
import cpInviteService from '../../services/cpInviteService';
import '../../styles/admin/cp/CPInviteSignups.css';

const CPInviteSignups = () => {
  const navigate = useNavigate();
  const [signups, setSignups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchSignups();
  }, [statusFilter]);

  const fetchSignups = async () => {
    try {
      setLoading(true);
      const filterStatus = statusFilter === 'all' ? null : statusFilter;
      const result = await cpInviteService.getInviteSignups(filterStatus, null);
      
      if (result.success) {
        setSignups(result.data);
      } else {
        toast.error('Failed to load signups');
      }
    } catch (error) {
      toast.error(error.error || 'Failed to load signups');
    } finally {
      setLoading(false);
    }
  };

  const filteredSignups = signups.filter(signup => {
    if (!searchTerm) return true;
    
    const search = searchTerm.toLowerCase();
    return (
      signup.customer_name.toLowerCase().includes(search) ||
      signup.customer_phone.toLowerCase().includes(search) ||
      signup.customer_email.toLowerCase().includes(search)
    );
  });

  const getStatusBadge = (status) => {
    const badges = {
      signed_up: { class: 'signup-status-badge warning', icon: '👤', text: 'Signed Up' },
      invested: { class: 'signup-status-badge success', icon: '💰', text: 'Invested' },
    };
    return badges[status] || badges.signed_up;
  };

  if (loading) {
    return (
      <div className="cp-invite-signups-page">
        <CPHeader />
        <div className="loading-state-dash">
          <div className="loading-spinner">Loading signups...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="cp-invite-signups-page">
      <CPHeader />

      <div className="cp-invite-signups-container">
        {/* Header */}
        <div className="signups-header">
          <div>
            <button className="btn-back-signups" onClick={() => navigate('/cp/permanent-invite')}>
              <FiArrowLeft size={20} />
              Back to Referral Link
            </button>
            <h1>Referral Signups</h1>
            <p>Users who signed up using your permanent referral link</p>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="signups-controls">
          <div className="filter-tabs-signups">
            <button
              className={`filter-tab-signup ${statusFilter === 'all' ? 'active' : ''}`}
              onClick={() => setStatusFilter('all')}
            >
              All ({signups.length})
            </button>
            <button
              className={`filter-tab-signup ${statusFilter === 'signed_up' ? 'active' : ''}`}
              onClick={() => setStatusFilter('signed_up')}
            >
              Signed Up ({signups.filter(s => s.status === 'signed_up').length})
            </button>
            <button
              className={`filter-tab-signup ${statusFilter === 'invested' ? 'active' : ''}`}
              onClick={() => setStatusFilter('invested')}
            >
              Invested ({signups.filter(s => s.status === 'invested').length})
            </button>
          </div>

          <div className="search-box-signups">
            <FiSearch size={18} />
            <input
              type="text"
              placeholder="Search by name, phone, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Empty State */}
        {filteredSignups.length === 0 && !loading && (
          <div className="empty-state-signups">
            <div className="empty-icon-signups">👥</div>
            <h3>No Signups Yet</h3>
            <p>Share your referral link to start getting signups</p>
            <button 
              className="btn-primary"
              onClick={() => navigate('/cp/permanent-invite')}
            >
              View Referral Link
            </button>
          </div>
        )}

        {/* Signups Table */}
        {filteredSignups.length > 0 && (
          <div className="signups-table-container">
            <table className="signups-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Contact</th>
                  <th>Signup Date</th>
                  <th>Status</th>
                  <th>Investments</th>
                  <th>Total Invested</th>
                  <th>Commission Earned</th>
                </tr>
              </thead>
              <tbody>
                {filteredSignups.map((signup) => {
                  const badge = getStatusBadge(signup.status);
                  
                  return (
                    <tr key={signup.id}>
                      <td>
                        <div className="customer-cell-signup">
                          <strong>{signup.customer_name}</strong>
                        </div>
                      </td>
                      <td>
                        <div className="contact-cell-signup">
                          <span>{cpInviteService.formatPhone(signup.customer_phone)}</span>
                          <small>{signup.customer_email}</small>
                        </div>
                      </td>
                      <td>{cpInviteService.formatDate(signup.signup_date)}</td>
                      <td>
                        <span className={badge.class}>
                          {badge.icon} {badge.text}
                        </span>
                      </td>
                      <td className="text-center-signup">
                        {signup.investment_count}
                      </td>
                      <td className="amount-cell-signup">
                        {signup.has_invested 
                          ? cpInviteService.formatCurrency(signup.total_invested)
                          : '-'
                        }
                      </td>
                      <td className="commission-cell-signup">
                        {signup.commission_earned > 0
                          ? cpInviteService.formatCurrency(signup.commission_earned)
                          : '-'
                        }
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CPInviteSignups;