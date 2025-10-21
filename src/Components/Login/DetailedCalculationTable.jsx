import React from 'react';

const DetailedCalculationTable = ({ ingredients, nutritionalAnalysis, feedBatchWeight }) => {
  // Calculate detailed nutrient contributions for each ingredient
  const calculateNutrientContributions = () => {
    return ingredients.map(ingredient => {
      const parts = ingredient.parts;
      const amountKg = (parts / 100) * feedBatchWeight;
      
      return {
        name: ingredient.name,
        parts: parts,
        amountKg: amountKg,
        contributions: {
          energy: (parts * (ingredient.energy || 0)) / 100,
          crudeProtein: (parts * (ingredient.crudeProtein || 0)) / 100,
          calcium: (parts * (ingredient.calcium || 0)) / 100,
          phosphorus: (parts * (ingredient.phosphorus || 0)) / 100,
          lysine: (parts * (ingredient.lysine || 0)) / 100,
          methionine: (parts * (ingredient.methionine || 0)) / 100
        }
      };
    });
  };

  const detailedData = calculateNutrientContributions();
  
  // Calculate totals
  const totals = detailedData.reduce((acc, item) => {
    acc.energy += item.contributions.energy;
    acc.crudeProtein += item.contributions.crudeProtein;
    acc.calcium += item.contributions.calcium;
    acc.phosphorus += item.contributions.phosphorus;
    acc.lysine += item.contributions.lysine;
    acc.methionine += item.contributions.methionine;
    return acc;
  }, {
    energy: 0,
    crudeProtein: 0,
    calcium: 0,
    phosphorus: 0,
    lysine: 0,
    methionine: 0
  });

  // Calculate deficits
  const deficits = {
    energy: (nutritionalAnalysis.required.meKcalPerKg || 0) - totals.energy,
    crudeProtein: (nutritionalAnalysis.required.crudeProtein || 0) - totals.crudeProtein,
    calcium: (nutritionalAnalysis.required.calcium || 0) - totals.calcium,
    phosphorus: (nutritionalAnalysis.required.availablePhosphorus || 0) - totals.phosphorus,
    lysine: (nutritionalAnalysis.required.lysine || 0) - totals.lysine,
    methionine: (nutritionalAnalysis.required.methionine || 0) - totals.methionine
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-lg p-6 shadow-xl border border-white/20 mt-8">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">📊 Detailed Nutrient Calculation</h3>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">Ingredients</th>
              <th className="border border-gray-300 px-4 py-2 text-center">Parts</th>
              <th className="border border-gray-300 px-4 py-2 text-center">ME (Kcal/kg)</th>
              <th className="border border-gray-300 px-4 py-2 text-center">CP%</th>
              <th className="border border-gray-300 px-4 py-2 text-center">Ca%</th>
              <th className="border border-gray-300 px-4 py-2 text-center">P%</th>
              <th className="border border-gray-300 px-4 py-2 text-center">Lysine</th>
              <th className="border border-gray-300 px-4 py-2 text-center">Methionine</th>
            </tr>
          </thead>
          <tbody>
            {detailedData.map((item, index) => (
              <tr key={index} className={item.name.includes('Rice Bran') && item.name.includes('Fixed') ? 'bg-yellow-50' : 'bg-white'}>
                <td className="border border-gray-300 px-4 py-2">
                  {item.name}
                  {item.name.includes('Rice Bran') && item.name.includes('Fixed') && (
                    <span className="ml-2 text-xs text-yellow-700 font-medium">(Fixed)</span>
                  )}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center font-medium">{item.parts}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">{item.contributions.energy.toFixed(1)}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">{item.contributions.crudeProtein.toFixed(2)}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">{item.contributions.calcium.toFixed(3)}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">{item.contributions.phosphorus.toFixed(3)}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">{item.contributions.lysine.toFixed(3)}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">{item.contributions.methionine.toFixed(3)}</td>
              </tr>
            ))}
            
            {/* Total Row */}
            <tr className="bg-blue-50 font-bold">
              <td className="border border-gray-300 px-4 py-2">Total</td>
              <td className="border border-gray-300 px-4 py-2 text-center">{detailedData.reduce((sum, item) => sum + item.parts, 0).toFixed(1)}</td>
              <td className="border border-gray-300 px-4 py-2 text-center">{totals.energy.toFixed(1)}</td>
              <td className="border border-gray-300 px-4 py-2 text-center">{totals.crudeProtein.toFixed(2)}</td>
              <td className="border border-gray-300 px-4 py-2 text-center">{totals.calcium.toFixed(3)}</td>
              <td className="border border-gray-300 px-4 py-2 text-center">{totals.phosphorus.toFixed(3)}</td>
              <td className="border border-gray-300 px-4 py-2 text-center">{totals.lysine.toFixed(3)}</td>
              <td className="border border-gray-300 px-4 py-2 text-center">{totals.methionine.toFixed(3)}</td>
            </tr>
            
            {/* Required Row */}
            <tr className="bg-green-50 font-semibold">
              <td className="border border-gray-300 px-4 py-2">Required</td>
              <td className="border border-gray-300 px-4 py-2 text-center">100</td>
              <td className="border border-gray-300 px-4 py-2 text-center">{nutritionalAnalysis.required.meKcalPerKg || 0}</td>
              <td className="border border-gray-300 px-4 py-2 text-center">{nutritionalAnalysis.required.crudeProtein || 0}</td>
              <td className="border border-gray-300 px-4 py-2 text-center">{nutritionalAnalysis.required.calcium || 0}</td>
              <td className="border border-gray-300 px-4 py-2 text-center">{nutritionalAnalysis.required.availablePhosphorus || 0}</td>
              <td className="border border-gray-300 px-4 py-2 text-center">{nutritionalAnalysis.required.lysine || 0}</td>
              <td className="border border-gray-300 px-4 py-2 text-center">{nutritionalAnalysis.required.methionine || 0}</td>
            </tr>
            
            {/* Deficit Row */}
            <tr className="bg-red-50 font-semibold">
              <td className="border border-gray-300 px-4 py-2">Deficit</td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                {(100 - detailedData.reduce((sum, item) => sum + item.parts, 0)).toFixed(1)}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-center">{deficits.energy.toFixed(1)}</td>
              <td className="border border-gray-300 px-4 py-2 text-center">{deficits.crudeProtein.toFixed(2)}</td>
              <td className="border border-gray-300 px-4 py-2 text-center">{deficits.calcium.toFixed(3)}</td>
              <td className="border border-gray-300 px-4 py-2 text-center">{deficits.phosphorus.toFixed(3)}</td>
              <td className="border border-gray-300 px-4 py-2 text-center">{deficits.lysine.toFixed(3)}</td>
              <td className="border border-gray-300 px-4 py-2 text-center">{deficits.methionine.toFixed(3)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div className="mt-4 text-sm text-gray-600">
        <p><strong>Note:</strong> This table shows the detailed nutrient contributions from each ingredient, 
        calculated using the formula: (Parts × Nutrient%) ÷ 100</p>
      </div>
    </div>
  );
};

export default DetailedCalculationTable;
