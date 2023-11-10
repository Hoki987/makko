const { Op } = require('sequelize');
const History = require('../../Models/History');

async function createDB(executor, target, reason, type, expiresAt) {
    await History.create({
        executor: executor,
        target: target,
        reason: reason,
        type: type,
        expiresAt: expiresAt
    })
}


async function countDB(target, type, createdAt, expiresAt) {
    if (createdAt != undefined) {
        return await History.count({
            where: {
                target: target,
                type: type,
                createdAt: createdAt
            }
        })
    } else {
        return await History.count({
            where: {
                target: target,
                type: type,
                expiresAt: expiresAt
            }
        })
    }
}

module.exports = { createDB, countDB }