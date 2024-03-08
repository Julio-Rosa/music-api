const { Sequelize, DataTypes, Model } = require('sequelize');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const db = require("../models/model");
const User = db.user;
const { returnErrors } = require('../utils/errorsUtil');
const { encryptPassword } = require('../utils/encryptPassword');
const { createRoles } = require('../utils/createRolesUtil');
const { isAdmin, isAdminAndSameUser, returnRole } = require('../middlewares/authorizationMiddleware');
require('dotenv/config');


const insertNewUser = async (req, res) => {
    try {
        const tokenHeader = req.headers["authorization"];
        if (!tokenHeader) {
            return res.status(403).json({ "message": "Invalid token" });
        }
    
        const authorized = await isAdmin(tokenHeader);
        if (authorized === "expired") {
            return res.status(403).json({ "message": "Token expired!" });
        } else if (!authorized) {
            return res.status(403).json({ "message": "Not authorized!" });
        }
    
        const { name, email, password, role_name } = req.body;
        const userExists = await User.findOne({ where: { email } });
        if (userExists) {
            return res.status(400).json({ "message": "User already exists!" });
        }
    
        const role = await createRoles(role_name);
        const errors = await returnErrors({ name, password, email, role });
        if (errors) {
            return res.status(400).json({ "message": errors });
        }
    
        const passwordHash = await encryptPassword(password);
        const newUser = await User.create({
            user_id: crypto.randomUUID(),
            name,
            email,
            password: passwordHash,
            role
        });
        const userToReturn = await User.findByPk(newUser.user_id, { attributes: ['user_id', 'name', 'email', 'role'] });
        return res.status(201).json(userToReturn);
    } catch (error) {
        console.error(`Error occurred:`, error);
        return res.status(500).json({ "message": "Error occurred while processing the request" });
    }
}
const getUserById = async (req, res) => {
    try {
        const tokenHeader = req.headers["authorization"];
        if (!tokenHeader) {
            return res.status(403).json({ "message": "Invalid token" });
        }
    
        const authorized = await isAdmin(tokenHeader);
        if (authorized === "expired") {
            return res.status(403).json({ "message": "Token expired!" });
        } else if (!authorized) {
            return res.status(403).json({ "message": "Not authorized!" });
        }

        const user = await User.findByPk(req.params.userId, { attributes: ['user_id', 'name', 'email', 'role'] });
        if (user === null) {
            return res.status(404).json({ "message": "User not found" });
        }
        return res.status(200).json(user);
    } catch (error) {
        console.error(`Error when finding user with id "${req.params.userId}":`, error);
        return res.status(500).json({ "message": "Error when finding user by id" });
    }

};

const findAllUsers = async (req, res) => {
    try {
        const tokenHeader = req.headers["authorization"];
        if (!tokenHeader) {
            return res.status(403).json({ "message": "Invalid token" });
        }
    
        const authorized = await isAdmin(tokenHeader);
        if (authorized === "expired") {
            return res.status(403).json({ "message": "Token expired!" });
        } else if (!authorized) {
            return res.status(403).json({ "message": "Not authorized!" });
        }
    
        const users = await User.findAll({ attributes: ['user_id', 'name', 'email', 'role'] });
        if (users.length === 0) {
            return res.status(404).json({ "message": "No users found!" });
        }
        return res.status(200).json(users);
    } catch (error) {
        console.error(`Error when finding all users:`, error);
        return res.status(500).json({ "message": "Error when finding all users" });
    }
};

