const express = require("express");
const db = require("../models/model");
const Music = db.music;
const User = db.user;
const routes = express.Router();
const { insertCategoryData, findAllCategories, deleteCategorieById, findCategoryById, updateCategoryById } = require('../controllers/categoryController');
const { insertAlbumData, findAllAlbums, findAlbumById, deleteAlbumById, updateAlbumById } = require('../controllers/albumController');
const { insertMusicData, findAllMusics, findAllMusicsByCategoryId, findAllMusicsByArtistId, findAllMusicsByAlbumId, deleteMusicBydId, updateMusicById, findById } = require('../controllers/musicController');
const { insertArtistData, findAllArtists, findArtistById, deleteArtistById, updateArtistById } = require('../controllers/artistController');
const { insertNewUser, getUserByEmail, findAllUsers , deleteUserById, updateUserById} = require('../controllers/userController');
routes.use(express.json());


//------------------- MUSIC ENDPOINTS--------------------------------------
routes.post('/music/new', async (req, res) => {
    const { name, release_date, album_id, artist_id, category_id } = req.body;
    const music = await insertMusicData(name, release_date, album_id, artist_id, category_id);
    if (!(music instanceof Music)) {

        res.status(400).send(JSON.stringify({ "errors": music }));
    } else if (music) {
        res.status(201).send(JSON.stringify(music));
    } else {
        res.status(500).send(JSON.stringify({ "message": "Error when cresting a new music!" }));
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


routes.post('/user/new', async (req, res) => {
    const { name, email, password } = req.body;

    const user = await insertNewUser(name, email, password);

    if (user == 1) {
        res.status(400).send(JSON.stringify({ "message": "User alread exists!" }));
    } else {
        if (!(user instanceof User)) {
            res.status(400).send(JSON.stringify({ "errors": user }));
        } else {
    
            if (user) {
                res.status(201).send(JSON.stringify(user));
            } else {
                res.status(500).send(JSON.stringify({ "message": "Error when cresating a new user!" }));
            }
    
        }

    }

   




});
routes.get('/user/all', async (req, res) => {
    const users = await findAllUsers();
   
    if(users == 0){
        res.status(404).send(JSON.stringify({"message":"No users found!"}));
    }else if(users){
        res.status(200).send(JSON.stringify(users));
    }else{
        res.status(500).send(JSON.stringify({"message":"Error when finding all users"}));
    }
    
});
routes.get('/user/:userEmail', async (req, res) => {
    const user = await getUserByEmail(req.params.userEmail);
    if(user == 0){
        res.status(404).send(JSON.stringify({"message":"User not found!"}));
    }else if(user){
        res.status(200).send(JSON.stringify(user));
    }else{
        res.status(500).send(JSON.stringify({"message":"Error when finding user by email!"}));
    }
});

routes.delete('/user/delete/:userId', async (req, res)=>{
    const user = await deleteUserById(req.params.userId);
    if(user == null){
        res.status(404).send(JSON.stringify({"message":"User not found!"}));
    }else if( user){
        res.status(200).send(JSON.stringify({"message":"Deleted!"}));
    }else{
        res.status(500).send(JSON.stringify({"message":"Error when deleting user!"}));
    }
});
routes.put('/user/update/:userId', async(req, res) => {
    const {name,email} = req.body;
    const user = await updateUserById(req.params.userId,name,email);
    if (user == 1) {
        res.status(400).send(JSON.stringify({"message":"User with this email already exists!"}));
        
    } else if (!(user instanceof User)) {
        res.status(400).send(JSON.stringify({ "errors": user }));
    } else if (user){
        res.status(200).send(JSON.stringify(user));
    }else{
        res.status(500).send(JSON.stringify({ "message": "Error when cresting a new music!" }));
    }
});

module.exports = routes;