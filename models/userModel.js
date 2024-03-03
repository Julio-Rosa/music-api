const {DataTypes} = require('sequelize');
module.exports = (sequelize, Sequelize) => {
    
const User = sequelize.define('user', {
    user_id: {
        type: DataTypes.STRING,
        primaryKey: true,
       
    },
    email:{
        type: DataTypes.STRING,
        allowNull: false,
        unique:true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false
    }
   
});
  
    return User;
};
