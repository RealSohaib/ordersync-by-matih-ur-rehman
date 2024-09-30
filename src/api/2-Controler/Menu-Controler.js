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

const DisplayOrderDetails = async function (req, res) {
    try {
        const data = await OrderModel.find();
        res.status(200).send(data);
        console.log(data);
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: 'Internal Server Error' });
    }
};

module.exports = {
    CreateMenu,
    DisplayMenu,
    DisplayOrderDetails
};