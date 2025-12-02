import React, { useState, useRef } from 'react';
import toast from 'react-hot-toast';
import adminService from '../../services/adminService';
import '../../styles/admin/PropertyDocuments.css';

const PropertyDocuments = ({ propertyId, documents = [], onDocumentsUpdate }) => {
  const [uploading, setUploading] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    document_type: 'prospectus',
    is_public: false,
    file: null
  });
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, file }));
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!formData.file || !formData.title) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setUploading(true);
    
    try {
      const uploadData = new FormData();
      uploadData.append('title', formData.title);
      uploadData.append('document_type', formData.document_type);
      uploadData.append('is_public', formData.is_public);
      uploadData.append('file', formData.file);
      
      const response = await adminService.uploadPropertyDocument(propertyId, uploadData);
      
      if (response.success) {
        toast.success('Document uploaded successfully');
        setShowUploadForm(false);
        setFormData({
          title: '',
          document_type: 'prospectus',
          is_public: false,
          file: null
        });
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        if (onDocumentsUpdate) {
          onDocumentsUpdate();
        }
      }
    } catch (error) {
      console.error('❌ Error uploading document:', error);
      toast.error('Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (documentId) => {
    if (!window.confirm('Are you sure you want to delete this document?')) {
      return;
    }
    
    try {
      const response = await adminService.deletePropertyDocument(propertyId, documentId);
      
      if (response.success) {
        toast.success('Document deleted successfully');
        if (onDocumentsUpdate) {
          onDocumentsUpdate();
        }
      }
    } catch (error) {
      console.error('❌ Error deleting document:', error);
      toast.error('Failed to delete document');
    }
  };

  const getDocumentIcon = (type) => {
    const icons = {
      prospectus: '📄',
      legal: '⚖️',
      approval: '✅',
      plan: '📐',
      brochure: '📘',
      agreement: '📝',
      other: '📎'
    };
    return icons[type] || '📎';
  };

  return (
    <div className="property-documents">
      <div className="documents-header">
        <h3>📁 Documents</h3>
        <button 
          className="btn-upload"
          onClick={() => setShowUploadForm(!showUploadForm)}
        >
          {showUploadForm ? 'Cancel' : '+ Add Document'}
        </button>
      </div>

      {showUploadForm && (
        <form className="document-upload-form" onSubmit={handleUpload}>
          <div className="form-group">
            <label>Document Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., Property Prospectus"
              required
            />
          </div>

          <div className="form-group">
            <label>Document Type *</label>
            <select
              name="document_type"
              value={formData.document_type}
              onChange={handleInputChange}
              required
            >
              <option value="prospectus">Prospectus</option>
              <option value="legal">Legal Document</option>
              <option value="approval">Government Approval</option>
              <option value="plan">Floor Plan</option>
              <option value="brochure">Brochure</option>
              <option value="agreement">Agreement</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>File *</label>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileSelect}
              required
            />
            {formData.file && (
              <span className="file-name">Selected: {formData.file.name}</span>
            )}
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="is_public"
                checked={formData.is_public}
                onChange={handleInputChange}
              />
              <span>Make document publicly accessible</span>
            </label>
          </div>

          <button 
            type="submit" 
            className="btn-submit"
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Upload Document'}
          </button>
        </form>
      )}

      {documents.length === 0 ? (
        <div className="documents-empty">
          <p>No documents uploaded yet</p>
        </div>
      ) : (
        <div className="documents-list">
          {documents.map((doc) => (
            <div key={doc.id} className="document-item">
              <div className="document-icon">
                {getDocumentIcon(doc.document_type)}
              </div>
              <div className="document-info">
                <h4>{doc.title}</h4>
                <div className="document-meta">
                  <span className="doc-type">{doc.document_type}</span>
                  {doc.is_public && <span className="doc-public">Public</span>}
                  <span className="doc-date">
                    {new Date(doc.created_at).toLocaleDateString('en-IN')}
                  </span>
                </div>
              </div>
              <div className="document-actions">
                <a 
                  href={doc.file_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-view-doc"
                  title="View Document"
                >
                  👁️
                </a>
                <button 
                  className="btn-delete-doc"
                  onClick={() => handleDelete(doc.id)}
                  title="Delete"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PropertyDocuments;