// CPLeads.jsx
// =====================================================
// CP Leads Management Page
// Full CRUD: Create, Read, Update, Delete, Convert leads
// =====================================================

import React, { useState, useEffect } from 'react';
import { FiPlus, FiSearch, FiFilter } from 'react-icons/fi';
import CPHeader from '../../components/cp/CPHeader';
import CPLeadCard from '../../components/cp/CPLeadCard';
import CPLeadForm from '../../components/cp/CPLeadForm';
import cpLeadService from '../../services/cpLeadService';
import '../../styles/cp/CPLeads.css';

const CPLeads = () => {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filters
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Form modal
  const [showForm, setShowForm] = useState(false);
  const [editingLead, setEditingLead] = useState(null);

  useEffect(() => {
    fetchLeads();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [leads, statusFilter, searchQuery]);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const result = await cpLeadService.getLeads();
      
      if (result.success) {
        setLeads(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to load leads');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...leads];

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(lead => lead.lead_status === statusFilter);
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(lead => 
        lead.name?.toLowerCase().includes(query) ||
        lead.email?.toLowerCase().includes(query) ||
        lead.phone?.includes(query) ||
        lead.notes?.toLowerCase().includes(query)
      );
    }

    setFilteredLeads(filtered);
  };

  const handleAddLead = () => {
    setEditingLead(null);
    setShowForm(true);
  };

  const handleEditLead = (lead) => {
    setEditingLead(lead);
    setShowForm(true);
  };

  const handleDeleteLead = async (leadId) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) {
      return;
    }

    try {
      const result = await cpLeadService.deleteLead(leadId);
      
      if (result.success) {
        setLeads(prev => prev.filter(l => l.id !== leadId));
      } else {
        alert(result.error || 'Failed to delete lead');
      }
    } catch (err) {
      alert('Failed to delete lead');
    }
  };

  const handleFormSubmit = async (leadData) => {
    try {
      let result;
      
      if (editingLead) {
        result = await cpLeadService.updateLead(editingLead.id, leadData);
      } else {
        result = await cpLeadService.createLead(leadData);
      }

      if (result.success) {
        fetchLeads(); // Refresh list
        setShowForm(false);
        setEditingLead(null);
      } else {
        alert(result.error || 'Failed to save lead');
      }
    } catch (err) {
      alert('Failed to save lead');
    }
  };

  const handleConvertLead = async (leadId) => {
    // This will be called from CPLeadCard
    fetchLeads(); // Refresh after conversion
  };

  // Get status counts
const statusCounts = {
  all: leads.length,
  new: leads.filter(l => l.lead_status === 'new').length,
  contacted: leads.filter(l => l.lead_status === 'contacted').length,
  interested: leads.filter(l => l.lead_status === 'interested').length,
  site_visit_scheduled: leads.filter(l => l.lead_status === 'site_visit_scheduled').length,
  converted: leads.filter(l => l.lead_status === 'converted').length,
  lost: leads.filter(l => l.lead_status === 'lost').length
};

  const statusOptions = cpLeadService.getStatusOptions();

  if (loading) {
    return (
      <div className="cp-leads-page">
        <CPHeader />
        <div className="loading-state-dash">
          <div className="loading-spinner">Loading leads...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="cp-leads-page">
      <CPHeader />

      <div className="cp-leads-container">
        {/* Header */}
        <div className="leads-header">
          <div>
            <h1>Lead Management</h1>
            <p>Track and manage your sales leads</p>
          </div>
          <button className="btn-add-lead" onClick={handleAddLead}>
            <FiPlus size={20} />
            Add New Lead
          </button>
        </div>

        {/* Filters & Search */}
        <div className="leads-controls">
          {/* Status Filter Tabs */}
          <div className="status-tabs">
            <button
              className={`status-tab ${statusFilter === 'all' ? 'active' : ''}`}
              onClick={() => setStatusFilter('all')}
            >
              All <span className="count-badge">{statusCounts.all}</span>
            </button>
            <button
              className={`status-tab ${statusFilter === 'new' ? 'active' : ''}`}
              onClick={() => setStatusFilter('new')}
            >
              New <span className="count-badge">{statusCounts.new}</span>
            </button>
            <button
              className={`status-tab ${statusFilter === 'contacted' ? 'active' : ''}`}
              onClick={() => setStatusFilter('contacted')}
            >
              Contacted <span className="count-badge">{statusCounts.contacted}</span>
            </button>
            <button
              className={`status-tab ${statusFilter === 'interested' ? 'active' : ''}`}
              onClick={() => setStatusFilter('interested')}
            >
              Interested <span className="count-badge">{statusCounts.interested}</span>
            </button>
            <button
              className={`status-tab ${statusFilter === 'converted' ? 'active' : ''}`}
              onClick={() => setStatusFilter('converted')}
            >
              Converted <span className="count-badge success">{statusCounts.converted}</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="search-bar-leads">
            <FiSearch size={20} />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Stats Summary */}
        <div className="leads-stats-bar">
          <div className="stat-item-bar">
            <span className="stat-label-bar">Total Leads</span>
            <span className="stat-value-bar">{statusCounts.all}</span>
          </div>
          <div className="stat-item-bar">
            <span className="stat-label-bar">Converted</span>
            <span className="stat-value-bar success">{statusCounts.converted}</span>
          </div>
          <div className="stat-item-bar">
            <span className="stat-label-bar">Conversion Rate</span>
            <span className="stat-value-bar">
              {statusCounts.all > 0 ? ((statusCounts.converted / statusCounts.all) * 100).toFixed(1) : 0}%
            </span>
          </div>
          <div className="stat-item-bar">
            <span className="stat-label-bar">Active</span>
            <span className="stat-value-bar info">
              {statusCounts.all - statusCounts.converted - statusCounts.lost}
            </span>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="error-banner-leads">
            <span>{error}</span>
            <button onClick={fetchLeads}>Retry</button>
          </div>
        )}

        {/* Empty State */}
        {filteredLeads.length === 0 && !loading && !error && (
          <div className="empty-state-leads">
            {searchQuery || statusFilter !== 'all' ? (
              <>
                <FiSearch size={60} color="#cccccc" />
                <h3>No Leads Found</h3>
                <p>Try adjusting your filters or search query</p>
                <button 
                  className="btn-clear-filters"
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('all');
                  }}
                >
                  Clear Filters
                </button>
              </>
            ) : (
              <>
                <FiPlus size={60} color="#cccccc" />
                <h3>No Leads Yet</h3>
                <p>Start adding leads to track your sales pipeline</p>
                <button className="btn-add-first" onClick={handleAddLead}>
                  Add Your First Lead
                </button>
              </>
            )}
          </div>
        )}

        {/* Leads Grid */}
        {filteredLeads.length > 0 && (
          <div className="leads-grid">
            {filteredLeads.map((lead) => (
              <CPLeadCard
                key={lead.id}
                lead={lead}
                onEdit={handleEditLead}
                onDelete={handleDeleteLead}
                onConvert={handleConvertLead}
              />
            ))}
          </div>
        )}
      </div>

      {/* Lead Form Modal */}
      {showForm && (
        <CPLeadForm
          lead={editingLead}
          onSubmit={handleFormSubmit}
          onClose={() => {
            setShowForm(false);
            setEditingLead(null);
          }}
        />
      )}
    </div>
  );
};

export default CPLeads;