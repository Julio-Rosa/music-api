const { Sequelize, DataTypes, Model } = require('sequelize');
const db = require("../models/model");
const crypto = require('crypto');
const { returnErrors } = require('../utils/errorsUtil');
const Music = db.music;
const { isAdmin } = require('../middlewares/authorizationMiddleware');

//------------------------- INSERT NEW MUSIC -----------------------------
const insertMusicData = async (req, res) => {


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
        const {release_date, name, album_id, artist_id, category_id} = req.body;
        const options = { release_date };
        const errors = await returnErrors(options);
        if (errors != false) {
            res.status(400).send(JSON.stringify({ "errors": errors }));
        } else {

            const music = await Music.create({
                music_id: crypto.randomUUID(),
                release_date: release_date,
                name: name,
                album_id: album_id,
                artist_id: artist_id,
                category_id: category_id
            });
            res.status(201).send(JSON.stringify(music));
        }
    } catch (error) {
        res.status(500).send(JSON.stringify({ "message": "Error when cresting a new music!" }));
        console.error(`Error whren creating a new music!`, error);
    }
};

//------------------------ FIND ALL MUSICS -----------------------------

const findAllMusics = async (req, res) => {
    try {
        const musics = await Music.findAll();

        if (musics.length != 0) {
            res.status(200).send(JSON.stringify(musics));
        } else if (musics.length == 0) {

            res.status(404).send(JSON.stringify({ "message": "No musics were found" }));
        }

    } catch (error) {
        res.status(500).send(JSON.stringify({ "message": "Error when listing musics" }));
        console.error("Error to find!======================>", error);
    }

};
///--------------- FIND ALL MUSICS BY CATEGORY ID -------------------
const findAllMusicsByCategoryId = async (req, res) => {
    try {
        const musics = await Music.findAll({
            where: {
                category_id: req.params.categoryId
            }
        });
        if (musics.length > 0) {
            res.status(200).send(JSON.stringify(musics));
        } else {
            res.status(404).send(JSON.stringify({ "message": "Music not Found!" }));
        }


    } catch (error) {
        res.status(404).send(JSON.stringify({ "message": "Error when finding all musics!" }));
        console.error("Error when find ==========>", error)
    }


};

//----------------------- FIND ALL MUSICS BY ARTIST ID -----------------------------
const findAllMusicsByArtistId = async (req, res) =>{
    try {
        const musics = await Music.findAll({
            where: {
                artist_id: req.params.artistId
            }
        });
        if (musics.length > 0) {
            res.status(200).send(JSON.stringify(musics));
        } else {
            res.status(404).send(JSON.stringify({ "message": "Music Not Found!" }));
        }
    } catch (error) {
        res.status(500).send(JSON.stringify({ "message": "Error when finding all musics!" }));
        console.error("Error on find ===================================>", error);
    }

};

//----------------------- FIND ALL MUSICS BY ALMBUM ID -----------------------------
const findAllMusicsByAlbumId = async (req, res) =>{
    try {
        const musics = await Music.findAll({
            where: {
                album_id: req.params.albumId
            }
        });
        if (musics.length > 0) {
            res.status(200).send(JSON.stringify(musics));
        } else {
            res.status(404).send(JSON.stringify({ "message": "Musics not found!" }));
        }
    } catch (error) {
        res.status(500).send(JSON.stringify({ "message": "Error when finding all musics!" }));
        console.error("Error on find ===================================>", error);
    }

};

// ------------------------------------ DELETE MUSIC BY ID ----------------------------------------
const deleteMusicBydId = async (req, res) =>{
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
        const musicToDelete = await Music.findByPk(req.params.musicId);

        if (musicToDelete === null) {

            res.status(404).send(JSON.stringify({ "message": "Music Not Found" }));
        } else {
            try {
                const deleted = await Music.destroy({
                    where: {
                        music_id: req.params.musicId
                    }
                });
                if (deleted == 1) {
                    res.status(200).send(JSON.stringify({ "message": "Deleted!" }));
                } else {
                    res.status(500).send(JSON.stringify({ "message": "An error occurred while deleting" }));
                }
            } catch (error) {
                res.status(500).send(JSON.stringify({ "message": "An error occurred while deleting" }));
                console.error("Error on delete =======================>", error);
            }
        }


    } catch (error) {
        console.error("Error on find ===================================>", error);
    }

};

//--------------------------------- UPDATE MUSIC BY ID -----------------------
const updateMusicById = async (req, res) =>{
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
        const musicToUpdate = await Music.findByPk(req.params.musicId);

        if (musicToUpdate === null) {
            res.status(404).send(JSON.stringify({ "message": "Music Not Found" }));
        } else {
            const {name,release_date,album_id,category_id,artist_id} = req.body;
            const errors = await returnErrors({release_date});

            if (errors != false) {
                res.status(400).send(JSON.stringify({ "errors": errors }));

            } else {
                try {
                    const music = await Music.update({ name: name, release_date: release_date, album_id: album_id, category_id: category_id, artist_id: artist_id },
                        {
                            where: { music_id: req.params.musicId }
                        });

                    if (music[0] === 1) {
                        const updatedMusic = await Music.findByPk(req.params.musicId);
                        res.status(200).send(JSON.stringify(updatedMusic));
                    } else {
                        res.status(500).send(JSON.stringify({ "message": "An error occurred when updating!" }));
                    }

                } catch (error) {
                    res.status(500).send(JSON.stringify({ "message": "An error occurred when updating!" }));
                    console.error(`Error on update music with id ==>${req.params.musicId}!`, error);
                }

            }

        }
    } catch (error) {
        console.error(`Error on fin music with id ==>${req.params.musicId}!`, error);
    }


};

const findById = async (req, res) =>{
    try {
        const music = await Music.findByPk(req.params.musicId);
        if (music === null) {
            res.status(404).send(JSON.stringify({ "message": "Music Not Found" }));
        } else {
            res.status(200).send(JSON.stringify(music));
        }


    } catch (error) {
        res.status(500).send(JSON.stringify({ "message": "An error occurred when finding  music!" }));
        console.error(`Error on find music with id ==>${req.params.musicId}!`, error);
    }
};

module.exports = {
    insertMusicData,
    findAllMusics,
    findAllMusicsByCategoryId,
    findAllMusicsByArtistId,
    findAllMusicsByAlbumId,
    deleteMusicBydId,
    updateMusicById,
    findById,


}