import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import propertyService from '../services/propertyService';
import PropertyCard from '../components/PropertyCard';
import '../styles/Properties.css';

const Properties = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterOptions, setFilterOptions] = useState({
    cities: [],
    builders: [],
    property_types: []
  });
  const [filters, setFilters] = useState({
    status: 'public_sale',
    city: '',
    builder_name: '',
    property_type: '',
    search: '',
    sort_by: 'default', 
  });

  // Fetch filter options on mount
  useEffect(() => {
    fetchFilterOptions();
  }, []);

  // Fetch properties when filters change
  useEffect(() => {
    fetchProperties();
  }, [filters]);

  const fetchFilterOptions = async () => {
    try {
      const response = await propertyService.getFilterOptions();
      if (response.success) {
        setFilterOptions(response.data);
      }
    } catch (error) {
      console.error('Error fetching filter options:', error);
      toast.error('Failed to load filter options');
    }
  };

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const data = await propertyService.getProperties(filters);
      setProperties(data.results || data); // Handle both paginated and non-paginated responses
    } catch (error) {
      toast.error(error.message || 'Failed to load properties');
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key] === value ? '' : value // Toggle off if clicking same filter
    }));
  };

  const clearFilters = () => {
    setFilters({
      status: 'public_sale',
      city: '',
      builder_name: '',
      property_type: '',
      search: '',
      sort_by: 'default',  // ← ADD THIS
    });
  };

  const handleSearch = (e) => {
    setFilters(prev => ({
      ...prev,
      search: e.target.value
    }));
  };

  return (
    <div className="properties-page">
      <div className="properties-container">
        {/* Left Sidebar - Filters */}
        <aside className="filters-sidebar">
          <div className="filter-header">
            <h2>Filter</h2>
            <button className="clear-all" onClick={clearFilters}>Clear All</button>
          </div>

          {/* Sale Type Filter */}
          <div className="filter-section">
            <div className="filter-tabs">
              <button 
                className={filters.status === 'public_sale' ? 'active' : ''}
                onClick={() => setFilters(prev => ({ ...prev, status: 'public_sale' }))}
              >
                Public Sale
              </button>
              <button 
                className={filters.status === 'presale' ? 'active' : ''}
                onClick={() => setFilters(prev => ({ ...prev, status: 'presale' }))}
              >
                Presale
              </button>
            </div>
          </div>

                    {/* Property Type Filter */}
          {filterOptions.property_types.length > 0 && (
            <div className="filter-section">
              <div className="filter-title">
                <span>Property Type</span>
                {filters.property_type && (
                  <button 
                    className="clear-filter"
                    onClick={() => handleFilterChange('property_type', '')}
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="filter-options">
                {filterOptions.property_types.map((type) => (
                  <button 
                    key={type.value} 
                    className={`filter-chip ${filters.property_type === type.value ? 'active' : ''}`}
                    onClick={() => handleFilterChange('property_type', type.value)}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* City Filter */}
          {filterOptions.cities.length > 0 && (
            <div className="filter-section">
              <div className="filter-title">
                <span>City</span>
                {filters.city && (
                  <button 
                    className="clear-filter" 
                    onClick={() => handleFilterChange('city', '')}
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="filter-options">
                {filterOptions.cities.map((city) => (
                  <button 
                    key={city} 
                    className={`filter-chip ${filters.city === city ? 'active' : ''}`}
                    onClick={() => handleFilterChange('city', city)}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Builder's Name Filter */}
          {filterOptions.builders.length > 0 && (
            <div className="filter-section">
              <div className="filter-title">
                <span>Builder's Name</span>
                {filters.builder_name && (
                  <button 
                    className="clear-filter"
                    onClick={() => handleFilterChange('builder_name', '')}
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="filter-options">
                {filterOptions.builders.map((builder) => (
                  <button 
                    key={builder} 
                    className={`filter-chip ${filters.builder_name === builder ? 'active' : ''}`}
                    onClick={() => handleFilterChange('builder_name', builder)}
                  >
                    {builder}
                  </button>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* Main Content */}
        <main className="properties-main">
          <div className="properties-header">
            <h1>Properties</h1>
            <div className="search-sort-bar">
              <div className="search-box">
                <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                  <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <input
                  type="text"
                  placeholder="Search by Properties, Builder's name, Location"
                  value={filters.search}
                  onChange={handleSearch}
                />
              </div>
              <select 
                className="sort-dropdown"
                value={filters.sort_by}
                onChange={(e) => setFilters(prev => ({ ...prev, sort_by: e.target.value }))}
              >
                <option value="default">Sort by: Default (Featured)</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="yield_high">Yield: High to Low</option>
                <option value="irr_high">IRR: High to Low</option>
              </select>
            </div>
          </div>

          {/* Property Cards Grid */}
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner">Loading properties...</div>
            </div>
          ) : properties.length === 0 ? (
            <div className="no-properties">
              <p>No properties found matching your criteria.</p>
            </div>
          ) : (
            <div className="properties-grid">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Properties;