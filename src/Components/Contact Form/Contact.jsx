import React, { useRef, useEffect, useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { PiGreaterThan, PiPhone, PiEnvelope, PiMapPin, PiPaperPlaneTilt } from "react-icons/pi";

const Contact = () => {
  const { isDarkMode } = useTheme();
  const sectionRef = useRef(null);
  const [visibleElements, setVisibleElements] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    businessType: '',
    productQuantity: '',
    pinCode: '',
    address: '',
    product: '',
    productType: '',
    packaging: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', or null

  const products = [
    'Nutrivolent Se - NOGP 001',
    'Nutrivolent Ca - NIGP 001', 
    'Nutrivolent DCP - NIGP 002',
    'Nutrivolent Mg - NIGP 003',
    'Nutrivolent Zn - NIGP 004',
    'Nutrivolent I - NIGP 005',
    'Nutrivolent Fe - NIGP 006'
  ];

  const businessTypes = [
    'Feed Manufacturer',
    'Livestock Farmer',
    'Poultry Farmer',
    'Aquaculture',
    'Veterinary Clinic',
    'Distributor',
    'Other'
  ];

  const packagingOptions = [
    'Bulk Bags',
    '25kg Bags',
    '50kg Bags',
    'Custom Packaging',
    'Retail Packaging'
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const elementId = entry.target.dataset.elementId;
            setVisibleElements(prev => [...prev, elementId]);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      const elements = sectionRef.current.querySelectorAll('[data-element-id]');
      elements.forEach(element => observer.observe(element));
    }

    return () => observer.disconnect();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Backend API endpoint
      const API_BASE_URL =  'https://aj-supplements-backend-6ein.vercel.app';
      
      // Prepare form data for backend
      const submitData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        businessType: formData.businessType,
        productQuantity: formData.productQuantity,
        address: formData.address,
        productType: formData.productType,
        packaging: formData.packaging,
        message: formData.message
      };

      // Send data to backend API
      const response = await fetch(`${API_BASE_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSubmitStatus('success');
        // Reset form after successful submission
        setFormData({
          name: '',
          email: '',
          phone: '',
          businessType: '',
          productQuantity: '',
          pinCode: '',
          address: '',
          product: '',
          productType: '',
          packaging: '',
          message: ''
        });
      } else {
        throw new Error(result.message || 'Failed to send message');
      }
      
    } catch (error) {
      console.error('Error sending email:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section 
      ref={sectionRef}
      id="contact" 
      className="min-h-screen py-8 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      style={{
        minHeight: '100vh',
        padding: '32px 16px',
        position: 'relative',
        overflow: 'hidden',
        backgroundImage: `url('https://www.shutterstock.com/image-photo/hand-show-icon-address-phone-600nw-2475999141.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Black Overlay */}
      <div className="absolute inset-0 bg-black/75" style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)'
      }}></div>

      <div className="max-w-7xl mx-auto relative z-10" style={{
        maxWidth: '1280px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 10
      }}>
        {/* Section Header */}
        <div 
          data-element-id="header"
          className={`text-center mb-12 sm:mb-16 md:mb-20 transition-all duration-1000 ${
            visibleElements.includes('header') 
              ? 'translate-y-0 opacity-100' 
              : 'translate-y-20 opacity-0'
          }`}
        >
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
            CONTACT US
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl font-medium mb-6 sm:mb-8 text-gray-200" style={{
            fontSize: 'clamp(1.125rem, 3vw, 1.5rem)',
            fontWeight: '500',
            marginBottom: 'clamp(24px, 4vw, 32px)',
            color: '#e5e7eb'
          }}>
            Get in Touch with Our Team
          </p>
          <div className="w-16 sm:w-20 md:w-24 h-1 bg-gradient-to-r from-orange-600 to-red-600 mx-auto rounded-full" style={{
            width: 'clamp(64px, 8vw, 96px)',
            height: '4px',
            background: 'linear-gradient(to right, #EA580C, #DC2626)',
            margin: '0 auto',
            borderRadius: '9999px'
          }}></div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 md:gap-16" style={{
          display: 'grid',
          marginTop: 'clamp(32px, 6vw, 64px)',
          gap: 'clamp(32px, 6vw, 64px)'
        }}>
          {/* Left Side - Contact Details */}
          <div 
            data-element-id="contact-details"
            className={`transition-all duration-1000 delay-200 ${
              visibleElements.includes('contact-details') 
                ? 'translate-x-0 opacity-100' 
                : '-translate-x-20 opacity-0'
            }`}
          >
            <div className="bg-white/10 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-white/20" style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(12px)',
              borderRadius: 'clamp(16px, 2vw, 24px)',
              padding: 'clamp(16px, 3vw, 32px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2), 0 25px 50px rgba(0, 0, 0, 0.1)'
            }}>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 sm:mb-8 text-white" style={{
                fontSize: 'clamp(1.25rem, 3vw, 1.875rem)',
                fontWeight: 'bold',
                marginBottom: 'clamp(24px, 4vw, 32px)',
                color: '#ffffff'
              }}>
                Contact Details
              </h3>

              <div className="space-y-6 sm:space-y-8" style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'clamp(24px, 4vw, 32px)'
              }}>
                {/* Phone */}
                <div className="flex items-center space-x-4 group" style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  cursor: 'pointer'
                }}>
                  <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center group-hover:bg-orange-500/30 transition-all duration-300" style={{
                    width: '48px',
                    height: '48px',
                    backgroundColor: 'rgba(245, 158, 11, 0.2)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}>
                    <PiPhone className="text-orange-500 text-xl" style={{
                      color: '#f59e0b',
                      fontSize: '1.25rem'
                    }} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-300 mb-1" style={{
                      fontSize: '0.875rem',
                      color: '#d1d5db',
                      margin: 0,
                      marginBottom: '4px'
                    }}>Phone</p>
                    <p className="text-lg font-semibold text-white" style={{
                      fontSize: '1.125rem',
                      fontWeight: '600',
                      color: '#ffffff',
                      margin: 0
                    }}>+91-9959625156, 9573049660</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center space-x-4 group" style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  cursor: 'pointer'
                }}>
                  <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center group-hover:bg-red-500/30 transition-all duration-300" style={{
                    width: '48px',
                    height: '48px',
                    backgroundColor: 'rgba(239, 68, 68, 0.2)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}>
                    <PiEnvelope className="text-red-500 text-xl" style={{
                      color: '#ef4444',
                      fontSize: '1.25rem'
                    }} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-300 mb-1" style={{
                      fontSize: '0.875rem',
                      color: '#d1d5db',
                      margin: 0,
                      marginBottom: '4px'
                    }}>Email</p>
                    <a 
                      href="mailto:contact@ajsupplements.com" 
                      className="text-lg font-semibold text-blue-400 hover:text-blue-300 transition-colors duration-300" 
                      style={{
                        fontSize: '1.125rem',
                        fontWeight: '600',
                        color: '#60a5fa',
                        textDecoration: 'none',
                        transition: 'color 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                      }}
                    >
                      contact@ajsupplements.com
                    </a>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start space-x-4 group" style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '16px',
                  cursor: 'pointer'
                }}>
                  <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center group-hover:bg-purple-500/30 transition-all duration-300 mt-1" style={{
                    width: '48px',
                    height: '48px',
                    backgroundColor: 'rgba(147, 51, 234, 0.2)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    marginTop: '4px'
                  }}>
                    <PiMapPin className="text-purple-500 text-xl" style={{
                      color: '#8b5cf6',
                      fontSize: '1.25rem'
                    }} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-300 mb-2" style={{
                      fontSize: '0.875rem',
                      color: '#d1d5db',
                      margin: 0,
                      marginBottom: '8px'
                    }}>Address</p>
                    <div className="text-lg font-semibold text-white leading-relaxed" style={{
                      fontSize: '1.125rem',
                      fontWeight: '600',
                      color: '#ffffff',
                      lineHeight: '1.75'
                    }}>
                      <p style={{ margin: 0 }}>Flat no.403, #3-587/1, Kasim Ali Towers,</p>
                      <p style={{ margin: 0 }}>Subhash Chandra Bose Nagar, New Hafeezpet,</p>
                      <p style={{ margin: 0 }}>Hyderabad, Telangana, India</p>
                      <p style={{ margin: 0 }}>Pincode: 500049</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Contact Form */}
          <div 
            data-element-id="contact-form"
            className={`transition-all duration-1000 delay-400 ${
              visibleElements.includes('contact-form') 
                ? 'translate-x-0 opacity-100' 
                : 'translate-x-20 opacity-0'
            }`}
          >
            <div className="bg-white/10 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-white/20" style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(12px)',
              borderRadius: 'clamp(16px, 2vw, 24px)',
              padding: 'clamp(16px, 3vw, 32px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2), 0 25px 50px rgba(0, 0, 0, 0.1)'
            }}>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 sm:mb-8 text-white" style={{
                fontSize: 'clamp(1.25rem, 3vw, 1.875rem)',
                fontWeight: 'bold',
                marginBottom: 'clamp(24px, 4vw, 32px)',
                color: '#ffffff'
              }}>
                Inquire Now
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6" style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'clamp(16px, 3vw, 24px)'
              }}>
                {/* First Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6" style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: 'clamp(16px, 3vw, 24px)'
                }}>
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2" style={{
                      display: 'block',
                      fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                      fontWeight: '500',
                      color: '#e5e7eb',
                      marginBottom: '8px'
                    }}>
                      Inquiry - Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                      style={{
                        width: '100%',
                        padding: 'clamp(8px, 2vw, 12px) clamp(12px, 3vw, 16px)',
                        borderRadius: '8px',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        color: '#ffffff',
                        outline: 'none',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        fontSize: 'clamp(0.875rem, 2vw, 1rem)'
                      }}
                      placeholder="Your Name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2" style={{
                      display: 'block',
                      fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                      fontWeight: '500',
                      color: '#e5e7eb',
                      marginBottom: '8px'
                    }}>
                      Email-id *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                      style={{
                        width: '100%',
                        padding: 'clamp(8px, 2vw, 12px) clamp(12px, 3vw, 16px)',
                        borderRadius: '8px',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        color: '#ffffff',
                        outline: 'none',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        fontSize: 'clamp(0.875rem, 2vw, 1rem)'
                      }}
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                {/* Second Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6" style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: 'clamp(16px, 3vw, 24px)'
                }}>
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2" style={{
                      display: 'block',
                      fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                      fontWeight: '500',
                      color: '#e5e7eb',
                      marginBottom: '8px'
                    }}>
                      Contact Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                      style={{
                        width: '100%',
                        padding: 'clamp(8px, 2vw, 12px) clamp(12px, 3vw, 16px)',
                        borderRadius: '8px',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        color: '#ffffff',
                        outline: 'none',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        fontSize: 'clamp(0.875rem, 2vw, 1rem)'
                      }}
                      placeholder="+91-XXXXXXXXXX"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2" style={{
                      display: 'block',
                      fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                      fontWeight: '500',
                      color: '#e5e7eb',
                      marginBottom: '8px'
                    }}>
                      Business Type
                    </label>
                    <select
                      name="businessType"
                      value={formData.businessType}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                      style={{
                        width: '100%',
                        padding: 'clamp(8px, 2vw, 12px) clamp(12px, 3vw, 16px)',
                        borderRadius: '8px',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        color: '#ffffff',
                        outline: 'none',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        fontSize: 'clamp(0.875rem, 2vw, 1rem)'
                      }}
                    >
                      <option value="" className="bg-gray-800 text-white">Select Business Type</option>
                      {businessTypes.map((type, index) => (
                        <option key={index} value={type} className="bg-gray-800 text-white">{type}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Third Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6" style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: 'clamp(16px, 3vw, 24px)'
                }}>
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2" style={{
                      display: 'block',
                      fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                      fontWeight: '500',
                      color: '#e5e7eb',
                      marginBottom: '8px'
                    }}>
                      Product Quantity
                    </label>
                    <input
                      type="text"
                      name="productQuantity"
                      value={formData.productQuantity}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                      style={{
                        width: '100%',
                        padding: 'clamp(8px, 2vw, 12px) clamp(12px, 3vw, 16px)',
                        borderRadius: '8px',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        color: '#ffffff',
                        outline: 'none',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        fontSize: 'clamp(0.875rem, 2vw, 1rem)'
                      }}
                      placeholder="Enter quantity"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2" style={{
                      display: 'block',
                      fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                      fontWeight: '500',
                      color: '#e5e7eb',
                      marginBottom: '8px'
                    }}>
                      PIN code, State, Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                      style={{
                        width: '100%',
                        padding: 'clamp(8px, 2vw, 12px) clamp(12px, 3vw, 16px)',
                        borderRadius: '8px',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        color: '#ffffff',
                        outline: 'none',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        fontSize: 'clamp(0.875rem, 2vw, 1rem)'
                      }}
                      placeholder="Enter address with PIN code"
                    />
                  </div>
                </div>

                {/* Fourth Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6" style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: 'clamp(16px, 3vw, 24px)'
                }}>
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2" style={{
                      display: 'block',
                      fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                      fontWeight: '500',
                      color: '#e5e7eb',
                      marginBottom: '8px'
                    }}>
                      Our Product
                    </label>
                    <select
                      name="productType"
                      value={formData.productType}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                      style={{
                        width: '100%',
                        padding: 'clamp(8px, 2vw, 12px) clamp(12px, 3vw, 16px)',
                        borderRadius: '8px',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        color: '#ffffff',
                        outline: 'none',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        fontSize: 'clamp(0.875rem, 2vw, 1rem)'
                      }}
                    >
                      <option value="" className="bg-gray-800 text-white">Select Product</option>
                      {products.map((product, index) => (
                        <option key={index} value={product} className="bg-gray-800 text-white">{product}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2" style={{
                      display: 'block',
                      fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                      fontWeight: '500',
                      color: '#e5e7eb',
                      marginBottom: '8px'
                    }}>
                      Packaging
                    </label>
                    <select
                      name="packaging"
                      value={formData.packaging}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                      style={{
                        width: '100%',
                        padding: 'clamp(8px, 2vw, 12px) clamp(12px, 3vw, 16px)',
                        borderRadius: '8px',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        color: '#ffffff',
                        outline: 'none',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        fontSize: 'clamp(0.875rem, 2vw, 1rem)'
                      }}
                    >
                      <option value="" className="bg-gray-800 text-white">Select Packaging</option>
                      {packagingOptions.map((option, index) => (
                        <option key={index} value={option} className="bg-gray-800 text-white">{option}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2" style={{
                    display: 'block',
                    fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                    fontWeight: '500',
                    color: '#e5e7eb',
                    marginBottom: '8px'
                  }}>
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 resize-none"
                    style={{
                      width: '100%',
                      padding: 'clamp(8px, 2vw, 12px) clamp(12px, 3vw, 16px)',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: '#ffffff',
                      outline: 'none',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      resize: 'none',
                      fontSize: 'clamp(0.875rem, 2vw, 1rem)'
                    }}
                    placeholder="Tell us about your requirements..."
                  ></textarea>
                </div>

                {/* Status Messages */}
                {submitStatus === 'success' && (
                  <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 text-green-300" style={{
                    backgroundColor: 'rgba(34, 197, 94, 0.2)',
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                    borderRadius: '8px',
                    padding: '16px',
                    color: '#86efac'
                  }}>
                    <p className="text-sm font-medium" style={{ fontSize: '0.875rem', fontWeight: '500', margin: 0 }}>
                      ✅ Thank you! Your inquiry has been sent successfully. We'll get back to you soon.
                    </p>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 text-red-300" style={{
                    backgroundColor: 'rgba(239, 68, 68, 0.2)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: '8px',
                    padding: '16px',
                    color: '#fca5a5'
                  }}>
                    <p className="text-sm font-medium" style={{ fontSize: '0.875rem', fontWeight: '500', margin: 0 }}>
                      ❌ Sorry, there was an error sending your message. Please try again or contact us directly.
                    </p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 ${
                    isSubmitting 
                      ? 'bg-gray-500 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 transform hover:scale-105 hover:shadow-xl'
                  }`}
                  style={{
                    width: '100%',
                    background: isSubmitting 
                      ? '#6b7280' 
                      : 'linear-gradient(to right, #f97316, #ef4444)',
                    color: '#ffffff',
                    fontWeight: 'bold',
                    padding: 'clamp(12px, 3vw, 16px) clamp(24px, 4vw, 32px)',
                    borderRadius: '8px',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    border: 'none',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    fontSize: 'clamp(0.875rem, 2vw, 1rem)'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSubmitting) {
                      e.target.style.background = 'linear-gradient(to right, #fb923c, #f87171)';
                      e.target.style.transform = 'scale(1.05)';
                      e.target.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.3)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSubmitting) {
                      e.target.style.background = 'linear-gradient(to right, #f97316, #ef4444)';
                      e.target.style.transform = 'scale(1)';
                      e.target.style.boxShadow = 'none';
                    }
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" style={{
                        animation: 'spin 1s linear infinite',
                        borderRadius: '50%',
                        height: '20px',
                        width: '20px',
                        border: '2px solid transparent',
                        borderBottomColor: '#ffffff'
                      }}></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <PiPaperPlaneTilt className="text-lg sm:text-xl" style={{ fontSize: 'clamp(1rem, 2.5vw, 1.25rem)' }} />
                      <span>Submit</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div 
          data-element-id="footer"
          className={`mt-12 sm:mt-16 md:mt-20 text-center transition-all duration-1000 delay-600 ${
            visibleElements.includes('footer') 
              ? 'translate-y-0 opacity-100' 
              : 'translate-y-20 opacity-0'
          }`}
        >
          <div className="bg-black/50 backdrop-blur-md rounded-lg p-4 sm:p-6 border border-white/10" style={{
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(12px)',
            borderRadius: '8px',
            padding: 'clamp(16px, 3vw, 24px)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <p className="text-gray-300 text-xs sm:text-sm" style={{
              color: '#d1d5db',
              fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
              margin: 0
            }}>
              © Copyright 2024 AJ Supplements | All Rights Reserved |
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;