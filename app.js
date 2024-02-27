const express = require("express");
const routes = require('./routes/routes');
const app = express();

app.use(routes);








app.listen(8082, function () {

    console.log("Running...");
});
