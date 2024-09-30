const express = require('express');
const { Loginuser, ChangePassword } = require('../2-Controler/user-controler');
const cors=require("cors")
module.exports = function UserView(app) {
    // Middleware to parse JSON
    app.use(express.json()); // Use express.json() to parse incoming JSON

    app.use(cors());
    // Route for login
    app.post("/login", (req, res) => {
        Loginuser(req, res);
    });

    // Route for changing password
    app.post("/changepassword", (req, res) => {
        ChangePassword(req, res);
    });
};