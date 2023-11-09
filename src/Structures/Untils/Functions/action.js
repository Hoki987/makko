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
    } else {
        cellMute.value = Number(cellMute.value || 0) + 1
        cellWarn.value = Number(cellWarn.value || 0) + 1
        cellBan.value = Number(cellBan.value || 0) + 1
    }
    sheet.saveUpdatedCells();
}

module.exports = { action, MuteWarnBan }