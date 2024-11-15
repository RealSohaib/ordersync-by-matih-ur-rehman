const express = require('express');
const { DisplayOrderDetails, FindOrder, PlaceOrder, RemoveOrder, EditOrder, OrderStatusHandler, FeedBackHandler, StockHandler, OrderCountHandler } = require('../2-Controler/OrderDetails-controler.js');

module.exports = function OrderView(app) {
    app.use(express.json()); // Use express.json() to parse incoming JSON

    // Route for displaying order details
    app.get("/orders", (req, res) => {
        DisplayOrderDetails(req, res);
    });

    // Route for finding an order
    app.get("/orders/search", (req, res) => {
        FindOrder(req, res);
    });

    // Route for placing an order
    app.post("/orders", (req, res) => {
        PlaceOrder(req, res);
    });

    // Route for editing an order
    app.put("/orders/edit", (req, res) => {
        EditOrder(req, res);
    });

    // Route for updating order status
    app.put("/orders/status", (req, res) => {
        OrderStatusHandler(req, res);
    });

    // Route for updating stock
    app.put("/orders/stocks", (req, res) => {
        StockHandler(req, res);
    });

    // Route for updating order count
    app.put("/orders/ordercount", (req, res) => {
        OrderCountHandler(req, res);
    });

    // Route for adding feedback
    app.put("/orders/feedback", (req, res) => {
        FeedBackHandler(req, res);
    });

    // Route for removing an order
    app.delete("/orders/remove", (req, res) => {
        RemoveOrder(req, res);
    });
};