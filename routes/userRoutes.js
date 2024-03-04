const express = require("express");
const db = require("../models/model");
const Music = db.music;
const User = db.user;
const routes = express.Router();

const { insertAlbumData, findAllAlbums, findAlbumById, deleteAlbumById, updateAlbumById } = require('../controllers/albumController');
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



//------------------------------------- USER ENDPOINT------------------------------------------

routes.post('/user/new', insertNewUser);

routes.get('/user/all', findAllUsers);

routes.get('/user/:userId', getUserById);

routes.delete('/user/:userId', deleteUserById);

routes.put('/user/:userId', updateUserById);
routes.put('/user/password/:userId', updatePassword);





module.exports = routes;