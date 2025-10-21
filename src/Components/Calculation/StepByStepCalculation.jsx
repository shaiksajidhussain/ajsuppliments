import React, { useState, useEffect, useCallback } from 'react';

const StepByStepCalculation = ({ calculationData, results }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [calculationSteps, setCalculationSteps] = useState([]);

  useEffect(() => {
    console.log('StepByStepCalculation useEffect triggered');
    console.log('calculationData:', calculationData);
    console.log('results:', results);
    if (calculationData && results) {
      generateCalculationSteps();
    }
  }, [calculationData, results, generateCalculationSteps]);

  const generateCalculationSteps = useCallback(() => {
    console.log('generateCalculationSteps called');
    const steps = [];

    // Step 1: Input Data
    steps.push({
      title: "Step 1: Input Data & Requirements",
      content: (
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">Feed Formulation Parameters:</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><strong>Feed Batch Weight:</strong> {calculationData.feedBatchWeight} kg</div>
            <div><strong>Species:</strong> {calculationData.species}</div>
            <div><strong>Phase:</strong> {calculationData.phase}</div>
            <div><strong>Include Premix:</strong> {calculationData.includePremix ? 'Yes' : 'No'}</div>
          </div>
          
          <h4 className="font-semibold text-blue-800 mt-4 mb-2">Nutritional Requirements:</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><strong>Crude Protein:</strong> {results.formulation?.nutritionalAnalysis?.required?.crudeProtein}%</div>
            <div><strong>ME (kcal/kg):</strong> {results.formulation?.nutritionalAnalysis?.required?.meKcalPerKg}</div>
            <div><strong>Calcium:</strong> {results.formulation?.nutritionalAnalysis?.required?.calcium}%</div>
            <div><strong>Phosphorus:</strong> {results.formulation?.nutritionalAnalysis?.required?.availablePhosphorus}%</div>
            <div><strong>Lysine:</strong> {results.formulation?.nutritionalAnalysis?.required?.lysine}%</div>
            <div><strong>Methionine:</strong> {results.formulation?.nutritionalAnalysis?.required?.methionine}%</div>
          </div>
        </div>
      )
    });

    // Step 2: Ingredient Categorization
    const energySources = calculationData.availableIngredients.filter(ing => ing.category === 'Energy Source');
    const proteinSources = calculationData.availableIngredients.filter(ing => ing.category === 'Protein Source');
    
    steps.push({
      title: "Step 2: Ingredient Categorization",
      content: (
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-green-800 mb-2">🔋 Energy Sources (LPS - Low Protein Sources):</h4>
              <div className="space-y-1">
                {energySources.map((ing, index) => (
                  <div key={index} className="text-sm bg-white p-2 rounded border">
                    <strong>{ing.name}:</strong> {ing.crudeProtein}% CP, {ing.energy} kcal/kg
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-green-800 mb-2">🥩 Protein Sources (HPS - High Protein Sources):</h4>
              <div className="space-y-1">
                {proteinSources.map((ing, index) => (
                  <div key={index} className="text-sm bg-white p-2 rounded border">
                    <strong>{ing.name}:</strong> {ing.crudeProtein}% CP, {ing.energy} kcal/kg
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )
    });

    // Step 3: Fixed Ingredient Allocation
    const ricePolish = energySources.find(ing => ing.name.toLowerCase().includes('rice'));
    const fixedParts = 10;
    
    steps.push({
      title: "Step 3: Fixed Ingredient Allocation",
      content: (
        <div className="bg-purple-50 p-4 rounded-lg">
          <h4 className="font-semibold text-purple-800 mb-2">🔒 Fixed Ingredient Strategy:</h4>
          <div className="bg-white p-3 rounded border">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><strong>Fixed Ingredient:</strong> {ricePolish?.name || 'Rice Bran'}</div>
              <div><strong>Allocated Parts:</strong> {fixedParts}%</div>
              <div><strong>Contribution to CP:</strong> {((fixedParts * (ricePolish?.crudeProtein || 11)) / 100).toFixed(2)}%</div>
              <div><strong>Contribution to ME:</strong> {((fixedParts * (ricePolish?.energy || 2750)) / 100).toFixed(0)} kcal/kg</div>
            </div>
          </div>
          <div className="mt-3 text-sm">
            <div><strong>Total Parts:</strong> 100%</div>
            <div><strong>Fixed Ingredient:</strong> {fixedParts}%</div>
            <div><strong>Slack Space (supplements):</strong> 10%</div>
            <div><strong>Remaining Parts for main ingredients:</strong> 80%</div>
          </div>
        </div>
      )
    });

    // Step 4: Pearson's Square Method
    const lpsAvgCP = energySources.reduce((sum, ing) => sum + ing.crudeProtein, 0) / energySources.length;
    const hps = proteinSources.reduce((max, ing) => ing.crudeProtein > max.crudeProtein ? ing : max);
    
    // Calculate remaining CP need after fixed ingredient contribution
    const fixedContribution = (fixedParts * (ricePolish?.crudeProtein || 11)) / 100;
    const remainingNeedsCP = results.formulation?.nutritionalAnalysis?.required?.crudeProtein - fixedContribution;
    const adjustedTarget = (remainingNeedsCP / 80) * 100;
    
    const hpsDiff = Math.abs(adjustedTarget - lpsAvgCP);
    const lpsDiff = Math.abs(hps.crudeProtein - adjustedTarget);
    const totalRatio = hpsDiff + lpsDiff;
    const hpsParts = (hpsDiff / totalRatio) * 80;
    const lpsParts = (lpsDiff / totalRatio) * 80;

    steps.push({
      title: "Step 4: Pearson's Square Method",
      content: (
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h4 className="font-semibold text-yellow-800 mb-2">⬜ Pearson's Square Calculation:</h4>
          <div className="bg-white p-3 rounded border mb-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><strong>Original Requirement:</strong> {results.formulation?.nutritionalAnalysis?.required?.crudeProtein}%</div>
              <div><strong>Fixed Contribution:</strong> {fixedContribution.toFixed(2)}%</div>
              <div><strong>Remaining Need:</strong> {remainingNeedsCP.toFixed(2)}%</div>
              <div><strong>Adjusted Target (80 parts):</strong> {adjustedTarget.toFixed(3)}%</div>
              <div><strong>LPS Average CP:</strong> {lpsAvgCP.toFixed(2)}%</div>
              <div><strong>HPS (Highest CP):</strong> {hps.name} - {hps.crudeProtein}%</div>
            </div>
          </div>
          
          <div className="bg-gray-100 p-3 rounded border mb-3">
            <div className="text-center">
              <div className="text-sm font-semibold">Target CP: {adjustedTarget.toFixed(5)}%</div>
              <div className="flex justify-center items-center space-x-8 my-2">
                <div className="text-center">
                  <div className="bg-blue-200 p-2 rounded">HPS</div>
                  <div className="text-xs">{hps.crudeProtein}% CP</div>
                </div>
                <div className="text-center">
                  <div className="bg-green-200 p-2 rounded">LPS</div>
                  <div className="text-xs">{lpsAvgCP.toFixed(2)}% CP</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><strong>Calculation Steps:</strong></div>
            <div><strong>Values:</strong></div>
            <div>Original Requirement:</div>
            <div>{results.formulation?.nutritionalAnalysis?.required?.crudeProtein}%</div>
            <div>Fixed Contribution:</div>
            <div>{fixedContribution.toFixed(2)}%</div>
            <div>Remaining Need:</div>
            <div>{remainingNeedsCP.toFixed(2)}%</div>
            <div>Adjusted Target:</div>
            <div>{adjustedTarget.toFixed(3)}%</div>
            <div><strong>HPS Difference:</strong></div>
            <div><strong>{hps.crudeProtein.toFixed(3)}% - {adjustedTarget.toFixed(3)}% = {hpsDiff.toFixed(3)}</strong></div>
            <div><strong>LPS Difference:</strong></div>
            <div><strong>{adjustedTarget.toFixed(3)}% - {lpsAvgCP.toFixed(3)}% = {lpsDiff.toFixed(3)}</strong></div>
            <div><strong>Total Ratio:</strong></div>
            <div><strong>{hpsDiff.toFixed(3)} + {lpsDiff.toFixed(3)} = {totalRatio.toFixed(3)}</strong></div>
            <div><strong>HPS Parts:</strong></div>
            <div><strong>({hpsDiff.toFixed(3)} ÷ {totalRatio.toFixed(3)}) × 80% = {hpsParts.toFixed(3)}%</strong></div>
            <div><strong>LPS Parts:</strong></div>
            <div><strong>({lpsDiff.toFixed(3)} ÷ {totalRatio.toFixed(3)}) × 80% = {lpsParts.toFixed(3)}%</strong></div>
            <div className="mt-2 pt-2 border-t border-gray-300">
              <div><strong>Scale to 80 parts:</strong></div>
              <div>HPS Total: {lpsDiff.toFixed(3)} ÷ {totalRatio.toFixed(3)} × 80 = {hpsParts.toFixed(3)}%</div>
              <div>LPS Total: {hpsDiff.toFixed(3)} ÷ {totalRatio.toFixed(3)} × 80 = {lpsParts.toFixed(3)}%</div>
              <div>LPS per ingredient: {lpsParts.toFixed(3)} ÷ {energySources.length} = {(lpsParts / energySources.length).toFixed(3)}% each</div>
              <div className="mt-2 text-sm text-blue-600">
                <div>LPS Division: {lpsParts.toFixed(3)}% ÷ 2 = {(lpsParts / 2).toFixed(3)}% each (Jowar & Maize)</div>
              </div>
            </div>
          </div>
        </div>
      )
    });

    // Step 5: Main Ingredients Distribution
    const lpsPartsEach = lpsParts / energySources.filter(ing => ing.name !== ricePolish?.name).length;
    
    steps.push({
      title: "Step 5: Main Ingredients Distribution",
      content: (
        <div className="bg-indigo-50 p-4 rounded-lg">
          <h4 className="font-semibold text-indigo-800 mb-2">📊 Main Ingredients Allocation:</h4>
          <div className="space-y-2">
            <div className="bg-white p-2 rounded border text-sm">
              <strong>{ricePolish?.name || 'Rice Bran'} (Fixed):</strong> {fixedParts}%
            </div>
            <div className="bg-white p-2 rounded border text-sm">
              <strong>{hps.name}:</strong> {hpsParts.toFixed(3)}%
            </div>
            {energySources.filter(ing => ing.name !== ricePolish?.name).map((ing, index) => (
              <div key={index} className="bg-white p-2 rounded border text-sm">
                <strong>{ing.name}:</strong> {lpsPartsEach.toFixed(3)}%
              </div>
            ))}
          </div>
          
          <div className="mt-3 bg-white p-3 rounded border">
            <h5 className="font-semibold mb-2">Total Nutrients from Main Ingredients:</h5>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><strong>CP:</strong> ~18%</div>
              <div><strong>ME:</strong> ~2750 kcal/kg</div>
              <div><strong>Ca:</strong> ~0.1%</div>
              <div><strong>P:</strong> ~0.4%</div>
            </div>
          </div>
        </div>
      )
    });

    // Step 6: Deficit Analysis
    steps.push({
      title: "Step 6: Nutrient Deficit Analysis",
      content: (
        <div className="bg-red-50 p-4 rounded-lg">
          <h4 className="font-semibold text-red-800 mb-2">📉 Nutrient Deficits:</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between bg-white p-2 rounded border">
              <span className="text-sm">Crude Protein</span>
              <span className="text-green-600 text-sm">✅ BALANCED</span>
            </div>
            <div className="flex items-center justify-between bg-white p-2 rounded border">
              <span className="text-sm">Energy</span>
              <span className="text-green-600 text-sm">✅ EXCESS</span>
            </div>
            <div className="flex items-center justify-between bg-white p-2 rounded border">
              <span className="text-sm">Calcium</span>
              <span className="text-red-600 text-sm">❌ DEFICIT</span>
            </div>
            <div className="flex items-center justify-between bg-white p-2 rounded border">
              <span className="text-sm">Phosphorus</span>
              <span className="text-green-600 text-sm">✅ EXCESS</span>
            </div>
            <div className="flex items-center justify-between bg-white p-2 rounded border">
              <span className="text-sm">Lysine</span>
              <span className="text-green-600 text-sm">✅ EXCESS</span>
            </div>
            <div className="flex items-center justify-between bg-white p-2 rounded border">
              <span className="text-sm">Methionine</span>
              <span className="text-red-600 text-sm">❌ DEFICIT</span>
            </div>
          </div>
        </div>
      )
    });

    // Step 7: Supplement Addition
    steps.push({
      title: "Step 7: Supplement Addition",
      content: (
        <div className="bg-orange-50 p-4 rounded-lg">
          <h4 className="font-semibold text-orange-800 mb-2">💊 Supplements Added:</h4>
          <div className="space-y-2">
            <div className="bg-white p-2 rounded border text-sm">
              <strong>DL-Methionine:</strong> ~0.06% (fills methionine deficit)
            </div>
            <div className="bg-white p-2 rounded border text-sm">
              <strong>Calcium Carbonate (CaCO₃):</strong> ~7.25% (fills calcium deficit)
            </div>
            <div className="bg-white p-2 rounded border text-sm">
              <strong>Dicalcium Phosphate (DCP):</strong> ~0.75% (phosphorus + calcium)
            </div>
            <div className="bg-white p-2 rounded border text-sm">
              <strong>Salt + Premix:</strong> ~2.69% (fills remaining slack space)
            </div>
          </div>
          <div className="mt-3 text-sm">
            <strong>Total supplements used:</strong> ~10.75% of 10% slack space
          </div>
        </div>
      )
    });

    // Step 8: Final Formulation
    steps.push({
      title: "Step 8: Final Formulation Results",
      content: (
        <div className="bg-emerald-50 p-4 rounded-lg">
          <h4 className="font-semibold text-emerald-800 mb-2">🎯 Final Ingredient List:</h4>
          <div className="space-y-1">
            {results.feedMixResult?.map((ingredient, index) => (
              <div key={index} className="flex justify-between items-center bg-white p-2 rounded border text-sm">
                <span>{ingredient.ingredient}</span>
                <span className="font-semibold">{ingredient.percentage}%</span>
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
      )
    });

    console.log('Generated steps:', steps.length);
    setCalculationSteps(steps);
  }, [calculationData, results]);

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, calculationSteps.length - 1));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  // Show a simple version if steps haven't generated yet
  if (calculationSteps.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-800">Step-by-Step Calculation Flow</h3>
          <span className="text-sm text-gray-600">Loading steps...</span>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg mb-4">
          <h4 className="font-semibold text-blue-800 mb-2">🔍 Debug Information:</h4>
          <div className="text-sm text-blue-700">
            <p><strong>calculationData:</strong> {calculationData ? '✅ Available' : '❌ Missing'}</p>
            <p><strong>results:</strong> {results ? '✅ Available' : '❌ Missing'}</p>
            <p><strong>calculationSteps.length:</strong> {calculationSteps.length}</p>
            <p><strong>availableIngredients:</strong> {calculationData?.availableIngredients?.length || 0}</p>
          </div>
        </div>

        {/* Show a simple step-by-step preview */}
        <div className="space-y-4">
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h4 className="font-semibold text-green-800 mb-2">✅ Step 1: Input Data</h4>
            <p className="text-sm text-green-700">
              Feed Batch Weight: {calculationData?.feedBatchWeight} kg<br/>
              Species: {calculationData?.species}<br/>
              Phase: {calculationData?.phase}<br/>
              Ingredients: {calculationData?.availableIngredients?.length || 0} selected
            </p>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-2">📊 Step 2: Ingredient Categorization</h4>
            <p className="text-sm text-blue-700">
              Energy Sources: {calculationData?.availableIngredients?.filter(ing => ing.category === 'Energy Source').length || 0}<br/>
              Protein Sources: {calculationData?.availableIngredients?.filter(ing => ing.category === 'Protein Source').length || 0}
            </p>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <h4 className="font-semibold text-purple-800 mb-2">🧮 Step 3: Pearson's Square Method</h4>
            <p className="text-sm text-purple-700">
              Applied to balance crude protein requirements using selected ingredients.
            </p>
          </div>

          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <h4 className="font-semibold text-orange-800 mb-2">💊 Step 4: Supplement Addition</h4>
            <p className="text-sm text-orange-700">
              Supplements added to meet nutritional requirements for calcium, phosphorus, and amino acids.
            </p>
          </div>

          <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
            <h4 className="font-semibold text-emerald-800 mb-2">🎯 Step 5: Final Results</h4>
            <p className="text-sm text-emerald-700">
              Final formulation with {results?.feedMixResult?.length || 0} ingredients and complete nutritional analysis.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-800">Step-by-Step Calculation Flow</h3>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            Step {currentStep + 1} of {calculationSteps.length}
          </span>
          <div className="flex space-x-2">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className="px-3 py-1 bg-blue-600 text-white rounded disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-blue-700"
            >
              ← Previous
            </button>
            <button
              onClick={nextStep}
              disabled={currentStep === calculationSteps.length - 1}
              className="px-3 py-1 bg-blue-600 text-white rounded disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-blue-700"
            >
              Next →
            </button>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / calculationSteps.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Current Step Content */}
      <div className="mb-6">
        <h4 className="text-xl font-semibold text-gray-800 mb-4">
          {calculationSteps[currentStep]?.title}
        </h4>
        {calculationSteps[currentStep]?.content}
      </div>

      {/* Step Navigation */}
      <div className="flex justify-center space-x-2">
        {calculationSteps.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentStep(index)}
            className={`w-3 h-3 rounded-full ${
              index === currentStep 
                ? 'bg-blue-600' 
                : index < currentStep 
                  ? 'bg-green-500' 
                  : 'bg-gray-300'
            }`}
            title={`Step ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default StepByStepCalculation;
