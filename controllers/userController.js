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
            return res.status(403).send(JSON.stringify({ "message": "Invalid token" }));
        }

        const authorized = await isAdmin(tokenHeader);

        if (!authorized) {
            return res.status(403).send(JSON.stringify({ "message": "Not authorized!" }));
        }

        const { name, email, password, role_name } = req.body;
        const userExists = await User.findOne({ where: { email: email } });

        if (userExists) {
            return res.status(400).send(JSON.stringify({ "message": "User already exists!" }));
        }

        const role = await createRoles(role_name);

        const errors = await returnErrors({ name, password, email, role });
        if (errors) {
            return res.status(400).send(JSON.stringify({ "message": errors }));
        }

        const passwordHash = await encryptPassword(password);

        const newUser = await User.create({
            user_id: crypto.randomUUID(),
            name: name,
            email: email,
            password: passwordHash,
            role: role
        });
        const userToReturn = await User.findByPk(newUser.user_id, { attributes: ['user_id', 'name', 'email', 'role'] });
        return res.status(201).send(JSON.stringify(userToReturn));


    } catch (error) {
        console.error(`Error ocurred:`, error);
        return res.status(500).send(JSON.stringify({ "message": "Error occurred while processing the request" }));
    }
}
const getUserById = async (req, res) => {
    try {

        const user = await User.findByPk(req.params.userId, { attributes: ['user_id', 'name', 'email', 'role'] }, {
        });

        if (user == null) {
            res.status(404).send(JSON.stringify({ "message": "User not found!" }));
        } else {

            res.status(200).send(JSON.stringify(user));

        }

    } catch (error) {
        res.status(500).send(JSON.stringify({ "message": "Error when finding user by id!" }));
        console.error(`Error when finding user with email "${user_id}"!`, error);
    }

};

const findAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({ attributes: ['user_id', 'name', 'email', 'role'] });
        if (users.length == 0) {
            res.status(404).send(JSON.stringify({ "message": "No users found!" }));
        } else {
            res.status(404).send(JSON.stringify(users));
        }
    } catch (error) {
        res.status(500).send(JSON.stringify({ "message": "Error whren finding all users!" }));
        console.error(`Error when finding all users!`, error);
    }
};

const deleteUserById = async (req, res) => {
    try {
        const tokenHeader = req.headers["authorization"];
        if (!tokenHeader) {
            return res.status(403).send(JSON.stringify({ "message": "Invalid token" }));
        }

        const authorized = await isAdmin(tokenHeader);

        if (!authorized) {
            return res.status(403).send(JSON.stringify({ "message": "Not authorized!" }));
        }


        const userToDelete = await User.findByPk(req.params.userId);

        if (userToDelete === null) {

            res.status(404).send(JSON.stringify({ "message": "User not found!" }));
        } else {
            try {
                const deleted = await User.destroy({
                    where: {
                        user_id: req.params.userId
                    }
                });
                if (deleted == 1) {
                    res.status(200).send(JSON.stringify({ "message": "Deleted!" }));
                }
            } catch (error) {
                console.error("Error when deleting user ===================================>", error);
                res.status(500).send(JSON.stringify({ "message": "Error when deleting user!" }));
            }
        }


    } catch (error) {
        console.error("Error when finding ===================================>", error);
    }
};

const updateUserById = async (req, res) => {
    try {
        const tokenHeader = req.headers["authorization"];
        if (!tokenHeader) {
            return res.status(403).send(JSON.stringify({ "message": "Invalid token" }));
        }

        const authorized = await isAdminAndSameUser(tokenHeader, req.params.userId);

        if (!authorized) {
            return res.status(403).send(JSON.stringify({ "message": "Not authorized!" }));
        }
        const userToUpdate = await User.findByPk(req.params.userId);

        if (userToUpdate == null) {
            res.status(500).send(JSON.stringify({ "message": "User not found" }));
        } else {
            const { name, email, role_name } = req.body;
            const role = await createRoles(role_name);

            const options = { name, email, role };
            const errors = await returnErrors(options);

            if (errors != false) {
                res.status(500).send(JSON.stringify({ "message": errors }));
            } else {

                const emailExists = await User.findOne({ where: { email: email } });

                if (emailExists instanceof User && emailExists.user_id !== req.params.userId) {
                    res.status(400).send(JSON.stringify({ "message": "User with this email already exists!" }));
                } else {
                    const userRole = await returnRole(tokenHeader);

                    if (userRole == "USER") {
                        const updatedUser = await User.update({ name: name, email: email }, { where: { user_id: req.params.userId } });
                        if (updatedUser == 1) {
                            const user = await User.findByPk(req.params.userId, { attributes: ['user_id', 'name', 'email', 'role'] });
                            res.status(200).send(JSON.stringify(user));
                        }
                    }else{
                        const updatedUser = await User.update({ name: name, email: email, role: role_name }, { where: { user_id: req.params.userId } });
                    if (updatedUser == 1) {
                        const user = await User.findByPk(req.params.userId, { attributes: ['user_id', 'name', 'email', 'role'] });
                        res.status(200).send(JSON.stringify(user));
                    }
                    }
                    
                }


            }



        }

    } catch (error) {
        console.error(error);
        res.status(500).send(JSON.stringify({ "message": "Error when updating user!" }));
    }
};

const updatePassword = async (req, res) => {
    try {
        const { password, newPassword, newPasswordRepeat } = req.body;
        const user = await User.findByPk(req.params.userId);
        const options = { newPassword, newPasswordRepeat };
        const errors = await returnErrors(options);

        if (errors == false) {
            const check = await bcrypt.compare(password, user.password);
            if (check) {
                const passwordHash = await encryptPassword(newPassword);
                const updatedUser = await User.update({ password: passwordHash }, {
                    where: { user_id: req.params.userId }
                });


                res.status(200).send(JSON.stringify({ "message": "Password updated!" }));


            } else {
                res.status(400).send(JSON.stringify({ "message": "Incorrect password!" }));
            }

        } else {

            res.status(400).send(JSON.stringify({ "errors": errors }));
        }
    } catch (error) {
        res.status(400).send(JSON.stringify({ "message": "Error when updating password!" }));
        console.error(`Error when updating password`, error);
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