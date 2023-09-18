const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../Untils/database.js')

const BannedUser = sequelize.define(
    'BannedUser',
    {
        tag: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        reason: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        timestamp: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    },
    {
        tableName: 'BannedUsers',
        // freezeTableName: true, выключает автоматическую плюрализацию
        timestamps: false,
        createdAt: false,
        updatedAt: false,
    }
)

module.exports = BannedUser;