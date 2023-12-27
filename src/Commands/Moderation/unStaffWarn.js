//===========================================/ Import the modeles \===========================================\\
const { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
//==========< OTHERS >==========\\
const { StaffChats } = require('../../../config.js');
const { cellValue, anyCellMinus } = require('../../Structures/Untils/Functions/action.js');
//===========================================< Code >===========================================\\
module.exports = {
    data: new SlashCommandBuilder()
        .setName("unstaffwarn")
        .setDescription("Снимает выговор пользователю")
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
        let column

        switch (true) {
            case isControl:
                staffSheet = 1162940648
                break;
            case isAssistant:
                staffSheet = 0
                break;
        }
        try {
            switch (getType) {
                case "oral":
                    column = 5
                    description = `У пользователя <@${getUser.user.id}> был снят последний устный выговор!`
                    break;
                case "written":
                    column = 6
                    description = `У пользователя <@${getUser.user.id}> был снят последний письменный выговор!`
                    break;
            }
            if (await cellValue(staffSheet, getUser.user.id, column) !== 0) {
                await anyCellMinus(staffSheet, getUser.user.id, column, 1)
            } else {
                description = `У пользователя <@${getUser.user.id}> нет выговора данного типа!`
            }
            await interaction.editReply({ embeds: [new EmbedBuilder().setDescription(description)] })
        } catch (error) {
            await interaction.editReply({ content: "Пользователь не находится в стаффе." })
        }
    }
}