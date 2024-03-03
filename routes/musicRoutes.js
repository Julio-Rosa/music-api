const express = require("express");
const routes = express.Router();
const { insertMusicData, findAllMusics, findAllMusicsByCategoryId, findAllMusicsByArtistId, findAllMusicsByAlbumId, deleteMusicBydId, updateMusicById, findById } = require('../controllers/musicController');


routes.post('/music/new', insertMusicData);
routes.get('/music/all', findAllMusics);
routes.get('/music/:musicId', findById);
routes.get('/music/category/:categoryId', findAllMusicsByCategoryId);
routes.get('/music/artist/:artistId', findAllMusicsByArtistId);
routes.get('/music/album/:albumId', findAllMusicsByAlbumId);
routes.delete('/music/:musicId', deleteMusicBydId);
routes.put('/music/:musicId', updateMusicById);




module.exports = routes;


