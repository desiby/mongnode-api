const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const user = require("./model/User");
const PORT = process.env.NODE_DOCKER_PORT || 3000

//connect to database using mongodb service name from compose or k8 definition file
mongoose.connect("mongodb://mongo:27017/customerapp");


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//establish connection a new connection
const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error"));
//upon connection
db.once("open", () =>{
   
    console.log ("Connected to MongoDB yay!!!");
    
    //get all users
    app.get("/api", async(req, res) =>{
        const users = await user.find();
        res.json(users);
    });

    //get a user by id
    app.get("/api/:id", async(req, res) => {
        const users = await user.findById(req.params.id);
        res.json(users);
    });

    //create new user
    app.post("/api", async(req, res) => {
        const newUser = new user(req.body);
        await newUser.save();
        res.json(newUser);
    });

    //update user
    app.put("/api/:id", async(req, res) => {
        const updatedUser = await user.findByIdAndUpdate(req.params.id, req.body);
        res.json(updatedUser);
    });

    //delete user
    app.delete("/api/:id", async(req, res) => {
        const deletedUser = await user.findByIdAndRemove(req.params.id);
        res.json(deletedUser);
    });

});

//server
app.listen(PORT, () => {
    console.log(`App Server is running on port ${PORT}`);
});

module.exports = app;