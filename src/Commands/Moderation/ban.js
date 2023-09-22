//===========================================/ Import the modeles \===========================================\\
const { Client, ChatInputCommandInteraction, SlashCommandBuilder } = require('discord.js');

//==========< OTHERS >==========\\
const color = require('colors');
const { WorkRoles, StuffRoles, WorkEmbeds } = require('../../../config.js');

//===========================================< Code >===========================\\
module.exports = {
    data: new SlashCommandBuilder()
        .setName("ban")
        .setNameLocalization('ru', 'бан')
        .setDescription('Banning a select user')
        .setDescriptionLocalization('ru', 'Банит выбранного пользователя')
        .setDMPermission(false)
        .addUserOption((banUser) => banUser.setName("пользователь").setDescription("Select a User").setRequired(true))
        .addStringOption((reason) => reason.setName("причина").setDescription("Введи причину бана")),

    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */

    async execute(client, interaction) {
        try {
            const getUser = interaction.options.get('пользователь');

            const memberPosition = interaction.member.roles.cache.filter(r => Object.values(StuffRoles).includes(r.id))?.sort((a, b) => b.position - a.position)?.first()?.position || 1;
            const targetPosition = getUser.member.roles.cache.filter(r => Object.values(StuffRoles).includes(r.id))?.sort((a, b) => b.position - a.position)?.first()?.position || 0;

            if (interaction.user.id === getUser.member.id) {
                interaction.reply({ embeds: WorkEmbeds.NotBanYourself })
            } else if (getUser.user.bot === true) {
                interaction.reply({ embeds: WorkEmbeds.NotBanBot })
            } else if (memberPosition < targetPosition) {
                interaction.reply({ embeds: WorkEmbeds.NotBanRoleHigh })
            } else if (memberPosition == targetPosition) {
                interaction.reply({ embeds: WorkEmbeds.NotBanRoleEquals })
            } else if (memberPosition > targetPosition) {
                const hasRole = (id) => getUser.member.roles.cache.has(id);

                if (hasRole(WorkRoles.Ban)) {
                    interaction.reply({ embeds: WorkEmbeds.BanNo })
                } else {
                    getUser.member.roles.add(WorkRoles.Ban)
                    interaction.reply({ embeds: WorkEmbeds.BanOk })
                }
            }
        } catch (error) {
            console.log(`${color.bold.red(`[COMMAND > BAN : ERROR]`)}` + `${error}.`.bgRed);
        }
    }
}
