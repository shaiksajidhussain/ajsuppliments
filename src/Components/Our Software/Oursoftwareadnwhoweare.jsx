import React, { useRef, useEffect, useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { PiGreaterThan } from "react-icons/pi";


const Oursoftwareadnwhoweare = () => {
  const { isDarkMode } = useTheme();
  const sectionRef = useRef(null);
  const [visibleSections, setVisibleSections] = useState([]);
  const [typingText, setTypingText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const whoWeAreText = "Located in Hyderabad, Telangana, India, and driven by a strong dedication to excellence, innovation and sustainability, AJ Supplements delivers specialized nutritional solutions that enhance feed efficiency, metabolic function and immune support in animals.";

  const softwareFeatures = [
    {
      icon: '🧬',
      title: 'Species-Specific Nutrition',
      description: 'Tailored diets for poultry, ruminants, swine, and aquaculture'
    },
    {
      icon: '⚡',
      title: 'Real-Time Formulation',
      description: 'Instant formulation capabilities with live updates'
    },
    {
      icon: '📊',
      title: 'Data Analytics',
      description: 'Backed by advanced analytics for smarter decisions'
    },
    {
      icon: '🔬',
      title: 'Expert Collaboration',
      description: 'Developed with veterinarians & nutrition experts'
    },
    {
      icon: '🌱',
      title: 'Sustainable Production',
      description: 'Supports sustainable livestock production practices'
    },
    {
      icon: '🎯',
      title: 'Precision Feeding',
      description: 'Revolutionary precision feeding across multiple species'
    }
  ];

  // Typing animation effect
  useEffect(() => {
    if (visibleSections.includes('who-we-are')) {
      setIsTyping(true);
      let currentIndex = 0;
      const typingInterval = setInterval(() => {
        if (currentIndex <= whoWeAreText.length) {
          setTypingText(whoWeAreText.slice(0, currentIndex));
          currentIndex++;
        } else {
          setIsTyping(false);
          clearInterval(typingInterval);
        }
      }, 30);

      return () => clearInterval(typingInterval);
    }
  }, [visibleSections]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.dataset.sectionId;
            setVisibleSections(prev => [...prev, sectionId]);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      const sections = sectionRef.current.querySelectorAll('[data-section-id]');
      sections.forEach(section => observer.observe(section));
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      ref={sectionRef}
      id="software" 
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
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-cyan-500/10"></div>
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
        {/* Our Software Section */}
        <div 
          data-section-id="our-software"
          className={`mb-32 transition-all duration-1000 ${
            visibleSections.includes('our-software') 
              ? 'translate-y-0 opacity-100' 
              : 'translate-y-20 opacity-0'
          }`}
        >
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
              background: 'linear-gradient(45deg, #8B5CF6, #06B6D4, #3B82F6, #8B5CF6)',
              backgroundSize: '300% 300%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              animation: 'gradientShift 3s ease infinite'
            }}>
              OUR SOFTWARE
            </h2>
            <p className={`text-lg sm:text-xl md:text-2xl font-medium mb-6 sm:mb-8 transition-all duration-1000 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`} style={{
              fontSize: 'clamp(1.125rem, 3vw, 1.5rem)',
              fontWeight: '500',
              marginBottom: 'clamp(24px, 4vw, 32px)',
              color: isDarkMode ? '#d1d5db' : '#4b5563'
            }}>
              Feed Supplement Software
            </p>
            <div className="w-16 sm:w-20 md:w-24 h-1 bg-gradient-to-r from-purple-600 to-cyan-600 mx-auto rounded-full" style={{
              width: 'clamp(64px, 8vw, 96px)',
              height: '4px',
              background: 'linear-gradient(to right, #9333ea, #0891b2)',
              margin: '0 auto',
              borderRadius: '9999px'
            }}></div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 md:gap-16 items-center" style={{
            display: 'grid',
            gap: 'clamp(32px, 6vw, 64px)',
            alignItems: 'center'
          }}>
            {/* Left Side - Description */}
            <div className="space-y-6 sm:space-y-8" style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'clamp(24px, 4vw, 32px)'
            }}>
              <div className={`p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl ${
                isDarkMode 
                  ? 'bg-gray-800/50 border border-gray-700' 
                  : 'bg-gray-50 border border-gray-200'
              }`} style={{
                padding: 'clamp(16px, 3vw, 32px)',
                borderRadius: 'clamp(16px, 2vw, 24px)',
                backgroundColor: isDarkMode ? 'rgba(31, 41, 55, 0.5)' : '#f9fafb',
                border: isDarkMode ? '1px solid #374151' : '1px solid #e5e7eb',
                boxShadow: isDarkMode 
                  ? '0 10px 30px rgba(0, 0, 0, 0.2), 0 20px 40px rgba(0, 0, 0, 0.1)' 
                  : '0 10px 30px rgba(0, 0, 0, 0.1), 0 20px 40px rgba(0, 0, 0, 0.05)'
              }}>
                <h3 className={`text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 transition-colors duration-500 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`} style={{
                  fontSize: 'clamp(1.25rem, 3vw, 1.875rem)',
                  fontWeight: 'bold',
                  marginBottom: 'clamp(16px, 3vw, 24px)',
                  color: isDarkMode ? '#ffffff' : '#111827'
                }}>
                  Innovative Feed Formulation Software
                </h3>
                
                <p className={`text-base sm:text-lg leading-relaxed mb-4 sm:mb-6 transition-colors duration-500 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`} style={{
                  fontSize: 'clamp(1rem, 2.5vw, 1.125rem)',
                  lineHeight: '1.75',
                  marginBottom: 'clamp(16px, 3vw, 24px)',
                  color: isDarkMode ? '#d1d5db' : '#374151'
                }}>
                  Developed in collaboration with <span className="font-bold text-purple-600" style={{ fontWeight: 'bold', color: '#9333ea' }}>Project Genie</span>, our innovative Feed Formulation Software aims to revolutionize precision feeding across multiple animal species. This cutting-edge solution ensures accurate addition of feed ingredients based on species-specific nutritional requirements.
                </p>

                <p className={`text-base sm:text-lg leading-relaxed mb-6 sm:mb-8 transition-colors duration-500 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`} style={{
                  fontSize: 'clamp(1rem, 2.5vw, 1.125rem)',
                  lineHeight: '1.75',
                  marginBottom: 'clamp(24px, 4vw, 32px)',
                  color: isDarkMode ? '#d1d5db' : '#374151'
                }}>
                  The software enables tailored diets for poultry, ruminants, swine, and aquaculture, featuring real-time formulation capabilities, built-in nutrient libraries, and smart integration with feed production systems. This enhances feed efficiency, reduces waste, and supports sustainable livestock production.
                </p>

                <div className={`p-4 sm:p-6 rounded-xl sm:rounded-2xl ${
                  isDarkMode 
                    ? 'bg-purple-900/20 border border-purple-700' 
                    : 'bg-purple-50 border border-purple-200'
                }`} style={{
                  padding: 'clamp(16px, 3vw, 24px)',
                  borderRadius: 'clamp(12px, 2vw, 16px)',
                  backgroundColor: isDarkMode ? 'rgba(147, 51, 234, 0.1)' : '#faf5ff',
                  border: isDarkMode ? '1px solid #7c3aed' : '1px solid #c4b5fd'
                }}>
                  <h4 className={`text-lg sm:text-xl font-bold mb-3 sm:mb-4 transition-colors duration-500 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`} style={{
                    fontSize: 'clamp(1.125rem, 2.5vw, 1.25rem)',
                    fontWeight: 'bold',
                    marginBottom: 'clamp(12px, 2vw, 16px)',
                    color: isDarkMode ? '#ffffff' : '#111827'
                  }}>
                    Why Choose Us?
                  </h4>
                  <div className="space-y-3" style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}>
                    {[
                      'Developed with veterinarians & nutrition experts',
                      'Backed by data analytics for smarter decisions'
                    ].map((item, index) => (
                      <div key={index} className="flex items-center space-x-3" style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                      }}>
                        <span className="text-red-500 text-xl font-bold" style={{
                          color: '#ef4444',
                          fontSize: '1.25rem',
                          fontWeight: 'bold'
                        }}><PiGreaterThan /></span>
                        <span className={`text-base transition-colors duration-500 ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-700'
                        }`} style={{
                          fontSize: '1rem',
                          color: isDarkMode ? '#d1d5db' : '#374151'
                        }}>
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6" style={{
              display: 'grid',
              gap: 'clamp(16px, 3vw, 24px)'
            }}>
              {softwareFeatures.map((feature, index) => (
                <div
                  key={index}
                  className={`group p-4 sm:p-6 rounded-xl sm:rounded-2xl transition-all duration-700 transform hover:scale-105 ${
                    isDarkMode 
                      ? 'bg-gray-800/50 hover:bg-gray-800/70 border border-gray-700' 
                      : 'bg-white hover:bg-gray-50 border border-gray-200'
                  }`}
                  style={{
                    padding: 'clamp(16px, 3vw, 24px)',
                    borderRadius: 'clamp(12px, 2vw, 16px)',
                    transition: 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
                    cursor: 'pointer',
                    backgroundColor: isDarkMode ? 'rgba(31, 41, 55, 0.5)' : '#ffffff',
                    border: isDarkMode ? '1px solid #374151' : '1px solid #e5e7eb',
                    boxShadow: isDarkMode 
                      ? '0 5px 15px rgba(0, 0, 0, 0.1), 0 10px 25px rgba(0, 0, 0, 0.05)' 
                      : '0 5px 15px rgba(0, 0, 0, 0.05), 0 10px 25px rgba(0, 0, 0, 0.02)',
                    animationDelay: `${index * 0.1}s`
                  }}
                  onMouseEnter={(e) => {
                    if (window.innerWidth > 768) { // Only apply hover effects on desktop
                      e.currentTarget.style.transform = 'scale(1.05) translateY(-5px)';
                      e.currentTarget.style.boxShadow = isDarkMode 
                        ? '0 20px 40px rgba(0, 0, 0, 0.3)' 
                        : '0 20px 40px rgba(0, 0, 0, 0.15)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (window.innerWidth > 768) { // Only apply hover effects on desktop
                      e.currentTarget.style.transform = 'scale(1) translateY(0)';
                      e.currentTarget.style.boxShadow = isDarkMode 
                        ? '0 5px 15px rgba(0, 0, 0, 0.1), 0 10px 25px rgba(0, 0, 0, 0.05)' 
                        : '0 5px 15px rgba(0, 0, 0, 0.05), 0 10px 25px rgba(0, 0, 0, 0.02)';
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
                  <div className="text-3xl sm:text-4xl mb-3 sm:mb-4" style={{
                    fontSize: 'clamp(1.875rem, 4vw, 2.25rem)',
                    marginBottom: 'clamp(12px, 2vw, 16px)'
                  }}>{feature.icon}</div>
                  <h4 className={`text-base sm:text-lg font-bold mb-2 transition-colors duration-500 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`} style={{
                    fontSize: 'clamp(1rem, 2.5vw, 1.125rem)',
                    fontWeight: 'bold',
                    marginBottom: 'clamp(8px, 1.5vw, 8px)',
                    color: isDarkMode ? '#ffffff' : '#111827'
                  }}>
                    {feature.title}
                  </h4>
                  <p className={`text-xs sm:text-sm transition-colors duration-500 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`} style={{
                    fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                    color: isDarkMode ? '#9ca3af' : '#4b5563',
                    margin: 0
                  }}>
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Who We Are Section */}
        <div 
          data-section-id="who-we-are"
          className={`transition-all duration-1000 ${
            visibleSections.includes('who-we-are') 
              ? 'translate-y-0 opacity-100' 
              : 'translate-y-20 opacity-0'
          }`}
        >
          {/* Section Header */}
          <div className="text-center mt-16" style={{
            textAlign: 'center',
            marginTop: '64px'
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
            Who We Are
          </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-orange-600 to-red-600 mx-auto rounded-full" style={{
              width: '96px',
              height: '4px',
              marginTop: '16px',
              background: 'linear-gradient(to right, #EA580C, #DC2626)',
              margin: '0 auto',
              borderRadius: '9999px'
            }}></div>
          </div>

          {/* Typing Animation Container */}
          <div className={`max-w-4xl mx-auto p-12 rounded-3xl ${
            isDarkMode 
              ? 'bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700' 
              : 'bg-gradient-to-br from-gray-50 to-white border border-gray-200'
          }`} style={{
            maxWidth: '896px',
            marginTop: '70px',
            margin: '0 auto',
            padding: '48px',
            borderRadius: '24px',
            background: isDarkMode 
              ? 'linear-gradient(to bottom right, rgba(31, 41, 55, 0.5), rgba(17, 24, 39, 0.5))' 
              : 'linear-gradient(to bottom right, #f9fafb, #ffffff)',
            border: isDarkMode ? '1px solid #374151' : '1px solid #e5e7eb',
            boxShadow: isDarkMode 
              ? '0 25px 50px rgba(0, 0, 0, 0.3)' 
              : '0 25px 50px rgba(0, 0, 0, 0.1)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-orange-500/20 rounded-full blur-xl animate-pulse" style={{
              position: 'absolute',
              top: '-16px',
              right: '-16px',
              width: '80px',
              height: '80px',
              backgroundColor: 'rgba(245, 158, 11, 0.2)',
              borderRadius: '50%',
              filter: 'blur(24px)',
              animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
            }}></div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-red-500/20 rounded-full blur-xl animate-pulse" style={{
              position: 'absolute',
              bottom: '-16px',
              left: '-16px',
              width: '64px',
              height: '64px',
              backgroundColor: 'rgba(239, 68, 68, 0.2)',
              borderRadius: '50%',
              filter: 'blur(20px)',
              animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
              animationDelay: '1s'
            }}></div>

            <div className="relative z-10" style={{ position: 'relative', zIndex: 10 }}>
              <p className={`text-xl leading-relaxed transition-colors duration-500 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`} style={{
                fontSize: '1.25rem',
                lineHeight: '1.75',
                color: isDarkMode ? '#d1d5db' : '#374151',
                margin: 0,
                minHeight: '120px'
              }}>
                {typingText}
                {isTyping && (
                  <span className="animate-pulse" style={{
                    animation: 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                  }}>|</span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Oursoftwareadnwhoweare;