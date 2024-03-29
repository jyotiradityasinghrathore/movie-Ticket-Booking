import {
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAIL,
    USER_LOADED,
    AUTH_ERROR,
    LOGOUT,
    PREMIUM_USER_SUCCESS
} from '../actions/types';
  
  const initialState = {
    token: localStorage.getItem('token'),
    isAuthenticated: false,
    loading: true,
    user: null,
  };
  
  export default function (state = initialState, action) {
    const { type, payload } = action;
  
    switch (type) {
      case USER_LOADED:
        // console.log("Payload",payload.token);
        return {
            ...state,
            token: payload,
            user: payload,
            isAuthenticated: true,
            loading: false,
        };
  
      case USER_LOGIN_SUCCESS:
        localStorage.setItem('token', payload.token);
        return {
          ...state,
          token: payload.token,
          user: payload.user,
          isAuthenticated: true,
          loading: false,
        };
  
      case USER_LOGIN_FAIL:
      case AUTH_ERROR:
        localStorage.removeItem('token');
        return {
          ...state,
          token: null,
          isAuthenticated: false,
          loading: false,
          user: null,
        };
  
      case LOGOUT:
        localStorage.removeItem('token');
        return {
          ...state,
          isAuthenticated: false,
          loading: false,
          user: null,
        };
        
      case PREMIUM_USER_SUCCESS:
        console.log(payload);
        return {
          ...state,
          isAuthenticated: true,
          loading: false,
          user: payload,
        }
  
      default:
        return state;
    }
  }
  