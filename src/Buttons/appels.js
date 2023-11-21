//===========================================/ Import the modeles \===========================================\\
const { Client, ActionRowBuilder, ButtonBuilder, ButtonInteraction, EmbedBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, ThreadManager, ChannelType } = require('discord.js');
//==========< OTHERS >==========\\
const { StaffChats } = require("../../config.js");
const appels = require('../ModalSubmits/appels.js');
const Appeals = require('../Structures/Models/Appeals.js');
const History = require('../Structures/Models/History.js');
//===========================================< Code >===========================\\
module.exports = {
    data: { name: 'appeal' },
    // data: { name: 'ban' },
    // data: { name: 'pred' },
    // data: { name: 'warn' },

    /**
    * @param {Client} client
    * @param {ButtonInteraction} interaction
    */
    async execute(client, interaction) {
        let dataValue;
        switch (interaction.customId.split('_')[1]) {
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
        console.log(interaction.customId.split('_'));
        console.log(interaction.customId.split('_')[0]);
        console.log(interaction.customId.split('_')[1]);
        console.log(interaction.customId.split('_')[2]);
        console.log(interaction.customId.split('_')[3]);
        switch (interaction.customId) {
            case `appeal_accept_${interaction.customId.split('_')[2]}_${interaction.customId.split('_')[3]}`:
                await interaction.message.startThread({
                    name: interaction.customId.split('_')[3],
                    autoArchiveDuration: 60,
                    type: ChannelType.PublicThread,
                    reason: 'na',
                })
                break;
            case `appeal_cancel_${interaction.customId.split('_')[2]}`:

                break;
            case `${interaction.customId.split('_')[0]}_${interaction.customId.split('_')[1]}_${interaction.customId.split('_')[2]}_${interaction.customId.split('_')[3]}`:
                await Appeals.create({
                    idExecute: interaction.customId.split('_')[3],
                    target: interaction.user.id,
                    expiresAt: new Date(Date.now() + 604800000)
                })
                console.log(interaction.message.components[0].components[0]);
                await interaction.message.edit({ components: [{ components: [{...interaction.message.components[0].components[0].data, disabled: true }] }] }) && await interaction.showModal(
                    new ModalBuilder()
                        .setCustomId(`${interaction.customId.split('_')[0]}Modal_${interaction.customId.split('_')[2]}`)
                        .setTitle(`Обжалование ${dataValue}`)
                        .addComponents(
                            new ActionRowBuilder().addComponents(
                                new TextInputBuilder()
                                    .setCustomId(`${interaction.customId.split('_')[0]}ModalInput_1`)
                                    .setLabel('За что вы получили наказание?')
                                    .setMaxLength(50)
                                    .setStyle(TextInputStyle.Short)
                            ),
                            new ActionRowBuilder().addComponents(
                                new TextInputBuilder()
                                    .setCustomId(`${interaction.customId.split('_')[0]}ModalInput_2`)
                                    .setLabel('Наказание было выдано необоснованно?')
                                    .setMaxLength(50)
                                    .setStyle(TextInputStyle.Paragraph)
                            )
                        )
                )
                break;
        }
    }
}