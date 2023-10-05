const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../Untils/database.js')

const History = sequelize.define(
    'History',
    {
        executor: {
           type: DataTypes.STRING, // кто выдавал наказание
           allowNull: false,
        },
        target: {
            type: DataTypes.STRING, // кому выдавали наказание
            allowNull: false,
        },
        reason: {
            type: DataTypes.STRING, // причина наказания
        },
        type: {
            type: DataTypes.STRING, // ban, mute, warn, pred, banJPG, banCam
            allowNull: false,
        },
        expiresAt: {
            type: DataTypes.DATE, // когда истекает
            allowNull: false,
        },
    },
    {
        tableName: 'History',
        // freezeTableName: true, выключает автоматическую плюрализацию
        updatedAt: false,
        
    }
)

module.exports = History;