const bcrypt = require('bcrypt');
async function encryptPassword(password) {
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);
    return passwordHash;
}


module.exports = {
    encryptPassword
}