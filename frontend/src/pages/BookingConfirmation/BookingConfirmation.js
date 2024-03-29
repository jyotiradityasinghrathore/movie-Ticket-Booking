import React, { useState, useEffect } from 'react'
import axios from 'axios';
import './BookingConfirmation.css'
// import { useNavigate } from 'react-router-dom'
import { useLocation, useNavigate } from 'react-router-dom';
import convertSeatToString from '../../utility/convertSeatToString';
import { useSelector } from 'react-redux/es/hooks/useSelector';
import Button from '../../components/Button/Button';
// import {parse, isTuesday} from 'date-fns';
import { parse, isTuesday, isBefore, setHours, setMinutes, format } from 'date-fns';
import { API_BASE_URL } from '../../utility/apiConfig';


const BookingConfirmation = () => {

    const navigate = useNavigate();

    const userData = useSelector((state) => state.auth.user) || '';
    console.log(userData);

    const location = useLocation();
    console.log(location.state);
    const movie = location.state?.movie;
    const timing = location.state?.timing;
    const theatreName = location.state?.theatre;
    const theatre = location.state?.movie.theatres.filter((t) => t.name === theatreName);
    // console.log(theatre);
    const discount_before_6pm = theatre.discount_before_6pm;
    const discount_on_Tuesdays = theatre.discount_on_Tuesdays;
    // console.log(discount_before_6pm);
    // console.log(discount_on_Tuesdays);
    const seats = location.state?.seats;
    const selectedSeats = location.state?.selectedSeats;
    const date = location.state?.date;
    const parsedDate = parse(date, 'd MMM', new Date());
    const showTiming = parse(timing.timing, 'HH:mm', new Date());
    const sixPM = setHours(setMinutes(new Date(), 0), 18);
    console.log(date);
    
    const handleBack = () => {
        navigate(-1)
    }
    

    const handleRewardUse = () => {
        setUseRewardPoints(!useRewardPoints)
    };

    const handleConfirmPayment = async () => {
        const user = userData._id; // Replace with the actual user ID
        const currentMovie = movie._id; // Replace with the actual movie ID
        console.log("DATE -->", timing);
        const currentTheatre = theatre[0]._id;
        const ticketPrice = total // Replace with the actual theatre ID
        // const ticketPrice = 10; 

        console.log("User -->",user)
        console.log("currentMovie -->",currentMovie);
        console.log("currentTheatre -->",currentTheatre);
        console.log("TicketPrice", ticketPrice);
        console.log(selectedSeats);

        // const parsedDate = parse(date, 'd MMM', new Date());
        axios.post(`${API_BASE_URL}/api/booking`, {
            user: user,
            movie: currentMovie,
            theatre: currentTheatre,
            seats: selectedSeats,
            ticketPrice: ticketPrice,
            date: date,
            timing: timing,
            rewardPoints: remainingRewardPoints
        }).then(response => {
            console.log('Booking response:', response.data);
            navigate('/payment-success')
            // Update your Redux store with the booking data if needed
          })
          .catch(error => {
            console.error('Error:', error.response ? error.response.data : error.message);
            // Handle errors appropriately
        });

    }

    const [useRewardPoints, setUseRewardPoints] = useState(false);

    
    // useEffect(() => {
    //   setTotalPayment(calculateTotalPayment());
    // }, [])
    
    const [total, setTotal] = useState(0);
    const [remainingRewardPoints, setRemainingRewardPoints] = useState(0);

    
    const calculateDiscount = () => {
        let totalDiscount = 0
        const parsedDate = parse(date, 'd MMM', new Date());
        const showTiming = parse(timing.timing, 'HH:mm', new Date());
        const sixPM = setHours(setMinutes(new Date(), 0), 18);

        if (isTuesday(parsedDate) && theatre[0].discount_on_Tuesdays > 0) {
            totalDiscount = totalDiscount + theatre[0].discount_on_Tuesdays
        }
        
        if (isBefore(showTiming, sixPM) && theatre[0].discount_before_6pm > 0 ) {
        // Apply discount logic here
            totalDiscount = totalDiscount + theatre[0].discount_before_6pm
        }

        console.log(totalDiscount)
        return totalDiscount 
        // Optionally, you can format the time for display purposes
        // const formattedTime = format(showTiming, 'hh:mm a');
        // console.log('Formatted Show Timing:', formattedTime);
    }
    const updateTotalAndPoints = () => {
        const onlineServiceFee = userData.membership === 'free' ? 1.5 * selectedSeats.length : 0;
        const baseTotal = 15 * selectedSeats.length + onlineServiceFee;
        const rewardPointsUsed = useRewardPoints ? Math.min(baseTotal / 10, userData.rewardsPoints) : 0;
        const newTotal = Math.max(baseTotal - rewardPointsUsed * 10, 0);
        const discount = (calculateDiscount() * newTotal) / 100;
        const evenNewerTotal = newTotal - discount;
        const newRemainingPoints = useRewardPoints ? Math.max(userData.rewardsPoints - rewardPointsUsed * 10, 0) : userData.rewardsPoints;
        setRemainingRewardPoints(newRemainingPoints);
        setTotal(evenNewerTotal);
        // console.log(newRemainingPoints);
        
      };
    
      // Update totals and points whenever relevant values change
      useEffect(() => {
        updateTotalAndPoints();
      }, [selectedSeats, useRewardPoints, userData]);

  return (
    <div className='booking-confirmation'>
        <div className='booking-detail'>
            <h1>Booking Detail</h1>
            <h2>Schedule</h2>
        </div>
        <div className='movie-title-container'>
            <div className='movie-title-header'>
                Movie Title :
            </div>
            <div className='movie-title'>
                {movie.title}
            </div>
        </div>
        <div className='booking-confirmation-date'>
            <div className='movie-title-header'>
                Date
            </div>
            <div className='movie-title'>
                {date}, 2023
            </div>
        </div>
        <div className='tickets'>
            <p>
                Tickets {`(${selectedSeats.length})`}
            </p>
            <p>Hours</p> 
        </div>
        <div className='ticket-details'>
            <div className='seat-numbers'>
                {selectedSeats.map((seat, id) => {
                    return(
                        <div key={id}>
                            {convertSeatToString(seat)}
                        </div>
                    )
                })}
            </div>
            <div>
                {timing.timing}
            </div>
        </div>
        <div className='transaction'>
            <div className='transaction-detail'>
                Transaction Detail 
            </div>
            <div className='regular-seat'>
                <div>
                    REGULAR SEAT
                </div>
                <div>
                    $ 15.00 x {selectedSeats.length}
                </div>
            </div>
            <div className='online-service-fee'>
                <div>
                    Online Service Fee
                </div>
                <div>
                    {userData.membership === 'free' ? `$ 1.50 x ${selectedSeats.length}` : `0`}
                </div>
            </div>
            <div className='discount'>
                <div className='discount-6pm'>
                    Discount for shows before 6pm
                    <div>
                        {isBefore(showTiming, sixPM) ? theatre[0].discount_before_6pm : 0} %
                    </div>
                </div>
                <div className='discount-tuesday'>
                    Discount for shows on Tuesdays 
                    <div>
                        {isTuesday(parsedDate) ? theatre[0].discount_on_Tuesdays: 0} %
                    </div>
                </div>
            </div>
            <div className='total-payment'>
                <div className='total'>Total Payment</div>
                <div>
                    {`$ ${Math.round(total)}`}
                </div>
            </div>
            <div className='reward-points'>
                Reward Points 
                <div>
                {`${remainingRewardPoints}`}
                </div>
            </div>
            <div className='confirm-btn'>
                {/* <div onClick={handleBack}>
                    <Button text={'Back'} />
                </div> */}
                <div onClick={handleRewardUse}>
                    <Button text={useRewardPoints ? `Don't use Reward Points` : 'Use Reward Points'} />
                </div>
                <div onClick={handleConfirmPayment}>
                    <Button className="btn" text={'Confirm payment'}/>
                </div>
            </div>
            </div>
            
        </div>
   
  )
}

export default BookingConfirmation
