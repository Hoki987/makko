//===========================================/ Import the modeles \===========================================\\
const { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require('discord.js');

//==========< OTHERS >==========\\
const { Utility } = require('../../../config.js');
const { doc, docAssist } = require('../../Structures/Untils/googlesheet.js');
const { StaffChats } = require('../../../config.js')
//===========================================< Code >===========================\\
module.exports = {
    data: new SlashCommandBuilder()
        .setName("remove")
        .setDescription("Снять со стаффа")
        .setDMPermission(false)
        .addUserOption((target) => target.setName('пользователь').setDescription("Выбери пользователя").setRequired(true)),

    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */

    async execute(client, interaction) {
        if (![StaffChats.Assistant, StaffChats.Control].includes(interaction.channel.id)) {
            await interaction.reply({
                ephemeral: true,
                content: 'Используйте чат, соответствующий вашей стафф роли!'
            })
            return
        }
        const isAssistant = interaction.channel.id === StaffChats.Assistant
        const isControl = interaction.channel.id === StaffChats.Control

        let staffSheet;
        let description;
        let dmdescription;

        switch (true) {
            case isControl:
                await doc.loadInfo()
                staffSheet = doc.sheetsById[1162940648]
                description = `Вы сняли с должности Контрола`
                dmdescription = `Вы были сняты c должности Контрола`
                break;
            case isAssistant:
                await docAssist.loadInfo()
                staffSheet = docAssist.sheetsById[0]
                description = `Вы сняли с должности Ассистента`
                dmdescription = `Вы были сняты c должности Ассистента`
                break;
        }
        try {
            const getUser = interaction.options.get('пользователь');
            const sheet = staffSheet;

            const embed = new EmbedBuilder().setDescription(description + ` <@${getUser.user.id}>`).setColor(Utility.colorDiscord)
            const dmembed = new EmbedBuilder().setDescription(dmdescription).setColor(Utility.colorDiscord).setFooter({ text: `Выполнил(а) ${interaction.user.tag} | ` + 'Сервер ' + interaction.guild.name, iconURL: interaction.user.displayAvatarURL() });

            const rows = await sheet.getRows();
            const row = rows.find((r) => r._rawData.includes(interaction.user.id))
            await row.delete()
            await interaction.reply({ embeds: [embed] })
            await getUser.user.send({ embeds: [dmembed] })
        } catch (error) {
            await interaction.reply({ embeds: [new EmbedBuilder().setDescription('Пользователь не находится в стаффе!').setColor(Utility.colorRed)] })
        }
    }
}