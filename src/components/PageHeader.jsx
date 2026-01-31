import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './PageHeader.css';

const PageHeader = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="page-header">
      <div className="header-content">
        <Link to="/dashboard" className="logo">
          <h1>Yoga Vibe Admin</h1>
        </Link>
        
        <nav className="header-nav">
          <Link 
            to="/dashboard" 
            className={isActive('/dashboard') ? 'nav-link active' : 'nav-link'}
          >
            Dashboard
          </Link>
          <Link 
            to="/courses" 
            className={isActive('/courses') ? 'nav-link active' : 'nav-link'}
          >
            Курсове
          </Link>
          <Link 
            to="/asanas" 
            className={isActive('/asanas') ? 'nav-link active' : 'nav-link'}
          >
            Асани
          </Link>
        </nav>

        <div className="header-actions">
          <span className="user-info">{user?.email}</span>
          <button onClick={logout} className="logout-button">
            Изход
          </button>
        </div>
      </div>
    </header>
  );
};

export default PageHeader;

