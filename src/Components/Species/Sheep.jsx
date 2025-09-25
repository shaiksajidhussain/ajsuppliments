import React from 'react';
import DynamicSpeciesWrapper from './DynamicSpeciesWrapper';

const Sheep = () => {
  return (
    <DynamicSpeciesWrapper
      speciesType="sheep"
      speciesName="Sheep"
      backgroundImage="https://media.istockphoto.com/id/181052145/photo/sheeps-in-ireland-at-sunset.jpg?s=612x612&w=0&k=20&c=cafD0Pw6ZVN-Dzr3cxi95VgmEgvPxKjJc7cAjzVClhA="
    />
  );
};

export default Sheep;
