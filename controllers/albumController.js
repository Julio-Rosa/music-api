const { Sequelize, DataTypes, Model } = require('sequelize');
const crypto = require('crypto');
const db = require("../models/model");
const Album = db.album;

async function insertAlbumData(name,image_url, artist_id) {
    try {
        const album = await Album.create({
            album_id:crypto.randomUUID(),
            name: name,
            artist_id: artist_id,
            image_url:image_url
        });
        return album;
    } catch (error) {
        console.error(`Error on create new album`, error);
    }
};

async function findAllAlbums() {
    try {
        const albums = await Album.findAll();
        if (albums.length > 0) {
            return albums;
        } else {
            return 0;
        }
    } catch (error) {
        console.error(`Error listing all albums`, error);
    }

};

async function findAlbumById(album_id) {
    try {
        const album = await Album.findAll({
            where: {
                album_id: album_id
            }
        });

        if (album.length > 0) {
            return album;
        }else{
            return 0;
        }
    } catch (error) {
        console.error(`Error when listing album with id ${album_id}`, error);
    }
}

async function deleteAlbumById(album_id){
     const album = await findAlbumById(album_id);
     if(album == 0){
        return 0;
     }else{
        try {
            const deleted = await Album.destroy({
                where: {
                    album_id: album_id
                }
            });
            if (deleted == 1) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.error(`Error when deleting album with id "${album_id}"`, error);
        }
     }
};

async function updateAlbumById(album_id, name,image_url,artist_id){
    const albumToUpdate = await findAlbumById(album_id);
    if(albumToUpdate == 0){
        return 0;
    }else{
        try {
            const album = await Album.update({name:name,image_url:image_url,artist_id:artist_id},
                {
                    where:{
                        album_id:album_id
                        
                    }
                });
                if(album[0] === 1){
                    const updatedAlbum = await Album.findByPk(album_id);
                    return updatedAlbum;
                }else{
                    return false;
                }

            
        } catch (error) {
            console.error(`Error when updating album with id "${album_id}"`, error);
        }
    }
};

module.exports = {
    insertAlbumData,
    findAllAlbums,
    findAlbumById,
    deleteAlbumById,
    updateAlbumById
}