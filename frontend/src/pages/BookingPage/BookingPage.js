import React, {useState, useEffect} from 'react'
import "./BookingPage.css"
import PosterCard from '../../components/PosterCard/PosterCard';
import { Link } from 'react-router-dom';
import LocationButton from '../../components/LocationButton/LocationButton';
import DateButton from '../../components/DateButton/DateButton';
import TimeButton from '../../components/TimeButton/TimeButton';
import Button from '../../components/Button/Button';
import { addDays, format } from 'date-fns';


import { useNavigate } from 'react-router-dom';


const BookingPage = ({movie, theatres}) => {

    const navigate = useNavigate();
    console.log(movie);
    // console.log(theatres);
    
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);

    
    // const locs = movie.theatres;
    // console.log(locs);
    
    const [timings , setTimings] = useState(null);
    
    
    // For selected buttons in the UI 
    const locations = ['San Jose', 'San Francisco', 'New York', 'Boston']
    const handleLocationClick = (location) => {
        // console.log(location);
        setSelectedLocation(location.name);
        console.log(location.name);
        setTimings(location.timings);
    };

    const generateDateObjects = () => {
        const today = new Date();
        const dates = [];
      
        for (let i = 0; i < 5; i++) {
          const currentDate = addDays(today, i);
          const formattedDate = format(currentDate, 'd MMM');
          const dayOfWeek = format(currentDate, 'EEE');
      
          dates.push({ date: formattedDate, day: dayOfWeek });
        }
      
        return dates;
      };

    const dates = generateDateObjects();
    const handleDatesClick = (date) => {
        setSelectedDate(date.date);
        console.log(date);
    };  

    const times = ["15:40", "17:20", "20:40", "21:00"]
    const handleTimeClick = (time) => {
        // console.log(time);
        setSelectedTime(time)
        // console.log('TIME -->', time);
    }

    if (!movie || !theatres) {
        return <p>Loading...</p>; // or any other loading indicator
    }
    const handleProceed = () => {
        // Assuming movieInfo is an object containing movie information
        // Check if the user is authenticated
        const isAuthenticated = !!localStorage.getItem('token');
        console.log(isAuthenticated);

        // Redirect to the seat-booking page if authenticated; otherwise, redirect to login
        // navigate.push({
        //     pathname: isAuthenticated ? '/seat-booking' : '/login',
        //     state: isAuthenticated ? { movie } : undefined,
        // });
        // Check if any of the fields is not selected
        if (!movie || !selectedLocation || !selectedTime || !selectedDate) {
            // If any field is not selected, show an alert
            alert('Please select all appropriate fields');
        } else {
            navigate(isAuthenticated ? '/seat-booking' : '/login', { state: isAuthenticated ? { movie, selectedLocation, selectedTime, selectedDate } : undefined });
        }

    };
    const redirectPath = !!localStorage.getItem('token') ? '/seat-booking' : '/login';
    return (
    <div className="booking-page"> 
        <div className='booking-page-content'>
            <div className="left-side">
                {/* City name boxes */}
                <div className="section">
                    <h2>Theater</h2>
                    <div className="city-boxes">
                        {theatres.map((location) => {
                            return(
                                <div key={location.name} onClick={() => handleLocationClick(location)}>
                                    <LocationButton location={location.name} selected={selectedLocation === location.name}/>
                                </div>
                            )
                            
                        })}
                    </div>
                </div>

                {/* Date options */}
                <div className="section">
                    <h2>Date</h2>
                    <div className="date-boxes">
                    {dates.map((date) => {
                        return (
                            <div className='individual-date-box' key={date.date} onClick={() => handleDatesClick(date)}>
                                <DateButton date={date} selected={selectedDate === date.date}/>
                            </div>      
                        )
                    })}
                    </div>
                </div>

                {/* Time options */}
                <div className="section">
                        <h2>Time</h2>
                        <div className="time-boxes">
                        {!timings && times.map((time) => {
                            return (
                                <div key={time} className="time-box" onClick={() => handleTimeClick(time)}>
                                    <TimeButton time={time} selected={selectedTime === time} />
                                </div>
                            )
                        })}
                        {timings && timings.map((time) => {
                            console.log(time)
                            return (
                                <div key={time._id} className="time-box" onClick={() => handleTimeClick(time)}>
                                    <TimeButton time={time.timing} selected={selectedTime === time} />
                                </div>
                            )
                        })}
                        </div>
                </div>
            </div>
            
            <div className="right-side">
                <PosterCard movie={movie}/>
            </div>
        </div>
        <div onClick={handleProceed}>
            <Button text={'Proceed'}/>
        </div>
    </div>
  )
}

export default BookingPage;
