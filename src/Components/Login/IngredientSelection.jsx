import React, { useState, useEffect } from 'react';

const IngredientSelection = ({ onIngredientsChange, className = '', style }) => {
  const [ingredients, setIngredients] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchIngredients();
  }, []);

  const fetchIngredients = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching ingredients...');
      const response = await fetch('http://localhost:3001/api/ingredients', {
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch ingredients');
      }

      const data = await response.json();
        console.log('🔍 Fetched ingredients:', data.ingredients?.length || 0);
      console.log('🔍 Ingredients details:', data.ingredients?.map(ing => ({ id: ing.id, name: ing.name, category: ing.category })));
      setIngredients(data.ingredients || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching ingredients:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleIngredientToggle = (ingredientId) => {
    console.log('🔍 Toggling ingredient:', ingredientId);
    console.log('🔍 Current ingredients:', ingredients.map(ing => ({ id: ing.id, name: ing.name })));
    
    setSelectedIngredients(prev => {
      const newSelection = prev.includes(ingredientId)
        ? prev.filter(id => id !== ingredientId)
        : [...prev, ingredientId];
      
      console.log('🔍 New selection:', newSelection);
      
      // Notify parent component of the change
      if (onIngredientsChange) {
        const selectedIngredientObjects = ingredients.filter(ing => newSelection.includes(ing.id));
        console.log('🔍 Selected ingredient objects:', selectedIngredientObjects.map(ing => ({ id: ing.id, name: ing.name })));
        // Use setTimeout to avoid React warning about setState during render
        setTimeout(() => {
          onIngredientsChange(selectedIngredientObjects);
        }, 0);
      }
      
      return newSelection;
    });
  };

  // Group ingredients by category
  const groupedIngredients = ingredients.reduce((acc, ingredient) => {
    const category = ingredient.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(ingredient);
    return acc;
  }, {});

  // Define the main categories we want to display
  const mainCategories = [
    { name: 'Protein Sources', color: 'text-red-600' },
    { name: 'Energy Sources', color: 'text-green-600' },
    { name: 'Medium Source', color: 'text-amber-600' },
    // { name: 'Minerals', color: 'text-blue-600' },
    // { name: 'Amino Acids', color: 'text-purple-600' },
    // { name: 'Vitamins', color: 'text-yellow-600' }
  ];

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="text-lg text-gray-600">Loading ingredients...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-lg text-red-600">Error loading ingredients: {error}</div>
        <button 
          onClick={fetchIngredients}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className={`bg-white/95 backdrop-blur-sm relative top-10 rounded-lg p-6 shadow-xl border border-white/20 mt-10 ${className}`} style={style}>
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Select Ingredients</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mainCategories.map((category) => {
          const categoryIngredients = groupedIngredients[category.name] || [];
          
          return (
            <div key={category.name} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center mb-4">
                {/* <span className="text-2xl mr-2">{category.icon}</span> */}
                <h3 className={`text-lg font-semibold ${category.color}`}>
                  {category.name}
                </h3>
              </div>
              
              <div className="max-h-64 overflow-y-auto space-y-2">
                {categoryIngredients.length > 0 ? (
                  categoryIngredients.map((ingredient) => (
                    <label
                      key={ingredient.id}
                      style={{padding: '3px'}}
                      className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-2 rounded"
                    >
                      <input
                        type="checkbox"
                        checked={selectedIngredients.includes(ingredient.id)}
                        onChange={() => handleIngredientToggle(ingredient.id)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 "
                      />
                      <span className="text-sm text-gray-700 relative -right-2">{ingredient.name}</span>
                    </label>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 italic">No ingredients in this category</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
{/*       
      {selectedIngredients.length > 0 && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>{selectedIngredients.length}</strong> ingredient(s) selected
          </p>
        </div>
      )} */}
    </div>
  );
};

export default IngredientSelection;
