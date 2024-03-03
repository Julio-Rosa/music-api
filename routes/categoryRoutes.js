const express = require("express");
const routes = express.Router();
const { insertCategoryData, findAllCategories, deleteCategorieById, findCategoryById, updateCategoryById } = require('../controllers/categoryController');


routes.post('/category/',insertCategoryData);
routes.get('/category/', findAllCategories);
routes.get('/category/:categoryId', findCategoryById);
routes.delete('/category/:categoryId', deleteCategorieById);
routes.put('/category/:categoryId', updateCategoryById);


module.exports = routes;