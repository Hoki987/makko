//===========================================/ Import the modeles \===========================================\\
const { Client, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ChatInputCommandInteraction, ButtonStyle } = require("discord.js");
const { doc, docAssist } = require('../../Structures/Untils/googlesheet.js');
const History = require('../../Structures/Models/History.js');
const { Op } = require("sequelize");
const cron = require('node-cron');
const { WorkRoles, Utility, StaffChats, StaffServerRoles, PunishmentRemoveMessage, StaffRoles } = require('../../../config.js');
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
            .setCustomId(`ready_acceptVoice_${interaction.user.id}`)
            .setStyle(ButtonStyle.Success)

        const channel = client.channels.cache.get(StaffChats.Obhod)
        cron.schedule('0 * * * *', async () => {
            const messages = await channel.messages.fetch({ limit: 1 })
            const last = messages.last();
            if (last === undefined) {
                await channel.send({ content: `<@&${StaffServerRoles.Control}>, новый обход!`, embeds: [embed], components: [new ActionRowBuilder().addComponents(button)] })
            } else {
                switch (last.content) {
                    case `<@&${StaffServerRoles.Control}>, новый обход!`:
                        await last.delete() && await channel.send({ content: `<@&${StaffServerRoles.Control}>, новый обход!`, embeds: [embed], components: [new ActionRowBuilder().addComponents(button)] })
                        break;
                    case 'Обход окончен':
                        await channel.send({ content: `<@&${StaffServerRoles.Control}>, новый обход!`, embeds: [embed], components: [new ActionRowBuilder().addComponents(button)] })
                        break;
                }
            }
        }, {
            timezone: 'Europe/Moscow'
        })

        const embedChat = new EmbedBuilder()
            .setDescription('Обход')

        const buttonChat = new ButtonBuilder()
            .setLabel('Принять')
            .setCustomId(`ready_acceptChat_${interaction.user.id}`)
            .setStyle(ButtonStyle.Success)

        const channelChat = client.channels.cache.get(StaffChats.ObhodChat)
        cron.schedule('0 * * * *', async () => {
            const messagesChat = await channelChat.messages.fetch({ limit: 1 })
            const lastChat = messagesChat.last();
            if (lastChat === undefined) {
                await channelChat.send({ content: `<@&${StaffServerRoles.Control}>, новый обход!`, embeds: [embedChat], components: [new ActionRowBuilder().addComponents(buttonChat)] })
            } else {
                switch (lastChat.content) {
                    case `<@&${StaffServerRoles.Control}>, новый обход!`:
                        await lastChat.delete() && await channelChat.send({ content: `<@&${StaffServerRoles.Control}>, новый обход!`, embeds: [embedChat], components: [new ActionRowBuilder().addComponents(buttonChat)] })
                        break;
                    case 'Обход окончен':
                        await channelChat.send({ content: `<@&${StaffServerRoles.Control}>, новый обход!`, embeds: [embedChat], components: [new ActionRowBuilder().addComponents(buttonChat)] })
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
            let cell = sheetAssist.getCell(rowIndex, 66)
            while (cell.value !== null) {
                cell.formula = `=${sheetAssist.getCell(rowIndex, 64).a1Address} + ${cell.value}`

                rowIndex++
                cell = sheetAssist.getCell(rowIndex, 66)
            }
            await sheetAssist.saveUpdatedCells();
            await sheetAssist.duplicate();
            await sheetAssist.clear('H4:BD24');

            await sheet.loadCells()
            let cellContr = sheet.getCell(rowIndex, 66)
            while (cellContr.value !== null) {
                cellContr.formula = `=${sheet.getCell(rowIndex, 64).a1Address} + ${cellContr.value}`

                rowIndex++
                cellContr = sheet.getCell(rowIndex, 66)
            }
            await sheet.saveUpdatedCells();
            await sheet.duplicate();
            await sheet.clear('H4:BD24');
        }, {
            timezone: 'Europe/Moscow'
        });

        cron.schedule('0 * * * *', async () => {
            const mainGuild = client.guilds.cache.get("822354240713261068")
            const secondGuild = client.guilds.cache.get("1104726144697258044")

            await secondGuild.members.fetch();

            secondGuild.members.cache.forEach(async member => {
                const kickembed = new EmbedBuilder()
                    .setColor(Utility.colorDiscord)
                    .setAuthor({ name: `Исключен: ${member.user.username} | ${member.user.id}`, iconURL: member.user.displayAvatarURL() })
                    .setDescription("```Причина: Отсутствует стафф роль.```")
                    .setFooter({ text: "Выполнил(а): СИСТЕМА" })

                mainGuild.members.fetch(member.user.id).then(async (member) => {
                    member.roles.cache.find((role) => Object.values(StaffRoles).includes(role.id)) ? (void 0) : await countStaff(member.user.id) > 0 ?
                        await secondGuild.members.cache.get(member.user.id).roles.add(StaffServerRoles.Control) : await secondGuild.members.cache.get(member.user.id).kick("Отсутствует стафф роль.") && await secondGuild.channels.cache.get(StaffChats.StaffServerLogs).send({ embeds: [kickembed] })
                }).catch(async () => {
                    await secondGuild.members.cache.get(member.user.id).kick("Отсутствует стафф роль.") && await secondGuild.channels.cache.get(StaffChats.StaffServerLogs).send({ embeds: [kickembed] })
                })
            })
        }, {
            timezone: 'Europe/Moscow'
        });
    }

};
