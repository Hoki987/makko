const { Op } = require('sequelize');
const History = require('../../Models/History');
const Staff = require('../../Models/Staff');


async function addStaff(Tag, PersonalId) {
    await Staff.create({
        Tag: Tag,
        PersonalId: PersonalId,
    })
}

async function delStaff(PersonalId) {
    await Staff.destroy({
        where: {
            PersonalId: PersonalId
        }
    })
}

async function countStaff(PersonalId) {
   return await Staff.count({
        where: {
            PersonalId: PersonalId
        }
    })
}

async function createDB(executor, target, reason, type, expiresAt) {
    await History.create({
        executor: executor,
        target: target,
        reason: reason,
        type: type,
        expiresAt: expiresAt
    })
}

async function findOneDB(target, type, expiresAt) {
    return await History.findOne({
        where: {
            target: target,
            type: type,
            expiresAt: expiresAt,
        }
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

module.exports = { addStaff, delStaff, countStaff, createDB, findOneDB, countDB }