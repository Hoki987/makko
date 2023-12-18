const { doc, docAssist } = require('../googlesheet.js');

async function action(staffSheet, user, column) {
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
    await sheet.loadCells()
    const rows = await sheet.getRows();
    const row = rows.find((r) => r._rawData.includes(user))
    const day = (new Date().getDay() + 1) % 7
    const cell = sheet.getCell(row.rowNumber - 1, column + day * 7)

    cell.value = Number(cell.value || 0) + 1
    sheet.saveUpdatedCells();
}

async function actionPlus(staffSheet, user, column) {
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
    await sheet.loadCells()
    const rows = await sheet.getRows();
    const row = rows.find((r) => r._rawData.includes(user))
    const cell = sheet.getCell(row.rowNumber - 1, column)

    cell.value = Number(cell.value || 0) + 1
    sheet.saveUpdatedCells();
}

async function actionMinus(staffSheet, user, column) {
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
    await sheet.loadCells()
    const rows = await sheet.getRows();
    const row = rows.find((r) => r._rawData.includes(user))
    const cell = sheet.getCell(row.rowNumber - 1, column)

    cell.value = Number(cell.value) - Number(cell.value)
    sheet.saveUpdatedCells();
}

async function anyCellMinus(staffSheet, user, column, count) {
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
    await sheet.loadCells()
    const rows = await sheet.getRows();
    const row = rows.find((r) => r._rawData.includes(user))
    const cell = sheet.getCell(row.rowNumber - 1, column)

    cell.value = Number(cell.value) - Number(count)
    sheet.saveUpdatedCells();
}

async function cellValue(staffSheet, user, column) {
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
    await sheet.loadCells()
    const rows = await sheet.getRows();
    const row = rows.find((r) => r._rawData.includes(user))
    const day = (new Date().getDay() + 1) % 7
    const cell = sheet.getCell(row.rowNumber - 1, column)

    return Number(cell.value);
}
async function timeAction(staffSheet, user, column, time) {
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
    await sheet.loadCells()
    const rows = await sheet.getRows();
    const row = rows.find((r) => r._rawData.includes(user))
    const day = (new Date().getDay() + 1) % 7
    const cell = sheet.getCell(row.rowNumber - 1, column + day * 7)

    cell.value = Number(cell.value || 0) + time
    sheet.saveUpdatedCells();
}

async function MuteWarnBan(staffSheet, user, muteWarn) {
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
    await sheet.loadCells()
    const rows = await sheet.getRows();
    const row = rows.find((r) => r._rawData.includes(user))
    const day = (new Date().getDay() + 1) % 7
    const cellMute = sheet.getCell(row.rowNumber - 1, 7 + day * 7)
    const cellWarn = sheet.getCell(row.rowNumber - 1, 9 + day * 7)
    const cellBan = sheet.getCell(row.rowNumber - 1, 10 + day * 7)

    if (muteWarn === true) {
        cellMute.value = Number(cellMute.value || 0) + 1
        cellWarn.value = Number(cellWarn.value || 0) + 1
    }
    if (muteWarn === false) {
        cellMute.value = Number(cellMute.value || 0) + 1
        cellWarn.value = Number(cellWarn.value || 0) + 1
        cellBan.value = Number(cellBan.value || 0) + 1
    }
    if (muteWarn === undefined) {
        cellWarn.value = Number(cellWarn.value || 0) + 1
        cellBan.value = Number(cellBan.value || 0) + 1
    }
    sheet.saveUpdatedCells();
}

async function tableValue(staffSheet, user) {
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
    await sheet.loadCells()
    const getRows = await sheet.getRows();
    const rowTarget = getRows.find((r) => r._rawData.includes(user))

    const cellBan = sheet.getCell(rowTarget.rowNumber - 1, 60)
    const cellMute = sheet.getCell(rowTarget.rowNumber - 1, 57)
    const cellWarn = sheet.getCell(rowTarget.rowNumber - 1, 59)
    const cellPred = sheet.getCell(rowTarget.rowNumber - 1, 58)
    const cellOCount = sheet.getCell(rowTarget.rowNumber - 1, 61)
    const cellOTime = sheet.getCell(rowTarget.rowNumber - 1, 62)
    const cellTicket = sheet.getCell(rowTarget.rowNumber - 1, 63)
    const cellMoney = sheet.getCell(rowTarget.rowNumber - 1, 66)
    const cellNorma = sheet.getCell(rowTarget.rowNumber - 1, 64)
    const cellDateStaff = sheet.getCell(rowTarget.rowNumber - 1, 5)
    const cellStaffWarnY = sheet.getCell(rowTarget.rowNumber - 1, 6)
    const cellStaffWarnP = sheet.getCell(rowTarget.rowNumber - 1, 5)
    const cellPosition = sheet.getCell(rowTarget.rowNumber - 1, 2)
    const cellTop = sheet.getCell(rowTarget.rowNumber - 1, 65)

    return [
        Number(cellBan.value),
        Number(cellMute.value),
        Number(cellWarn.value),
        Number(cellPred.value),
        Number(cellOCount.value),
        Number(cellOTime.value),
        Number(cellTicket.value),
        Number(cellMoney.value),
        Number(cellNorma.value),
        Number(cellDateStaff.value),
        Number(cellStaffWarnY.value),
        Number(cellStaffWarnP.value),
        cellPosition.value,
        Number(cellTop.value),
    ]
}

module.exports = { action, actionMinus, actionPlus, MuteWarnBan, timeAction, tableValue, cellValue, anyCellMinus }