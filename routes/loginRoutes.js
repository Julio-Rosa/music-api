const express = require("express");
const db = require("../models/model");
const User = db.user;
const routes = express.Router();
const {login} = require('../controllers/authController');

routes.post('/auth/login',login);

module.exports = routes;