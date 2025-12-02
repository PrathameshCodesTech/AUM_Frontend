import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import adminService from '../../services/adminService';
import '../../styles/admin/AdminProperties.css';

const AdminPropertyForm = () => {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!propertyId;
  
  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [property, setProperty] = useState(null); // ✅ FIXED: Added property state
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
  // Basic Info
  name: '',
  slug: '',
  description: '',
  builder_name: '',
  
  // Location
  address: '',
  city: '',
  state: '',
  country: 'India',
  locality: '',
  pincode: '',
  latitude: '',
  longitude: '',
  
  // Property Type
  property_type: 'residential',
  
  // Specifications
  total_area: '',
  total_units: '',
  available_units: '',
  
  // Pricing
  price_per_unit: '',
  minimum_investment: '',
  maximum_investment: '',
  target_amount: '',
  
  // Returns
  expected_return_percentage: '',
  gross_yield: '',
  potential_gain: '',
  expected_return_period: '',
  
  // Tenure
  lock_in_period: '',
  project_duration: '',
  
  // Dates
  launch_date: '',
  funding_start_date: '',
  funding_end_date: '',
  possession_date: '',
  
  // Status
  status: 'draft',
  is_featured: false,
  is_published: false,
  is_public_sale: true,
  is_presale: false,
  
  // Features (will be JSON)
  amenities: [],
  highlights: [],
  
  // SEO
  meta_title: '',
  meta_description: '',
});

  useEffect(() => {
    if (isEditMode) {
      fetchPropertyDetail();
    }
  }, [propertyId]);

  const fetchPropertyDetail = async () => {
    setLoading(true);
    try {
      const response = await adminService.getPropertyDetail(propertyId);
      
      if (response.success) {
        const propertyData = response.data;
        setProperty(propertyData); // ✅ FIXED: Store property data
        
        setFormData({
          name: propertyData.name || '',
          slug: propertyData.slug || '',
          description: propertyData.description || '',
          builder_name: propertyData.builder_name || '',
          
          // Location
          address: propertyData.address || '',
          city: propertyData.city || '',
          state: propertyData.state || '',
          country: propertyData.country || 'India',
          locality: propertyData.locality || '',
          pincode: propertyData.pincode || '',
          latitude: propertyData.latitude || '',
          longitude: propertyData.longitude || '',
          
          // Property Type
          property_type: propertyData.property_type || 'residential',
          
          // Specifications
          total_area: propertyData.total_area || '',
          total_units: propertyData.total_units || '',
          available_units: propertyData.available_units || '',
          
          // Pricing
          price_per_unit: propertyData.price_per_unit || '',
          minimum_investment: propertyData.minimum_investment || '',
          maximum_investment: propertyData.maximum_investment || '',
          target_amount: propertyData.target_amount || '',
          
          // Returns
          expected_return_percentage: propertyData.expected_return_percentage || '',
          gross_yield: propertyData.gross_yield || '',
          potential_gain: propertyData.potential_gain || '',
          expected_return_period: propertyData.expected_return_period || '',
          
          // Tenure
          lock_in_period: propertyData.lock_in_period || '',
          project_duration: propertyData.project_duration || '',
          
          // Dates
          launch_date: propertyData.launch_date || '',
          funding_start_date: propertyData.funding_start_date || '',
          funding_end_date: propertyData.funding_end_date || '',
          possession_date: propertyData.possession_date || '',
          
          // Status
          status: propertyData.status || 'draft',
          is_featured: propertyData.is_featured || false,
          is_published: propertyData.is_published || false,
          is_public_sale: propertyData.is_public_sale || true,
          is_presale: propertyData.is_presale || false,
          
          // Features
          amenities: propertyData.amenities || [],
          highlights: propertyData.highlights || [],
          
          // SEO
          meta_title: propertyData.meta_title || '',
          meta_description: propertyData.meta_description || '',
        });
        
        // ✅ FIXED: Set existing image preview
        if (propertyData.featured_image_url) {
          setImagePreview(propertyData.featured_image_url);
        }
      }
    } catch (error) {
      console.error('❌ Error fetching property:', error);
      toast.error('Failed to load property details');
      navigate('/admin/properties');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.city || !formData.property_type) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    
    try {
      // Create FormData for file upload support
      const submitData = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== '') {
          submitData.append(key, formData[key]);
        }
      });

      let response;
      if (isEditMode) {
        response = await adminService.updateProperty(propertyId, submitData);
      } else {
        response = await adminService.createProperty(submitData);
      }

      if (response.success) {
        toast.success(response.message);
        navigate('/admin/properties');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to save property');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, featured_image: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const renderIcon = (iconName) => {
    const icons = {
      back: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    };
    return icons[iconName] || null;
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-loading-spinner">Loading property...</div>
      </div>
    );
  }

  return (
    <div className="admin-property-form-page">
      <div className="form-header">
        <button className="btn-back" onClick={() => navigate('/admin/properties')}>
          {renderIcon('back')}
          Back to Properties
        </button>
        <h1>{isEditMode ? 'Edit Property' : 'Add New Property'}</h1>
      </div>

      <form className="property-form" onSubmit={handleSubmit}>
        {/* Basic Information */}
        <div className="form-section">
          <h3 className="section-title">Basic Information</h3>
          <div className="form-grid">
            <div className="form-group full-width">
              <label>Property Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., DLF Garden City"
                required
              />
            </div>

            <div className="form-group full-width">
              <label>Address *</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Street address"
                required
              />
            </div>

            <div className="form-group">
              <label>City *</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="e.g., Bangalore"
                required
              />
            </div>

            <div className="form-group">
              <label>State</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                placeholder="e.g., Karnataka"
              />
            </div>

            <div className="form-group">
              <label>Pincode</label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleInputChange}
                placeholder="e.g., 560001"
                maxLength="6"
              />
            </div>

            <div className="form-group">
              <label>Property Type *</label>
              <select
                name="property_type"
                value={formData.property_type}
                onChange={handleInputChange}
                required
              >
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
                <option value="agricultural">Agricultural</option>
                <option value="industrial">Industrial</option>
              </select>
            </div>

            <div className="form-group full-width">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Property description..."
                rows="4"
              />
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <div className="form-section">
          <h3 className="section-title">Featured Image</h3>
          <div className="form-grid">
            <div className="form-group full-width">
              <label>Upload Featured Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              {imagePreview && (
                <div className="image-preview">
                  <img 
                    src={imagePreview} 
                    alt="Featured" 
                    style={{ maxWidth: '300px', marginTop: '10px', borderRadius: '8px' }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Unit & Pricing Information */}
        <div className="form-section">
          <h3 className="section-title">Unit & Pricing</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Total Units</label>
              <input
                type="number"
                name="total_units"
                value={formData.total_units}
                onChange={handleInputChange}
                placeholder="e.g., 100"
                min="1"
              />
            </div>

            <div className="form-group">
              <label>Available Units</label>
              <input
                type="number"
                name="available_units"
                value={formData.available_units}
                onChange={handleInputChange}
                placeholder="e.g., 50"
                min="0"
              />
            </div>

            <div className="form-group">
              <label>Price Per Unit (₹)</label>
              <input
                type="number"
                name="price_per_unit"
                value={formData.price_per_unit}
                onChange={handleInputChange}
                placeholder="e.g., 1500000"
                min="0"
                step="0.01"
              />
            </div>

            <div className="form-group">
              <label>Total Price (₹)</label>
              <input
                type="number"
                name="total_price"
                value={formData.total_price}
                onChange={handleInputChange}
                placeholder="e.g., 150000000"
                min="0"
                step="0.01"
              />
            </div>
          </div>
        </div>

        {/* Property Details */}
        <div className="form-section">
          <h3 className="section-title">Property Details</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Carpet Area (sq ft)</label>
              <input
                type="number"
                name="carpet_area"
                value={formData.carpet_area}
                onChange={handleInputChange}
                placeholder="e.g., 1200"
                min="0"
                step="0.01"
              />
            </div>

            <div className="form-group">
              <label>Built-up Area (sq ft)</label>
              <input
                type="number"
                name="built_up_area"
                value={formData.built_up_area}
                onChange={handleInputChange}
                placeholder="e.g., 1500"
                min="0"
                step="0.01"
              />
            </div>

            <div className="form-group">
              <label>Expected IRR (%)</label>
              <input
                type="number"
                name="expected_irr"
                value={formData.expected_irr}
                onChange={handleInputChange}
                placeholder="e.g., 13.2"
                min="0"
                max="100"
                step="0.01"
              />
            </div>

            <div className="form-group">
              <label>Target Hold Period (months)</label>
              <input
                type="number"
                name="target_hold_period"
                value={formData.target_hold_period}
                onChange={handleInputChange}
                placeholder="e.g., 36"
                min="1"
              />
            </div>

            <div className="form-group">
              <label>Potential Gain (%)</label>
              <input
                type="number"
                name="potential_gain"
                value={formData.potential_gain}
                onChange={handleInputChange}
                placeholder="e.g., 25.5"
                min="0"
                max="100"
                step="0.01"
              />
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="form-section">
          <h3 className="section-title">Status</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Property Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="sold_out">Sold Out</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="is_featured"
                  checked={formData.is_featured}
                  onChange={handleInputChange}
                />
                <span>Mark as Featured Property</span>
              </label>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate('/admin/properties')}
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={submitting}
          >
            {submitting 
              ? (isEditMode ? 'Updating...' : 'Creating...') 
              : (isEditMode ? 'Update Property' : 'Create Property')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminPropertyForm;