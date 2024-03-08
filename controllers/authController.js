const { Sequelize, DataTypes, Model } = require('sequelize');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const db = require("../models/model");
const User = db.user;
const { createToken } = require('../utils/tokenUtils');
require('dotenv/config');



const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({
            where: {
                email
            }
        });

        if (user) {
            const passwordMatch = await bcrypt.compare(password, user.password);

            if (passwordMatch) {
                const secret = process.env.SECRET;
                const token = await createToken(secret, user);
                return res.status(200).send({ "token": token });
            } else {
                return res.status(400).send({ "message": "Incorrect email or password" });
            }
        } else {
            return res.status(400).send({ "message": "Incorrect email or password" });
        }
    } catch (error) {
        console.error(`Error when trying to log in:`, error);
        return res.status(500).send({ "message": "Error when trying to log in" });
    }


};



module.exports = {
    login
}