const { Sequelize, DataTypes, Model } = require('sequelize');
const crypto = require('crypto');
const db = require("../models/model");
const Artist = db.artist;


async function insertArtistData(name,image_url) {
    try {
        const artist = Artist.create({
            artist_id: crypto.randomUUID(),
            name: name,
            image_url: image_url
        });
        return artist;
    } catch (error) {
        console.error(`Error when creating a new artist`, error);
    }
};

async function findAllArtists() {
    try {
        const artists = await Artist.findAll();
        if (artists.length > 0) {
            return artists;
        } else {
            return 0;
        }


    } catch (error) {
        console.error(`Error listing all artists!`, error);
    }
};
async function findArtistById(artist_id) {
    try {
        const artist = await Artist.findByPk(artist_id);
        if (artist == null) {
            return null;
        } else {
            return artist;
        }



    } catch (error) {
        console.error(`Error when finding artist with id "${artist_id}"!`, error);
    }
};
async function deleteArtistById(artist_id) {
    try {
        const artistToDelete = await findArtistById(artist_id);
        if (artistToDelete == null) {
            return false;
        } else {
            const deleted = await Artist.destroy({ where: { artist_id: artist_id } });
            if (deleted == 1) {

                return true;
            }
        }
    } catch (error) {
        console.error(`Error when deleting artist with id "${artist_id}!"`, error);
    }
};
async function updateArtistById(artist_id, name, image_url) {
   
    try {
        const artistToUpdate = findArtistById(artist_id);
        if (artistToUpdate == null) {
            return null;
        } else {
            await Artist.update({ name: name, image_url: image_url }, { where: { artist_id: artist_id } });
            const updatedArtist = await Artist.findByPk(artist_id);
            return updatedArtist;
        }


    } catch (error) {
        console.error(`Error when updating artist with id "${artist_id}"`, error)
    }
};
module.exports = {
    insertArtistData,
    findAllArtists,
    findArtistById,
    deleteArtistById,
    updateArtistById,
    

}