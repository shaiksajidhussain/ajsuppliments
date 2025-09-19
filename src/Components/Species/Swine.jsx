import React from 'react';
import SharedSpeciesForm from './SharedSpeciesForm';
import { getAnimalTypeOptions, getPhaseOptions } from './speciesData';

const Swine = () => {
  return (
    <SharedSpeciesForm
      speciesType="swine"
      speciesName="Swine"
      subspeciesOptions={null}
      getAnimalTypeOptions={getAnimalTypeOptions}
      getPhaseOptions={getPhaseOptions}
      backgroundImage="https://media.istockphoto.com/id/153560796/photo/small-pig.jpg?s=612x612&w=0&k=20&c=sTm01xCQn20jJJqBoPXL3zQACIrM1zN9IOzNR9ta-Tk="
    />
  );
};

export default Swine;
