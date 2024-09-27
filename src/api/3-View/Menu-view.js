const express = require('express');
const { DisplayMenu, CreateMenu, DisplayOrderDetails } = require('../2-Controler/Menu-Controler');
const multer = require('multer');
const bodyParser = require('body-parser');

module.exports = function MenuView(app) {
    // Set up Multer storage configuration
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'uploads'); // Specify the destination directory
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + '-' + file.originalname + '.jpg'); // Specify the file name
        }
    });

    const upload = multer({ storage: storage });

    // Middleware to parse JSON
    app.use(express.json()); // Use express.json() to parse incoming JSON
    app.use(bodyParser.json()); // Use bodyParser.json() to parse incoming JSON

    // Route for displaying menu
    app.get("/", (req, res) => {
        DisplayMenu(req, res);
    });

    // Route for displaying order details
    app.get("/orderdetails", (req, res) => {
        DisplayOrderDetails(req, res);
    });

    // Route for adding items with file upload
    app.put("/additems", upload.single('image'), async (req, res) => {
        req.body.image = req.file.filename; // Save the file name in the image field
        CreateMenu(req, res);
    });
};