//===========================================/ Import the modeles \===========================================\\
const { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require('discord.js');

//==========< OTHERS >==========\\
const { Utility, StaffRoles } = require('../../../config.js');
const { StaffChats } = require('../../../config.js');
const { addStaff } = require('../../Structures/Untils/Functions/actionDB.js');
const { fetchStaff } = require('../../Structures/Untils/Functions/fetchStaff.js');
const Staff = require('../../Structures/Models/Staff.js');
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
        let dmDescription;
        let Position;

        switch (true) {
            case isControl:
                staffSheet = 1162940648
                description = `Вы взяли на должность Контрола <@${getUser.user.id}>`
                Position = 'Control'
                break;
            case isAssistant:
                description = `Вы взяли на должность Ассистента <@${getUser.user.id}>`
                staffSheet = 0
                Position = 'Assistant'
                break;
        }

        switch (true) {
            case await fetchStaff(staffSheet, getUser.user.id) && await Staff.count({ where: { PersonalId: getUser.user.id } }) > 1:
                description = `Пользователь <@${getUser.user.id}> уже в стаффе.`
                break;
            default:
                dmDescription = '**Стафф сервер** - https://discord.gg/W96xcfDUfU'
                break;
        }
        const embed = new EmbedBuilder().setDescription(description).setColor(Utility.colorDiscord)
        if (dmDescription) {
            const dmembed = new EmbedBuilder().setDescription(dmDescription).setColor(Utility.colorDiscord).setFooter({ text: `Выполнил(а) ${interaction.user.tag} | ` + 'Сервер ' + interaction.guild.name, iconURL: interaction.user.displayAvatarURL() })
            await addStaff(getUser.user.tag, getUser.user.id, Position, staffSheet)
            if (isControl) {
                await getUser.member.roles.add(StaffRoles.Control)
            } else {
                await getUser.member.roles.add(StaffRoles.Assistant)
            }
            await interaction.editReply({ embeds: [embed] })
            await getUser.user.send({ embeds: [dmembed] })
        } else {
            await interaction.editReply({ embeds: [embed] })
        }
    }
}