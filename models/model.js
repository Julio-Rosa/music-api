const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('course_db',  'root', 'password', {
    host: "localhost",
    dialect: 'mysql'
});





///MODELS//////////////////////



const Music = sequelize.define('music', {
    music_id: {
        type: DataTypes.STRING,
        primaryKey: true,
       
    },
    release_date:{
        type: Sequelize.DataTypes.STRING,
        allowNull: false
    },
    name: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
    },
   
});
const Album = sequelize.define('album', {
    album_id: {
        type: DataTypes.STRING,
        primaryKey: true, 
       
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    image_url:{
        type: DataTypes.STRING
    }
});

Music.belongsTo(Album,{foreignKey: 'album_id'});

const Category = sequelize.define('category',{
    category_id:{
        type: DataTypes.STRING,
        primaryKey: true,
       
    },
    name: { 
        type:DataTypes.STRING,
        unique: true
    }
});

Music.belongsTo(Category, {foreignKey: 'category_id'});

const Artist = sequelize.define('artist', {
    artist_id: {
        type: DataTypes.STRING,
        primaryKey: true,
        
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    image_url:{
        type: DataTypes.STRING
    }
});
Music.belongsTo(Artist,{foreignKey: 'artist_id'});
Album.belongsTo(Artist,{foreignKey:'artist_id'});




 
//  sequelize.sync ({force:true}).then(() => {
//     console.log("Models Synchronized");
//  }).catch(err => {
//     console.error("Unable to sync:", err);
//  })







module.exports = {
   Music,
   Album,
   Artist,
   Category
    
}
