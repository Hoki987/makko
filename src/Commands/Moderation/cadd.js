//===========================================/ Import the modeles \===========================================\\
const { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require('discord.js');

//==========< OTHERS >==========\\
const { Utility } = require('../../../config.js');
const { doc } = require('../../Structures/Untils/googlesheet.js');
//===========================================< Code >===========================\\
module.exports = {
    data: new SlashCommandBuilder()
        .setName("cadd")
        .setDescription("взять на контрола")
        .setDMPermission(false)
        .addUserOption((target) => target.setName('пользователь').setDescription("Выбери пользователя").setRequired(true)),

    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */

    async execute(client, interaction) {
        try {
            await doc.loadInfo();
            const getUser = interaction.options.get('пользователь');
            const sheet = doc.sheetsById[1162940648];

            const embed = new EmbedBuilder().setDescription(`Вы взяли на должность контрола <@${getUser.user.id}>`).setColor(Utility.colorDiscord)
            const dmembed = new EmbedBuilder().setDescription('**Стафф сервер** - https://discord.gg/W96xcfDUfU').setColor(Utility.colorDiscord)

            await sheet.addRow({ Tag: getUser.user.tag, ID: getUser.user.id, Position: 'control', DATE: new Date().toLocaleDateString('ru-Ru') })
            //.replace(/\./g, '/')
            await interaction.reply({ embeds: [embed] })
            await getUser.user.send({ embeds: [dmembed] })
        } catch (error) {
            console.log(error);
        }
    }
}