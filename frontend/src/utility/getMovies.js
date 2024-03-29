import { API_BASE_URL } from "./apiConfig";

const getMovies = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/movies`); // Replace with your API endpoint URL
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching movies:', error);
      return [];
    }
}

export default getMovies;

// ---------------------------------------------------
// Usage example:
//   getMovies()
//     .then(movies => {
//       console.log('Fetched movies:', movies);
//     })
//     .catch(error => {
//       console.error('An error occurred:', error);
//     });
  