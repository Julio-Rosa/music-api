const { Sequelize, DataTypes, Model } = require('sequelize');
const { Category } = require('../models/model');
const crypto = require('crypto');

async function insertCategoryData(name) {

    const category = await Category.findAll({
        where: {
            name: name
        }
    });
    if (category.length == 1) {
        return 1;
    } else {
        try {
            const category = await Category.create({
                category_id: crypto.randomUUID(),
                name: name
            });

            return category;

        } catch (error) {
            console.error(`Error on create category with name ==>${name}`, error);
        }

    }


};
async function findAllCategories() {

    try {
        const categories = await Category.findAll();
        if (categories.length > 0) {
            return categories;
        } else {
            return 0;
        }

    } catch (error) {
        console.error(`Error on list alll categories`, error);
    }
};
async function deleteCategorieById(category_id) {
    try {
        const categoryToDelete = await Category.findByPk(category_id);

        if (categoryToDelete === null) {

            return null;
        } else {
            try {
                const deleted = await Category.destroy({
                    where: {
                        category_id: category_id
                    }
                });
                if (deleted == 1) {
                    return true;
                } else {
                    return false;
                }
            } catch (error) {
                console.error(`Error when deleting category with id ==> ${category_id}`, error);
            }
        }



    } catch (error) {
        console.error(`Error when finding the category with the id "${category_id}" to delete`, error);
    }
};
async function findCategoryById(category_id){
    try{
        const category = await Category.findByPk(category_id);
        if(category == null){
            return null;
        }else{
            return category;
        }
    }catch(error){
        console.error(`Error when finding the category with the id "${category_id}"!`, error);
    }
};
async function updateCategoryById(category_id, name){
    try{
        const category = await Category.findByPk(category_id);
        if(category == null){
            return null;
        }else{
            const category = await Category.findAll({
                where: {
                    name: name
                }
            });
            
            if (category.length == 1 && category[0]['dataValues']['name'] != name) {
                
                return 1;
            } else {
                try {
                    const category = await Category.update({
                        name: name
                    },{
                        where:{category_id:category_id}
                    });
                    const updatedCategory = await Category.findByPk(category_id);
                    return updatedCategory;
        
                } catch (error) {
                    console.error(`Error on create category with name ==>${name}`, error);
                }
        
            }
        }
    }catch(error){
        console.error(`Error when finding the category with the id "${category_id}"!`, error);
    }
    
};
module.exports = {
    insertCategoryData,
    findAllCategories,
    deleteCategorieById,
    findCategoryById,
    updateCategoryById
}