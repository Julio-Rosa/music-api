const { Sequelize, DataTypes, Model } = require('sequelize');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const db = require("../models/model");
const User = db.user;
const { returnErrors } = require('../utils/errorsUtil');
const { encryptPassword } = require('../utils/encryptPassword');
const jwt = require("jsonwebtoken");
require('dotenv/config');



const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({
            where: {
                email: email
            }
        });
        if (user) {
            const check = await bcrypt.compare(password, user.password);

            if (check) {
                const secret = process.env.SECRET;
                const token = jwt.sign({
                    id: user.id,
                    email: user.email,
                    roles: user.role
                }, secret);
                res.status(200).send(JSON.stringify({ "token": token }));
            } else {
                res.status(400).send(JSON.stringify({ "message": "Incorrect email or password" }));
            }

        } else {
            res.status(400).send(JSON.stringify({ "message": "Incorrect email or password" }));
        }
    } catch (error) {
        res.status(500).send(JSON.stringify({ "message": "Error when trying to log in" }));
        console.error(`Erro when login!`, error);
    }


};



module.exports = {
    login
}