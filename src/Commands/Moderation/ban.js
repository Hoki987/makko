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
            let getUser = interaction.options.get("пользователь");
            // console.log(interaction.options.get("пользователь").member.roles.highest.idUsers);
for(let idUsers in StuffRoles) {
    if (StuffRoles[idUsers] == interaction.options.get("пользователь").member.roles.highest) {
        interaction.channel.send({ephemeral: true, embeds: WorkEmbeds.NotBanRoleHigh})
    } else {
        interaction.reply({
            content: 'все не работает'
        })
    }
}

        } catch (error) {
            // console.log(`${color.bold.red(`[COMMAND > BAN : ERROR]`)}` + `${error}.`.bgRed);
            console.log(error);
        }
    }
}