//===========================================/ Import the modeles \===========================================\\
const { Client, ActionRowBuilder, ButtonBuilder, ModalSubmitInteraction, EmbedBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
//==========< OTHERS >==========\\
const { StaffChats, Utility } = require("../../config.js");
const Appeals = require('../Structures/Models/Appeals.js');
const History = require('../Structures/Models/History.js');
//===========================================< Code >===========================\\'
module.exports = {
    data: { name: 'appealModal' },
    /**
    * @param {Client} client
    * @param {ModalSubmitInteraction} interaction
    */

    async execute(client, interaction) {
        const findAppel = await Appeals.findOne({ where: { target: interaction.user.id, status: 'hold' } })
        const findExecute = await History.findOne({ where: { id: findAppel.idExecute } })
        const button_Cancel = new ButtonBuilder()
            .setLabel('Отклонить')
            .setCustomId(`appeal_cancel_${interaction.user.dmChannel}_${interaction.user.id}`)
            .setStyle(ButtonStyle.Danger)
        const button_Accept = new ButtonBuilder()
            .setLabel('Принять')
            .setCustomId(`appeal_accept_${interaction.user.dmChannel}_${interaction.user.id}`)
            .setStyle(ButtonStyle.Success)
        const embed = new EmbedBuilder()
            .setAuthor({ name: `${interaction.user.username} | ${interaction.user.id}`, iconURL: interaction.user.displayAvatarURL() })
            .setTitle('**Обжалование наказания**')
            .addFields(
                { name: `**Забанил(а)**`, value: `\`\`\`${findExecute.executor}\`\`\``, inline: true },
                { name: `**Причина наказания**`, value: `\`\`\`${findExecute.reason}\`\`\``, inline: true },
                { name: `**За что вы получили наказание?**`, value: `\`\`\`${interaction.fields.getTextInputValue(`${interaction.customId.split('_')[0]}Input_1`)}\`\`\`` },
                { name: `**Наказание было выдано необоснованно?**`, value: `\`\`\`${interaction.fields.getTextInputValue(`${interaction.customId.split('_')[0]}Input_2`)}\`\`\`` },
            )
            .setColor(Utility.colorDiscord)
        switch (interaction.customId.split('_')[1]) {
            case 'ControlButton':
                await client.channels.cache.get(StaffChats.AppelControl).send({
                    embeds: [
                        embed
                    ],
                    components: [new ActionRowBuilder().addComponents(button_Accept, button_Cancel)]
                })
                break;
            case 'AssistButton':
                await client.channels.cache.get(StaffChats.AppelAssist).send({
                    embeds: [
                        embed
                    ],
                    components: [new ActionRowBuilder().addComponents(button_Accept, button_Cancel)]
                })
                await Appeals.update({ status: 'active' }, { where: { target: interaction.user.id, status: 'hold' } })
                break;
            case 'AdmitButton':
                await client.channels.cache.get(StaffChats.AppelAdmin).send({
                    embeds: [
                        new EmbedBuilder()
                            .setDescription('Аппеляция от чубрика')
                    ],
                    components: [new ActionRowBuilder().addComponents(button_Accept, button_Cancel)]
                })
                break;
        }
    }
}