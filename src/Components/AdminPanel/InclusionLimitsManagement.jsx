import React, { useState, useEffect } from 'react';

const InclusionLimitsManagement = () => {
  const [inclusionLimits, setInclusionLimits] = useState([]);
  const [filteredLimits, setFilteredLimits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingLimit, setEditingLimit] = useState(null);
  const [formError, setFormError] = useState(null);
  const [speciesData, setSpeciesData] = useState([]);
  const [ingredientsData, setIngredientsData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecies, setSelectedSpecies] = useState('');
  const [selectedAnimalType, setSelectedAnimalType] = useState('');
  const [formData, setFormData] = useState({
    speciesId: '',
    subspeciesId: '',
    animalTypeId: '',
    ingredientId: '',
    maxInclusion: 100,
    minInclusion: 0,
    description: ''
  });

  useEffect(() => {
    fetchInclusionLimits();
    fetchSpeciesData();
    fetchIngredientsData();
  }, []);

  // Filter inclusion limits based on search term and filters
  useEffect(() => {
    let filtered = inclusionLimits;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(limit =>
        limit.ingredient?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        limit.species?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        limit.animalType?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by species
    if (selectedSpecies) {
      filtered = filtered.filter(limit => limit.speciesId === selectedSpecies);
    }

    // Filter by animal type
    if (selectedAnimalType) {
      filtered = filtered.filter(limit => limit.animalTypeId === selectedAnimalType);
    }

    setFilteredLimits(filtered);
  }, [inclusionLimits, searchTerm, selectedSpecies, selectedAnimalType]);

  const fetchSpeciesData = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:3001/api/species/hierarchy', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch species data');
      }

      const data = await response.json();
      setSpeciesData(data.hierarchy || []);
    } catch (err) {
      console.error('Error fetching species data:', err);
    }
  };

  const fetchIngredientsData = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:3001/api/ingredients', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch ingredients data');
      }

      const data = await response.json();
      setIngredientsData(data.ingredients || []);
    } catch (err) {
      console.error('Error fetching ingredients data:', err);
    }
  };

  const fetchInclusionLimits = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:3001/api/inclusion-limits', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch inclusion limits');
      }

      const data = await response.json();
      setInclusionLimits(data.inclusionLimits || []);
    } catch (err) {
      console.error('Error fetching inclusion limits:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    try {
      const token = localStorage.getItem('authToken');
      const url = editingLimit 
        ? `http://localhost:3001/api/inclusion-limits/${editingLimit.id}`
        : 'http://localhost:3001/api/inclusion-limits';
      
      const method = editingLimit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save inclusion limit');
      }

      const data = await response.json();
      
      if (editingLimit) {
        setInclusionLimits(prev => 
          prev.map(limit => limit.id === editingLimit.id ? data.inclusionLimit : limit)
        );
      } else {
        setInclusionLimits(prev => [data.inclusionLimit, ...prev]);
      }

      setShowForm(false);
      setEditingLimit(null);
      setFormData({
        speciesId: '',
        subspeciesId: '',
        animalTypeId: '',
        ingredientId: '',
        maxInclusion: 100,
        minInclusion: 0,
        description: ''
      });
    } catch (err) {
      console.error('Error saving inclusion limit:', err);
      setFormError(err.message);
    }
  };

  const handleEdit = (limit) => {
    setEditingLimit(limit);
    setFormData({
      speciesId: limit.speciesId,
      subspeciesId: limit.subspeciesId || '',
      animalTypeId: limit.animalTypeId || '',
      ingredientId: limit.ingredientId,
      maxInclusion: limit.maxInclusion,
      minInclusion: limit.minInclusion || 0,
      description: limit.description || ''
    });
    setShowForm(true);
    setFormError(null);
  };

  const handleDelete = async (limitId) => {
    if (!window.confirm('Are you sure you want to delete this inclusion limit?')) {
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:3001/api/inclusion-limits/${limitId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete inclusion limit');
      }

      setInclusionLimits(prev => prev.filter(limit => limit.id !== limitId));
    } catch (err) {
      console.error('Error deleting inclusion limit:', err);
      setError(err.message);
    }
  };

  const resetForm = () => {
    setFormData({
      speciesId: '',
      subspeciesId: '',
      animalTypeId: '',
      ingredientId: '',
      maxInclusion: 100,
      minInclusion: 0,
      description: ''
    });
    setEditingLimit(null);
    setFormError(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading inclusion limits...</div>
      </div>
    );
  }

  return (
    <div className="inclusion-limits-container">
      <div className="inclusion-limits-header">
        <h1 className="inclusion-limits-title">Inclusion Limits Management</h1>
        <p className="inclusion-limits-description">Manage maximum and minimum inclusion percentages for ingredients by animal type.</p>
      </div>

      {/* Search and Filter Controls */}
      <div className="inclusion-limits-filters">
        <div className="inclusion-limits-filters-grid">
          <div className="form-group">
            <label className="form-label">Search</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by ingredient, species, or animal type..."
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Species</label>
            <select
              value={selectedSpecies}
              onChange={(e) => setSelectedSpecies(e.target.value)}
              className="form-input"
            >
              <option value="">All Species</option>
              {speciesData.map(species => (
                <option key={species.id} value={species.id}>{species.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Animal Type</label>
            <select
              value={selectedAnimalType}
              onChange={(e) => setSelectedAnimalType(e.target.value)}
              className="form-input"
            >
              <option value="">All Animal Types</option>
              {speciesData.flatMap(species => 
                species.animalTypes?.map(animalType => (
                  <option key={animalType.id} value={animalType.id}>
                    {species.name} - {animalType.name}
                  </option>
                )) || []
              )}
            </select>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="btn btn-primary"
          >
            Add New Limit
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* Inclusion Limits List */}
      <div className="inclusion-limits-list">
        <div className="inclusion-limits-list-header">
          <h2 className="inclusion-limits-list-title">
            Inclusion Limits ({filteredLimits.length})
          </h2>
        </div>
        
        {filteredLimits.length === 0 ? (
          <div className="inclusion-limits-empty">
            <p>No inclusion limits found. Create your first limit to get started.</p>
          </div>
        ) : (
          <div>
            {filteredLimits.map((limit) => (
              <div key={limit.id} className="inclusion-limits-item">
                <div className="inclusion-limits-item-header">
                  <div className="flex-1">
                    <h3 className="inclusion-limits-item-title">
                      {limit.ingredient?.name}
                    </h3>
                    <div className="inclusion-limits-badges">
                      <span className="inclusion-limits-badge inclusion-limits-badge-species">
                        {limit.species?.name}
                      </span>
                      {limit.animalType && (
                        <span className="inclusion-limits-badge inclusion-limits-badge-animal">
                          {limit.animalType.name}
                        </span>
                      )}
                    </div>
                    
                    <div className="inclusion-limits-details">
                      <div className="inclusion-limits-detail">
                        <span className="inclusion-limits-detail-label">Max Inclusion:</span>
                        <span className="inclusion-limits-detail-value">{limit.maxInclusion}%</span>
                      </div>
                      <div className="inclusion-limits-detail">
                        <span className="inclusion-limits-detail-label">Min Inclusion:</span>
                        <span className="inclusion-limits-detail-value">{limit.minInclusion || 0}%</span>
                      </div>
                      <div className="inclusion-limits-detail">
                        <span className="inclusion-limits-detail-label">Ingredient Category:</span>
                        <span className="inclusion-limits-detail-value">{limit.ingredient?.category}</span>
                      </div>
                      <div className="inclusion-limits-detail">
                        <span className="inclusion-limits-detail-label">Created:</span>
                        <span className="inclusion-limits-detail-value">
                          {new Date(limit.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    {limit.description && (
                      <div className="inclusion-limits-detail">
                        <span className="inclusion-limits-detail-label">Description:</span>
                        <span className="inclusion-limits-detail-value">{limit.description}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="inclusion-limits-actions">
                    <button
                      onClick={() => handleEdit(limit)}
                      className="inclusion-limits-action-btn edit"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(limit.id)}
                      className="inclusion-limits-action-btn delete"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="inclusion-limits-modal">
          <div className="inclusion-limits-modal-content">
            <div className="inclusion-limits-modal-header">
              <h2 className="inclusion-limits-modal-title">
                {editingLimit ? 'Edit Inclusion Limit' : 'Add New Inclusion Limit'}
              </h2>
              <button
                onClick={resetForm}
                className="inclusion-limits-modal-close"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="inclusion-limits-modal-body">
              {formError && (
                <div className="error-message">
                  {formError}
                </div>
              )}
              
              <div className="inclusion-limits-form-grid">
                <div className="form-group">
                  <label className="form-label">Species *</label>
                  <select
                    value={formData.speciesId}
                    onChange={(e) => setFormData({ ...formData, speciesId: e.target.value })}
                    className="form-input"
                    required
                  >
                    <option value="">Select Species</option>
                    {speciesData.map((species) => (
                      <option key={species.id} value={species.id}>
                        {species.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Subspecies</label>
                  <select
                    value={formData.subspeciesId}
                    onChange={(e) => setFormData({ ...formData, subspeciesId: e.target.value })}
                    className="form-input"
                  >
                    <option value="">Select Subspecies (Optional)</option>
                    {speciesData
                      .find(s => s.id === formData.speciesId)
                      ?.subspecies?.map((subspecies) => (
                        <option key={subspecies.id} value={subspecies.id}>
                          {subspecies.name}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Animal Type</label>
                  <select
                    value={formData.animalTypeId}
                    onChange={(e) => setFormData({ ...formData, animalTypeId: e.target.value })}
                    className="form-input"
                  >
                    <option value="">Select Animal Type (Optional)</option>
                    {speciesData
                      .find(s => s.id === formData.speciesId)
                      ?.animalTypes?.map((animalType) => (
                        <option key={animalType.id} value={animalType.id}>
                          {animalType.name}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Ingredient *</label>
                  <select
                    value={formData.ingredientId}
                    onChange={(e) => setFormData({ ...formData, ingredientId: e.target.value })}
                    className="form-input"
                    required
                  >
                    <option value="">Select Ingredient</option>
                    {ingredientsData.map((ingredient) => (
                      <option key={ingredient.id} value={ingredient.id}>
                        {ingredient.name} ({ingredient.category})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Max Inclusion (%) *</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={formData.maxInclusion}
                    onChange={(e) => setFormData({ ...formData, maxInclusion: parseFloat(e.target.value) || 0 })}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Min Inclusion (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={formData.minInclusion}
                    onChange={(e) => setFormData({ ...formData, minInclusion: parseFloat(e.target.value) || 0 })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="form-textarea"
                  rows="3"
                />
              </div>

              <div className="inclusion-limits-form-actions">
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  {editingLimit ? 'Update Limit' : 'Create Limit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InclusionLimitsManagement;
