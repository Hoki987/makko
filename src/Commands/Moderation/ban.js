//===========================================/ Import the modeles \===========================================\\
const { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

//==========< OTHERS >==========\\
const { WorkRoles, Utility, StaffRoles, StaffChats, HistoryEmojis, OwnerId, CommandsLogsID, Reasons, UntilsRoles } = require('../../../config.js');
const History = require('../../Structures/Models/History.js');
const { action } = require('../../Structures/Untils/Functions/action.js');
const { createDB, countStaff } = require('../../Structures/Untils/Functions/actionDB.js');
const { Op } = require('sequelize');
//===========================================< Code >===========================================\\
module.exports = {
    data: new SlashCommandBuilder()
        .setName("ban")
        .setDescription('Банит выбранного пользователя')
        .setDMPermission(false)
        .addUserOption((target) => target.setName("пользователь").setDescription("Выбери пользователя").setRequired(true))
        .addStringOption((reason) => reason.setName("причина").setDescription("Введи причину бана").setRequired(true).addChoices(
            { name: 'переход', value: 'переход' }, // бан навсегда
            { name: '4.4', value: '4.4' }, // 2 бана по этой причине - навсегда
            { name: '3.1', value: '3.1' }, // тяжелый 
            { name: '3.3', value: '3.3' }, // тяжелый
            { name: '3.6', value: '3.6' }, // тяжелый
            { name: '3.7', value: '3.7' }, // тяжелый
            { name: '3.9', value: '3.9' }, // бан навсегда. если человек получает варн по этой причине, то + неделя бана
            { name: '3.10', value: '3.10' }, // тяжелый
            { name: '3.11', value: '3.11' }, // бан навсегда.
            { name: '3.13', value: '3.13' }, // тяжелый.
            { name: '4.3', value: '4.3' },
            { name: '<13', value: '<13' }, // бан навсегда.
        )),
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
        const banReson = (banType) => Object.values(banType).includes(getReason);

        let color;
        let fields;
        let staffSheet;
        let customId;

        let description;
        let badDescription;
        let time;

        let expiresAt;

        const text = {
            time: ['**забанен навсегда**', '**забанен на 30 дней**'],
            banPerm: `**[${HistoryEmojis.Ban}]** Пользователь <@${getUser.user.id}> был **забанен навсегда**\n\`\`\`Причина: ${getReason} \`\`\``,
            standart: `**[${HistoryEmojis.Ban}]** Пользователь <@${getUser.user.id}> был **забанен на 30 дней**\n\`\`\`Причина: ${getReason} \`\`\``,
            badOne: `**[${HistoryEmojis.Ban}] Пользователю <@${getUser.user.id}> не было выдано <@&${WorkRoles.Ban}>\n\`\`\`ansi\n[2;35m[2;30m[2;35mПричина:[0m[2;30m[0m[2;35m[0m [2;36mуже имеется предупреждение[0m\`\`\`**`,
            badTwo: `\`\`\`Недостаточно прав!\`\`\``,
            badThree: `**[${HistoryEmojis.Ban}] Активные записи отсутствуют! <@&${WorkRoles.Ban}> будет снято.**`,
            Appel: `\`\`\`ansi\n[2;35m[2;30m[2;35mПричина:[0m[2;30m[0m[2;35m[0m [2;36m${getReason}[0m\`\`\` \n${Utility.pointEmoji} Если хотите оспорить наказание, нажмите **на кнопку ниже.**\n${Utility.pointEmoji} Имейте ввиду, что для быстрого решения вопроса вам лучше \n${Utility.fonEmoji} иметь **доказательства** свой невиновности.\n${Utility.pointEmoji} Если ваше обжалование будет сформировано неадекватно,\n ${Utility.fonEmoji} **оно будет закрыто.**`
        }
        const field = {
            Bad: [{ name: "```   Субъект   ```", value: `<@${interaction.user.id}>`, inline: true }, { name: "```   Объект   ```", value: `<@${getUser.user.id}>`, inline: true }],
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
        switch (true) {
            case staffSheet === undefined:
            case interaction.user.id === getUser.member.id:
            case getUser.user.bot:
            case memberPosition <= targetPosition && ![OwnerId.hoki].includes(interaction.user.id):
            case hasRole(WorkRoles.Ban) && await countStaff(interaction.user.id) === 0 && !hasRoleExecutor(StaffRoles.Admin || StaffRoles.Developer || StaffRoles.Moderator) && ![OwnerId.hoki].includes(interaction.user.id):
                badDescription = text.badTwo;
                fields = field.Bad
                color = Utility.colorDiscord;
                break;
            case hasRole(WorkRoles.Ban):
                const activeBan = await History.findOne({ where: { target: getUser.user.id, type: 'Ban', expiresAt: { [Op.gt]: new Date() }, } })
                if (activeBan) {
                    badDescription = text.badOne
                    fields = field.Bad
                    color = Utility.colorDiscord;
                } else {
                    badDescription = text.badThree
                    color = Utility.colorRed
                    fields = field.Bad
                    await getUser.member.roles.remove(WorkRoles.Ban)
                }
                break;
            default:
                switch (staffSheet) {
                    case 0:
                    case 1162940648:
                        console.log('1');
                        switch (true) {
                            case banReson(Reasons.PERM):
                                switch (true) {
                                    case hasRoleExecutor(StaffRoles.Admin || StaffRoles.Developer || StaffRoles.Moderator):
                                    case [OwnerId.hoki].includes(interaction.user.id):
                                        description = text.banPerm
                                        color = Utility.colorGreen
                                        time = text.time[0]
                                        await createDB(interaction.user.id, getUser.user.id, getReason, 'Ban', null)
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
                                        description = text.banPerm
                                        color = Utility.colorGreen
                                        time = text.time[0]
                                        await createDB(interaction.user.id, getUser.user.id, getReason, 'Ban', null)
                                        action(staffSheet, interaction.user.id, 10)
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
                            case banReson(Reasons.HARD):
                                switch (true) {
                                    case hasRoleExecutor(StaffRoles.Admin || StaffRoles.Developer || StaffRoles.Moderator):
                                    case [OwnerId.hoki].includes(interaction.user.id):
                                        const permBan = [text.banPerm, Utility.colorGreen, null]
                                        const monthBan = [text.standart, Utility.colorGreen, new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)]
                                        const records = await History.count({ where: { target: getUser.user.id, reason: getReason, type: 'Ban' }, })
                                        description = records ? permBan[0] : monthBan[0]
                                        color = records ? permBan[1] : monthBan[1]
                                        expiresAt = records ? permBan[2] : monthBan[2]
                                        time = records ? text.time[0] : text.time[1]
                                        await createDB(interaction.user.id, getUser.user.id, getReason, 'Ban', expiresAt)
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
                                        description = records ? permBan[0] : monthBan[0]
                                        color = records ? permBan[1] : monthBan[1]
                                        expiresAt = records ? permBan[2] : monthBan[2]
                                        time = records ? text.time[0] : text.time[1]
                                        action(staffSheet, interaction.user.id, 10)
                                        await createDB(interaction.user.id, getUser.user.id, getReason, 'Ban', expiresAt)
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
                            case banReson(Reasons.SOFT):
                                switch (true) {
                                    case hasRoleExecutor(StaffRoles.Admin || StaffRoles.Developer || StaffRoles.Moderator):
                                    case [OwnerId.hoki].includes(interaction.user.id):
                                        description = text.standart
                                        color = Utility.colorGreen
                                        time = text.time[1]
                                        await createDB(interaction.user.id, getUser.user.id, getReason, 'Ban', new Date(Date.now() + 1000 * 60 * 60 * 24 * 30))
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
                                        description = text.standart
                                        color = Utility.colorGreen
                                        time = text.time[1]
                                        action(staffSheet, interaction.user.id, 10)
                                        await createDB(interaction.user.id, getUser.user.id, getReason, 'Ban', new Date(Date.now() + 1000 * 60 * 60 * 24 * 30))
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
                            case banReson(Reasons.ADMIN):
                                console.log('2');
                                switch (true) {
                                    case hasRoleExecutor(StaffRoles.Admin || StaffRoles.Developer || StaffRoles.Moderator):
                                    case [OwnerId.hoki].includes(interaction.user.id):
                                        const permBan = [text.banPerm, Utility.colorGreen, null]
                                        const monthBan = [text.standart, Utility.colorGreen, new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)]
                                        const records = await History.count({ where: { target: getUser.user.id, reason: getReason, type: 'Ban' }, })
                                        description = records ? permBan[0] : monthBan[0]
                                        color = records ? permBan[1] : monthBan[1]
                                        expiresAt = records ? permBan[2] : monthBan[2]
                                        time = records ? text.time[0] : text.time[1]
                                        await createDB(interaction.user.id, getUser.user.id, getReason, 'Ban', expiresAt)
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
                    case null:
                        switch (true) {
                            case banReson(Reasons.PERM):
                                switch (true) {
                                    case hasRoleExecutor(StaffRoles.Admin || StaffRoles.Developer || StaffRoles.Moderator):
                                    case [OwnerId.hoki].includes(interaction.user.id):
                                        description = text.banPerm
                                        color = Utility.colorGreen
                                        time = text.time[0]
                                        await createDB(interaction.user.id, getUser.user.id, getReason, 'Ban', null)
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
                            case banReson(Reasons.HARD):
                                switch (true) {
                                    case hasRoleExecutor(StaffRoles.Admin || StaffRoles.Developer || StaffRoles.Moderator):
                                    case [OwnerId.hoki].includes(interaction.user.id):
                                        const permBan = [text.banPerm, Utility.colorGreen, null]
                                        const monthBan = [text.standart, Utility.colorGreen, new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)]
                                        const records = await History.count({ where: { target: getUser.user.id, reason: getReason, type: 'Ban' }, })
                                        description = records ? permBan[0] : monthBan[0]
                                        color = records ? permBan[1] : monthBan[1]
                                        expiresAt = records ? permBan[2] : monthBan[2]
                                        time = records ? text.time[0] : text.time[1]
                                        await createDB(interaction.user.id, getUser.user.id, getReason, 'Ban', expiresAt)
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
                            case banReson(Reasons.SOFT):
                                switch (true) {
                                    case hasRoleExecutor(StaffRoles.Admin || StaffRoles.Developer || StaffRoles.Moderator):
                                    case [OwnerId.hoki].includes(interaction.user.id):
                                        description = text.standart
                                        color = Utility.colorGreen
                                        time = text.time[1]
                                        await createDB(interaction.user.id, getUser.user.id, getReason, 'Ban', new Date(Date.now() + 1000 * 60 * 60 * 24 * 30))
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
                            case banReson(Reasons.ADMIN):
                                switch (true) {
                                    case hasRoleExecutor(StaffRoles.Admin || StaffRoles.Developer || StaffRoles.Moderator):
                                    case [OwnerId.hoki].includes(interaction.user.id):
                                        const permBan = [text.banPerm, Utility.colorGreen, null]
                                        const monthBan = [text.standart, Utility.colorGreen, new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)]
                                        const records = await History.count({ where: { target: getUser.user.id, reason: getReason, type: 'Ban' }, })
                                        description = records ? permBan[0] : monthBan[0]
                                        color = records ? permBan[1] : monthBan[1]
                                        expiresAt = records ? permBan[2] : monthBan[2]
                                        time = records ? text.time[0] : text.time[1]
                                        await createDB(interaction.user.id, getUser.user.id, getReason, 'Ban', expiresAt)
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
                }
        }
        const embedAppel = new EmbedBuilder().setDescription(text.Appel).setColor(Utility.colorDiscord).setFooter({ text: `Выполнил(а) ${interaction.user.tag} | ` + 'Сервер ' + interaction.guild.name, iconURL: interaction.user.displayAvatarURL() });
        const AppelButton = new ButtonBuilder().setCustomId(customId).setLabel('ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤОбжаловатьㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ').setStyle(ButtonStyle.Primary);
        const embed = new EmbedBuilder().setColor(color).setDescription(description || badDescription)
        if (badDescription) {
            await interaction.editReply({ embeds: [embed] }) && client.channels.cache.get(StaffChats.Logs).send({ embeds: [embed.setTitle(`**Команда: ${CommandsLogsID.Ban}**`).setFields(fields)] })
        }
        if (description) {
            await interaction.editReply({ embeds: [embed] }) && client.channels.cache.get(StaffChats.Logs).send({ embeds: [embed.setFooter({ text: `Выполнил(а) ${interaction.user.tag}  | ${interaction.user.id}`, iconURL: interaction.user.displayAvatarURL() })] }) && await getUser.user.send({ embeds: [embedAppel.setTitle(`[${HistoryEmojis.Ban}] Вы получили бан ${time}`)], components: [new ActionRowBuilder().addComponents(AppelButton)] });
        }
    }
}