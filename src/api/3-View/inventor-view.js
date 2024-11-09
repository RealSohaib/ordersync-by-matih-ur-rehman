const express = require('express');
const {
    CreateInventory,
    DisplayInventory,
    EditInventory,
    DeleteInventory,
    HandleStocks}
= require( './../2-Controler/Inventory-controler');
const multer = require('multer');
const bodyParser = require('body-parser');

module.exports = function MenuView(app) {
    // Set up Multer storage configuration
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, '../uploads'); // Specify the destination directory
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + '-' + file.originalname); // Specify the file name
        }
    });

    const upload = multer({ storage: storage });

    // Middleware to parse JSON
    app.use(express.json()); // Use express.json() to parse incoming JSON
    app.use(bodyParser.json()); // Use bodyParser.json() to parse incoming JSON

    // Route for displaying menu
    app.get("/inventory", (req, res) => {
        DisplayInventory(req, res);
    })
    
    // Route for adding items with file upload
    app.post("/inventory/additems",async (req, res) => {
        try {
            console.log('Request received:', req.body); // Log the request body
            console.log('File received:', req.file); // Log the uploaded file details
            await CreateInventory(req, res);
        } catch (error) {
            console.error('Error in /menu/additems:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });
    //routes for editing
    app.put("/inventory/edititem", (req, res) => {
        EditInventory(req, res);
    });
    app.put("/inventory/stock", (req, res) => {
        HandleStocks(req, res);
    });
    
    // Route for deleting items
    app.delete("/inventory/deleteitem", (req, res) => {
        DeleteInventory(req, res);
    });
};