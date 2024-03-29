// Theatre.js

import * as mongoose from 'mongoose';
import ShowTiming from '../models/ShowTiming.js';




const TheatreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  timings: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "ShowTiming", // Reference the ShowTiming model
  }],
  // showTimings: [ShowTiming.schema],
  seatingCapacity: {
    type: Number,
    default: 90,
    required: true 
  },
  discount_before_6pm: {
    type: Number,
    default: 0, // Default to 0 if no discount is specified
  },
  discount_on_Tuesdays: {
    type: Number,
    default: 0, // Default to 0 if no discount is specified 
  },
});

// const Theatre = mongoose.model('Theatre', TheatreSchema);
// const Theatre = model('Theatre', TheatreSchema);
export default mongoose.model('Theatre', TheatreSchema);
// export default TheatreSchema;
