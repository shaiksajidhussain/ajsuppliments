import React, { useState, useEffect } from 'react';

const IngredientManagement = () => {
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState(null);
  const [formError, setFormError] = useState(null);
  const [speciesData, setSpeciesData] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    speciesId: '',
    crudeProtein: 0,  // Changed from 'protein' to 'crudeProtein'
    energy: 0,
    tdn: 0,  // TDN for non-poultry species
    fiber: 0,
    lysine: 0,
    methionine: 0,
    calcium: 0,
    phosphorus: 0,
    salt: 0.3,  // Default value
    cost: 0,
    premix: 1,  // Default value
    description: ''
  });

  const categories = [
    'Energy Source',
    'Protein Source',
    'Medium Source',
    // 'Vitamin',
    // 'Mineral',
    // 'Additive',
    // 'Binder',
    // 'Preservative'
  ];

  useEffect(() => {
    fetchIngredients();
    fetchSpeciesData();
  }, []);

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

  const fetchIngredients = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:3001/api/ingredients', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch ingredients');
      }

      const data = await response.json();
      setIngredients(data.ingredients || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching ingredients:', err);
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
      const url = editingIngredient 
        ? `http://localhost:3001/api/admin/ingredients/${editingIngredient.id}`
        : 'http://localhost:3001/api/admin/ingredients';
      
      const method = editingIngredient ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to save ingredient');
      }

      await fetchIngredients();
      handleCancel();
    } catch (err) {
      console.error('Error saving ingredient:', err);
      setFormError(err.message);
    }
  };

  const handleEdit = (ingredient) => {
    setEditingIngredient(ingredient);
    setFormData({
      name: ingredient.name,
      category: ingredient.category,
      speciesId: ingredient.speciesId || '',
      crudeProtein: ingredient.crudeProtein,
      energy: ingredient.energy || 0,
      tdn: ingredient.tdn || 0,
      fiber: ingredient.fiber,
      lysine: ingredient.lysine || 0,
      methionine: ingredient.methionine || 0,
      calcium: ingredient.calcium || 0,
      phosphorus: ingredient.phosphorus || 0,
      salt: ingredient.salt || 0.3,
      cost: ingredient.cost,
      premix: ingredient.premix || 1,
      description: ingredient.description || ''
    });
    setShowForm(true);
    setFormError(null);
  };

  const handleCopy = (ingredient) => {
    setEditingIngredient(null); // Not editing, creating a new one
    setFormData({
      name: `${ingredient.name} (Copy)`,
      category: ingredient.category,
      speciesId: ingredient.speciesId || '',
      crudeProtein: ingredient.crudeProtein,
      energy: ingredient.energy || 0,
      tdn: ingredient.tdn || 0,
      fiber: ingredient.fiber,
      lysine: ingredient.lysine || 0,
      methionine: ingredient.methionine || 0,
      calcium: ingredient.calcium || 0,
      phosphorus: ingredient.phosphorus || 0,
      salt: ingredient.salt || 0.3,
      cost: ingredient.cost,
      premix: ingredient.premix || 1,
      description: ingredient.description || ''
    });
    setShowForm(true);
    setFormError(null);
  };

  const handleDelete = async (ingredientId) => {
    if (!window.confirm('Are you sure you want to delete this ingredient?')) {
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:3001/api/admin/ingredients/${ingredientId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete ingredient');
      }

      await fetchIngredients();
    } catch (err) {
      console.error('Error deleting ingredient:', err);
      setError(err.message);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingIngredient(null);
    setFormData({
      name: '',
      category: '',
      speciesId: '',
      crudeProtein: 0,
      energy: 0,
      tdn: 0,
      fiber: 0,
      lysine: 0,
      methionine: 0,
      calcium: 0,
      phosphorus: 0,
      salt: 0.3,
      cost: 0,
      premix: 1,
      description: ''
    });
    setFormError(null);
  };

  // Helper function to check if selected species is poultry
  const isPoultrySpecies = () => {
    const selectedSpecies = speciesData.find(s => s.id === formData.speciesId);
    return selectedSpecies?.name?.toLowerCase() === 'poultry';
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p style={{ marginLeft: '1rem' }}>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        <h3 style={{ margin: '0 0 0.5rem 0', fontWeight: '600' }}>Error</h3>
        <p style={{ margin: '0 0 1rem 0' }}>{error}</p>
        <button
          onClick={fetchIngredients}
          className="btn btn-danger"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="species-header">
        <h2 className="species-title">Ingredient Management</h2>
        <button
          onClick={() => setShowForm(true)}
          className="species-refresh-btn"
        >
          Add Ingredient
        </button>
      </div>

      {showForm && (
        <div className="species-form">
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#2d3748', margin: '0 0 1rem 0' }}>
            {editingIngredient ? 'Edit Ingredient' : 'Add New Ingredient'}
          </h3>
          
          {formError && (
            <div className="error-message">
              <p>{formError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="ingredient-form-grid">
            <div className="form-group">
              <label className="form-label">Ingredient Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="form-input"
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="form-input"
                required
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

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
              <label className="form-label">Protein (%)</label>
              <input
                type="number"
                step="0.1"
                value={formData.crudeProtein}
                onChange={(e) => setFormData({ ...formData, crudeProtein: parseFloat(e.target.value) || 0 })}
                className="form-input"
              />
            </div>
            
            {isPoultrySpecies() ? (
              <div className="form-group">
                <label className="form-label">Energy (kcal/kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.energy}
                  onChange={(e) => setFormData({ ...formData, energy: parseFloat(e.target.value) || 0 })}
                  className="form-input"
                />
              </div>
            ) : (
              <div className="form-group">
                <label className="form-label">TDN (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.tdn}
                  onChange={(e) => setFormData({ ...formData, tdn: parseFloat(e.target.value) || 0 })}
                  className="form-input"
                />
              </div>
            )}
            
            <div className="form-group">
              <label className="form-label">Fiber (%)</label>
              <input
                type="number"
                step="0.1"
                value={formData.fiber}
                onChange={(e) => setFormData({ ...formData, fiber: parseFloat(e.target.value) || 0 })}
                className="form-input"
              />
            </div>
            
            {isPoultrySpecies() && (
              <>
                <div className="form-group">
                  <label className="form-label">Lysine (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.lysine}
                    onChange={(e) => setFormData({ ...formData, lysine: parseFloat(e.target.value) || 0 })}
                    className="form-input"
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Methionine (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.methionine}
                    onChange={(e) => setFormData({ ...formData, methionine: parseFloat(e.target.value) || 0 })}
                    className="form-input"
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Calcium (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.calcium}
                    onChange={(e) => setFormData({ ...formData, calcium: parseFloat(e.target.value) || 0 })}
                    className="form-input"
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Phosphorus (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.phosphorus}
                    onChange={(e) => setFormData({ ...formData, phosphorus: parseFloat(e.target.value) || 0 })}
                    className="form-input"
                  />
                </div>
              </>
            )}
            
            <div className="form-group">
              <label className="form-label">Salt (%)</label>
              <input
                type="number"
                step="0.01"
                value={formData.salt}
                onChange={(e) => setFormData({ ...formData, salt: parseFloat(e.target.value) || 0.3 })}
                className="form-input"
                placeholder="0.3"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Cost (per kg)</label>
              <input
                type="number"
                step="0.01"
                value={formData.cost}
                onChange={(e) => setFormData({ ...formData, cost: parseFloat(e.target.value) || 0 })}
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Premix (%)</label>
              <input
                type="number"
                step="0.01"
                value={formData.premix}
                onChange={(e) => setFormData({ ...formData, premix: parseFloat(e.target.value) || 1 })}
                className="form-input"
                placeholder="1"
              />
            </div>
            
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="form-textarea"
              />
            </div>
            
            <div className="form-buttons" style={{ gridColumn: '1 / -1' }}>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
              >
                {loading ? 'Saving...' : editingIngredient ? 'Update' : 'Add Ingredient'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Ingredients Grid */}
      <div className="ingredient-grid">
        {ingredients.map((ingredient) => {
          const species = speciesData.find(s => s.id === ingredient.speciesId);
          const isPoultry = species?.name?.toLowerCase() === 'poultry';
          
          return (
            <div key={ingredient.id} className="ingredient-item">
              <div className="ingredient-header">
                <h3 className="ingredient-name">{ingredient.name}</h3>
                <span className="ingredient-category">
                  {ingredient.category}
                </span>
              </div>
              
              {species && (
                <div style={{ 
                  padding: '0.5rem', 
                  backgroundColor: '#f3f4f6', 
                  borderRadius: '0.375rem',
                  marginBottom: '0.75rem'
                }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#4b5563' }}>
                    Species: {species.name}
                  </span>
                </div>
              )}
              
              <div className="ingredient-details">
                <div className="ingredient-detail">
                  <span className="ingredient-detail-label">Protein:</span> {ingredient.crudeProtein}%
                </div>
                {isPoultry ? (
                  <div className="ingredient-detail">
                    <span className="ingredient-detail-label">Energy:</span> {ingredient.energy} kcal
                  </div>
                ) : (
                  <div className="ingredient-detail">
                    <span className="ingredient-detail-label">TDN:</span> {ingredient.tdn}%
                  </div>
                )}
                <div className="ingredient-detail">
                  <span className="ingredient-detail-label">Fiber:</span> {ingredient.fiber}%
                </div>
                {isPoultry && (
                  <>
                    <div className="ingredient-detail">
                      <span className="ingredient-detail-label">Lysine:</span> {ingredient.lysine}%
                    </div>
                    <div className="ingredient-detail">
                      <span className="ingredient-detail-label">Methionine:</span> {ingredient.methionine}%
                    </div>
                    <div className="ingredient-detail">
                      <span className="ingredient-detail-label">Calcium:</span> {ingredient.calcium}%
                    </div>
                    <div className="ingredient-detail">
                      <span className="ingredient-detail-label">Phosphorus:</span> {ingredient.phosphorus}%
                    </div>
                  </>
                )}
                <div className="ingredient-detail">
                  <span className="ingredient-detail-label">Salt:</span> {ingredient.salt}%
                </div>
                <div className="ingredient-detail">
                  <span className="ingredient-detail-label">Cost:</span> ${ingredient.cost}/kg
                </div>
                <div className="ingredient-detail">
                  <span className="ingredient-detail-label">Premix:</span> {ingredient.premix}%
                </div>
              </div>
            
              {ingredient.description && (
                <p style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.75rem', lineHeight: '1.4' }}>
                  {ingredient.description}
                </p>
              )}
              
              <div className="ingredient-actions">
                <button
                  onClick={() => handleEdit(ingredient)}
                  className="species-item-btn edit"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleCopy(ingredient)}
                  className="species-item-btn"
                  style={{ backgroundColor: '#3b82f6', color: 'white' }}
                >
                  Copy
                </button>
                <button
                  onClick={() => handleDelete(ingredient.id)}
                  className="species-item-btn delete"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
      
      {ingredients.length === 0 && (
        <div className="empty-state">
          <p>No ingredients found. Add your first ingredient to get started.</p>
        </div>
      )}
    </div>
  );
};

export default IngredientManagement;