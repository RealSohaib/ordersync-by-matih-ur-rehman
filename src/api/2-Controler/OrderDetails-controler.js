const { OrderModel, ItemModel } = require("../1-Modle/modle.js");

const DisplayOrderDetails = async (req, res) => {
    try {
        const data = await OrderModel.find();
        res.status(200).send(data);
        console.log("Order details displayed successfully");
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: 'Internal Server Error' });
    }
};

const FindOrder = async (req, res) => {
    const { orderid, _id } = req.body;
    try {
        const data = await OrderModel.findOne({ orderid, _id });
        res.status(200).send(data);
        console.log(data);
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: 'Internal Server Error' });
    }
};

const PlaceOrder = async (req, res) => {
    const { clientName, contact, items, instructions, feedback } = req.body;
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
            feedback,
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
};

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
    const { _id, clientName, contact, items, instructions, delivery_status, payment_status, feedback } = req.body;
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
                payment_status,
                feedback
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

const OrderStatusHandler = async (req, res) => {
    const { _id, delivery_status, payment_status } = req.body;

    try {
        const updatedOrder = await OrderModel.findByIdAndUpdate(
            _id,
            {
                delivery_status,
                payment_status,
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

const FeedBackHandler = async (req, res) => {
    const { _id, feedback } = req.body;

    try {
        const updatedOrder = await OrderModel.findByIdAndUpdate(
            _id,
            {
                feedback: feedback
            },
            { new: true }
        );
        if (updatedOrder) {
            res.status(200).send(updatedOrder);
            console.log("Feedback updated successfully");
        } else {
            res.status(404).send({ message: 'Order not found' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: 'Internal Server Error' });
    }
};

const StockHandler = async (req, res) => {
    const { _id, stock } = req.body;

    try {
        const updatedItem = await ItemModel.findByIdAndUpdate(
            _id,
            {
                stock: stock
            },
            { new: true }
        );
        if (updatedItem) {
            res.status(200).send(updatedItem);
            console.log("Stock updated successfully");
        } else {
            res.status(404).send({ message: 'Item not found' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: 'Internal Server Error' });
    }
};



module.exports = { 
    DisplayOrderDetails, 
    FindOrder,
    PlaceOrder,
    RemoveOrder,
    EditOrder,
    OrderStatusHandler,
    FeedBackHandler,
    StockHandler,
    // OrderCountHandler
};