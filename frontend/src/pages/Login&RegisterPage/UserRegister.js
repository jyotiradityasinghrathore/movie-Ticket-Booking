import React, { useState, useEffect } from 'react';
import Description from '../../Description'; // Make sure this path is correct
import Navbar from '../../components/Navbar/Navbar'; // Import the Navbar component

import { Link } from 'react-router-dom'; 
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import { connect } from 'react-redux';
import { setAlert } from '../../actions/alert'; 
import { register } from '../../actions/auth';
import { login } from '../../actions/auth'; 
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom';


import axios from 'axios';

import './UserRegister.css'

const Register = ({setAlert, register}) =>{

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name:'',
    email: '',
    password: '',
    password2: '',
    membership:'regular',
  });


  const {name, email, password, password2, membership } = formData;
  

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // console.log("before try catch",userData)
    if (password !== password2) {
      setAlert('Passwords do not match', 'danger');
    } else {
      const newUser = {
        name,
        email,
        password,
        membership,
      };
      

      try {
        await register(newUser); 
        // Check if the selected membership is "Premium" and redirect accordingly
        const loginData = {
          email: newUser.email,
          password: newUser.password,
        };

        // Call the login action to log in the user
        await login(loginData);
        
        if (membership === 'premium') {
          navigate('/get-premium'); // Redirect to the /get-premium page
        } else {
          // Redirect to another page if needed (e.g., '/dashboard')
          navigate('/');
        }
      } catch (err) {
        console.error('Error:', err);
      }
    }
  };


  return (
    <div className='register-container'>
      <div className='register-navbar'>
        <Navbar isAuthenticated={false} /> {/* Include the Navbar component */}
      </div>
      <div className='register-'>

      </div>
      <div className='register-description'>
        {/* <Description /> Add the Description component here */}
        <h2>{'Sign Up'}</h2>
      </div>
      <div className='register-form-container'>
        <form onSubmit={handleSubmit} className='register-form'>
          <label htmlFor="username">Name</label>
          <input type="text" id="name" name="name" value={name}
            onChange={handleChange}   required />
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={(e) => handleChange(e, 'email')}  required/>
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" value={formData.password} onChange={(e) => handleChange(e, 'password')} minLength='6' required/>
          <label htmlFor="password2">Retype Password</label>
          <input type="password" id="password2" name="password2" value={formData.password2} onChange={(e) => handleChange(e, 'password2')} minLength='6' required />
          {/* <label htmlFor="membership">Membership</label> */}
          {/* <select
            id="membership"
            name="membership"
            value={membership}
            onChange={handleChange}
            required
          >
            <option value="regular">Regular</option>
            <option value="premium">Premium</option>
          </select> */}
          <button className="register-btn" type="submit">{ 'Sign Up'}</button>

          <p>
            {'Already have an account? '}
            <Link to="/login">{'Login'}</Link>
          </p>        
        </form>
      </div>
      
    </div>
    
  );
}
Register.prototype = {
    setAlert:PropTypes.func.isRequired,
    register:PropTypes.func.isRequired,
};

export default connect(null,{setAlert, register})(Register);