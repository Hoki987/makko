//===========================================/ Import the modeles \===========================================\\
const { Client } = require("discord.js");
const { doc } = require('../../Structures/Untils/googlesheet.js');
const History = require('../../Structures/Models/History.js');
const { Op } = require("sequelize");
const cron = require('node-cron');
const { WorkRoles, Utility } = require('../../../config.js');

//===========================================< Code >===========================\\
module.exports = {
    name: "ready",

    /**
     * @param {Client} client 
     */

    async execute(client,) {
        await doc.loadInfo();
        const sheet = doc.sheetsById[1162940648];


        cron.schedule('* * * * *', async () => {
            const histories = await History.findAll({
                where: {
                    expiresAt: { [Op.lt]: new Date() }
                }
            })
            const guild = client.guilds.cache.get(Utility.guildId)

            for (const history of histories.filter(t => t.type !== 'Warn')) {
                const member = await guild.members.fetch(history.target).catch(() => null)

                await member?.roles.remove(WorkRoles[history.type])
            }
        })

        cron.schedule('0 0 * * 6', async () => {
            await sheet.loadCells()
            let rowIndex = 3
            let cell = sheet.getCell(rowIndex, 65)
            while (cell.value !== null) {
                cell.formula = `=${sheet.getCell(rowIndex, 64).a1Address} + ${cell.value}`

                rowIndex++
                cell = sheet.getCell(rowIndex, 65)
            }
            await sheet.saveUpdatedCells();
            await sheet.duplicate();
            await sheet.clear('H4:BD24');
        }, {
            timezone: 'Europe/Moscow'
        });
    },
};
