import * as mongoose from "mongoose";

const ShowTimingSchema = new mongoose.Schema({
    timing: {
      type: String,
      required: true,
    },
    seats: {
      type: [
        [
          {
            user: {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'User',
            },
            status: {
              type: String,
              enum: ['available', 'unavailable'],
              default: 'available',
            },
            seatNumber: {
              type: String,
            },
          },
        ],
      ],
      required: true,
    }
  });


  export default mongoose.model('ShowTiming', ShowTimingSchema);