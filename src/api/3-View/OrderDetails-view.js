const express = require('express');
const { DisplayOrderDetails } = require('../2-Controler/OrderDetails-controler');


module.exports = function MenuView(app) {
    // Set up Multer storage configuration
    // Middleware to parse JSON
    app.use(express.json()); // Use express.json() to parse incoming JSON
    
    // Route for displaying order details
    app.get("/orderdetails", (req, res) => {
        DisplayOrderDetails(req, res);
    });

};