const express = require('express');
const { DisplayOrderDetails,FindOrder, PlaceOrder,EditOrder,RemoveOrder } = require('../2-Controler/OrderDetails-controler');

module.exports = function OrderView(app) {
    app.use(express.json()); // Use express.json() to parse incoming JSON

    // Route for displaying order details
    app.get("/orders", (req, res) => {
        DisplayOrderDetails(req, res);
    });
    app.get("/orders/search", (req, res) => {
        FindOrder(req, res);
    });

    // Route for placing an order
    app.post("/orders", (req, res) => {
        PlaceOrder(req, res);
    });
    app.put("/orders/edit", (req, res) => {
        EditOrder(req, res);
    });   
     app.delete("/orders/remove", (req, res) => {
        RemoveOrder(req, res);
    });
};