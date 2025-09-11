import React, { useRef, useEffect, useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const Ourceritifications = () => {
  const { isDarkMode } = useTheme();
  const sectionRef = useRef(null);
  const [visibleCertifications, setVisibleCertifications] = useState([]);

  const certificationsData = [
    {
      id: 1,
      title: 'ISO 9001:2015',
      subtitle: 'Quality Management System',
      description: 'Our modern production facilities are fully aligned with ISO 9001:2015 quality management standards, enabling us to maintain uniform product quality, complete traceability, and a strong focus on customer satisfaction.',
      image: 'https://www.ajsupplements.com/static/ISO.jpeg',
      icon: '🏆',
      bgColor: '#F59E0B',
      features: ['Quality Management', 'Complete Traceability', 'Customer Satisfaction', 'Uniform Product Quality']
    },
    {
      id: 2,
      title: 'FAMI-QS',
      subtitle: 'Certified Manufacturing',
      description: 'Manufacturing Excellence - Our state-of-the-art production facilities operate in accordance with FAMI-QS standards, ensuring consistent quality, purity and safety in all our nutritional supplements.',
      image: 'https://www.ajsupplements.com/static/fami-qs2.jpeg',
      icon: '⭐',
      bgColor: '#10B981',
      features: ['Manufacturing Excellence', 'Consistent Quality', 'Purity Standards', 'Safety Assurance']
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const certId = parseInt(entry.target.dataset.certId);
            setVisibleCertifications(prev => [...prev, certId]);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      const certifications = sectionRef.current.querySelectorAll('[data-cert-id]');
      certifications.forEach(cert => observer.observe(cert));
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      ref={sectionRef}
      id="certifications" 
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
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-transparent to-green-500/10"></div>
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
            background: 'linear-gradient(45deg, #F59E0B, #10B981, #3B82F6, #F59E0B)',
            backgroundSize: '300% 300%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            animation: 'gradientShift 3s ease infinite'
          }}>
            OUR CERTIFICATIONS
          </h2>
          <p className={`text-lg sm:text-xl md:text-2xl font-medium mb-6 sm:mb-8 transition-all duration-1000 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`} style={{
            fontSize: 'clamp(1.125rem, 3vw, 1.5rem)',
            fontWeight: '500',
            marginBottom: 'clamp(24px, 4vw, 32px)',
            color: isDarkMode ? '#d1d5db' : '#4b5563'
          }}>
            Quality Standards & Manufacturing Excellence
          </p>
          <div className="w-16 sm:w-20 md:w-24 h-1 bg-gradient-to-r from-yellow-600 to-green-600 mx-auto rounded-full" style={{
            width: 'clamp(64px, 8vw, 96px)',
            height: '4px',
            background: 'linear-gradient(to right, #D97706, #059669)',
            margin: '0 auto',
            borderRadius: '9999px'
          }}></div>
        </div>

        {/* Certifications Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 md:gap-16" style={{
          display: 'grid',
          gap: 'clamp(32px, 6vw, 64px)'
        }}>
          {certificationsData.map((certification, index) => (
            <div
              key={certification.id}
              data-cert-id={certification.id}
              className={`group relative overflow-hidden rounded-2xl sm:rounded-3xl transition-all duration-1000 transform ${
                visibleCertifications.includes(certification.id) 
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
                  ? '0 10px 30px rgba(0, 0, 0, 0.2), 0 25px 50px rgba(0, 0, 0, 0.1)' 
                  : '0 10px 30px rgba(0, 0, 0, 0.1), 0 25px 50px rgba(0, 0, 0, 0.05)',
                animationDelay: `${index * 0.3}s`
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
                    ? '0 10px 30px rgba(0, 0, 0, 0.2), 0 25px 50px rgba(0, 0, 0, 0.1)' 
                    : '0 10px 30px rgba(0, 0, 0, 0.1), 0 25px 50px rgba(0, 0, 0, 0.05)';
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
                  src={certification.image}
                  alt={certification.title}
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
                <div 
                  className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent, transparent)',
                    opacity: 0,
                    transition: 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                ></div>

                {/* Icon Overlay */}
                <div 
                  className="absolute top-6 right-6 w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-700"
                  style={{
                    position: 'absolute',
                    top: '24px',
                    right: '24px',
                    width: '80px',
                    height: '80px',
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(12px)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0,
                    transition: 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  <span className="text-4xl" style={{ fontSize: '2.25rem' }}>
                    {certification.icon}
                  </span>
                </div>

                {/* Certification Badge */}
                <div 
                  className="absolute bottom-6 left-6 px-4 py-2 rounded-full text-white text-sm font-bold opacity-0 group-hover:opacity-100 transition-all duration-700"
                  style={{
                    position: 'absolute',
                    bottom: '24px',
                    left: '24px',
                    padding: '8px 16px',
                    borderRadius: '9999px',
                    color: '#ffffff',
                    fontSize: '0.875rem',
                    fontWeight: 'bold',
                    backgroundColor: certification.bgColor,
                    opacity: 0,
                    transition: 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  CERTIFIED
                </div>

                {/* Floating Elements */}
                <div 
                  className="absolute -top-4 -right-4 w-20 h-20 rounded-full blur-xl animate-pulse"
                  style={{
                    position: 'absolute',
                    top: '-16px',
                    right: '-16px',
                    width: '80px',
                    height: '80px',
                    backgroundColor: `${certification.bgColor}20`,
                    borderRadius: '50%',
                    filter: 'blur(24px)',
                    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                  }}
                ></div>
                <div 
                  className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full blur-xl animate-pulse"
                  style={{ 
                    position: 'absolute',
                    bottom: '-16px',
                    left: '-16px',
                    width: '64px',
                    height: '64px',
                    backgroundColor: `${certification.bgColor}30`,
                    borderRadius: '50%',
                    filter: 'blur(20px)',
                    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                    animationDelay: '1s'
                  }}
                ></div>
              </div>

              {/* Content */}
              <div className="p-8" style={{ padding: '32px' }}>
                <h3 className={`text-3xl font-bold mb-3 transition-colors duration-500 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`} style={{
                  fontSize: '1.875rem',
                  fontWeight: 'bold',
                  marginBottom: '12px',
                  color: isDarkMode ? '#ffffff' : '#111827'
                }}>
                  {certification.title}
                </h3>
                
                <p className={`text-lg font-semibold mb-4 transition-colors duration-500 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`} style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  marginBottom: '16px',
                  color: isDarkMode ? '#d1d5db' : '#4b5563'
                }}>
                  {certification.subtitle}
                </p>
                
                <p className={`text-base leading-relaxed mb-6 transition-colors duration-500 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`} style={{
                  fontSize: '1rem',
                  lineHeight: '1.75',
                  marginBottom: '24px',
                  color: isDarkMode ? '#9ca3af' : '#4b5563'
                }}>
                  {certification.description}
                </p>

                {/* Features List */}
                <div className="grid grid-cols-2 gap-3" style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '12px'
                }}>
                  {certification.features.map((feature, featureIndex) => (
                    <div
                      key={featureIndex}
                      className={`flex items-center space-x-2 p-3 rounded-lg transition-all duration-500 ${
                        isDarkMode 
                          ? 'bg-gray-700/50 hover:bg-gray-700/70' 
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '12px',
                        borderRadius: '8px',
                        backgroundColor: isDarkMode ? 'rgba(55, 65, 81, 0.5)' : '#f3f4f6',
                        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = isDarkMode ? 'rgba(55, 65, 81, 0.7)' : '#e5e7eb';
                        e.target.style.transform = 'translateX(4px)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = isDarkMode ? 'rgba(55, 65, 81, 0.5)' : '#f3f4f6';
                        e.target.style.transform = 'translateX(0)';
                      }}
                    >
                      <div 
                        className="w-2 h-2 rounded-full"
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: certification.bgColor
                        }}
                      ></div>
                      <span className={`text-sm font-medium transition-colors duration-500 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`} style={{
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        color: isDarkMode ? '#d1d5db' : '#374151'
                      }}>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hover Effect Overlay */}
              <div 
                className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/10 opacity-0 group-hover:opacity-100 transition-all duration-700"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(to bottom right, transparent, transparent, rgba(0,0,0,0.1))',
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
              ? 'bg-gradient-to-r from-yellow-600 via-green-600 to-yellow-800 hover:from-yellow-500 hover:via-green-500 hover:to-yellow-700 text-white shadow-xl' 
              : 'bg-gradient-to-r from-yellow-500 via-green-500 to-yellow-700 hover:from-yellow-400 hover:via-green-400 hover:to-yellow-600 text-white shadow-xl'
          }`} style={{
            padding: '24px 48px',
            borderRadius: '9999px',
            background: isDarkMode 
              ? 'linear-gradient(to right, #D97706, #059669, #B45309)' 
              : 'linear-gradient(to right, #EAB308, #10B981, #D97706)',
            color: '#ffffff',
            border: 'none',
            cursor: 'pointer',
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: isDarkMode 
              ? '0 15px 40px rgba(245, 158, 11, 0.4), 0 5px 15px rgba(16, 185, 129, 0.3)' 
              : '0 15px 40px rgba(234, 179, 8, 0.4), 0 5px 15px rgba(16, 185, 129, 0.3)'
          }}>
            <span className="text-xl font-bold" style={{
              fontSize: '1.25rem',
              fontWeight: 'bold'
            }}>
              Learn More About Our Standards
            </span>
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default Ourceritifications;