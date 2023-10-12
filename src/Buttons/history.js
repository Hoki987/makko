//===========================================/ Import the modeles \===========================================\\
const { Client, SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonInteraction } = require('discord.js');

//==========< OTHERS >==========\\
const History = require('../Structures/Models/History.js');
const { renderHistory } = require('../Structures/Untils/render.js');

//===========================================< Code >===========================\\
module.exports = {
    data: {
        name: 'history'
    },

    /**
     * @param {Client} client
     * @param {ButtonInteraction} interaction
     */

    async execute(client, interaction) {
        const [, action, target, executor] = interaction.customId.split('_')
        if (interaction.user.id !== executor) {
            return;
        }
        const pages = interaction.message.embeds[0].footer?.text.split('/')
        const page = Number(pages[0].replace(/\D/g, ''))
        const newPage = action === 'left' ? page - 1 : page + 1;
        const history = await History.findAll({
            where: {
                target
            },
            order: [['createdAt', 'DESC']],
            limit: 10,
            offset: (newPage - 1) * 10
        })
        const member = interaction.guild.members.cache.get(target)


        await interaction.update(renderHistory(history, newPage, Number(pages[1]), interaction.message.embeds[0].description, member, executor))
    }
}