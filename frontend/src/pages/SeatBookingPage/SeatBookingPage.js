import React, { useState, useEffect } from 'react';
import './SeatBookingPage.css'; // Import your CSS file for styling
import Button from '../../components/Button/Button';
import convertSeatToString from '../../utility/convertSeatToString'
import { useLocation, useNavigate } from 'react-router-dom';
const SeatBookingPage = () => {

    const location = useLocation();

    const navigate = useNavigate();

    console.log("State -->",location.state.selectedTime);
    const movie = location.state?.movie;
    const theatre = location.state?.selectedLocation;
    const timing = location.state?.selectedTime
    const seats = location.state?.selectedTime.seats;
    const date = location.state?.selectedDate;
    // console.log("Movie --->", movie)
    // console.log("Theatre -->", theatre)
    // console.log("Seats -->", seats)
    // console.log(location.state.selectedLocation)

    // console.log(movie.theatres.showTimings);
  
  
    const rows = 7;
  const seatsPerRow = 10;
//   const initialSeats = Array.from({ length: rows }, () =>
//     Array(seatsPerRow).fill(true)
// );

// Initialize seat availability state
const [seatAvailability, setSeatAvailability] = useState([]);
const [selectedSeats, setSelectedSeats] = useState([]);

    // console.log(seatAvailability);
    useEffect(() => {
      setSeatAvailability(seats)
    }, [])
    
    const handleBack = () => {
        navigate('/')
    }

    const handleProceed = () => {
        const isAuthenticated = !!localStorage.getItem('token');
        // console.log(isAuthenticated);

        // Redirect to the seat-booking page if authenticated; otherwise, redirect to login
        // navigate.push({
        //     pathname: isAuthenticated ? '/seat-booking' : '/login',
        //     state: isAuthenticated ? { movie } : undefined,
        // });
        if (selectedSeats.length === 0) {
            // If any field is not selected, show an alert
            alert('Please choose your seats');
        } else {
            navigate(isAuthenticated ? '/booking-confirmation' : '/login', { state: isAuthenticated ? { movie, theatre, seats, selectedSeats, date, timing } : undefined });
        }
        
    }
    
    // Function to handle seat click
    const handleSeatClick = (rowIndex, seatIndex) => {
        // console.log(seatAvailability)
        const returnUpdatedSeats = () => {
            const updatedSeats = [...seatAvailability];
            if (selectedSeats.length < 8 || updatedSeats[rowIndex][seatIndex].status === 'selected'){
                if (updatedSeats[rowIndex][seatIndex].status === 'available' || seatAvailability[rowIndex][seatIndex].status === 'selected'){
                    updatedSeats[rowIndex][seatIndex].status =
                    updatedSeats[rowIndex][seatIndex].status === 'selected'
                    ? 'available'
                    : 'selected';

                    const newFunc = () => {
                        const removeFromSelectedSeats = selectedSeats.some(
                            (seat) => seat.rowIndex === rowIndex && seat.seatIndex === seatIndex
                        );
                        if (removeFromSelectedSeats) {
                            return selectedSeats.filter(
                                (seat) => !(seat.rowIndex === rowIndex && seat.seatIndex === seatIndex)
                            );
                        }
                        else {
                            return [...selectedSeats,{rowIndex, seatIndex}]
                        }
                    }
                    
                    
                    setSelectedSeats(newFunc());
                }
                else {
                    window.alert("This seat is already booked, sorry try a different one!")
                }
            } else {
                window.alert("You can't select more than 8 seats.")
            }

            return updatedSeats;
        }



        setSeatAvailability(returnUpdatedSeats())
    };
  

  // Calculate the total number of available seats
//   const totalAvailableSeats = seatAvailability.reduce(
//     (total, row) => total + row.filter((seat) => seat).length,
//     0
//   );

  return (
    <div className="seat-booking-container">
        <div className='seat-booking-title'>
            <h2>Select Seat : {movie.title} in {theatre} at {timing.timing}</h2>
        </div>
      
        {/* <p>Total Available Seats: {totalAvailableSeats}</p> */}
        <div className="seat-grid">
            {/* {console.log(seatAvailability)} */}
            {seatAvailability.map((row, rowIndex) => (
            <div key={rowIndex} className="seat-row">
                {row.map((isAvailable, seatIndex) => (
                <div
                    key={seatIndex}
                    className={`seat ${isAvailable.status === 'available' ? 'available' : isAvailable.status === 'selected' ? 'selected' : 'unavailable'}`}
                    onClick={() => handleSeatClick(rowIndex, seatIndex)}
                >
                    {isAvailable.seatNumber}
                </div>
                ))}
            </div>
            ))}
            <div className='screen'>
                <p>SCREEN</p>
            </div>
        </div>

        <div className='seat-booking-footer'>
            <div className='total-amount-container'>
                <div>
                    Total Amount: 
                </div>
                {/* Change 15 to the price amount of the ticket */}
                <div className='amount'>
                    {'$'}{15*selectedSeats.length}
                </div>
            </div>
            <div className='seat-numbers-container'>
                <div >
                    Seat Numbers: 
                </div>
                <div className='seat-numbers'>
                    {/* {console.log(selectedSeats)} */}
                    {selectedSeats.map((seat,idx) => {
                        // console.log(seat);
                        return(
                            <p key={idx}>
                                {convertSeatToString(seat)}
                            </p>
                        )
                    })}
                </div>
            </div>
            <div className='seat-booking-btns'>
                <div onClick={handleBack}>
                    <Button text={'Back'} />
                </div>
                <div onClick={handleProceed}>
                    <Button text={'Proceed to Payment'} />
                </div>
            </div>
        </div>
    </div>
  );
};

export default SeatBookingPage;
