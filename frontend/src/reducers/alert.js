// reducers/alert.js
import { SET_ALERT, REMOVE_ALERT } from '../actions/types';

const initialState = [];

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case SET_ALERT:
      return [...state, payload]; // Add the new alert to the state
    case REMOVE_ALERT:
      return state.filter((alert) => alert.id !== payload); // Remove the alert by ID
    default:
      return state;
  }
}
