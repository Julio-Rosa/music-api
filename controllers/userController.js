const { Sequelize, DataTypes, Model } = require('sequelize');
const crypto = require('crypto');
const db = require("../models/model");
const User = db.user;
const { returnErrors } = require('../utils/errorsUtil');
const {encryptPassword} = require('../utils/encryptPassword');


async function insertNewUser(name, email, password) {

    const user = await User.findAll({
        where: {
            email: email
        }
    });
    if (user.length > 0) {

        return 1;

    } else {
        const options = { name, password, email };
        const errors = await returnErrors(options);
        if (errors == false) {
            try {
               const passwordHash =  await encryptPassword(password);

                const user = await User.create({
                    user_id: crypto.randomUUID(),
                    name: name,
                    email: email,
                    password: passwordHash
                });
               
               return  user;
                
            } catch (error) {
                console.error(`Error when creating a new user`, error);
            }



        } else {
            return errors;
        }
    }










};
async function getUserByEmail(email) {



    try {
        const user = await User.findAll({attributes: ['user_id','name','email']},{
            where: {
                email: email
            },
        });
        if (user.length == 0) {
            return 0;
        } else {
            return user;
        }

    } catch (error) {
        console.error(`Error when finding user with email "${email}"!`, error);
    }

};
async function findAllUsers() {

    try {
        const users = await User.findAll();
        if (users.length == 0) {
            return 0;
        } else {
            return users;
        }
    } catch (error) {
        console.error(`Error when finding all users!`, error);
    }


};
async function deleteUserById(user_id) {
    try {
        const userToDelete = await User.findByPk(user_id);

        if (userToDelete === null) {

            return null;
        } else {
            try {
                const deleted = await User.destroy({
                    where: {
                        user_id: user_id
                    }
                });
                if (deleted == 1) {
                    return true;
                } else {
                    return false;
                }
            } catch (error) {
                console.error("Error on delete =======================>", error);
            }
        }


    } catch (error) {
        console.error("Error on find ===================================>", error);
    }

}
async function updateUserById(user_id, name, email) {
    try {
        const userToUpdate = await User.findByPk(user_id);

        if (userToUpdate === null) {
            return null;
        } else {
            const options = { name, email };
            const errors = await returnErrors(options);

            if (errors == false) {
                const userByEmail = await getUserByEmail(email);
                if (userByEmail == 0) {
                    try {
                        const user = await User.update({ name: name, email: email },
                            {
                                where: { user_id: user_id }
                            });

                        if (user[0] === 1) {
                            const updatedUser = await User.findByPk(user_id);
                            return updatedUser;
                        } else {
                            return false;
                        }

                    } catch (error) {
                        console.error(`Error on update music with id ==>${user_id}!`, error);
                    }
                } else {
                    return 1;
                }

            } else {

                return errors;
            }

        }
    } catch (error) {
        console.error(`Error on fin music with id ==>${user_id}!`, error);
    }
}
async function updatePassword(user_id, password, newPassword, newPasswordRepeat ) {
    try {
        const user = await User.findByPk(user_id);
        const options = { newPassword, newPasswordRepeat };
        const errors = await returnErrors(options);

        if (errors == false) {
            if (user.password == password) {
                const updatedUser = await User.update({ password: newPassword }, {
                    where: { user_id: user_id }
                });


                return 1;


            } else {
                return false;
            }

        } else {

            return errors;
        }
    } catch (error) {
        console.error(`Error when updating password`, error);
    }


}
module.exports = {
    insertNewUser,
    getUserByEmail,
    findAllUsers,
    deleteUserById,
    updateUserById,
    updatePassword,
   

}