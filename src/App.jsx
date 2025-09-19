import React from 'react';
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
import Login from './Components/Login/Login';
import SpeciesSelection from './Components/Login/SpeciesSelection';
import ProtectedRoute from './Components/ProtectedRoute';
import Poultry from './Components/Species/Poultry';
import Cattle from './Components/Species/Cattle';
import Buffalo from './Components/Species/Buffalo';
import Sheep from './Components/Species/Sheep';
import Swine from './Components/Species/Swine';
import Goat from './Components/Species/Goat';

const App = () => {
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('loginTime');
    window.location.href = '/login';
  };


  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* Redirect root to home */}
          <Route 
            path="/" 
            element={<Navigate to="/home" replace />}
          />
          
          {/* Login Route */}
          <Route 
            path="/login" 
            element={<Login />}
          />
          
          {/* Species Selection Route - Protected */}
          <Route 
            path="/species" 
            element={
              <ProtectedRoute>
                <SpeciesSelection />
              </ProtectedRoute>
            }
          />
          
          {/* Species-specific Routes - Protected */}
          <Route 
            path="/poultry" 
            element={
              <ProtectedRoute>
                <Poultry />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/cattle" 
            element={
              <ProtectedRoute>
                <Cattle />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/buffalo" 
            element={
              <ProtectedRoute>
                <Buffalo />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/sheep" 
            element={
              <ProtectedRoute>
                <Sheep />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/swine" 
            element={
              <ProtectedRoute>
                <Swine />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/goat" 
            element={
              <ProtectedRoute>
                <Goat />
              </ProtectedRoute>
            }
          />
          
          {/* OurSoftware Route - Protected (Legacy) */}
          <Route 
            path="/oursoftware" 
            element={
              <ProtectedRoute>
                <OurSoftware />
              </ProtectedRoute>
            }
          />
          
          {/* Main App Route */}
          <Route 
            path="/home" 
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
          
          {/* Catch-all route - redirect to home */}
          <Route 
            path="*" 
            element={<Navigate to="/home" replace />}
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;