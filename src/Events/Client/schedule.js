//===========================================/ Import the modeles \===========================================\\
const { Client } = require("discord.js");
const { doc } = require('../../Structures/Untils/googlesheet.js');
const History = require('../../Structures/Models/History.js');
const { Op, where, and } = require("sequelize");
const cron = require('node-cron');
const sequelize = require("../../Structures/Untils/database.js");
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
        // const row = rows.find((r) => r._rawData.includes('баллы за неделю'))

        // const columnBM = await sheet.getCellsInRange('BM4:BM29')

        // let outputBM = [];
        // columnBM.forEach((valuesBM) => {
        //     valuesBM.forEach((dataCellBM) => {
        //         outputBM.push(dataCellBM++)
        //     })
        // });
        // console.log(outputBM);

        // let outputBN = [];
        // columnBN.forEach((valuesBN) => {
        //     valuesBN.forEach((dataCellBN) => {
        //         outputBN.push(dataCellBN++);
        //     })
        // });
        // console.log(outputBN);

        // const combineArrays = [...outputBM].map((e, i) => e += outputBN[i])
        // console.log(combineArrays);

        // const rows = await sheet.getRows();

        let one = await History.findAll({
            attributes: ['createdAt'],
            where: {
                type: 'ban'
            }
        })

        let two = await History.findAll({
            attributes: ['target', 'reason', 'type', 'expiresAt', 'createdAt'],
            where: {
                type: 'ban',
                expiresAt: {[Op.lt]: Date('createdAt')}
            }
        })

        console.log(two);



        cron.schedule('* * * * *', async () => { })



        // cron.schedule('* * * * *', async () => {
        //     await sheet.loadCells()
        //     let rowIndex = 3
        //     let cell = sheet.getCell(rowIndex, 65)
        //     while (cell.value !== null) {
        //         cell.formula = `=${sheet.getCell(rowIndex, 64).a1Address} + ${cell.value}`
        //         rowIndex++
        //         cell = sheet.getCell(rowIndex, 65)
        //     }
        //     await sheet.saveUpdatedCells();
        //     await sheet.duplicate();
        //     await sheet.clear('H4:BD24');
        // });
    },
};
