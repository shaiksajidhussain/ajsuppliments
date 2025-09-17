import React, { useState, useEffect } from 'react';

const Login = ({ onLogin }) => {
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

  // Species and subspecies options
  const speciesOptions = [
    { value: 'poultry', label: 'Poultry' },
    { value: 'cattle', label: 'Cattle' },
    { value: 'buffalo', label: 'Buffalo' },
    { value: 'sheep', label: 'Sheep' },
    { value: 'swine', label: 'Swine' },
    { value: 'goat', label: 'Goat' }
  ];

  const subspeciesOptions = {
    poultry: [
      { value: 'chicken', label: 'Chicken' },
      { value: 'quails', label: 'Quails' },
      { value: 'turkey', label: 'Turkey' },
      { value: 'duck', label: 'Duck' }
    ],
    cattle: [
      { value: 'dairy', label: 'Dairy' },
      { value: 'beef', label: 'Beef' }
    ],
    buffalo: [
      { value: 'dairy_buffalo', label: 'Dairy Buffalo' },
      { value: 'meat_buffalo', label: 'Meat Buffalo' }
    ],
    sheep: [
      { value: 'wool', label: 'Wool' },
      { value: 'meat', label: 'Meat' }
    ],
    swine: [
      { value: 'piglet', label: 'Piglet' },
      { value: 'grower', label: 'Grower' },
      { value: 'finisher', label: 'Finisher' }
    ],
    goat: [
      { value: 'dairy_goat', label: 'Dairy Goat' },
      { value: 'meat_goat', label: 'Meat Goat' }
    ]
  };

  // Animal Type options based on subspecies and species
  const getAnimalTypeOptions = (subspecies, species) => {
    // Special handling for Swine
    if (species === 'swine') {
      return [
        { value: 'marketing_pigs', label: 'Marketing pigs' },
        { value: 'no_marketing_pigs', label: 'No Marketing pigs' }
      ];
    }

    // Default handling for other species
    switch (subspecies) {
      case 'quails':
        return [
          { value: 'broiler', label: 'Broilers' },
          { value: 'breeder', label: 'Breeders' }
        ];
      case 'turkey':
      case 'duck':
        return [
          { value: 'layer', label: 'Layers' }
        ];
      case 'chicken':
      default:
        return [
          { value: 'broiler', label: 'Broilers' },
          { value: 'layer', label: 'Layers' },
          { value: 'broilerbreeder', label: 'Broiler Breeders' },
          { value: 'layerbreeder', label: 'Layer Breeders' }
        ];
    }
  };

  // Phase options based on animal type, subspecies, and species
  const getPhaseOptions = (animalType, subspecies, species) => {
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


  // Check if user is already logged in and set page title
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
      onLogin();
    }
    
    // Set page title
    document.title = 'Login - Feed Formulation';
  }, [onLogin]);

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

    // Store form data in localStorage
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('feedFormData', JSON.stringify(formData));
    localStorage.setItem('loginTime', new Date().toISOString());
    
    // Call parent component's onLogin function
    onLogin();
  };


  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Login - Feed Formulation</h1>
          <button className="p-2 hover:bg-gray-100 rounded-md">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* General Formulation Parameters */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">General Formulation Parameters</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Species</option>
                  {speciesOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subspecies - Only show for Poultry */}
              {formData.species === 'poultry' && (
                <div>
                  <label htmlFor="subspecies" className="block text-sm font-medium text-gray-700 mb-2">
                    Subspecies:
                  </label>
                  <select
                    id="subspecies"
                    name="subspecies"
                    value={formData.subspecies}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {subspeciesOptions.poultry.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Animal Type - Show for Poultry and Swine */}
              {(formData.species === 'poultry' || formData.species === 'swine') && (
                <div>
                  <label htmlFor="animalType" className="block text-sm font-medium text-gray-700 mb-2">
                    Animal Type:
                  </label>
                  <select
                    id="animalType"
                    name="animalType"
                    value={formData.animalType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                  {getAnimalTypeOptions(formData.subspecies, formData.species).map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                  </select>
                </div>
              )}

              {/* Phase */}
              <div>
                <label htmlFor="phase" className="block text-sm font-medium text-gray-700 mb-2">
                  Phase:
                </label>
                <select
                  id="phase"
                  name="phase"
                  value={formData.phase}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {getPhaseOptions(formData.animalType, formData.subspecies, formData.species).map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
          </div>

          {/* Select Ingredients Section */}
         
        </form>
      </div>
    </div>
  );
};

export default Login;
