const { Sequelize, DataTypes } = require('sequelize');
require('dotenv/config');

const sequelize = new Sequelize(process.env.DATABASE, process.env.DB_USER, process.env.PASSWORD, {

    host: process.env.HOST,
    dialect: 'mysql',
    port: process.env.port

});
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.music = require("./musicModel")(sequelize, Sequelize);
db.album = require("./albumModel")(sequelize, Sequelize);
db.artist = require("./artistModel")(sequelize, Sequelize);
db.category = require("./categoryModel")(sequelize, Sequelize);

db.music.belongsTo(db.album, { foreignKey: 'album_id' });
db.music.belongsTo(db.category, { foreignKey: 'category_id' });
db.music.belongsTo(db.artist, { foreignKey: 'artist_id' });
db.album.belongsTo(db.artist, { foreignKey: 'artist_id' });

module.exports = db;












