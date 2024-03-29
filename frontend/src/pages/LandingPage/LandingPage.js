import React,{useState, useEffect, useRef} from 'react';
import './LandingPage.css'
import Navbar from '../../components/Navbar/Navbar';
import getMovies from '../../utility/getMovies';
import getUpcomingMovies from '../../utility/getUpcomingMovies';
import PosterCard from '../../components/PosterCard/PosterCard';
import Button from '../../components/Button/Button';
import MembershipBox from '../../components/MembershipBox/MembershipBox';
import BookingPage from '../BookingPage/BookingPage';
import SeatBookingPage from '../SeatBookingPage/SeatBookingPage';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux/es/hooks/useSelector';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {

  const userData = useSelector((state) => state.auth.user);
  console.log(userData);

  const navigate = useNavigate()

  if (userData?.role === 'employee'){
    navigate('/admin')
  }
  
  const [movies, setMovies] = useState([]);
  const [upcomingMovies,setUpcomingMovies] = useState([]);

  const [selectedMovie, setSelectedMovie] = useState([])
  const [selectedMovieTheatres, setSelectedMovieTheatres] = useState([]);
  
  const bookingPageRef = useRef();

  // const userData = useSelector((state) => state.auth.user);
  // console.log(userData);
  
  // useEffect(() => {
    
  // }, [])
  


  const handlePosterCardClick = (movie) => {

    setSelectedMovie(movie);
    setSelectedMovieTheatres(movie.theatres)
    // console.log(selectedMovieTheatres);

    // Scroll to the bookingPage section with an offset
    if (bookingPageRef.current) {
      const offset = -600; // Adjust the offset as needed
      const targetPosition = bookingPageRef.current.offsetTop - offset;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth',
      });
    }
    
  }

  const redirectPath = !!localStorage.getItem('token') ? '/seat-booking' : '/login';
  // console.log(redirectPath)
 

  useEffect(() => {
    // Fetch movies when the component mounts
    getMovies()
      .then((data) => {
        // console.log(data);
        console.log("Movie data ---> ",data);
        setMovies(data);
        setSelectedMovie(data[0]);
        setSelectedMovieTheatres(data[0].theatres)
      })
      .catch((error) => {
        console.error('An error occurred:', error);
      });
          // Fetch upcoming movies
    getUpcomingMovies()
    .then((upcomingMoviesData) => {
      console.log("Upcoming Movie data ---> ", upcomingMoviesData);
      setUpcomingMovies(upcomingMoviesData);
    })
    .catch((error) => {
      console.error('An error occurred while fetching upcoming movies:', error);
    });

  }, []);

  // const isAuthenticated = !!localStorage.getItem('token');

  return (
    <div className='container'>
      <Navbar/>
      <div className='title-1'>
        <h1>Now Showing</h1>
      </div>
      <div className='movies'>
        <div className="movie-tiles">
            {movies.map((movie) => {
                  return (
                    <div key={movie._id} ref={bookingPageRef} onClick={() => handlePosterCardClick(movie)}>
                        <PosterCard movie={movie}  />
                    </div>
                  ) 
            })}
        </div>
      </div>
      {/* <Link to={redirectPath}>
        <div className='proceed-btn'>
          <Button text={'Proceed'}/>
        </div>
      </Link> */}
      
      <BookingPage movie={selectedMovie} theatres={selectedMovieTheatres} />
      <div className='title-2'>
        <h1>Upcoming Movies</h1>
      </div>
    {/*Upcoming Movies Api has been added*/}
      <div className='movies'>
          <div className="movie-tiles">
              {upcomingMovies.map((movie) => {
                    return(
                      <div key={movie._id}>
                        <PosterCard movie={movie}/>
                      </div>
                    )
              })}
          </div>
        </div>

      { userData && userData.membership === 'free' && (
        <div>
          <div className='title-2'>
            <h1>Membership Options</h1>
          </div>
          <div className='membership'>
            {/* <MembershipBox text="Regular"/> */}
            <MembershipBox text="Premium"/>
          </div>
        </div>
      )}

    </div>
  );
}

export default LandingPage;
