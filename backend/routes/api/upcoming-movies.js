import express from "express"
import Movies from "../../models/Movies.js";
import UpcomingMovies from "../../models/UpcomingMovies.js";

const router = express.Router();



// GET ALL
router.get("/", async (req, res) => {
    try {
        const upcomingMovies = await UpcomingMovies.find();
        res.status(200).json(upcomingMovies);
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
});


export default router