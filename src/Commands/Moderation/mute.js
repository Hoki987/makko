//===========================================/ Import the modeles \===========================================\\
const { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

//==========< OTHERS >==========\\
const color = require('colors');
const { WorkRoles, Utility, StaffRoles, StaffChats, HistoryEmojis, OwnerId, CommandsLogsID } = require('../../../config.js');
const History = require('../../Structures/Models/History.js');
const { fetchStaff } = require('../../Structures/Untils/Functions/fetchStaff.js');
const { action, MuteWarnBan } = require('../../Structures/Untils/Functions/action.js');
const { createDB, countDB } = require('../../Structures/Untils/Functions/actionDB.js');
const { Op } = require('sequelize');
//===========================================< Code >===========================================\\
module.exports = {
    data: new SlashCommandBuilder()
        .setName("mute")
        .setDescription("Забирает возможность к общению")
        .setDMPermission(false)
        .addUserOption((target) => target.setName('пользователь').setDescription("Выбери пользователя").setRequired(true))
        .addIntegerOption((time) => time.setName('время').setDescription('Укажи время').setRequired(true).addChoices(
            { name: '30 минут', value: 30 },
            { name: '45 минут', value: 45 },
            { name: '60 минут', value: 60 },
            { name: '75 минут', value: 75 },
            { name: '90 минут', value: 90 },
        ))
        .addStringOption((reason) => reason.setName('причина').setDescription('Напиши причину предупреждения').setRequired(true)),

    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */

    async execute(client, interaction) {



        const isAssistant = interaction.channel.id === StaffChats.Assistant
        const isControl = interaction.channel.id === StaffChats.Control

        const getUser = interaction.options.get('пользователь');
        const getTime = interaction.options.get('время');
        const getReason = interaction.options.getString('причина');
        const hasRoleExecutor = (id) => interaction.member.roles.cache.has(id);
        const hasRole = (id) => getUser.member.roles.cache.has(id);

        const memberPosition = interaction.member.roles.cache.filter(r => Object.values(StaffRoles).includes(r.id))?.sort((a, b) => b.position - a.position)?.first()?.position || 1;
        const targetPosition = getUser.member.roles.cache.filter(r => Object.values(StaffRoles).includes(r.id))?.sort((a, b) => b.position - a.position)?.first()?.position || 0;



        let description;
        let badDescription;
        let ComplexDescription;
        let fields;
        let color;
        let time;
        let staffSheet;
        let customId;


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

        const countActiveMute = await History.count({ where: { target: getUser.user.id, type: 'Mute', createdAt: { [Op.gt]: new Date(new Date().getTime() - 864000000), } } })
        const countActiveWarn = History.count({ where: { target: getUser.user.id, type: 'Warn', expiresAt: { [Op.lt]: new Date() } } })

        const Mute = await History.create({ executor: interaction.user.id, target: getUser.user.id, reason: getReason, type: 'Mute', expiresAt: new Date(Date.now() + time), })
        const Warn = await History.create({ executor: interaction.user.id, target: getUser.user.id, reason: getReason, type: 'Warn', expiresAt: new Date(Date.now() + 1209600000), })
        const Ban = await History.create({ executor: interaction.user.id, target: getUser.user.id, reason: getReason, type: 'Ban', expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), })

        console.log(staffSheet);
        console.log(await fetchStaff(staffSheet, interaction.user.id));
        console.log(hasRoleExecutor(StaffRoles.Admin || StaffRoles.Developer || StaffRoles.Moderator));
        console.log([OwnerId.hoki].includes(interaction.user.id));

        switch (true) {
            case getTime.value === 30:
                time = getTime.value * 60000
                break;
            case getTime.value === 45:
                time = getTime.value * 60000
                break;
            case getTime.value === 60:
                time = getTime.value * 60000
                break;
            case getTime.value === 75:
                time = getTime.value * 60000
                break;
            case getTime.value === 90:
                time = getTime.value * 60000
                break;
        }
        switch (true) {
            case staffSheet === undefined:
            case interaction.user.id === getUser.member.id:
            case getUser.user.bot:
            case memberPosition <= targetPosition:
                badDescription = `\`\`\`Недостаточно прав!\`\`\``;
                fields = { name: `   Субъект   `, value: interaction.user.id, inline: true }, { name: `   Объект   `, value: getUser.user.id, inline: true }
                color = Utility.colorDiscord;
                break;
            case hasRole(WorkRoles.Mute):
                badDescription = `**[${HistoryEmojis.Mute}] Пользователю <@${getUser.user.id}> не был выдан <@&${WorkRoles.Mute}>\n\`\`\`ansi\n[2;35m[2;30m[2;35mПричина:[0m[2;30m[0m[2;35m[0m [2;36mуже имеется мут[0m\`\`\`**`
                color = Utility.colorDiscord;
                break;
            default:

                // description = `**[${HistoryEmojis.Mute}] Пользователю <@${getUser.user.id}> был выдан <@&${WorkRoles.Mute}> на ${getTime.name}\n\`\`\`ansi\n[2;35m[2;30m[2;35mПричина:[0m[2;30m[0m[2;35m[0m [2;36${getReason}[0m\`\`\`**`
                // color = Utility.colorYellow
                switch (true) {
                    case await countDB(getUser.user.id, 'Mute', { [Op.gt]: new Date(new Date().getTime() - 864000000), }) >= 2:
                        switch (staffSheet) {
                            case 0:
                                switch (true) {
                                    case hasRoleExecutor(StaffRoles.Admin || StaffRoles.Developer || StaffRoles.Moderator):
                                    case [OwnerId.hoki].includes(interaction.user.id):
                                        if (await countDB(getUser.user.id, 'Warn', undefined, { [Op.lt]: new Date() }) >= 2) {
                                            Mute, Warn, Ban
                                            ComplexDescription = `**[${HistoryEmojis.Mute} | ${HistoryEmojis.Warn}  | ${HistoryEmojis.Ban} ]** **Пользователю ${getUser.user.id} был выдан:**`
                                            fields = { name: "```      Мут      ```", value: `Причина: ${getReason}\nВремя: ${time}`, inline: true }, { name: `      Варн      `, value: `Причина: 4.3\nВремя: 14 дней`, inline: true }, { name: `      Бан      `, value: `Причина: 4.3\nВремя: 30 дней`, inline: true }
                                        } else {
                                            Mute, Warn
                                            ComplexDescription = `**[${HistoryEmojis.Mute} | ${HistoryEmojis.Warn}]** **Пользователю ${getUser.user.id} был выдан:**`
                                            fields = { name: "```      Мут      ```", value: `Причина: ${getReason}\nВремя: ${time}`, inline: true }, { name: `      Варн      `, value: `Причина: 4.3\nВремя: 14 дней`, inline: true }
                                        }
                                        break;
                                    case await fetchStaff(staffSheet, interaction.user.id) === true:
                                        if (countActiveWarn >= 2) {
                                            await MuteWarnBan(staffSheet, interaction.user.id, true)
                                            Mute, Warn, Ban
                                            ComplexDescription = `**[${HistoryEmojis.Mute} | ${HistoryEmojis.Warn}  | ${HistoryEmojis.Ban} ]** **Пользователю ${getUser.user.id} был выдан:**`
                                            fields = { name: "```      Мут      ```", value: `Причина: ${getReason}\nВремя: ${time}`, inline: true }, { name: `      Варн      `, value: `Причина: 4.3\nВремя: 14 дней`, inline: true }, { name: `      Бан      `, value: `Причина: 4.3\nВремя: 30 дней`, inline: true }
                                        } else {
                                            await MuteWarnBan(staffSheet, interaction.user.id, false)
                                            Mute, Warn
                                            ComplexDescription = `**[${HistoryEmojis.Mute} | ${HistoryEmojis.Warn}]** **Пользователю ${getUser.user.id} был выдан:**`
                                            fields = { name: "```      Мут      ```", value: `Причина: ${getReason}\nВремя: ${time}`, inline: true }, { name: `      Варн      `, value: `Причина: 4.3\nВремя: 14 дней`, inline: true }
                                        }
                                        break;
                                    default:
                                        fields = { name: `   Субъект   `, value: interaction.user.id, inline: true }, { name: `   Объект   `, value: getUser.user.id, inline: true }
                                        badDescription = `\`\`\`Недостаточно прав!\`\`\``;
                                        color = Utility.colorDiscord;
                                        break;
                                }
                                break;
                            case 1162940648:
                                switch (true) {
                                    case hasRoleExecutor(StaffRoles.Admin || StaffRoles.Developer || StaffRoles.Moderator):
                                    case [OwnerId.hoki].includes(interaction.user.id):
                                        console.log('1');
                                        if (countActiveWarn >= 2) {
                                            Mute, Warn, Ban
                                            ComplexDescription = `**[${HistoryEmojis.Mute} | ${HistoryEmojis.Warn}  | ${HistoryEmojis.Ban} ]** **Пользователю ${getUser.user.id} был выдан:**`
                                            fields = { name: "```      Мут      ```", value: `Причина: ${getReason}\nВремя: ${time}`, inline: true }, { name: `      Варн      `, value: `Причина: 4.3\nВремя: 14 дней`, inline: true }, { name: `      Бан      `, value: `Причина: 4.3\nВремя: 30 дней`, inline: true }
                                        } else {
                                            Mute, Warn
                                            ComplexDescription = `**[${HistoryEmojis.Mute} | ${HistoryEmojis.Warn}]** **Пользователю ${getUser.user.id} был выдан:**`
                                            fields = { name: "```      Мут      ```", value: `Причина: ${getReason}\nВремя: ${time}`, inline: true }, { name: `      Варн      `, value: `Причина: 4.3\nВремя: 14 дней`, inline: true }
                                        }
                                        break;
                                    case await fetchStaff(staffSheet, interaction.user.id) === true:
                                        console.log('2');
                                        if (countActiveWarn >= 2) {
                                            await MuteWarnBan(staffSheet, interaction.user.id, true)
                                            Mute, Warn, Ban
                                            ComplexDescription = `**[${HistoryEmojis.Mute} | ${HistoryEmojis.Warn}  | ${HistoryEmojis.Ban} ]** **Пользователю ${getUser.user.id} был выдан:**`
                                            fields = { name: "```      Мут      ```", value: `Причина: ${getReason}\nВремя: ${time}`, inline: true }, { name: `      Варн      `, value: `Причина: 4.3\nВремя: 14 дней`, inline: true }, { name: `      Бан      `, value: `Причина: 4.3\nВремя: 30 дней`, inline: true }
                                        } else {
                                            await MuteWarnBan(staffSheet, interaction.user.id, false)
                                            Mute, Warn
                                            ComplexDescription = `**[${HistoryEmojis.Mute} | ${HistoryEmojis.Warn}]** **Пользователю ${getUser.user.id} был выдан:**`
                                            fields = { name: "```      Мут      ```", value: `Причина: ${getReason}\nВремя: ${time}`, inline: true }, { name: `      Варн      `, value: `Причина: 4.3\nВремя: 14 дней`, inline: true }
                                        }
                                        break;
                                    default:
                                        fields = { name: `   Субъект   `, value: interaction.user.id, inline: true }, { name: `   Объект   `, value: getUser.user.id, inline: true }
                                        badDescription = `\`\`\`Недостаточно прав!\`\`\``;
                                        color = Utility.colorDiscord;
                                        break;
                                }
                                break;
                            case null:
                                switch (true) {
                                    case hasRoleExecutor(StaffRoles.Admin || StaffRoles.Developer || StaffRoles.Moderator):
                                    case [OwnerId.hoki].includes(interaction.user.id):
                                        if (countActiveWarn >= 2) {
                                            Mute, Warn, Ban
                                            ComplexDescription = `**[${HistoryEmojis.Mute} | ${HistoryEmojis.Warn}  | ${HistoryEmojis.Ban} ]** **Пользователю ${getUser.user.id} был выдан:**`
                                            fields = { name: "```      Мут      ```", value: `Причина: ${getReason}\nВремя: ${time}`, inline: true }, { name: `      Варн      `, value: `Причина: 4.3\nВремя: 14 дней`, inline: true }, { name: `      Бан      `, value: `Причина: 4.3\nВремя: 30 дней`, inline: true }
                                        } else {
                                            Mute, Warn
                                            ComplexDescription = `**[${HistoryEmojis.Mute} | ${HistoryEmojis.Warn}]** **Пользователю ${getUser.user.id} был выдан:**`
                                            fields = { name: "```      Мут      ```", value: `Причина: ${getReason}\nВремя: ${time}`, inline: true }, { name: `      Варн      `, value: `Причина: 4.3\nВремя: 14 дней`, inline: true }
                                        }
                                        break;
                                    default:
                                        fields = { name: `   Субъект   `, value: interaction.user.id, inline: true }, { name: `   Объект   `, value: getUser.user.id, inline: true }
                                        badDescription = `\`\`\`Недостаточно прав!\`\`\``;
                                        color = Utility.colorDiscord;
                                        break;
                                }
                                break;
                        }
                        break;
                    default:
                        switch (staffSheet) {
                            case 0:
                                switch (true) {
                                    case hasRoleExecutor(StaffRoles.Admin || StaffRoles.Developer || StaffRoles.Moderator):
                                        description = `**[${HistoryEmojis.Mute}] Пользователю <@${getUser.user.id}> был выдан <@&${WorkRoles.Mute}> на ${getTime.name}\n\`\`\`ansi\n[2;35m[2;30m[2;35mПричина:[0m[2;30m[0m[2;35m[0m [2;36${getReason}[0m\`\`\`**`
                                        color = Utility.colorDiscord
                                        Mute
                                        getUser.member.roles.add(WorkRoles.Mute)

                                        break;
                                    case await fetchStaff(staffSheet, interaction.user.id) === true:
                                        await action(staffSheet, interaction.user.id, 7)
                                        description = `**[${HistoryEmojis.Mute}] Пользователю <@${getUser.user.id}> был выдан <@&${WorkRoles.Mute}> на ${getTime.name}\n\`\`\`ansi\n[2;35m[2;30m[2;35mПричина:[0m[2;30m[0m[2;35m[0m [2;36${getReason}[0m\`\`\`**`
                                        color = Utility.colorDiscord
                                        Mute
                                        getUser.member.roles.add(WorkRoles.Mute)
                                        break;
                                    default:
                                        fields = { name: `   Субъект   `, value: interaction.user.id, inline: true }, { name: `   Объект   `, value: getUser.user.id, inline: true }
                                        badDescription = `\`\`\`Недостаточно прав!\`\`\``;
                                        color = Utility.colorDiscord;
                                        break;
                                }
                                break;
                            case 1162940648:
                                switch (true) {
                                    case hasRoleExecutor(StaffRoles.Admin || StaffRoles.Developer || StaffRoles.Moderator):
                                        description = `**[${HistoryEmojis.Mute}] Пользователю <@${getUser.user.id}> был выдан <@&${WorkRoles.Mute}> на ${getTime.name}\n\`\`\`ansi\n[2;35m[2;30m[2;35mПричина:[0m[2;30m[0m[2;35m[0m [2;36${getReason}[0m\`\`\`**`
                                        color = Utility.colorDiscord
                                        Mute
                                        getUser.member.roles.add(WorkRoles.Mute)
                                        break;
                                    case await fetchStaff(staffSheet, interaction.user.id) === true:
                                        await action(staffSheet, interaction.user.id, 7)
                                        description = `**[${HistoryEmojis.Mute}] Пользователю <@${getUser.user.id}> был выдан <@&${WorkRoles.Mute}> на ${getTime.name}\n\`\`\`ansi\n[2;35m[2;30m[2;35mПричина:[0m[2;30m[0m[2;35m[0m [2;36${getReason}[0m\`\`\`**`
                                        color = Utility.colorDiscord
                                        Mute
                                        getUser.member.roles.add(WorkRoles.Mute)
                                        break;
                                    default:
                                        fields = { name: `   Субъект   `, value: interaction.user.id, inline: true }, { name: `   Объект   `, value: getUser.user.id, inline: true }
                                        badDescription = `\`\`\`Недостаточно прав!\`\`\``;
                                        color = Utility.colorDiscord;
                                        break;
                                }
                                break;
                            case null:
                                switch (true) {
                                    case hasRoleExecutor(StaffRoles.Admin || StaffRoles.Developer || StaffRoles.Moderator):
                                        description = `**[${HistoryEmojis.Mute}] Пользователю <@${getUser.user.id}> был выдан <@&${WorkRoles.Mute}> на ${getTime.name}\n\`\`\`ansi\n[2;35m[2;30m[2;35mПричина:[0m[2;30m[0m[2;35m[0m [2;36${getReason}[0m\`\`\`**`
                                        color = Utility.colorDiscord
                                        Mute
                                        getUser.member.roles.add(WorkRoles.Mute)
                                        await interaction.user.send({ embeds: [], components: [] })
                                        break;
                                    default:
                                        badDescription = `\`\`\`Недостаточно прав!\`\`\``;
                                        fields = { name: `   Субъект   `, value: interaction.user.id, inline: true }, { name: `   Объект   `, value: getUser.user.id, inline: true }
                                        color = Utility.colorDiscord;
                                        break;
                                }
                                break;
                        }
                        break;
                }
                break;
        }
        const embedAppel = new EmbedBuilder().setTitle(`[${HistoryEmojis.Pred}] Вы получили мут на ${time} минут`).setDescription(`\`\`\`ansi\n[2;35m[2;30m[2;35mПричина:[0m[2;30m[0m[2;35m[0m [2;36m${getReason}[0m\`\`\` \n${Utility.pointEmoji} Если хотите оспорить наказание, нажмите **на кнопку ниже.**\n${Utility.pointEmoji} Имейте ввиду, что для быстрого решения вопроса вам лучше \n${Utility.fonEmoji} иметь **доказательства** свой невиновности.\n${Utility.pointEmoji} Если ваше обжалование будет сформировано неадекватно,\n ${Utility.fonEmoji} **оно будет закрыто.**`).setColor(Utility.colorDiscord).setFooter({ text: `Выполнил(а) ${interaction.user.tag} | ` + 'Сервер ' + interaction.guild.name, iconURL: interaction.user.displayAvatarURL() });
        const AppelButton = new ButtonBuilder().setCustomId(customId).setLabel('ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤОбжаловатьㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ').setStyle(ButtonStyle.Primary);
        console.log(color);
        console.log(description);
        console.log(badDescription);
        console.log(ComplexDescription);
        console.log(fields);
        const embed = new EmbedBuilder().setColor(color).setDescription(description || ComplexDescription || badDescription)
        switch (true) {
            case badDescription:
                await interaction.editReply({ embeds: [embed] }) && client.channels.cache.get(StaffChats.Logs).send({ embeds: [embed.setTitle(`**Команда: ${CommandsLogsID.Mute}**`).setFields(fields)] })
                break;
            case description:
                await interaction.editReply({ embeds: [embed] }) && client.channels.cache.get(StaffChats.Logs).send({ embeds: [embed] }) && await getUser.user.send({ embeds: [embedAppel], components: [new ActionRowBuilder().addComponents(AppelButton)] });
                break;
            case ComplexDescription:
                await interaction.editReply({ embeds: [embed] })
                break;
        }
    }
}