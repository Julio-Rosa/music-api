const { Sequelize, DataTypes, Model } = require('sequelize');
const db = require("../models/model");
const crypto = require('crypto');
const { sendErrors } = require('../utils/errorsUtil');
const Music = db.music;

//------------------------- INSERT NEW MUSIC -----------------------------
async function insertMusicData(release_date, name, album_id, artist_id, category_id) {

    try {
        const errors = await sendErrors(release_date);

        if (Object.keys(errors).length > 0) {
            return errors;

        } else {
            const music = await Music.create({
                music_id: crypto.randomUUID(),
                release_date: release_date,
                name: name,
                album_id: album_id,
                artist_id: artist_id,
                category_id: category_id
            });
            return music;
        }



       
    } catch (error) {
        console.error(`Error whren creating a new music!`, error);
    }
};

//------------------------ FIND ALL MUSICS -----------------------------
async function findAllMusics() {

    try {
        const musics = await Music.findAll();

        if (musics.length != 0) {
            return musics;
        } else if (musics.length == 0) {

            return 0;
        }

    } catch (error) {
        console.error("Error to find!======================>", error)
    }

};
///--------------- FIND ALL MUSICS BY CATEGORY ID -------------------
async function findAllMusicsByCategoryId(category_id) {
    try {
        const musics = await Music.findAll({
            where: {
                category_id: category_id
            }
        });
        if (musics.length > 0) {
            return musics;
        } else {
            return false;
        }


    } catch (error) {
        console.error("Error on find ==========>", error)
    }


};
//----------------------- FIND ALL MUSICS BY ARTIST ID -----------------------------
async function findAllMusicsByArtistId(artist_id) {
    try {
        const musics = await Music.findAll({
            where: {
                artist_id: artist_id
            }
        });
        if (musics.length > 0) {
            return musics;
        } else {
            return false;
        }
    } catch (error) {
        console.error("Error on find ===================================>", error);
    }
};
//----------------------- FIND ALL MUSICS BY ALMBUM ID -----------------------------
async function findAllMusicsByAlbumId(album_id) {
    try {
        const musics = await Music.findAll({
            where: {
                album_id: album_id
            }
        });
        if (musics.length > 0) {
            return musics;
        } else {
            return false;
        }
    } catch (error) {
        console.error("Error on find ===================================>", error);
    }
};
// ------------------------------------ DELETE MUSIC BY ID ----------------------------------------
async function deleteMusicBydId(music_id) {
    try {
        const musicToDelete = await Music.findByPk(music_id);

        if (musicToDelete === null) {

            return null;
        } else {
            try {
                const deleted = await Music.destroy({
                    where: {
                        music_id: music_id
                    }
                });
                if (deleted == 1) {
                    return true;
                } else {
                    return false;
                }
            } catch (error) {
                console.error("Error on delete =======================>", error);
            }
        }


    } catch (error) {
        console.error("Error on find ===================================>", error);
    }
}

//--------------------------------- UPDATE MUSIC BY ID -----------------------
async function updateMusicById(id, name, release_date, album_id, category_id, artist_id) {


    try {
        const musicToUpdate = await Music.findByPk(id);

        if (musicToUpdate === null) {
            return null;
        } else {
            const errors = await sendErrors(release_date);

        if (Object.keys(errors).length > 0) {
            return errors;

        }else{
            try {
                const music = await Music.update({ name: name, release_date: release_date, album_id: album_id, category_id: category_id, artist_id: artist_id },
                    {
                        where: { music_id: id }
                    });

                if (music[0] === 1) {
                    const updatedMusic = await Music.findByPk(id);
                    return updatedMusic;
                } else {
                    return false;
                }

            } catch (error) {
                console.error(`Error on update music with id ==>${id}!`, error);
            }

        }
           
        }
    } catch (error) {
        console.error(`Error on fin music with id ==>${id}!`, error);
    }





}
async function findById(music_id) {
    try {
        const music = await Music.findByPk(music_id);
        if (music === null) {
            return null;
        } else {
            return music;
        }


    } catch (error) {
        console.error(`Error on find music with id ==>${music_id}!`, error);
    }
}
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