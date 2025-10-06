import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import IngredientSelection from './IngredientSelection';

const OurSoftware = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    feedBatchWeight: '100',
    species: '',
    subspecies: '',
    animalType: 'broiler',
    phase: 'finisher',
    crudeProtein: '',
    energy: '',
    includePremix: true
  });
  const [error, setError] = useState('');

  // Pre-populate species from localStorage
  useEffect(() => { 
    const selectedSpecies = localStorage.getItem('selectedSpecies');
    if (selectedSpecies) {
      setFormData(prev => ({
        ...prev,
        species: selectedSpecies
      }));
    }
  }, []);

  // Dynamic species data from API
  const [speciesData, setSpeciesData] = useState([]);
  const [loadingSpecies, setLoadingSpecies] = useState(true);
  const [selectedIngredients, setSelectedIngredients] = useState([]);

  // Fetch dynamic species data
  useEffect(() => {
    const fetchSpeciesData = async () => {
      try {
        setLoadingSpecies(true);
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
        setLoadingSpecies(false);
      }
    };

    fetchSpeciesData();
  }, []);

  // Convert dynamic data to options format
  const speciesOptions = speciesData.map(species => ({
    value: species.id,
    label: species.name,
    notIncluded: species.notIncluded,
    includeSubspecies: species.includeSubspecies,
    includeAnimalTypes: species.includeAnimalTypes,
    includePhases: species.includePhases
  }));

  const subspeciesOptions = {};
  speciesData.forEach(species => {
    subspeciesOptions[species.id] = species.subspecies.map(subspecies => ({
      value: subspecies.id,
      label: subspecies.name
    }));
  });

  // Get current species data
  const getCurrentSpecies = () => {
    return speciesData.find(species => species.id === formData.species);
  };

  // Animal Type options based on subspecies ID (dynamic from API)
  const getAnimalTypeOptions = (subspeciesId) => {
    if (!subspeciesId || !speciesData.length) return [];

    // Find the subspecies in the dynamic data
    for (const species of speciesData) {
      const subspecies = species.subspecies.find(sub => sub.id === subspeciesId);
      if (subspecies && subspecies.animalTypes) {
        return subspecies.animalTypes.map(animalType => ({
          value: animalType.id,
          label: animalType.name
        }));
      }
    }

    return [];
  };

  // Phase options based on animal type ID (dynamic from API)
  const getPhaseOptions = (animalTypeId) => {
    if (!animalTypeId || !speciesData.length) return [];

    // Find the animal type in the dynamic data
    for (const species of speciesData) {
      for (const subspecies of species.subspecies) {
        const animalType = subspecies.animalTypes.find(at => at.id === animalTypeId);
        if (animalType && animalType.phases) {
          return animalType.phases.map(phase => ({
            value: phase.id,
            label: phase.name
          }));
        }
      }
    }

    return [];
  };

  // Get all phases for a species (when subspecies/animal types are not included)
  const getSpeciesPhaseOptions = (speciesId) => {
    if (!speciesId || !speciesData.length) return [];

    const species = speciesData.find(s => s.id === speciesId);
    if (!species) return [];

    // Collect all phases from all subspecies and animal types
    const allPhases = [];
    species.subspecies.forEach(subspecies => {
      subspecies.animalTypes.forEach(animalType => {
        if (animalType.phases) {
          animalType.phases.forEach(phase => {
            allPhases.push({
              value: phase.id,
              label: phase.name
            });
          });
        }
      });
    });

    // Remove duplicates based on phase name
    const uniquePhases = allPhases.filter((phase, index, self) => 
      index === self.findIndex(p => p.label === phase.label)
    );

    return uniquePhases;
  };

  // Legacy function for backward compatibility (not used anymore)
  // eslint-disable-next-line no-unused-vars
  const getPhaseOptionsLegacy = (animalType, subspecies, species) => {
    // Special handling for Quails
    if (subspecies === 'quails') {
      switch (animalType) {
        case 'broiler':
          return [
            { value: 'starter', label: 'Starter' },
            { value: 'finisher', label: 'Finisher' }
          ];
        case 'breeder':
          return [
            { value: 'broiler_breeders', label: 'Broiler Breeders' },
            { value: 'layer_breeders', label: 'Layer Breeders' }
          ];
        default:
          return [
            { value: 'starter', label: 'Starter' },
            { value: 'finisher', label: 'Finisher' }
          ];
      }
    }

    // Special handling for Turkey
    if (subspecies === 'turkey') {
      switch (animalType) {
        case 'layer':
          return [
            { value: '0_6wks', label: '0-6wks' },
            { value: '6_12wks', label: '6-12 wks' },
            { value: '12_18wks', label: '12-18 wks' },
            { value: '18wk_pre_laying', label: '18wk pre-laying' },
            { value: 'layers_breeder', label: 'Layers / Breeder' }
          ];
        default:
          return [
            { value: '0_6wks', label: '0-6wks' },
            { value: '6_12wks', label: '6-12 wks' },
            { value: '12_18wks', label: '12-18 wks' },
            { value: '18wk_pre_laying', label: '18wk pre-laying' },
            { value: 'breeder', label: 'Breeder' }
          ];
      }
    }

    // Special handling for Duck
    if (subspecies === 'duck') {
      switch (animalType) {
        case 'layer':
          return [
            { value: 'starter_0_8wks', label: 'Starter (0-8 wks)' },
            { value: 'grower_8_16wks', label: 'Grower (8 to 16 wks)' },
            { value: 'rearer_16_20wks', label: 'Rearer (16-20 wks)' },
            { value: 'layer_20wks', label: 'Layer (>20wks)' }
          ];
        default:
          return [
            { value: 'starter_0_8wks', label: 'Starter (0-8 wks)' },
            { value: 'grower_8_16wks', label: 'Grower (8 to 16 wks)' },
            { value: 'rearer_16_20wks', label: 'Rearer (16-20 wks)' },
            { value: 'layer_20wks', label: 'Layer (>20wks)' }
          ];
      }
    }

    // Special handling for Cattle (using species directly)
    if (species === 'cattle') {
      return [
        { value: 'calf_starter', label: 'Calf starter meal' },
        { value: 'type1_high_yielding', label: 'Type 1 (High yielding)' },
        { value: 'type2_medium_yielding', label: 'Type 2 (medium yielding)' },
        { value: 'type3', label: 'Type 3' },
        { value: 'gestating', label: 'Gestating' },
        { value: 'lactating', label: 'Lactating' }
      ];
    }

    // Special handling for Buffalo (using species directly)
    if (species === 'buffalo') {
      return [
        { value: 'calf_starter', label: 'Calf starter meal' },
        { value: 'calf_growth', label: 'Calf growth meal' },
        { value: 'type1_high_yielding', label: 'Type 1 (High yielding)' },
        { value: 'type2_medium_yielding', label: 'Type 2 (medium yielding)' },
        { value: 'type3', label: 'Type 3' },
        { value: 'gestating', label: 'Gestating' },
        { value: 'lactating', label: 'Lactating' }
      ];
    }

    // Special handling for Sheep (using species directly)
    if (species === 'sheep') {
      return [
        { value: 'growing_lambs', label: 'Growing lambs' },
        { value: 'pregnant', label: 'Pregnant' },
        { value: 'lactating', label: 'Lactating' },
        { value: 'breeding_male', label: 'Breeding male' }
      ];
    }

    // Special handling for Goat (using species directly)
    if (species === 'goat') {
      return [
        { value: 'growing_lambs', label: 'Growing lambs' },
        { value: 'pregnant', label: 'Pregnant' },
        { value: 'lactating', label: 'Lactating' },
        { value: 'breeding_male', label: 'Breeding male' }
      ];
    }

    // Special handling for Swine (using species and animal type)
    if (species === 'swine') {
      if (animalType === 'marketing_pigs') {
        return [
          { value: 'starter_creep', label: 'Starter/Creep feed' },
          { value: 'growers_feed', label: 'Growers feed' },
          { value: 'finishing_feed', label: 'Finishing feed' }
        ];
      } else if (animalType === 'no_marketing_pigs') {
        return [
          { value: 'gestating_pigs', label: 'Gestating pigs' },
          { value: 'nursing_sow', label: 'Nursing sow' },
          { value: 'breeding_male', label: 'Breeding male' }
        ];
      } else {
        // Default case - show all options
        return [
          { value: 'starter_creep', label: 'Starter/Creep feed' },
          { value: 'growers_feed', label: 'Growers feed' },
          { value: 'finishing_feed', label: 'Finishing feed' },
          { value: 'gestating_pigs', label: 'Gestating pigs' },
          { value: 'nursing_sow', label: 'Nursing sow' },
          { value: 'breeding_male', label: 'Breeding male' }
        ];
      }
    }

    // Default handling for Chicken and other subspecies
    switch (animalType) {
      case 'broiler':
        return [
          { value: 'starter', label: 'Starter' },
          { value: 'grower', label: 'Grower' },
          { value: 'finisher', label: 'Finisher' }
        ];
      case 'layer':
        return [
          { value: 'chick', label: 'Chick' },
          { value: 'grower', label: 'Grower' },
          { value: 'pre_layer', label: 'Pre layer' },
          { value: 'layer', label: 'Layer ' },
          { value: 'male', label: 'Male ' }
        ];
      case 'broilerbreeder':
        return [
          { value: 'chick', label: 'Chick' },
          { value: 'grower', label: 'Grower' },
          { value: 'pre_layer', label: 'Pre layer' },
          { value: 'layer', label: 'Layer' },
          { value: 'male', label: 'Male' }
        ];
      case 'layerbreeder':
        return [
          { value: 'chick', label: 'Chick' },
          { value: 'grower', label: 'Grower' },
          { value: 'pre_layer', label: 'Pre layer' },
          { value: 'layer', label: 'Layer ' },
          { value: 'male', label: 'Male ' }
        ];
      default:
        return [
          { value: 'starter', label: 'Starter' },
          { value: 'grower', label: 'Grower' },
          { value: 'finisher', label: 'Finisher' }
        ];
    }
  };



  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear subspecies and animal type when species changes
    if (name === 'species') {
      // eslint-disable-next-line no-unused-vars
      const currentSpecies = speciesData.find(species => species.id === value);
      setFormData(prev => ({
        ...prev,
        subspecies: '',
        animalType: '',
        phase: ''
      }));
    }

    // Reset animal type when subspecies changes
    if (name === 'subspecies') {
      const animalTypeOptions = getAnimalTypeOptions(value);
      setFormData(prev => ({
        ...prev,
        animalType: animalTypeOptions[0]?.value || '',
        phase: ''
      }));
    }

    // Reset phase when animal type changes
    if (name === 'animalType') {
      const phaseOptions = getPhaseOptions(value);
      setFormData(prev => ({
        ...prev,
        phase: phaseOptions[0]?.value || ''
      }));
    }

    // Clear error when user starts typing
    if (error) setError('');
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.feedBatchWeight || !formData.species) {
      setError('Please fill in all required fields');
      return;
    }

    // Only require subspecies for poultry
    if (formData.species === 'poultry' && !formData.subspecies) {
      setError('Please select a subspecies for poultry');
      return;
    }

    // Log selected ingredients for debugging
    console.log('Form submitted with selected ingredients:', selectedIngredients);
   
  };


  return (
    <div 
      className="min-h-screen relative"
      style={{
        backgroundImage: 'url(https://images.stockcake.com/public/1/4/d/14d133a4-16ec-46bf-b384-da364125b7ff_large/sunset-farm-hen-stockcake.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/75"></div>
      
      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className=" backdrop-blur-sm border-b border-gray-200 px-6 py-4" style={{padding: '32px 16px'}}>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Feed Formulation</h1>
            <div className="flex items-center space-x-4 gap-7">
              <button 
                onClick={() => navigate('/species')}
                className=" bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                style={{padding:'4px'}}
              >
                ← Back to Species
              </button>
              <span className="text-white text-sm">
                Welcome, {localStorage.getItem('userEmail') || 'User'}
              </span>
              <button 
                onClick={() => {
                  localStorage.removeItem('isLoggedIn');
                  localStorage.removeItem('userEmail');
                  localStorage.removeItem('loginTime');
                  localStorage.removeItem('selectedSpecies');
                  navigate('/login');
                }}
                className=" bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200"
                style={{padding:'4px'}}
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8" style={{padding: '32px 16px'}} >
          {loadingSpecies ? (
            <div className="text-center py-8">
              <div className="text-lg text-gray-600">Loading species data...</div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
            {/* General Formulation Parameters */}
            <div className="bg-white/95 backdrop-blur-sm rounded-lg p-6 shadow-xl border border-white/20">
            <h2 className="text-5xl font-semibold text-gray-900" style={{padding: '10px 16px'}}>General Formulation Parameters</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 " style={{padding: '32px 16px'}}>
              {/* Feed Batch Weight */}
              <div>
                <label htmlFor="feedBatchWeight" className="block text-sm font-medium text-gray-700 mb-2">
                  Feed Batch Weight (kg):
                </label>
                <input
                  type="number"
                  id="feedBatchWeight"
                  name="feedBatchWeight"
                  value={formData.feedBatchWeight}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                />
              </div>

              {/* Species */}
              <div>
                <label htmlFor="species" className="block text-sm font-medium text-gray-700 mb-2">
                  Species:
                </label>
                <select
                  id="species"
                  name="species"
                  value={formData.species}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                >
                  <option value="">Select Species</option>
                  {speciesOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subspecies - Show if species includes subspecies */}
              {formData.species && getCurrentSpecies()?.includeSubspecies && subspeciesOptions[formData.species] && subspeciesOptions[formData.species].length > 0 && (
                <div>
                  <label htmlFor="subspecies" className="block text-sm font-medium text-gray-700 mb-2">
                    Subspecies:
                  </label>
                  <select
                    id="subspecies"
                    name="subspecies"
                    value={formData.subspecies}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                  >
                    <option value="">Select Subspecies</option>
                    {subspeciesOptions[formData.species].map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Animal Type - Show if species includes animal types and subspecies has animal types */}
              {formData.subspecies && getCurrentSpecies()?.includeAnimalTypes && getAnimalTypeOptions(formData.subspecies).length > 0 && (
                <div>
                  <label htmlFor="animalType" className="block text-sm font-medium text-gray-700 mb-2">
                    Animal Type:
                  </label>
                  <select
                    id="animalType"
                    name="animalType"
                    value={formData.animalType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                  >
                    <option value="">Select Animal Type</option>
                    {getAnimalTypeOptions(formData.subspecies).map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Phase - Show if species includes phases */}
              {getCurrentSpecies()?.includePhases && (
                (formData.animalType && getPhaseOptions(formData.animalType).length > 0) || 
                (formData.species && !getCurrentSpecies()?.includeSubspecies && !getCurrentSpecies()?.includeAnimalTypes && getSpeciesPhaseOptions(formData.species).length > 0) ||
                (formData.species && !formData.subspecies && !formData.animalType)
              ) ? (
                <div>
                  <label htmlFor="phase" className="block text-sm font-medium text-gray-700 mb-2">
                    Phase:
                  </label>
                  <select
                    id="phase"
                    name="phase"
                    value={formData.phase}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                  >
                    <option value="">Select Phase</option>
                    {formData.animalType ? 
                      // Show phases for specific animal type
                      getPhaseOptions(formData.animalType).map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      )) :
                      // Show all phases for species when subspecies/animal types are not included
                      getSpeciesPhaseOptions(formData.species).length > 0 ?
                        getSpeciesPhaseOptions(formData.species).map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        )) :
                        // Fallback to general phase
                        <option value="general">General</option>
                    }
                  </select>
                </div>
              ) : null}

              {/* Crude Protein */}
              <div>
                <label htmlFor="crudeProtein" className="block text-sm font-medium text-gray-700 mb-2">
                  Crude Protein (%) [optional]:
                </label>
                <input
                  type="number"
                  id="crudeProtein"
                  name="crudeProtein"
                  value={formData.crudeProtein}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                  placeholder="Enter percentage"
                />
              </div>

              {/* Energy */}
              {/* <div>
                <label htmlFor="energy" className="block text-sm font-medium text-gray-700 mb-2">
                  Energy (kcal/kg) [optional]:
                </label>
                <input
                  type="number"
                  id="energy"
                  name="energy"
                  value={formData.energy}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter kcal/kg"
                />
              </div> */}

              {/* Include Premix */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="includePremix"
                  name="includePremix"
                  checked={formData.includePremix}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="includePremix" className="ml-2 block text-sm text-gray-700">
                  Include Premix:
                </label>
              </div>
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Calculate Button */}
            <div className="mt-6 flex justify-center">
              <button
                style={{padding:'10px 16px'}} 
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300"
              >
                Calculate Feed Formulation
              </button>
            </div>
          </div>

            {/* Select Ingredients Section */}
            <IngredientSelection  className='mt-10'
              onIngredientsChange={(ingredients) => {
                setSelectedIngredients(ingredients);
                console.log('Selected ingredients:', ingredients);
              }}
            />
           
          </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default OurSoftware;
