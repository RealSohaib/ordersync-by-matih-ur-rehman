const mongoose = require("mongoose");

const Connection = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/OrderSync"
        );
        console.log("You have successfully connected to the database");
    } catch (err) {
        console.error("Error connecting to the database:", err);
    }
};

module.exports = Connection;
