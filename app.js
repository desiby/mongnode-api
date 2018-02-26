const express = require("express");
//const router = express.router();
const app = express();
const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/customerapp")
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () =>{
    console.log ("Connected to MongoDB yay!!!");

    //user model user.js
    const userSchema = new mongoose.Schema({
        first_name: String,
        last_name: String
    });
    const user = mongoose.model("User", userSchema);

    //controller userController.js
    app.get("/api", (req, res) =>{
        user.find({},(err, docs) =>{
            if (err) throw err;
             res.json(docs);
        });
    });

    app.get("/api/:id", (req, res) => {
        user.findById(req.params.id, (err, doc) =>{
            if(err) throw err;
               res.json(doc);
        });
    });

    app.post("/api", (req, res) => {
        user.create(req.body, (err) => {
            if (err) throw err;
               res.sendStatus(201);
        });
    });

    app.put("/api/:id", (req, res) => {
        user.findByIdAndUpdate(req.params.id, req.body, {new: true}, (err, doc) => {
            if (err) throw err;
                  res.json(doc);
             });
    });

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