//===========================================/ Import the modeles \===========================================\\
const { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

//==========< OTHERS >==========\\
const { WorkRoles, Utility, StaffRoles, StaffChats, HistoryEmojis, CommandsLogsID } = require('../../../config.js');
const History = require('../../Structures/Models/History.js');

const { Op } = require('sequelize');
const { doc, docAssist } = require('../../Structures/Untils/googlesheet.js')
//===========================================< Code >===========================================\\
module.exports = {
    data: new SlashCommandBuilder()
        .setName("warn")
        .setDescription("Выдает варн")
        .setDMPermission(false)
        .addUserOption((target) => target.setName('пользователь').setDescription("Выбери пользователя").setRequired(true))
        .addStringOption((reason) => reason.setName('причина').setDescription('напиши причину предупреждения').setRequired(true)),

    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */

    async execute(client, interaction) {
        if (![StaffChats.Assistant, StaffChats.Control].includes(interaction.channel.id)) {
            await interaction.reply({
                ephemeral: true,
                content: 'Используйте чат, соответствующий вашей стафф роли!'
            })
            return
        }
        const isAssistant = interaction.channel.id === StaffChats.Assistant
        const isControl = interaction.channel.id === StaffChats.Control

        const getUser = interaction.options.get('пользователь');
        const getReason = interaction.options.getString('причина');
        const hasRoleExecutor = (id) => interaction.member.roles.cache.has(id);
        const hasRole = (id) => getUser.member.roles.cache.has(id);

        const memberPosition = interaction.member.roles.cache.filter(r => Object.values(StaffRoles).includes(r.id))?.sort((a, b) => b.position - a.position)?.first()?.position || 1;
        const targetPosition = getUser.member.roles.cache.filter(r => Object.values(StaffRoles).includes(r.id))?.sort((a, b) => b.position - a.position)?.first()?.position || 0;

        let description;
        let badDescription;
        let nonExistDescription;
        let color;
        let staffSheet;
        let customId;

        await interaction.deferReply()

        switch (true) {
            case isControl:
                await doc.loadInfo()
                staffSheet = doc.sheetsById[1162940648]
                customId = 'ControlAppelButton'
                break;
            case isAssistant:
                await docAssist.loadInfo()
                staffSheet = docAssist.sheetsById[0]
                customId = 'AssistAppelButton'
                break;
        }

        async function WarnAndBan(user) {
            const sheet = staffSheet;
            await sheet.loadCells()

            const rowsBan = await sheet.getRows();
            const rowBan = rowsBan.find((r) => r._rawData.includes(user))
            const days = (new Date().getDay() + 1) % 7
            const cellWarn = sheet.getCell(rowBan.rowNumber - 1, 9 + days * 7)
            const cellBan = sheet.getCell(rowBan.rowNumber - 1, 10 + days * 7)

            cellWarn.value = Number(cellWarn.value || 0) + 1
            cellBan.value = Number(cellBan.value || 0) + 1
            sheet.saveUpdatedCells();
        }
        async function Warn(user) {
            const sheet = staffSheet;
            await sheet.loadCells()
            const rows = await sheet.getRows();
            const row = rows.find((r) => r._rawData.includes(user))
            const day = (new Date().getDay() + 1) % 7
            const cell = sheet.getCell(row.rowNumber - 1, 9 + day * 7)

            cell.value = Number(cell.value || 0) + 1
            sheet.saveUpdatedCells();
        }
        const countActiveWarn = await History.count({ where: { type: 'Warn', expiresAt: { [Op.gt]: new Date() } } })
        switch (true) {
            case interaction.user.id === getUser.member.id:
            case getUser.user.bot:
            case memberPosition <= targetPosition:
                badDescription = `\`\`\`Недостаточно прав!\`\`\``;
                color = Utility.colorDiscord;
                break;
            case hasRole(WorkRoles.Ban):
                const findPermBan = await History.findOne({
                    where: {
                        target: getUser.user.id,
                        type: 'Ban',
                        expiresAt: { [Op.is]: null },
                    }
                })
                const activeBan = await History.findOne({
                    where: {
                        target: getUser.user.id,
                        type: 'Ban',
                        expiresAt: { [Op.gt]: new Date() },
                    }
                })
                if (findPermBan) {
                    badDescription = `\`\`\`Пользователь забанен навсегда\`\`\``
                    color = Utility.colorRed
                    break;
                } else {
                    switch (true) {
                        case activeBan === null:
                            nonExistDescription = `\`\`\`Пользователь находится в не зарегестрированном бане!\`\`\``
                            color = Utility.colorRed
                            break;
                        default:
                            try {
                                if (hasRoleExecutor(StaffRoles.Admin || StaffRoles.Developer || StaffRoles.Moderator) || ['295493530548174848'].includes(interaction.user.id)) {
                                    description = `**[${HistoryEmojis.Warn}] Пользователю <@${getUser.user.id}> был выдан warn \n\`\`\`ansi\n[2;35m[2;30m[2;35mПричина:[0m[2;30m[0m[2;35m[0m [2;36m${getReason}[0m\`\`\`**`
                                    color = Utility.colorRed
                                } else {
                                    await Warn(interaction.user.id);
                                    description = `**[${HistoryEmojis.Warn}] Пользователю <@${getUser.user.id}> был выдан warn \n\`\`\`ansi\n[2;35m[2;30m[2;35mПричина:[0m[2;30m[0m[2;35m[0m [2;36m${getReason}[0m\`\`\`**`
                                    color = Utility.colorRed
                                }
                            } catch (error) {
                                badDescription = `**Вы не являетесь** \`Контролом / Ассистентом\``
                                color = Utility.colorDiscord
                                break;
                            }
                            History.update({
                                expiresAt: new Date(activeBan.expiresAt.getTime() + 1000 * 60 * 60 * 24 * 7)
                            },
                                {
                                    where: {
                                        id: activeBan.id
                                    }
                                }
                            )
                            await History.create({
                                executor: interaction.user.id,
                                target: getUser.user.id,
                                reason: getReason,
                                type: 'Warn',
                                expiresAt: new Date(Date.now()), // 14 дней
                            })
                            break;
                    }
                }
                break;
            case countActiveWarn >= 2:
                try {
                    if (hasRoleExecutor(StaffRoles.Admin || StaffRoles.Developer || StaffRoles.Moderator) || ['295493530548174848'].includes(interaction.user.id)) {
                        description = `**[${Utility.banEmoji}]** Пользователь ${getUser.user} был **забанен на 30 дней**\n\`\`\`ansi\n[2;35m[2;30m[2;35mПричина:[0m[2;30m[0m[2;35m[0m [2;36m4.3[0m\`\`\``
                        color = Utility.colorGreen
                    } else {
                        await WarnAndBan(interaction.user.id);
                        description = `**[${Utility.banEmoji}]** Пользователь ${getUser.user} был **забанен на 30 дней**\n\`\`\`ansi\n[2;35m[2;30m[2;35mПричина:[0m[2;30m[0m[2;35m[0m [2;36m4.3[0m\`\`\``
                        color = Utility.colorGreen
                    }
                } catch (error) {
                    badDescription = `**Вы не являетесь** \`Контролом / Ассистентом\``
                    color = Utility.colorDiscord
                    break;
                }
                await History.create({ executor: interaction.user.id, target: getUser.user.id, reason: '4.3', type: 'Warn', expiresAt: new Date(Date.now() + 1209600000), })
                await History.create({ executor: interaction.user.id, target: getUser.user.id, reason: '4.3', type: 'Ban', expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), })

                const embedAppelBan = new EmbedBuilder().setTitle(`[${Utility.banEmoji}] Вы получили бан на 30 дней`).setDescription(`\`\`\`ansi\n[2;35m[2;30m[2;35mПричина:[0m[2;30m[0m[2;35m[0m [2;36m4.3[0m\`\`\` \n${Utility.pointEmoji} Если хотите оспорить наказание, нажмите **на кнопку ниже.**\n${Utility.pointEmoji} Имейте ввиду, что для быстрого решения вопроса вам лучше \n${Utility.fonEmoji} иметь **доказательства** свой невиновности.\n${Utility.pointEmoji} Если ваше обжалование будет сформировано неадекватно,\n ${Utility.fonEmoji} **оно будет закрыто.**`).setColor(Utility.colorDiscord).setFooter({ text: `Выполнил(а) ${interaction.user.tag} | ` + 'Сервер ' + interaction.guild.name, iconURL: interaction.user.displayAvatarURL() });
                const AppelButtonBan = new ButtonBuilder().setCustomId(customId).setLabel('ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤОбжаловатьㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ').setStyle(ButtonStyle.Primary);

                await getUser.member.roles.add(WorkRoles.Ban)
                await getUser.user.send({ embeds: [embedAppelBan], components: [new ActionRowBuilder().addComponents(AppelButtonBan)] });
                break;
            default:
                try {
                    if (hasRoleExecutor(StaffRoles.Admin || StaffRoles.Developer || StaffRoles.Moderator) || ['295493530548174848'].includes(interaction.user.id)) {
                        description = `**[${HistoryEmojis.Warn}] Пользователю <@${getUser.user.id}> был выдан warn \n\`\`\`ansi\n[2;35m[2;30m[2;35mПричина:[0m[2;30m[0m[2;35m[0m [2;36m${getReason}[0m\`\`\`**`
                        color = Utility.colorRed
                    } else {
                        await Warn(interaction.user.id);
                        description = `**[${HistoryEmojis.Warn}] Пользователю <@${getUser.user.id}> был выдан warn \n\`\`\`ansi\n[2;35m[2;30m[2;35mПричина:[0m[2;30m[0m[2;35m[0m [2;36m${getReason}[0m\`\`\`**`
                        color = Utility.colorRed
                    }
                } catch (error) {
                    console.log(error);
                    badDescription = `**Вы не являетесь** \`Контролом / Ассистентом\``
                    color = Utility.colorDiscord
                    break;
                }
                const embedAppel = new EmbedBuilder().setTitle(`[${HistoryEmojis.Warn}] Вы получили warn на 14 дней`).setDescription(`\`\`\`ansi\n[2;35m[2;30m[2;35mПричина:[0m[2;30m[0m[2;35m[0m [2;36m${getReason}[0m\`\`\` \n${Utility.pointEmoji} Если хотите оспорить наказание, нажмите **на кнопку ниже.**\n${Utility.pointEmoji} Имейте ввиду, что для быстрого решения вопроса вам лучше \n${Utility.fonEmoji} иметь **доказательства** свой невиновности.\n${Utility.pointEmoji} Если ваше обжалование будет сформировано неадекватно,\n ${Utility.fonEmoji} **оно будет закрыто.**`).setColor(Utility.colorDiscord).setFooter({ text: `Выполнил(а) ${interaction.user.tag} | ` + 'Сервер ' + interaction.guild.name, iconURL: interaction.user.displayAvatarURL() });
                const AppelButton = new ButtonBuilder().setCustomId(customId).setLabel('ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤОбжаловатьㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ').setStyle(ButtonStyle.Primary);

                await History.create({
                    executor: interaction.user.id,
                    target: getUser.user.id,
                    reason: getReason,
                    type: 'Warn',
                    expiresAt: new Date(Date.now() + 1209600000), // 14 дней
                })
                await getUser.user.send({ embeds: [embedAppel], components: [new ActionRowBuilder().addComponents(AppelButton)] });
                break;
        }
        const embed = new EmbedBuilder().setColor(color).setDescription(description || badDescription || nonExistDescription)
        if (nonExistDescription) {
            await interaction.editReply({ embeds: [embed.setFooter({ iconURL: client.user.displayAvatarURL(), text: `${client.user.displayName} | Рекомендуется снять роль Бана!` })] }) && client.channels.cache.get(StaffChats.Logs).send({ embeds: [embed.setTitle(`**Команда: ${CommandsLogsID.Warn}**`).setFields({ name: "`Пользователь`", value: `<@${interaction.user.id}>`, inline: true }, { name: "`Использовал на`", value: `<@${getUser.user.id}>`, inline: true }).setFooter({ iconURL: client.user.displayAvatarURL(), text: `${client.user.displayName} | Рекомендуется снять роль Бана!` })] })
        }
        if (badDescription) {
            await interaction.editReply({ embeds: [embed] }) && client.channels.cache.get(StaffChats.Logs).send({ embeds: [embed.setTitle(`**Команда: ${CommandsLogsID.Warn}**`).setFields({ name: "`Пользователь`", value: `<@${interaction.user.id}>`, inline: true }, { name: "`Использовал на`", value: `<@${getUser.user.id}>`, inline: true })] })
        }
        if (description) {
            await interaction.editReply({ embeds: [embed] }) && client.channels.cache.get(StaffChats.Logs).send({ embeds: [embed.setFooter({ iconURL: interaction.user.avatarURL(), text: `Выполнил(а): ${interaction.user.username}` })] })
        }
    }
}
