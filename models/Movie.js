const mongoose = require("mongoose");

const MovieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    year: {
        type: Number,
    },
    genre: {
        type: String,
    },
    rating: {
        type: Number,
    },
    description: {
        type: String,
    },
});

module.exports = mongoose.model("Movie", MovieSchema);