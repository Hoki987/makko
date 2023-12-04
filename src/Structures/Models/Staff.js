const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../Untils/database.js')

const Staff = sequelize.define(
    'Staff',
    {
        Tag: {
            type: DataTypes.STRING, // тег человека со стаффа без #
            allowNull: false,
        },
        PersonalId: {
            type: DataTypes.STRING, // id человека со стаффа
            allowNull: false,
        },
        Position: {
            type: DataTypes.STRING, // в каком стаффе стоит
            allowNull: false,
        },
    },
    {
        tableName: 'Staff',
        // freezeTableName: true, выключает автоматическую плюрализацию
        updatedAt: false,

    }
)

module.exports = Staff;