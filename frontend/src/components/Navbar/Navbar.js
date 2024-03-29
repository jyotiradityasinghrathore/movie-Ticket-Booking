import React, {useState, useEffect} from 'react';
import './Navbar.css'
import { Link } from 'react-router-dom';
// import PropTypes from 'prop-types';
import { logout } from '../../actions/auth'; // Import the logout action
import { connect } from 'react-redux'; // Import connect
import PropTypes from 'prop-types';
import store from '../../store.js';
import { useNavigate } from 'react-router-dom';

import CinemasLogo from '../../assets/images/Logo/CinemasLogo.png'

const Navbar = () => {

  const navigate = useNavigate();

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem('token'));
  }, [])
  
  const handleLogout = () => {
    // Call the logout action when logout is clicked
    store.dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">
          <img src={CinemasLogo} alt="Logo" />
        </Link>
      </div>
      <div className="navbar-buttons">
      {!isAuthenticated ? (
          <>
            <Link to="/login">
              <button className="login-button">Login</button>
            </Link>
            <Link to="/register">
              <button className="register-button">Register</button>
            </Link>
          </>
        ) : (
          <>
            <Link to="/profile">
              <button className="profile-button">Profile</button>
            </Link>
            <button className="logout-button" onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
