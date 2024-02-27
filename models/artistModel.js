const {DataTypes} = require('sequelize');
module.exports = (sequelize, Sequelize) => {
    

const Artist = sequelize.define('artist', {
    artist_id: {
        type: DataTypes.STRING,
        primaryKey: true,
        
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    image_url:{
        type: DataTypes.STRING
    }
});
    return Artist;
};



