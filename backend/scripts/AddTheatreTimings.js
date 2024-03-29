
import mongoose from 'mongoose';
// import Movies from '../models/Movies.js';
import Movies from '../models/Movies.js'
import Theatre from '../models/Theatre.js';
import ShowTiming from '../models/ShowTiming.js';





// Assuming convertSeatToString is defined as you provided
const convertSeatToString = (seat) => {
    // console.log(seat)
    const rowLabel = String.fromCharCode('A'.charCodeAt(0) + seat.rowIndex);
    const seatLabel = seat.seatIndex + 1; // Adding 1 to convert from 0-based index to 1-based seat number
    return `${rowLabel}${seatLabel}`;
}

// const generateUniqueTiming = (_id, incrementMinutes) => {
//   const idHash = parseInt(_id.toString().slice(0, 8), 16); // Use the first 4 bytes of _id as a number
//   const initialHour = 12 + Math.floor(idHash / 60); // Start from 12:00 and increment based on _id
//   const initialMinute = idHash % 60;

//   const currentTime = new Date();
//   currentTime.setHours(initialHour);
//   currentTime.setMinutes(initialMinute);

//   // Increment the time for each unique timing
//   currentTime.setMinutes(currentTime.getMinutes() + incrementMinutes);

//   const hours = currentTime.getHours().toString().padStart(2, '0');
//   const minutes = currentTime.getMinutes().toString().padStart(2, '0');

//   return `${hours}:${minutes}`;
// };

// const generateUniqueTiming = (_id, incrementMinutes) => {
//   const idHash = parseInt(_id.toString().slice(0, 8), 16); // Use the first 4 bytes of _id as a number
//   const initialHour = 12 + Math.floor(idHash / 60); // Start from 12:00 and increment based on _id
//   const initialMinute = idHash % 60;

//   const currentTime = new Date();
//   currentTime.setHours(initialHour);
//   currentTime.setMinutes(initialMinute);

//   // Increment the time for each unique timing
//   currentTime.setMinutes(currentTime.getMinutes() + incrementMinutes);

//   const hours = currentTime.getHours().toString().padStart(2, '0');
//   const minutes = currentTime.getMinutes().toString().padStart(2, '0');

//   return `${hours}:${minutes}`;
// };
// const generateUniqueTiming = (existingTimings) => {
//   const maxAttempts = 100;
//   let attempts = 0;

//   while (attempts < maxAttempts) {
//       const currentTime = new Date();
//       currentTime.setHours(10); // Start from 10 am
//       currentTime.setMinutes(Math.floor(Math.random() * 36) * 5); // Randomize minutes in multiples of 5
//       currentTime.setSeconds(0); // Reset seconds

//       const hours = currentTime.getHours();
//       const minutes = currentTime.getMinutes();

//       const formattedHours = hours < 10 ? `0${hours}` : `${hours}`;
//       const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;

//       const newTiming = `${formattedHours}:${formattedMinutes}`;

//       // Check if the new timing already exists
//       if (!existingTimings || !existingTimings.includes(newTiming)) {
//         return newTiming;
//       }

//       attempts++;
//   }

//   throw new Error("Failed to generate a unique timing within the maximum attempts.");
// };

const generateUniqueTiming = (existingTimings) => {
  const maxAttempts = 100;
  let attempts = 0;

  while (attempts < maxAttempts) {
    const currentTime = new Date();
    const startHour = 10; // Start from 10 am
    const endHour = 23; // End at 11 pm
    currentTime.setHours(startHour + Math.floor(Math.random() * (endHour - startHour + 1)));
    currentTime.setMinutes(Math.floor(Math.random() * 36) * 5); // Randomize minutes in multiples of 5
    currentTime.setSeconds(0); // Reset seconds

    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();

    const formattedHours = hours < 10 ? `0${hours}` : `${hours}`;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;

    const newTiming = `${formattedHours}:${formattedMinutes}`;

    // Check if the new timing already exists
    if (!existingTimings || !existingTimings.includes(newTiming)) {
      return newTiming;
    }

    attempts++;
  }

  throw new Error("Failed to generate a unique timing within the maximum attempts.");
};

