const express = require('express');
const { Loginuser, ChangePassword,
    DeleteUser,CreateUser } = require('../2-Controler/user-controler');
const cors=require("cors")
module.exports = function UserView(app) {
    // Middleware to parse JSON
    app.use(express.json()); // Use express.json() to parse incoming JSON

    app.use(cors());
    // Route for login
    app.post("/user/adduser", (req, res) => {
        CreateUser(req, res);
    });
    app.post("/user/login", (req, res) => {
        Loginuser(req, res);
    });

    // Route for changing password
    app.put("/user/changepassword", (req, res) => {
        ChangePassword(req, res);
    });
    app.delete("/user/remove", (req, res) => {
        DeleteUser(req, res);
    });
};