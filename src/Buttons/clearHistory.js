//===========================================/ Import the modeles \===========================================\\
const { Client, ButtonInteraction, EmbedBuilder } = require('discord.js');
const { HistoryNames } = require('../../config.js');

//==========< OTHERS >==========\\
const History = require('../Structures/Models/History.js');
const { renderClearHistory } = require('../Structures/Untils/render.js');

//===========================================< Code >===========================\\
module.exports = {
    data: {
        name: 'chistory'
    },

    /**
     * @param {Client} client
     * @param {ButtonInteraction} interaction
     */

    async execute(client, interaction) {
        const [, action, type, target, id] = interaction.customId.split('_')
        const pages = interaction.message.embeds[0].footer?.text.split('/')
        const page = Number(pages ? pages[0].replace(/\D/g, '') : 1)
        const totalPages = Math.ceil((await History.count({ where: { target, type } })) / 3)
        const member = interaction.guild.members.cache.get(target)
        switch (action) {
            case 'left':
            case 'right':
            case 'list':
                const newPage = action === 'list' ? 1 : action == 'left' ? page - 1 : page + 1;
                const history = await History.findAll({
                    where: {
                        target, type
                    },
                    order: [['createdAt', 'DESC']],
                    limit: 3,
                    offset: (newPage - 1) * 3
                })
                await interaction.update(renderClearHistory(history, newPage, totalPages, member))
                break;
            case 'delete':
                await History.destroy({
                    where: { id }
                })
                await interaction.update({ embeds: [new EmbedBuilder().setDescription(`Очистили **${HistoryNames[type]}** у пользователя ${member}`)], components: [] })
                break;
            case 'all':
                await History.destroy({
                    where: { target, type }
                })
                await interaction.update({ embeds: [new EmbedBuilder().setDescription(`Нарушения с типом \`${HistoryNames[type]}\` у пользователя ${member} были очищены`)], components: [] })
                break;
        }
    }
}