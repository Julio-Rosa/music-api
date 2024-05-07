
const { verifyToken } = require('../utils/tokenUtils');
require('dotenv/config');
const db = require("../models/model");
const User = db.user;
async function isAdmin(tokenHeader) {
    try {
        // Verify the token
        const token = await verifyToken(tokenHeader, process.env.SECRET);

        if (token === 'expired') {
            return "expired";
        } else {
            // Find user by token ID
            const user = await User.findByPk(token.id);

            // Check if user has admin role
            return user && user.role === "ADMIN";
        }
    } catch (error) {
        // Handle errors
        console.error(`Error in isAdmin function:`, error.message);
        return false;
    }



};
async function isAdminOrEditor(tokenHeader) {
    try {
        // Verify the token
        const token = await verifyToken(tokenHeader, process.env.SECRET);

        if (token === 'expired') {
            return "expired";
        } else {
            // Find user by token ID
            const user = await User.findByPk(token.id);

            // Check if user has admin role
            return user && user.role === "ADMIN" || user && user.role === "EDITOR";
        }
    } catch (error) {
        // Handle errors
        console.error(`Error in isAdmin function:`, error.message);
        return false;
    }



};
async function isSameUser(tokenHeader) {
    try {
        // Verify the token
        const token = await verifyToken(tokenHeader, process.env.SECRET);

        if (token === 'expired') {
            return "expired";
        } else {
            // Find user by token ID
            const user = await User.findByPk(token.id);

            // Check if user is admin or same user
            return user;
        }
    } catch (error) {
        // Handle errors
        console.error(`Error in isAdminAndSameUser function:`, error.message);
        return false;
    }
};

async function returnRole(tokenHeader) {
    try {
        const token = await verifyToken(tokenHeader, process.env.SECRET);
        const user = await User.findByPk(token.id);
        return user.role;
    } catch (error) {
        console.error("Error when return role", error.message);
    }
}

module.exports = {
    isAdmin,
    isSameUser,
    returnRole,
    isAdminOrEditor

}