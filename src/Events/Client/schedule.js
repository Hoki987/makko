//===========================================/ Import the modeles \===========================================\\
const { Client, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ChatInputCommandInteraction, ButtonStyle } = require("discord.js");
const { doc, docAssist } = require('../../Structures/Untils/googlesheet.js');
const History = require('../../Structures/Models/History.js');
const { Op } = require("sequelize");
const cron = require('node-cron');
const { WorkRoles, Utility, StaffChats, StaffServerRoles, PunishmentRemoveMessage } = require('../../../config.js');
const { countStaff } = require("../../Structures/Untils/Functions/actionDB.js");

//===========================================< Code >===========================\\
module.exports = {
    name: "ready",

    /**
     * @param {Client} client 
     * @param {ChatInputCommandInteraction} interaction
     */

    async execute(client, interaction) {
        await doc.loadInfo();
        await docAssist.loadInfo();
        const sheetAssist = docAssist.sheetsById[0];
        const sheet = doc.sheetsById[1162940648];

        const embed = new EmbedBuilder()
            .setDescription('Обход')

        const button = new ButtonBuilder()
            .setLabel('Принять')
            .setCustomId(`ready_accept_${interaction.user.id}`)
            .setStyle(ButtonStyle.Success)

        const channel = client.channels.cache.get(StaffChats.Obhod)
        cron.schedule('0 * * * *', async () => {
            const messages = await channel.messages.fetch({ limit: 1 })
            const last = messages.last();
            if (last === undefined) {
                channel.send({ content: `<@&${StaffServerRoles.Control}>, новый обход!`, embeds: [embed], components: [new ActionRowBuilder().addComponents(button)] })
            } else {
                switch (last.content) {
                    case `<@&${StaffServerRoles.Control}>, новый обход!`:
                        last.delete() && channel.send({ content: `<@&${StaffServerRoles.Control}>, новый обход!`, embeds: [embed], components: [new ActionRowBuilder().addComponents(button)] })
                        break;
                    case 'Обход окончен':
                        channel.send({ content: `<@&${StaffServerRoles.Control}>, новый обход!`, embeds: [embed], components: [new ActionRowBuilder().addComponents(button)] })
                        break;
                }
            }
        }, {
            timezone: 'Europe/Moscow'
        })

        cron.schedule('* * * * *', async () => {
            const histories = await History.findAll({
                where: {
                    expiresAt: { [Op.lt]: new Date() }
                }
            })
            const guild = client.guilds.cache.get(Utility.guildId)

            for (const history of histories.filter(t => t.type !== 'Warn')) {
                const hasRole = (id) => member.roles.cache.has(id)
                const member = await guild.members.fetch(history.target).catch(() => null)
                if (hasRole(WorkRoles[history.type])) {
                    await member?.roles.remove(WorkRoles[history.type]) &&
                        await member?.send({ embeds: [new EmbedBuilder().setDescription(PunishmentRemoveMessage[history.type]).setColor(Utility.colorDiscord).setFooter({ text: `Сервер | ${guild.name}`, iconURL: guild.iconURL() })] })
                }
            }
        }, {
            timezone: 'Europe/Moscow'
        });

        cron.schedule('0 0 * * 6', async () => {
            await sheetAssist.loadCells()
            let rowIndex = 3
            let cell = sheet.getCell(rowIndex, 66)
            while (cell.value !== null) {
                cell.formula = `=${sheet.getCell(rowIndex, 64).a1Address} + ${cell.value}`

                rowIndex++
                cell = sheetAssist.getCell(rowIndex, 66)
            }
            await sheetAssist.saveUpdatedCells();
            await sheetAssist.duplicate();
            await sheetAssist.clear('H4:BD24');
        }, {
            timezone: 'Europe/Moscow'
        });

        cron.schedule('0 0 * * 6', async () => {
            await sheet.loadCells()
            let rowIndex = 3
            let cell = sheet.getCell(rowIndex, 66)
            while (cell.value !== null) {
                cell.formula = `=${sheet.getCell(rowIndex, 64).a1Address} + ${cell.value}`

                rowIndex++
                cell = sheet.getCell(rowIndex, 66)
            }
            await sheet.saveUpdatedCells();
            await sheet.duplicate();
            await sheet.clear('H4:BD24');
        }, {
            timezone: 'Europe/Moscow'
        });

        cron.schedule("0 * * * *", async () => {
            const stuffServer = client.guilds.cache.get(Utility.StuffServer)

            stuffServer.members.cache.forEach(async member => {
                if (member.roles.cache.find((role) => Object.values(StaffServerRoles).includes(role.id))) {
                    return
                } else {
                    console.log(await countStaff(member.user.id));
                    if (await countStaff(member.user.id)) {
                        member.roles.add(StaffServerRoles.Control)
                    } else {
                        member.kick("Отсутствует стафф роль.") && await client.channels.cache.get(StaffChats.StaffServerLogs).send({ embeds: [new EmbedBuilder().setColor(Utility.colorDiscord).setAuthor({ name: `Исключен: ${member.user.username} | ${member.user.id}`, iconURL: member.user.displayAvatarURL() }).setDescription("```Причина: Отсутствует стафф роль.```").setFooter({ text: "Выполнил(а): СИСТЕМА" })] })
                    }
                }
            })
        }, {
            timezone: 'Europe/Moscow'
        });
    },
};
