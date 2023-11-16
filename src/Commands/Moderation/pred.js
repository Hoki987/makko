//===========================================/ Import the modeles \===========================================\\
const { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
//==========< OTHERS >==========\\
const { WorkRoles, Utility, StaffRoles, StaffChats, HistoryEmojis, OwnerId, CommandsLogsID } = require('../../../config.js');
const History = require('../../Structures/Models/History.js');
const { action } = require('../../Structures/Untils/Functions/action.js');
const { createDB, countStaff } = require('../../Structures/Untils/Functions/actionDB.js');
const { Op } = require('sequelize');
//===========================================< Code >===========================================\\
module.exports = {
    data: new SlashCommandBuilder()
        .setName("pred")
        .setDescription("Выдает предупреждение")
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
        let customId;

        let description;
        let badDescription;

        const text = {
            standart: `**[${HistoryEmojis.Pred}] Пользователю <@${getUser.user.id}> было выдано <@&${WorkRoles.Pred}>\n\`\`\`ansi\n[2;35m[2;30m[2;35mПричина:[0m[2;30m[0m[2;35m[0m [2;36m${getReason}[0m\`\`\`**`,
            badOne: `**[${HistoryEmojis.Pred}] Пользователю <@${getUser.user.id}> не было выдано <@&${WorkRoles.Pred}>\n\`\`\`ansi\n[2;35m[2;30m[2;35mПричина:[0m[2;30m[0m[2;35m[0m [2;36mуже имеется предупреждение[0m\`\`\`**`,
            badTwo: `\`\`\`Недостаточно прав!\`\`\``,
            badThree: `**[${HistoryEmojis.Pred}] Активные записи отсутствуют! Предупреждение будет снято.**`,
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
            case hasRole(WorkRoles.Pred) && await countStaff(interaction.user.id) === 0 && !hasRoleExecutor(StaffRoles.Admin || StaffRoles.Developer || StaffRoles.Moderator) && ![OwnerId.hoki].includes(interaction.user.id):
                badDescription = text.badTwo;
                fields = field.Bad
                color = Utility.colorDiscord;
                break;
            case hasRole(WorkRoles.Pred):
                const activePred = await History.findOne({ where: { target: getUser.user.id, type: 'Pred', expiresAt: { [Op.gt]: new Date() }, } })
                if (activePred) {
                    badDescription = text.badOne
                    fields = field.Bad
                    color = Utility.colorDiscord;
                } else {
                    badDescription = text.badThree
                    color = Utility.colorRed
                    fields = field.Bad
                    await getUser.member.roles.remove(WorkRoles.Pred)
                }
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
                                await createDB(interaction.user.id, getUser.user.id, getReason, 'Pred', new Date(Date.now() + 86400000))
                                await getUser.member.roles.add(WorkRoles.Pred)
                                break;
                            case await countStaff(interaction.user.id) != 0:
                                action(staffSheet, interaction.user.id, 8)
                                description = text.standart
                                color = Utility.colorDiscord
                                await createDB(interaction.user.id, getUser.user.id, getReason, 'Pred', new Date(Date.now() + 86400000))
                                await getUser.member.roles.add(WorkRoles.Pred)
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
                                await createDB(interaction.user.id, getUser.user.id, getReason, 'Pred', new Date(Date.now() + 86400000))
                                await getUser.member.roles.add(WorkRoles.Pred)
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
        const embedAppel = new EmbedBuilder().setDescription(text.Appel).setColor(Utility.colorDiscord).setFooter({ text: `Выполнил(а) ${interaction.user.tag} | ` + 'Сервер ' + interaction.guild.name, iconURL: interaction.user.displayAvatarURL() });
        const AppelButton = new ButtonBuilder().setCustomId(customId).setLabel('ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤОбжаловатьㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ').setStyle(ButtonStyle.Primary);
        const embed = new EmbedBuilder().setColor(color).setDescription(description || badDescription)
        if (badDescription) {
            await interaction.editReply({ embeds: [embed] }) && client.channels.cache.get(StaffChats.Logs).send({ embeds: [embed.setTitle(`**Команда: ${CommandsLogsID.Pred}**`).setFields(fields)] })
        }
        if (description) {
            await interaction.editReply({ embeds: [embed] }) && client.channels.cache.get(StaffChats.Logs).send({ embeds: [embed.setFooter({ text: `Выполнил(а) ${interaction.user.tag}  | ${interaction.user.id}`, iconURL: interaction.user.displayAvatarURL() })] }) && await getUser.user.send({ embeds: [embedAppel.setTitle(`[${HistoryEmojis.Pred}] Вы получили предупреждение на 24 часа`)], components: [new ActionRowBuilder().addComponents(AppelButton)] });
        }
    }
}