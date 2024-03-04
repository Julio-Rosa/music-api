const express = require("express");
const db = require("../models/model");
const Music = db.music;
const User = db.user;
const routes = express.Router();


const { insertNewUser, getUserById, findAllUsers , deleteUserById, updateUserById, updatePassword} = require('../controllers/userController');
const {login} = require('../controllers/authController');

routes.use(express.json());



routes.post('/user/new', insertNewUser);

routes.get('/user/all', findAllUsers);

routes.get('/user/:userId', getUserById);

routes.delete('/user/:userId', deleteUserById);

routes.put('/user/:userId', updateUserById);
routes.put('/user/password/:userId', updatePassword);





module.exports = routes;