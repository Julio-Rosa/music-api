const express = require("express");
const db = require("../models/model");
const User = db.user;
const routes = express.Router();
const { user,insertNewUser, getUserById, findAllUsers, deleteUserById, updateUserById, updatePassword, resetUserPassword, updateUser } = require('../controllers/userController');
const { login } = require('../controllers/authController');

routes.use(express.json());

routes.get('/user/me', user);
routes.put('/user/me', updateUser)
routes.put('/user/me/password', updatePassword)


routes.post('/user/new', insertNewUser);


routes.get('/user/all', findAllUsers);

routes.get('/user/:userId', getUserById);

routes.delete('/user/:userId', deleteUserById);

routes.put('/user/:userId', updateUserById);
routes.put('/user/password/:userId', resetUserPassword);






module.exports = routes;