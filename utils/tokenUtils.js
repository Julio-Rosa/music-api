const jwt = require("jsonwebtoken");
async function createToken(secret, user){
    const token = jwt.sign({
        id: user.id,
        email: user.email,
        roles: user.role
    }, secret);

    return token;
};

async function verifyToken(secret,token){
    console.log(token);
}


module.exports = {
    createToken,
    verifyToken
}