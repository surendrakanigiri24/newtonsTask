const {Sequelize} = require("sequelize");
const CONFIG = require("../../config");

const dbConnection = new Sequelize(CONFIG.DB_NAME, CONFIG.DB_USER, CONFIG.DB_PASS, {
    host: CONFIG.DB_HOST,
    port: CONFIG.DB_PORT,
    dialect: "postgres",
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
});

const db = {};

db.syncDb=() => {
    dbConnection.sync()
        .then(() => {
            console.info("Sequelize synced.");
        })
        .catch((error) => {
            console.error("Failed to sync : ", error);
        });
};

db.ticketModel =  require("../../models/tickets.model")(dbConnection,Sequelize);

module.exports = db;
