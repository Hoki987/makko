//===========================================/ Import the modeles \===========================================\\
const { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
//==========< OTHERS >==========\\
const { WorkRoles, Utility, StaffRoles, StaffChats, HistoryEmojis, OwnerId, CommandsLogsID, UntilsRoles } = require('../../../config.js');
const History = require('../../Structures/Models/History.js');
const { action, MuteWarnBan } = require('../../Structures/Untils/Functions/action.js');
const { countStaff, createDB, findOneDB, countDB } = require('../../Structures/Untils/Functions/actionDB.js');
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
        let staffSheet;

        let description;
        let badDescription;
        let ComplexDescription;

        const text = {
            standart: `**[${HistoryEmojis.Warn}] Пользователю <@${getUser.user.id}> был выдан warn \n\`\`\`ansi\n[2;35m[2;30m[2;35mПричина:[0m[2;30m[0m[2;35m[0m [2;36m${getReason}[0m\`\`\`**`,
            badTwo: `\`\`\`Недостаточно прав!\`\`\``,
            badThree: `\`\`\`Пользователь забанен навсегда\`\`\``,
            badFour: `\`\`\`Пользователь находится в не зарегестрированном бане!\`\`\``,
            ComplexOne: `**[${HistoryEmojis.Warn}  | ${HistoryEmojis.Ban}]** **Пользователю <@${getUser.user.id}> был выдан:**`,
            Appel: `\`\`\`ansi\n[2;35m[2;30m[2;35mПричина:[0m[2;30m[0m[2;35m[0m [2;36m${getReason}[0m\`\`\` \n${Utility.pointEmoji} Если хотите оспорить наказание, нажмите **на кнопку ниже.**\n${Utility.pointEmoji} Имейте ввиду, что для быстрого решения вопроса вам лучше \n${Utility.fonEmoji} иметь **доказательства** свой невиновности.\n${Utility.pointEmoji} Если ваше обжалование будет сформировано неадекватно,\n ${Utility.fonEmoji} **оно будет закрыто.**`
        }

        const field = {
            Bad: [{ name: "```   Субъект   ```", value: `<@${interaction.user.id}>`, inline: true }, { name: "```   Объект   ```", value: `<@${getUser.user.id}>`, inline: true }],
            MuteWarn: [{ name: "```      Бан      ```", value: `Причина: 4.3\nВремя: 30 дней`, inline: true }, { name: "```      Варн      ```", value: `Причина: ${getReason}\nВремя: 14 дней`, inline: true }],
        }
        await interaction.deferReply()
        switch (true) {
            case isControl:
                staffSheet = 1162940648
                break;
            case isAssistant:
                staffSheet = 0
                break;
            case hasRoleExecutor(StaffRoles.Admin):
            case [OwnerId.hoki].includes(interaction.user.id):
                staffSheet = null
                break;
            default:
                staffSheet = undefined
                break;
        }
        const countActiveWarn = countDB(getUser.user.id, 'Warn', undefined, { [Op.gt]: new Date() })
        switch (true) {
            case staffSheet === undefined:
            case interaction.user.id === getUser.member.id:
            case getUser.user.bot:
            case memberPosition <= targetPosition && ![OwnerId.hoki].includes(interaction.user.id):
            case hasRole(WorkRoles.Ban) && await countStaff(interaction.user.id) === 0 && !hasRoleExecutor(StaffRoles.Admin) && ![OwnerId.hoki].includes(interaction.user.id):
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
                                        case hasRoleExecutor(StaffRoles.Admin):
                                        case [OwnerId.hoki].includes(interaction.user.id):
                                            description = text.standart
                                            color = Utility.colorDiscord
                                            await createDB(interaction.user.id, getUser.user.id, getReason, 'Warn', new Date(Date.now())) // 1209600000 либо
                                            await History.update({ expiresAt: new Date(activeBan.expiresAt.getTime() + 1000 * 60 * 60 * 24 * 7) }, { where: { id: activeBan.id } })
                                            break;
                                        case await countStaff(interaction.user.id) != 0:
                                            action(staffSheet, interaction.user.id, 9)
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
                                        case hasRoleExecutor(StaffRoles.Admin):
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
                            break;
                    }
                }
                break;
            case await countActiveWarn >= 2:
                switch (staffSheet) {
                    case 0:
                    case 1162940648:
                        switch (true) {
                            case hasRoleExecutor(StaffRoles.Admin):
                            case [OwnerId.hoki].includes(interaction.user.id):
                                ComplexDescription = text.ComplexOne
                                color = Utility.colorDiscord
                                fields = field.MuteWarn
                                await createDB(interaction.user.id, getUser.user.id, getReason, 'Warn', new Date(Date.now() + 1209600000))
                                await createDB(interaction.user.id, getUser.user.id, '4.3', 'Ban', new Date(Date.now() + 1000 * 60 * 60 * 24 * 30))
                                await getUser.member.roles.add(WorkRoles.Ban)
                                await getUser.member.roles.cache.forEach(r => {
                                    if (Object.values(UntilsRoles).includes(r.id)) {
                                        return;
                                    } else {
                                        getUser.member.roles.remove(r.id)
                                    }
                                })
                                break;
                            case await countStaff(interaction.user.id) != 0:
                                ComplexDescription = text.ComplexOne
                                color = Utility.colorDiscord
                                fields = field.MuteWarn
                                MuteWarnBan(staffSheet, interaction.user.id)
                                await createDB(interaction.user.id, getUser.user.id, getReason, 'Warn', new Date(Date.now() + 1209600000))
                                await createDB(interaction.user.id, getUser.user.id, '4.3', 'Ban', new Date(Date.now() + 1000 * 60 * 60 * 24 * 30))
                                await getUser.member.roles.add(WorkRoles.Ban)
                                await getUser.member.roles.cache.forEach(r => {
                                    if (Object.values(UntilsRoles).includes(r.id)) {
                                        return;
                                    } else {
                                        getUser.member.roles.remove(r.id)
                                    }
                                })
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
                            case hasRoleExecutor(StaffRoles.Admin):
                            case [OwnerId.hoki].includes(interaction.user.id):
                                ComplexDescription = text.ComplexOne
                                color = Utility.colorDiscord
                                fields = field.MuteWarn
                                await createDB(interaction.user.id, getUser.user.id, getReason, 'Warn', new Date(Date.now() + 1209600000))
                                await createDB(interaction.user.id, getUser.user.id, '4.3', 'Ban', new Date(Date.now() + 1000 * 60 * 60 * 24 * 30))
                                await getUser.member.roles.add(WorkRoles.Ban)
                                await getUser.member.roles.cache.forEach(r => {
                                    if (Object.values(UntilsRoles).includes(r.id)) {
                                        return;
                                    } else {
                                        getUser.member.roles.remove(r.id)
                                    }
                                })
                                break;
                            default:
                                fields = field.Bad
                                badDescription = text.badTwo;
                                color = Utility.colorDiscord;
                                break;
                        }
                        break;
                }
                break;
            default:
                switch (staffSheet) {
                    case 0:
                    case 1162940648:
                        switch (true) {
                            case hasRoleExecutor(StaffRoles.Admin):
                            case [OwnerId.hoki].includes(interaction.user.id):
                                description = text.standart
                                color = Utility.colorDiscord
                                await createDB(interaction.user.id, getUser.user.id, getReason, 'Warn', new Date(Date.now() + 1209600000))
                                break;
                            case await countStaff(interaction.user.id) != 0:
                                description = text.standart
                                color = Utility.colorDiscord
                                action(staffSheet, interaction.user.id, 9)
                                await createDB(interaction.user.id, getUser.user.id, getReason, 'Warn', new Date(Date.now() + 1209600000))
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
                                await createDB(interaction.user.id, getUser.user.id, getReason, 'Warn', new Date(Date.now() + 1209600000))
                                break
                            default:
                                fields = field.Bad
                                badDescription = text.badTwo;
                                color = Utility.colorDiscord;
                                break;
                        }
                        break;
                }
                break;
        }
        const embedAppel = new EmbedBuilder().setDescription(text.Appel).setColor(Utility.colorDiscord).setFooter({ text: `Выполнил(а) ${interaction.user.tag} | ` + 'Сервер ' + interaction.guild.name, iconURL: interaction.user.displayAvatarURL() });
        const AppelButton = new ButtonBuilder().setLabel('ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤОбжаловатьㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ').setStyle(ButtonStyle.Link).setURL(`${StaffChats.Appel}`);
        const embed = new EmbedBuilder().setColor(color).setDescription(description || ComplexDescription || badDescription)
        if (badDescription) {
            await interaction.editReply({ embeds: [embed] }) && client.channels.cache.get(StaffChats.Logs).send({ embeds: [embed.setTitle(`**Команда: ${CommandsLogsID.Warn}**`).setFields(fields)] })
        }
        if (description) {
            await interaction.editReply({ embeds: [embed] }) && client.channels.cache.get(StaffChats.Logs).send({ embeds: [embed.setFooter({ text: `Выполнил(а) ${interaction.user.tag}  | ${interaction.user.id}`, iconURL: interaction.user.displayAvatarURL() })] }) && await getUser.user.send({ embeds: [embedAppel.setTitle(`[${HistoryEmojis.Warn}] Вы получили warn на 14 дней`)], components: [new ActionRowBuilder().addComponents(AppelButton)] });
        }
        if (ComplexDescription) {
            await interaction.editReply({ embeds: [embed.setFields(fields)] }) && client.channels.cache.get(StaffChats.Logs).send({ embeds: [embed.setFooter({ text: `Выполнил(а) ${interaction.user.tag} | ${interaction.user.id}`, iconURL: interaction.user.displayAvatarURL() })] }) && await getUser.user.send({ embeds: [embedAppel.setTitle(`Вы получили комплексное наказание`)], components: [new ActionRowBuilder().addComponents(AppelButton)] }) && await getUser.user.send({ embeds: [embed.setFields(fields)] });
        }
    }
}
