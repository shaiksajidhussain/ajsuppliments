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
        description: species.description,
        notIncluded: species.notIncluded,
        includeSubspecies: species.includeSubspecies,
        includeAnimalTypes: species.includeAnimalTypes,
        includePhases: species.includePhases
      }));
      setSpecies(speciesData);
    } catch (error) {
      console.error('Error fetching hierarchy data:', error);
      setError('Failed to fetch hierarchy data');
    } finally {
      setLoading(false);
    }
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
      console.log('fetchPhases called with animalTypeId:', animalTypeId);
      console.log('hierarchyData:', hierarchyData);
      
      // Find the animal type in the hierarchy data
      for (const species of hierarchyData) {
        // Check direct animal types first (when subspecies are skipped)
        if (species.directAnimalTypes && species.directAnimalTypes.length > 0) {
          console.log('Checking directAnimalTypes for species:', species.name, species.directAnimalTypes);
          const animalType = species.directAnimalTypes.find(at => at.id === animalTypeId);
          if (animalType && animalType.phases) {
            console.log('Found phases in directAnimalTypes:', animalType.phases);
            setPhases(animalType.phases);
            return;
          }
        }
        
        // Check traditional hierarchy (subspecies -> animal types)
        for (const subspecies of species.subspecies) {
          const animalType = subspecies.animalTypes.find(at => at.id === animalTypeId);
          if (animalType && animalType.phases) {
            console.log('Found phases in traditional hierarchy:', animalType.phases);
            setPhases(animalType.phases);
            return;
          }
        }
      }
      console.log('No phases found for animalTypeId:', animalTypeId);
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
    
    // Find the selected species to check inclusion settings
    const selectedSpeciesData = hierarchyData.find(species => species.id === speciesId);
    
    if (selectedSpeciesData) {
      // Always fetch subspecies data first
      fetchSubspecies(speciesId);
      
      // Determine which tab to navigate to based on inclusion settings
      if (selectedSpeciesData.includeSubspecies) {
        setActiveTab('subspecies');
      } else if (selectedSpeciesData.includeAnimalTypes) {
        // Skip subspecies tab, go directly to animal types
        // First check for direct animal types (when subspecies are skipped)
        if (selectedSpeciesData.directAnimalTypes && selectedSpeciesData.directAnimalTypes.length > 0) {
          setAnimalTypes(selectedSpeciesData.directAnimalTypes);
        } else {
          // Fallback to traditional hierarchy
          const allAnimalTypes = [];
          selectedSpeciesData.subspecies.forEach(subspecies => {
            if (subspecies.animalTypes) {
              allAnimalTypes.push(...subspecies.animalTypes);
            }
          });
          setAnimalTypes(allAnimalTypes);
        }
        setActiveTab('animal-types');
      } else if (selectedSpeciesData.includePhases) {
        // Skip subspecies and animal types tabs, go directly to phases
        // First check for direct phases (when both subspecies and animal types are skipped)
        if (selectedSpeciesData.directPhases && selectedSpeciesData.directPhases.length > 0) {
          setPhases(selectedSpeciesData.directPhases);
        } else {
          // Fallback to traditional hierarchy
          const allPhases = [];
          selectedSpeciesData.subspecies.forEach(subspecies => {
            subspecies.animalTypes.forEach(animalType => {
              if (animalType.phases) {
                allPhases.push(...animalType.phases);
              }
            });
          });
          setPhases(allPhases);
        }
        setActiveTab('phases');
      } else {
        // No inclusions enabled, stay on species tab
        setActiveTab('species');
      }
    } else {
      // Fallback to old behavior
      fetchSubspecies(speciesId);
      setActiveTab('subspecies');
    }
  };

  // Helper function to populate data for a specific tab
  const populateTabData = (speciesData, tab) => {
    if (tab === 'animal-types') {
      // First check for direct animal types (when subspecies are skipped)
      if (speciesData.directAnimalTypes && speciesData.directAnimalTypes.length > 0) {
        setAnimalTypes(speciesData.directAnimalTypes);
      } else {
        // Fallback to traditional hierarchy
        const allAnimalTypes = [];
        speciesData.subspecies.forEach(subspecies => {
          if (subspecies.animalTypes) {
            allAnimalTypes.push(...subspecies.animalTypes);
          }
        });
        setAnimalTypes(allAnimalTypes);
      }
    } else if (tab === 'phases') {
      const allPhases = [];
      
      // First check for direct phases (when both subspecies and animal types are skipped)
      if (speciesData.directPhases && speciesData.directPhases.length > 0) {
        allPhases.push(...speciesData.directPhases);
      }
      
      // Check for phases in direct animal types (when subspecies are skipped but animal types exist)
      if (speciesData.directAnimalTypes && speciesData.directAnimalTypes.length > 0) {
        speciesData.directAnimalTypes.forEach(animalType => {
          if (animalType.phases && animalType.phases.length > 0) {
            allPhases.push(...animalType.phases);
          }
        });
      }
      
      // Check traditional hierarchy (subspecies -> animal types -> phases)
      if (speciesData.subspecies && speciesData.subspecies.length > 0) {
        speciesData.subspecies.forEach(subspecies => {
          if (subspecies.animalTypes) {
            subspecies.animalTypes.forEach(animalType => {
              if (animalType.phases && animalType.phases.length > 0) {
                allPhases.push(...animalType.phases);
              }
            });
          }
        });
      }
      
      console.log('Populating phases for tab:', tab, 'Found phases:', allPhases);
      setPhases(allPhases);
    }
  };

  // Handle manual tab navigation
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    
    // If a species is selected, populate the data for the clicked tab
    if (selectedSpecies) {
      const selectedSpeciesData = hierarchyData.find(species => species.id === selectedSpecies);
      if (selectedSpeciesData) {
        populateTabData(selectedSpeciesData, tab);
      }
    }
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
        description: species.description,
        notIncluded: species.notIncluded,
        includeSubspecies: species.includeSubspecies,
        includeAnimalTypes: species.includeAnimalTypes,
        includePhases: species.includePhases
      }));
      setSpecies(speciesData);

      // Re-fetch current selections with the fresh data
      if (selectedSpecies) {
        // Find the species in the fresh data
        for (const species of data.hierarchy) {
          if (species.id === selectedSpecies) {
            setSubspecies(species.subspecies || []);
            
            // Handle direct animal types (when subspecies are skipped)
            if (species.directAnimalTypes && species.directAnimalTypes.length > 0) {
              setAnimalTypes(species.directAnimalTypes);
              
              if (selectedAnimalType) {
                // Find the phases for the selected direct animal type
                const animalType = species.directAnimalTypes.find(at => at.id === selectedAnimalType);
                if (animalType && animalType.phases) {
                  setPhases(animalType.phases);
                }
              }
            }
            // Handle traditional hierarchy (when subspecies exist)
            else if (selectedSubspecies) {
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
            
            // Handle direct phases (when both subspecies and animal types are skipped)
            if (species.directPhases && species.directPhases.length > 0) {
              setPhases(species.directPhases);
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

  // Get inclusion settings for currently selected species
  const getCurrentSpeciesInclusionSettings = () => {
    if (!selectedSpecies || !hierarchyData.length) return null;
    return hierarchyData.find(species => species.id === selectedSpecies);
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
          onClick={() => handleTabClick('species')}
          className={`species-nav-btn ${activeTab === 'species' ? 'active' : ''}`}
        >
          Species
        </button>
        <button
          onClick={() => handleTabClick('subspecies')}
          disabled={!selectedSpecies}
          className={`species-nav-btn ${activeTab === 'subspecies' ? 'active' : ''}`}
        >
          Subspecies
        </button>
        <button
          onClick={() => handleTabClick('animal-types')}
          disabled={!selectedSpecies || !getCurrentSpeciesInclusionSettings()?.includeAnimalTypes}
          className={`species-nav-btn ${activeTab === 'animal-types' ? 'active' : ''}`}
        >
          Animal Types
        </button>
        <button
          onClick={() => handleTabClick('phases')}
          disabled={!selectedSpecies || !getCurrentSpeciesInclusionSettings()?.includePhases}
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
          {activeTab === 'animal-types' && (selectedSubspecies || animalTypes.length > 0 || (selectedSpecies && !getCurrentSpeciesInclusionSettings()?.includeSubspecies)) && (
            <AnimalTypeForm
              animalTypes={animalTypes}
              subspeciesId={selectedSubspecies}
              subspecies={subspecies}
              speciesId={selectedSpecies}
              onRefresh={handleSmartRefresh}
              onSelect={handleAnimalTypeSelect}
            />
          )}
          {activeTab === 'phases' && (selectedAnimalType || phases.length > 0 || (selectedSpecies && !getCurrentSpeciesInclusionSettings()?.includeSubspecies && !getCurrentSpeciesInclusionSettings()?.includeAnimalTypes)) && (
            <PhaseForm
              phases={phases}
              animalTypeId={selectedAnimalType}
              animalTypes={animalTypes}
              speciesId={selectedSpecies}
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
