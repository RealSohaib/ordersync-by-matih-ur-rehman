const { MenuModel, OrderModel } = require("../1-Modle/modle.js");

const CreateMenu = async function (req, res) {
    const { name, price, image, category, description } = req.body;

    try {
        const menu = new MenuModel({
            name,
            price,
            image,
            category,
            description
        });

        const savedMenu = await menu.save();

        if (savedMenu) {
            res.status(200).send(savedMenu);
        } else {
            res.status(401).send({ message: 'Failed to create menu' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: 'Internal Server Error' });
    }
};

const DisplayMenu = async function (req, res) {
    try {
        const data = await MenuModel.find();
        res.status(200).json(data);
        console.log(data);
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: 'Internal Server Error' });
    }
};
        
const EditMenu = async function (req, res) {
    const { _id, name, price, image, category, description } = req.body;
    try {
        const data = await MenuModel.findOneAndUpdate(
            { _id }, // Find the menu item by _id
            { name, price, image, category, description }, // Update the fields
            { new: true } // Return the updated document
        );

        if (data) {
            res.status(200).json(data);
            console.log(data);
        } else {
            res.status(404).send({ message: 'Menu item not found' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: 'Internal Server Error' });
    }
};

const DeleteMenu = async function (req, res) {
    const { name } = req.body; // Extracting the name from the request body

    try {
        const data = await MenuModel.findOneAndDelete({ name });
        if (data) {
            res.status(200).json(data);
            console.log(data);
        } else {
            res.status(404).send({ message: 'Menu item not found' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: 'Internal Server Error' });
    }
};



module.exports = {
    CreateMenu,
    DisplayMenu,
    EditMenu,
    DeleteMenu,
};