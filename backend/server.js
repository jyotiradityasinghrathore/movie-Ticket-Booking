import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import mongoose from "mongoose"

import usersRoute from './routes/api/users.js';
import authRoute from './routes/api/auth.js';
import moviesRoute from './routes/api/movies.js';
import upcomingMoviesRouter from './routes/api/upcoming-movies.js'
import bookingRoute from './routes/api/booking.js'
import cancelRoute from './routes/api/cancel.js'
import getBookingRoute from './routes/api/getBooking.js'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

//Connect Database
const PORT = process.env.PORT;

const connect = async () => {
    try {
        await mongoose.connect(process.env.DB_URI)
        console.log("Connected to MongoDB")
    } catch(error) {
        throw error
    }
}

//Init Middleware
app.use( express.json({extended:false}));

// Define Routes

app.use('/api/booking', bookingRoute);
app.use('/api/getbooking', getBookingRoute);
app.use('/api/users', usersRoute);
app.use('/api/auth', authRoute);
app.use('/api/movies', moviesRoute);
app.use('/api/upcoming-movies', upcomingMoviesRouter);
app.use('/api/cancel', cancelRoute);


app.get("/", (req, res) => {
    res.status(200).json({message: 'Hello World!'})
})

app.listen(PORT, ()  => {
    connect()
    console.log(`Server started on port ${PORT}`)
});