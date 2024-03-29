import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required: true
    },
    avatar:{
        type:String
    },
    role: {
        type: String,
        enum: ['regular', 'premium', 'employee'],
        default: 'regular'
    },
    membership: {
        type: String,
        enum: ['free', 'premium'], // for regular and premium users
        default: 'free'
    },
    membershipExpiryDate: {
        type: Date, // for premium users
        default: null
    },
    rewardsPoints: {
        type: Number,
        default: 0
    },
    pastMovies: [{
        movieId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Movies'
        },
        date: {
            type: Date,
            default: Date.now
        }
    }],
    bookings: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Booking',
        },
    ],
    // additional fields as needed
    date:{
        type:Date,
        default:Date.now
    },
});

export default mongoose.model('User', UserSchema);