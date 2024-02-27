const { Sequelize, DataTypes, Model } = require('sequelize');
const crypto = require('crypto');
const db = require("../models/model");
const User = db.user;

async function insertNewUser(name,email,password){

    try {
        const user = await User.create({
            user_id: crypto.randomUUID(),
            name: name,
            email: email,
            password:password
        });
        return user;
    } catch (error) {
        console.error(`Error when creating a new user`, error);
    }

};
