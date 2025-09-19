// Species and subspecies options
export const speciesOptions = [
  { value: 'poultry', label: 'Poultry' },
  { value: 'cattle', label: 'Cattle' },
  { value: 'buffalo', label: 'Buffalo' },
  { value: 'sheep', label: 'Sheep' },
  { value: 'swine', label: 'Swine' },
  { value: 'goat', label: 'Goat' }
];

export const subspeciesOptions = {
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
export const getAnimalTypeOptions = (subspecies, species) => {
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
export const getPhaseOptions = (animalType, subspecies, species) => {
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
