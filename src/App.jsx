import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar';
import './App.css';
import Hero from './Components/Hero Section/Hero';
import About from './Components/About/About';
import { ThemeProvider } from './contexts/ThemeContext';
import OurExpertise from './Components/Our Expertise/OurExpertise';
import Ourproducts from './Components/Our Products/Ourproducts';
import Ourceritifications from './Components/Our Certifications/Ourceritifications';
import Oursoftwareadnwhoweare from './Components/Our Software/Oursoftwareadnwhoweare';
import Contact from './Components/Contact Form/Contact';
import OurSoftware from './Components/Login/OurSoftware';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication status on component mount
  useEffect(() => {
    const checkAuthStatus = () => {
      const isLoggedIn = localStorage.getItem('isLoggedIn');
      if (isLoggedIn === 'true') {
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    localStorage.removeItem('loginTime');
    setIsAuthenticated(false);
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <ThemeProvider>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">Loading...</p>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* Login Route */}
          <Route 
            path="/oursoftware" 
            element={<OurSoftware  />}
          />
          
          {/* Main App Route */}
          <Route 
            path="/*" 
            element={
         
                <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-all duration-500">
                  <Navbar onLogout={handleLogout} />
                  
                  {/* Main content with sections for smooth scrolling */}
                  <main>
                    {/* Hero Section */}
                    <section id="hero" className="h-screen">
                      <Hero/>
                    </section>

                    {/* About Section */}
                    <section id="about">
                      <About />
                    </section>

                    {/* Expertise Section */}
                    <section id="expertise">
                      <OurExpertise/>
                    </section>

                    {/* Products Section */}
                    <section id="products">
                      <Ourproducts/>
                    </section>

                    {/* Certifications Section */}
                    <section id="certifications">
                      <Ourceritifications/>
                    </section>

                    {/* Software Section */}
                    <section id="software">
                      <Oursoftwareadnwhoweare/>
                    </section>

                    {/* Contact Section */}
                    <section id="contact">
                      <Contact/>
                    </section>
                  </main>
                </div>
              
            } 
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;