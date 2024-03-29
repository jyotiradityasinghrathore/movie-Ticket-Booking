import express from "express"
import User from "../../models/User.js"
import Booking from '../../models/Booking.js'
import Movies  from '../../models/Movies.js'
import Theatre from '../../models/Theatre.js'
import ShowTiming from '../../models/ShowTiming.js';


const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { user, booking } = req.body;
    
        // Find the user by their _id
        const foundUser = await User.findById(user).populate('bookings');
    
        // Check if the user is found
        if (!foundUser) {
          return res.status(404).json({ error: 'User not found' });
        }
    
        // Find the booking by its _id
        const foundBooking = await Booking.findById(booking);
    
        // Check if the booking is found
        if (!foundBooking) {
          return res.status(404).json({ error: 'Booking not found' });
        }
    
        // Refund ticketPrice to user's rewardPoints
        foundUser.rewardsPoints += foundBooking.ticketPrice;
    
        // Remove the booking from the user's bookings array
        foundUser.bookings.pull(booking);
    
        // Save the updated user
        await foundUser.save();
        
        // Delete the booking
        await foundBooking.deleteOne();
        

        // Return a success message or updated user details
        res.status(200).json({ message: 'Ticket canceled successfully', user: foundUser });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
});

export default router;

