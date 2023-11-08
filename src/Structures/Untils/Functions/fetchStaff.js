const { doc, docAssist } = require('../googlesheet.js');

async function fetchStaff(staffSheet, user) {
    if (staffSheet === 0) {
        await docAssist.loadInfo()
        const sheet = docAssist.sheetsById[staffSheet]
        await sheet.loadCells()
        const rows = await sheet.getRows();
        const row = rows.find((r) => r._rawData.includes(user))
        return row != undefined
    }
    if (staffSheet === 1162940648) {
        await doc.loadInfo()
        const sheet = doc.sheetsById[staffSheet]
        await sheet.loadCells()
        const rows = await sheet.getRows();
        const row = rows.find((r) => r._rawData.includes(user))
        return row != undefined
    }
    return null
}

module.exports = { fetchStaff }