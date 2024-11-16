const { InventoryModle } = require("../1-Modle/modle.js");

const Createinventory = async function (req, res) {
    const { name, price, category, stock, description } = req.body;
    const image = req.file ? req.file.filename: null; // Get the file path if the file is uploaded

    try {
        //log the request body
        console.log('Request received:', req.body);
        if (!name || !price || !category || !description || !stock || !image) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const inventory = new InventoryModle({
            name,
            price,
            image,
            category,
            stock,
            description
        });

        console.log('Saving inventory:', inventory); // Log the inventory data being saved

        const savedMenu = await inventory.save();

        if (savedMenu) {
            res.status(200).json(savedMenu);
        } else {
            res.status(401).json({ message: 'Failed to create inventory' });
        }
    } catch (err) {
        console.error('Error in CreateMenu:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const Displayinventory = async function (req, res) {
    try {
        const data = await InventoryModle.find();
        res.status(200).json(data);
        console.log("inventory is displayed ");
    } catch (err) {
        console.error('Error in DisplayMenu:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const Editinventory = async function (req, res) {
    const { _id, name, price, image, category, stock, description } = req.body;
    try {
        const data = await InventoryModle.findOneAndUpdate(
            { _id }, // Find the inventory item by ID
            { name, price, image, category, stock, description }, // Update fields
            { new: true } // Return the updated document
        );

        if (data) {
            res.status(200).json(data);
            console.log(data);
        } else {
            res.status(404).json({ message: 'inventory item not found' });
        }
    } catch (err) {
        console.error('Error in EditMenu:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const HandleStocks = async function (req, res) {
    console.log('Request received:', req.body);
    
    const { _id, stock } = req.body;
    try {
        const data = await InventoryModle.findOneAndUpdate(
            { _id }, // Find the inventory item by ID
            { stock }, // Update the stock field
            { new: true } // Return the updated document
        );

        if (data) {
            res.status(200).json(data);
            console.log(data);
        } else {
            res.status(404).json({ message: 'inventory item not found' });
        }
    } catch (err) {
        console.error('Error in HandleStocks:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const Deleteinventory = async function (req, res) {
    const { name } = req.body; // Extracting the name from the request body

    try {
        const data = await InventoryModle.findOneAndDelete({ name });
        if (data) {
            res.status(200).json(data);
            console.log(data);
        } else {
            res.status(404).json({ message: 'inventory item not found' });
        }
    } catch (err) {
        console.error('Error in DeleteMenu:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const OrderCountHandler = async (req, res) => {
    const { _id, orderCount } = req.body;

    try {
        const updatedItem = await InventoryModle.findByIdAndUpdate(
            _id,
            {
                orderCount: orderCount
            },
            { new: true }
        );
        if (updatedItem) {
            res.status(200).send(updatedItem);
            console.log("Order count updated successfully");
        } else {
            res.status(404).send({ message: 'Item not found' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: 'Internal Server Error' });
    }
};

module.exports = {
    Createinventory,
    Displayinventory,
    Editinventory,
    Deleteinventory,
    HandleStocks,
    OrderCountHandler
};