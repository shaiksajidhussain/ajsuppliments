import React, { useState } from 'react';

const PhaseForm = ({ phases, animalTypeId, animalTypes, speciesId, onRefresh }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingPhase, setEditingPhase] = useState(null);
  const [selectedAnimalTypeForPhase, setSelectedAnimalTypeForPhase] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    crudeProtein: '',
    meKcalPerKg: '',
    calcium: '',
    availablePhosphorus: '',
    lysine: '',
    methionine: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filter phases based on selected animal type or species
  const filteredPhases = animalTypeId 
    ? phases.filter(phase => phase.animalTypeId === animalTypeId)
    : speciesId 
    ? phases.filter(phase => phase.speciesId === speciesId)
    : phases;

  console.log('PhaseForm - animalTypeId:', animalTypeId, 'speciesId:', speciesId, 'phases:', phases, 'filteredPhases:', filteredPhases);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('authToken');
      
      let url;
      
      if (editingPhase) {
        // Editing existing phase
        url = `http://localhost:3001/api/admin/phases/${editingPhase.id}`;
      } else if (animalTypeId) {
        // Creating phase under specific animal type
        url = `http://localhost:3001/api/admin/animal-types/${animalTypeId}/phases`;
      } else if (selectedAnimalTypeForPhase) {
        // Creating phase under selected animal type
        url = `http://localhost:3001/api/admin/animal-types/${selectedAnimalTypeForPhase}/phases`;
      } else if (speciesId) {
        // Creating phase directly under species (no subspecies/animal types)
        url = `http://localhost:3001/api/admin/species/${speciesId}/phases`;
      } else {
        throw new Error('Please select an animal type to add the phase to');
      }
      
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
      setSelectedAnimalTypeForPhase('');
      setFormData({
        name: '',
        description: '',
        crudeProtein: '',
        meKcalPerKg: '',
        calcium: '',
        availablePhosphorus: '',
        lysine: '',
        methionine: ''
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
      crudeProtein: phase.crudeProtein || '',
      meKcalPerKg: phase.meKcalPerKg || '',
      calcium: phase.calcium || '',
      availablePhosphorus: phase.availablePhosphorus || '',
      lysine: phase.lysine || '',
      methionine: phase.methionine || ''
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
    setSelectedAnimalTypeForPhase('');
    setFormData({
      name: '',
      description: '',
      crudeProtein: '',
      meKcalPerKg: '',
      calcium: '',
      availablePhosphorus: '',
      lysine: '',
      methionine: ''
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

      {!animalTypeId && animalTypes.length > 0 && (
        <div style={{ 
          background: '#fef3c7', 
          border: '1px solid #f59e0b', 
          borderRadius: '0.375rem', 
          padding: '0.75rem', 
          marginBottom: '1rem',
          color: '#92400e'
        }}>
          <strong>Note:</strong> You're viewing all phases for this species. When adding new phases, you'll need to select which animal type to add them to.
        </div>
      )}
      
      {!animalTypeId && animalTypes.length === 0 && (
        <div style={{ 
          background: '#d1fae5', 
          border: '1px solid #10b981', 
          borderRadius: '0.375rem', 
          padding: '0.75rem', 
          marginBottom: '1rem',
          color: '#065f46'
        }}>
          <strong>Note:</strong> This species doesn't use animal types. Phases will be created directly under the species.
        </div>
      )}

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
            {!animalTypeId && !editingPhase && animalTypes.length > 0 && (
              <div className="form-group">
                <label htmlFor="animalType" className="form-label">Animal Type *</label>
                <select
                  id="animalType"
                  value={selectedAnimalTypeForPhase}
                  onChange={(e) => setSelectedAnimalTypeForPhase(e.target.value)}
                  className="form-input"
                  required
                >
                  <option value="">Select Animal Type</option>
                  {animalTypes.map((animalType) => (
                    <option key={animalType.id} value={animalType.id}>
                      {animalType.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

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
                <label htmlFor="crudeProtein" className="form-label">Crude Protein (%)</label>
                <input
                  type="number"
                  step="0.1"
                  id="crudeProtein"
                  value={formData.crudeProtein}
                  onChange={(e) => setFormData({ ...formData, crudeProtein: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="meKcalPerKg" className="form-label">ME Kcal/kg</label>
                <input
                  type="number"
                  step="0.1"
                  id="meKcalPerKg"
                  value={formData.meKcalPerKg}
                  onChange={(e) => setFormData({ ...formData, meKcalPerKg: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="calcium" className="form-label">Calcium (%)</label>
                <input
                  type="number"
                  step="0.01"
                  id="calcium"
                  value={formData.calcium}
                  onChange={(e) => setFormData({ ...formData, calcium: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="availablePhosphorus" className="form-label">Available Phosphorus (%)</label>
                <input
                  type="number"
                  step="0.01"
                  id="availablePhosphorus"
                  value={formData.availablePhosphorus}
                  onChange={(e) => setFormData({ ...formData, availablePhosphorus: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="lysine" className="form-label">Lysine (%)</label>
                <input
                  type="number"
                  step="0.01"
                  id="lysine"
                  value={formData.lysine}
                  onChange={(e) => setFormData({ ...formData, lysine: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="methionine" className="form-label">Methionine (%)</label>
                <input
                  type="number"
                  step="0.01"
                  id="methionine"
                  value={formData.methionine}
                  onChange={(e) => setFormData({ ...formData, methionine: e.target.value })}
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
        {filteredPhases.map((phase) => (
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
                {(phase.crudeProtein || phase.meKcalPerKg || phase.calcium || phase.availablePhosphorus || phase.lysine || phase.methionine) && (
                  <div className="nutritional-requirements">
                    <h4>Nutrient Requirements</h4>
                    <div className="nutritional-grid">
                      {phase.crudeProtein && <div className="nutritional-item">
                        <span className="nutritional-label">Crude Protein:</span> {phase.crudeProtein}%
                      </div>}
                      {phase.meKcalPerKg && <div className="nutritional-item">
                        <span className="nutritional-label">ME Kcal/kg:</span> {phase.meKcalPerKg}
                      </div>}
                      {phase.calcium && <div className="nutritional-item">
                        <span className="nutritional-label">Calcium:</span> {phase.calcium}%
                      </div>}
                      {phase.availablePhosphorus && <div className="nutritional-item">
                        <span className="nutritional-label">Available Phosphorus:</span> {phase.availablePhosphorus}%
                      </div>}
                      {phase.lysine && <div className="nutritional-item">
                        <span className="nutritional-label">Lysine:</span> {phase.lysine}%
                      </div>}
                      {phase.methionine && <div className="nutritional-item">
                        <span className="nutritional-label">Methionine:</span> {phase.methionine}%
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

        {filteredPhases.length === 0 && (
          <div className="empty-state">
            <p>No phases found. Create your first phase to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhaseForm;