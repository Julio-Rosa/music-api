
const express = require("express");
const routes = require('./routes/routes');
const app = express();
const db = require("./models/model");

db.sequelize.sync ({force:true}).then(() => {
    console.log("Models Synchronized");
 }).catch(err => {
    console.error("Unable to sync:", err);
 })




app.use(routes);








app.listen(8082, function () {

    console.log("Running...");
});
