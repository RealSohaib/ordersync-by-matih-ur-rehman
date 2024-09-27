const express = require('express');
const { Loginuser, ChangePassword } = require('../2-Controler/user-controler');
const { DisplayMenu } = require('../2-Controler/Menu-Controler');

module.exports = function UserView(app) {
    // Middleware to parse JSON
    app.use(express.json()); // Use express.json() to parse incoming JSON

    // Route for displaying menu
    app.get("/", (req, res) => {
        DisplayMenu(req, res);
    });

    // Route for login
    app.post("/login", (req, res) => {
        Loginuser(req, res);
    });

    // Route for changing password
    app.post("/changepassword", (req, res) => {
        ChangePassword(req, res);
    });
};