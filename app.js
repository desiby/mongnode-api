const express = require("express");
const app = express();
const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/customerapp"); //connect to database
const bodyParser = require("body-parser");
const user = require("./model/User");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//establish connection a new connection
const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error"));
//upon connection
db.once("open", () =>{
   
    console.log ("Connected to MongoDB yay!!!");
    //Endpoints
    
    //get all users
    app.get("/api", (req, res) =>{
        user.find({},(err, docs) =>{
            if (err) throw err;
             res.json(docs);
        });
    });

    //get a user by id
    app.get("/api/:id", (req, res) => {
        user.findById(req.params.id, (err, doc) =>{
            if(err) throw err;
               res.json(doc);
        });
    });

    //create new user
    app.post("/api", (req, res) => {
        user.create(req.body, (err) => {
            if (err) throw err;
               res.sendStatus(201);
        });
    });

    //update user
    app.put("/api/:id", (req, res) => {
        user.findByIdAndUpdate(req.params.id, req.body, {new: true}, (err, doc) => {
            if (err) throw err;
                  res.json(doc);
             });
    });

    //delete user
    app.delete("/api/:id", (req, res) => {
        user.findByIdAndRemove(req.params.id, (err) => {
            if (err) throw err;
              console.log(`user id ${req.params.id} removed!`)
              res.sendStatus(200);
        });
    });

});

//server
app.listen(3000, () => {
    console.log("Server started at port: 3000!!!");
});

module.exports = app;