
const express = require("express");
const routes = express.Router();

const { insertAlbumData, findAllAlbums, findAlbumById, deleteAlbumById, updateAlbumById } = require('../controllers/albumController');

//----------------------------------ALBUM ENDPOINT------------------------------------------
routes.post('/album/',insertAlbumData);
routes.get('/album/', findAllAlbums);
routes.get('/album/:albumId', findAlbumById);
routes.delete('/album/:albumId',deleteAlbumById);
routes.put('/album/:albumId',updateAlbumById);
 module.exports = routes;