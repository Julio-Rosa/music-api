const { Sequelize, DataTypes, Model } = require('sequelize');
const crypto = require('crypto');
const db = require("../models/model");
const Album = db.album;
const { isAdmin } = require('../middlewares/authorizationMiddleware');

const insertAlbumData = async (req, res) => {
    try {
        // Verify if token is present in the headers
        const tokenHeader = req.headers["authorization"];
        if (!tokenHeader) {
            return res.status(403).send({ "message": "Invalid token!" });
        }
        // Check if user is authorized (admin)
        const authorized = await isAdmin(tokenHeader);

        // Handle authorization status
        if (authorized === "expired") {
            return res.status(403).send({ "message": "Token expired!" });
        } else if (!authorized) {
            return res.status(403).send({ "message": "Not authorized!" });
        }

        // Create a new album
        const { name, artist_id, image_url } = req.body;
        const album = await Album.create({
            album_id: crypto.randomUUID(),
            name,
            artist_id,
            image_url
        });
        // Send success response
        res.status(201).send(album);
    } catch (error) {
        console.error(`Error when creating new album:`, error.message);
        res.status(500).send({ "message": "Error when creating a new album!" });
    }

}
const findAllAlbums = async (req, res) => {
    try {
        // Fetch all albums
        const albums = await Album.findAll();

        // Check if albums are found
        if (albums.length > 0) {
            // Send albums if found
            res.status(200).send(albums);
        } else {
            // Send 404 if no albums found
            res.status(404).send({ "message": "No albums found!" });
        }
    } catch (error) {
        // Handle errors
        console.error(`Error listing all albums:`, error.message);
        res.status(500).send({ "message": "Error when listing all albums!" });
    }

};
const findAlbumById = async (req, res) => {
    try {
        // Find album by ID
        const album = await Album.findOne({
            where: {
                album_id: req.params.albumId
            }
        });

        // Check if album exists
        if (album !== null) {
            // Send album if found
            res.status(200).send(album);
        } else {
            // Send 404 if album not found
            res.status(404).send({ "message": "Album not found!" });
        }
    } catch (error) {
        // Handle errors
        console.error(`Error when listing album by id`, error.message);
        res.status(500).send({ "message": "Error when listing album by id!" });
    }
}
const deleteAlbumById = async (req, res) => {
    try {
        // Verify if token is present in the headers
        const tokenHeader = req.headers["authorization"];
        if (!tokenHeader) {
            return res.status(403).send({ "message": "Invalid token" });
        }

        // Check if user is authorized (admin)
        const authorized = await isAdmin(tokenHeader);

        // Handle authorization status
        if (authorized === "expired") {
            return res.status(403).send({ "message": "Token expired!" });
        } else if (!authorized) {
            return res.status(403).send({ "message": "Not authorized!" });
        }

        // Find album by ID
        const album = await Album.findByPk(req.params.albumId);

        // Check if album exists
        if (!album) {
            return res.status(404).send({ "message": "Album not found!" });
        }

        // Delete the album
        const deleted = await Album.destroy({
            where: {
                album_id: req.params.albumId
            }
        });

        // Check if album was successfully deleted
        if (deleted === 1) {
            return res.status(200).send({ "message": "Deleted!" });
        } else {
            return res.status(500).send({ "message": "An error occurred while deleting!" });
        }

    } catch (error) {
        // Handle errors
        console.error(`Error when deleting album by id":`, error.message);
        res.status(500).send({ "message": "An error occurred while deleting!" });
    }

};
const updateAlbumById = async (req, res) => {

    try {
        // Verify if token is present in the headers
        const tokenHeader = req.headers["authorization"];
        if (!tokenHeader) {
            return res.status(403).send({ "message": "Invalid token" });
        }

        // Check if user is authorized (admin)
        const authorized = await isAdmin(tokenHeader);

        // Handle authorization status
        if (authorized === "expired") {
            return res.status(403).send({ "message": "Token expired!" });
        } else if (!authorized) {
            return res.status(403).send({ "message": "Not authorized!" });
        }

        // Find album by ID
        const albumToUpdate = await Album.findByPk(req.params.albumId);

        // Check if album exists
        if (!albumToUpdate) {
            return res.status(404).send({ "message": "Album not found!" });
        }

        // Extract necessary fields from the request body
        const { name, image_url, artist_id } = req.body;

        // Update the album
        const [updatedRowsCount] = await Album.update(
            { name, image_url, artist_id },
            {
                where: {
                    album_id: req.params.albumId
                }
            }
        );

        // Check if the album was successfully updated
        if (updatedRowsCount === 1) {
            // Fetch the updated album
            const updatedAlbum = await Album.findByPk(req.params.albumId);
            return res.status(200).send(updatedAlbum);
        } else {
            return res.status(500).send({ "message": "An error occurred while updating" });
        }

    } catch (error) {
        // Handle errors
        console.error(`Error when updating album with by id":`, error.message);
        res.status(500).send({ "message": "An error occurred while updating" });
    }

};


module.exports = {
    insertAlbumData,
    findAllAlbums,
    findAlbumById,
    deleteAlbumById,
    updateAlbumById
}