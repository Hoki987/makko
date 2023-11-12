//===========================================/ Import the modeles \===========================================\\
const { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
//==========< OTHERS >==========\\
const { WorkRoles, Utility, StaffRoles, StaffChats, HistoryEmojis, OwnerId, CommandsLogsID } = require('../../../config.js');
const History = require('../../Structures/Models/History.js');
const { fetchStaff } = require('../../Structures/Untils/Functions/fetchStaff.js');
const { action } = require('../../Structures/Untils/Functions/action.js');
const { createDB, findOneDB } = require('../../Structures/Untils/Functions/actionDB.js');
const { Op } = require('sequelize');
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
        const getUser = interaction.options.get('пользователь');
        const getReason = interaction.options.getString('причина');

        const isAssistant = interaction.channel.id === StaffChats.Assistant
        const isControl = interaction.channel.id === StaffChats.Control

        const memberPosition = interaction.member.roles.cache.filter(r => Object.values(StaffRoles).includes(r.id))?.sort((a, b) => b.position - a.position)?.first()?.position || 1;
        const targetPosition = getUser.member.roles.cache.filter(r => Object.values(StaffRoles).includes(r.id))?.sort((a, b) => b.position - a.position)?.first()?.position || 0;

        const hasRoleExecutor = (id) => interaction.member.roles.cache.has(id);
        const hasRole = (id) => getUser.member.roles.cache.has(id);

        let color;
        let fields;
        let customId;
        let staffSheet;

        let description;
        let badDescription;
        let ComplexDescription;

        const text = {
            standart: `**[${HistoryEmojis.Warn}] Пользователю <@${getUser.user.id}> был выдан warn \n\`\`\`ansi\n[2;35m[2;30m[2;35mПричина:[0m[2;30m[0m[2;35m[0m [2;36m${getReason}[0m\`\`\`**`,
            badOne: `**[${HistoryEmojis.Mute}] Пользователю <@${getUser.user.id}> не был выдан <@&${WorkRoles.Mute}>\n\`\`\`ansi\n[2;35m[2;30m[2;35mПричина:[0m[2;30m[0m[2;35m[0m [2;36mуже имеется мут[0m\`\`\`**`,
            badTwo: `\`\`\`Недостаточно прав!\`\`\``,
            badThree: `\`\`\`Пользователь забанен навсегда\`\`\``,
            badFour: `\`\`\`Пользователь находится в не зарегестрированном бане!\`\`\``,
            ComplexOne: `**[${HistoryEmojis.Mute} | ${HistoryEmojis.Warn}  | ${HistoryEmojis.Ban}]** **Пользователю <@${getUser.user.id}> был выдан:**`,
            ComplexTwo: `**[${HistoryEmojis.Mute} | ${HistoryEmojis.Warn}]** **Пользователю <@${getUser.user.id}> был выдан:**`,
            Appel: `\`\`\`ansi\n[2;35m[2;30m[2;35mПричина:[0m[2;30m[0m[2;35m[0m [2;36m${getReason}[0m\`\`\` \n${Utility.pointEmoji} Если хотите оспорить наказание, нажмите **на кнопку ниже.**\n${Utility.pointEmoji} Имейте ввиду, что для быстрого решения вопроса вам лучше \n${Utility.fonEmoji} иметь **доказательства** свой невиновности.\n${Utility.pointEmoji} Если ваше обжалование будет сформировано неадекватно,\n ${Utility.fonEmoji} **оно будет закрыто.**`
        }

        const field = {
            Bad: [{ name: "```   Субъект   ```", value: `<@${interaction.user.id}>`, inline: true }, { name: "```   Объект   ```", value: `<@${getUser.user.id}>`, inline: true }],
            MuteWarn: [{ name: "```      Мут      ```", value: `Причина: ${getReason}\nВремя:  минут`, inline: true }, { name: "```      Варн      ```", value: `Причина: 4.3\nВремя: 14 дней`, inline: true }],
            BanWarnMute: [{ name: "```      Мут      ```", value: `Причина: ${getReason}\nВремя: минут`, inline: true }, { name: "```      Варн      ```", value: `Причина: 4.3\nВремя: 14 дней`, inline: true }, { name: "```      Бан      ```", value: `Причина: 4.3\nВремя: 30 дней`, inline: true }]
        }
        await interaction.deferReply()
        switch (true) {
            case isControl:
                staffSheet = 1162940648
                customId = 'ControlAppelButton'
                break;
            case isAssistant:
                staffSheet = 0
                customId = 'AssistAppelButton'
                break;
            case hasRoleExecutor(StaffRoles.Admin || StaffRoles.Developer || StaffRoles.Moderator) || [OwnerId.hoki].includes(interaction.user.id):
                staffSheet = null
                customId = 'AdminAppelButton'
                break;
            default:
                staffSheet = undefined
                break;
        }

        // async function WarnAndBan(user) {
        //     const sheet = staffSheet;
        //     await sheet.loadCells()

        //     const rowsBan = await sheet.getRows();
        //     const rowBan = rowsBan.find((r) => r._rawData.includes(user))
        //     const days = (new Date().getDay() + 1) % 7
        //     const cellWarn = sheet.getCell(rowBan.rowNumber - 1, 9 + days * 7)
        //     const cellBan = sheet.getCell(rowBan.rowNumber - 1, 10 + days * 7)

        //     cellWarn.value = Number(cellWarn.value || 0) + 1
        //     cellBan.value = Number(cellBan.value || 0) + 1
        //     sheet.saveUpdatedCells();
        // }
        // async function Warn(user) {
        //     const sheet = staffSheet;
        //     await sheet.loadCells()
        //     const rows = await sheet.getRows();
        //     const row = rows.find((r) => r._rawData.includes(user))
        //     const day = (new Date().getDay() + 1) % 7
        //     const cell = sheet.getCell(row.rowNumber - 1, 9 + day * 7)

        //     cell.value = Number(cell.value || 0) + 1
        //     sheet.saveUpdatedCells();
        // }
        const countActiveWarn = await History.count({ where: { type: 'Warn', expiresAt: { [Op.gt]: new Date() } } })
        switch (true) {
            case staffSheet === undefined:
            case interaction.user.id === getUser.member.id:
            case getUser.user.bot:
            case memberPosition <= targetPosition && ![OwnerId.hoki].includes(interaction.user.id):
            case hasRole(WorkRoles.Ban) && await fetchStaff(staffSheet, interaction.user.id) === false:
                badDescription = text.badTwo;
                fields = field.Bad
                color = Utility.colorDiscord;
                break;
            case hasRole(WorkRoles.Ban):
                const activeBan = await findOneDB(getUser.user.id, 'Ban', { [Op.gt]: new Date() })
                const findPermBan = await findOneDB(getUser.user.id, 'Ban', { [Op.is]: null })
                if (findPermBan) {
                    badDescription = text.badThree
                    fields = field.Bad
                    color = Utility.colorRed
                    break;
                } else {
                    switch (true) {
                        case activeBan === null:
                            badDescription = text.badFour
                            fields = field.Bad
                            color = Utility.colorRed
                            await getUser.member.roles.remove(WorkRoles.Ban)
                            break;
                        default:
                            switch (staffSheet) {
                                case 0:
                                case 1162940648:
                                    switch (true) {
                                        case hasRoleExecutor(StaffRoles.Admin || StaffRoles.Developer || StaffRoles.Moderator):
                                        case [OwnerId.hoki].includes(interaction.user.id):
                                            description = text.standart
                                            color = Utility.colorDiscord
                                            await createDB(interaction.user.id, getUser.user.id, getReason, 'Warn', new Date(Date.now())) // 1209600000 либо
                                            await History.update({ expiresAt: new Date(activeBan.expiresAt.getTime() + 1000 * 60 * 60 * 24 * 7) }, { where: { id: activeBan.id } })
                                            break;
                                        case await fetchStaff(staffSheet, interaction.user.id) === true:
                                            await action(staffSheet, interaction.user.id, 9)
                                            description = text.standart
                                            color = Utility.colorDiscord
                                            await createDB(interaction.user.id, getUser.user.id, getReason, 'Warn', new Date(Date.now())) // 1209600000 либо
                                            await History.update({ expiresAt: new Date(activeBan.expiresAt.getTime() + 1000 * 60 * 60 * 24 * 7) }, { where: { id: activeBan.id } })
                                            break;
                                        default:
                                            fields = field.Bad
                                            badDescription = text.badTwo;
                                            color = Utility.colorDiscord;
                                            break;
                                    }
                                    break;
                                case null:
                                    switch (true) {
                                        case hasRoleExecutor(StaffRoles.Admin || StaffRoles.Developer || StaffRoles.Moderator):
                                        case [OwnerId.hoki].includes(interaction.user.id):
                                            description = text.standart
                                            color = Utility.colorDiscord
                                            await createDB(interaction.user.id, getUser.user.id, getReason, 'Warn', new Date(Date.now())) // 1209600000 либо
                                            await History.update({ expiresAt: new Date(activeBan.expiresAt.getTime() + 1000 * 60 * 60 * 24 * 7) }, { where: { id: activeBan.id } })
                                            break;
                                        default:
                                            fields = field.Bad
                                            badDescription = text.badTwo;
                                            color = Utility.colorDiscord;
                                            break;
                                    }
                                    break;
                            }
                            // try {
                            //     if (hasRoleExecutor(StaffRoles.Admin || StaffRoles.Developer || StaffRoles.Moderator) || ['295493530548174848'].includes(interaction.user.id)) {
                            //         description = `**[${HistoryEmojis.Warn}] Пользователю <@${getUser.user.id}> был выдан warn \n\`\`\`ansi\n[2;35m[2;30m[2;35mПричина:[0m[2;30m[0m[2;35m[0m [2;36m${getReason}[0m\`\`\`**`
                            //         color = Utility.colorRed
                            //     } else {
                            //         await Warn(interaction.user.id);
                            //         description = `**[${HistoryEmojis.Warn}] Пользователю <@${getUser.user.id}> был выдан warn \n\`\`\`ansi\n[2;35m[2;30m[2;35mПричина:[0m[2;30m[0m[2;35m[0m [2;36m${getReason}[0m\`\`\`**`
                            //         color = Utility.colorRed
                            //     }
                            // } catch (error) {
                            //     badDescription = `**Вы не являетесь** \`Контролом / Ассистентом\``
                            //     color = Utility.colorDiscord
                            //     break;
                            // }
                            // await History.create({
                            //     executor: interaction.user.id,
                            //     target: getUser.user.id,
                            //     reason: getReason,
                            //     type: 'Warn',
                            //     expiresAt: new Date(Date.now() + 1209600000), // 14 дней
                            // })
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
        const embedAppel = new EmbedBuilder().setDescription(text.Appel).setColor(Utility.colorDiscord).setFooter({ text: `Выполнил(а) ${interaction.user.tag} | ` + 'Сервер ' + interaction.guild.name, iconURL: interaction.user.displayAvatarURL() });
        const AppelButton = new ButtonBuilder().setCustomId(customId).setLabel('ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤОбжаловатьㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ').setStyle(ButtonStyle.Primary);
        const embed = new EmbedBuilder().setColor(color).setDescription(description || ComplexDescription || badDescription)

        if (badDescription) {
            await interaction.editReply({ embeds: [embed] }) && client.channels.cache.get(StaffChats.Logs).send({ embeds: [embed.setTitle(`**Команда: ${CommandsLogsID.Mute}**`).setFields(fields)] })
        }
        if (description) {
            await interaction.editReply({ embeds: [embed] }) && client.channels.cache.get(StaffChats.Logs).send({ embeds: [embed.setFooter({ text: `Выполнил(а) ${interaction.user.tag}  | ${interaction.user.id}`, iconURL: interaction.user.displayAvatarURL() })] }) && await getUser.user.send({ embeds: [embedAppel.setTitle(`[${HistoryEmojis.Mute}] Вы получили мут на ${getTime.value} минут`)], components: [new ActionRowBuilder().addComponents(AppelButton)] });
        }
        if (ComplexDescription) {
            await interaction.editReply({ embeds: [embed.setFields(fields)] }) && client.channels.cache.get(StaffChats.Logs).send({ embeds: [embed.setFooter({ text: `Выполнил(а) ${interaction.user.tag} | ${interaction.user.id}`, iconURL: interaction.user.displayAvatarURL() })] }) && await getUser.user.send({ embeds: [embedAppel.setTitle(`Вы получили комплексное наказание`)], components: [new ActionRowBuilder().addComponents(AppelButton)] }) && await getUser.user.send({ embeds: [embed.setFields(fields)] });
        }
    }
}
