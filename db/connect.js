const mongoose = require("mongoose");
require("dotenv").config();
const URI = process.env.MONGO_URI;
const Database = (()=> {
    let db = null;

    const initDb = async () =>{
        if(!db){
            try{
                db = await mongoose.connect(URI);
                console.log("Db connection successful");
            }
            catch(error){
                console.log("Db connection failed with error: "+error);
                process.exit(1);
            }
        }
        else{
            console.log("Db connection already initialized")
        }
    };

    const getDb = async () =>{
        if(!db){
            console.log("Db not initialized before getDb()!");
        }
        else{
            return db;
        }
    };
    return { initDb, getDb };
})();

module.exports = Database;