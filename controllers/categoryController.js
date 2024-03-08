const { Sequelize, DataTypes, Model } = require('sequelize');
const crypto = require('crypto');
const db = require("../models/model");
const Category = db.category;
const { isAdmin} = require('../middlewares/authorizationMiddleware');


const insertCategoryData = async (req, res) => {
    try {
        const { name } = req.body;
        const category = await Category.findOne({
            where: {
                name: name
            }
        });
        if (category) {
            res.status(400).send(JSON.stringify({ "message": "A category with this name already exists" }));
        } else {
            const category = await Category.create({
                category_id: crypto.randomUUID(),
                name: name
            });

            res.status(201).send(JSON.stringify(category));
        }

    } catch (error) {
        res.status(500).send(JSON.stringify({ "message": "Error when creating a new category" }));
        console.error(error);
    }

};

const findAllCategories = async (req, res) => {
    try {
        const categories = await Category.findAll();
        if (categories.length > 0) {
            res.status(200).send(categories);
        } else {
            res.status(404).send({ "message": "No categories found" });
        }

    } catch (error) {
        res.status(500).send({ "message": "Error when listing categories" });
        console.error(`Error when listing  categories`, error);
    }
};

const deleteCategorieById = async (req, res) => {
    try {
        const tokenHeader = req.headers["authorization"];
        if (!tokenHeader) {
            return res.status(403).send(JSON.stringify({ "message": "Invalid token" }));
        }

        const authorized = await isAdmin(tokenHeader);

        if (authorized === "expired") {
            
            return res.status(403).send(JSON.stringify({ "message": "Token expired!" }));
        }else if (!authorized){
            return res.status(403).send(JSON.stringify({ "message":"Not authorized!" }));
        }
        const categoryToDelete = await Category.findByPk(req.params.categoryId);

        if (categoryToDelete === null) {

            res.status(404).send(JSON.stringify({ "message": "Category Not Found" }));
        } else {

            const deleted = await Category.destroy({
                where: {
                    category_id: req.params.categoryId
                }
            });
            if (deleted == 1) {
                res.status(200).send(JSON.stringify({ "message": "Category Deleted" }));
            }
        }
    } catch (error) {
        res.status(500).send(JSON.stringify({ "message": "An error occurred while deleting" }));
        console.error(`Error when deleting category!`, error);
    }
};
const findCategoryById = async (req, res) =>{
    try {
        const category = await Category.findByPk(req.params.categoryId);
        if (category == null) {
            res.status(404).send(JSON.stringify({ "message": "Category Not Found" }));
        } else {
            res.status(200).send(JSON.stringify(category));
        }
    } catch (error) {
        res.status(500).send(JSON.stringify({ "message": "An error occurred while finding category" }));
        console.error(`Error when finding the category with the id "${req.params.categoryId}"!`, error);
    }
};

const updateCategoryById = async (req, res) => {
    try {
        const tokenHeader = req.headers["authorization"];
        if (!tokenHeader) {
            return res.status(403).send(JSON.stringify({ "message": "Invalid token" }));
        }

        const authorized = await isAdmin(tokenHeader);

        if (authorized === "expired") {
            
            return res.status(403).send(JSON.stringify({ "message": "Token expired!" }));
        }else if (!authorized){
            return res.status(403).send(JSON.stringify({ "message":"Not authorized!" }));
        }
        const {name} = req.body;
        const category = await Category.findByPk(req.params.categoryId);
        if (category == null) {
            res.status(404).send(JSON.stringify({ "message": "Category Not Found" }));
        } else {
          
            const category = await Category.findOne({
                where: {
                    name: name
                }
            });
          
            if ((category !== null) && (category.category_id !== req.params.categoryId)) {

                res.status(400).send(JSON.stringify({ "message": "A category with this name already exists" }));
            } else {
              
                    const category = await Category.update({
                        name: name
                    }, {
                        where: { category_id: req.params.categoryId }
                    });
                    const updatedCategory = await Category.findByPk(req.params.categoryId);
                    res.status(200).send(JSON.stringify(updatedCategory));

            }
        }
    } catch (error) {
        res.status(500).send(JSON.stringify({ "message": "Error when updating a  category!" }));
        console.error(`EError when updating a  category!`, error);
    }
};

module.exports = {
    insertCategoryData,
    findAllCategories,
    deleteCategorieById,
    findCategoryById,
    updateCategoryById
}