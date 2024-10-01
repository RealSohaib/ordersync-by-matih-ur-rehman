const { OrderModel } = require("../1-Modle/modle.js");

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
module.exports =DisplayOrderDetails