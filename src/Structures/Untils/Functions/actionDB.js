const { Op } = require('sequelize');
const History = require('../../Models/History');
const Staff = require('../../Models/Staff');
const { doc, docAssist } = require('../googlesheet.js');


async function addStaff(Tag, PersonalId, Position, staffSheet) {
    let sheet;
    switch (true) {
        case staffSheet === 0:
            await docAssist.loadInfo()
            sheet = docAssist.sheetsById[staffSheet]
            break;
        case staffSheet === 1162940648:
            await doc.loadInfo()
            sheet = doc.sheetsById[staffSheet]
            break;
        default:
            return true;
    }
    await sheet.addRow({
        Tag: Tag,
        ID: PersonalId,
        Position: Position,
        Date: new Date().toLocaleDateString('en-US')
    }) && await Staff.create({
        Tag: Tag,
        PersonalId: PersonalId,
        Position: Position
    })
}

async function delStaff(PersonalId, Position, staffSheet) {
    let sheet;
    switch (true) {
        case staffSheet === 0:
            await docAssist.loadInfo()
            sheet = docAssist.sheetsById[staffSheet]
            break;
        case staffSheet === 1162940648:
            await doc.loadInfo()
            sheet = doc.sheetsById[staffSheet]
            break;
        default:
            return true;
    }
    const rows = await sheet.getRows();
    const row = rows.find((r) => r._rawData.includes(PersonalId))
    await row.delete() && await Staff.destroy({
        where: {
            PersonalId: PersonalId,
            Position: Position
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