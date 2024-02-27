const express = require("express");
const routes = express.Router();
const { insertAlbumData, findAllAlbums, findAlbumById, deleteAlbumById, updateAlbumById } = require('../controllers/albumController');
const { insertMusicData, findAllMusics, findAllMusicsByCategoryId, findAllMusicsByArtistId, findAllMusicsByAlbumId, deleteMusicBydId, updateMusicById, findById} = require('../controllers/musicController');
const { Music } = require("../models/model");
routes.use(express.json());


//------------------- MUSIC ENDPOINTS--------------------------------------
routes.post('/music/new', async (req, res) => {
    const { release_date, name, album_id, artist_id, category_id } = req.body;
    const music = await insertMusicData(release_date, name, album_id, artist_id, category_id);
    if(!(music instanceof Music)){
    
        res.status(400).send(JSON.stringify({"errors":music}));
    }else if(music){
        res.status(201).send(JSON.stringify(music));
    }else{
        res.status(500).send(JSON.stringify({"message":"Error when cresting a new music!"}));
    }
   
});
routes.get('/music/all', async (req, res) => {
    const musics = await findAllMusics();
    if (musics) {
        res.status(200).send(JSON.stringify(musics));
    } else if (musics == 0) {
        res.status(404).send(JSON.stringify({ "message": "No musics were found" }))
    } else {
        res.status(500).send(JSON.stringify({ "message": "Error when listing musics" }))
    }
});
routes.get('/music/:musicId', async (req, res) => {
    const music = await findById(req.params.musicId);
    if (music === null) {
        res.status(404).send(JSON.stringify({ "message": "Music Not Found" }));
    } else {
        if (music) {
            res.status(200).send(JSON.stringify(music));
        } else {
            res.status(500).send(JSON.stringify({ "message": "An error occurred while find" }));
        }
    }
});
routes.get('/music/all/category/:categoryId', async (req, res) => {
    const musics = await findAllMusicsByCategoryId(req.params.categoryId);
    if (musics === false) {
        res.status(404).send(JSON.stringify({ "message": "Not Found!" }));
    } else {
        res.status(200).send(JSON.stringify(musics));
    }

});
routes.get('/music/all/artist/:artistId', async (req, res) => {
    const musics = await findAllMusicsByArtistId(req.params.artistId);
    if (musics == false) {
        res.status(404).send(JSON.stringify({ "message": "Not Found!" }));
    } else {
        res.status(200).send(JSON.stringify(musics));
    }
});
routes.get('/music/all/album/:albumId', async (req, res) => {
    const musics = await findAllMusicsByAlbumId(req.params.albumId);
    if (musics == false) {
        res.status(404).send(JSON.stringify({ "message": "Not Found!" }));
    } else {
        res.status(200).send(JSON.stringify(musics));
    }
});
routes.delete('/music/delete/:musicId', async (req, res) => {
    const deleted = await deleteMusicBydId(req.params.musicId);
    if (deleted === null) {

        res.status(404).send(JSON.stringify({ "message": "Music Not Found" }));
    } else {
        if (deleted == true) {
            res.status(200).send(JSON.stringify({ "message": "Deleted" }));
        } else {
            res.status(500).send(JSON.stringify({ "message": "An error occurred while deleting" }));
        }
    }

});
routes.put('/music/update/:musicId', async (req, res) => {
    const { name, release_date, album_id, category_id, artist_id } = req.body;
    const music = await updateMusicById(req.params.musicId, name, release_date, album_id, category_id, artist_id);


    if (music === null) {
        res.status(404).send(JSON.stringify({ "message": "Music Not Found" }));
    } else {
        if (music) {
            res.status(200).send(JSON.stringify(music));
        } else {
            res.status(500).send(JSON.stringify({ "message": "An error occurred while update" }));
        }
    }
});


//----------------------------------ALBUM ENDPOINT------------------------------------------
routes.post('/album/new', async (req, res) => {
    const { name, image_url,artist_id } = req.body;
    const album = await insertAlbumData(name,image_url, artist_id);
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
    const { name, image_url,artist_id } = req.body;
    const album = await updateAlbumById(req.params.albumId, name,image_url, artist_id);
    if (album == 0 || album == false) {
        res.status(404).send(JSON.stringify({ "message": "Album Not Found" }));
    } else if (album) {
        res.status(200).send(JSON.stringify(album));
    } else {
        res.status(500).send(JSON.stringify({ "message": "An error occurred while updating" }));
    }
});



module.exports = routes;