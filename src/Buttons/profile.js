//===========================================/ Import the modeles \===========================================\\
const { Client, ButtonInteraction, EmbedBuilder } = require('discord.js');
const { Utility } = require('../../config.js');

//==========< OTHERS >==========\\

//===========================================< Code >===========================\\
module.exports = {
    data: {
        name: 'profile'
    },
    /**
 * @param {Client} client
 * @param {ButtonInteraction} interaction
 */

    async execute(client, interaction) {
        await interaction.deferReply({ ephemeral: true })
        const [, action, position] = interaction.customId.split('_')
        switch (action) {
            case 'shop':
                await interaction.editReply({
                    embeds: [new EmbedBuilder().setTitle('Магазин').setColor(Utility.colorDiscord).setFields(
                        { name: "``` # ```", value: "1.\n2.", inline: true },
                        { name: "```               Предмет               ```", value: "Снять письменный выговор\n5000 конфет", inline: true },
                        { name: "```   Цена   ```", value: "130 баллов\n250 баллов", inline: true }
                    )],
                    components: []
                })
                break;
        }
    }
}