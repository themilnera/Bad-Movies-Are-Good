require("dotenv").config();
const express = require("express");
const app = express();
const Database = require("./db/connect.js");
const movieRoutes = require("./routes/movies.js");
const path = require("path");

let db;

app.use(express.json());
app.use("/movies", movieRoutes);

//lets you access /public folder from the browser, ie /index.html
app.use(express.static(path.join(__dirname, "public")));
//path.join(__dirname, "public") ensures that public can be accessed
//regardless of how the app is deployed

//set up db, start server
async function start(){
    await Database.initDb();
    db = await Database.getDb();
    try {
        app.listen(process.env.PORT);
        console.log("Listening on: "+process.env.PORT);
    } catch (error) {
        console.log("Error with app.listen():"+error);
    }
}

start();