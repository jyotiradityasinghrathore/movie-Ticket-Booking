import React, {useEffect} from 'react';
import './App.css';
import LoginPage from './pages/Login&RegisterPage/LoginPage'; // Import the LoginSignupPage component
import logo from './logo.svg'; // Import the logo image
import Register from './pages/Login&RegisterPage/UserRegister'; 
import Alert from './pages/alert.js';

import {
  createBrowserRouter,
  RouterProvider,
  BrowserRouter as Router, Route, Switch
} from "react-router-dom";
import LandingPage from './pages/LandingPage/LandingPage.js';
import BookingPage from './pages/BookingPage/BookingPage.js';
import SeatBookingPage from './pages/SeatBookingPage/SeatBookingPage';
import AdminPage from './pages/AdminPage/AdminPage';
import PaymentSuccess from './pages/PaymentSuccess/PaymentSuccess'
import ProfilePage from './pages/ProfilePage/ProfilePage';
import { loadUser } from './actions/auth.js';
import setAuthToken from './utility/setAuthToken.js';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux/es/hooks/useSelector';

//Redux
import { Provider } from 'react-redux';
import store from './store.js'
import BookingConfirmation from './pages/BookingConfirmation/BookingConfirmation';
import GetPremiumPage from './pages/GetPremiumPage/GetPremiumPage';
import AdminAnalyticsPage from './pages/AdminAnalyticsPage/AdminAnalyticsPage';

if (localStorage.token){
  setAuthToken(localStorage.token);
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/login",
    element: <LoginPage />
  },
  {
    path: "/booking",
    element: <BookingPage />
  },
  {
    path: "/seat-booking",
    element: <SeatBookingPage />
  },
  {
    path: "/admin",
    element: <AdminPage />
  },
  {
    path: "/admin/analytics",
    element: <AdminAnalyticsPage />
  },
  {
    path: "/payment-success",
    element: <PaymentSuccess />
  },
  {
    path: "/register",
    element: <Register />
  },
  {
    path: "/booking-confirmation",
    element: <BookingConfirmation/>
  },
  {
    path: "/profile",
    element: <ProfilePage />
  },
  {
    path: '/get-premium',
    element: <GetPremiumPage />
  }
]);

function App() {

  // const userData = useSelector((state) => state.auth.user);
  // console.log(userData);

  useEffect(()=>{
    store.dispatch(loadUser());

  },[]);
  
  return (
    <Provider store={store}> {/* Wrap your App with the Provider component */}
      <div className="main">
      <Alert />
        <RouterProvider router={router} />
      </div>
    </Provider>
  );

}

export default App;

