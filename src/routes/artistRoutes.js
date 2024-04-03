const express = require("express");
const routes = express.Router();
const { insertArtistData, findAllArtists, findArtistById, deleteArtistById, updateArtistById, findAllArtistsByName } = require('../controllers/artistController');


routes.post('/artist/',insertArtistData);
routes.get('/artist/', findAllArtists);
routes.get('/artist/name', findAllArtistsByName);
routes.get('/artist/:artistId',findArtistById);
routes.delete('/artist/:artistId',deleteArtistById);
routes.put('/artist/:artistId',updateArtistById);














module.exports = routes;