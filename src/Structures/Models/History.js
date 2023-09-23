const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../Untils/database.js')

const History = sequelize.define(
    'History',
    {
        executor: {
           type: DataTypes.STRING,
           allowNull: false,
        },
        target: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        reason: {
            type: DataTypes.STRING,
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        timestamp: {
            type: DataTypes.DATE, 
            allowNull: false,
        },   
    },
    {
        tableName: 'History',
        // freezeTableName: true, выключает автоматическую плюрализацию
        timestamps: false,
        createdAt: false,
        updatedAt: false,
        
    }
)

module.exports = History;