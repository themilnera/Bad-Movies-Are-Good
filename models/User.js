const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
});

//hash password before saving the document
UserSchema.pre("save", async function (next) {
    //this middleware function runs before a certain operation, ie. save()
    if(this.isModified("password")) {
        //will make sure to only hash if new or changed
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

const User = mongoose.model("User", UserSchema);
module.exports = User;