const { Sequelize, DataTypes, Model } = require('sequelize');
const crypto = require('crypto');
const db = require("../models/model");
const Album = db.album;
const { isAdmin} = require('../middlewares/authorizationMiddleware');
const insertAlbumData =  async (req, res) => {
   
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

        const {name,artist_id,image_url} = req.body;
        const album = await Album.create({
            album_id:crypto.randomUUID(),
            name: name,
            artist_id: artist_id,
            image_url:image_url
        });
        res.status(201).send(JSON.stringify(album));
    } catch (error) {
       
        res.status(500).send(JSON.stringify({ "message": "Error when creating a new album!" }));
        console.error(`Error when creating new album`, error.message);
    }
};

const findAllAlbums = async (req, res) => {
    try {
        const albums = await Album.findAll();
        if (albums.length > 0) {
            res.status(200).send(JSON.stringify(albums));
        } else {
            res.status(404).send(JSON.stringify({ "message": "No albums found!" }));
        }
    } catch (error) {
        res.status(500).send(JSON.stringify({ "message": "Error when  listing all albums!" }));
        console.error(`Error listing all albums`, error);
    }

};

const findAlbumById = async (req, res) => {
    try {
        const album = await Album.findOne({
            where: {
                album_id: req.params.albumId
            }
        });
       
        if (album !== null) {
            res.status(200).send(JSON.stringify(album));
        }else{
            res.status(404).send(JSON.stringify({ "message": "Album not found!" }));
        }
    } catch (error) {
        res.status(500).send(JSON.stringify({ "message": "Error when listing album by id!" }));
        console.error(`Error when listing album with id ${req.params.albumId}`, error);
    }
}


const deleteAlbumById = async (req, res) => {
     
     
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
            const album = await Album.findByPk(req.params.albumId);
           
            if(album == null){
               
                res.status(404).send(JSON.stringify({ "message": "Album Not Found!" }));
            }else{
                const deleted = await Album.destroy({
                    where: {
                        album_id: req.params.albumId
                    }
                });
                if (deleted == 1) {
                    res.status(200).send(JSON.stringify({ "message": "Deleted!" }));
                } 
            }
            
        } catch (error) {
            res.status(500).send(JSON.stringify({ "message": "An error occurred while deleting!" }));
            console.error(`Error while deleting album with id "${req.params.albumId}"`, error);
        }
     
};

const  updateAlbumById = async (req, res)=>{
  
   
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
            const albumToUpdate = await Album.findByPk(req.params.albumId);
            if(albumToUpdate == null){
                res.status(404).send(JSON.stringify({ "message": "Album Not Found!" }));
            }else{
                const {name,image_url,artist_id} = req.body;

                const album = await Album.update({name:name,image_url:image_url,artist_id:artist_id},
                    {
                        where:{
                            album_id:req.params.albumId
                            
                        }
                    });
                    if(album[0] === 1){
                        const updatedAlbum = await Album.findByPk(req.params.albumId);
                        res.status(200).send(JSON.stringify(updatedAlbum));;
                    }

            }

           
            
        } catch (error) {
            res.status(500).send(JSON.stringify({ "message": "An error occurred while updating" }));
            console.error(`Error when updating album with id "${req.params.albumId}"`, error);
        }
    }


module.exports = {
    insertAlbumData,
    findAllAlbums,
    findAlbumById,
    deleteAlbumById,
    updateAlbumById
}