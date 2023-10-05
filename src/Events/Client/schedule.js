//===========================================/ Import the modeles \===========================================\\
const { Client } = require("discord.js");
const { doc } = require('../../Structures/Untils/googlesheet.js');
const History = require('../../Structures/Models/History.js');
const { Op } = require("sequelize");
const cron = require('node-cron');
const { WorkRoles } = require('../../../config.js');
//==========< OTHERS >==========\\

//===========================================< Code >===========================\\
module.exports = {
    name: "ready",

    /**
     * @param {Client} client 
     */

    async execute(client,) {
        await doc.loadInfo();
        const sheet = doc.sheetsById[1162940648];
        const hasRole = (id) => getUser.member.roles.cache.has(id);

        // let two = await History.findAll({
        //     attributes: ['target', 'reason', 'type', 'expiresAt', 'createdAt'],
        //     where: {
        //         type: 'ban',
        //         expiresAt: {[Op.lt]: Date('createdAt')}
        //     }
        // })

        // console.log(two);







        // cron.schedule('* * * * *', async () => {
        //     await sheet.loadCells()
        //     let rowIndex = 3
        //     let cell = sheet.getCell(rowIndex, 65)
        //     while (cell.value !== null) {
        //         cell.formula = `=${sheet.getCell(rowIndex, 64).a1Address} + ${cell.value}`   РАБОЧАЯ ШТУКА, ОТКОМЕНТИТЬ, КОГДА ПОНАДОБИТСЯ

        //         rowIndex++
        //         cell = sheet.getCell(rowIndex, 65)
        //     }
        //     await sheet.saveUpdatedCells();
        //     await sheet.duplicate();
        //     await sheet.clear('H4:BD24');
        // });
    },
};
