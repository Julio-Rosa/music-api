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
            return res.status(403).send({ "message": "Invalid token" });
        }

        const authorized = await isAdmin(tokenHeader);
        if (authorized === "expired") {
            return res.status(403).send({ "message": "Token expired!" });
        } else if (!authorized) {
            return res.status(403).send({ "message": "Not authorized!" });
        }

        const { release_date, name, album_id, artist_id, category_id } = req.body;
        const options = { release_date };
        const errors = await returnErrors(options);

        if (errors) {
            return res.status(400).send({ "errors": errors });
        }

        const music = await Music.create({
            music_id: crypto.randomUUID(),
            release_date,
            name,
            album_id,
            artist_id,
            category_id
        });

        return res.status(201).send(music);
    } catch (error) {
        console.error(`Error when creating a new music:`, error);
        return res.status(500).send({ "message": "Error when creating a new music!" });
    }
};

//------------------------ FIND ALL MUSICS -----------------------------

const findAllMusics = async (req, res) => {
    try {
        const musics = await Music.findAll();

        if (musics.length !== 0) {
            return res.status(200).send(musics);
        } else {
            return res.status(404).send({ "message": "No musics were found" });
        }
    } catch (error) {
        console.error("Error when listing musics:", error);
        return res.status(500).send({ "message": "Error when listing musics" });
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
            return res.status(200).send(musics);
        } else {
            return res.status(404).send({ "message": "No musics found for this category" });
        }
    } catch (error) {
        console.error("Error when finding all musics:", error);
        return res.status(500).send({ "message": "Error when finding all musics" });
    }

};

//----------------------- FIND ALL MUSICS BY ARTIST ID -----------------------------
const findAllMusicsByArtistId = async (req, res) => {
    try {
        const musics = await Music.findAll({
            where: {
                artist_id: req.params.artistId
            }
        });
    
        if (musics.length > 0) {
            return res.status(200).send(musics);
        } else {
            return res.status(404).send({ "message": "No musics found for this artist" });
        }
    } catch (error) {
        console.error("Error when finding all musics:", error);
        return res.status(500).send({ "message": "Error when finding all musics" });
    }

};

//----------------------- FIND ALL MUSICS BY ALMBUM ID -----------------------------
const findAllMusicsByAlbumId = async (req, res) => {
    try {
        const musics = await Music.findAll({
            where: {
                album_id: req.params.albumId
            }
        });
    
        if (musics.length > 0) {
            res.status(200).json(musics);
        } else {
            res.status(404).json({ "message": "No musics found for this album" });
        }
    } catch (error) {
        console.error("Error when finding all musics:", error);
        res.status(500).json({ "message": "Error when finding all musics" });
    }

};

// ------------------------------------ DELETE MUSIC BY ID ----------------------------------------
const deleteMusicBydId = async (req, res) => {
   
    try {
        const tokenHeader = req.headers["authorization"];
        if (!tokenHeader) {
            return res.status(403).send({ "message": "Invalid token" });
        }
    
        const authorized = await isAdmin(tokenHeader);
    
        if (authorized === "expired") {
            return res.status(403).send({ "message": "Token expired!" });
        } else if (!authorized) {
            return res.status(403).send({ "message": "Not authorized!" });
        }
    
        const musicToDelete = await Music.findByPk(req.params.musicId);
    
        if (musicToDelete === null) {
            return res.status(404).send({ "message": "Music Not Found" });
        }
    
        const deleted = await Music.destroy({
            where: {
                music_id: req.params.musicId
            }
        });
    
        if (deleted === 1) {
            return res.status(200).send({ "message": "Deleted!" });
        } else {
            return res.status(500).send({ "message": "An error occurred while deleting" });
        }
    } catch (error) {
        console.error("Error occurred:", error);
        return res.status(500).send({ "message": "An error occurred" });
    }
};

//--------------------------------- UPDATE MUSIC BY ID -----------------------
const updateMusicById = async (req, res) => {
    
    try {
        const tokenHeader = req.headers["authorization"];
        if (!tokenHeader) {
            return res.status(403).send({ "message": "Invalid token" });
        }
    
        const authorized = await isAdmin(tokenHeader);
        if (authorized === "expired") {
            return res.status(403).send({ "message": "Token expired!" });
        } else if (!authorized) {
            return res.status(403).send({ "message": "Not authorized!" });
        }
    
        const musicToUpdate = await Music.findByPk(req.params.musicId);
        if (musicToUpdate === null) {
            return res.status(404).send({ "message": "Music Not Found" });
        }
    
        const { name, release_date, album_id, category_id, artist_id } = req.body;
        const errors = await returnErrors({ release_date });
    
        if (errors) {
            return res.status(400).send({ "errors": errors });
        }
    
        const [updatedCount] = await Music.update({ name, release_date, album_id, category_id, artist_id }, { where: { music_id: req.params.musicId } });
    
        if (updatedCount === 1) {
            const updatedMusic = await Music.findByPk(req.params.musicId);
            return res.status(200).send(updatedMusic);
        } else {
            return res.status(500).send({ "message": "An error occurred when updating!" });
        }
    } catch (error) {
        console.error(`Error on update music with id ${req.params.musicId}:`, error);
        return res.status(500).send({ "message": "An error occurred when updating!" });
    }

};

const findById = async (req, res) => {
    try {
        const music = await Music.findByPk(req.params.musicId);
        if (music === null) {
            return res.status(404).send({ "message": "Music Not Found" });
        }
        return res.status(200).send(music);
    } catch (error) {
        console.error(`Error finding music with id ${req.params.musicId}:`, error);
        return res.status(500).send({ "message": "An error occurred when finding music" });
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