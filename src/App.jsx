import React from 'react';
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

const App = () => {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-all duration-500">
        <Navbar />
        
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
    </ThemeProvider>
  );
};

export default App;