import React, { useState } from 'react';

const PhaseForm = ({ phases, animalTypeId, onRefresh }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingPhase, setEditingPhase] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    minProtein: '',
    maxProtein: '',
    minEnergy: '',
    maxEnergy: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('authToken');
      const url = editingPhase 
        ? `http://localhost:3001/api/admin/phases/${editingPhase.id}`
        : `http://localhost:3001/api/admin/animal-types/${animalTypeId}/phases`;
      
      const method = editingPhase ? 'PUT' : 'POST';

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
        throw new Error(errorData.error || 'Failed to save phase');
      }

      await onRefresh();
      setShowForm(false);
      setEditingPhase(null);
      setFormData({
        name: '',
        description: '',
        minProtein: '',
        maxProtein: '',
        minEnergy: '',
        maxEnergy: ''
      });
    } catch (err) {
      console.error('Error saving phase:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (phase) => {
    setEditingPhase(phase);
    setFormData({
      name: phase.name,
      description: phase.description || '',
      minProtein: phase.minProtein || '',
      maxProtein: phase.maxProtein || '',
      minEnergy: phase.minEnergy || '',
      maxEnergy: phase.maxEnergy || ''
    });
    setShowForm(true);
    setError(null);
  };

  const handleDelete = async (phaseId) => {
    if (!window.confirm('Are you sure you want to delete this phase?')) {
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:3001/api/admin/phases/${phaseId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to delete phase');
      }

      await onRefresh();
    } catch (err) {
      console.error('Error deleting phase:', err);
      setError(err.message);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingPhase(null);
    setFormData({
      name: '',
      description: '',
      minProtein: '',
      maxProtein: '',
      minEnergy: '',
      maxEnergy: ''
    });
    setError(null);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#2d3748', margin: 0 }}>Phases</h3>
        <button
          onClick={() => setShowForm(true)}
          className="btn btn-success"
        >
          Add Phase
        </button>
      </div>

      {showForm && (
        <div className="species-form">
          <h4 className="species-form h4">
            {editingPhase ? 'Edit Phase' : 'Add New Phase'}
          </h4>
          
          {error && (
            <div className="error-message">
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name" className="form-label">Phase Name *</label>
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div className="form-group">
                <label htmlFor="minProtein" className="form-label">Min Protein (%)</label>
                <input
                  type="number"
                  step="0.1"
                  id="minProtein"
                  value={formData.minProtein}
                  onChange={(e) => setFormData({ ...formData, minProtein: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="maxProtein" className="form-label">Max Protein (%)</label>
                <input
                  type="number"
                  step="0.1"
                  id="maxProtein"
                  value={formData.maxProtein}
                  onChange={(e) => setFormData({ ...formData, maxProtein: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="minEnergy" className="form-label">Min Energy (kcal/kg)</label>
                <input
                  type="number"
                  step="0.1"
                  id="minEnergy"
                  value={formData.minEnergy}
                  onChange={(e) => setFormData({ ...formData, minEnergy: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="maxEnergy" className="form-label">Max Energy (kcal/kg)</label>
                <input
                  type="number"
                  step="0.1"
                  id="maxEnergy"
                  value={formData.maxEnergy}
                  onChange={(e) => setFormData({ ...formData, maxEnergy: e.target.value })}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-buttons">
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
              >
                {loading ? 'Saving...' : (editingPhase ? 'Update' : 'Create')}
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
        {phases.map((phase) => (
          <div
            key={phase.id}
            className="species-item"
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div style={{ flex: 1 }}>
                <h4 className="species-item h4">{phase.name}</h4>
                {phase.description && (
                  <p className="species-item p">{phase.description}</p>
                )}
                {(phase.minProtein || phase.maxProtein || phase.minEnergy || phase.maxEnergy) && (
                  <div className="nutritional-requirements">
                    <h4>Nutritional Requirements</h4>
                    <div className="nutritional-grid">
                      {phase.minProtein && <div className="nutritional-item">
                        <span className="nutritional-label">Min Protein:</span> {phase.minProtein}%
                      </div>}
                      {phase.maxProtein && <div className="nutritional-item">
                        <span className="nutritional-label">Max Protein:</span> {phase.maxProtein}%
                      </div>}
                      {phase.minEnergy && <div className="nutritional-item">
                        <span className="nutritional-label">Min Energy:</span> {phase.minEnergy} kcal/kg
                      </div>}
                      {phase.maxEnergy && <div className="nutritional-item">
                        <span className="nutritional-label">Max Energy:</span> {phase.maxEnergy} kcal/kg
                      </div>}
                    </div>
                  </div>
                )}
              </div>
              <div className="species-item-actions">
                <button
                  onClick={() => handleEdit(phase)}
                  className="species-item-btn edit"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(phase.id)}
                  className="species-item-btn delete"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}

        {phases.length === 0 && (
          <div className="empty-state">
            <p>No phases found. Create your first phase to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhaseForm;