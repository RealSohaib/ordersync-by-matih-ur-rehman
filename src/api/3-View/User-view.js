const express = require('express');
const { Loginuser, DisplayUser, ChangeCredentials, ChangePassword, DeleteUser, CreateUser } = require('../2-Controler/user-controler');
const cors = require("cors");

module.exports = function UserView(app) {
    console.log("user view is working");
    // Middleware to parse JSON
    app.use(express.json()); // Use express.json() to parse incoming JSON

    app.use(cors());

    app.get("/user", (req, res) => {
        DisplayUser(req, res);
    });

    // Route for creating a new user
    app.post("/user/adduser", (req, res) => {
        CreateUser(req, res);
    });

    // Route for login
    app.post("/user/login", (req, res) => {
        Loginuser(req, res);
    });

    // Route for changing credentials
    app.put("/user/edit", (req, res) => {
        ChangeCredentials(req, res);
    });

    // Route for changing password
    app.put("/user/change-password", (req, res) => {
        ChangePassword(req, res);
    });

    // Route for deleting a user
    app.delete("/user/remove", (req, res) => {
        DeleteUser(req, res);
    });
};