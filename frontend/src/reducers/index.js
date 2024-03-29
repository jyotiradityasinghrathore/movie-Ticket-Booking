// reducers/index.js
import { combineReducers } from 'redux';
// import alert
import alertReducer from './alert';
import authReducer from './auth';

const rootReducer = combineReducers({
  alert: alertReducer,
  auth: authReducer,
  // Add other reducers as needed
});

export default rootReducer;