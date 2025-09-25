import React, { useState, useEffect } from 'react';

const DynamicSpeciesForm = ({ 
  selectedSpecies, 
  selectedSubspecies, 
  selectedAnimalType, 
  selectedPhase,
  onSpeciesChange, 
  onSubspeciesChange, 
  onAnimalTypeChange, 
  onPhaseChange,
  className = "" 
}) => {
  const [speciesData, setSpeciesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSpeciesData();
  }, []);

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

  const handleSpeciesChange = (e) => {
    const speciesId = e.target.value;
    const species = speciesData.find(s => s.id === speciesId);
    
    onSpeciesChange(speciesId, species?.name || '');
    onSubspeciesChange('', '');
    onAnimalTypeChange('', '');
    onPhaseChange('', '');
  };

  const handleSubspeciesChange = (e) => {
    const subspeciesId = e.target.value;
    const species = speciesData.find(s => s.id === selectedSpecies);
    const subspecies = species?.subspecies.find(sub => sub.id === subspeciesId);
    
    onSubspeciesChange(subspeciesId, subspecies?.name || '');
    onAnimalTypeChange('', '');
    onPhaseChange('', '');
  };

  const handleAnimalTypeChange = (e) => {
    const animalTypeId = e.target.value;
    const species = speciesData.find(s => s.id === selectedSpecies);
    const subspecies = species?.subspecies.find(sub => sub.id === selectedSubspecies);
    const animalType = subspecies?.animalTypes.find(at => at.id === animalTypeId);
    
    onAnimalTypeChange(animalTypeId, animalType?.name || '');
    onPhaseChange('', '');
  };

  const handlePhaseChange = (e) => {
    const phaseId = e.target.value;
    const species = speciesData.find(s => s.id === selectedSpecies);
    const subspecies = species?.subspecies.find(sub => sub.id === selectedSubspecies);
    const animalType = subspecies?.animalTypes.find(at => at.id === selectedAnimalType);
    const phase = animalType?.phases.find(p => p.id === phaseId);
    
    onPhaseChange(phaseId, phase?.name || '');
  };

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <button
                  onClick={fetchSpeciesData}
                  className="bg-red-100 px-3 py-2 rounded-md text-sm font-medium text-red-800 hover:bg-red-200"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const selectedSpeciesData = speciesData.find(s => s.id === selectedSpecies);
  const selectedSubspeciesData = selectedSpeciesData?.subspecies.find(sub => sub.id === selectedSubspecies);
  const selectedAnimalTypeData = selectedSubspeciesData?.animalTypes.find(at => at.id === selectedAnimalType);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Species Selection */}
      <div>
        <label htmlFor="species" className="block text-sm font-medium text-gray-700 mb-2">
          Species *
        </label>
        <select
          id="species"
          value={selectedSpecies}
          onChange={handleSpeciesChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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

      {/* Subspecies Selection */}
      {selectedSpeciesData && (
        <div>
          <label htmlFor="subspecies" className="block text-sm font-medium text-gray-700 mb-2">
            Subspecies
          </label>
          <select
            id="subspecies"
            value={selectedSubspecies}
            onChange={handleSubspeciesChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Subspecies</option>
            {selectedSpeciesData.subspecies.map((subspecies) => (
              <option key={subspecies.id} value={subspecies.id}>
                {subspecies.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Animal Type Selection */}
      {selectedSubspeciesData && (
        <div>
          <label htmlFor="animalType" className="block text-sm font-medium text-gray-700 mb-2">
            Animal Type
          </label>
          <select
            id="animalType"
            value={selectedAnimalType}
            onChange={handleAnimalTypeChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Animal Type</option>
            {selectedSubspeciesData.animalTypes.map((animalType) => (
              <option key={animalType.id} value={animalType.id}>
                {animalType.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Phase Selection */}
      {selectedAnimalTypeData && (
        <div>
          <label htmlFor="phase" className="block text-sm font-medium text-gray-700 mb-2">
            Phase *
          </label>
          <select
            id="phase"
            value={selectedPhase}
            onChange={handlePhaseChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select Phase</option>
            {selectedAnimalTypeData.phases.map((phase) => (
              <option key={phase.id} value={phase.id}>
                {phase.name}
                {phase.minProtein && phase.maxProtein && (
                  <span className="text-gray-500"> ({phase.minProtein}-{phase.maxProtein}% protein)</span>
                )}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Nutritional Requirements Display */}
      {selectedPhase && selectedAnimalTypeData && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h4 className="text-sm font-medium text-blue-900 mb-2">Nutritional Requirements</h4>
          {(() => {
            const phase = selectedAnimalTypeData.phases.find(p => p.id === selectedPhase);
            if (!phase) return null;
            
            return (
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-blue-800">Protein: </span>
                  <span className="text-blue-700">
                    {phase.minProtein && phase.maxProtein 
                      ? `${phase.minProtein}% - ${phase.maxProtein}%`
                      : phase.minProtein 
                      ? `≥ ${phase.minProtein}%`
                      : phase.maxProtein
                      ? `≤ ${phase.maxProtein}%`
                      : 'Not specified'
                    }
                  </span>
                </div>
                <div>
                  <span className="font-medium text-blue-800">Energy: </span>
                  <span className="text-blue-700">
                    {phase.minEnergy && phase.maxEnergy 
                      ? `${phase.minEnergy} - ${phase.maxEnergy} kcal/kg`
                      : phase.minEnergy 
                      ? `≥ ${phase.minEnergy} kcal/kg`
                      : phase.maxEnergy
                      ? `≤ ${phase.maxEnergy} kcal/kg`
                      : 'Not specified'
                    }
                  </span>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};

export default DynamicSpeciesForm;
