const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize("music_db_development", "root", "password", {

    host: "localhost",
    dialect: "mysql",
    port: "3306"

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












