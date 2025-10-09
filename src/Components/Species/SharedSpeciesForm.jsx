import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import IngredientSelection from '../Login/IngredientSelection';

const SharedSpeciesForm = ({ 
  speciesType, 
  speciesName, 
  subspeciesOptions, 
  getAnimalTypeOptions, 
  getPhaseOptions, 
  getSpeciesPhaseOptions,
  speciesInclusionSettings,
  targetSpecies,
  backgroundImage 
}) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    feedBatchWeight: '100',
    species: speciesType,
    subspecies: '',
    animalType: 'broiler',
    phase: 'finisher',
    crudeProtein: '',
    energy: '',
    includePremix: true
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIngredients, setSelectedIngredients] = useState([]);

  // Check authentication on component mount
  useEffect(() => {
    const checkAuth = () => {
      const isLoggedIn = localStorage.getItem('isLoggedIn');
      if (isLoggedIn !== 'true') {
        navigate('/login');
      } else {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

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
      if (value === 'poultry') {
        // For poultry, reset subspecies and animal type
        setFormData(prev => ({
          ...prev,
          subspecies: '',
          animalType: 'broiler'
        }));
      } else if (value === 'swine') {
        // For swine, reset subspecies and set default animal type
        const animalTypeOptions = getAnimalTypeOptions('', value);
        setFormData(prev => ({
          ...prev,
          subspecies: '',
          animalType: animalTypeOptions[0]?.value || 'marketing_pigs'
        }));
      } else {
        // For other species, clear subspecies and animal type
        setFormData(prev => ({
          ...prev,
          subspecies: '',
          animalType: 'broiler'
        }));
      }
    }

    // Reset animal type when subspecies changes
    if (name === 'subspecies') {
      const animalTypeOptions = getAnimalTypeOptions(value, formData.species);
      setFormData(prev => ({
        ...prev,
        animalType: animalTypeOptions[0]?.value || 'broiler',
        phase: getPhaseOptions(animalTypeOptions[0]?.value || 'broiler', value, formData.species)[0]?.value || 'starter'
      }));
    }

    // Reset phase when animal type changes
    if (name === 'animalType') {
      const phaseOptions = getPhaseOptions(value, formData.subspecies, formData.species);
      setFormData(prev => ({
        ...prev,
        phase: phaseOptions[0]?.value || 'starter'
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

    // Here you can add your form submission logic
    console.log('Form submitted:', formData);
    console.log('Selected ingredients:', selectedIngredients);
  };

  return (
    <div 
      className="min-h-screen relative"
      style={{
        backgroundImage: `url(${backgroundImage || 'https://images.stockcake.com/public/1/4/d/14d133a4-16ec-46bf-b384-da364125b7ff_large/sunset-farm-hen-stockcake.jpg'})`,
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
            <h1 className="text-2xl font-bold text-white">{speciesName} Feed Formulation</h1>
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
                  <option value={speciesType}>{speciesName}</option>
                </select>
              </div>

              {/* Subspecies - Show if species includes subspecies */}
              {speciesInclusionSettings?.includeSubspecies && subspeciesOptions && subspeciesOptions.length > 0 && (
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
                    {subspeciesOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Animal Type - Show if species includes animal types */}
              {(() => {
                // For direct animal types (when subspecies are skipped), check if there are direct animal types
                const hasDirectAnimalTypes = targetSpecies && targetSpecies.directAnimalTypes && targetSpecies.directAnimalTypes.length > 0;
                // For traditional hierarchy, check if subspecies exists and has animal types
                const hasSubspeciesAnimalTypes = formData.subspecies && getAnimalTypeOptions(formData.subspecies).length > 0;
                
                const shouldShowAnimalType = speciesInclusionSettings?.includeAnimalTypes && (hasDirectAnimalTypes || hasSubspeciesAnimalTypes);
                
                console.log('=== ANIMAL TYPE SECTION RENDERING CHECK ===');
                console.log('speciesInclusionSettings?.includeAnimalTypes:', speciesInclusionSettings?.includeAnimalTypes);
                console.log('hasDirectAnimalTypes:', hasDirectAnimalTypes);
                console.log('hasSubspeciesAnimalTypes:', hasSubspeciesAnimalTypes);
                console.log('formData.subspecies:', formData.subspecies);
                console.log('getAnimalTypeOptions(formData.subspecies):', getAnimalTypeOptions(formData.subspecies));
                console.log('shouldShowAnimalType:', shouldShowAnimalType);
                return shouldShowAnimalType;
              })() && (
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
                    {(() => {
                      // For direct animal types (when subspecies are skipped)
                      if (targetSpecies && targetSpecies.directAnimalTypes && targetSpecies.directAnimalTypes.length > 0) {
                        return targetSpecies.directAnimalTypes.map((animalType) => (
                          <option key={animalType.id} value={animalType.id}>
                            {animalType.name}
                          </option>
                        ));
                      }
                      // For traditional hierarchy (when subspecies exist)
                      return getAnimalTypeOptions(formData.subspecies).map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ));
                    })()}
                  </select>
                </div>
              )}

              {/* Phase - Show if species includes phases or animal types (for phases under animal types) */}
              {(speciesInclusionSettings?.includePhases || speciesInclusionSettings?.includeAnimalTypes) && (
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
                      getSpeciesPhaseOptions && getSpeciesPhaseOptions(formData.species).length > 0 ?
                        getSpeciesPhaseOptions(formData.species).map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        )) :
                        // Fallback to legacy phase options
                        getPhaseOptions(formData.animalType, formData.subspecies, formData.species).map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))
                    }
                  </select>
                </div>
              )}

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
        </div>
      </div>
    </div>
  );
};

export default SharedSpeciesForm;
