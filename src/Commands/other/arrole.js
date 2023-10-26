//===========================================/ Import the modeles \===========================================\\
const { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

//==========< OTHERS >==========\\
const { Utility, StaffChats, StaffRoles } = require('../../../config.js');
//===========================================< Code >===========================================\\
module.exports = {
    data: new SlashCommandBuilder()
        .setName("arrole")
        .setDescription("Меняет гендер пользователю")
        .setDMPermission(false)
        .addRoleOption((role) => role.setName('роль').setDescription("Выбери роль").setRequired(true))
        .addUserOption((target) => target.setName('пользователь').setDescription("Выбери пользователя")),

    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */

    async execute(client, interaction) {
        const getUser = interaction.options.get('пользователь');
        const getRole = interaction.options.getRole('роль').id;
        const hasRole = (id) => getUser.member.roles.cache.has(id);

        const memberHighestRole = interaction.member.roles.highest.id
        const memberHighestPositon = interaction.member.roles.cache.filter(r => memberHighestRole.includes(r.id))?.sort((a, b) => b.position - a.position)?.first()?.position || 1;
        const rolePosition = interaction.member.roles.cache.filter(r => getRole.includes(r.id))?.sort((a, b) => b.position - a.position)?.first()?.position || 0;

        let description;
        let badDescription
        let color;

        await interaction.deferReply()

        switch (true) {
            case getUser.user.bot:
            case memberHighestPositon <= rolePosition:
                badDescription = `\`\`\`Недостаточно прав!\`\`\``;
                color = Utility.colorRed;
                break;
            case hasRole(getRole):
                description = `**Пользователю <@${getUser.user.id}> была \`снята\` роль <@&${getRole}>**`
                color = Utility.colorDiscord
                await getUser.member.roles.remove(getRole)
                break;
            case !hasRole(getRole):
                description = `**Пользователю <@${getUser.user.id}> была \`выдана\` роль <@&${getRole}>**`
                color = Utility.colorDiscord
                await getUser.member.roles.add(getRole)
                break;
        }

        const embed = new EmbedBuilder().setDescription(description || badDescription).setColor(color)

        if (badDescription) {
            await interaction.editReply({ embeds: [embed] }) && client.channels.cache.get(StaffChats.Logs).send({ embeds: [embed.setTitle(`**Команда: </arrole:1167037867151867956>**`).setFields({ name: "`Пользователь`", value: `<@${getUser.user.id}>`, inline: true }, { name: "`Выдаваемая роль`", value: `<@&${getRole}>`, inline: true }).setFooter({ iconURL: interaction.user.avatarURL(), text: `Выполнил(а): ${interaction.user.username}` })] })
        } else {
            await interaction.editReply({ embeds: [embed] }) && client.channels.cache.get(StaffChats.Logs).send({ embeds: [embed.setFooter({ iconURL: interaction.user.avatarURL(), text: `Выполнил(а): ${interaction.user.username}` })] })
        }
    }
}