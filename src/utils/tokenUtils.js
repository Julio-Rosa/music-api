const jwt = require("jsonwebtoken");
async function createToken(secret, user) {
    try {
        const token = jwt.sign({ id: user.user_id }, secret, { expiresIn: '1h' });
        return token;
    } catch (error) {
        console.error(`Error ocurred:`, error);
    }

};

async function verifyToken(token, secret) {
   

         try {
            const decoded = await jwt.verify(token, secret);
            return decoded;
         } catch (error) {
            if (error.name === 'TokenExpiredError') {
                    return "expired";
            } else {
                console.error("Error verifying token, ", error.message);
            }
                
          
         }
       

  
}


module.exports = {
    createToken,
    verifyToken
}