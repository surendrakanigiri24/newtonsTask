const Joi = require('joi');

const ticketCreationSchema = Joi.object({

    id: Joi.number(),

    customerName: Joi.string()
        .min(2)
        .max(30)
        .required(),

    movieTitle: Joi.string()
        .min(2)
        .max(30)
        .required(),

    movieTime: Joi.date()
        .required(),
    
    ticketPrice: Joi.number()
        .precision(2)
        .required(),
    
})

module.exports = ticketCreationSchema;