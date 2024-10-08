const express = require('express');
const { Loginuser, DisplayUser,    ChangeCredentials,
    DeleteUser,CreateUser } = require('../2-Controler/user-controler');
const cors=require("cors")
module.exports = function UserView(app) {
    // Middleware to parse JSON
    app.use(express.json()); // Use express.json() to parse incoming JSON

    app.use(cors());

    app.get("/user",(req,res)=>{
        // res.send("endpoint is ok")
        DisplayUser(req,res)
    })
    // Route for login
    app.post("/user/adduser", (req, res) => {
        CreateUser(req, res);
    });
    app.post("/user/login", (req, res) => {
        Loginuser(req, res);
    });

    // Route for changing password
    app.put("/user/changepassword", (req, res) => {
        ChangeCredentials(req, res);
    });
    app.delete("/user/remove", (req, res) => {
        DeleteUser(req, res);
    });
};