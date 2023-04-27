const db = require("../clients/db/db");
const { Op, fn, col } = require('sequelize');

/**
 * @param {object} payload
 * @return {object}
 */
const createTicket = async (payload) => {
    try{
        const bookingId = await db.ticketModel.create({
            customer_name : payload.customerName,
            movie_title : payload.movieTitle,
            movie_time : payload.movieTime,
            ticket_price : payload.ticketPrice,
        }, {raw: true});

        return bookingId;
    }
    catch(error){
        console.error(`Error at createTicket from ticketBookingManager`, error);
        throw error;
    }
}

/**
 * @param {number} id
 * @return {*}
 */
const fetchBookingDetailsById = async (id) => {
    try{
        const bookingDetails = await db.ticketModel.findOne({ where : { id }}, { raw: true})
        return bookingDetails;
    }
    catch(error){
        console.error(`Error at fetchBookingDetailsById from ticketBookingManager`, error);
        throw error;
    }
}

/**
 * @param {object} payload
 * @return {*} 
 */
const updateBookingDetailsById = async (payload) => {
    try{
        const findRecord = await fetchBookingDetailsById(payload.id);

        if(findRecord == null){
            return null;
        }

        const updateRecord = await db.ticketModel.update({
            customer_name : payload.customerName,
            movie_title : payload.movieTitle,
            movie_time : payload.movieTime,
            ticket_price : payload.ticketPrice,
        },{ where : {id : payload.id}});

        return updateRecord;

    }
    catch(error){
        console.error(`Error at updateBookingDetailsById from ticketBookingManager`, error);
        throw error;
    }
}

/**
 * @param {number} id
 * @return {*}
 */
const deleteBooking = async (id) => {
    try{
        const findRecord = await fetchBookingDetailsById(id);
        if(findRecord == null){
            return null;
        }

        const deleteRecord = await db.ticketModel.destroy({ where : {id}});
        return deleteRecord;
    }
    catch(error){
        console.error(`Error at deleteBooking from ticketBookingManager`, error);
        throw error;
    }
}

/**
 * @param {string} fromDate
 * @param {string} toDate
 */
const profit = async (fromDate, toDate) =>{
    try{
        const startDate = new Date(fromDate);
        const endDate = new Date(toDate);

        const profitSummary = await db.ticketModel.findAll({
            attributes: [
                [fn('to_char', fn('date_trunc', 'month', col('created_date')), 'Month'), 'month'],
                [fn('sum', col('ticket_price')), 'summaryProfit']
              ],
              where: {
                created_date: {
                  [Op.between]: [startDate, endDate]
                }
              },
              group: [
                fn('to_char', fn('date_trunc', 'month', col('created_date')), 'Month'),
                fn('DATE_TRUNC', 'month', col('created_date'))
              ],
              order: [
                [fn('date_trunc', 'month', col('created_date')), 'ASC']
              ]
        })

        return profitSummary;
    }
    catch(error){
        console.error(`Error at profit from ticketBookingManager`, error);
        throw error;
    }
}

/**
 * @param {string} fromDate
 * @param {string} toDate
 */
const visited = async (fromDate, toDate) => {
    try{
        const startDate = new Date(fromDate);
        const endDate = new Date(toDate);

        const visitedSummary = await db.ticketModel.findAll({
            attributes: [
              [fn('to_char', col('created_date'), 'Month'), 'month'],
              [fn('COUNT', fn('DISTINCT', col('id'))), 'summaryVisits']
            ],
            where: {
                created_date: {
                [Op.between]: [startDate, endDate]
              }
            },
            group: [
              fn('to_char', col('created_date'), 'Month'),
              fn('DATE_TRUNC', 'month', col('created_date'))
            ],
            order: [
              [fn('date_trunc', 'month', col('created_date')), 'ASC']
            ]
          });

          return visitedSummary;
    }
    catch(error){
        console.error(`Error at visited from ticketBookingManager`, error);
        throw error;
    }
}

/**
 * @param {object} startDate
 * @param {object} endDate
 * @return {Array}
 */
const dataFromDbBasedOnDates = async (startDate,endDate) => {
    try{
         // Get data from database for each date range separately
        const dataFromDbBasedOnDates = await db.ticketModel.findAll({
            attributes: [
            'id',
            'created_date',
            'ticket_price'
            ],
            where: {
            created_date: {
                [Op.between]: [startDate, endDate]
            }
            }
        });

        return dataFromDbBasedOnDates;
    }
    catch(error){
        console.error(`Error at dataFromDbBasedOnDates from ticketBookingManager`, error);
        throw error;
    }
}

/**
 * @param {object} fromDate
 * @param {object} toDate
 * @return {Array}
 */
const profitByJs = async (fromDate, toDate) => {
    try{
        const startDate = new Date(fromDate);
        const endDate = new Date(toDate);

        const dataFromDb = await dataFromDbBasedOnDates(startDate,endDate);

        if(dataFromDb.length == 0){
            return [];
        }
  
        // Initialize an object to hold the summary data for each month
        const summaryByMonth = {};
  
        // Loop through the data and calculate the summary for each month
        dataFromDb.forEach(ticket => {
            // Extract the year and month from the created_date column
            const yearMonth = ticket.created_date.toLocaleString('en-US', { month: 'long' });

            // If the yearMonth is not yet in the summaryByMonth object, create it
            if (!summaryByMonth[yearMonth]) {
                summaryByMonth[yearMonth] = {
                    month: yearMonth,
                    summaryProfit: 0,
                    // summaryVisits: 0
                };
            }
        
            // Add the ticket price to the summary for the month
            summaryByMonth[yearMonth].summaryProfit += ticket.ticket_price;
        
        });
        
        // Convert the summaryByMonth object to an array of summary objects
        const summary = Object.values(summaryByMonth);
        
        // Sort the summary by month in ascending order
        summary.sort((a, b) => a.month.localeCompare(b.month));
        return summary;
    }
    catch(error){
        console.error(`Error at profitByJs from ticketBookingManager`, error);
        throw error;
    }
}


/**
 * @param {object} fromDate
 * @param {object} toDate
 * @return {Array}
 */
const numberOfVisitsByjs = async (fromDate,toDate) =>{
    try{
        const startDate = new Date(fromDate);
        const endDate = new Date(toDate);

        const dataFromDb = await dataFromDbBasedOnDates(startDate,endDate);

        if(dataFromDb.length == 0){
            return [];
        }
  
        // Initialize an object to hold the summary data for each month
        const summaryByMonth = {};
  
        // Loop through the data and calculate the summary for each month
        dataFromDb.forEach(ticket => {
            // Extract the year and month from the created_date column
            const yearMonth = ticket.created_date.toLocaleString('en-US', { month: 'long' });

            // If the yearMonth is not yet in the summaryByMonth object, create it
            if (!summaryByMonth[yearMonth]) {
                summaryByMonth[yearMonth] = {
                    month: yearMonth,
                    summaryVisits: 0
                };
            }
        
            // Increment the visit count for the month
            summaryByMonth[yearMonth].summaryVisits++;
        
        });
        
        // Convert the summaryByMonth object to an array of summary objects
        const summary = Object.values(summaryByMonth);
        
        // Sort the summary by month in ascending order
        summary.sort((a, b) => a.month.localeCompare(b.month));
        return summary;
    }
    catch(error){
        console.error(`Error at numberOfVisitsByjs from ticketBookingManager`, error);
        throw error;
    }
}

module.exports = {
    createTicket,
    fetchBookingDetailsById,
    updateBookingDetailsById,
    deleteBooking,
    profit,
    visited,
    profitByJs,
    numberOfVisitsByjs,
}