const { DisplayFinances, AddFinance, EditFinance, DeleteFinance } = require('../2-Controler/Finance-controler');
const express = require('express');

module.exports = function FinanceView(app) {
    console.log("finance view is working")
    // Middleware to parse JSON
    app.use(express.json()); // Use express.json() to parse incoming JSON

    // Route for displaying all finances
    app.get("/finances", (req, res) => {
        console.log("endpoint accessable")
        DisplayFinances(req, res);
    });

    // Route for adding a new finance entry
    app.post("/finances/add", (req, res) => {
        AddFinance(req, res);
    });

    // Route for editing an existing finance entry
    app.put("/finances/edit", (req, res) => {
        EditFinance(req, res);
    });

    // Route for deleting a finance entry
    app.delete("/finances/delete", (req, res) => {
        DeleteFinance(req, res);
    });
};