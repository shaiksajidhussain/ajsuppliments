import React, { useState, useEffect } from 'react';
import SharedSpeciesForm from './SharedSpeciesForm';

const DynamicSpeciesWrapper = ({ 
  speciesType, 
  speciesName, 
  backgroundImage 
}) => {
  const [speciesData, setSpeciesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSpeciesData = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3001/api/species/hierarchy');
        
        if (!response.ok) {
          throw new Error('Failed to fetch species data');
        }

        const data = await response.json();
        console.log('=== FETCHED SPECIES DATA ===');
        console.log('Raw API response:', data);
        console.log('Hierarchy data:', data.hierarchy);
        
        // Debug the Cattle species specifically
        const cattleSpecies = data.hierarchy.find(species => species.name === 'Cattle');
        if (cattleSpecies) {
          console.log('=== CATTLE SPECIES DEBUG ===');
          console.log('Cattle directAnimalTypes:', cattleSpecies.directAnimalTypes);
          if (cattleSpecies.directAnimalTypes && cattleSpecies.directAnimalTypes.length > 0) {
            console.log('First animal type phases:', cattleSpecies.directAnimalTypes[0].phases);
          }
        }
        
        setSpeciesData(data.hierarchy);
      } catch (error) {
        console.error('Error fetching species data:', error);
        setError('Failed to load species data');
      } finally {
        setLoading(false);
      }
    };

    fetchSpeciesData();
  }, []);

  // Find the specific species data
  const targetSpecies = speciesData.find(species => 
    species.name.toLowerCase() === speciesType.toLowerCase()
  );

  console.log('=== DYNAMIC SPECIES WRAPPER DEBUG ===');
  console.log('speciesType:', speciesType);
  console.log('speciesData:', speciesData);
  console.log('targetSpecies:', targetSpecies);

  // Convert to the format expected by SharedSpeciesForm
  const subspeciesOptions = targetSpecies?.subspecies?.map(subspecies => ({
    value: subspecies.id,
    label: subspecies.name
  })) || [];

  // Animal Type options based on subspecies ID
  const getAnimalTypeOptions = (subspeciesId) => {
    if (!subspeciesId || !targetSpecies) return [];

    const subspecies = targetSpecies.subspecies.find(sub => sub.id === subspeciesId);
    if (subspecies && subspecies.animalTypes) {
      return subspecies.animalTypes.map(animalType => ({
        value: animalType.id,
        label: animalType.name
      }));
    }

    return [];
  };

  // Phase options based on animal type ID
  const getPhaseOptions = (animalTypeId) => {
    console.log('=== getPhaseOptions DEBUG ===');
    console.log('animalTypeId:', animalTypeId);
    console.log('targetSpecies:', targetSpecies);
    
    if (!animalTypeId || !targetSpecies) return [];

    // Check direct animal types first (when subspecies are skipped)
    if (targetSpecies.directAnimalTypes && targetSpecies.directAnimalTypes.length > 0) {
      console.log('Checking directAnimalTypes:', targetSpecies.directAnimalTypes);
      const animalType = targetSpecies.directAnimalTypes.find(at => at.id === animalTypeId);
      console.log('Found animalType:', animalType);
      if (animalType && animalType.phases) {
        console.log('AnimalType phases:', animalType.phases);
        return animalType.phases.map(phase => ({
          value: phase.id,
          label: phase.name
        }));
      }
    }

    // Check traditional hierarchy (subspecies -> animal types)
    if (targetSpecies.subspecies && targetSpecies.subspecies.length > 0) {
      for (const subspecies of targetSpecies.subspecies) {
        if (subspecies.animalTypes) {
          const animalType = subspecies.animalTypes.find(at => at.id === animalTypeId);
          if (animalType && animalType.phases) {
            return animalType.phases.map(phase => ({
              value: phase.id,
              label: phase.name
            }));
          }
        }
      }
    }

    console.log('No phases found for animalTypeId:', animalTypeId);
    return [];
  };

  // Get all phases for a species (when subspecies/animal types are not included)
  const getSpeciesPhaseOptions = (speciesType) => {
    if (!speciesType || !targetSpecies) return [];

    console.log('getSpeciesPhaseOptions called for speciesType:', speciesType);
    console.log('targetSpecies:', targetSpecies);

    const allPhases = [];

    // First check for direct phases (when both subspecies and animal types are skipped)
    if (targetSpecies.directPhases && targetSpecies.directPhases.length > 0) {
      targetSpecies.directPhases.forEach(phase => {
        allPhases.push({
          value: phase.id,
          label: phase.name
        });
      });
    }

    // Check for phases in direct animal types (when subspecies are skipped but animal types exist)
    if (targetSpecies.directAnimalTypes && targetSpecies.directAnimalTypes.length > 0) {
      targetSpecies.directAnimalTypes.forEach(animalType => {
        if (animalType.phases && animalType.phases.length > 0) {
          animalType.phases.forEach(phase => {
            allPhases.push({
              value: phase.id,
              label: phase.name
            });
          });
        }
      });
    }

    // Check traditional hierarchy (subspecies -> animal types -> phases)
    if (targetSpecies.subspecies && targetSpecies.subspecies.length > 0) {
      targetSpecies.subspecies.forEach(subspecies => {
        if (subspecies.animalTypes) {
          subspecies.animalTypes.forEach(animalType => {
            if (animalType.phases && animalType.phases.length > 0) {
              animalType.phases.forEach(phase => {
                allPhases.push({
                  value: phase.id,
                  label: phase.name
                });
              });
            }
          });
        }
      });
    }

    // Remove duplicates based on phase name
    const uniquePhases = allPhases.filter((phase, index, self) => 
      index === self.findIndex(p => p.label === phase.label)
    );

    console.log('getSpeciesPhaseOptions returning phases:', uniquePhases);
    return uniquePhases;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-gray-600">Loading species data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-red-600">Error: {error}</div>
        </div>
      </div>
    );
  }

  if (!targetSpecies) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-red-600">Species "{speciesName}" not found</div>
        </div>
      </div>
    );
  }

  return (
    <SharedSpeciesForm
      speciesType={speciesType}
      speciesName={speciesName}
      subspeciesOptions={subspeciesOptions}
      getAnimalTypeOptions={getAnimalTypeOptions}
      getPhaseOptions={getPhaseOptions}
      getSpeciesPhaseOptions={getSpeciesPhaseOptions}
      speciesInclusionSettings={{
        notIncluded: targetSpecies.notIncluded,
        includeSubspecies: targetSpecies.includeSubspecies,
        includeAnimalTypes: targetSpecies.includeAnimalTypes,
        includePhases: targetSpecies.includePhases
      }}
      targetSpecies={targetSpecies}
      backgroundImage={backgroundImage}
    />
  );
};

export default DynamicSpeciesWrapper;
