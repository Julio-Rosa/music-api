const { Sequelize, DataTypes, Model } = require('sequelize');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const db = require("../models/model");
const User = db.user;
const { returnErrors } = require('../utils/errorsUtil');
const {encryptPassword} = require('../utils/encryptPassword');
const jwt = require("jsonwebtoken");
require('dotenv/config');





async function login(email,password){
    try {
        const user = await User.findAll({
            where: {
                email: email
            }
        });
    
       
        if(user.length > 0){
         
            
            const check = await bcrypt.compare(password,user[0]['password']);
           
            if(check){
                
                
                
               
                const secret = process.env.SECRET;
               
                const token =  jwt.sign({
                    id:user[0]['user_id'],
                    email:user[0]['email'],
                    roles:role
                },secret);
                return token;
            }else{
                return false;
            }
           
        }else{
            return false;
        }
    } catch (error) {
        console.error(`Erro when login!`, error);
    }
}

module.exports = {
    login
}