//===========================================/ Import the modeles \===========================================\\
const { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require('discord.js');

//==========< OTHERS >==========\\
const { Utility } = require('../../../config.js');
const { doc, docAssist } = require('../../Structures/Untils/googlesheet.js');
const { StaffRoles, StaffChats } = require('../../../config.js')
//===========================================< Code >===========================\\
module.exports = {
    data: new SlashCommandBuilder()
        .setName("add")
        .setDescription("Взять на стафф")
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
        let Position;

        switch (true) {
            case isControl:
                await doc.loadInfo()
                staffSheet = doc.sheetsById[1162940648]
                description = `Вы взяли на должность Контрола`
                Position = 'Control'
                break;
            case isAssistant:
                await docAssist.loadInfo()
                description = `Вы взяли на должность Ассистента`
                staffSheet = docAssist.sheetsById[0]
                Position = 'Assistant'
                break;
        }

        const getUser = interaction.options.get('пользователь');
        const sheet = staffSheet;

        const embed = new EmbedBuilder().setDescription(description + ` <@${getUser.user.id}>`).setColor(Utility.colorDiscord)
        const dmembed = new EmbedBuilder().setDescription('**Стафф сервер** - https://discord.gg/W96xcfDUfU').setColor(Utility.colorDiscord)

        await sheet.addRow({ Tag: getUser.user.tag, ID: getUser.user.id, Position: Position, DATE: new Date().toLocaleDateString('ru-Ru') })
        //.replace(/\./g, '/')
        await interaction.reply({ embeds: [embed] })
        await getUser.user.send({ embeds: [dmembed] })
    }
}