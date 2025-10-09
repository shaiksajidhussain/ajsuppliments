import React, { useRef, useEffect, useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const Ourproducts = () => {
  const { isDarkMode } = useTheme();
  const sectionRef = useRef(null);
  const [visibleProducts, setVisibleProducts] = useState([]);

  const productsData = [
    {
      id: 1,
      name: 'Nutrivolent Se',
      code: 'NOGP 001',
      description: 'Organic Selenium Supplement',
      image: 'https://www.ajsupplements.com/static/selenium.jpeg',
      bgColor: '#3B82F6'
    },
    {
      id: 2,
      name: 'Nutrivolent Ca',
      code: 'NIGP 001',
      description: 'Calcium Carbonate',
      image: 'https://www.ajsupplements.com/static/caco3.jpeg',
      bgColor: '#6B7280'
    },
    {
      id: 3,
      name: 'Nutrivolent DCP',
      code: 'NIGP 002',
      description: 'Dicalcium Phosphate',
      image: 'https://www.ajsupplements.com/static/dcp2.jpeg',
      bgColor: '#10B981'
    },
    {
      id: 4,
      name: 'Nutrivolent Mg',
      code: 'NIGP 003',
      description: 'Magnesium Sulfate',
      image: 'https://www.ajsupplements.com/static/MGSO4.png',
      bgColor: '#8B5CF6'
    },
    {
      id: 5,
      name: 'Nutrivolent Zn',
      code: 'NIGP 004',
      description: 'Zinc Sulfate',
      image: 'https://www.ajsupplements.com/static/znso4.jpeg',
      bgColor: '#F97316'
    },
    {
      id: 6,
      name: 'Nutrivolent I',
      code: 'NIGP 005',
      description: 'Iodine Supplement',
      image: 'https://www.ajsupplements.com/static/potassium.jpg',
      bgColor: '#EC4899'
    },
    {
      id: 7,
      name: 'Nutrivolent Fe',
      code: 'NIGP 006',
      description: 'Iron Sulfate',
      image: 'https://www.ajsupplements.com/static/feso4.jpeg',
      bgColor: '#EF4444'
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const productId = parseInt(entry.target.dataset.productId);
            setVisibleProducts(prev => [...prev, productId]);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      const products = sectionRef.current.querySelectorAll('[data-product-id]');
      products.forEach(product => observer.observe(product));
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      ref={sectionRef}
      id="products" 
      className={`min-h-screen py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden ${
        isDarkMode ? 'bg-gray-900' : 'bg-white'
      }`}
      style={{
        minHeight: '100vh',
        padding: '80px 16px',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: isDarkMode ? '#111827' : '#ffffff'
      }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10"></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat'
          }}></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10" style={{
        maxWidth: '1280px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 10
      }}>
        {/* Section Header */}
        <div className="text-center mb-20" style={{
          textAlign: 'center',
          marginBottom: '80px'
        }}>
           <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 text-white" style={{
            fontSize: 'clamp(1.875rem, 5vw, 4rem)',
            fontWeight: 'bold',
            marginBottom: 'clamp(16px, 3vw, 24px)',
            color: '#ffffff',
            textShadow: '0 4px 20px rgba(0,0,0,0.8)',
            background: 'linear-gradient(45deg, #F59E0B, #EF4444, #8B5CF6, #F59E0B)',
            backgroundSize: '300% 300%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            animation: 'gradientShift 3s ease infinite'
          }}>
            OUR PRODUCTS
          </h2>
          <p className={`text-2xl font-medium mb-8 transition-all duration-1000 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`} style={{
            fontSize: '1.5rem',
            fontWeight: '500',
            marginBottom: '32px',
            color: isDarkMode ? '#d1d5db' : '#4b5563'
          }}>
            Premium Nutritional Supplements
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full" style={{
            width: '96px',
            height: '4px',
            background: 'linear-gradient(to right, #2563eb, #9333ea)',
            margin: '0 auto',
            borderRadius: '9999px'
          }}></div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '32px'
        }}>
          {productsData.map((product, index) => (
            <div
              key={product.id}
              data-product-id={product.id}
              className={`group relative overflow-hidden rounded-3xl transition-all duration-1000 transform ${
                visibleProducts.includes(product.id) 
                  ? 'translate-y-0 opacity-100' 
                  : 'translate-y-20 opacity-0'
              } ${
                isDarkMode 
                  ? 'bg-gray-800/50 hover:bg-gray-800/70 border border-gray-700' 
                  : 'bg-white hover:bg-gray-50 border border-gray-200'
              }`}
              style={{
                padding: '0',
                borderRadius: '24px',
                transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
                backgroundColor: isDarkMode ? 'rgba(31, 41, 55, 0.5)' : '#ffffff',
                border: isDarkMode ? '1px solid #374151' : '1px solid #e5e7eb',
                boxShadow: isDarkMode 
                  ? '0 20px 40px rgba(0, 0, 0, 0.3)' 
                  : '0 20px 40px rgba(0, 0, 0, 0.1)',
                animationDelay: `${index * 0.1}s`
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-15px) scale(1.03)';
                e.currentTarget.style.boxShadow = isDarkMode 
                  ? '0 30px 60px rgba(0, 0, 0, 0.4)' 
                  : '0 30px 60px rgba(0, 0, 0, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = isDarkMode 
                  ? '0 20px 40px rgba(0, 0, 0, 0.3)' 
                  : '0 20px 40px rgba(0, 0, 0, 0.1)';
              }}
            >
              {/* Product Image Container */}
              <div className="relative h-64 overflow-hidden" style={{
                position: 'relative',
                height: '256px',
                overflow: 'hidden'
              }}>
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                />
                
                {/* Gradient Overlay */}
                <div 
                  className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent, transparent)',
                    opacity: 0,
                    transition: 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                ></div>

                {/* Product Code Badge */}
                <div 
                  className="absolute top-4 right-4 px-3 py-1 rounded-full text-white text-sm font-bold opacity-0 group-hover:opacity-100 transition-all duration-700"
                  style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    padding: '8px 12px',
                    borderRadius: '9999px',
                    color: '#ffffff',
                    fontSize: '0.875rem',
                    fontWeight: 'bold',
                    backgroundColor: product.bgColor,
                    opacity: 0,
                    transition: 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  {product.code}
                </div>

                {/* Floating Elements */}
                <div 
                  className="absolute -top-4 -right-4 w-16 h-16 rounded-full blur-xl animate-pulse"
                  style={{
                    position: 'absolute',
                    top: '-16px',
                    right: '-16px',
                    width: '64px',
                    height: '64px',
                    backgroundColor: `${product.bgColor}20`,
                    borderRadius: '50%',
                    filter: 'blur(20px)',
                    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                  }}
                ></div>
                <div 
                  className="absolute -bottom-4 -left-4 w-12 h-12 rounded-full blur-xl animate-pulse"
                  style={{ 
                    position: 'absolute',
                    bottom: '-16px',
                    left: '-16px',
                    width: '48px',
                    height: '48px',
                    backgroundColor: `${product.bgColor}30`,
                    borderRadius: '50%',
                    filter: 'blur(16px)',
                    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                    animationDelay: '1s'
                  }}
                ></div>
              </div>

              {/* Product Content */}
              <div className="p-6" style={{ padding: '24px' }}>
                <h3 className={`text-xl font-bold mb-2 transition-colors duration-500 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`} style={{
                  fontSize: '1.25rem',
                  fontWeight: 'bold',
                  marginBottom: '8px',
                  color: isDarkMode ? '#ffffff' : '#111827'
                }}>
                  {product.name}
                </h3>
                
                <p className={`text-sm font-medium mb-3 transition-colors duration-500 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`} style={{
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  marginBottom: '12px',
                  color: isDarkMode ? '#9ca3af' : '#6b7280'
                }}>
                  {product.description}
                </p>

                {/* Product Code */}
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-mono transition-colors duration-500 ${
                    isDarkMode ? 'text-gray-500' : 'text-gray-400'
                  }`} style={{
                    fontSize: '0.75rem',
                    fontFamily: 'monospace',
                    color: isDarkMode ? '#6b7280' : '#9ca3af'
                  }}>
                    {product.code}
                  </span>
                  
                  {/* Color Indicator */}
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      backgroundColor: product.bgColor
                    }}
                  ></div>
                </div>
              </div>

              {/* Hover Effect Overlay */}
              <div 
                className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-all duration-700"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(to bottom right, transparent, transparent, rgba(0,0,0,0.2))',
                  opacity: 0,
                  transition: 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              ></div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Section */}
        {/* <div className="mt-20 text-center" style={{ marginTop: '80px', textAlign: 'center' }}>
          <div className={`inline-block px-12 py-6 rounded-full transition-all duration-700 transform hover:scale-105 ${
            isDarkMode 
              ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 hover:from-blue-500 hover:via-purple-500 hover:to-blue-700 text-white shadow-xl' 
              : 'bg-gradient-to-r from-blue-500 via-purple-500 to-blue-700 hover:from-blue-400 hover:via-purple-400 hover:to-blue-600 text-white shadow-xl'
          }`} style={{
            padding: '24px 48px',
            borderRadius: '9999px',
            background: isDarkMode 
              ? 'linear-gradient(to right, #2563eb, #9333ea, #1e40af)' 
              : 'linear-gradient(to right, #3b82f6, #8b5cf6, #1d4ed8)',
            color: '#ffffff',
            border: 'none',
            cursor: 'pointer',
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: isDarkMode 
              ? '0 15px 40px rgba(59, 130, 246, 0.4), 0 5px 15px rgba(147, 51, 234, 0.3)' 
              : '0 15px 40px rgba(37, 99, 235, 0.4), 0 5px 15px rgba(147, 51, 234, 0.3)'
          }}>
            <span className="text-xl font-bold" style={{
              fontSize: '1.25rem',
              fontWeight: 'bold'
            }}>
              View All Products
            </span>
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default Ourproducts;