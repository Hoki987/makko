//===========================================/ Import the modeles \===========================================\\
const { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
//==========< OTHERS >==========\\
const { Utility, StaffRoles, StaffChats, OwnerId, CommandsLogsID } = require('../../../config.js');
const History = require('../../Structures/Models/History.js');
const { countStaff, findOneDB } = require('../../Structures/Untils/Functions/actionDB.js');
const { Op } = require('sequelize');
//===========================================< Code >===========================================\\
module.exports = {
    data: new SlashCommandBuilder()
        .setName("unwarn")
        .setDescription("Снимает варн")
        .setDMPermission(false)
        .addUserOption((target) => target.setName("пользователь").setDescription("Выбери пользователя").setRequired(true)),

    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */

    async execute(client, interaction) {
        const getUser = interaction.options.get('пользователь');

        const isAssistant = interaction.channel.id === StaffChats.Assistant
        const isControl = interaction.channel.id === StaffChats.Control

        const memberPosition = interaction.member.roles.cache.filter(r => Object.values(StaffRoles).includes(r.id))?.sort((a, b) => b.position - a.position)?.first()?.position || 1;
        const targetPosition = getUser.member.roles.cache.filter(r => Object.values(StaffRoles).includes(r.id))?.sort((a, b) => b.position - a.position)?.first()?.position || 0;

        const hasRoleExecutor = (id) => interaction.member.roles.cache.has(id);

        const text = {
            standart: `У пользователя <@${getUser.user.id}> был **снят** варн`,
            badTwo: `\`\`\`Недостаточно прав!\`\`\``,
            badThree: `\`\`\`У пользователя нет варна!\`\`\``,
        }
        const field = {
            Bad: [{ name: "```   Субъект   ```", value: `<@${interaction.user.id}>`, inline: true }, { name: "```   Объект   ```", value: `<@${getUser.user.id}>`, inline: true }],
        }

        let color;
        let fields;
        let staffSheet;

        let description;
        let badDescription;


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
        const lastWarn = await findOneDB(getUser.user.id, 'Warn', { [Op.gt]: new Date() })
        switch (true) {
            case staffSheet === undefined:
            case interaction.user.id === getUser.member.id:
            case getUser.user.bot:
            case memberPosition <= targetPosition && ![OwnerId.hoki].includes(interaction.user.id):
            case await countStaff(interaction.user.id) === 0 && !hasRoleExecutor(StaffRoles.Admin || StaffRoles.Developer || StaffRoles.Moderator) && ![OwnerId.hoki].includes(interaction.user.id):
                badDescription = text.badTwo;
                fields = field.Bad
                color = Utility.colorDiscord;
                break;
            case lastWarn === null:
                badDescription = text.badThree
                color = Utility.colorRed
                fields = field.Bad
                break;
            default:
                switch (staffSheet) {
                    case 0:
                    case 1162940648:
                        switch (true) {
                            case hasRoleExecutor(StaffRoles.Admin || StaffRoles.Developer || StaffRoles.Moderator):
                            case [OwnerId.hoki].includes(interaction.user.id):
                            case await countStaff(interaction.user.id) != 0:
                                description = text.standart
                                color = Utility.colorGreen
                                if (lastWarn) {
                                    await History.update({ expiresAt: lastWarn.createdAt.getTime() }, { where: { id: lastWarn.id } })
                                } else {
                                    badDescription = text.badThree
                                    color = Utility.colorRed
                                    fields = field.Bad
                                }
                                break;
                            default:
                                badDescription = text.badTwo;
                                fields = field.Bad
                                color = Utility.colorDiscord;
                                break;
                        }
                        break;
                    case null:
                        switch (true) {
                            case hasRoleExecutor(StaffRoles.Admin || StaffRoles.Developer || StaffRoles.Moderator):
                            case [OwnerId.hoki].includes(interaction.user.id):
                                description = text.standart
                                color = Utility.colorGreen
                                if (lastWarn) {
                                    await History.update({ expiresAt: lastWarn.createdAt.getTime() }, { where: { id: lastWarn.id } })
                                } else {
                                    badDescription = text.badThree
                                    color = Utility.colorRed
                                    fields = field.Bad
                                }
                            default:
                                badDescription = text.badTwo;
                                fields = field.Bad
                                color = Utility.colorDiscord;
                                break;
                        }
                        break;
                }
                break;
        }
        const embedDM = new EmbedBuilder().setDescription(`С вас сняли варн!`).setColor(Utility.colorGreen).setFooter({ text: `Выполнил(а) ${interaction.user.tag} | ` + 'Сервер ' + interaction.guild.name, iconURL: interaction.user.displayAvatarURL() });
        const embed = new EmbedBuilder().setColor(color).setDescription(description || badDescription)
        if (badDescription) {
            await interaction.editReply({ embeds: [embed] }) && client.channels.cache.get(StaffChats.Logs).send({ embeds: [embed.setTitle(`**Команда: ${CommandsLogsID.Ban}**`).setFields(fields)] })
        }
        if (description) {
            await interaction.editReply({ embeds: [embed] }) && client.channels.cache.get(StaffChats.Logs).send({ embeds: [embed.setFooter({ text: `Выполнил(а) ${interaction.user.tag}  | ${interaction.user.id}`, iconURL: interaction.user.displayAvatarURL() })] }) && await getUser.user.send({ embeds: [embedDM] });
        }
    }
}