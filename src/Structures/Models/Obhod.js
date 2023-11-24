const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../Untils/database.js')

const Obhod = sequelize.define(
    'Obhod',
    {
        target: {
            type: DataTypes.STRING, // кто взял обход
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING, // статус active/inactive
            allowNull: true,
        },
        endAt: {
            type: DataTypes.DATE, // когда закончился обход
            allowNull: true,
        },
    },
    {
        tableName: 'Obhod',
        // freezeTableName: true, выключает автоматическую плюрализацию
        updatedAt: false,

    }
)

module.exports = Obhod;