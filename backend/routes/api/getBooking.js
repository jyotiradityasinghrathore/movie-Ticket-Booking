import express from "express"
import Booking from "../../models/Booking.js"

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('user')
            .populate('movie')
            .populate('theatre')
            
        res.status(200).json(bookings)
    } catch(err) {
        console.log(err);
        res.status(500).json(err)
    }
})

router.get("/analytics-dashboard", async (req, res) => {
    const daysAgo = parseInt(req.query.days) > 0 ? parseInt(req.query.days) : 30;
    const endDate = new Date(); // Current date
    const startDate = new Date(); // Start date
    startDate.setDate(endDate.getDate() - daysAgo);

    try {
        const analyticsData = await Booking.aggregate([
            {
                $addFields: {
                    // Convert 'date' from string to date object and reset year to 2023
                    convertedDate: {
                        $dateFromParts: {
                            'year': 2023,
                            'month': { $month: { $toDate: "$date" } },
                            'day': { $dayOfMonth: { $toDate: "$date" } },
                            // Assuming the time is not important for the filtering
                            'hour': 0,
                            'minute': 0,
                            'second': 0,
                            'millisecond': 0,
                            'timezone': 'UTC'
                        }
                    }
                }
            },
            // {
            //     $addFields: {
            //         // Convert 'date' from string to date object
            //         convertedDate: { $toDate: "$date" }
            //     }
            // },
            // Match bookings within the last 'daysAgo' days
            {
                $match: {
                    convertedDate: {
                        $gte: startDate,
                        $lte: endDate
                    }
                }
            },
            {
                $lookup: {
                    from: "theatres",
                    localField: "theatre",
                    foreignField: "_id",
                    as: "theatreData"
                }
            },
            {
                $lookup: {
                    from: "movies",
                    localField: "movie",
                    foreignField: "_id",
                    as: "movieData"
                }
            },
            {
                $unwind: "$theatreData"
            },
            {
                $unwind: "$movieData"
            },
            {
                $group: {
                    _id: {
                        theatreName: "$theatreData.name",
                        movie: "$movieData.title"
                    },
                    totalBookings: { $sum: 1 },
                    totalSeatsBooked: { $sum: { $size: "$seats" } }
                }
            },
            {
                $sort: {
                    "_id.theatreName": 1,
                    "_id.movie": 1
                }
            }
        ]);

        res.status(200).json(analyticsData);
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

export default router