//===========================================/ Import the modeles \===========================================\\
const { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
//==========< OTHERS >==========\\
const { WorkRoles, Utility, StaffRoles, StaffChats, OwnerId, CommandsLogsID } = require('../../../config.js');
const History = require('../../Structures/Models/History.js');
const { countStaff, findOneDB } = require('../../Structures/Untils/Functions/actionDB.js');
const { Op } = require('sequelize');
//===========================================< Code >===========================================\\
module.exports = {
    data: new SlashCommandBuilder()
        .setName("unban")
        .setDescription('Снимает бан пользователю')
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
        const hasRole = (id) => getUser.member.roles.cache.has(id);

        const text = {
            standart: `Пользователь <@${getUser.user.id}> был **разбанен**`,
            badTwo: `\`\`\`Недостаточно прав!\`\`\``,
            badThree: `\`\`\`У пользователя нет бана!\`\`\``,
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
            case !hasRole(WorkRoles.Ban):
                badDescription = text.badThree
                color = Utility.colorRed
                fields = field.Bad
                break;
            default:
                const lastNullBan = await findOneDB(getUser.user.id, 'Ban', null)
                const lastBan = await findOneDB(getUser.user.id, 'Ban', { [Op.gt]: new Date() })
                console.log(lastNullBan);
                console.log(lastBan);
                switch (staffSheet) {
                    case 0:
                    case 1162940648:
                        switch (true) {
                            case hasRoleExecutor(StaffRoles.Admin || StaffRoles.Developer || StaffRoles.Moderator):
                            case [OwnerId.hoki].includes(interaction.user.id):
                            case await countStaff(interaction.user.id) != 0:
                                switch (true) {
                                    case lastBan != null:
                                        description = text.standart
                                        color = Utility.colorGreen
                                        await History.update({ expiresAt: lastBan.createdAt.getTime() }, { where: { id: lastBan.id } })
                                        await getUser.member.roles.remove(WorkRoles.Ban)
                                        break;
                                    case lastNullBan === null:
                                        description = text.standart
                                        color = Utility.colorGreen
                                        await History.update({ expiresAt: lastNullBan.createdAt }, { where: { id: lastNullBan.id } })
                                        await getUser.member.roles.remove(WorkRoles.Ban)
                                        break;
                                    default:
                                        badDescription = text.badThree
                                        color = Utility.colorRed
                                        fields = field.Bad
                                        break;
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
                                switch (true) {
                                    case lastBan != null:
                                        description = text.standart
                                        color = Utility.colorGreen
                                        await History.update({ expiresAt: lastBan.createdAt.getTime() }, { where: { id: lastBan.id } })
                                        await getUser.member.roles.remove(WorkRoles.Ban)
                                        break;
                                    case lastNullBan === null:
                                        description = text.standart
                                        color = Utility.colorGreen
                                        await History.update({ expiresAt: lastNullBan.createdAt }, { where: { id: lastNullBan.id } })
                                        await getUser.member.roles.remove(WorkRoles.Ban)
                                        break;
                                    default:
                                        badDescription = text.badThree
                                        color = Utility.colorRed
                                        fields = field.Bad
                                        break;
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
        const embedDM = new EmbedBuilder().setDescription(`Вы были разбанены!`).setColor(Utility.colorGreen).setFooter({ text: `Выполнил(а) ${interaction.user.tag} | ` + 'Сервер ' + interaction.guild.name, iconURL: interaction.user.displayAvatarURL() });
        const embed = new EmbedBuilder().setColor(color).setDescription(description || badDescription)
        if (badDescription) {
            await interaction.editReply({ embeds: [embed] }) && client.channels.cache.get(StaffChats.Logs).send({ embeds: [embed.setTitle(`**Команда: ${CommandsLogsID.Ban}**`).setFields(fields)] })
        }
        if (description) {
            await interaction.editReply({ embeds: [embed] }) && client.channels.cache.get(StaffChats.Logs).send({ embeds: [embed.setFooter({ text: `Выполнил(а) ${interaction.user.tag}  | ${interaction.user.id}`, iconURL: interaction.user.displayAvatarURL() })] }) && await getUser.user.send({ embeds: [embedDM] });
        }
    }
}