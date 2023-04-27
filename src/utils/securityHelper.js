const bcrypt = require("bcrypt");
const CONFIG = require("../config");

/**
* Hashes a secretKey
* @param {string} secretKey
* @returns {string} returns hashed secret
*/
const hashToken = async (secretKey) => {
    return bcrypt.hashSync(secretKey, bcrypt.genSaltSync(8));
}


/**
 * Compare token with hashed token.
 * @param {string} encryptedToken
 * @returns {Boolean} True if token matches encryptedToken, else false.
 */
const validateToken = async (encryptedToken) => {
    if (!encryptedToken) return false; // undefined, null, or '' => false
    return bcrypt.compareSync(CONFIG.SECRET_KEY, encryptedToken);
}

module.exports = {
    hashToken,
    validateToken,
}

