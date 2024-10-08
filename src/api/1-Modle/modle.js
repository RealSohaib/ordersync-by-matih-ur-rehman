const connection = require("../connection"); // Fix import for connection
const mongoose = require("mongoose");
const autoIncrement = require('mongoose-auto-increment');

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
    },
    duty: {
        type: String,  // Corrected type
        default:["waiter","cashier"]
    },
    salary: {
        type: Number,  // Corrected type
        default:2300
    },
    joingindate: {
        type: Date,  // Corrected type
        default:Date()
    },
},{timestamps:true});
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
    },
    stock: {
        type: Number,  // Corrected type
        required: true,
        default:0
    }
});
const MenuModel = mongoose.model("menus", MenuSchema);
autoIncrement.initialize(connection);
// Schema for orders

const Ordermodle = new mongoose.Schema({
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
    },
    oderid:{
        type:Number,
        unique: true 
    }
});
Ordermodle.plugin(autoIncrement.plugin, {
    model: 'Order',   // Model name
    field: 'orderid', // Field to auto-increment
    startAt: 1,       // Starting value
    incrementBy: 1    // Increment step
});
const OrderScheema = mongoose.model("OrderDetails", Ordermodle);

//system Prefernces like how many employees they hava what sender whatsapp number shold be
//which should be the default message when we want to inform cliet the order is ready,
// 
const SystemPrefernces= mongoose.Schema({
    OrderReadyToRecieve :{
        type:String,
        default:[
            "Your order is ready for pickup!",
            "Order is now complete and ready for delivery.",
            "Thank you! Your order is prepared and awaiting collection."
        ]
    },
    RequestInventory :{
        type:String,
        default:[
            "Request for additional inventory has been sent.",
            "Please replenish the stock for the requested item.",
            "Inventory request submitted. Awaiting confirmation."
        ]

    },
    TotalEmployees :{
        type:Number,
        required:true
    },
    sender_whatsapp_number:{
        type:String,
        required:true,
        default:"+1234567890"
    }
 },{timestamps:true});
const SystemModel=mongoose.model("SystemPrefernces",SystemPrefernces)

module.exports = { UserModel, MenuModel, OrderScheema,SystemModel };

connection();