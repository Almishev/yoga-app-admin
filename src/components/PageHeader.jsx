import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './PageHeader.css';

const PageHeader = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="page-header">
      <div className="header-content">
        <div className="header-top">
          <Link to="/dashboard" className="logo" onClick={closeMobileMenu}>
            <h1>Yoga Vibe Admin</h1>
          </Link>
          
          <button 
            className="hamburger-button"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            <span className={`hamburger-icon ${mobileMenuOpen ? 'open' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>
        
        <nav className={`header-nav ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <Link 
            to="/dashboard" 
            className={isActive('/dashboard') ? 'nav-link active' : 'nav-link'}
            onClick={closeMobileMenu}
          >
            Dashboard
          </Link>
          <Link 
            to="/courses" 
            className={isActive('/courses') ? 'nav-link active' : 'nav-link'}
            onClick={closeMobileMenu}
          >
            Курсове
          </Link>
          <Link 
            to="/asanas" 
            className={isActive('/asanas') ? 'nav-link active' : 'nav-link'}
            onClick={closeMobileMenu}
          >
            Асани
          </Link>
          
          <div className={`header-actions-mobile ${mobileMenuOpen ? 'mobile-open' : ''}`}>
            <span className="user-info">{user?.email}</span>
            <button onClick={() => { logout(); closeMobileMenu(); }} className="logout-button">
              Изход
            </button>
          </div>
        </nav>

        
      </div>
    </header>
  );
};

export default PageHeader;

