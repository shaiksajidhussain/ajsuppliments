import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SpeciesManagement from './SpeciesManagement';
import IngredientManagement from './IngredientManagement';
import InclusionLimitsManagement from './InclusionLimitsManagement';
import { verifyToken } from '../../services/api';
import './AdminPanel.css';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('species');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // Check both authentication methods
      const isLoggedIn = localStorage.getItem('isLoggedIn');
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      
      if (isLoggedIn !== 'true' && !token) {
        navigate('/login');
        return;
      }

      // If using the existing login system, just verify the flag
      if (isLoggedIn === 'true') {
        setIsAuthenticated(true);
        setLoading(false);
        return;
      }

      // If using JWT token, verify it
      if (token) {
        const response = await verifyToken();
        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('authToken');
          localStorage.removeItem('token');
          navigate('/login');
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('authToken');
      localStorage.removeItem('token');
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    // Clear all authentication data
    localStorage.removeItem('authToken');
    localStorage.removeItem('token');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');
    localStorage.removeItem('loginTime');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="admin-panel">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p style={{ marginLeft: '1rem', color: 'white' }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="admin-panel">
      {/* Header */}
      <div className="admin-header">
        <div className="admin-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <h1 className="admin-header h1">Admin Panel</h1>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span className="admin-welcome">Welcome, Admin</span>
              <button
                onClick={handleLogout}
                className="admin-logout-btn"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="admin-container">
        {/* Navigation Tabs */}
        <div className="admin-tabs">
          <div className="admin-tab-nav">
            <button
              onClick={() => setActiveTab('species')}
              className={`admin-tab-btn ${activeTab === 'species' ? 'active' : ''}`}
            >
              Species Management
            </button>
            <button
              onClick={() => setActiveTab('ingredients')}
              className={`admin-tab-btn ${activeTab === 'ingredients' ? 'active' : ''}`}
            >
              Ingredient Management
            </button>
            <button
              onClick={() => setActiveTab('inclusion-limits')}
              className={`admin-tab-btn ${activeTab === 'inclusion-limits' ? 'active' : ''}`}
            >
              Inclusion Limits
            </button>
          </div>

          {/* Tab Content */}
          <div className="admin-content">
            {activeTab === 'species' && <SpeciesManagement />}
            {activeTab === 'ingredients' && <IngredientManagement />}
            {activeTab === 'inclusion-limits' && <InclusionLimitsManagement />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
