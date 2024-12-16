const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const oneDay = 24*60*60*1000;

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

router.post("/register", async (req, res) =>{
    try {
        const user = new User(req.body);
        await user.save();
        const token = jwt.sign({ userId: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.cookie("authToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: oneDay,
            path: "/",
        });
        
        res.status(200).send(user);
    } catch (error) {
        res.status(400).send("failed to create user: "+error);
    }
});

router.post("/logout", async(req, res) =>{
    try {
        res.clearCookie("authToken");
        res.status(200).send({ authenticated: false });
    } catch (error) {
        
    }
});

router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if(!user){
        return res.status(400).send("Invalid username.");
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch){
        return res.status(400).send("Invalid password.")
    }
    const token = jwt.sign({ userId: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.cookie("authToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60*60*1000,
    });
    res.status(200).send({ authenticated: true, userId: user.id, username: user.userName });
});

router.delete("/:id", async(req, res) =>{
    try {
        result = await User.deleteOne({ _id: req.params.id });
        res.status(200).send(result);
    } catch (error) {
        res.status(400).send(error);
    }
})

router.get("/check-auth", (req, res) => {
    const token = req.cookies.authToken;
    if(!token){
        return res.status(401).send({ authenticated: false });
    }
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.send({ authenticated: true, userId: decoded.userId, username: decoded.username });
    }
    catch(error){
        res.status(400).send({ authenticated: false });
    }
});

router.get("/", async (req, res) =>{
    try {
        const users = await User.find();
        res.status(200).send(users);
    } catch (error) {
        res.status(400).send(error);
    }
});



module.exports = router;