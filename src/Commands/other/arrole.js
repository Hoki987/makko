//===========================================/ Import the modeles \===========================================\\
const { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

//==========< OTHERS >==========\\
const { Utility, StaffChats, StaffRoles } = require('../../../config.js');
//===========================================< Code >===========================================\\
module.exports = {
    data: new SlashCommandBuilder()
        .setName("arrole")
        .setDescription("Выдает роль пользователю")
        .setDMPermission(false)
        .addRoleOption((role) => role.setName('роль').setDescription("Выбери роль").setRequired(true))
        .addUserOption((target) => target.setName('пользователь').setDescription("Выбери пользователя").setRequired(true)),

    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */

    async execute(client, interaction) {
        const getMember = interaction.options.getMember('пользователь')
        const getRole = interaction.options.getRole('роль');
        const hasRole = (id) => interaction.member.roles.cache.has(id);

        const memberHighestRole = interaction.member.roles.highest.position
        const rolePosition = getRole.position

        let description;
        let badDescription
        let color;

        console.log(memberHighestRole);
        console.log(rolePosition);

        await interaction.deferReply()

        switch (true) {
            case getMember.user.bot:
            case memberHighestRole <= rolePosition:
                badDescription = `\`\`\`Недостаточно прав!\`\`\``;
                color = Utility.colorRed;
                break;
            case hasRole(getRole.id):
                description = `**Пользователю <@${getMember.user.id}> была \`снята\` роль <@&${getRole.id}>**`
                color = Utility.colorDiscord
                await getMember.roles.remove(getRole.id)
                break;
            case !hasRole(getRole.id):
                description = `**Пользователю <@${getMember.user.id}> была \`выдана\` роль <@&${getRole.id}>**`
                color = Utility.colorDiscord
                await getMember.roles.add(getRole.id)
                break;
        }

        const embed = new EmbedBuilder().setDescription(description || badDescription).setColor(color)

        if (badDescription) {
            await interaction.editReply({ embeds: [embed] }) && client.channels.cache.get(StaffChats.Logs).send({ embeds: [embed.setTitle(`**Команда: </arrole:1167037867151867956>**`).setFields({ name: "`Пользователь`", value: `<@${getMember.user.id}>`, inline: true }, { name: "`Выдаваемая роль`", value: `<@&${getRole.id}>`, inline: true }).setFooter({ iconURL: interaction.user.avatarURL(), text: `Выполнил(а): ${interaction.user.username}` })] })
        } else {
            await interaction.editReply({ embeds: [embed] }) && client.channels.cache.get(StaffChats.Logs).send({ embeds: [embed.setFooter({ iconURL: interaction.user.avatarURL(), text: `Выполнил(а): ${interaction.user.username}` })] })
        }
    }
}