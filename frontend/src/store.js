import { createStore, applyMiddleware} from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

const initialState = {};

const middleware = [thunk];

// const store = createStore(rootReducer, initialState, composeWithDevTools(applyMiddleware(...middleware)));
const store = createStore(
    rootReducer,
    initialState || {}, // Set to an empty object if initialState is not provided
    composeWithDevTools(applyMiddleware(...middleware))
);
export default store;