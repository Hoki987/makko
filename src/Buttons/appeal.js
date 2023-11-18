//===========================================/ Import the modeles \===========================================\\
const { Client, ActionRowBuilder, ButtonBuilder, ButtonInteraction, EmbedBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
//==========< OTHERS >==========\\
const { StaffChats } = require("../../config.js")
//===========================================< Code >===========================\\
module.exports = {
    data: { name: 'mute' },
    data: { name: 'ban' },
    data: { name: 'bancam' },
    data: { name: 'banjpg' },
    data: { name: 'pred' },
    data: { name: 'warn' },

    /**
    * @param {Client} client
    * @param {ButtonInteraction} interaction
    */

    async execute(client, interaction) {
        let dataValue;

        switch (this.data.name) {
            case 'ban':
                dataValue = 'бана'
                break;
            case 'bancam':
                dataValue = 'запрета камеры'
                break;
            case 'banjpg':
                dataValue = 'запрета картинок'
                break;
            case 'mute':
                dataValue = 'мута'
                break;
            case 'pred':
                dataValue = 'предупреждения'
                break;
            case 'warn':
                dataValue = 'варна'
                break;
        }
        switch (interaction.customId) {
            case `${this.data.name}_ControlButton`:
                interaction.reply({ content: 'Все сработало' })
                break;
            case `${this.data.name}_AssistButton`:
                await interaction.showModal(
                    new ModalBuilder()
                        .setCustomId(`${this.data.name}_AssistModal`)
                        .setTitle(`Обжалование ${dataValue}`)
                        .addComponents(
                            new ActionRowBuilder().addComponents(
                                new TextInputBuilder()
                                    .setCustomId(`${this.data.name}_inputAssist1`)
                                    .setLabel('За что вы получили наказание?')
                                    .setMaxLength(50)
                                    .setStyle(TextInputStyle.Short)
                            ),
                            new ActionRowBuilder().addComponents(
                                new TextInputBuilder()
                                    .setCustomId(`${this.data.name}_inputAssist2`)
                                    .setLabel('Наказание было выдано необоснованно?')
                                    .setMaxLength(50)
                                    .setStyle(TextInputStyle.Paragraph)
                            )
                        )
                )
                // await client.channels.cache.get(StaffChats.AppelAssist).send({
                //     embeds: [
                //         new EmbedBuilder()
                //             .setDescription('Аппеляция от чубрика')
                //     ],
                //     components: [
                //         new ActionRowBuilder().addComponents(
                //             new ButtonBuilder()
                //                 .setLabel('Приянть')
                //                 .setCustomId('ban_cancel')
                //                 .setStyle(ButtonStyle.Success)
                //         )
                //     ]
                // })
                break;
            case "ban_AdminButton":
                interaction.reply({ content: 'Все сработало' })
                break;
        }
        switch (interaction.customId) {
            case 'ban_cancel':
                interaction.reply({
                    content: 'good'
                })
                break;
        }
    }
}