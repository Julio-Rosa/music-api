const jwt = require("jsonwebtoken");
async function createToken(secret, user) {
    
    const token = jwt.sign({id:user.user_id}, secret,{expiresIn: '1h'});
 
  
    return token;
};

 async function verifyToken(token, secret) {
    try {
      
        const decoded = jwt.verify(token,secret);    
        return decoded;
        
    } catch (error) {
        console.log("========================================================>", error);
        
    }
}


module.exports = {
    createToken,
    verifyToken
}