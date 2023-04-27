require('dotenv').config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON data in request body
app.use(express.json());

//Error Handler configure
const  errorHandler = require('./middlewares/errorHandler');
app.use(errorHandler);

// DB Configuration
const db = require('./clients/db/db');
db.syncDb();

// Routes forwarding
const routes = require("./routes");
app.use("/", routes);


// TO handle requests
const server = app.listen( PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
  
server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`${PORT} is already in use`);
    } else {
        console.error(err);
    }
});