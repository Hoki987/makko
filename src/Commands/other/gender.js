//===========================================/ Import the modeles \===========================================\\
const { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
//==========< OTHERS >==========\\
const { UntilsRoles, Utility, StaffChats } = require('../../../config.js');
//===========================================< Code >===========================================\\
module.exports = {
    data: new SlashCommandBuilder()
        .setName("gender")
        .setDescription("Меняет гендер пользователю")
        .setDMPermission(false)
        .addUserOption((target) => target.setName('пользователь').setDescription("Выбери пользователя").setRequired(true)),

    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */

    async execute(client, interaction) {
        const getUser = interaction.options.get('пользователь');
        const hasRole = (id) => getUser.member.roles.cache.has(id);

        let description;
        let color;

        await interaction.deferReply()
        switch (true) {
            case !hasRole(UntilsRoles.Male) && !hasRole(UntilsRoles.Female):
            case hasRole(UntilsRoles.Male) && hasRole(UntilsRoles.Female):
            case hasRole(UntilsRoles.Female):
                await getUser.member.roles.remove(UntilsRoles.Female) && await getUser.member.roles.add(UntilsRoles.Male)
                description = `**Гендер <@${getUser.user.id}> сменен на <@&${UntilsRoles.Male}>**`
                color = Utility.colorDiscord
                break;
            case hasRole(UntilsRoles.Male):
                await getUser.member.roles.remove(UntilsRoles.Male) && await getUser.member.roles.add(UntilsRoles.Female)
                description = `**Гендер <@${getUser.user.id}> сменен на <@&${UntilsRoles.Female}>**`
                color = Utility.colorDiscord
                break;
        }
        const embed = new EmbedBuilder().setDescription(description).setColor(color)
        await interaction.editReply({ embeds: [embed] }) && await client.channels.cache.get(StaffChats.Logs).send({ embeds: [embed.setFooter({ iconURL: interaction.user.avatarURL(), text: `Выполнил: ${interaction.user.username}` })] })
    }
}