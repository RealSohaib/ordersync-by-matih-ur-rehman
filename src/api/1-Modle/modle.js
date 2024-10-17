const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);

// Schema for user
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    duty: {
        type: String,
        default: ["waiter", "cashier"]
    },
    salary: {
        type: Number,
        default: 2300
    },
    joingindate: {
        type: Date,
        default: Date()
    },
}, { timestamps: true });
const UserModel = mongoose.model("user", UserSchema);

// Schema for menu display
const MenuSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true,
        default: 0,
    }
});
const MenuModel = mongoose.model("menus", MenuSchema);

// Schema for order details
const OrderSchema = new mongoose.Schema({
    clientName: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: true
    },
    instructions: {
        type: String
    },
    items: [{
        name: {
            type: String,
            required: true
        },
        category: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        total_items: {
            type: Number,
            required: true
        },
        total_bill: {
            type: Number,
            required: true
        }
    }],
    totalitems: {
        type: Number,
        required: true
    },
    bill: {
        type: Number,
        required: true
    },
    delivery_status: {
        type: String,
        default: "pending"
    },
    payment_status: {
        type: String,
        default: "pending"
    },
    orderid: {
        type: Number,
        unique: true
    }
});

// Plugin for auto-incrementing orderid
OrderSchema.plugin(AutoIncrement, { 
    id: 'order_seq', 
    inc_field: 'orderid', 
    start_seq: 1,
    prefix: 'A'
});

const OrderModel = mongoose.model("OrderDetails", OrderSchema);

// System Preferences schema
const SystemPreferencesSchema = new mongoose.Schema({
    OrderReadyToRecieve: {
        type: String,
        default: [
            "Your order is ready for pickup!",
            "Order is now complete and ready for delivery.",
            "Thank you! Your order is prepared and awaiting collection."
        ]
    },
    RequestInventory: {
        type: String,
        default: [
            "Request for additional inventory has been sent.",
            "Please replenish the stock for the requested item.",
            "Inventory request submitted. Awaiting confirmation."
        ]
    },
    TotalEmployees: {
        type: Number,
        required: true
    },
    sender_whatsapp_number: {
        type: String,
        required: true,
        default: "+1234567890"
    }
}, { timestamps: true });

const SystemModel = mongoose.model("SystemPreferences", SystemPreferencesSchema);

module.exports = { UserModel, MenuModel, OrderModel, SystemModel };