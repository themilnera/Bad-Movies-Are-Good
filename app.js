require("dotenv").config();
const express = require("express");
const app = express();
const Database = require("./db/connect.js");
const movieRoutes = require("./routes/movies.js");
let db;

app.use(express.json());
app.use("/movies", movieRoutes);
app.use(express.static("public"));

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