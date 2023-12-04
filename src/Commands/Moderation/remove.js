//===========================================/ Import the modeles \===========================================\\
const { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
//==========< OTHERS >==========\\
const { Utility } = require('../../../config.js');
const { StaffChats } = require('../../../config.js');
const Staff = require('../../Structures/Models/Staff.js');
const { delStaff } = require('../../Structures/Untils/Functions/actionDB.js');
const { fetchStaff } = require('../../Structures/Untils/Functions/fetchStaff.js');
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
        await interaction.deferReply()
        if (![StaffChats.Assistant, StaffChats.Control].includes(interaction.channel.id)) {
            await interaction.reply({
                ephemeral: true,
                content: 'Используйте чат, соответствующий вашей стафф роли!'
            })
            return
        }
        const isAssistant = interaction.channel.id === StaffChats.Assistant
        const isControl = interaction.channel.id === StaffChats.Control
        const getUser = interaction.options.get('пользователь');

        let staffSheet;
        let description;
        let dmdescription;
        let Position;

        switch (true) {
            case isControl:
                staffSheet = 1162940648
                Position = 'Control'
                description = `Вы сняли с должности Контрола <@${getUser.user.id}>`
                dmdescription = `Вы были сняты c должности Контрола`
                break;
            case isAssistant:
                staffSheet = 0
                Position = 'Assistant'
                description = `Вы сняли с должности Ассистента <@${getUser.user.id}>`
                dmdescription = `Вы были сняты c должности Ассистента`
                break;
        }
        const embed = new EmbedBuilder().setDescription(description).setColor(Utility.colorDiscord)

        switch (true) {
            case await fetchStaff(staffSheet, getUser.user.id) && await Staff.count({ where: { PersonalId: getUser.user.id, Position: Position } }) > 0:
                const dmembed = new EmbedBuilder().setDescription(dmdescription).setColor(Utility.colorDiscord).setFooter({ text: `Выполнил(а) ${interaction.user.tag} | ` + 'Сервер ' + interaction.guild.name, iconURL: interaction.user.displayAvatarURL() });
                await delStaff(getUser.user.id, Position, staffSheet)
                await interaction.editReply({ embeds: [embed] })
                await getUser.user.send({ embeds: [dmembed] })
                break;
            default:
                await interaction.editReply({embeds: [new EmbedBuilder().setDescription(`Пользователь <@${getUser.user.id}> не находится в стаффе`)]})
                break;
        }
    }
}