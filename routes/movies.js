const express = require("express");
const Movie = require("../models/Movie");
const router = express.Router();
const mongoose = require("mongoose");

// Ok, I admit it, ChatGPT gave me this function
// To sanitize the HTML just in case
// It's a good idea, especially if I implement the ability for users to add movies
function escapeHTML(str) {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
//ONLY USE THIS ON STRINGS, and ONLY on the title/description etc, not <tags>


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
        let page = parseInt(req.query.page) || 1; // Default to page 1
        let limit = parseInt(req.query.limit) || 3; // Default 10 results per page
        let skip = (page-1)*limit;
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
        let itemsHTML = "";

        //if there are less movies then page allows, don't keep trying to display them
        let mi;
        if(movies.length-skip < limit*page){
            mi = movies.length-skip;
        }
        else{
            mi = limit*page;
        }

        paginationDiv = 
                `
                <div class="pagination-buttons">
                    <button id="back-page">back</button>
                    <button id="forward-page">forward</button>
                </div>
                `;

        for(let i = skip; i < mi; i++){
            itemsHTML += `
            <a href="/movies/${movies[i]._id}" id="page-link${i}"  class="item-container"><span id="item${i}"> 
                <div id="title${i}" class="title">${escapeHTML(movies[i].title)}</div>
                <div id="genre${i}" class="genre">${escapeHTML(movies[i].genre)}</div>
                <div class="rating">${movies[i].rating}/10</div>
                <img class="search-poster-img" src="${movies[i].imageURL}">
                <div id="description${i}" class="description">${escapeHTML(movies[i].description)}</div>
            </span></a>`;
        }
        
        let sendResponse = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="stylesheet" href="/styles.css">
            <title>Bad Movies Are Good</title>
        </head>

        <div id="main-div">
            <div id="top-div">
                <a href="/"><h1 id="title-h1">Bad Movies Are Good</h1></a>
                <button id="login-button">Login</button>
            </div>
            <div id="search-div">
                <input type="text" placeholder="Search.." id="search-input">
                <button id="search-button">Search</button>
            </div>

            <div class="search-results">${itemsHTML}</div>
            ${paginationDiv}
        </div> 
        
        <script src="/scripts.js"></script>`;

        res.send(sendResponse);

    } catch (error) {
        res.status(500).send("error occurred: "+error);
    }
});



//get single movie by id
router.get("/:id", async (req, res) =>{
    if(!mongoose.isValidObjectId(req.params.id)){
        return res.status(400).send("Invalid ID!");
    }
    try {
        const movie = await Movie.findById({ _id: req.params.id });
        res.send(
            `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link rel="stylesheet" href="/styles.css">
                <title>Bad Movies Are Good</title>
            </head>

            <div id="main-div">
                <div id="top-div">
                    <a href="/"><h1 id="title-h1">Bad Movies Are Good</h1></a>
                    <button id="login-button">Login</button>
                </div>
                <div id="search-div">
                    <input type="text" placeholder="Search.." id="search-input">
                    <button id="search-button">Search</button>
                </div>
                    <div class="movie-page-title">${escapeHTML(movie.title)}</div>
                    <div class="movie-page-genre">${escapeHTML(movie.genre)}</div>
                    <div class="movie-rating">${movie.rating}/10</div>
                    <img class="search-poster-img" src="${movie.imageURL}">
                    <div class="movie-page-description">${escapeHTML(movie.description)}</div>
            </div>
            
            <script src="/scripts.js"></script>`
        );
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