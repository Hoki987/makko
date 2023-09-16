//===========================================/ Import the modeles \===========================================\\
const { Client, ChatInputCommandInteraction, SlashCommandBuilder } = require('discord.js');

//==========< OTHERS >==========\\
const color = require('colors');

//===========================================< Code >===========================\\
module.exports = {
    data: new SlashCommandBuilder()
        .setName("ban")
        .setNameLocalization('ru', 'бан')
        .setDescription('Banning a select user')
        .setDescriptionLocalization('ru', 'Банит выбранного пользователя')
        .setDMPermission(false),

    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */

    async execute(client, interaction) {
        try {
            interaction.reply({
                content: 'ываывав'
            })
        } catch (error) {
            console.log(`${color.bold.red(`[COMMAND > BAN : ERROR]`)}` + `${error}.`.bgRed);
        }
    }
}