import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import { API_BASE_URL } from '../../utility/apiConfig';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import './AdminAnalyticsPage.css'
import { useNavigate } from 'react-router-dom';

// Register the necessary Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function AdminAnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState([]);
  const [theaterChartData, setTheaterChartData] = useState({ labels: [], data: [] });
  const [movieChartData, setMovieChartData] = useState({ labels: [], data: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filterDays, setFilterDays] = useState(30);

  console.log(analyticsData)

  // Function to aggregate data by theater
  const aggregateDataByTheater = (data) => {
    const theaterTotals = {};

    data.forEach(item => {
      const theaterName = item._id.theatreName;
      theaterTotals[theaterName] = (theaterTotals[theaterName] || 0) + item.totalSeatsBooked;
    });

    return {
      labels: Object.keys(theaterTotals),
      data: Object.values(theaterTotals)
    };
  };

  // Function to aggregate data by movie
  const aggregateDataByMovie = (data) => {
    const movieTotals = {};

    data.forEach(item => {
      const movieName = item._id.movie;
      movieTotals[movieName] = (movieTotals[movieName] || 0) + item.totalSeatsBooked;
    });

    return {
      labels: Object.keys(movieTotals),
      data: Object.values(movieTotals)
    };
  };

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    const url = new URL(`${API_BASE_URL}/api/getbooking/analytics-dashboard`);
    url.searchParams.append('days', filterDays);

    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Something went wrong while fetching data');
        }
        return response.json();
      })
      .then(data => {
        setAnalyticsData(data);
        setTheaterChartData(aggregateDataByTheater(data));
        setMovieChartData(aggregateDataByMovie(data));
      })
      .catch(err => {
        setError(err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [filterDays]);

  const createChartOptions = (title) => {
    return {
      plugins: {
        title: {
          display: true,
          text: title
        },
        legend: {
          display: true
        }
      },
      scales: {
        y: {
          beginAtZero: true
        },
        x: {
          beginAtZero: true
        }
      }
    };
  };

  const TheaterChart = () => {
    const chartData = {
      labels: theaterChartData.labels,
      datasets: [
        {
          label: 'Total Seats Booked',
          data: theaterChartData.data,
          backgroundColor: 'rgba(53, 162, 235, 0.5)'
        }
      ]
    };

    return <Bar data={chartData} options={createChartOptions('Total Seats Booked Per Theater')} />;
  };

  const MovieChart = () => {
    const chartData = {
      labels: movieChartData.labels,
      datasets: [
        {
          label: 'Total Seats Booked',
          data: movieChartData.data,
          backgroundColor: 'rgba(255, 99, 132, 0.5)'
        }
      ]
    };

    return <Bar data={chartData} options={createChartOptions('Total Seats Booked Per Movie')} />;
  };

  const navigate = useNavigate();
  const goBack = () => {
    navigate('/admin'); // Navigate back to '/admin'
  };

  // Function to handle filter change
  const handleFilterChange = (event) => {
    setFilterDays(event.target.value);
  };

  return (
    <div>
      <Navbar />
      <div  onClick={goBack}>
        <Button
          color="success"
          variant="outlined"
          size="small"
          style={{ marginLeft: '20px', marginTop: '10px' }}
        >
           Back
        </Button>
      </div>
      <h1 className='pageTitle'>Analytics Dashboard 👋</h1>
      <div className="topBar">
        <FormControl className='formControl'>
          <InputLabel id="demo-simple-select-outlined-label">Filter Days</InputLabel>
          <Select
            labelId="demo-simple-select-outlined-label"
            id="demo-simple-select-outlined"
            value={filterDays}
            onChange={handleFilterChange}
            label="Filter Days"
            style={{ color: 'black' }}
            className='selectElement'
          >
            <MenuItem value={30}>30 Days</MenuItem>
            <MenuItem value={60}>60 Days</MenuItem>
            <MenuItem value={90}>90 Days</MenuItem>
            {/* <MenuItem value={9000}>Last 9000 Days</MenuItem> */}
          </Select>
        </FormControl>
      </div>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {theaterChartData.labels.length > 0 && (
        <div className='chartContainer'>
          <TheaterChart />
        </div>
      )}
      {movieChartData.labels.length > 0 && (
        <div className='chartContainer'>
          <MovieChart />
        </div>
      )}
    </div>
  );
}

export default AdminAnalyticsPage;