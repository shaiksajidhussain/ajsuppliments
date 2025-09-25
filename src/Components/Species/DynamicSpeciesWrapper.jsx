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
    if (!animalTypeId || !targetSpecies) return [];

    for (const subspecies of targetSpecies.subspecies) {
      const animalType = subspecies.animalTypes.find(at => at.id === animalTypeId);
      if (animalType && animalType.phases) {
        return animalType.phases.map(phase => ({
          value: phase.id,
          label: phase.name
        }));
      }
    }

    return [];
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
      backgroundImage={backgroundImage}
    />
  );
};

export default DynamicSpeciesWrapper;
