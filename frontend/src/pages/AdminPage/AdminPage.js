import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'; 
import { useNavigate } from 'react-router-dom'; 
import Navbar from '../../components/Navbar/Navbar'
import getMovies from '../../utility/getMovies'
import AdminMovieTable from '../../components/AdminMovieTable/AdminMovieTable';
import { setAlert } from '../../actions/alert'; 

function AdminPage() {
    const [movies, setMovies] = useState([]);
    const user = useSelector((state) => state.auth.user); 
    const navigate = useNavigate(); 

    useEffect(() => {
      // Check if the user has the "employee" role before fetching data
      if (user && user.role === 'employee') {
        getMovies()
          .then((data) => {
            console.log(data);
            setMovies(data);
          })
          .catch((error) => {
            console.error('An error occurred:', error);

          });
      } else {
        // Handle unauthorized access here (e.g., redirect to an error page)
        setAlert('Unauthorized access to AdminPage', 'alert');
        console.error('Unauthorized access to AdminPage');
        // You can redirect the user or display an error message
        navigate('/profile'); 
      }
    }, [user]);

    return (
        <div>
        <Navbar />
        <AdminMovieTable movies={movies} />
        </div>
    )
}

export default AdminPage