async function connectAndUpdate() {
    const uri = "mongodb+srv://orientalsquad202:orientalsquad202@movieapp.dh2z3qm.mongodb.net/movie_theater?retryWrites=true&w=majority"; // Replace with your MongoDB connection URI
    await mongoose.connect(uri);

    try {
        
    
    // Function to update timings for a given movie and theatre
    const updateTimings = async (movie, theatre) => {
        const timings = [];

        const existingTimings = [];
        for (const timingId of theatre.timings) {
            const existingTiming = await ShowTiming.findById(timingId._id);
            existingTimings.push(existingTiming.timing);
        }
    
        // Generate unique timings for each show
        for (let i = 0; i < theatre.timings.length; i++) {
            const uniqueTiming = generateUniqueTiming(existingTimings);
    
            // Update the timing in the ShowTiming document
            const showTiming = await ShowTiming.findById(theatre.timings[i]._id);
            showTiming.timing = uniqueTiming;
            timings.push(showTiming);
            console.log("SHOWTIMING -->", showTiming.timing);
            await showTiming.save();
            existingTimings.push(uniqueTiming);
        }
        
        // Update the timings in the Theatre document
        // theatre.timings = timings;
        // await theatre.save();
    };
    
    // Function to update timings for all movies and theaters
    // const updateAllTimings = async () => {
        const movies = await Movies.find();
    
        // Iterate through each movie
        for (let i = 0; i < movies.length; i++) {
            const movie = movies[i];
    
            // Iterate through each theater in the movie
            for (let j = 0; j < movie.theatres.length; j++) {
                const theatreId = movie.theatres[j]._id;
                const theatre = await Theatre.findById(theatreId);
    
                // Update timings for the movie and theater
                await updateTimings(movie, theatre);

            }
        // }
    
        console.log('All timings updated successfully');
    }

    // updateAllTimings();
    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await mongoose.disconnect();
    }
}


connectAndUpdate().catch(console.error);


// import mongoose from 'mongoose';


// import cors from "cors"
// import dotenv from "dotenv"
// // import MovieSchema from '../models/Movies.js';
// import Movies from '../models/Movies.js';

// // console.log(Movie);
// // const mongoose = require('mongoose');

// // const Movies = mongoose.model('Movies')

// async function connectAndUpdate() {
//     const uri = "mongodb+srv://orientalsquad202:orientalsquad202@movieapp.dh2z3qm.mongodb.net/movie_theater?retryWrites=true&w=majority"; // Replace with your MongoDB connection URI and database name
//     await mongoose.connect(uri);

//     try {
//         console.log("Movies -- > ",Movies);
//         const MovieSchema = mongoose.Schema;
//         console.log("Movies Schema -->", MovieSchema);
//         const Movies = mongoose.model('Movies', MovieSchema); // Assuming you have defined the movieSchema

//         // Define the common timings array
//         const commonTimings = ['15:40', '17:20', '8:40', '21:00'];

//         // Update documents without the theatres field
//         const result = await NewMovies.updateMany(
//             { theatres: { $exists: true } }, // Filter for documents without the theatres field
//             {
//                 $set: {
//                     theatres: [
//                         { name: 'San Jose', location: 'California', timings: commonTimings },
//                         { name: 'San Francisco', location: 'California', timings: commonTimings },
//                         { name: 'Las Vegas', location: 'Las Vegas', timings: commonTimings },
//                     ],
//                 },
//                 // You can modify this update statement based on your specific needs
//             }
//         );

//         console.log(`${result.nModified} documents updated successfully`);
//     } finally {
//         await mongoose.disconnect();
//     }
// }

// connectAndUpdate().catch(console.error);


