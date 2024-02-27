const {DataTypes} = require('sequelize');
module.exports = (sequelize, Sequelize) => {
    
    const Category = sequelize.define('category',{
        category_id:{
            type: DataTypes.STRING,
            primaryKey: true,
           
        },
        name: { 
            type:DataTypes.STRING,
            unique: true
        }
    });
  
    return Category;
};

