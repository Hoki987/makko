//===========================================/ Import the modeles \===========================================\\
const { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

//==========< OTHERS >==========\\
const { WorkRoles, Utility, StaffChats } = require('../../../config.js');
const History = require('../../Structures/Models/History.js');

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
            case !hasRole(WorkRoles.Male) && !hasRole(WorkRoles.Female):
            case hasRole(WorkRoles.Male) && hasRole(WorkRoles.Female):
            case hasRole(WorkRoles.Female):
                await getUser.member.roles.remove(WorkRoles.Female) && await getUser.member.roles.add(WorkRoles.Male)
                description = `**Гендер <@${getUser.user.id}> сменен на <@&${WorkRoles.Male}>**`
                color = Utility.colorDiscord
                break;
            case hasRole(WorkRoles.Male):
                await getUser.member.roles.remove(WorkRoles.Male) && await getUser.member.roles.add(WorkRoles.Female)
                description = `**Гендер <@${getUser.user.id}> сменен на <@&${WorkRoles.Female}>**`
                color = Utility.colorDiscord
                break;
        }
        const embed = new EmbedBuilder().setDescription(description).setColor(color)
        await interaction.editReply({ embeds: [embed] }) && client.channels.cache.get(StaffChats.Logs).send({ embeds: [embed.setFooter({ iconURL: interaction.user.avatarURL(), text: `Выполнил: ${interaction.user.username}` })] })
    }
}