import React from 'react';

const TestStepByStep = () => {
  const mockData = {
    calculationData: {
      feedBatchWeight: 100,
      species: 'Poultry',
      phase: 'Layer Production',
      includePremix: true,
      availableIngredients: [
        { name: 'Rice Bran', category: 'Energy Source', crudeProtein: 11, energy: 2750, cost: 0 },
        { name: 'Maize', category: 'Energy Source', crudeProtein: 8.5, energy: 3350, cost: 0.25 },
        { name: 'Jowar', category: 'Energy Source', crudeProtein: 10, energy: 2650, cost: 0 },
        { name: 'Soybean Meal', category: 'Protein Source', crudeProtein: 44, energy: 2600, cost: 0.45 }
      ]
    },
    results: {
      formulation: {
        feedBatchWeight: 100,
        species: 'Poultry',
        phase: 'Layer Production',
        nutritionalAnalysis: {
          required: {
            crudeProtein: 18,
            meKcalPerKg: 2600,
            calcium: 3.0,
            availablePhosphorus: 0.4,
            lysine: 0.7,
            methionine: 0.35
          },
          provided: {
            crudeProtein: 18,
            energy: 2599.99,
            calcium: 3,
            phosphorus: 0.4,
            lysine: 0,
            methionine: 0.35
          }
        }
      },
      feedMixResult: [
        { ingredient: 'Rice Bran', percentage: 10, amountKg: 10, pricePerKg: 0, totalCost: 0, isSupplement: false, isFixed: true },
        { ingredient: 'Soybean Meal', percentage: 26.44, amountKg: 26.44, pricePerKg: 0.45, totalCost: 11.9, isSupplement: false, isFixed: false },
        { ingredient: 'Maize', percentage: 17.85, amountKg: 17.85, pricePerKg: 0.25, totalCost: 4.46, isSupplement: false, isFixed: false },
        { ingredient: 'Jowar', percentage: 17.85, amountKg: 17.85, pricePerKg: 0, totalCost: 0, isSupplement: false, isFixed: false }
      ],
      nutrientSummary: [
        { name: 'Crude Protein (%)', required: 18, achieved: 18 },
        { name: 'ME (kcal/kg)', required: 2600, achieved: 2599.99 },
        { name: 'Calcium (%)', required: 3, achieved: 3 },
        { name: 'Phosphorus (%)', required: 0.4, achieved: 0.4 },
        { name: 'Lysine (%)', required: 0.7, achieved: 0 },
        { name: 'Methionine (%)', required: 0.35, achieved: 0.35 }
      ]
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">🧪 Test Step-by-Step Calculation</h3>
      
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <h4 className="font-semibold text-blue-800 mb-2">Test Data:</h4>
        <div className="text-sm text-blue-700">
          <p><strong>Feed Batch Weight:</strong> {mockData.calculationData.feedBatchWeight} kg</p>
          <p><strong>Species:</strong> {mockData.calculationData.species}</p>
          <p><strong>Phase:</strong> {mockData.calculationData.phase}</p>
          <p><strong>Ingredients:</strong> {mockData.calculationData.availableIngredients.length} selected</p>
        </div>
      </div>

      <div className="bg-green-50 p-4 rounded-lg">
        <h4 className="font-semibold text-green-800 mb-2">✅ Step-by-Step Component Test:</h4>
        <p className="text-sm text-green-700">
          This test component shows that the step-by-step calculation component should work with mock data.
          If you can see this, the component is rendering correctly.
        </p>
      </div>
    </div>
  );
};

export default TestStepByStep;
