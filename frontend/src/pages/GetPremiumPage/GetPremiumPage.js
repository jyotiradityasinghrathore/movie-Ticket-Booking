import React from 'react'
import Navbar from '../../components/Navbar/Navbar'
import './GetPremiumPage.css'
import Button from '../../components/Button/Button'
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'
import { API_BASE_URL } from '../../utility/apiConfig.js'
import { PREMIUM_USER_SUCCESS } from '../../actions/types'

function GetPremiumPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth.user?._id);

  const getPremium = () => {
    fetch(`${API_BASE_URL}/api/users/get-premium/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            // Include other headers as necessary
        },
    })
    .then(resp => resp.json())
    .then(data => {
        console.log('Updated user data:', data);
        // Dispatch action to update user state in Redux
        dispatch({ type: PREMIUM_USER_SUCCESS, payload: data });
        navigate('/payment-success')
    })
    .catch(err => {
        console.log('Error in upgrading membership:', err);
        // Handle error, perhaps show an error message to the user
    });
  };


  return (
    <div>
      <Navbar />
      <div className="get-premium-container">
        <div className="get-premium-card">
            <h1 className="premium-text">Premium Membership</h1>
            <div className="transaction-details">
                <div className="detail">
                    <span>Transaction Detail</span>
                    <span>$15.00</span>
                </div>
                <div className="detail">
                    <span>Premium Membership (1 Year)</span>
                </div>
                <hr />
                <div className="total-payment">
                    <span>Total payment</span>
                    <span>$15.00</span>
                </div>
                </div>
                <div className="button-container" onClick={getPremium}>
                    <Button text='Get Premium' />
                </div>
            </div>
      </div>
    </div>
  )
}

export default GetPremiumPage
