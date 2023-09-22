//===========================================/ Import the modeles \===========================================\\
const { Client, ChatInputCommandInteraction, SlashCommandBuilder  } = require('discord.js');

//==========< OTHERS >==========\\
const color = require('colors');
const {  } = require('../../../config.js');

//===========================================< Code >===========================\\
module.exports = {
    data: new SlashCommandBuilder()
    .setName("history")
    .setDescription("Выводит историю нарушений")
    .setDMPermission(false)
    .addUserOption((target) => target.setName('пользователь').setDescription("Выбери пользователя").setRequired(true)),

    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */

    async execute(client, interaction) {
        try {
            interaction.reply({
                content: 'все работает'
            })
        } catch (error) {
            console.log(`${color.bold.red(`[COMMAND > HISTORY : ERROR]`)}` + `${error}.`.bgRed);
        }
    }
}