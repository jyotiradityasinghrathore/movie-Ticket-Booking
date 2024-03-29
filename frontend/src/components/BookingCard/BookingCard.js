import React from 'react'
import "./BookingCard.css"
import {format} from 'date-fns';
import Button from '../Button/Button';
import axios from 'axios';
import store from '../../store.js'
import { loadUser } from '../../actions/auth';
import { API_BASE_URL } from '../../utility/apiConfig';

const BookingCard = ({data}) => {
  // console.log(data);
  const currentDate = new Date();
  const propDate = new Date(data.date);
  const formattedDate = data?.date ? format(new Date(data.date), 'dd MMM') : '';

  
  const isDateAfterCurrent=
  propDate.getMonth() > currentDate.getMonth() ||
  (propDate.getMonth() === currentDate.getMonth() && propDate.getDate() > currentDate.getDate());

  console.log(isDateAfterCurrent)

  // const isDateAfterCurrent = propDate < currentDate;
  // console.log(isDateAfterCurrent)

  const handleCancelTicket = async (user, booking) => {
    try {
      // Make a POST request to the /cancel-and-refund endpoint
      const response = await axios.post(`${API_BASE_URL}/api/cancel`, {
        user: user,
        booking: booking,
      });
  
      // Handle the cancellation and refund response accordingly
      console.log('Cancellation and Refund response:', response.data);
  
      // If you need to update your Redux store or state, do it here
  
      // Return any necessary data
      return response.data;
    } catch (error) {
      console.error('Cancellation and Refund error:', error.response ? error.response.data : error.message);
      // Handle errors appropriately
      throw error;
    }
  }

  const cancelTicket = () => {
    const shouldRefund = window.confirm('Are you sure you want to cancel the ticket and request refund?');
    if (shouldRefund) { 
      handleCancelTicket(data.user, data._id)
      .then((result) => {
        // Handle the result if needed
        console.log('Cancellation and Refund result:', result);
        store.dispatch(loadUser());
      })
      .catch((error) => {
        // Handle errors
        console.error('Cancellation and Refund error:', error);
      });
  }
}
  return (
    <div className='bookingcard'>
      <div className='bookingcard-date'>
        <p>Date - </p>
        {formattedDate}
        {/* {format(new Date(data ? data.date : '2023-12-08T08:00:00.000Z'), 'dd MMM')} */}
      </div>
      <div className='bookingcard-movie'>
        <p>Movie Title -</p>
        {data.movie ? data.movie.title : ""}
      </div>
      <div className='bookingcard-tickets'>
        <p>Ticket (s) -</p>
        <div className='ticket-seats'>
          {data && data.seats && data.seats.map((seat, idx) => {
            return (
              <div key={idx}>
                {seat}
              </div>
            )
          })}
        </div>
      </div>
      <div className='bookingcard-price'>
        <p>Price - </p>
        ${data.ticketPrice}
      </div>
      <div onClick={cancelTicket} className='bookingcard-cancel-btn'>
        {isDateAfterCurrent && (<Button  text={'Request Refund'}/>)}
      </div>
      
      
      {/* {data} */}
    </div>
  )
}

export default BookingCard
