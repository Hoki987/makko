//===========================================/ Import the modeles \===========================================\\
const { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
//==========< OTHERS >==========\\
const { StaffChats } = require('../../../config.js');
const { cellValue, actionMinus, actionPlus } = require('../../Structures/Untils/Functions/action.js');
const { delStaff } = require('../../Structures/Untils/Functions/actionDB.js');
//===========================================< Code >===========================================\\
module.exports = {
    data: new SlashCommandBuilder()
        .setName("staffwarn")
        .setDescription("Выдает выговор пользователю")
        .setDMPermission(false)
        .addUserOption((target) => target.setName('пользователь').setDescription("Выбери пользователя").setRequired(true))
        .addStringOption((type) => type.setName("тип").setDescription("Выбери тип").addChoices(
            { name: "Письменный", value: "written" },
            { name: "Устный", value: "oral" }
        ).setRequired(true)),

    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */

    async execute(client, interaction) {
        await interaction.deferReply()
        const getUser = interaction.options.get('пользователь');
        const getType = interaction.options.getString('тип');

        const isAssistant = interaction.channel.id === StaffChats.Assistant
        const isControl = interaction.channel.id === StaffChats.Control

        if (![StaffChats.Assistant, StaffChats.Control].includes(interaction.channel.id)) {
            await interaction.reply({
                ephemeral: true,
                content: 'Используйте чат, соответствующий вашей стафф роли!'
            })
            return
        }

        let staffSheet;
        let description;
        let Position;

        switch (true) {
            case isControl:
                staffSheet = 1162940648
                Position = 'Control'
                break;
            case isAssistant:
                staffSheet = 0
                Position = 'Assistant'
                break;
        }
        try {
            switch (getType) {
                case "oral":
                    if (await cellValue(staffSheet, getUser.user.id, 5) >= 1) {
                        await actionMinus(staffSheet, getUser.user.id, 5)
                        await actionPlus(staffSheet, getUser.user.id, 6)
                        description = `Вы выдали письменный выговор <@${getUser.user.id}>`
                    } else {
                        await actionPlus(staffSheet, getUser.user.id, 5)
                        description = `Вы выдали устный выговор <@${getUser.user.id}>`
                    }
                    if (await cellValue(staffSheet, getUser.user.id, 6) > 2) {
                        await delStaff(getUser.user.id, Position, staffSheet)
                        description = "Пользователь был снят по причине 3-ех письменных выговоров."
                    }
                    break;
                case "written":
                    if (await cellValue(staffSheet, getUser.user.id, 6) >= 2) {
                        await delStaff(getUser.user.id, Position, staffSheet)
                        description = "Пользователь был снят по причине 3-ех письменных выговоров."
                    } else {
                        await actionPlus(staffSheet, getUser.user.id, 6)
                        description = `Вы выдали письменный выговор <@${getUser.user.id}>`
                    }
                    break;
            }
            await interaction.editReply({ embeds: [new EmbedBuilder().setDescription(description)] })
        } catch (error) {
            console.log(error);
            await interaction.editReply({ content: "Пользователь не находится в стаффе." })
        }
    }
}