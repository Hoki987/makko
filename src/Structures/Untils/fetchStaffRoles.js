const { StaffRoles, Utility } = require("../../../config")
const { doc, docAssist } = require('../../Structures/Untils/googlesheet.js');


async function fetchStaff(user, staffSheet) {
    try {
        if (staffSheet === 1162940648) {
            await doc.loadInfo()
            sheet = doc.sheetsById[staffSheet]
        } else {
            await docAssist.loadInfo()
            sheet = docAssist.sheetsById[staffSheet]
        }
        if (![StaffRoles.Admin, StaffRoles.Developer, StaffRoles.Moderator, user == '802546453070479361'].includes(user)) {
            await sheet.loadCells()
            const rows = await sheet.getRows();
            const row = rows.find((r) => r._rawData.includes(user))
            const day = (new Date().getDay() + 1) % 7
            const cell = sheet.getCell(row.rowNumber - 1, 8 + day * 7)

            cell.value = Number(cell.value || 0) + 1
            sheet.saveUpdatedCells();
        }
    } catch (error) {
        console.log(error);
        return description = `**Вы не являетесь** \`Контролом / Ассистентом\``, color = Utility.colorDiscord;
    }
}

module.exports = fetchStaff 