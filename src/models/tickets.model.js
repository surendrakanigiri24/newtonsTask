module.exports = (dbConnection, Sequelize) => {
    const ticketModel = dbConnection.define("movie_tickets", {
        id : {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        customer_name : {
            type : Sequelize.STRING,
            allowNull: false
        },
        movie_title : {
            type : Sequelize.STRING,
            allowNull: false
        },
        movie_time : {
            type: 'TIMESTAMP',
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            allowNull: false
        },
        ticket_price : {
            type : Sequelize.FLOAT,
            allowNull: false
        },
        created_date : {
            type: 'TIMESTAMP',
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            allowNull: false
        }
    },
        {
            timestamps : false,
            createdAt : false,
            updatedAt : false
        }
    )

    return ticketModel;
}