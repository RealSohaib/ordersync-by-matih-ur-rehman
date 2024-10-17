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
async function FindOrder(req, res) {
    const { orderid } = req.body;
    try {
        const data = await OrderModel.findOne({ orderid });
        res.status(200).send(data);
        console.log(data);
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: 'Internal Server Error' });
    }
}
async function PlaceOrder(req, res) {
    const { clientName, contact, items, instructions } = req.body;
    const totalitems = items.reduce((acc, item) => acc + item.total_items, 0);
    const bill = items.reduce((acc, item) => acc + item.total_bill, 0);

    try {
        const newOrder = new OrderModel({
            clientName,
            contact,
            items,
            instructions,
            totalitems,
            bill,
            delivery_status: 'pending',
            payment_status: 'pending'
        });
        const result = await newOrder.save();
        res.status(201).send(result);
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

const EditOrder = async (req, res) => {
    const { _id, clientName, contact, items, instructions, delivery_status, payment_status } = req.body;
    const totalitems = items.reduce((acc, item) => acc + item.total_items, 0);
    const bill = items.reduce((acc, item) => acc + item.total_bill, 0);

    try {
        const updatedOrder = await OrderModel.findByIdAndUpdate(
            _id,
            {
                clientName,
                contact,
                items,
                instructions,
                totalitems,
                bill,
                delivery_status,
                payment_status
            },
            { new: true }
        );
        if (updatedOrder) {
            res.status(200).send(updatedOrder);
            console.log("Order updated successfully");
        } else {
            res.status(404).send({ message: 'Order not found' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: 'Internal Server Error' });
    }
};

module.exports = { DisplayOrderDetails, PlaceOrder, RemoveOrder, EditOrder,FindOrder };