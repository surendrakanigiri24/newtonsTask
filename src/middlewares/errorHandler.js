const CONFIG = require("../config");

const errorHandler = (err, req, res, next) => {

    if(err){
        console.error(`Error message from errorHandler is ${err.message}`);
        console.error(`Error stack from errorHandler is ${err.stack}`);
        
        const statusCode = res.statusCode ? res.statusCode : 500;
        res.status(statusCode).json({message: CONFIG.ERROR_MESSAGES.GenericInternalServerErrorMessage});
        return;
    }
    
    next();

};
  

module.exports = errorHandler;
  