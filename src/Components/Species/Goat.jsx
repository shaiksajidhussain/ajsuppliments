import React from 'react';
import SharedSpeciesForm from './SharedSpeciesForm';
import { getAnimalTypeOptions, getPhaseOptions } from './speciesData';

const Goat = () => {
  return (
    <SharedSpeciesForm
      speciesType="goat"
      speciesName="Goat"
      subspeciesOptions={null}
      getAnimalTypeOptions={getAnimalTypeOptions}
      getPhaseOptions={getPhaseOptions}
      backgroundImage="https://images.stockcake.com/public/f/c/4/fc4ffae0-1b2a-48da-860f-a46c27bb85c1_large/moonlit-silhouette-goat-stockcake.jpg"
    />
  );
};

export default Goat;