const deleteUserById = async (req, res) => {
    try {
        const tokenHeader = req.headers["authorization"];
        if (!tokenHeader) {
            return res.status(403).json({ "message": "Invalid token" });
        }
    
        const authorized = await isAdmin(tokenHeader);
        if (authorized === "expired") {
            return res.status(403).json({ "message": "Token expired!" });
        } else if (!authorized) {
            return res.status(403).json({ "message": "Not authorized!" });
        }
    
        const userToDelete = await User.findByPk(req.params.userId);
        if (userToDelete === null) {
            return res.status(404).json({ "message": "User not found!" });
        }
    
        const deleted = await User.destroy({
            where: {
                user_id: req.params.userId
            }
        });
        if (deleted === 1) {
            return res.status(200).json({ "message": "Deleted!" });
        }
        return res.status(500).json({ "message": "Error when deleting user!" });
    } catch (error) {
        console.error("Error when deleting user:", error);
        return res.status(500).json({ "message": "Error when deleting user!" });
    }
};

const updateUserById = async (req, res) => {
    try {
        const tokenHeader = req.headers["authorization"];
        if (!tokenHeader) {
            return res.status(403).json({ "message": "Invalid token" });
        }
    
        const authorized = await isAdminAndSameUser(tokenHeader, req.params.userId);
        if (authorized === "expired") {
            return res.status(403).json({ "message": "Token expired!" });
        } else if (!authorized) {
            return res.status(403).json({ "message": "Not authorized!" });
        }
    
        const userToUpdate = await User.findByPk(req.params.userId);
        if (!userToUpdate) {
            return res.status(404).json({ "message": "User not found" });
        }
    
        const { name, email, role_name } = req.body;
        const role = await createRoles(role_name);
        const options = { name, email, role };
        const errors = await returnErrors(options);
        
        if (errors) {
            return res.status(400).json({ "message": errors });
        }
    
        const emailExists = await User.findOne({ where: { email: email } });
        if (emailExists && emailExists.user_id !== req.params.userId) {
            return res.status(400).json({ "message": "User with this email already exists!" });
        }
    
        const userRole = await returnRole(tokenHeader);
        let updatedUser;
    
        if (userRole === "USER") {
            updatedUser = await User.update({ name: name, email: email }, { where: { user_id: req.params.userId } });
        } else {
            updatedUser = await User.update({ name: name, email: email, role: role_name }, { where: { user_id: req.params.userId } });
        }
    
        if (updatedUser == 1) {
            const user = await User.findByPk(req.params.userId, { attributes: ['user_id', 'name', 'email', 'role'] });
            return res.status(200).json(user);
        } else {
            return res.status(500).json({ "message": "Error when updating user!" });
        }
    
    } catch (error) {
        console.error("Error when updating user:", error);
        return res.status(500).json({ "message": "Error when updating user!" });
    }
};

const updatePassword = async (req, res) => {
    try {
        const tokenHeader = req.headers["authorization"];
        if (!tokenHeader) {
            return res.status(403).json({ "message": "Invalid token" });
        }
    
        const authorized = await isAdminAndSameUser(tokenHeader, req.params.userId);
        if (authorized === "expired") {
            return res.status(403).json({ "message": "Token expired!" });
        } else if (!authorized) {
            return res.status(403).json({ "message": "Not authorized!" });
        }
    
        const { password, newPassword, newPasswordRepeat } = req.body;
        const user = await User.findByPk(req.params.userId);
    
        if (!user) {
            return res.status(404).json({ "message": "User not found!" });
        }
    
        const options = { newPassword, newPasswordRepeat };
        const errors = await returnErrors(options);
    
        if (errors) {
            return res.status(400).json({ "errors": errors });
        }
    
        const check = await bcrypt.compare(password, user.password);
        if (!check) {
            return res.status(400).json({ "message": "Incorrect password!" });
        }
    
        const passwordHash = await encryptPassword(newPassword);
        await User.update({ password: passwordHash }, {
            where: { user_id: req.params.userId }
        });
    
        return res.status(200).json({ "message": "Password updated!" });
    } catch (error) {
        console.error("Error when updating password:", error);
        return res.status(500).json({ "message": "Error when updating password!" });
    }

}

module.exports = {
    insertNewUser,
    getUserById,
    findAllUsers,
    deleteUserById,
    updateUserById,
    updatePassword,


}