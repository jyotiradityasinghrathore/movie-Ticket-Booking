import mongoose from "mongoose";
import Theatre from "../models/Theatre.js";
import Movies from "../models/Movies.js";
import User from "../models/User.js";
import ShowTiming from "../models/ShowTiming.js";

const BookingSchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movies',
      required: true,
    },
    theatre: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Theatre',
      required: true,
    },
    timing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ShowTiming',
      required: true,
    },
    seats: [{
      type: String,
      required: true,
    }],
    date: {
      type: Date,
    },
    ticketPrice: {
      type: Number
    }
  });

//   const Booking = mongoose.model('Booking', BookingSchema);
export default mongoose.model('Booking', BookingSchema);