const connection = require("../connection"); // Fix import for connection
const mongoose = require("mongoose");

// Schema for user
const UserSchema = new mongoose.Schema({
    username: {
        type: String,  // Corrected type
        required: true
    },
    password: {
        type: String,  // Corrected type
        required: true
    },
    role: {
        type: String,  // Corrected type
        required: true
    }
});
const UserModel = mongoose.model("user", UserSchema);

// Schema for menu display
const MenuSchema = new mongoose.Schema({
    name: {
        type: String,  // Corrected type
        required: true
    },
    price: {
        type: Number,  // Corrected type
        required: true
    },
    image: {
        type: String,  // Corrected type
        required: true
    },
    category: {  // Corrected typo in 'category'
        type: String,  // Corrected type
        required: true
    },
    description: {
        type: String,  // Corrected type
        required: true
    }
});
const MenuModel = mongoose.model("menu", MenuSchema);

// Schema for orders
const OrderSchema = new mongoose.Schema({
    name: {
        type: String,  // Corrected type
        required: true
    },
    contact: {
        type: String,  // Corrected type
        required: true
    },
    items: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'menu'  // Referencing the 'menu' model
    }],
    total: {
        type: Number,  // Corrected type
        required: true
    },
    delivery_status: {
        type: String,  // Corrected type
        required: true,
        default: "pending"
    },
    payment_status: {
        type: String,  // Corrected type
        required: true,
        default: "pending"
    }
});
const OrderModel = mongoose.model("OrderDetails", OrderSchema);

module.exports = { UserModel, MenuModel, OrderModel };

// Call the connection function to connect to the database
connection();