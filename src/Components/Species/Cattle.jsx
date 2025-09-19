import React from 'react';
import SharedSpeciesForm from './SharedSpeciesForm';
import { getAnimalTypeOptions, getPhaseOptions } from './speciesData';

const Cattle = () => {
  return (
    <SharedSpeciesForm
      speciesType="cattle"
      speciesName="Cattle"
      subspeciesOptions={null}
      getAnimalTypeOptions={getAnimalTypeOptions}
      getPhaseOptions={getPhaseOptions}
      backgroundImage="https://media.istockphoto.com/id/2156862631/photo/silhouette-of-free-range-cattle-walking-on-a-dusty-field-at-sunset-south-africa.jpg?b=1&s=612x612&w=0&k=20&c=qSeGoh2v-nHzCWEHGKXsd1d1Pl5RWAW-FDEm_15G8BE="
    />
  );
};

export default Cattle;
