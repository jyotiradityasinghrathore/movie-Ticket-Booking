import React, {useEffect, useState} from 'react'
import Navbar from '../../components/Navbar/Navbar'
import './ProfilePage.css'
import { useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux/es/hooks/useSelector'
import Button from '../../components/Button/Button'
import BookingCard from '../../components/BookingCard/BookingCard'
import { Link } from 'react-router-dom';


const ProfilePage = () => {

  const userData = useSelector((state) => state.auth.user);
  console.log(userData);

  const isUserAdmin = userData && userData.membership === 'employee';
  const isUserPremium = userData && userData.membership === 'premium';

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // const [rewardPoints, setRewardPoints] = useState(userData.rewardsPoints);
  // const [bookings, setBookings] = useState(userData.bookings);

  // useEffect(() => {
  //   // const bookings = userData.bookings
  //   setRewardPoints(userData ? userData.rewardsPoints : 0);
  //   setBookings(userData ? userData.bookings : [])
  // }, [])
  
  
  return (
    <div>
        <div>
            <Navbar />
        </div>
        {/* <div className='profile-user-info'>
          <h1> HELLO {userData ? userData.name.toUpperCase() : ''}</h1>
        </div> */}
        {!isUserAdmin && (
            <div>
              <div className='profile-reward-points'>
                  <h1>Membership - {isUserPremium ? 'PREMIUM' : 'REGULAR'}</h1>
                </div>
                <div className='profile-reward-points'>
                  <h1>Reward Points - {userData ? Math.round(userData.rewardsPoints) : 0}</h1>
                </div>


                <div className='profile-booking'>
                  {userData ? userData.bookings.reverse().map((booking) => (
                    <div key={booking._id}>
                      <BookingCard data={booking} />
                    </div>
                  )) : <></>}
                </div>
            </div>

        )}
      </div>)}



export default ProfilePage;
