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
      <h3 className="text-2xl font-bold text-gray-900 mb-6">📊 Nutrient Calculations</h3>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-3 py-2 text-left font-semibold">Ingredients</th>
              <th className="border border-gray-300 px-3 py-2 text-center font-semibold">Parts</th>
              <th className="border border-gray-300 px-3 py-2 text-center font-semibold">ME (Kcal/kg)</th>
              <th className="border border-gray-300 px-3 py-2 text-center font-semibold">CP%</th>
              <th className="border border-gray-300 px-3 py-2 text-center font-semibold">Ca%</th>
              <th className="border border-gray-300 px-3 py-2 text-center font-semibold">Available P%</th>
              <th className="border border-gray-300 px-3 py-2 text-center font-semibold">Lysine%</th>
              <th className="border border-gray-300 px-3 py-2 text-center font-semibold">Methionine%</th>
            </tr>
          </thead>
          <tbody>
            {detailedData.map((item, index) => (
              <tr key={index} className={item.name.includes('Rice') ? 'bg-yellow-50' : 'bg-white'}>
                <td className="border border-gray-300 px-3 py-2 font-medium">
                  {item.name}
                  {item.name.includes('Rice') && (
                    <span className="ml-2 text-xs text-yellow-700 font-medium">(Fixed)</span>
                  )}
                </td>
                <td className="border border-gray-300 px-3 py-2 text-center font-medium">{item.parts.toFixed(2)}</td>
                <td className="border border-gray-300 px-3 py-2 text-center">{item.contributions.energy.toFixed(2)}</td>
                <td className="border border-gray-300 px-3 py-2 text-center">{item.contributions.crudeProtein.toFixed(2)}</td>
                <td className="border border-gray-300 px-3 py-2 text-center">{item.contributions.calcium.toFixed(3)}</td>
                <td className="border border-gray-300 px-3 py-2 text-center">{item.contributions.phosphorus.toFixed(3)}</td>
                <td className="border border-gray-300 px-3 py-2 text-center">{item.contributions.lysine.toFixed(3)}</td>
                <td className="border border-gray-300 px-3 py-2 text-center">{item.contributions.methionine.toFixed(3)}</td>
              </tr>
            ))}
            
            {/* Total Row */}
            <tr className="bg-blue-50 font-bold">
              <td className="border border-gray-300 px-3 py-2 font-bold">Total</td>
              <td className="border border-gray-300 px-3 py-2 text-center font-bold">{detailedData.reduce((sum, item) => sum + item.parts, 0).toFixed(2)}</td>
              <td className="border border-gray-300 px-3 py-2 text-center font-bold">{totals.energy.toFixed(2)}</td>
              <td className="border border-gray-300 px-3 py-2 text-center font-bold">{totals.crudeProtein.toFixed(2)}</td>
              <td className="border border-gray-300 px-3 py-2 text-center font-bold">{totals.calcium.toFixed(3)}</td>
              <td className="border border-gray-300 px-3 py-2 text-center font-bold">{totals.phosphorus.toFixed(3)}</td>
              <td className="border border-gray-300 px-3 py-2 text-center font-bold">{totals.lysine.toFixed(3)}</td>
              <td className="border border-gray-300 px-3 py-2 text-center font-bold">{totals.methionine.toFixed(3)}</td>
            </tr>
            
            {/* Required Row */}
            <tr className="bg-green-50 font-bold">
              <td className="border border-gray-300 px-3 py-2 font-bold">Requirement</td>
              <td className="border border-gray-300 px-3 py-2 text-center font-bold">100</td>
              <td className="border border-gray-300 px-3 py-2 text-center font-bold">{nutritionalAnalysis.required.meKcalPerKg || 0}</td>
              <td className="border border-gray-300 px-3 py-2 text-center font-bold">{nutritionalAnalysis.required.crudeProtein || 0}</td>
              <td className="border border-gray-300 px-3 py-2 text-center font-bold">{nutritionalAnalysis.required.calcium || 0}</td>
              <td className="border border-gray-300 px-3 py-2 text-center font-bold">{nutritionalAnalysis.required.availablePhosphorus || 0}</td>
              <td className="border border-gray-300 px-3 py-2 text-center font-bold">{nutritionalAnalysis.required.lysine || 0}</td>
              <td className="border border-gray-300 px-3 py-2 text-center font-bold">{nutritionalAnalysis.required.methionine || 0}</td>
            </tr>
            
            {/* Deficit Row */}
            <tr className="bg-red-50 font-bold">
              <td className="border border-gray-300 px-3 py-2 font-bold">Deficit</td>
              <td className="border border-gray-300 px-3 py-2 text-center font-bold">
                {(100 - detailedData.reduce((sum, item) => sum + item.parts, 0)).toFixed(2)}
              </td>
              <td className={`border border-gray-300 px-3 py-2 text-center font-bold ${deficits.energy > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {deficits.energy.toFixed(2)}
              </td>
              <td className={`border border-gray-300 px-3 py-2 text-center font-bold ${deficits.crudeProtein > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {deficits.crudeProtein.toFixed(2)}
              </td>
              <td className={`border border-gray-300 px-3 py-2 text-center font-bold ${deficits.calcium > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {deficits.calcium.toFixed(3)}
              </td>
              <td className={`border border-gray-300 px-3 py-2 text-center font-bold ${deficits.phosphorus > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {deficits.phosphorus.toFixed(3)}
              </td>
              <td className={`border border-gray-300 px-3 py-2 text-center font-bold ${deficits.lysine > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {deficits.lysine.toFixed(3)}
              </td>
              <td className={`border border-gray-300 px-3 py-2 text-center font-bold ${deficits.methionine > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {deficits.methionine.toFixed(3)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div className="mt-4 text-sm text-gray-600">
        <p><strong>Calculation Formula:</strong> (Parts × Nutrient%) ÷ 100</p>
        <p><strong>Example:</strong> Rice Polish ME = 10 × 2750 ÷ 100 = 275 Kcal/kg</p>
        <p><strong>Color Coding:</strong> <span className="text-red-600">Red</span> = Deficit, <span className="text-green-600">Green</span> = Surplus</p>
      </div>
    </div>
  );
};

export default DetailedCalculationTable;
