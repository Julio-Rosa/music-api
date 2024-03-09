const {DataTypes} = require('sequelize');
module.exports = (sequelize, Sequelize) => {
    
    const Album = sequelize.define('album', {
        album_id: {
            type: DataTypes.STRING,
            primaryKey: true, 
           
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        image_url:{
            type: DataTypes.STRING
        }
    });
  
    return Album;
};

