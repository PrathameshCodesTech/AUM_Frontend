import React, { useState, useRef } from 'react';
import toast from 'react-hot-toast';
import adminService from '../../services/adminService';
import '../../styles/admin/PropertyImageGallery.css';

const PropertyImageGallery = ({ propertyId, images = [], onImagesUpdate }) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;
    
    setUploading(true);
    
    try {
      // Upload each file
      for (const file of files) {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('caption', '');
        formData.append('order', images.length);
        
        const response = await adminService.uploadPropertyImage(propertyId, formData);
        
        if (response.success) {
          toast.success('Image uploaded successfully');
        }
      }
      
      // Refresh images
      if (onImagesUpdate) {
        onImagesUpdate();
      }
    } catch (error) {
      console.error('❌ Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDeleteImage = async (imageId) => {
    if (!window.confirm('Are you sure you want to delete this image?')) {
      return;
    }
    
    try {
      const response = await adminService.deletePropertyImage(propertyId, imageId);
      
      if (response.success) {
        toast.success('Image deleted successfully');
        if (onImagesUpdate) {
          onImagesUpdate();
        }
      }
    } catch (error) {
      console.error('❌ Error deleting image:', error);
      toast.error('Failed to delete image');
    }
  };

  return (
    <div className="property-image-gallery">
      <div className="gallery-header">
        <h3>📸 Image Gallery</h3>
        <button 
          className="btn-upload"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? 'Uploading...' : '+ Add Images'}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          style={{ display: 'none' }}
          onChange={handleImageUpload}
        />
      </div>

      {images.length === 0 ? (
        <div className="gallery-empty">
          <p>No images uploaded yet</p>
        </div>
      ) : (
        <div className="gallery-grid">
          {images.map((image) => (
            <div key={image.id} className="gallery-item">
              <img src={image.image_url} alt={image.caption || 'Property'} />
              <div className="gallery-item-overlay">
                <button 
                  className="btn-delete-image"
                  onClick={() => handleDeleteImage(image.id)}
                  title="Delete"
                >
                  🗑️
                </button>
              </div>
              {image.caption && (
                <div className="gallery-item-caption">
                  {image.caption}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PropertyImageGallery;