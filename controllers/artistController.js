const { Sequelize, DataTypes, Model } = require('sequelize');

const crypto = require('crypto');
const db = require("../models/model");
const Artist = db.artist;
const { isAdmin} = require('../middlewares/authorizationMiddleware');

const insertArtistData = async (req, res) => {
   
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
        
        const { name, image_url } = req.body;
        const artist = await Artist.create({
            artist_id: crypto.randomUUID(),
            name: name,
            image_url: image_url
        });
        
        res.status(201).send(JSON.stringify(artist));
    } catch (error) {
        res.status(500).send(JSON.stringify({ "message": "Error when creating a new artist" }));
        console.error(`Error when creating a new artist`, error);
    }

};


const findAllArtists = async (req, res) => {
    try {
        const artists = await Artist.findAll();
        if (artists.length > 0) {
            res.status(200).send(JSON.stringify(artists));
        } else {
            res.status(404).send(JSON.stringify({ "message": "No artists found!" }));
        }


    } catch (error) {
        res.status(500).send(JSON.stringify({ "message": "Error when listing all artists!" }));
        console.error(`Error listing all artists!`, error);
    }

};

const findArtistById = async (req, res) => {
    try {
        const artist = await Artist.findByPk(req.params.artistId);
        if (artist == null) {
            res.status(404).send(JSON.stringify({ "message": "No artist found with this id!" }));
        } else {
            res.status(200).send(JSON.stringify(artist));
        }
    } catch (error) {
        res.status(500).send(JSON.stringify({ "message": "Error when listing  artist by id!" }));
        console.error(`Error when finding artist with id "${req.params.artistId}"!`, error);
    }
};
const deleteArtistById = async (req, res) => {


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
        const artistToDelete = await Artist.findByPk(req.params.artistId);
        if (artistToDelete == null) {
            res.status(404).send(JSON.stringify({ "message": "Artist not found!" }));
        } else {
            const deleted = await Artist.destroy({ where: { artist_id: req.params.artistId } });
            if (deleted == 1) {

                res.status(200).send(JSON.stringify({ "message": "Deleted!" }));
            }
        }
    } catch (error) {
        res.status(500).send(JSON.stringify({ "message": "Error when deleting  artist by id!" }));
        console.error(`Error when deleting artist with id "${req.params.artistId}!"`, error);
    }
};
const updateArtistById = async (req, res) => {

    try {
        const tokenHeader = req.headers["authorization"];
        if (!tokenHeader) {
            return res.status(403).send(JSON.stringify({ "message": "Invalid token" }));
        }

        if (authorized === "expired") {
            
            return res.status(403).send(JSON.stringify({ "message": "Token expired!" }));
        }else if (!authorized){
            return res.status(403).send(JSON.stringify({ "message":"Not authorized!" }));
        }

        if (!authorized) {
            return res.status(403).send(JSON.stringify({ "message": "Not authorized!" }));
        }
        const { name, image_url } = req.body;
        const artistToUpdate = await Artist.findByPk(req.params.artistId);
        if (artistToUpdate == null) {
            res.status(404).send(JSON.stringify({ "message": "Artist not found!" }));
        } else {
            await Artist.update({ name: name, image_url: image_url }, { where: { artist_id: req.params.artistId } });
            const updatedArtist = await Artist.findByPk(req.params.artistId);

            res.status(200).send(JSON.stringify(updatedArtist));
        }


    } catch (error) {
        res.status(500).send(JSON.stringify({ "message": "Error when updating artist!" }));
        console.error(`Error when updating artist with id "${req.params.artistId}"`, error)
    }
};
module.exports = {
    insertArtistData,
    findAllArtists,
    findArtistById,
    deleteArtistById,
    updateArtistById,


}