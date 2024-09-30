const express = require("express");
const app = express();
const Userview = require("./3-View/User-view");
const Menuview = require("./3-View/Menu-view");
let port = 3001;


Userview(app);
Menuview(app);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
