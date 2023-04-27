const express = require("express");
const router = express.Router();
const asyncHanlder = require('express-async-handler');
const controller = require("../controller");
const doAuthentication = require("../middlewares/authHandler");

// Sample route
router.get( "/",
    doAuthentication,
    asyncHanlder(controller.sampleRoute)
);

// Book ticket for user
router.post( "/createBooking",
    doAuthentication,
    asyncHanlder(controller.ticketBooking)
)

// Fetching booking details for an id
router.get( "/getBookingById?:id",
    doAuthentication,
    asyncHanlder(controller.getBookingDetails)
)

// Updating booking details 
router.put( "/updateBookingDetails",
    doAuthentication,
    asyncHanlder(controller.updateBookingDetails)
)

// Delete ticket
router.delete( "/deleteBookingDetails?:id",
    doAuthentication,
    asyncHanlder(controller.deleteBooking)
)

// To find profits based on from and to date for each month
router.get("/profit",
    doAuthentication,
    asyncHanlder(controller.profitByDates)
)

// To find number of visted person based on from and to date for each month
router.get("/visited",
    doAuthentication,
    asyncHanlder(controller.numberOfPersonsVisitedByDate)
)

module.exports = router;