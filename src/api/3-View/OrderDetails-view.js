const express = require('express');
const { DisplayOrderDetails, PlaceOrder } = require('../2-Controler/OrderDetails-controler');

module.exports = function MenuView(app) {
    app.use(express.json()); // Use express.json() to parse incoming JSON

    // Route for displaying order details
    app.get("/orders", (req, res) => {
        DisplayOrderDetails(req, res);
    });

    // Route for placing an order
    app.post("/orders", (req, res) => {
        PlaceOrder(req, res);
    });
};