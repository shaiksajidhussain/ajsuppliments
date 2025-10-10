import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTheme } from '../../contexts/ThemeContext';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const Navbar = ({ onLogout }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [username, setUsername] = useState('');
  const navbarRef = useRef(null);
  const logoRef = useRef(null);
  const navLinksRef = useRef([]);
  const themeToggleRef = useRef(null);

  // Get username from localStorage
  useEffect(() => {
    const storedUsername = localStorage.getItem('userEmail');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  // Theme toggle handler is now from context

  // Initial GSAP animations (only run once)
  useEffect(() => {
    const navbar = navbarRef.current;
    const logo = logoRef.current;
    const navLinks = navLinksRef.current;
    const themeToggle = themeToggleRef.current;

    // Initial animation timeline
    const tl = gsap.timeline();
    
    // Animate navbar entrance
    tl.fromTo(navbar, 
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
    )
    // Animate logo
    .fromTo(logo,
      { scale: 0, rotation: -180 },
      { scale: 1, rotation: 0, duration: 0.8, ease: "back.out(1.7)" },
      "-=0.5"
    )
    // Animate navigation links
    .fromTo(navLinks,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power2.out" },
      "-=0.3"
    )
    // Animate theme toggle
    .fromTo(themeToggle,
      { scale: 0, rotation: 180 },
      { scale: 1, rotation: 0, duration: 0.5, ease: "back.out(1.7)" },
      "-=0.2"
    );
  }, []); // Empty dependency array - only run once

  // Scroll-triggered animations (separate effect)
  useEffect(() => {
    const navbar = navbarRef.current;
    
    // Scroll-triggered animation
    ScrollTrigger.create({
      trigger: navbar,
      start: "top top",
      end: "bottom top",
      onEnter: () => {
        gsap.to(navbar, { 
          backgroundColor: isDarkMode ? "rgba(26, 32, 44, 0.95)" : "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(25px)",
          WebkitBackdropFilter: "blur(25px)",
          duration: 0.3
        });
      },
      onLeaveBack: () => {
        gsap.to(navbar, { 
          backgroundColor: isDarkMode ? "rgba(26, 32, 44, 0.8)" : "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          duration: 0.3
        });
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [isDarkMode]); // Only re-run when isDarkMode changes

  // Scroll spy to detect active section
  useEffect(() => {
    const sections = ['hero', 'about', 'expertise', 'products', 'certifications',  'contact'];
    
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100; // Offset for navbar height
      
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section) {
          const sectionTop = section.offsetTop;
          const sectionHeight = section.offsetHeight;
          
          if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            setActiveSection(sections[i]);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial position

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Hover animations for nav links
  const handleLinkHover = (index, isHovering) => {
    const link = navLinksRef.current[index];
    if (link) {
      gsap.to(link, {
        scale: isHovering ? 1.1 : 1,
        color: isHovering ? (isDarkMode ? "#60A5FA" : "#3B82F6") : (isDarkMode ? "#E5E7EB" : "#374151"),
        duration: 0.3,
        ease: "power2.out"
      });
    }
  };

  // Theme toggle animation
  const handleThemeToggle = () => {
    const toggle = themeToggleRef.current;
    gsap.to(toggle, {
      rotation: "+=180",
      scale: 0.8,
      duration: 0.2,
      yoyo: true,
      repeat: 1,
      ease: "power2.inOut",
      onComplete: () => {
        toggleTheme();
      }
    });
  };

  return (
    <nav 
      ref={navbarRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        backgroundColor: isDarkMode 
          ? 'rgba(26, 32, 44, 0.8)' 
          : 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: isDarkMode 
          ? '1px solid rgba(255, 255, 255, 0.1)' 
          : '1px solid rgba(0, 0, 0, 0.1)',
        transition: 'all 0.3s ease'
      }}
    >
      {/* Bottom border line */}
      <div style={{
        height: '2px',
        width: '100%',
        background: isDarkMode 
          ? 'linear-gradient(90deg, transparent, rgba(96, 165, 250, 0.6), transparent)' 
          : 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.6), transparent)',
        marginTop: 'auto'
      }}></div>
      
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo Section */}
          <div 
            style={{ display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer' }}
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <div 
              ref={logoRef}
              style={{ position: 'relative' }}
            >
              <img 
                src="https://res.cloudinary.com/dgus6y6lm/image/upload/v1760024083/logo_ichq5k.png" 
                alt="AJ Supplements Logo" 
                style={{
                  height: '70px',
                  width: '70px',
                  objectFit: 'contain',
                  transition: 'transform 0.3s ease'
                }}
                onError={(e) => {
                  // Fallback to text logo if image fails to load
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
                onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
              />
              {/* Fallback text logo */}
              <div 
                style={{
                  display: 'none',
                  height: '56px',
                  width: '56px',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  border: '2px solid',
                  borderColor: isDarkMode ? '#60A5FA' : '#3B82F6',
                  color: isDarkMode ? '#60A5FA' : '#3B82F6',
                  fontWeight: 'bold',
                  fontSize: '20px'
                }}
              >
                AJ
              </div>
            </div>
            <span style={{
              fontSize: '14px',
              fontWeight: '600',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: isDarkMode ? '#D1D5DB' : '#6B7280'
            }}>
              SUPPLIMENTS
            </span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center" style={{ gap: '3rem' }}>
            {[
              { name: 'ABOUT', id: 'about', type: 'scroll' },
              { name: 'EXPERTISE', id: 'expertise', type: 'scroll' },
              { name: 'PRODUCTS', id: 'products', type: 'scroll' },
              // { name: 'CERTIFICATIONS', id: 'certifications', type: 'scroll' },
              // { name: 'SOFTWARE', id: 'oursoftware', type: 'route' },
              { name: 'CONTACT', id: 'contact', type: 'scroll' }
            ].map((link, index) => {
              const isActive = link.type === 'scroll' ? activeSection === link.id : window.location.pathname === `/${link.id}`;
              
              if (link.type === 'route') {
                // Special handling for software route - check authentication
                const handleSoftwareClick = (e) => {
                  e.preventDefault();
                  const isLoggedIn = localStorage.getItem('isLoggedIn');
                  if (isLoggedIn === 'true') {
                    // If logged in, go to species selection
                    window.location.href = '/species';
                  } else {
                    // If not logged in, go to login
                    window.location.href = '/login';
                  }
                };

                return (
                  <a
                    key={link.name}
                    ref={el => navLinksRef.current[index] = el}
                    href="#"
                    onClick={handleSoftwareClick}
                    style={{
                      fontWeight: 'bold',
                      fontSize: '14px',
                      letterSpacing: '0.2em',
                      padding: '8px 16px',
                      textDecoration: 'none',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      color: isActive 
                        ? (isDarkMode ? '#60A5FA' : '#3B82F6')
                        : (isDarkMode ? '#E5E7EB' : '#374151'),
                      position: 'relative'
                    }}
                    className={`transition-all duration-300 ${
                      isDarkMode ? 'hover:text-blue-400' : 'hover:text-blue-600'
                    }`}
                    onMouseEnter={() => handleLinkHover(index, true)}
                    onMouseLeave={() => handleLinkHover(index, false)}
                  >
                    {link.name}
                    {/* Active indicator */}
                    {isActive && (
                      <div
                        style={{
                          position: 'absolute',
                          bottom: '-8px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          backgroundColor: isDarkMode ? '#60A5FA' : '#3B82F6',
                          boxShadow: `0 0 10px ${isDarkMode ? '#60A5FA' : '#3B82F6'}`
                        }}
                      />
                    )}
                  </a>
                );
              }
              
              return (
                <a
                  key={link.name}
                  ref={el => navLinksRef.current[index] = el}
                  href={`#${link.id}`}
                  style={{
                    fontWeight: 'bold',
                    fontSize: '14px',
                    letterSpacing: '0.2em',
                    padding: '8px 16px',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    color: isActive 
                      ? (isDarkMode ? '#60A5FA' : '#3B82F6')
                      : (isDarkMode ? '#E5E7EB' : '#374151'),
                    position: 'relative'
                  }}
                  className={`transition-all duration-300 ${
                    isDarkMode ? 'hover:text-blue-400' : 'hover:text-blue-600'
                  }`}
                  onMouseEnter={() => handleLinkHover(index, true)}
                  onMouseLeave={() => handleLinkHover(index, false)}
                  onClick={(e) => {
                    e.preventDefault();
                    // Smooth scroll to section
                    const element = document.getElementById(link.id);
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                >
                  {link.name}
                  {/* Active indicator */}
                  {isActive && (
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '-8px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: isDarkMode ? '#60A5FA' : '#3B82F6',
                        boxShadow: `0 0 10px ${isDarkMode ? '#60A5FA' : '#3B82F6'}`
                      }}
                    />
                  )}
                </a>
              );
            })}
          </div>

          {/* User Info and Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Username Display */}
            {/* {username && (
              <div style={{
                padding: '8px 16px',
                borderRadius: '20px',
                backgroundColor: isDarkMode ? '#374151' : '#E5E7EB',
                color: isDarkMode ? '#D1D5DB' : '#374151',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                Welcome, {username}
              </div>
            )} */}

            {/* Theme Toggle */}
            <button
              ref={themeToggleRef}
              onClick={handleThemeToggle}
              style={{
                padding: '12px',
                borderRadius: '50%',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                backgroundColor: isDarkMode ? '#374151' : '#E5E7EB',
                color: isDarkMode ? '#FBBF24' : '#6B7280'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.1)';
                e.target.style.backgroundColor = isDarkMode ? '#4B5563' : '#D1D5DB';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.backgroundColor = isDarkMode ? '#374151' : '#E5E7EB';
              }}
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>

            {/* Logout Button */}
            {username && (
              <button
                onClick={onLogout}
                style={{padding: '8px 16px'}}
                className={` rounded-lg font-medium text-sm transition-all duration-300 ${
                  isDarkMode 
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : 'bg-red-500 hover:bg-red-600 text-white'
                }`}
              >
                Logout
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`md:hidden p-3 rounded-lg transition-all duration-300 hover:scale-110 ${
              isDarkMode 
                ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
                : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
            }`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-6 py-6 border-t border-gray-300 dark:border-gray-600">
            <div className="flex flex-col space-y-4">
              {[
                { name: 'ABOUT', id: 'about', type: 'scroll' },
                { name: 'EXPERTISE', id: 'expertise', type: 'scroll' },
                { name: 'PRODUCTS', id: 'products', type: 'scroll' },
                { name: 'CERTIFICATIONS', id: 'certifications', type: 'scroll' },
                { name: 'SOFTWARE', id: 'oursoftware', type: 'route' }, 
                { name: 'CONTACT', id: 'contact', type: 'scroll' }
              ].map((link) => {
                const isActive = link.type === 'scroll' ? activeSection === link.id : window.location.pathname === `/${link.id}`;
                
                if (link.type === 'route') {
                  // Special handling for software route - check authentication
                  const handleMobileSoftwareClick = (e) => {
                    e.preventDefault();
                    setIsMenuOpen(false);
                    const isLoggedIn = localStorage.getItem('isLoggedIn');
                    if (isLoggedIn === 'true') {
                      // If logged in, go to species selection
                      window.location.href = '/species';
                    } else {
                      // If not logged in, go to login
                      window.location.href = '/login';
                    }
                  };

                  return (
                    <a
                      key={link.name}
                      href="#"
                      onClick={handleMobileSoftwareClick}
                      className={`block py-3 font-bold text-sm tracking-[0.2em] uppercase transition-all duration-300 hover:scale-105 relative ${
                        isActive
                          ? (isDarkMode ? 'text-blue-400' : 'text-blue-600')
                          : (isDarkMode ? 'text-gray-200 hover:text-blue-400' : 'text-gray-700 hover:text-blue-600')
                      }`}
                      style={{
                        color: isActive 
                          ? (isDarkMode ? '#60A5FA' : '#3B82F6')
                          : undefined
                      }}
                    >
                      {link.name}
                      {/* Active indicator for mobile */}
                      {isActive && (
                        <div
                          style={{
                            position: 'absolute',
                            left: '-16px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            width: '4px',
                            height: '20px',
                            borderRadius: '2px',
                            backgroundColor: isDarkMode ? '#60A5FA' : '#3B82F6'
                          }}
                        />
                      )}
                    </a>
                  );
                }
                
                return (
                  <a
                    key={link.name}
                    href={`#${link.id}`}
                    className={`block py-3 font-bold text-sm tracking-[0.2em] uppercase transition-all duration-300 hover:scale-105 relative ${
                      isActive
                        ? (isDarkMode ? 'text-blue-400' : 'text-blue-600')
                        : (isDarkMode ? 'text-gray-200 hover:text-blue-400' : 'text-gray-700 hover:text-blue-600')
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                    style={{
                      color: isActive 
                        ? (isDarkMode ? '#60A5FA' : '#3B82F6')
                        : undefined
                    }}
                  >
                    {link.name}
                    {/* Active indicator for mobile */}
                    {isActive && (
                      <div
                        style={{
                          position: 'absolute',
                          left: '-16px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          width: '4px',
                          height: '20px',
                          borderRadius: '2px',
                          backgroundColor: isDarkMode ? '#60A5FA' : '#3B82F6'
                        }}
                      />
                    )}
                  </a>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
