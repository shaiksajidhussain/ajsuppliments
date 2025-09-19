import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../index.css';

const SpeciesSelection = () => {
  const navigate = useNavigate();

  const speciesData = [
    {
      id: 'poultry',
      name: 'Poultry',
      description: 'Chicken, Turkey, Duck, Quails',
      image: 'https://media.istockphoto.com/id/1297318963/photo/silhouette-of-a-rooster-crow-in-the-morning-sunrise-background.jpg?s=612x612&w=0&k=20&c=EFp3wMROww5QjPhzuhH6-YTJRfmgeYh8SSa-7fMKTo0=',
      gradient: 'from-yellow-400 to-orange-500',
      hoverGradient: 'from-yellow-500 to-orange-600'
    },
    {
      id: 'cattle',
      name: 'Cattle',
      description: 'Dairy and Beef Cattle',
      image: 'https://static.vecteezy.com/system/resources/thumbnails/044/542/774/small_2x/cows-in-the-pasture-photo.jpeg',
      gradient: 'from-brown-400 to-amber-600',
      hoverGradient: 'from-brown-500 to-amber-700'
    },
    {
      id: 'buffalo',
      name: 'Buffalo',
      description: 'Dairy and Meat Buffalo',
      image: 'https://images.stockcake.com/public/1/2/d/12df69bb-748c-4f9e-b559-e65792ab4f5b_large/buffalo-at-sunset-stockcake.jpg',
      gradient: 'from-gray-500 to-gray-700',
      hoverGradient: 'from-gray-600 to-gray-800'
    },
    {
      id: 'sheep',
      name: 'Sheep',
      description: 'Wool and Meat Sheep',
      image: 'https://media.istockphoto.com/id/1366782202/photo/lamb-running-on-the-field-at-sunset.jpg?s=612x612&w=0&k=20&c=wZKync0nt9Q0TJ9ELxIQgZ_3qsCVDx4OSjwvp1yQrug=',
      gradient: 'from-white to-gray-400',
      hoverGradient: 'from-gray-100 to-gray-500'
    },
    {
      id: 'swine',
      name: 'Swine',
      description: 'Pigs and Piglets',
      image: 'https://media.istockphoto.com/id/153560796/photo/small-pig.jpg?s=612x612&w=0&k=20&c=sTm01xCQn20jJJqBoPXL3zQACIrM1zN9IOzNR9ta-Tk=',
      gradient: 'from-pink-400 to-rose-600',
      hoverGradient: 'from-pink-500 to-rose-700'
    },
    {
      id: 'goat',
      name: 'Goat',
      description: 'Dairy and Meat Goats',
      image: 'https://images.stockcake.com/public/4/3/b/43b07e85-2543-4186-83c2-05d9579b2267_large/goat-at-sunset-stockcake.jpg',
      gradient: 'from-green-400 to-emerald-600',
      hoverGradient: 'from-green-500 to-emerald-700'
    }
  ];

  const handleSpeciesClick = (speciesId) => {
    // Store selected species in localStorage
    localStorage.setItem('selectedSpecies', speciesId);
    // Navigate to specific species page
    navigate(`/${speciesId}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('loginTime');
    localStorage.removeItem('selectedSpecies');
    navigate('/login');
  };

  return (
    <div 
      className="min-h-screen relative"
      style={{
        backgroundImage: 'url(https://images.stockcake.com/public/1/4/d/14d133a4-16ec-46bf-b384-da364125b7ff_large/sunset-farm-hen-stockcake.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/75"></div>
      
      {/* Content */}
      <div className="relative z-10 ">
        {/* Header */}
        <div className="backdrop-blur-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between gap-7">
            <h1 className="text-4xl font-bold text-white " style={{padding:'16px'}}>Select Animal Species</h1>
            <div className="flex items-center space-x-4 gap-7">
              <span className="text-white text-sm">
                Welcome, {localStorage.getItem('userEmail') || 'User'}
              </span>
              <button 
                onClick={handleLogout}
                className=" bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200"
                style={{padding:'10px',marginRight:'10px'}}
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-8" style={{padding:'16px'}}>
          <div className="text-center mb-12 " style={{padding:'10px'}}>
            <h2 className="text-4xl font-bold text-white mb-4 text-center">
              Choose Your Animal Species
            </h2>
            <p className="text-xl text-gray-200">
              Select the type of animal you want to formulate feed for
            </p>
          </div>

          {/* Species Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 " style={{padding:'10px'}}>
            {speciesData.map((species) => (
              <div
                key={species.id}
                onClick={() => handleSpeciesClick(species.id)}
                className="group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:-translate-y-2"
              >
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 h-full">
                  {/* Image Container */}
                  <div className="relative mb-6 overflow-hidden rounded-xl">
                    <img
                      src={species.image}
                      alt={species.name}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                      onError={(e) => {
                        // Fallback to a placeholder if image fails to load
                        e.target.src = `https://via.placeholder.com/400x300/4F46E5/FFFFFF?text=${species.name}`;
                      }}
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${species.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
                  </div>

                  {/* Content */}
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-yellow-300 transition-colors duration-300">
                      {species.name}
                    </h3>
                    <p className="text-gray-300 text-sm mb-4">
                      {species.description}
                    </p>
                    
                    {/* Click Indicator */}
                    {/* <div className="inline-flex items-center bg-white/20 rounded-full text-white text-sm font-medium group-hover:bg-white/30 transition-all duration-300"
                    style={{padding:'4px',marginTop:'10px'}}
                    >
                      <span>Click to Continue</span>
                      <svg 
                        className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div> */}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer Info */}
          {/* <div className="text-center mt-16 flex justify-center items-center">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold text-white mb-4">
                Advanced Feed Formulation
              </h3>
              <p className="text-gray-200 text-lg leading-relaxed">
                Our intelligent feed formulation software provides precise nutritional recommendations 
                tailored to each species' specific requirements. Select your animal type above to 
                begin creating optimized feed formulations.
              </p>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default SpeciesSelection;
