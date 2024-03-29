import React, { useState, useEffect  } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 


import Description from '../../Description'; // Make sure this path is correct
import Navbar from '../../components/Navbar/Navbar'; // Import the Navbar component

import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { loadUser} from '../../actions/auth'
import { login } from '../../actions/auth';
import { setAlert } from '../../actions/alert'; 

// import { useSelector } from 'react-redux/es/hooks/useSelector';


// import { useHistory } from 'react-router-dom';

import "./LoginPage.css"

const LoginPage = ({setAlert, login}) => {

  


  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { email, password } = formData;

  const navigate = useNavigate(); // React Router hook for navigation

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Call login action with email and password
      await login(email, password);
      
      

      navigate('/');

      
      // Redirect to '/booking' after successful login
      //navigate('/booking'); // Redirect to BookingPage after successful login, not working YET
    } catch (err) {
      console.error('Error:', err);
      setAlert('Login Failed.', 'danger');
    }
  };

  return (
    <div className='login-container'>
      <div className='login-navbar'>
        <Navbar isAuthenticated={false} />
      </div>
      
      <div className='login-text'>
        {/* <Description /> */}
        <h2>{'Log In'}</h2>
      </div>
      <div className='login-form-container'>
        <form onSubmit={handleSubmit} className='login-form'>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={handleChange}
            required
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={handleChange}
            required
          />
          {/* <div className='login-button'> */}
          <button className='login-btn' type="submit">{'Log In'}</button>
          {/* </div> */}
          
          
          <p>
          {'Don\'t have an account? '}
          <Link to="/register">{'Sign Up'}</Link>
        </p>
          
        </form>
        
      </div>
      
      {/* <div>
        
      </div> */}
    </div>
  );
};

LoginPage.propTypes = {
  setAlert: PropTypes.func.isRequired,
  login: PropTypes.func.isRequired,
};

export default connect(null, { setAlert, login })(LoginPage);