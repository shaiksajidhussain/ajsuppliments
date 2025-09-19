import React from 'react';
import SharedSpeciesForm from './SharedSpeciesForm';
import { getAnimalTypeOptions, getPhaseOptions } from './speciesData';

const Buffalo = () => {
  return (
    <SharedSpeciesForm
      speciesType="buffalo"
      speciesName="Buffalo"
      subspeciesOptions={null}
      getAnimalTypeOptions={getAnimalTypeOptions}
      getPhaseOptions={getPhaseOptions}
      backgroundImage="https://media.istockphoto.com/id/1297490717/photo/african-safari-cape-buffalo-sunset-kruger-national-park-south-africa.jpg?s=612x612&w=0&k=20&c=VDFFO8bp-B3VjrZETYEjh-7LmA6RyR1FXgdcKmAN7mc="
    />
  );
};

export default Buffalo;
