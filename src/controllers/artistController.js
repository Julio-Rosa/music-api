const { Sequelize, DataTypes, Model, Op } = require('sequelize');
const crypto = require('crypto');
const db = require("../models/model");
const Artist = db.artist;
const { isAdmin } = require('../middlewares/authorizationMiddleware');
const {queryOptions} = require('../utils/paramsUtil')

const insertArtistData = async (req, res) => {
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

        const { name, image_url } = req.body;
        const artist = await Artist.create({
            artist_id: crypto.randomUUID(),
            name,
            image_url
        });

        return res.status(201).send(artist);
    } catch (error) {
        console.error(`Error when creating a new artist:`, error);
        return res.status(500).send({ "message": "Error when creating a new artist" });
    }

};
const findAllArtists = async (req, res) => {
    try {
        
        const options = queryOptions(req);
        const artists = await Artist.findAll(options);
        if (artists.length > 0) {
            return res.status(200).send(artists);
        } else {
            return res.status(404).send({ "message": "No artists found!" });
        }
    } catch (error) {
        console.error(`Error listing all artists:`, error);
        return res.status(500).send({ "message": "Error when listing all artists!" });
    }

};
const findAllArtistsByName = async (req, res) => {
    try {
        const word = req.query.word;
       const options = queryOptions(req);
        const artists = await Artist.findAll({where: {name: {[Op.like]: `%${word}%`}}});
        
        if (artists.length > 0) {
            return res.status(200).send(artists);
        } else {
            return res.status(404).send({ "message": "No artists found!" });
        }
    } catch (error) {
        console.error(`Error listing all artists:`, error);
        return res.status(500).send({ "message": "Error when listing all artists!" });
    }

};
const findArtistById = async (req, res) => {
    try {
        const artist = await Artist.findByPk(req.params.artistId);
        if (!artist) {
            return res.status(404).send({ "message": "No artist found with this id!" });
        } else {
            return res.status(200).send(artist);
        }
    } catch (error) {
        console.error(`Error when finding artist with id "${req.params.artistId}":`, error);
        return res.status(500).send({ "message": "Error when listing artist by id!" });
    }
};
const deleteArtistById = async (req, res) => {

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

        const artistToDelete = await Artist.findByPk(req.params.artistId);
        if (!artistToDelete) {
            return res.status(404).send({ "message": "Artist not found!" });
        }

        const deleted = await Artist.destroy({ where: { artist_id: req.params.artistId } });
        if (deleted === 1) {
            return res.status(200).send({ "message": "Deleted!" });
        }
    } catch (error) {
        console.error(`Error when deleting artist with id "${req.params.artistId}":`, error);
        return res.status(500).send({ "message": "Error when deleting artist by id!" });
    }

};
const updateArtistById = async (req, res) => {
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

        const { name, image_url } = req.body;
        const artistToUpdate = await Artist.findByPk(req.params.artistId);
        if (!artistToUpdate) {
            return res.status(404).send({ "message": "Artist not found!" });
        }

        await Artist.update(
            { name, image_url },
            { where: { artist_id: req.params.artistId } }
        );
        const updatedArtist = await Artist.findByPk(req.params.artistId);
        return res.status(200).send(updatedArtist);
    } catch (error) {
        console.error(`Error when updating artist with id "${req.params.artistId}":`, error);
        return res.status(500).send({ "message": "Error when updating artist!" });
    }

}



module.exports = {
    insertArtistData,
    findAllArtists,
    findArtistById,
    deleteArtistById,
    updateArtistById,
    findAllArtistsByName


}