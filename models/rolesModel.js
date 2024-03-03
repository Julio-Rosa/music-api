const {DataTypes} = require('sequelize');
module.exports = (sequelize, Sequelize) => {
    
const Role = sequelize.define('role', {
    role_id: {
        type: DataTypes.STRING,
        primaryKey: true,
       
    },
    name:{
        type: DataTypes.STRING,
        allowNull: false,
        unique:true
    },
   
   
});
  
    return Role;
};
