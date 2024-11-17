const express = require("express");
const app = express();
const Userview = require("./3-View/User-view");
const Menuview = require("./3-View/Menu-view");
const OrderView = require("./3-View/OrderDetails-view");
const FinanceView=require("./3-View/Finance-view")
const InventoryView=require("./3-View/inventor-view")
const Connection =require('./connection');
let port = 3001;

try{
    Connection()
    Userview(app);
    Menuview(app);
    OrderView(app);
    FinanceView(app)
    InventoryView(app)

}
catch(err){
    console.log("your server is not woking properly",err)
}
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
