

const CONFIG = {
    // DB
    DB_NAME: process.env.DB_NAME,
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT,
    DB_USER: process.env.DB_USER,
    DB_PASS: process.env.DB_PASS,

    //Secret key
    SECRET_KEY : process.env.SECRET_KEY,

    // ERROR MESSAGES
    ERROR_MESSAGES: {
        UserAuthTokenInvalidErrorMessage: {
          message: "Authorization Key not accepted - ⛔ - Perhaps your session has expired.",
          status_code: 702,
        },
        GenericInternalServerErrorMessage: {
          message: "This internal server error is unfortunate and unexpected - 🤷🏼‍♂️ - Consult the logs to see what occurred.",
          status_code: 501,
        },
        methodInvalidErrorMessage: {
          message : "Method is Inavlid to perform any action",
          status_code : 401
        }
    }
}

module.exports = CONFIG;
