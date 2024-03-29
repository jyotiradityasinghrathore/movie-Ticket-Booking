import React, {useEffect} from 'react'
import './PaymentSuccess.css'
import Button from '../../components/Button/Button'
import Icon from '@mdi/react';
import { mdiCheckCircle } from '@mdi/js';
import { useNavigate } from 'react-router-dom';
// import store from './store.js'
import store from '../../store.js';
import { loadUser } from '../../actions/auth';



const PaymentSuccess = () => {
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate('/');
  }

  // const handleViewTicket = () => {
  //   navigate('/profile')
  // }

  useEffect(() => {
    store.dispatch(loadUser())
  }, [])

  
  return (
    <div className='payment-success'>
      <div className='payment-success-container'>
        <div className='payment-success-title'>
          Payment Success
        </div>
        <div className='payment-success-logo'>
          <Icon path={mdiCheckCircle} size={9} />
        </div>
        <div className='payment-success-buttons'>
          {/* <div className='payment-success-viewticket' onClick={handleViewTicket}>
            <Button text={'View Ticket'}/>
          </div> */}
          <div className='payment-success-viewticket' onClick={handleBackToHome}>
            <Button text={'Back To Home Page'} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentSuccess
