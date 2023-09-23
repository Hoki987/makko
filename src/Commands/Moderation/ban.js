//===========================================/ Import the modeles \===========================================\\
const { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require('discord.js');

//==========< OTHERS >==========\\
const { WorkRoles, StuffRoles, Utility } = require('../../../config.js');
const History = require('../../Structures/Models/History.js');

//===========================================< Code >===========================\\
module.exports = {
    data: new SlashCommandBuilder()
        .setName("ban")
        .setDescription('Банит выбранного пользователя')
        .setDMPermission(false)
        .addUserOption((banUser) => banUser.setName("пользователь").setDescription("Выбери пользователя").setRequired(true))
        .addStringOption((reason) => reason.setName("причина").setDescription("Введи причину бана").addChoices(
            { name: 'переход', value: 'переход' },
            { name: '4.4', value: '4.4' },
            { name: '3.1', value: '3.1' },
            { name: '3.3', value: '3.3' },
            { name: '3.6', value: '3.6' },
            { name: '3.7', value: '3.7' },
            { name: '3.8', value: '3.8' },
            { name: '3.9', value: '3.9' },
            { name: '3.10', value: '3.10' },
            { name: '3.11', value: '3.11' },
            { name: '3.13', value: '3.13' },
            { name: '4.3', value: '4.3' },
            { name: '<13', value: '<13' },
        )),

    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */

    async execute(client, interaction) {
        const getUser = interaction.options.get('пользователь');
        const getReason = interaction.options.getString('причина');
        const hasRole = (id) => getUser.member.roles.cache.has(id);

        const memberPosition = interaction.member.roles.cache.filter(r => Object.values(StuffRoles).includes(r.id))?.sort((a, b) => b.position - a.position)?.first()?.position || 1;
        const targetPosition = getUser.member.roles.cache.filter(r => Object.values(StuffRoles).includes(r.id))?.sort((a, b) => b.position - a.position)?.first()?.position || 0;

        let description;
        let color;

        await interaction.deferReply()
        switch (true) {
            case interaction.user.id === getUser.member.id:
            case getUser.user.bot:
            case memberPosition <= targetPosition:
                description = '**Недостаточно прав!**';
                color = Utility.colorRed;
                break;
            case hasRole(WorkRoles.Ban):
                description = `**[<:ban:1155041800319422555>]** Пользователь ${getUser.user} не был **забанен**\n\`\`\`Причина: уже в бане\`\`\``
                color = Utility.colorRed
                break;
            default:
                description = `**[<:ban:1155041800319422555>]** Пользователь ${getUser.user} был **забанен на 30d**\n\`\`\`Причина: ${getReason || 'Отсутствует'} \`\`\``
                color = Utility.colorGreen
                await History.create({
                    executor: interaction.user.id,
                    target: getUser.user.id,
                    reason: getReason || null,
                    type: 'ban',
                    timestamp: new Date()
                })
                await getUser.member.roles.add(WorkRoles.Ban)
                break;
        }
        const embed = new EmbedBuilder().setDescription(description).setColor(color).setFooter({ text: 'Сервер:' + Utility.guildName, iconURL: Utility.guildAvatar });
        await interaction.editReply({ embeds: [embed] });
    }
}
