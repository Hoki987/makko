//===========================================/ Import the modeles \===========================================\\
const { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
//==========< OTHERS >==========\\
const { WorkRoles, Utility, StaffRoles, StaffChats, HistoryEmojis, OwnerId, CommandsLogsID } = require('../../../config.js');
const { createDB, countStaff } = require('../../Structures/Untils/Functions/actionDB.js');
const { Op } = require('sequelize');
const History = require('../../Structures/Models/History.js');
//===========================================< Code >===========================================\\
module.exports = {
    data: new SlashCommandBuilder()
        .setName("bancam")
        .setDescription("Причины для выдачи: 3.2 | 3.4 | 3.12 | 4.3")
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

        const text = {
            standart: `**[${HistoryEmojis.BanCam}] Пользователю <@${getUser.user.id}> был выдан <@&${WorkRoles.BanCam}> на 14 дней\n\`\`\`ansi\n[2;35m[2;30m[2;35mПричина:[0m[2;30m[0m[2;35m[0m [2;36m${getReason}[0m\`\`\`**`,
            badOne: `**[${HistoryEmojis.BanCam}] Пользователю <@${getUser.user.id}> не было выдано <@&${WorkRoles.BanCam}>\n\`\`\`ansi\n[2;35m[2;30m[2;35mПричина:[0m[2;30m[0m[2;35m[0m [2;36mуже имеется banCam[0m\`\`\`**`,
            badTwo: `\`\`\`Недостаточно прав!\`\`\``,
            badThree: `**[${HistoryEmojis.BanCam}] Активные записи отсутствуют! BanCam будет снят.**`,
            Appel: `\`\`\`ansi\n[2;35m[2;30m[2;35mПричина:[0m[2;30m[0m[2;35m[0m [2;36m${getReason}[0m\`\`\``
        }
        const field = {
            Bad: [{ name: "```   Субъект   ```", value: `<@${interaction.user.id}>`, inline: true }, { name: "```   Объект   ```", value: `<@${getUser.user.id}>`, inline: true }],
        }
        await interaction.deferReply()
        switch (true) {
            case isControl:
                staffSheet = 1162940648
                break;
            case isAssistant:
                staffSheet = 0
                break;
            case hasRoleExecutor(StaffRoles.Admin || StaffRoles.Developer || StaffRoles.Moderator) || [OwnerId.hoki].includes(interaction.user.id):
                staffSheet = null
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
            case hasRole(WorkRoles.BanCam) && await countStaff(interaction.user.id) === 0 && !hasRoleExecutor(StaffRoles.Admin || StaffRoles.Developer || StaffRoles.Moderator) && ![OwnerId.hoki].includes(interaction.user.id):
                badDescription = text.badTwo;
                fields = field.Bad
                color = Utility.colorDiscord;
                break;
            case hasRole(WorkRoles.BanCam):
                const activeBanCam = await History.findOne({ where: { target: getUser.user.id, type: 'BanCam', expiresAt: { [Op.gt]: new Date() }, } })
                if (activeBanCam) {
                    badDescription = text.badOne
                    fields = field.Bad
                    color = Utility.colorDiscord;
                } else {
                    badDescription = text.badThree
                    color = Utility.colorRed
                    fields = field.Bad
                    await getUser.member.roles.remove(WorkRoles.BanCam)
                }
                break;
            default:
                switch (staffSheet) {
                    case 0:
                    case 1162940648:
                    case null:
                        switch (true) {
                            case hasRoleExecutor(StaffRoles.Admin || StaffRoles.Developer || StaffRoles.Moderator):
                            case [OwnerId.hoki].includes(interaction.user.id):
                            case await countStaff(interaction.user.id) != 0:
                                description = text.standart
                                color = Utility.colorDiscord
                                await createDB(interaction.user.id, getUser.user.id, getReason, 'BanCam', new Date(Date.now() + 1209600000))
                                await getUser.member.roles.add(WorkRoles.BanCam)
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
        const embed = new EmbedBuilder().setColor(color).setDescription(description || badDescription)
        if (badDescription) {
            await interaction.editReply({ embeds: [embed] }) && client.channels.cache.get(StaffChats.Logs).send({ embeds: [embed.setTitle(`**Команда: ${CommandsLogsID.BanCam}**`).setFields(fields)] })
        }
        if (description) {
            await interaction.editReply({ embeds: [embed] }) && client.channels.cache.get(StaffChats.Logs).send({ embeds: [embed.setFooter({ text: `Выполнил(а) ${interaction.user.tag}  | ${interaction.user.id}`, iconURL: interaction.user.displayAvatarURL() })] }) && await getUser.user.send({ embeds: [embedAppel.setTitle(`[${HistoryEmojis.BanCam}] Вы получили BanCam на 14 дней`)] });
        }
    }
}