const { OrderModel } = require("../1-Modle/modle.js");

async function DisplayOrderDetails(req, res) {
    try {
        const data = await OrderModel.find();
        res.status(200).send(data);
        console.log(data);
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: 'Internal Server Error' });
    }
}

// const { OrderModel } = require("../1-Modle/modle.js");

async function PlaceOrder(req, res) {
    const { name, contact, items, total, delivery_status, payment_status, orderid } = req.body;
    try {
        const newOrder = new OrderModel({ name, contact, items, total, delivery_status, payment_status, orderid });
        const result = await newOrder.save();
        res.status(201).send(result);
        DisplayOrderDetails(req, res)
        console.log("Order placed successfully");
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: 'Internal Server Error' });
    }
}


const RemoveOrder = async (req, res) => {
    const { orderid } = req.body;
    try {
        const order = await OrderModel.findOneAndDelete({ orderid });
        if (order) {
            res.status(200).send({ message: 'Order deleted successfully' });
        } else {
            res.status(404).send({ message: 'Order not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Internal Server Error' });
    }
};

module.exports = { DisplayOrderDetails, PlaceOrder, RemoveOrder };