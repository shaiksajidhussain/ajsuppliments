import React, { useRef, useEffect, useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const OurExpertise = () => {
  const { isDarkMode } = useTheme();
  const sectionRef = useRef(null);
  const [visibleCards, setVisibleCards] = useState([]);

  const expertiseData = [
    {
      id: 1,    
      title: 'Feed-Grade Trace Minerals',
      description: 'Specialized in Feed-Grade Trace Minerals & Premixes - Providing organic and inorganic mineral supplements along with mineral and vitamin premixes tailored to meet the specific nutritional requirements of cattle and poultry.',
      image: 'https://www.ajsupplements.com/static/feed_grade_min.webp',
      icon: '🧪',
      features: ['Organic & Inorganic Minerals', 'Custom Formulations', 'Species-Specific Nutrition', 'Quality Assurance']
    },
    {
      id: 2,
      title: 'Precision Formulations',
      description: 'Scientifically developed trace minerals and vitamin premixes designed to meet species-specific dietary needs, fully compliant with global feed safety regulations.',
      image: 'https://www.ajsupplements.com/static/presicion.jpg',
      icon: '🔬',
      features: ['Scientific Research', 'Global Compliance', 'Advanced Technology', 'Precision Testing']
    },
    {
      id: 3,
      title: 'Client-Centric Approach',
      description: 'We offer custom formulations, efficient supply chain management and technical support to meet the unique nutritional goals of our clients across the livestock and poultry industry.',
      image: 'https://www.ajsupplements.com/static/customer_centric.webp',
      icon: '🤝',
      features: ['Custom Solutions', 'Supply Chain Management', 'Technical Support', 'Client Success']
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cardId = parseInt(entry.target.dataset.cardId);
            setVisibleCards(prev => [...prev, cardId]);
          }
        });
      },
      { 
        threshold: window.innerWidth < 768 ? 0.1 : 0.2, // Lower threshold for mobile
        rootMargin: window.innerWidth < 768 ? '50px' : '0px' // Earlier trigger for mobile
      }
    );

    if (sectionRef.current) {
      const cards = sectionRef.current.querySelectorAll('[data-card-id]');
      cards.forEach(card => observer.observe(card));
    }

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style jsx>{`
        @media (max-width: 640px) {
          .expertise-card {
            margin-bottom: 1rem;
          }
          .expertise-card:hover {
            transform: none !important;
          }
        }
        @media (max-width: 768px) {
          .expertise-grid {
            grid-template-columns: 1fr !important;
            gap: 1.5rem !important;
          }
        }
        @media (min-width: 769px) and (max-width: 1024px) {
          .expertise-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (min-width: 1025px) {
          .expertise-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        /* Ensure 3 columns on large screens */
        @media (min-width: 1024px) {
          .expertise-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }

        /* Mobile-specific improvements */
        @media (max-width: 768px) {
          .expertise-grid {
            padding: 0 8px;
            margin: 0 -8px;
          }
          
          .expertise-card {
            margin-bottom: 16px;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1) !important;
          }
          
          .expertise-card:hover {
            transform: none !important;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1) !important;
          }
          
          .expertise-card:active {
            transform: scale(0.98) !important;
            transition: transform 0.1s ease !important;
          }
        }

        @media (max-width: 480px) {
          .expertise-grid {
            gap: 16px;
            padding: 0 4px;
            margin: 0 -4px;
          }
        }
      `}</style>
      <section 
        ref={sectionRef}
        id="expertise" 
        className={`min-h-screen py-8 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden ${
          isDarkMode ? 'bg-gray-900' : 'bg-white'
        }`}
        style={{
          minHeight: '100vh',
          padding: '32px 16px',
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
        <div className="text-center mb-12 sm:mb-16 md:mb-20" style={{
          textAlign: 'center',
          marginBottom: '48px'
        }}>
          <h2 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 transition-all duration-1000 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`} style={{
            fontSize: 'clamp(1.875rem, 5vw, 4rem)',
            fontWeight: 'bold',
            marginBottom: 'clamp(16px, 3vw, 24px)',
            color: isDarkMode ? '#ffffff' : '#111827',
            textShadow: isDarkMode 
              ? '0 4px 20px rgba(0,0,0,0.5)' 
              : '0 4px 20px rgba(0,0,0,0.1)',
            background: 'linear-gradient(45deg, #3B82F6, #8B5CF6, #06B6D4, #3B82F6)',
            backgroundSize: '300% 300%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            animation: 'gradientShift 3s ease infinite'
          }}>
            OUR EXPERTISE
          </h2>
          <p className={`text-lg sm:text-xl md:text-2xl font-medium mb-6 sm:mb-8 transition-all duration-1000 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`} style={{
            fontSize: 'clamp(1.125rem, 3vw, 1.5rem)',
            fontWeight: '500',
            marginBottom: 'clamp(24px, 4vw, 32px)',
            color: isDarkMode ? '#d1d5db' : '#4b5563'
          }}>
            What we offer
          </p>
          <div className="w-16 sm:w-20 md:w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full" style={{
            width: 'clamp(64px, 8vw, 96px)',
            height: '4px',
            background: 'linear-gradient(to right, #2563eb, #9333ea)',
            margin: '0 auto',
            borderRadius: '9999px'
          }}></div>
        </div>

        {/* Expertise Cards */}
        <div className="expertise-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10 lg:gap-12" style={{
          display: 'grid',
          gap: 'clamp(24px, 4vw, 48px)',
          width: '100%',
          maxWidth: '100%'
        }}>
          {expertiseData.map((expertise, index) => (
            <div
              key={expertise.id}
              data-card-id={expertise.id}
              className={`expertise-card group relative overflow-hidden rounded-2xl sm:rounded-3xl transition-all duration-1000 transform ${
                visibleCards.includes(expertise.id) 
                  ? 'translate-y-0 opacity-100' 
                  : 'translate-y-20 opacity-0'
              } ${
                isDarkMode 
                  ? 'bg-gray-800/50 hover:bg-gray-800/70 border border-gray-700' 
                  : 'bg-white hover:bg-gray-50 border border-gray-200'
              }`}
              style={{
                padding: '0',
                borderRadius: 'clamp(16px, 2vw, 24px)',
                transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
                backgroundColor: isDarkMode ? 'rgba(31, 41, 55, 0.5)' : '#ffffff',
                border: isDarkMode ? '1px solid #374151' : '1px solid #e5e7eb',
                boxShadow: isDarkMode 
                  ? '0 10px 30px rgba(0, 0, 0, 0.2), 0 20px 40px rgba(0, 0, 0, 0.1)' 
                  : '0 10px 30px rgba(0, 0, 0, 0.1), 0 20px 40px rgba(0, 0, 0, 0.05)',
                animationDelay: `${index * 0.2}s`
              }}
              onMouseEnter={(e) => {
                if (window.innerWidth > 768) { // Only apply hover effects on desktop
                  e.currentTarget.style.transform = 'translateY(-20px) scale(1.02)';
                  e.currentTarget.style.boxShadow = isDarkMode 
                    ? '0 40px 80px rgba(0, 0, 0, 0.4)' 
                    : '0 40px 80px rgba(0, 0, 0, 0.2)';
                }
              }}
              onMouseLeave={(e) => {
                if (window.innerWidth > 768) { // Only apply hover effects on desktop
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = isDarkMode 
                    ? '0 10px 30px rgba(0, 0, 0, 0.2), 0 20px 40px rgba(0, 0, 0, 0.1)' 
                    : '0 10px 30px rgba(0, 0, 0, 0.1), 0 20px 40px rgba(0, 0, 0, 0.05)';
                }
              }}
              onTouchStart={(e) => {
                // Add subtle touch feedback for mobile
                if (window.innerWidth <= 768) {
                  e.currentTarget.style.transform = 'scale(0.98)';
                  e.currentTarget.style.transition = 'transform 0.1s ease';
                }
              }}
              onTouchEnd={(e) => {
                // Reset touch feedback for mobile
                if (window.innerWidth <= 768) {
                  e.currentTarget.style.transform = 'scale(1)';
                }
              }}
            >
              {/* Image Container */}
              <div className="relative h-48 sm:h-56 md:h-64 lg:h-80 overflow-hidden" style={{
                position: 'relative',
                height: 'clamp(192px, 25vw, 320px)',
                overflow: 'hidden'
              }}>
                <img
                  src={expertise.image}
                  alt={expertise.title}
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                  loading="lazy"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700" style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent, transparent)',
                  opacity: 0,
                  transition: 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)'
                }}></div>

                {/* Icon Overlay */}
                <div className="absolute top-4 right-4 sm:top-6 sm:right-6 w-12 h-12 sm:w-16 sm:h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-700" style={{
                  position: 'absolute',
                  top: 'clamp(16px, 2vw, 24px)',
                  right: 'clamp(16px, 2vw, 24px)',
                  width: 'clamp(48px, 6vw, 64px)',
                  height: 'clamp(48px, 6vw, 64px)',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(12px)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 0,
                  transition: 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)'
                }}>
                  <span className="text-2xl sm:text-3xl" style={{ fontSize: 'clamp(1.5rem, 3vw, 1.875rem)' }}>
                    {expertise.icon}
                  </span>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 w-12 h-12 sm:w-20 sm:h-20 bg-blue-500/20 rounded-full blur-xl animate-pulse" style={{
                  position: 'absolute',
                  top: 'clamp(-8px, -1vw, -16px)',
                  right: 'clamp(-8px, -1vw, -16px)',
                  width: 'clamp(48px, 8vw, 80px)',
                  height: 'clamp(48px, 8vw, 80px)',
                  backgroundColor: 'rgba(59, 130, 246, 0.2)',
                  borderRadius: '50%',
                  filter: 'blur(24px)',
                  animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                }}></div>
                <div className="absolute -bottom-2 -left-2 sm:-bottom-4 sm:-left-4 w-10 h-10 sm:w-16 sm:h-16 bg-purple-500/20 rounded-full blur-xl animate-pulse" style={{ 
                  position: 'absolute',
                  bottom: 'clamp(-8px, -1vw, -16px)',
                  left: 'clamp(-8px, -1vw, -16px)',
                  width: 'clamp(40px, 6vw, 64px)',
                  height: 'clamp(40px, 6vw, 64px)',
                  backgroundColor: 'rgba(147, 51, 234, 0.2)',
                  borderRadius: '50%',
                  filter: 'blur(24px)',
                  animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                  animationDelay: '1s'
                }}></div>
              </div>

              {/* Content */}
              <div className="p-4 sm:p-6 md:p-8" style={{ padding: 'clamp(16px, 3vw, 32px)' }}>
                <h3 className={`text-xl sm:text-2xl font-bold mb-3 sm:mb-4 transition-colors duration-500 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`} style={{
                  fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
                  fontWeight: 'bold',
                  marginBottom: 'clamp(12px, 2vw, 16px)',
                  color: isDarkMode ? '#ffffff' : '#111827'
                }}>
                  {expertise.title}
                </h3>
                
                <p className={`text-base sm:text-lg leading-relaxed mb-4 sm:mb-6 transition-colors duration-500 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`} style={{
                  fontSize: 'clamp(1rem, 2.5vw, 1.125rem)',
                  lineHeight: '1.75',
                  marginBottom: 'clamp(16px, 3vw, 24px)',
                  color: isDarkMode ? '#d1d5db' : '#4b5563'
                }}>
                  {expertise.description}
                </p>

                {/* Features List */}
                <div className="space-y-2 sm:space-y-3" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(8px, 1.5vw, 12px)' }}>
                  {expertise.features.map((feature, featureIndex) => (
                    <div 
                      key={featureIndex}
                      className="flex items-center space-x-2 sm:space-x-3" 
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'clamp(8px, 1.5vw, 12px)'
                      }}
                    >
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" style={{
                        width: 'clamp(6px, 1vw, 8px)',
                        height: 'clamp(6px, 1vw, 8px)',
                        background: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
                        borderRadius: '50%'
                      }}></div>
                      <span className={`text-xs sm:text-sm font-medium transition-colors duration-500 ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`} style={{
                        fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                        fontWeight: '500',
                        color: isDarkMode ? '#9ca3af' : '#6b7280'
                      }}>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Section
        <div className="mt-20 text-center" style={{ marginTop: '80px', textAlign: 'center' }}>
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
              Discover Our Solutions
            </span>
          </div>
        </div> */}
      </div>
    </section>
    </>
  );
};

export default OurExpertise;