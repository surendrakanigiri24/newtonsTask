const inputValidation = require("../validators/createTicketValidators");
const manager = require("../managers/ticketBookingManager");
const CONFIG =  require("../config");

//This is sample route for testing
const sampleRoute = async (req,res) => {
    res.json({ message: "YAY! I am working" })
}

/**
 * To create/book a ticket for the user
 * @param {*} req 
 * @returns {object} res
 */
const ticketBooking = async (req,res) => {
    try{
        await inputValidation.validateAsync(req.body);

        const createdBooking = await manager.createTicket(req.body);

        return res.status(200).json({message : `Hurray !!! Your booking was confirmed. Please, refer booking id ${createdBooking.id} for your reference`});
    }
    catch(error){
        console.error(`Error at ticket Booking Route`, error);
        res.status(500).json({ message: error})
    }
}

/**
 * To having details of the ticket using id
 * @param {*} req.query.id id of the booked ticket
 * @returns {object} res 
 */
const getBookingDetails = async (req,res) => {
    try{
        const id = req.query.id;
        if(!id){
            return res.status(400).json({ message : "Please, Pass transaction id !!!"})
        }
        
        const bookingDetails = await manager.fetchBookingDetailsById(id);

        if(bookingDetails == null){
            return res.status(200).json({message : `There is no booking details with your reference id`});
        }

        return res.status(200).json({ data : bookingDetails, message : "Data found"})
    }
    catch(error){
        console.error(`Error at get booking details Route`, error);
        res.status(500).json({ message: error})
    }
}

/**
 * To update booking details of the user based on id
 * @param {*} req  
 * @returns {object} res
 */
const updateBookingDetails = async (req,res) => {
    try{
        const id = req.body.id;
        if(!id){
            return res.status(400).json({ message : "Please, Pass transaction id !!!"})
        }

        await inputValidation.validateAsync(req.body);
        const updatedBookingDetails = await manager.updateBookingDetailsById(req.body)

        if(updatedBookingDetails == null){
            return res.status(400).json({message : `There is no booking details with your reference id`});
        }

        return res.status(200).json({ message : "Hoorray, Your details was updated successfully !!!"})

    }
    catch(error){
        console.error(`Error at updateBookingDetails Route`, error);
        res.status(500).json({ message: error})
    }
}

/**
 * To delete/cancel the booking based on id
 * @param {*} req.query.id 
 * @returns {object} res
 */
const deleteBooking = async (req,res) => {
    try{
        const id = req.query.id;
        if(!id){
            return res.status(400).json({ message : "Please, Pass transaction id !!!"})
        }

        const deletedRecord = await manager.deleteBooking(id);

        if(deletedRecord == null){
            return res.status(400).json({message : `There is no booking details with your reference id`});
        }

        return res.status(200).json({ message : "Your booking was canceled succeessfully !!!"})

    }
    catch(error){
        console.error(`Error at deleteBooking Route`, error);
        res.status(500).json({ message: error})
    }
}

/**
 * To have an profit of the tickets for each month based on dates
 * @param {*} req.query.fromDate 
 * @param {*} req.query.toDate
 * @param {*} req.query.method
 * @returns {object} res
 */
const profitByDates =async (req,res) => {
    try{
        const fromDate = req.query.fromDate;
        const toDate = req.query.toDate;
        const method = req.query.method;

        if( !fromDate || !toDate){
            return res.status(400).json({ message : "Please, Pass from and to date !!!"})
        }

        if( method == 'db-aggregation'){
            const profitSummary = await manager.profit(fromDate,toDate);
            return res.status(200).json(profitSummary)
        }
        else if(method == 'Js-algorithm'){
            const profitSummaryUsingJsAlg = await manager.profitByJs(fromDate,toDate);
            return res.status(200).json(profitSummaryUsingJsAlg)
        }
        else{
            res.json(CONFIG.ERROR_MESSAGES.methodInvalidErrorMessage)
        }
    }
    catch(error){
        console.error(`Error at profitOfMovies Route`, error);
        res.status(500).json({ message: error})
    }
}

/**
 * 
 * @param {*} req.query.fromDate  
 * @param {*} req.query.toDate 
 * @param {*} req.query.method
 * @returns {object} res
 */
const numberOfPersonsVisitedByDate = async (req,res) => {
    try{
        const fromDate = req.query.fromDate;
        const toDate = req.query.toDate;
        const method = req.query.method

        if( !fromDate || !toDate){
            return res.status(400).json({ message : "Please, Pass from and to date !!!"})
        }

        if( method == 'db-aggregation'){
            const visitedData = await manager.visited(fromDate,toDate);
            return res.json(visitedData)
        }
        else if(method == 'Js-algorithm'){
            const numberOfVisitsByjs = await manager.numberOfVisitsByjs(fromDate,toDate)
            return res.status(200).json(numberOfVisitsByjs)
        }
        else{
            res.json(CONFIG.ERROR_MESSAGES.methodInvalidErrorMessage)
        }
        
    }
    catch(error){
        console.error(`Error at numberOfPersonsVisited Route`, error);
        res.status(500).json({ message: error})
    }
}

module.exports = {
    sampleRoute,
    ticketBooking,
    getBookingDetails,
    updateBookingDetails,
    deleteBooking,
    profitByDates,
    numberOfPersonsVisitedByDate,
}