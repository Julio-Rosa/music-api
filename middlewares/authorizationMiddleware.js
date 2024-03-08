
const {verifyToken} = require('../utils/tokenUtils');
require('dotenv/config');
const db = require("../models/model");
const User = db.user;
async function isAdmin(tokenHeader){
      const token = await  verifyToken(tokenHeader,process.env.SECRET);

      if(token === 'expired'){
         return "expired";
      }else{
         const user = await User.findByPk(token.id);
         
         if(user.role == "ADMIN"){
            return true;
         }else{
            return false;
         }
      }
      
    
    

}
async function isAdminAndSameUser(tokenHeader, userId){
   const token = await  verifyToken(tokenHeader,process.env.SECRET);
      
   if(token === 'expired'){
      return "expired";
     
   }else{
      const user = await User.findByPk(token.id);
      if(user.role == "ADMIN" || (userId == user.user_id)){
         return true;
      }else{
         return false;
      }
   }
}

module.exports = {
    isAdmin,
    isAdminAndSameUser,
   
}