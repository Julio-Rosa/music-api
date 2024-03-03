const express = require("express");
const db = require("../models/model");
const Music = db.music;
const User = db.user;
const routes = express.Router();
const { insertCategoryData, findAllCategories, deleteCategorieById, findCategoryById, updateCategoryById } = require('../controllers/categoryController');
const { insertAlbumData, findAllAlbums, findAlbumById, deleteAlbumById, updateAlbumById } = require('../controllers/albumController');
const { insertArtistData, findAllArtists, findArtistById, deleteArtistById, updateArtistById } = require('../controllers/artistController');
const { insertNewUser, getUserById, findAllUsers , deleteUserById, updateUserById, updatePassword} = require('../controllers/userController');
const {login} = require('../controllers/authController');

routes.use(express.json());





//----------------------------------ALBUM ENDPOINT------------------------------------------
routes.post('/album/new', async (req, res) => {
    const { name, image_url, artist_id } = req.body;
    const album = await insertAlbumData(name, image_url, artist_id);
    if (album) {
        res.status(201).send(JSON.stringify(album));
    } else {
        res.status(500).send(JSON.stringify({ "message": "Error when creating a new album" }));
    }

});
routes.get('/album/all', async (req, res) => {
    const albums = await findAllAlbums();
    if (albums == 0) {
        res.status(404).send(JSON.stringify({ "message": "No albums found" }));
    } else if (albums) {
        res.status(200).send(JSON.stringify(albums));
    } else {
        res.status(500).send(JSON.stringify({ "message": "Error listing all albums" }));
    }
});
routes.get('/album/:albumId', async (req, res) => {
    const album = await findAlbumById(req.params.albumId);
    if (album == 0) {
        res.status(404).send(JSON.stringify({ "message": "Album not found!" }));
    } else if (album) {
        res.status(200).send(JSON.stringify(album));
    } else {
        res.status(500).send(JSON.stringify({ "message": "Error listing album by id" }));
    }
});
routes.delete('/album/delete/:albumId', async (req, res) => {
    const deleted = await deleteAlbumById(req.params.albumId);
    if (deleted === 0) {

        res.status(404).send(JSON.stringify({ "message": "Album Not Found" }));
    } else {
        if (deleted == true) {
            res.status(200).send(JSON.stringify({ "message": "Deleted" }));
        } else {
            res.status(500).send(JSON.stringify({ "message": "An error occurred while deleting" }));
        }
    }
});
routes.put('/album/update/:albumId', async (req, res) => {
    const { name, image_url, artist_id } = req.body;
    const album = await updateAlbumById(req.params.albumId, name, image_url, artist_id);
    if (album == 0 || album == false) {
        res.status(404).send(JSON.stringify({ "message": "Album Not Found" }));
    } else if (album) {
        res.status(200).send(JSON.stringify(album));
    } else {
        res.status(500).send(JSON.stringify({ "message": "An error occurred while updating" }));
    }
});

//---------------------- ARTIST ENDPOINT-------------------------------------------

routes.post('/artist/new', async (req, res) => {
    const { name, image_url } = req.body;
    const artist = await insertArtistData(name, image_url);
    res.status(201).send(artist);
});
routes.get('/artist/all', async (req, res) => {
    const artists = await findAllArtists();
    if (artists == 0) {
        res.status(404).send(JSON.stringify({ "message": "No artists found!" }));
    } else if (artists) {
        res.status(200).send(JSON.stringify(artists));
    } else {
        res.status(500).send(JSON.stringify({ "message": "Error listing all artists!" }));
    }
});
routes.get('/artist/:artistId', async (req, res) => {
    const artist = await findArtistById(req.params.artistId);
    if (artist == null) {
        res.status(404).send(JSON.stringify({ "message": "No artist found with this id!" }));
    } else if (artist) {
        res.status(200).send(JSON.stringify(artist));
    } else {
        res.status(500).send(JSON.stringify({ "message": "Error when listing  artist by id!" }));
    }
});
routes.delete('/artist/delete/:artistId', async (req, res) => {
    const deleted = await deleteArtistById(req.params.artistId);
    if (deleted == false) {
        res.status(404).send(JSON.stringify({ "message": "No artist found with this id!" }));
    } else if (deleted == true) {

        res.status(200).send(JSON.stringify({ "message": "Deleted!" }));
    } else {
        res.status(500).send(JSON.stringify({ "message": "Error when deleting  artist by id!" }));
    }
});
routes.put('/artist/update/:artistId', async (req, res) => {
    const { name, image_url } = req.body;
    const artist = await updateArtistById(req.params.artistId, name, image_url);
    if (artist == null) {
        res.status(404).send(JSON.stringify({ "message": "Artist not found!" }));
    } else if (artist) {
        res.status(200).send(JSON.stringify(artist));
    } else {
        res.status(500).send(JSON.stringify({ "message": "Error when updating artist!" }));
    }
});

//-------------------------- CATEGORY ENDPOINT ---------------------------------------------
routes.post('/category/new', async (req, res) => {
    const { name } = req.body;
    const category = await insertCategoryData(name);
    if (category == 1) {
        res.status(400).send(JSON.stringify({ "message": "A category with this name already exists" }));
    } else if (category) {
        res.status(201).send(JSON.stringify(category));
    } else {
        res.status(500).send(JSON.stringify({ "message": "Error when creating a new category" }));
    }
});
routes.get('/category/all', async (req, res) => {
    const categories = await findAllCategories();
    if (categories) {
        res.status(200).send(categories);
    } else if (categories == 0) {
        res.status(404).send({ "message": "No categories found" });
    } else {
        res.status(500).send({ "message": "Error when listing categories" });
    }

});
routes.get('/category/:categoryId', async (req, res) => {
    const category = await findCategoryById(req.params.categoryId);

    if (category == null) {
        res.status(404).send(JSON.stringify({ "message": "Category Not Found" }));
    } else if (category) {
        res.status(200).send(JSON.stringify(category));
    } else {
        res.status(500).send(JSON.stringify({ "message": "An error occurred while finding" }));
    }
});
routes.delete('/category/delete/:categoryId', async (req, res) => {
    const deleted = await deleteCategorieById(req.params.categoryId);
    if (deleted === null) {

        res.status(404).send(JSON.stringify({ "message": "Category Not Found" }));
    } else {
        if (deleted == true) {
            res.status(200).send(JSON.stringify({ "message": "Category Deleted" }));
        } else {
            res.status(500).send(JSON.stringify({ "message": "An error occurred while deleting" }));
        }
    }

});
routes.put('/category/update/:categoryId', async (req, res) => {
    const { name } = req.body;
    const category = await updateCategoryById(req.params.categoryId, name);
    if (category == 1) {
        res.status(400).send(JSON.stringify({ "message": "A category with this name already exists" }));
    } else if (category) {
        res.status(200).send(JSON.stringify(category));
    } else if (category == null) {
        res.status(404).send(JSON.stringify({ "message": "Category Not Found" }));
    } else {
        res.status(500).send(JSON.stringify({ "message": "Error when creating a new category" }));
    }

});
//------------------------------------- USER ENDPOINT------------------------------------------

routes.post('/user/new', insertNewUser);

routes.get('/user/all', findAllUsers);

routes.get('/user/:userId', getUserById);

routes.delete('/user/:userId', deleteUserById);

routes.put('/user/:userId', updateUserById);
routes.put('/user/password/:userId', updatePassword);





module.exports = routes;