import React, { useState } from 'react';

const SpeciesForm = ({ species, onRefresh, onSelect }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingSpecies, setEditingSpecies] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('authToken');
      const url = editingSpecies 
        ? `http://localhost:3001/api/admin/species/${editingSpecies.id}`
        : 'http://localhost:3001/api/admin/species';
      
      const method = editingSpecies ? 'PUT' : 'POST';

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
        throw new Error(errorData.error || 'Failed to save species');
      }

      await onRefresh();
      setShowForm(false);
      setEditingSpecies(null);
      setFormData({ name: '', description: '' });
    } catch (error) {
      console.error('Error saving species:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (species) => {
    setEditingSpecies(species);
    setFormData({
      name: species.name,
      description: species.description || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (speciesId) => {
    if (!window.confirm('Are you sure you want to delete this species? This will also delete all associated subspecies, animal types, and phases.')) {
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:3001/api/admin/species/${speciesId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete species');
      }

      await onRefresh();
    } catch (error) {
      console.error('Error deleting species:', error);
      alert(error.message);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingSpecies(null);
    setFormData({ name: '', description: '' });
    setError(null);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#2d3748', margin: 0 }}>Species</h3>
        <button
          onClick={() => setShowForm(true)}
          className="btn btn-success"
        >
          Add Species
        </button>
      </div>

      {showForm && (
        <div className="species-form">
          <h4 className="species-form h4">
            {editingSpecies ? 'Edit Species' : 'Add New Species'}
          </h4>
          
          {error && (
            <div className="error-message">
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Species Name *
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description" className="form-label">
                Description
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="form-textarea"
              />
            </div>

            <div className="form-buttons">
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
              >
                {loading ? 'Saving...' : (editingSpecies ? 'Update' : 'Create')}
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

      <div>
        {species.map((sp) => (
          <div
            key={sp.id}
            className="species-item"
            onClick={() => onSelect(sp.id)}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div style={{ flex: 1 }}>
                <h4 className="species-item h4">{sp.name}</h4>
                {sp.description && (
                  <p className="species-item p">{sp.description}</p>
                )}
              </div>
              <div className="species-item-actions">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(sp);
                  }}
                  className="species-item-btn edit"
                >
                  Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(sp.id);
                  }}
                  className="species-item-btn delete"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}

        {species.length === 0 && (
          <div className="empty-state">
            <p>No species found. Create your first species to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpeciesForm;
