const authenticator = require("../utils/securityHelper");

/**
 * Place this into the execution loop before routes are handled.
 * This will check the token provided to see if it represents a valid user.
 */
const doRegularAuth = async (req, res, next) => {
    const authorizationToken = req.headers.authorization ?? null;
    
    if (!authorizationToken) {
        res.status(400).json({ message: "req.headers.authorization was missing - user can not be trusted." });
        return;
    }

    const authRes = await authenticator.validateToken(authorizationToken);

    if(authRes == false){
        res.status(400).json({ message: "Token does not match expected user " });
        return;
    }

    next();
}

module.exports = doRegularAuth;