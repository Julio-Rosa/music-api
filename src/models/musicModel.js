const {DataTypes} = require('sequelize');
module.exports = (sequelize, Sequelize) => {
    
const Music = sequelize.define('music', {
    music_id: {
        type: DataTypes.STRING,
        primaryKey: true,
       
    },
    release_date:{
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    name: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
    },
    music_url: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true
    },
   
});
  
    return Music;
};



