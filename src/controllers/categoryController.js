const { Sequelize, DataTypes, Model } = require('sequelize');
const crypto = require('crypto');
const db = require("../models/model");
const Category = db.category;
const { isAdmin, isAdminOrEditor} = require('../middlewares/authorizationMiddleware');


const insertCategoryData = async (req, res) => {
    try {
        const { name } = req.body;
        const existingCategory = await Category.findOne({
            where: {
                name
            }
        });
    
        if (existingCategory) {
            return res.status(400).send({ "message": "A category with this name already exists" });
        } else {
            const newCategory = await Category.create({
                category_id: crypto.randomUUID(),
                name
            });
            return res.status(201).send(newCategory);
        }
    } catch (error) {
        console.error(`Error when creating a new category:`, error);
        return res.status(500).send({ "message": "Error when creating a new category" });
    }
};

const findAllCategories = async (req, res) => {
    try {
        const categories = await Category.findAll();
    
        if (categories.length > 0) {
            return res.status(200).send(categories);
        } else {
            return res.status(404).send({ "message": "No categories found" });
        }
    } catch (error) {
        console.error(`Error when listing categories:`, error);
        return res.status(500).send({ "message": "Error when listing categories" });
    }
};

const deleteCategorieById = async (req, res) => {
    try {
        const tokenHeader = req.headers["authorization"];
        if (!tokenHeader) {
            return res.status(403).send({ "message": "Invalid token" });
        }
    
        const authorized = await isAdminOrEditor(tokenHeader);
    
        if (authorized === "expired") {
            return res.status(403).send({ "message": "Token expired!" });
        } else if (!authorized) {
            return res.status(403).send({ "message": "Not authorized!" });
        }
    
        const categoryToDelete = await Category.findByPk(req.params.categoryId);
    
        if (!categoryToDelete) {
            return res.status(404).send({ "message": "Category Not Found" });
        }
    
        const deleted = await Category.destroy({
            where: {
                category_id: req.params.categoryId
            }
        });
    
        if (deleted === 1) {
            return res.status(200).send({ "message": "Category Deleted" });
        }
    } catch (error) {
        console.error(`Error when deleting category:`, error);
        return res.status(500).send({ "message": "An error occurred while deleting" });
    }
};
const findCategoryById = async (req, res) =>{
    try {
        const category = await Category.findByPk(req.params.categoryId);
        if (!category) {
            return res.status(404).send({ "message": "Category Not Found" });
        } else {
            return res.status(200).send(category);
        }
    } catch (error) {
        console.error(`Error when finding the category with the id "${req.params.categoryId}":`, error);
        return res.status(500).send({ "message": "An error occurred while finding category" });
    }
};
const updateCategoryById = async (req, res) => {
    try {
        const tokenHeader = req.headers["authorization"];
        if (!tokenHeader) {
            return res.status(403).send({ "message": "Invalid token" });
        }
    
        const authorized = await isAdminOrEditor(tokenHeader);
        if (authorized === "expired") {
            return res.status(403).send({ "message": "Token expired!" });
        } else if (!authorized) {
            return res.status(403).send({ "message": "Not authorized!" });
        }
    
        const { name } = req.body;
        const existingCategory = await Category.findOne({
            where: {
                name
            }
        });
    
        if (existingCategory && existingCategory.category_id !== req.params.categoryId) {
            return res.status(400).send({ "message": "A category with this name already exists" });
        }
    
        const categoryToUpdate = await Category.findByPk(req.params.categoryId);
        if (!categoryToUpdate) {
            return res.status(404).send({ "message": "Category Not Found" });
        }
    
        await Category.update({ name }, { where: { category_id: req.params.categoryId } });
        const updatedCategory = await Category.findByPk(req.params.categoryId);
        return res.status(200).send(updatedCategory);
    
    } catch (error) {
        console.error(`Error when updating a category:`, error);
        return res.status(500).send({ "message": "Error when updating a category!" });
    }
};

module.exports = {
    insertCategoryData,
    findAllCategories,
    deleteCategorieById,
    findCategoryById,
    updateCategoryById
}