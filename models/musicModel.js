const {DataTypes} = require('sequelize');
module.exports = (sequelize, Sequelize) => {
    
const Music = sequelize.define('music', {
    music_id: {
        type: DataTypes.STRING,
        primaryKey: true,
       
    },
    release_date:{
        type: Sequelize.DataTypes.STRING,
        allowNull: false
    },
    name: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
    },
   
});
  
    return Music;
};



