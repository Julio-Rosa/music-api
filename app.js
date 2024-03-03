
const express = require("express");
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/loginRoutes');
const app = express();
const db = require("./models/model");
require('dotenv/config');


// db.sequelize.sync ({force:true}).then(() => {
//     console.log("Models Synchronized");
//  }).catch(err => {
//     console.error("Unable to sync:", err);
//  })




app.use(userRoutes, authRoutes);








app.listen(8082, function () {

    console.log("Running...");
});
