const cors = require('cors');
const express = require("express");
const userRoutes = require('./src/routes/userRoutes');
const authRoutes = require('./src/routes/authRoutes');
const musicRoutes = require('./src/routes/musicRoutes');
const categoryRoutes = require('./src/routes/categoryRoutes');
const artistRoutes = require('./src/routes/artistRoutes');
const albumRoutes = require('./src/routes/albumRoutes');
const app = express();
const db = require("./src/models/model");
require('dotenv/config');


// db.music.sync ({force:true}).then(() => {
//     console.log("Models Synchronized");
//  }).catch(err => {
//     console.error("Unable to sync:", err);
//  })

const corsOptions = {
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200,
  };
 

app.use(cors(corsOptions));
app.use(userRoutes, authRoutes,musicRoutes, categoryRoutes,artistRoutes, albumRoutes);








app.listen(8082, function () {

    console.log("Running...");
});
