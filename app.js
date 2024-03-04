
const express = require("express");
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const musicRoutes = require('./routes/musicRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const artistRoutes = require('./routes/artistRoutes');
const app = express();
const db = require("./models/model");
require('dotenv/config');


// db.sequelize.sync ({force:true}).then(() => {
//     console.log("Models Synchronized");
//  }).catch(err => {
//     console.error("Unable to sync:", err);
//  })




app.use(userRoutes, authRoutes,musicRoutes, categoryRoutes,artistRoutes);








app.listen(8082, function () {

    console.log("Running...");
});
