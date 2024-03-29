import express from "express"
import Movies from "../../models/Movies.js";
// import UpcomingMovies from "../../models/UpcomingMovies.js";
import Theatre from "../../models/Theatre.js";
import ShowTiming from "../../models/ShowTiming.js";

const router = express.Router();

const generateSeatingMatrix = (seatingCapacity) => {
    const maxRows = 10;
    const maxColumns = 10;

    // Ensure seating capacity does not exceed maximum
    const totalSeats = Math.min(seatingCapacity, maxRows * maxColumns);

    const matrix = [];

    // Loop through rows
    for (let rowIndex = 0; rowIndex < maxRows; rowIndex++) {
        const row = [];

        // Loop through columns
        for (let columnIndex = 0; columnIndex < maxColumns; columnIndex++) {
        // Calculate seat number (A1, A2, ..., B1, B2, ...)
        const seatNumber = String.fromCharCode('A'.charCodeAt(0) + rowIndex) + (columnIndex + 1);

        // Create seat object with default values
        const seat = {
            status: 'available',
            seatNumber: seatNumber,
            user: null,
        };

        // Push seat object to the row
        row.push(seat);
        }

        // Push row to the matrix
        matrix.push(row);
    }

    // Slice the matrix to the total number of seats
    return matrix.slice(0, totalSeats);
};

// CREATE
router.post("/addMovie", async (req, res) => {
    // const newMovie = new Movies(req.body)
    // Make a new instance of theater with the theater name from req.body
    // For that theater make a list of timings and for each timing make an instance of ShowTiming Object with the neccessary fields.

    // try {
    //     const addMovie = await newMovie.save()
    //     res.status(200).json(addMovie)
    // } catch(err) {
    //     res.status(500).json(err)
    // }

    // console.log(req.body)
    // console.log("TIMINGs", req.body.theatres[0].timings)
    // res.status(200).json({ message: "Cool" })

    try {
        // Create ShowTiming and Theatre documents
        const theatrePromises = req.body.theatres.map(async (theatreInput) => {
            // Create ShowTiming documents for each timing
            const timingDocs = await Promise.all(
                theatreInput.timings.map(async (timingInput) => {
                    const showTiming = new ShowTiming({
                        timing: timingInput.timing,
                        // Here you need to add logic for creating seats if necessary
                        seats: generateSeatingMatrix(theatreInput.seatingCapacity)
                    });
                    return showTiming.save();
                })
            );

            // Create a Theatre document
            const theatre = new Theatre({
                name: theatreInput.name,
                location: theatreInput.location,
                timings: timingDocs, // Pass the documents directly
                seatingCapacity: parseInt(theatreInput.seatingCapacity, 10),
                // include other fields...
            });
            return theatre.save();
        });

        // Wait for all Theatre documents to be created
        const theatres = await Promise.all(theatrePromises);

        // Create the Movie document
        const movie = new Movies({
            title: req.body.title,
            picture: req.body.picture,
            description: req.body.description,
            releaseDate: req.body.releaseDate,
            duration: parseInt(req.body.duration, 10),
            theatres: theatres // Pass the Theatre documents directly
        });

        // Save the Movie document
        const savedMovie = await movie.save();

        // Populate the movie document with Theatre and ShowTiming data to return
        const populatedMovie = await Movies.findById(savedMovie._id)
            .populate({
                path: 'theatres',
                populate: { path: 'timings' }
            })

        res.status(201).json(populatedMovie);
    } catch (err) {
        console.error('Error adding movie:', err);
        res.status(500).json({ message: "Error adding movie", err });
    }
})

// UPDATE
router.put("/updateMovie/:id", async (req, res) => {
    try {
        // Update the Movie document
        const movieUpdate = {
            title: req.body.title,
            picture: req.body.picture,
            description: req.body.description,
            releaseDate: req.body.releaseDate,
            duration: req.body.duration
        };
        
        await Movies.findByIdAndUpdate(req.params.id, { $set: movieUpdate }, { new: true });

        // Iterate over each theatre and update the corresponding document
        if(req.body.theatres && req.body.theatres.length > 0) {
            await Promise.all(req.body.theatres.map(async (theatre) => {
                const theatreUpdate = {
                    name: theatre.name,
                    location: theatre.location,
                    seatingCapacity: theatre.seatingCapacity,
                    discount_before_6pm: theatre.discount_before_6pm,
                    discount_on_Tuesdays: theatre.discount_on_Tuesdays,
                    timings: theatre.timings
                };
                // Assuming you don't want to update the timings or movies fields
                // If you do, you'll need additional logic to handle those updates
                await Theatre.findByIdAndUpdate(theatre._id, { $set: theatreUpdate }, { new: true });
            }));
        }

        // Fetch the updated Movie document with the referenced Theatre documents
        const updatedMovieWithPopulate = await Movies.findById(req.params.id).populate({
            path: 'theatres',
            populate: {
              path: 'timings',
            },
        });

        res.status(200).json(updatedMovieWithPopulate);
    } catch(err) {
        console.error(err);
        res.status(500).json({ message: "Error updating movie", err });
    }
});


// DELETE
router.delete("/deleteMovie/:id", async (req, res) => {
    try {
        const deleteMovie = await Movies.findByIdAndDelete(req.params.id)
        res.status(200).json("Movie Deleted!")
    } catch(err) {
        res.status(500).json(err)
    }
})

// GET
router.get("/:id", async (req, res) => {
    try {
        const getMovie = await Movies.findById(req.params.id)
        res.status(200).json(getMovie)
    } catch(err) {
        res.status(500).json(err)
    }
})


// GET ALL
router.get("/", async (req, res) => {
    try {
        const movies = await Movies.find().populate({
            path: 'theatres',
            populate: {
              path: 'timings',
            },
        });
        res.status(200).json(movies)
    } catch(err) {
        console.log(err);
        res.status(500).json(err)
    }
})

router.get('/',(req, res) => res.send('Auth route'));

export default router