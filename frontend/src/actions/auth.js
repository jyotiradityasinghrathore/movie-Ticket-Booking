import axios from "axios";
import { 
    USER_LOGIN_FAIL,
    USER_LOGIN_SUCCESS,
    USER_REGISTER_FAIL,
    USER_REGISTER_SUCCESS,
    USER_LOADED,
    AUTH_ERROR,
    LOGOUT,

} from './types';
import { setAlert } from './alert'; // Import the setAlert action
import setAuthToken from '../utility/setAuthToken'
import { API_BASE_URL } from "../utility/apiConfig";

// Register User
export const register = ({name, email, password}) => async (dispatch) => {
    try {
    
  
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      }

      const body = JSON.stringify({name, email, password});

      const api = axios.create({
        baseURL: `${API_BASE_URL}/api`, // Modify this base URL to match your backend's URL
      });
  
      const res = await api.post('/users',body, config);
      console.log(res.data);

      dispatch({ type: USER_REGISTER_SUCCESS, payload: res.data });
      dispatch(setAlert('User has been created!', 'success'));
  

    } catch (err) {
        if (err.response && err.response.data && err.response.data.message) {
          const error = err.response.data.message;
          // Dispatch USER_REGISTER_FAIL with an error message payload
          dispatch({
            type: USER_REGISTER_FAIL,
            payload: error // or err.response.data.message, depending on your API response
          });
          dispatch(setAlert(error, 'danger'));
        } else {
          // If the error format is unexpected, dispatch a generic error message
          dispatch({
            type: USER_REGISTER_FAIL,
            payload: "An error occurred during registration."
          });
          dispatch(setAlert('Unexpected error occured', 'danger'));
        }
  }};

// Load User
export const loadUser = () => async (dispatch) => {
  try {
    // Check if token exists in localStorage and set it in the headers if present
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }

    const api = axios.create({
      baseURL: `${API_BASE_URL}/api`,
    });

    // Retrieve user data from the backend
    const res = await api.get('/auth');
    // console.log(res.data)

    // Dispatch action to store user data in the Redux store
    dispatch({ type: USER_LOADED, payload: res.data });
  } catch (err) {
    // Log and handle errors
    console.error(err);

    // Dispatch AUTH_ERROR in case of failure to load user data
    dispatch({ type: AUTH_ERROR });

    // Display appropriate alert message to the user
    dispatch(setAlert('Failed to load user data. Please log in again.', 'danger'));
  }
};

// login User
export const login = (email, password) => async (dispatch) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    }

    const body = JSON.stringify({ email, password });

    const api = axios.create({
      baseURL: `${API_BASE_URL}/api`,
    });

    const res = await api.post('/auth', body, config);

    const { token } = res.data; // Assuming token is returned in res.data

    // Set the received token into localStorage
    localStorage.setItem('token', token);

    // Dispatch action for successful login
    dispatch({ type: USER_LOGIN_SUCCESS, payload: res.data });
    dispatch(setAlert('Log in successfully!', 'success'));

  } catch (err) {
    if (err.response && err.response.data && err.response.data.message) {
      // If the error response contains a message (likely due to incorrect credentials)
      const error = err.response.data.message;
      dispatch({
        type: USER_LOGIN_FAIL,
        payload: error,
      });
      dispatch(setAlert(error, 'danger'));
    } else {
      // If the error format is unexpected or not provided (generic error)
      console.error('Login Error:', err);
      dispatch({
        type: USER_LOGIN_FAIL,
        payload: 'An error occurred during login.',
      });
      dispatch(setAlert('Login Failed', 'danger'));
    }
  }
};

// Logout User
export const logout = () => (dispatch) => {
  try {
    console.log('PRESSED LOGOUTT')
    // Clear token from local storage
    localStorage.removeItem('token');

    // Remove token from headers
    setAuthToken(null);

    // Dispatch LOGOUT action to reset the state
    dispatch({ type: LOGOUT });

    // Display logout success message
    dispatch(setAlert('Logged out successfully!', 'success'));
  } catch (err) {
    console.error('Logout Error:', err);
    // Dispatch AUTH_ERROR in case of logout failure
    dispatch(setAlert('Logout Failed', 'danger'));
  }
};