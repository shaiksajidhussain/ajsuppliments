import React, { useRef, useEffect, useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

// Image Carousel Component
const ImageCarousel = () => {
  const { isDarkMode } = useTheme();
  const [currentImage, setCurrentImage] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const images = [
    {
      src: 'https://www.unirayvet.com/public/Products/nlqFImGpeQKmH78arC0y2b6KZlGk1QhytRC0fP0t.jpg',
      title: 'Premium Livestock',
      description: 'Healthy animals, better nutrition',
      alt: 'Cattle grazing in field at sunset'
    },
    {
      src: 'https://images.stockcake.com/public/6/4/5/64560fa9-d2e9-412f-b500-a9e983706a8e_large/cows-at-sunset-stockcake.jpg',
      title: 'Sunset Grazing',
      description: 'Natural feeding, optimal health',
      alt: 'Cows grazing at sunset'
    },
    {
      src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjmJJHEINadHqe-WNGX6mznxf9ikiBVM64OQ&s',
      title: 'Farm Excellence',
      description: 'Quality care, superior results',
      alt: 'Farm animals in natural environment'
    },
    {
      src: 'https://t4.ftcdn.net/jpg/15/09/41/07/360_F_1509410729_vkwbNtFS3ZK4m6fBwheWlxdGNWSyrip4.jpg',
      title: 'Free Range Poultry',
      description: 'Happy birds, quality eggs',
      alt: 'Free range chickens at sunset'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [images.length]);

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div 
      className="relative w-full h-full group"
      style={{
        position: 'relative',
        width: '100%',
        height: '100%'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Image */}
      <div className="relative w-full h-full overflow-hidden" style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden'
      }}>
        <img
          src={images[currentImage].src}
          alt={images[currentImage].alt}
          className="w-full h-full object-cover transition-all duration-1000 ease-in-out"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
            filter: isHovered ? 'brightness(1.1) contrast(1.1)' : 'brightness(1) contrast(1)'
          }}
        />
        
        {/* Gradient Overlay */}
        <div 
          className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-all duration-700"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent, transparent)',
            opacity: isHovered ? 1 : 0.7,
            transition: 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        />
        
        {/* Text Overlay */}
        <div 
          className="absolute bottom-6 left-6 text-white transition-all duration-700"
          style={{
            position: 'absolute',
            bottom: '24px',
            left: '24px',
            color: '#ffffff',
            opacity: isHovered ? 1 : 0.9,
            transform: isHovered ? 'translateY(0)' : 'translateY(10px)',
            transition: 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          <h3 className="text-2xl font-bold mb-2" style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            margin: 0,
            marginBottom: '8px',
            textShadow: '0 2px 10px rgba(0,0,0,0.8)'
          }}>
            {images[currentImage].title}
          </h3>
          <p className="text-lg" style={{
            fontSize: '1.125rem',
            margin: 0,
            textShadow: '0 2px 10px rgba(0,0,0,0.8)'
          }}>
            {images[currentImage].description}
          </p>
        </div>
      </div>


      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2" style={{
        position: 'absolute',
        bottom: '16px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '8px'
      }}>
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImage(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentImage ? 'bg-white' : 'bg-white/50'
            }`}
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: index === currentImage ? '#ffffff' : 'rgba(255, 255, 255, 0.5)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#ffffff';
              e.target.style.transform = 'scale(1.2)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = index === currentImage ? '#ffffff' : 'rgba(255, 255, 255, 0.5)';
              e.target.style.transform = 'scale(1)';
            }}
          />
        ))}
      </div>
    </div>
  );
};

const About = () => {
  const { isDarkMode } = useTheme();
  const sectionRef = useRef(null);
  const textRef = useRef(null);
  const imageRef = useRef(null);
  const certRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fadeInUp');
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    if (textRef.current) observer.observe(textRef.current);
    if (imageRef.current) observer.observe(imageRef.current);
    if (certRef.current) observer.observe(certRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      ref={sectionRef}
      id="about" 
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
            ABOUT
          </h2>
          <div className="w-16 sm:w-20 md:w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full" style={{
            width: 'clamp(64px, 8vw, 96px)',
            height: '4px',
            background: 'linear-gradient(to right, #2563eb, #9333ea)',
            margin: '0 auto',
            borderRadius: '9999px'
          }}></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 md:gap-16 items-center" style={{
          display: 'grid',
          gap: 'clamp(32px, 6vw, 64px)',
          alignItems: 'center'
        }}>
          {/* Left Side - Content */}
          <div ref={textRef} className="space-y-6 sm:space-y-8" style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'clamp(24px, 4vw, 32px)'
          }}>
            {/* Main Description */}
            <div className="space-y-4 sm:space-y-6" style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'clamp(16px, 3vw, 24px)'
            }}>
              <p className={`text-base sm:text-lg md:text-xl leading-relaxed transition-all duration-1000 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`} style={{
                fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
                lineHeight: '1.75',
                color: isDarkMode ? '#d1d5db' : '#374151',
                margin: 0
              }}>
                <span style={{
                  fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
                  fontWeight: 'bold',
                  color: '#2563eb'
                }}>AJ Supplements</span> is a leading manufacturer, supplier and distributor specializing in the preparation of feed-grade inorganic and organic mineral salts, as well as customize mineral and vitamin premixes for livestock and poultry nutrition.
              </p>
              
              <p className={`text-base sm:text-lg md:text-xl leading-relaxed transition-all duration-1000 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`} style={{
                fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
                lineHeight: '1.75',
                color: isDarkMode ? '#d1d5db' : '#374151',
                margin: 0
              }}>
                As a manufacturer and supplier, we provide carefully formulated, high-quality trace minerals and vitamin premixes that support optimal growth performance, productivity and long-term animal health. We also employ innovative packaging technologies to ensure product stability and integrity, enabling safe and contamination-free transportation across domestic and international markets.
              </p>
            </div>

            {/* Key Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-8 sm:mt-12" style={{
              display: 'grid',
              gap: 'clamp(16px, 3vw, 24px)',
              marginTop: 'clamp(32px, 6vw, 48px)'
            }}>
              {[
                { icon: '🏭', title: 'Manufacturing Excellence', desc: 'State-of-the-art facilities' },
                { icon: '🌍', title: 'Global Distribution', desc: 'Worldwide supply network' },
                { icon: '🔬', title: 'Research & Development', desc: 'Innovative formulations' },
                { icon: '✅', title: 'Quality Assurance', desc: 'Certified standards' }
              ].map((feature, index) => (
                <div 
                  key={index}
                  className={`p-4 sm:p-6 rounded-xl sm:rounded-2xl card-hover ${
                    isDarkMode 
                      ? 'bg-gray-800/50 hover:bg-gray-800/70 border border-gray-700' 
                      : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                  }`}
                  style={{
                    padding: 'clamp(16px, 3vw, 24px)',
                    borderRadius: 'clamp(12px, 2vw, 16px)',
                    backgroundColor: isDarkMode ? 'rgba(31, 41, 55, 0.5)' : '#f9fafb',
                    border: isDarkMode ? '1px solid #374151' : '1px solid #e5e7eb',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    cursor: 'pointer',
                    animationDelay: `${index * 0.2}s`
                  }}
                  onMouseEnter={(e) => {
                    if (window.innerWidth > 768) { // Only apply hover effects on desktop
                      e.target.style.transform = 'translateY(-8px) scale(1.02)';
                      e.target.style.boxShadow = isDarkMode 
                        ? '0 25px 50px rgba(0, 0, 0, 0.3)' 
                        : '0 25px 50px rgba(0, 0, 0, 0.15)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (window.innerWidth > 768) { // Only apply hover effects on desktop
                      e.target.style.transform = 'translateY(0) scale(1)';
                      e.target.style.boxShadow = 'none';
                    }
                  }}
                  onTouchStart={(e) => {
                    // Add subtle touch feedback for mobile
                    if (window.innerWidth <= 768) {
                      e.target.style.transform = 'scale(0.98)';
                      e.target.style.transition = 'transform 0.1s ease';
                    }
                  }}
                  onTouchEnd={(e) => {
                    // Reset touch feedback for mobile
                    if (window.innerWidth <= 768) {
                      e.target.style.transform = 'scale(1)';
                    }
                  }}
                >
                  <div className="text-3xl sm:text-4xl mb-3 sm:mb-4" style={{
                    fontSize: 'clamp(1.875rem, 4vw, 2.25rem)',
                    marginBottom: 'clamp(12px, 2vw, 16px)'
                  }}>{feature.icon}</div>
                  <h3 className={`text-lg sm:text-xl font-bold mb-2 transition-colors duration-500 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`} style={{
                    fontSize: 'clamp(1.125rem, 2.5vw, 1.25rem)',
                    fontWeight: 'bold',
                    marginBottom: 'clamp(8px, 1.5vw, 8px)',
                    color: isDarkMode ? '#ffffff' : '#111827'
                  }}>
                    {feature.title}
                  </h3>
                  <p className={`text-xs sm:text-sm transition-colors duration-500 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`} style={{
                    fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                    color: isDarkMode ? '#9ca3af' : '#4b5563',
                    margin: 0
                  }}>
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="" style={{ marginTop: '5px' }}>
              <button 
                className={`group relative px-10 py-5 rounded-full font-bold text-lg transition-all duration-700 transform hover:scale-105 hover:shadow-2xl ${
                  isDarkMode 
                    ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 hover:from-blue-500 hover:via-purple-500 hover:to-blue-700 text-white shadow-xl' 
                    : 'bg-gradient-to-r from-blue-500 via-purple-500 to-blue-700 hover:from-blue-400 hover:via-purple-400 hover:to-blue-600 text-white shadow-xl'
                }`} 
                style={{
                  padding: '20px 40px',
                  borderRadius: '9999px',
                  fontWeight: 'bold',
                  fontSize: '1.125rem',
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
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.05)';
                  e.target.style.background = isDarkMode 
                    ? 'linear-gradient(to right, #3b82f6, #8b5cf6, #2563eb)' 
                    : 'linear-gradient(to right, #60a5fa, #a78bfa, #3b82f6)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.background = isDarkMode 
                    ? 'linear-gradient(to right, #2563eb, #9333ea, #1e40af)' 
                    : 'linear-gradient(to right, #3b82f6, #8b5cf6, #1d4ed8)';
                }}
              >
                <span className="relative z-10 transition-all duration-500 group-hover:scale-105" style={{
                  position: 'relative',
                  zIndex: 10,
                  transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
                }}>Get in Touch</span>
              </button>
              </div>
          </div>

          {/* Right Side - Image Carousel */}
          <div ref={imageRef} className="space-y-8" style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '32px'
          }}>
            {/* Main Image Carousel */}
            <div className="relative group" style={{ position: 'relative' , bottom: '80px' }}>
              <div className="relative overflow-hidden rounded-3xl shadow-2xl" style={{
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '24px',
                boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
                height: '500px'
              }}>
                <ImageCarousel />
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-blue-500/20 rounded-full blur-xl animate-pulse" style={{
                position: 'absolute',
                top: '-16px',
                right: '-16px',
                width: '80px',
                height: '80px',
                backgroundColor: 'rgba(59, 130, 246, 0.2)',
                borderRadius: '50%',
                filter: 'blur(24px)',
                animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
              }}></div>

              
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-purple-500/20 rounded-full blur-xl animate-pulse" style={{ 
                position: 'absolute',
                bottom: '-16px',
                left: '-16px',
                width: '64px',
                height: '64px',
                backgroundColor: 'rgba(147, 51, 234, 0.2)',
                borderRadius: '50%',
                filter: 'blur(24px)',
                animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                animationDelay: '1s'
              }}></div>
            </div>

            {/* Certification Image */}
            <div ref={certRef} className="relative group" style={{ position: 'relative' , bottom: '70px' }}>
              <div className="relative overflow-hidden rounded-2xl shadow-xl" style={{
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '16px',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)'
              }}>
                <img 
                  src="https://www.ajsupplements.com/static/fami-qs-certification.jpg" 
                  alt="FAMI-QS Certification" 
                  className="w-full h-48 object-cover image-hover-effect"
                  style={{
                    width: '100%',
                    height: '250px',
                    objectFit: 'cover',
                    transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'scale(1.05) rotate(1deg)';
                    e.target.style.filter = 'brightness(1.1) contrast(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'scale(1) rotate(0deg)';
                    e.target.style.filter = 'brightness(1) contrast(1)';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/80 to-purple-600/80 opacity-0 group-hover:opacity-100 transition-all duration-700 flex items-center justify-center" style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(to right, rgba(37, 99, 235, 0.8), rgba(147, 51, 234, 0.8))',
                  opacity: 0,
                  transition: 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <div className="text-center text-white" style={{
                    textAlign: 'center',
                    color: '#ffffff'
                  }}>
                    <h3 className="text-2xl font-bold mb-2" style={{
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                      margin: 0,
                      marginBottom: '8px'
                    }}>FAMI-QS</h3>
                    <p className="text-sm" style={{
                      fontSize: '0.875rem',
                      margin: 0
                    }}>Certified Quality Standards</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Stats Section */}
        
      </div>
    </section>
  );
};

export default About;