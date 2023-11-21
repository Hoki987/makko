const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../Untils/database.js')

const Appeals = sequelize.define(
    'History',
    {
        idExecute: {
            type: DataTypes.STRING, // id наказания в бд
            allowNull: false,
        },
        target: {
            type: DataTypes.STRING, // кому выдавали наказание
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING, // кому выдавали наказание
            defaultValue: 'hold',
            allowNull: false,  
        },
        expiresAt: {
            type: DataTypes.DATE, // когда нужно удалить
            allowNull: true,
        },
    },
    {
        tableName: 'Appeals',
        // freezeTableName: true, выключает автоматическую плюрализацию
        updatedAt: false,

    }
)

module.exports = Appeals;