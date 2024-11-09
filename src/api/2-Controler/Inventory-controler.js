const { InventoryModle} = require("../1-Modle/modle.js");

const CreateInventory = async function (req, res) {
    const { name, price, image, category, stock, description } = req.body;

    try {
        const Inventory = new InventoryModle({
            name,
            price,
            image,
            category,
            stock,
            description
        });

        const savedInventory = await Inventory.save();

        if (savedInventory) {
            res.status(200).send(savedInventory);
        } else {
            res.status(401).send({ message: 'Failed to create Inventory' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: 'Internal Server Error' });
    }
};

const DisplayInventory = async function (req, res) {
    try {
        const data = await InventoryModle.find();
        res.status(200).json(data);
        console.log("Inventory is displayed ");
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: 'Internal Server Error' });
    }
};

const EditInventory = async function (req, res) {
    const { _id, name, price, image, category, stock, description } = req.body;
    try {
        const data = await InventoryModle.findOneAndUpdate(
            { _id}, // Find the Inventory item by name
            {  name, price, image, category, stock, description }, // Update the stock field
            { new: true } // Return the updated document
        );

        if (data) {
            res.status(200).json(data);
            console.log(data);
        } else {
            res.status(404).send({ message: 'Inventory item not found' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: 'Internal Server Error' });
    }
};
const HandleStocks = async function (req, res) {
    const {_id,  stock } = req.body;
    try {
        const data = await InventoryModle.findOneAndUpdate(
            {_id}, // Find the Inventory item by name
            { stock,}, // Update the stock field
            { new: true } // Return the updated document
        );

        if (data) {
            res.status(200).json(data);
            console.log(data);
        } else {
            res.status(404).send({ message: 'Inventory item not found' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: 'Internal Server Error' });
    }
};

const DeleteInventory = async function (req, res) {
    const { name } = req.body; // Extracting the name from the request body

    try {
        const data = await InventoryModle.findOneAndDelete({ name });
        if (data) {
            res.status(200).json(data);
            console.log(data);
        } else {
            res.status(404).send({ message: 'Inventory item not found' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: 'Internal Server Error' });
    }
};

module.exports = {
    CreateInventory,
    DisplayInventory,
    EditInventory,
    DeleteInventory,
    HandleStocks
};