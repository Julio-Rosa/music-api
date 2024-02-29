const { Sequelize, DataTypes, Model } = require('sequelize');
const crypto = require('crypto');
const db = require("../models/model");
const User = db.user;
const { returnErrors } = require('../utils/errorsUtil');
async function insertNewUser(name, email, password) {

    const user = await User.findAll({
        where: {
            email: email
        }
    });
    if (user.length > 0) {

        return 1;

    } else {
        const options = { name,password,email };
        const errors = await returnErrors(options);
        if (errors == false) {
            try {
                const user = await User.create({
                    user_id: crypto.randomUUID(),
                    name: name,
                    email: email,
                    password: password
                });
                return user;
            } catch (error) {
                console.error(`Error when creating a new user`, error);
            }



        } else {
            return errors;
        }
    }










};
module.exports = {
    insertNewUser
}