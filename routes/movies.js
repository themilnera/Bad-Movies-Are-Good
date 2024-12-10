const express = require("express");
const Movie = require("../models/Movie");
const router = express.Router();

//create movie
router.post("/", async (req, res) =>{
    try {
        const movie = new Movie(req.body);
        await movie.save();
        res.status(200).send(movie);
    } catch (error) {
        res.status(400).send(error);
    }
});

//get all movies
router.get("/", async (req, res) =>{
    try {
        const movies = await Movie.find();
        res.status(200).send(movies);
    } catch (error) {
        res.status(400).send(error);
    }
});

//GET /movies/search
router.get("/search", async(req, res) => {
    try {
        //example query: /search?title=Room&genre=Drama
        const {title, genre, rating} = req.query;
        const filter = {};

        //doing regex here so that partial titles will be caught
        if(title){ 
            filter.title = { $regex: title, $options: "i" };
            //$options: "i" makes it case-insensitive
        };

        if(genre){ 
            filter.genre = genre;
        }

        if(rating){
            filter.rating = rating;
        }

        const movies = await Movie.find(filter);
        res.send(movies);

    } catch (error) {
        res.status(500).send(error);
    }
});

//get movie by id
router.get("/:id", async (req, res) =>{
    try {
        const movie = await Movie.findById({ _id: req.params.id });
        res.status(200).send(movie);
    } catch (error) {
        res.status(400).send(error);
    }
});

//update movie by id
router.put("/:id", async (req, res) =>{
    try {
        const result = await Movie.findByIdAndUpdate(req.params.id, req.body);
        res.status(200).send(result);
    } catch (error) {
        res.status(400).send(error);
    }
});

//delete movie by id
router.delete("/:id", async (req, res) =>{
    try {
        result = await Movie.deleteOne({ _id: req.params.id });
        res.status(200).send(result);
    } catch (error) {
        res.status(400).send(error);
    }
});

module.exports = router;