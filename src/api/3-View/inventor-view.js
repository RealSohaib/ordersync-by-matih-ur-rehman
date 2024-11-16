const express = require('express');
const {
    
    Createinventory,
    Displayinventory,
    Editinventory,
    Deleteinventory,
    HandleStocks,
    OrderCountHandler
 } = require('../2-Controler/Inventory-controler');
const multer = require('multer');
const bodyParser = require('body-parser');
const path = require('path');

module.exports = function InventoryView(app) {
    // Set up Multer storage configuration
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, path.join(__dirname, '../../../public')); // Specify the destination directory
        },
        filename: function (req, file, cb) {
            const uniqueSuffix = Date.now();
            const fileName = `${file.originalname}${uniqueSuffix}`;
            cb(null, fileName); // Specify the file name
        }
    });

    const upload = multer({ storage: storage });

    // Middleware to parse JSON
    app.use(express.json()); // Use express.json() to parse incoming JSON
    app.use(bodyParser.json()); // Use bodyParser.json() to parse incoming JSON

    // Route for displaying inventory
    app.get("/inventory", (req, res) => {

        Displayinventory(req, res);
    });
    
    // Route for adding items with file upload
    app.post("/inventory/additems", upload.single('image'), async (req, res) => {
        try {
            console.log('Request received:', req.body); // Log the request body
            console.log('File received:', req.file); // Log the uploaded file details
            
            if (!req.file) {
                return res.status(400).json({ error: 'File not uploaded' });
            }
            
            await CreateMenu(req, res);
        } catch (error) {
            console.error('Error in /inventory/additems:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });

    // Route for editing items
    app.put("/inventory/edititem", (req, res) => {
        EditMenu(req, res);
    });

    // Route for handling stocks
    app.put("/inventory/stock", (req, res) => {
        HandleStocks(req, res);
    });
    app.put("/inventory/orders", (req, res) => {
        OrderCountHandler(req, res);
    });
    
    // Route for deleting items
    app.delete("/inventory/deleteitem", (req, res) => {
        DeleteMenu(req, res);
    });
};  