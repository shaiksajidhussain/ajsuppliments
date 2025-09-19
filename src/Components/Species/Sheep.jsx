import React from 'react';
import SharedSpeciesForm from './SharedSpeciesForm';
import { getAnimalTypeOptions, getPhaseOptions } from './speciesData';

const Sheep = () => {
  return (
    <SharedSpeciesForm
      speciesType="sheep"
      speciesName="Sheep"
      subspeciesOptions={null}
      getAnimalTypeOptions={getAnimalTypeOptions}
      getPhaseOptions={getPhaseOptions}
      backgroundImage="https://media.istockphoto.com/id/181052145/photo/sheeps-in-ireland-at-sunset.jpg?s=612x612&w=0&k=20&c=cafD0Pw6ZVN-Dzr3cxi95VgmEgvPxKjJc7cAjzVClhA="
    />
  );
};

export default Sheep;
