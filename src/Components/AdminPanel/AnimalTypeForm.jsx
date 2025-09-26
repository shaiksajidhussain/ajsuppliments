import React, { useState } from 'react';

const AnimalTypeForm = ({ animalTypes, subspeciesId, subspecies, speciesId, onRefresh, onSelect }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingAnimalType, setEditingAnimalType] = useState(null);
  const [selectedSubspeciesForAnimalType, setSelectedSubspeciesForAnimalType] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedAnimalType, setSelectedAnimalType] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('authToken');
      
      let url;
      
      if (editingAnimalType) {
        // Editing existing animal type
        url = `http://localhost:3001/api/admin/animal-types/${editingAnimalType.id}`;
      } else if (subspeciesId) {
        // Creating animal type under specific subspecies
        url = `http://localhost:3001/api/admin/subspecies/${subspeciesId}/animal-types`;
      } else if (selectedSubspeciesForAnimalType) {
        // Creating animal type under selected subspecies
        url = `http://localhost:3001/api/admin/subspecies/${selectedSubspeciesForAnimalType}/animal-types`;
      } else if (speciesId) {
        // Creating animal type directly under species (no subspecies)
        url = `http://localhost:3001/api/admin/species/${speciesId}/animal-types`;
      } else {
        throw new Error('Please select a subspecies to add the animal type to');
      }
      
      const method = editingAnimalType ? 'PUT' : 'POST';

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
        throw new Error(errorData.error || 'Failed to save animal type');
      }

      await onRefresh();
      setShowForm(false);
      setEditingAnimalType(null);
      setSelectedSubspeciesForAnimalType('');
      setFormData({ name: '', description: '' });
    } catch (err) {
      console.error('Error saving animal type:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (animalType) => {
    setEditingAnimalType(animalType);
    setFormData({
      name: animalType.name,
      description: animalType.description || ''
    });
    setShowForm(true);
    setError(null);
  };

  const handleDelete = async (animalTypeId) => {
    if (!window.confirm('Are you sure you want to delete this animal type?')) {
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:3001/api/admin/animal-types/${animalTypeId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to delete animal type');
      }

      await onRefresh();
    } catch (err) {
      console.error('Error deleting animal type:', err);
      setError(err.message);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingAnimalType(null);
    setSelectedSubspeciesForAnimalType('');
    setFormData({ name: '', description: '' });
    setError(null);
  };

  const handleSelect = (animalTypeId) => {
    setSelectedAnimalType(animalTypeId);
    onSelect(animalTypeId);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#2d3748', margin: 0 }}>Animal Types</h3>
        <button
          onClick={() => setShowForm(true)}
          className="btn btn-success"
        >
          Add Animal Type
        </button>
      </div>

      {!subspeciesId && subspecies.length > 0 && (
        <div style={{ 
          background: '#fef3c7', 
          border: '1px solid #f59e0b', 
          borderRadius: '0.375rem', 
          padding: '0.75rem', 
          marginBottom: '1rem',
          color: '#92400e'
        }}>
          <strong>Note:</strong> You're viewing all animal types for this species. When adding new animal types, you'll need to select which subspecies to add them to.
        </div>
      )}
      
      {!subspeciesId && subspecies.length === 0 && (
        <div style={{ 
          background: '#d1fae5', 
          border: '1px solid #10b981', 
          borderRadius: '0.375rem', 
          padding: '0.75rem', 
          marginBottom: '1rem',
          color: '#065f46'
        }}>
          <strong>Note:</strong> This species doesn't use subspecies. Animal types will be created directly under the species.
        </div>
      )}

      {showForm && (
        <div className="species-form">
          <h4 className="species-form h4">
            {editingAnimalType ? 'Edit Animal Type' : 'Add New Animal Type'}
          </h4>
          
          {error && (
            <div className="error-message">
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {!subspeciesId && !editingAnimalType && subspecies.length > 0 && (
              <div className="form-group">
                <label htmlFor="subspecies" className="form-label">Subspecies *</label>
                <select
                  id="subspecies"
                  value={selectedSubspeciesForAnimalType}
                  onChange={(e) => setSelectedSubspeciesForAnimalType(e.target.value)}
                  className="form-input"
                  required
                >
                  <option value="">Select Subspecies</option>
                  {subspecies.map((subspecies) => (
                    <option key={subspecies.id} value={subspecies.id}>
                      {subspecies.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="name" className="form-label">Animal Type Name *</label>
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
                {loading ? 'Saving...' : (editingAnimalType ? 'Update' : 'Create')}
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
        {animalTypes.map((animalType) => (
          <div
            key={animalType.id}
            className="species-item"
            onClick={() => handleSelect(animalType.id)}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div style={{ flex: 1 }}>
                <h4 className="species-item h4">{animalType.name}</h4>
                {animalType.description && (
                  <p className="species-item p">{animalType.description}</p>
                )}
              </div>
              <div className="species-item-actions">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(animalType);
                  }}
                  className="species-item-btn edit"
                >
                  Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(animalType.id);
                  }}
                  className="species-item-btn delete"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}

        {animalTypes.length === 0 && (
          <div className="empty-state">
            <p>No animal types found. Create your first animal type to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnimalTypeForm;