import { MongoMissingCredentialsError } from "mongodb";
import * as mongoose from "mongoose";
// import Theatre from "./Theatre";
// import TheatreSchema from "./Theatre";
// import TheatreSchema from './Theatre.js'



const MovieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    picture: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    releaseDate: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    theatres: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Theatre", // Reference the Theatre model
    }]
})


// console.log("This is MovieSchema--", MovieSchema);
// const Movies = mongoose.model("Movies", MovieSchema)
// console.log("This is model- ", Movies)

export default mongoose.model("Movies", MovieSchema);