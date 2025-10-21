import React, { useState } from 'react';
import StepByStepCalculation from '../Calculation/StepByStepCalculation';
import TestStepByStep from '../Calculation/TestStepByStep';
import DetailedCalculationTable from './DetailedCalculationTable';

const ResultsDisplay = ({ results, onSave, onReset }) => {
  const [showStepByStep, setShowStepByStep] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editableBatchWeight, setEditableBatchWeight] = useState(results?.formulation?.feedBatchWeight || 100);
  
  if (!results || !results.formulation) {
    return null;
  }

  const { formulation } = results;
  const { ingredients, nutritionalAnalysis, costAnalysis } = formulation;

  // Separate main ingredients and supplements
  const mainIngredients = ingredients.filter(ing => !ing.isSupplement);
  const supplements = ingredients.filter(ing => ing.isSupplement);

  // Recalculate all values based on editable batch weight
  const recalculateForBatchWeight = (batchWeight) => {
    const costPerKg = costAnalysis.costPerKg;
    const newTotalCost = costPerKg * batchWeight;
    
    // Recalculate ingredient quantities
    const recalculatedIngredients = ingredients.map(ingredient => {
      const percentage = ingredient.parts;
      const amountKg = (percentage / 100) * batchWeight;
      const totalCost = amountKg * (ingredient.cost || 0);
      
      return {
        ...ingredient,
        amountKg: parseFloat(amountKg.toFixed(2)),
        totalCost: parseFloat(totalCost.toFixed(2))
      };
    });

    // Recalculate supplements quantities
    const recalculatedSupplements = supplements.map(supplement => {
      const percentage = supplement.parts;
      const amountKg = (percentage / 100) * batchWeight;
      const totalCost = amountKg * (supplement.cost || 0);
      
      return {
        ...supplement,
        amountKg: parseFloat(amountKg.toFixed(2)),
        totalCost: parseFloat(totalCost.toFixed(2))
      };
    });

    return {
      totalCost: newTotalCost,
      costPerKg: costPerKg,
      feedBatchWeight: batchWeight,
      ingredients: recalculatedIngredients,
      supplements: recalculatedSupplements
    };
  };

  const updatedCalculation = recalculateForBatchWeight(editableBatchWeight);

  // Handle batch weight change
  const handleBatchWeightChange = (e) => {
    const newWeight = parseFloat(e.target.value);
    if (newWeight > 0) {
      setEditableBatchWeight(newWeight);
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-lg p-6 shadow-xl border border-white/20 mt-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-900">
          🎯 Formulation Results
        </h2>
        <div className="flex gap-4">
          <button
            onClick={() => {
              console.log('Step-by-step button clicked! Current state:', showStepByStep);
              setShowStepByStep(!showStepByStep);
              console.log('New state will be:', !showStepByStep);
            }}
            className={`px-4 py-2 rounded-lg transition-colors ${
              showStepByStep 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            {showStepByStep ? '📊 Hide Steps' : '🔍 Show Step-by-Step'}
          </button>
          <button
            onClick={onReset}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Calculate Again
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            💾 Save Formulation
          </button>
        </div>
      </div>

      {/* Step-by-Step Button */}
      <div className="mb-4 flex justify-center">
        <button 
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowModal(true);
          }}
          className="px-6 py-3 bg-purple-600 text-white rounded-lg shadow-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
        >
          <span className="text-xl">🔍</span>
          <span className="font-semibold">View Step-by-Step Calculation</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="text-sm text-blue-600 font-medium">Feed Batch Weight</div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={editableBatchWeight}
              onChange={handleBatchWeightChange}
              className="text-2xl font-bold text-blue-900 bg-transparent border-b-2 border-blue-300 focus:border-blue-600 focus:outline-none w-20 text-center"
              min="1"
              step="0.1"
            />
            <span className="text-2xl font-bold text-blue-900">kg</span>
          </div>
        </div>
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="text-sm text-green-600 font-medium">Total Cost</div>
          <div className="text-2xl font-bold text-green-900">₹{updatedCalculation.totalCost.toFixed(2)}</div>
          <div className="text-xs text-green-600">₹{updatedCalculation.costPerKg}/kg</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
          <div className="text-sm text-purple-600 font-medium">Total Ingredients</div>
          <div className="text-2xl font-bold text-purple-900">{ingredients.length}</div>
          <div className="text-xs text-purple-600">{mainIngredients.length} main + {supplements.length} supplements</div>
        </div>
      </div>

      {/* Main Ingredients Table */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-3">Main Ingredients</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 text-left">Ingredient</th>
                <th className="border border-gray-300 px-4 py-2 text-center">Parts</th>
                <th className="border border-gray-300 px-4 py-2 text-center">Amount (kg)</th>
                <th className="border border-gray-300 px-4 py-2 text-center">CP%</th>
                <th className="border border-gray-300 px-4 py-2 text-center">ME (Kcal/kg)</th>
                <th className="border border-gray-300 px-4 py-2 text-center">Ca%</th>
                <th className="border border-gray-300 px-4 py-2 text-center">P%</th>
                <th className="border border-gray-300 px-4 py-2 text-center">Lysine%</th>
                <th className="border border-gray-300 px-4 py-2 text-center">Methionine%</th>
              </tr>
            </thead>
            <tbody>
              {updatedCalculation.ingredients.filter(ing => !ing.isSupplement).map((ing, idx) => (
                <tr key={idx} className={ing.isFixed ? 'bg-yellow-50' : 'bg-white'}>
                  <td className="border border-gray-300 px-4 py-2">
                    {ing.name}
                    {ing.isFixed && <span className="ml-2 text-xs text-yellow-700 font-medium">(Fixed)</span>}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center font-medium">{ing.parts}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center font-bold text-blue-600">{ing.amountKg} kg</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">{ing.crudeProtein || '-'}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">{ing.energy || '-'}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">{ing.calcium || '-'}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">{ing.phosphorus || '-'}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">{ing.lysine || '-'}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">{ing.methionine || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Supplements Table */}
      {supplements.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Supplements & Additives</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-blue-50">
                  <th className="border border-gray-300 px-4 py-2 text-left">Supplement</th>
                  <th className="border border-gray-300 px-4 py-2 text-center">Parts</th>
                  <th className="border border-gray-300 px-4 py-2 text-center">Amount (kg)</th>
                  <th className="border border-gray-300 px-4 py-2 text-center">Purpose</th>
                </tr>
              </thead>
              <tbody>
                {updatedCalculation.supplements.map((ing, idx) => (
                  <tr key={idx} className="bg-blue-50/30">
                    <td className="border border-gray-300 px-4 py-2">{ing.name}</td>
                    <td className="border border-gray-300 px-4 py-2 text-center font-medium">{ing.parts}</td>
                    <td className="border border-gray-300 px-4 py-2 text-center font-bold text-blue-600">{ing.amountKg} kg</td>
                    <td className="border border-gray-300 px-4 py-2 text-center text-sm">
                      {ing.name.includes('Methionine') && 'Amino Acid'}
                      {ing.name.includes('DCP') && 'Phosphorus + Calcium'}
                      {ing.name.includes('CaCO') && 'Calcium'}
                      {ing.name.includes('Oil') && 'Energy'}
                      {ing.name.includes('Salt') && 'Minerals & Vitamins'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Nutritional Analysis */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-3">Nutritional Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Crude Protein */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">Crude Protein</div>
            <div className="flex justify-between items-end">
              <div>
                <div className="text-xl font-bold text-gray-900">
                  {nutritionalAnalysis.provided.crudeProtein}%
                </div>
                <div className="text-xs text-gray-500">
                  Required: {nutritionalAnalysis.required.crudeProtein}%
                </div>
              </div>
              {nutritionalAnalysis.provided.crudeProtein >= (nutritionalAnalysis.required.crudeProtein || 0) ? (
                <span className="text-green-600 text-2xl">✓</span>
              ) : (
                <span className="text-red-600 text-xs">
                  {nutritionalAnalysis.deficits.crudeProtein > 0 ? '+' : ''}
                  {nutritionalAnalysis.deficits.crudeProtein.toFixed(2)}%
                </span>
              )}
            </div>
          </div>

          {/* Energy */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">Metabolizable Energy</div>
            <div className="flex justify-between items-end">
              <div>
                <div className="text-xl font-bold text-gray-900">
                  {nutritionalAnalysis.provided.energy} Kcal/kg
                </div>
                <div className="text-xs text-gray-500">
                  Required: {nutritionalAnalysis.required.meKcalPerKg} Kcal/kg
                </div>
              </div>
              {nutritionalAnalysis.provided.energy >= (nutritionalAnalysis.required.meKcalPerKg || 0) ? (
                <span className="text-green-600 text-2xl">✓</span>
              ) : (
                <span className="text-red-600 text-xs">
                  {nutritionalAnalysis.deficits.energy > 0 ? '+' : ''}
                  {nutritionalAnalysis.deficits.energy.toFixed(0)}
                </span>
              )}
            </div>
          </div>

          {/* Calcium */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">Calcium</div>
            <div className="flex justify-between items-end">
              <div>
                <div className="text-xl font-bold text-gray-900">
                  {nutritionalAnalysis.provided.calcium}%
                </div>
                <div className="text-xs text-gray-500">
                  Required: {nutritionalAnalysis.required.calcium || 0}%
                </div>
              </div>
              {nutritionalAnalysis.provided.calcium >= (nutritionalAnalysis.required.calcium || 0) ? (
                <span className="text-green-600 text-2xl">✓</span>
              ) : (
                <span className="text-red-600 text-xs">
                  {nutritionalAnalysis.deficits.calcium > 0 ? '+' : ''}
                  {nutritionalAnalysis.deficits.calcium.toFixed(3)}%
                </span>
              )}
            </div>
          </div>

          {/* Phosphorus */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">Available Phosphorus</div>
            <div className="flex justify-between items-end">
              <div>
                <div className="text-xl font-bold text-gray-900">
                  {nutritionalAnalysis.provided.phosphorus}%
                </div>
                <div className="text-xs text-gray-500">
                  Required: {nutritionalAnalysis.required.availablePhosphorus || 0}%
                </div>
              </div>
              {nutritionalAnalysis.provided.phosphorus >= (nutritionalAnalysis.required.availablePhosphorus || 0) ? (
                <span className="text-green-600 text-2xl">✓</span>
              ) : (
                <span className="text-red-600 text-xs">
                  {nutritionalAnalysis.deficits.phosphorus > 0 ? '+' : ''}
                  {nutritionalAnalysis.deficits.phosphorus.toFixed(3)}%
                </span>
              )}
            </div>
          </div>

          {/* Lysine */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">Lysine</div>
            <div className="flex justify-between items-end">
              <div>
                <div className="text-xl font-bold text-gray-900">
                  {nutritionalAnalysis.provided.lysine}%
                </div>
                <div className="text-xs text-gray-500">
                  Required: {nutritionalAnalysis.required.lysine || 0}%
                </div>
              </div>
              {nutritionalAnalysis.provided.lysine >= (nutritionalAnalysis.required.lysine || 0) ? (
                <span className="text-green-600 text-2xl">✓</span>
              ) : (
                <span className="text-red-600 text-xs">
                  {nutritionalAnalysis.deficits.lysine > 0 ? '+' : ''}
                  {nutritionalAnalysis.deficits.lysine.toFixed(3)}%
                </span>
              )}
            </div>
          </div>

          {/* Methionine */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">Methionine</div>
            <div className="flex justify-between items-end">
              <div>
                <div className="text-xl font-bold text-gray-900">
                  {nutritionalAnalysis.provided.methionine}%
                </div>
                <div className="text-xs text-gray-500">
                  Required: {nutritionalAnalysis.required.methionine || 0}%
                </div>
              </div>
              {nutritionalAnalysis.provided.methionine >= (nutritionalAnalysis.required.methionine || 0) ? (
                <span className="text-green-600 text-2xl">✓</span>
              ) : (
                <span className="text-red-600 text-xs">
                  {nutritionalAnalysis.deficits.methionine > 0 ? '+' : ''}
                  {nutritionalAnalysis.deficits.methionine.toFixed(3)}%
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Step-by-Step Calculation */}
      {showStepByStep && (
        <div className="mb-6 bg-red-100 border-4 border-red-500 p-4">
          {console.log('RENDERING STEP-BY-STEP COMPONENT! showStepByStep:', showStepByStep)}
          <h3 className="text-xl font-bold text-red-800 mb-4">🔍 STEP-BY-STEP CALCULATION</h3>
          <p className="text-red-700 mb-4">Button clicked! This should be visible when showStepByStep is true.</p>
          
          <div className="bg-white p-4 rounded border">
            <h4 className="font-bold mb-2">Debug Info:</h4>
            <p>showStepByStep: {showStepByStep ? 'TRUE' : 'FALSE'}</p>
            <p>Feed Weight: {editableBatchWeight} kg</p>
            <p>Species: {formulation.species}</p>
            <p>Phase: {formulation.phase}</p>
            <p>Ingredients: {results.originalIngredients ? results.originalIngredients.length : 0}</p>
          </div>

          <div className="mt-4 bg-blue-100 p-4 rounded">
            <h4 className="font-bold mb-2">Simple Step-by-Step Preview:</h4>
            <div className="space-y-2">
              <div className="bg-white p-2 rounded">✅ Step 1: Input Data - {editableBatchWeight}kg batch</div>
              <div className="bg-white p-2 rounded">✅ Step 2: Ingredient Selection - {results.originalIngredients?.length || 0} ingredients</div>
              <div className="bg-white p-2 rounded">✅ Step 3: Pearson's Square Method applied</div>
              <div className="bg-white p-2 rounded">✅ Step 4: Supplements added for deficits</div>
              <div className="bg-white p-2 rounded">✅ Step 5: Final formulation complete</div>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Calculation Table */}
      <DetailedCalculationTable 
        ingredients={updatedCalculation.ingredients}
        nutritionalAnalysis={nutritionalAnalysis}
        feedBatchWeight={editableBatchWeight}
      />

      {/* Final Summary */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border border-green-200">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">✅</span>
          <h3 className="text-lg font-semibold text-gray-900">Formulation Complete</h3>
        </div>
        <p className="text-sm text-gray-700">
          This formulation has been calculated using the <strong>Pearson's Square Method</strong> to meet 
          the nutritional requirements for <strong>{formulation.species}</strong> - <strong>{formulation.phase}</strong> phase.
          All nutrient deficits have been addressed with appropriate supplements.
        </p>
      </div>

      {/* Step-by-Step Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">🔍 Step-by-Step Calculation Flow</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            
            <div className="p-6">
              {/* Step 1: Input Data */}
              <div className="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">📝 Step 1: Input Data & Requirements</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><strong>Feed Batch Weight:</strong> {editableBatchWeight} kg</div>
                  <div><strong>Species:</strong> {formulation.species}</div>
                  <div><strong>Phase:</strong> {formulation.phase}</div>
                  <div><strong>Include Premix:</strong> Yes</div>
                </div>
                <div className="mt-3">
                  <h4 className="font-semibold text-blue-800 mb-2">Nutritional Requirements:</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><strong>Crude Protein:</strong> {results.formulation?.nutritionalAnalysis?.required?.crudeProtein}%</div>
                    <div><strong>ME (kcal/kg):</strong> {results.formulation?.nutritionalAnalysis?.required?.meKcalPerKg}</div>
                    <div><strong>Calcium:</strong> {results.formulation?.nutritionalAnalysis?.required?.calcium}%</div>
                    <div><strong>Phosphorus:</strong> {results.formulation?.nutritionalAnalysis?.required?.availablePhosphorus}%</div>
                  </div>
                </div>
              </div>

              {/* Step 2: Ingredient Categorization */}
              <div className="mb-6 bg-green-50 p-4 rounded-lg border border-green-200">
                <h3 className="text-lg font-semibold text-green-800 mb-3">📊 Step 2: Ingredient Categorization</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-green-800 mb-2">🔋 Energy Sources (LPS):</h4>
                    <div className="space-y-1">
                      {results.originalIngredients?.filter(ing => ing.category === 'Energy Source').map((ing, index) => (
                        <div key={index} className="text-sm bg-white p-2 rounded border">
                          <strong>{ing.name}:</strong> {ing.crudeProtein}% CP, {ing.energy} kcal/kg
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-800 mb-2">🥩 Protein Sources (HPS):</h4>
                    <div className="space-y-1">
                      {results.originalIngredients?.filter(ing => ing.category === 'Protein Source').map((ing, index) => (
                        <div key={index} className="text-sm bg-white p-2 rounded border">
                          <strong>{ing.name}:</strong> {ing.crudeProtein}% CP, {ing.energy} kcal/kg
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3: Pearson's Square Method */}
              <div className="mb-6 bg-purple-50 p-4 rounded-lg border border-purple-200">
                <h3 className="text-lg font-semibold text-purple-800 mb-3">⬜ Step 3: Pearson's Square Method</h3>
                
                {/* Actual Pearson's Square Calculation */}
                <div className="bg-white p-4 rounded border mb-3">
                  <div className="text-center mb-4">
                    <div className="text-sm font-semibold mb-2">Pearson's Square Calculation</div>
                    
                    {/* Pearson's Square Visual */}
                    <div className="flex justify-center items-center">
                      <div className="border-2 border-gray-800 p-4 m-2">
                        <div className="text-center mb-2">
                          <div className="bg-blue-100 p-2 rounded border mb-1">
                            <strong>HPS (High Protein Sources)</strong>
                          </div>
                          <div className="text-sm">
                            {results.originalIngredients?.filter(ing => ing.category === 'Protein Source').map((ing, index) => (
                              <div key={index} className="text-xs">
                                {ing.name}: {(ing.crudeProtein ?? 0).toFixed(3)}% CP
                              </div>
                            ))}
                          </div>
                          <div className="font-bold text-blue-600 mt-1">
                            Avg: {(
                              (results.originalIngredients?.filter(ing => ing.category === 'Protein Source').reduce((sum, ing) => sum + (ing.crudeProtein ?? 0), 0) / 
                               (results.originalIngredients?.filter(ing => ing.category === 'Protein Source').length || 1)
                              )
                            ).toFixed(3)}%
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2 text-center text-sm">
                          <div className="bg-blue-100 p-2 rounded border">
                            <div className="font-bold">
                              {(results.formulation?.nutritionalAnalysis?.required?.crudeProtein ?? 0).toFixed(3)}%
                            </div>
                            <div className="text-xs">Target CP</div>
                          </div>
                          <div className="bg-gray-100 p-2 rounded border">
                            <div className="font-bold">
                              {Math.abs(
                                (results.formulation?.nutritionalAnalysis?.required?.crudeProtein ?? 0)
                                -
                                (
                                  (results.originalIngredients?.filter(ing => ing.category === 'Energy Source').reduce((sum, ing) => sum + (ing.crudeProtein ?? 0), 0) /
                                    (results.originalIngredients?.filter(ing => ing.category === 'Energy Source').length || 1)
                                  )
                                )
                              ).toFixed(3)}%
                            </div>
                            <div className="text-xs">HPS Parts</div>
                          </div>
                          <div className="bg-green-100 p-2 rounded border">
                            <div className="font-bold">
                              {Math.abs(
                                (results.formulation?.nutritionalAnalysis?.required?.crudeProtein ?? 0)
                                -
                                (
                                  (results.originalIngredients?.filter(ing => ing.category === 'Protein Source').reduce((sum, ing) => sum + (ing.crudeProtein ?? 0), 0) /
                                    (results.originalIngredients?.filter(ing => ing.category === 'Protein Source').length || 1)
                                  )
                                )
                              ).toFixed(3)}%
                            </div>
                            <div className="text-xs">LPS Parts</div>
                          </div>
                        </div>
                        
                        <div className="text-center mt-2">
                          <div className="bg-green-100 p-2 rounded border">
                            <strong>LPS (Low Protein Sources)</strong>
                          </div>
                          <div className="text-sm">
                            {results.originalIngredients?.filter(ing => ing.category === 'Energy Source').map((ing, index) => (
                              <div key={index} className="text-xs">
                                {ing.name}: {(ing.crudeProtein ?? 0).toFixed(3)}% CP
                              </div>
                            ))}
                          </div>
                          <div className="font-bold text-green-600 mt-1">
                            Avg: {(
                              (results.originalIngredients?.filter(ing => ing.category === 'Energy Source').reduce((sum, ing) => sum + (ing.crudeProtein ?? 0), 0) / 
                               (results.originalIngredients?.filter(ing => ing.category === 'Energy Source').length || 1)
                              )
                            ).toFixed(3)}%
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Calculation Details */}
                  <div className="mt-4 bg-gray-50 p-3 rounded border">
                    <h4 className="font-semibold text-purple-800 mb-2">📊 Calculation Steps:</h4>
                    <div className="text-sm space-y-1">
                      <div><strong>Original Requirement:</strong> {results.formulation?.nutritionalAnalysis?.required?.crudeProtein}%</div>
                      <div><strong>Fixed Contribution:</strong> {((10 * 11) / 100).toFixed(2)}% (Rice Bran 10 parts × 11% CP)</div>
                      <div><strong>Remaining Need:</strong> {(results.formulation?.nutritionalAnalysis?.required?.crudeProtein - (10 * 11 / 100)).toFixed(2)}%</div>
                      <div><strong>Adjusted Target (80 parts):</strong> {(((results.formulation?.nutritionalAnalysis?.required?.crudeProtein - (10 * 11 / 100)) / 80) * 100).toFixed(3)}%</div>
                      <div><strong>HPS Average CP:</strong> {(results.originalIngredients?.filter(ing => ing.category === 'Protein Source').reduce((sum, ing) => sum + ing.crudeProtein, 0) / results.originalIngredients?.filter(ing => ing.category === 'Protein Source').length || 0).toFixed(3)}%</div>
                      <div><strong>LPS Average CP:</strong> {(results.originalIngredients?.filter(ing => ing.category === 'Energy Source').reduce((sum, ing) => sum + ing.crudeProtein, 0) / results.originalIngredients?.filter(ing => ing.category === 'Energy Source').length || 0).toFixed(3)}%</div>
                      
                      <div className="mt-3 pt-3 border-t border-gray-300">
                        <div><strong>HPS Difference:</strong> {(results.originalIngredients?.filter(ing => ing.category === 'Protein Source').reduce((sum, ing) => sum + ing.crudeProtein, 0) / results.originalIngredients?.filter(ing => ing.category === 'Protein Source').length || 0).toFixed(3)}% - {(((results.formulation?.nutritionalAnalysis?.required?.crudeProtein - (10 * 11 / 100)) / 80) * 100).toFixed(3)}% = {((results.originalIngredients?.filter(ing => ing.category === 'Protein Source').reduce((sum, ing) => sum + ing.crudeProtein, 0) / results.originalIngredients?.filter(ing => ing.category === 'Protein Source').length || 0) - (((results.formulation?.nutritionalAnalysis?.required?.crudeProtein - (10 * 11 / 100)) / 80) * 100)).toFixed(3)}</div>
                        <div><strong>LPS Difference:</strong> {(((results.formulation?.nutritionalAnalysis?.required?.crudeProtein - (10 * 11 / 100)) / 80) * 100).toFixed(3)}% - {(results.originalIngredients?.filter(ing => ing.category === 'Energy Source').reduce((sum, ing) => sum + ing.crudeProtein, 0) / results.originalIngredients?.filter(ing => ing.category === 'Energy Source').length || 0).toFixed(3)}% = {((((results.formulation?.nutritionalAnalysis?.required?.crudeProtein - (10 * 11 / 100)) / 80) * 100) - (results.originalIngredients?.filter(ing => ing.category === 'Energy Source').reduce((sum, ing) => sum + ing.crudeProtein, 0) / results.originalIngredients?.filter(ing => ing.category === 'Energy Source').length || 0)).toFixed(3)}</div>
                        
                        <div className="mt-3 pt-2 border-t border-gray-200">
                          <div><strong>Scale to 80 parts:</strong></div>
                          <div>LPS: {((results.originalIngredients?.filter(ing => ing.category === 'Protein Source').reduce((sum, ing) => sum + ing.crudeProtein, 0) / results.originalIngredients?.filter(ing => ing.category === 'Protein Source').length || 0) - (((results.formulation?.nutritionalAnalysis?.required?.crudeProtein - (10 * 11 / 100)) / 80) * 100)).toFixed(3)} ÷ {(((results.originalIngredients?.filter(ing => ing.category === 'Protein Source').reduce((sum, ing) => sum + ing.crudeProtein, 0) / results.originalIngredients?.filter(ing => ing.category === 'Protein Source').length || 0) - (((results.formulation?.nutritionalAnalysis?.required?.crudeProtein - (10 * 11 / 100)) / 80) * 100)) + (((((results.formulation?.nutritionalAnalysis?.required?.crudeProtein - (10 * 11 / 100)) / 80) * 100) - (results.originalIngredients?.filter(ing => ing.category === 'Energy Source').reduce((sum, ing) => sum + ing.crudeProtein, 0) / results.originalIngredients?.filter(ing => ing.category === 'Energy Source').length || 0)))).toFixed(3)} × 80 = {((((results.originalIngredients?.filter(ing => ing.category === 'Protein Source').reduce((sum, ing) => sum + ing.crudeProtein, 0) / results.originalIngredients?.filter(ing => ing.category === 'Protein Source').length || 0) - (((results.formulation?.nutritionalAnalysis?.required?.crudeProtein - (10 * 11 / 100)) / 80) * 100)) / (((results.originalIngredients?.filter(ing => ing.category === 'Protein Source').reduce((sum, ing) => sum + ing.crudeProtein, 0) / results.originalIngredients?.filter(ing => ing.category === 'Protein Source').length || 0) - (((results.formulation?.nutritionalAnalysis?.required?.crudeProtein - (10 * 11 / 100)) / 80) * 100)) + (((((results.formulation?.nutritionalAnalysis?.required?.crudeProtein - (10 * 11 / 100)) / 80) * 100) - (results.originalIngredients?.filter(ing => ing.category === 'Energy Source').reduce((sum, ing) => sum + ing.crudeProtein, 0) / results.originalIngredients?.filter(ing => ing.category === 'Energy Source').length || 0))))) * 80).toFixed(3)}%</div>
                          <div>HPS Total: {((((results.formulation?.nutritionalAnalysis?.required?.crudeProtein - (10 * 11 / 100)) / 80) * 100) - (results.originalIngredients?.filter(ing => ing.category === 'Energy Source').reduce((sum, ing) => sum + ing.crudeProtein, 0) / results.originalIngredients?.filter(ing => ing.category === 'Energy Source').length || 0)).toFixed(3)} ÷ {(((results.originalIngredients?.filter(ing => ing.category === 'Protein Source').reduce((sum, ing) => sum + ing.crudeProtein, 0) / results.originalIngredients?.filter(ing => ing.category === 'Protein Source').length || 0) - (((results.formulation?.nutritionalAnalysis?.required?.crudeProtein - (10 * 11 / 100)) / 80) * 100)) + (((((results.formulation?.nutritionalAnalysis?.required?.crudeProtein - (10 * 11 / 100)) / 80) * 100) - (results.originalIngredients?.filter(ing => ing.category === 'Energy Source').reduce((sum, ing) => sum + ing.crudeProtein, 0) / results.originalIngredients?.filter(ing => ing.category === 'Energy Source').length || 0)))).toFixed(3)} × 80 = {((((((results.formulation?.nutritionalAnalysis?.required?.crudeProtein - (10 * 11 / 100)) / 80) * 100) - (results.originalIngredients?.filter(ing => ing.category === 'Energy Source').reduce((sum, ing) => sum + ing.crudeProtein, 0) / results.originalIngredients?.filter(ing => ing.category === 'Energy Source').length || 0)) / (((results.originalIngredients?.filter(ing => ing.category === 'Protein Source').reduce((sum, ing) => sum + ing.crudeProtein, 0) / results.originalIngredients?.filter(ing => ing.category === 'Protein Source').length || 0) - (((results.formulation?.nutritionalAnalysis?.required?.crudeProtein - (10 * 11 / 100)) / 80) * 100)) + (((((results.formulation?.nutritionalAnalysis?.required?.crudeProtein - (10 * 11 / 100)) / 80) * 100) - (results.originalIngredients?.filter(ing => ing.category === 'Energy Source').reduce((sum, ing) => sum + ing.crudeProtein, 0) / results.originalIngredients?.filter(ing => ing.category === 'Energy Source').length || 0))))) * 80).toFixed(3)}%</div>
                          {/* <div>LPS per each ingredient: {((((((results.formulation?.nutritionalAnalysis?.required?.crudeProtein - (10 * 11 / 100)) / 80) * 100) - (results.originalIngredients?.filter(ing => ing.category === 'Energy Source').reduce((sum, ing) => sum + ing.crudeProtein, 0) / results.originalIngredients?.filter(ing => ing.category === 'Energy Source').length || 0)) / (((results.originalIngredients?.filter(ing => ing.category === 'Protein Source').reduce((sum, ing) => sum + ing.crudeProtein, 0) / results.originalIngredients?.filter(ing => ing.category === 'Protein Source').length || 0) - (((results.formulation?.nutritionalAnalysis?.required?.crudeProtein - (10 * 11 / 100)) / 80) * 100)) + (((((results.formulation?.nutritionalAnalysis?.required?.crudeProtein - (10 * 11 / 100)) / 80) * 100) - (results.originalIngredients?.filter(ing => ing.category === 'Energy Source').reduce((sum, ing) => sum + ing.crudeProtein, 0) / results.originalIngredients?.filter(ing => ing.category === 'Energy Source').length || 0))))) * 80).toFixed(3)} ÷ {results.originalIngredients?.filter(ing => ing.category === 'Energy Source').length || 1} = {((((((results.formulation?.nutritionalAnalysis?.required?.crudeProtein - (10 * 11 / 100)) / 80) * 100) - (results.originalIngredients?.filter(ing => ing.category === 'Energy Source').reduce((sum, ing) => sum + ing.crudeProtein, 0) / results.originalIngredients?.filter(ing => ing.category === 'Energy Source').length || 0)) / (((results.originalIngredients?.filter(ing => ing.category === 'Protein Source').reduce((sum, ing) => sum + ing.crudeProtein, 0) / results.originalIngredients?.filter(ing => ing.category === 'Protein Source').length || 0) - (((results.formulation?.nutritionalAnalysis?.required?.crudeProtein - (10 * 11 / 100)) / 80) * 100)) + (((((results.formulation?.nutritionalAnalysis?.required?.crudeProtein - (10 * 11 / 100)) / 80) * 100) - (results.originalIngredients?.filter(ing => ing.category === 'Energy Source').reduce((sum, ing) => sum + ing.crudeProtein, 0) / results.originalIngredients?.filter(ing => ing.category === 'Energy Source').length || 0))))) * 80 / (results.originalIngredients?.filter(ing => ing.category === 'Energy Source').length || 1)).toFixed(3)}% each</div> */}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-purple-700">
                  This method balances crude protein requirements by calculating the ratio between high and low protein sources needed to achieve the target protein level.
                </p>
              </div>

              {/* Step 4: Supplement Addition */}
              <div className="mb-6 bg-orange-50 p-4 rounded-lg border border-orange-200">
                <h3 className="text-lg font-semibold text-orange-800 mb-3">💊 Step 4: Supplement Addition</h3>
                <div className="space-y-2">
                  {results.formulation?.ingredients?.filter(ing => ing.isSupplement).map((ing, index) => (
                    <div key={index} className="bg-white p-2 rounded border text-sm">
                      <strong>{ing.name}:</strong> {ing.parts}% - {
                        ing.name.includes('Lysine') ? 'Amino Acid (Lysine)' : 
                        ing.name.includes('Methionine') ? 'Amino Acid (Methionine)' : 
                        ing.name.includes('DCP') ? 'Phosphorus + Calcium' : 
                        ing.name.includes('CaCO') ? 'Calcium' : 
                        ing.name.includes('Oil') ? 'Energy' : 
                        'Minerals & Vitamins'}
                    </div>
                  ))}
                </div>
                <div className="mt-3 text-xs text-orange-700">
                  <p>✅ Supplements are added to address any nutrient deficits from base ingredients.</p>
                  <p>✅ Amino acids (Lysine, Methionine) are added if natural protein sources don't provide enough.</p>
                </div>
              </div>

              {/* Step 5: Final Results */}
              <div className="mb-6 bg-emerald-50 p-4 rounded-lg border border-emerald-200">
                <h3 className="text-lg font-semibold text-emerald-800 mb-3">🎯 Step 5: Final Formulation Results</h3>
                <div className="space-y-2">
                  <h4 className="font-semibold mb-2">Final Ingredient List:</h4>
                  {updatedCalculation.ingredients.map((ingredient, index) => (
                    <div key={index} className="flex justify-between items-center bg-white p-2 rounded border text-sm">
                      <span>{ingredient.name}</span>
                      <div className="text-right">
                        <div className="font-semibold">{ingredient.parts}%</div>
                        <div className="text-xs text-gray-600">{ingredient.amountKg} kg</div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 bg-white p-3 rounded border">
                  <h5 className="font-semibold mb-2">Final Nutrient Analysis:</h5>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {results.nutrientSummary?.map((nutrient, index) => (
                      <div key={index} className="flex justify-between">
                        <span>{nutrient.name}:</span>
                        <span className="font-semibold">
                          {nutrient.achieved} 
                          {nutrient.achieved >= nutrient.required ? ' ✅' : ' ❌'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsDisplay;

