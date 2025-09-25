import React, { useState, useEffect } from 'react';
import SpeciesForm from './SpeciesForm';
import SubspeciesForm from './SubspeciesForm';
import AnimalTypeForm from './AnimalTypeForm';
import PhaseForm from './PhaseForm';

const SpeciesManagement = () => {
  const [species, setSpecies] = useState([]);
  const [subspecies, setSubspecies] = useState([]);
  const [animalTypes, setAnimalTypes] = useState([]);
  const [phases, setPhases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('species');
  const [selectedSpecies, setSelectedSpecies] = useState(null);
  const [selectedSubspecies, setSelectedSubspecies] = useState(null);
  const [selectedAnimalType, setSelectedAnimalType] = useState(null);
  const [hierarchyData, setHierarchyData] = useState([]); // Store complete hierarchy data

  useEffect(() => {
    fetchHierarchyData();
  }, []);

  const fetchHierarchyData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:3001/api/species/hierarchy', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch hierarchy data');
      }

      const data = await response.json();
      setHierarchyData(data.hierarchy);
      
      // Extract species data from hierarchy
      const speciesData = data.hierarchy.map(species => ({
        id: species.id,
        name: species.name,
        description: species.description
      }));
      setSpecies(speciesData);
    } catch (error) {
      console.error('Error fetching hierarchy data:', error);
      setError('Failed to fetch hierarchy data');
    } finally {
      setLoading(false);
    }
  };

  const fetchSpecies = async () => {
    // This function is now handled by fetchHierarchyData
    await fetchHierarchyData();
  };

  const fetchSubspecies = async (speciesId) => {
    try {
      // Find the species in the hierarchy data
      const selectedSpecies = hierarchyData.find(species => species.id === speciesId);
      
      if (selectedSpecies && selectedSpecies.subspecies) {
        const formattedSubspecies = selectedSpecies.subspecies.map(subspecies => ({
          id: subspecies.id,
          name: subspecies.name,
          description: subspecies.description
        }));
        setSubspecies(formattedSubspecies);
      } else {
        setSubspecies([]);
      }
    } catch (error) {
      console.error('Error fetching subspecies:', error);
      setError('Failed to fetch subspecies');
    }
  };

  const fetchAnimalTypes = async (subspeciesId) => {
    try {
      // Find the subspecies in the hierarchy data
      for (const species of hierarchyData) {
        const subspecies = species.subspecies.find(sub => sub.id === subspeciesId);
        if (subspecies && subspecies.animalTypes) {
          setAnimalTypes(subspecies.animalTypes);
          return;
        }
      }
      setAnimalTypes([]);
    } catch (error) {
      console.error('Error fetching animal types:', error);
      setError('Failed to fetch animal types');
    }
  };

  const fetchPhases = async (animalTypeId) => {
    try {
      // Find the animal type in the hierarchy data
      for (const species of hierarchyData) {
        for (const subspecies of species.subspecies) {
          const animalType = subspecies.animalTypes.find(at => at.id === animalTypeId);
          if (animalType && animalType.phases) {
            setPhases(animalType.phases);
            return;
          }
        }
      }
      setPhases([]);
    } catch (error) {
      console.error('Error fetching phases:', error);
      setError('Failed to fetch phases');
    }
  };

  const handleSpeciesSelect = (speciesId) => {
    setSelectedSpecies(speciesId);
    setSelectedSubspecies(null);
    setSelectedAnimalType(null);
    setSubspecies([]);
    setAnimalTypes([]);
    setPhases([]);
    fetchSubspecies(speciesId);
    setActiveTab('subspecies');
  };

  const handleSubspeciesSelect = (subspeciesId) => {
    setSelectedSubspecies(subspeciesId);
    setSelectedAnimalType(null);
    setAnimalTypes([]);
    setPhases([]);
    fetchAnimalTypes(subspeciesId);
    setActiveTab('animal-types');
  };

  const handleAnimalTypeSelect = (animalTypeId) => {
    setSelectedAnimalType(animalTypeId);
    setPhases([]);
    fetchPhases(animalTypeId);
    setActiveTab('phases');
  };

  const handleRefresh = () => {
    fetchHierarchyData(); // Refresh the complete hierarchy data
    setSelectedSpecies(null);
    setSelectedSubspecies(null);
    setSelectedAnimalType(null);
    setSubspecies([]);
    setAnimalTypes([]);
    setPhases([]);
    setActiveTab('species');
  };

  // Smart refresh that maintains current selections
  const handleSmartRefresh = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:3001/api/species/hierarchy', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch hierarchy data');
      }

      const data = await response.json();
      setHierarchyData(data.hierarchy);
      
      // Extract species data from hierarchy
      const speciesData = data.hierarchy.map(species => ({
        id: species.id,
        name: species.name,
        description: species.description
      }));
      setSpecies(speciesData);

      // Re-fetch current selections with the fresh data
      if (selectedSpecies) {
        // Find the subspecies in the fresh data
        for (const species of data.hierarchy) {
          if (species.id === selectedSpecies) {
            setSubspecies(species.subspecies || []);
            
            if (selectedSubspecies) {
              // Find the animal types for the selected subspecies
              const subspecies = species.subspecies.find(sub => sub.id === selectedSubspecies);
              if (subspecies && subspecies.animalTypes) {
                setAnimalTypes(subspecies.animalTypes);
                
                if (selectedAnimalType) {
                  // Find the phases for the selected animal type
                  const animalType = subspecies.animalTypes.find(at => at.id === selectedAnimalType);
                  if (animalType && animalType.phases) {
                    setPhases(animalType.phases);
                  }
                }
              }
            }
            break;
          }
        }
      }
    } catch (error) {
      console.error('Error in smart refresh:', error);
      setError('Failed to refresh data');
    } finally {
      setLoading(false);
    }
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
          onClick={handleRefresh}
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
        <h2 className="species-title">Species Management</h2>
        <button
          onClick={handleRefresh}
          className="species-refresh-btn"
        >
          Refresh
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="species-nav">
        <button
          onClick={() => setActiveTab('species')}
          className={`species-nav-btn ${activeTab === 'species' ? 'active' : ''}`}
        >
          Species
        </button>
        <button
          onClick={() => setActiveTab('subspecies')}
          disabled={!selectedSpecies}
          className={`species-nav-btn ${activeTab === 'subspecies' ? 'active' : ''}`}
        >
          Subspecies
        </button>
        <button
          onClick={() => setActiveTab('animal-types')}
          disabled={!selectedSubspecies}
          className={`species-nav-btn ${activeTab === 'animal-types' ? 'active' : ''}`}
        >
          Animal Types
        </button>
        <button
          onClick={() => setActiveTab('phases')}
          disabled={!selectedAnimalType}
          className={`species-nav-btn ${activeTab === 'phases' ? 'active' : ''}`}
        >
          Phases
        </button>
      </div>

      {/* Content */}
      <div className="species-grid">
        {/* List Section */}
        <div className="species-list">
          {activeTab === 'species' && (
            <SpeciesForm
              species={species}
              onRefresh={handleRefresh}
              onSelect={handleSpeciesSelect}
            />
          )}
          {activeTab === 'subspecies' && selectedSpecies && (
            <SubspeciesForm
              subspecies={subspecies}
              speciesId={selectedSpecies}
              onRefresh={handleSmartRefresh}
              onSelect={handleSubspeciesSelect}
            />
          )}
          {activeTab === 'animal-types' && selectedSubspecies && (
            <AnimalTypeForm
              animalTypes={animalTypes}
              subspeciesId={selectedSubspecies}
              onRefresh={handleSmartRefresh}
              onSelect={handleAnimalTypeSelect}
            />
          )}
          {activeTab === 'phases' && selectedAnimalType && (
            <PhaseForm
              phases={phases}
              animalTypeId={selectedAnimalType}
              onRefresh={handleSmartRefresh}
            />
          )}
        </div>

        {/* Hierarchy View */}
        <div className="species-hierarchy">
          <h3>Hierarchy View</h3>
          <div className="hierarchy-tree">
            {hierarchyData.map((sp) => (
              <div key={sp.id} className="hierarchy-item">
                <div className={`hierarchy-item ${selectedSpecies === sp.id ? 'selected' : ''}`}>
                  <div className="hierarchy-item-name">{sp.name}</div>
                  {sp.description && (
                    <div className="hierarchy-item-desc">{sp.description}</div>
                  )}
                  {sp.subspecies && sp.subspecies.length > 0 && (
                    <div className="hierarchy-subitems">
                      {sp.subspecies.map((sub) => (
                        <div key={sub.id} className="hierarchy-subitem">
                          <span>└ {sub.name}</span>
                          {sub.animalTypes && sub.animalTypes.length > 0 && (
                            <div style={{ marginLeft: '1rem', marginTop: '0.25rem' }}>
                              {sub.animalTypes.map((at) => (
                                <div key={at.id} style={{ marginBottom: '0.25rem' }}>
                                  <span>└ {at.name}</span>
                                  {at.phases && at.phases.length > 0 && (
                                    <div style={{ marginLeft: '1rem', marginTop: '0.25rem' }}>
                                      {at.phases.map((phase) => (
                                        <div key={phase.id} style={{ marginBottom: '0.25rem' }}>
                                          <span>└ {phase.name}</span>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpeciesManagement;
