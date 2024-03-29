import { API_BASE_URL } from "./apiConfig";

const getUpcomingMovies = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/upcoming-movies`); 
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

export default getUpcomingMovies;