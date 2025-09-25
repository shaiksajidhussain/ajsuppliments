import React, { useState } from 'react';

const SubspeciesForm = ({ subspecies, speciesId, onRefresh, onSelect }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingSubspecies, setEditingSubspecies] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedSubspecies, setSelectedSubspecies] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('authToken');
      // For now, we'll use a mock response since we don't have admin endpoints
      // In a real app, this would be: `http://localhost:3001/api/admin/species/${speciesId}/subspecies`
      const url = editingSubspecies 
        ? `http://localhost:3001/api/admin/subspecies/${editingSubspecies.id}`
        : `http://localhost:3001/api/admin/species/${speciesId}/subspecies`;
      
      const method = editingSubspecies ? 'PUT' : 'POST';

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
        throw new Error(errorData.error || 'Failed to save subspecies');
      }

      await onRefresh();
      setShowForm(false);
      setEditingSubspecies(null);
      setFormData({ name: '', description: '' });
    } catch (err) {
      console.error('Error saving subspecies:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (subspecies) => {
    setEditingSubspecies(subspecies);
    setFormData({
      name: subspecies.name,
      description: subspecies.description || ''
    });
    setShowForm(true);
    setError(null);
  };

  const handleDelete = async (subspeciesId) => {
    if (!window.confirm('Are you sure you want to delete this subspecies?')) {
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:3001/api/admin/subspecies/${subspeciesId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to delete subspecies');
      }

      await onRefresh();
    } catch (err) {
      console.error('Error deleting subspecies:', err);
      setError(err.message);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingSubspecies(null);
    setFormData({ name: '', description: '' });
    setError(null);
  };

  const handleSelect = (subspeciesId) => {
    setSelectedSubspecies(subspeciesId);
    onSelect(subspeciesId);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#2d3748', margin: 0 }}>Subspecies</h3>
        <button
          onClick={() => setShowForm(true)}
          className="btn btn-success"
        >
          Add Subspecies
        </button>
      </div>

      {showForm && (
        <div className="species-form">
          <h4 className="species-form h4">
            {editingSubspecies ? 'Edit Subspecies' : 'Add New Subspecies'}
          </h4>
          
          {error && (
            <div className="error-message">
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name" className="form-label">Subspecies Name *</label>
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
              <label htmlFor="description" className="form-label">Description</label>
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
                {loading ? 'Saving...' : (editingSubspecies ? 'Update' : 'Create')}
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
        {subspecies.map((sub) => (
          <div
            key={sub.id}
            className="species-item"
            onClick={() => handleSelect(sub.id)}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div style={{ flex: 1 }}>
                <h4 className="species-item h4">{sub.name}</h4>
                {sub.description && (
                  <p className="species-item p">{sub.description}</p>
                )}
              </div>
              <div className="species-item-actions">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(sub);
                  }}
                  className="species-item-btn edit"
                >
                  Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(sub.id);
                  }}
                  className="species-item-btn delete"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}

        {subspecies.length === 0 && (
          <div className="empty-state">
            <p>No subspecies found. Create your first subspecies to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubspeciesForm;