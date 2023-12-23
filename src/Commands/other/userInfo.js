//===========================================/ Import the modeles \===========================================\\
const { Client, ContextMenuCommandBuilder, ApplicationCommandType, ContextMenuCommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')
//==========< OTHERS >==========\\
const axios = require('axios');
const { Utility } = require('../../../config');
require("dotenv").config();
//===========================================< Code >===========================================\\

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('userInfo')
        .setType(ApplicationCommandType.User)
        .setDMPermission(false),

    /**
     * @param {Client} client
     * @param {ContextMenuCommandInteraction} interaction
     */

    async execute(client, interaction) {
        await interaction.deferReply({ ephemeral: true })

        const getUser = async (guildId, userId) => {
            try {
                const response = await axios.get(`https://yukine.ru/util/api/users/${guildId}/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${process.env.BEARERTOKEN}`
                    }
                })
                return response.data
            } catch (error) {
                console.log(error)
            }
        }

        const getOnline = await getUser("822354240713261068", interaction.targetMember.user.id)

        const embed = new EmbedBuilder()
            .setTitle(`Информация о пользователе | ${interaction.targetMember.user.username}`)
            .setColor(Utility.colorDiscord)
            .setFields(
                { name: `\`Полное имя:\``, value: interaction.targetMember.user.username, inline: true },
                { name: `\`Id пользователя:\``, value: `${interaction.targetMember.user.id}`, inline: true },
                { name: `\`Аккаунт создан:\``, value: `${interaction.targetMember.user.createdAt.toLocaleDateString()}`, inline: true },
                { name: `\`Дата присоединения:\``, value: `${interaction.targetMember.joinedAt.toLocaleDateString()}`, inline: true },
                { name: `\`Статус:\``, value: `${interaction.targetMember.presence?.status === undefined ? 'offline' : interaction.targetMember.presence.status}`, inline: true },
                { name: `\`Голосовой онлайн:\``, value: `${Math.trunc(getOnline.online / 3600)} часов`, inline: true })
            .setThumbnail(interaction.targetMember.user.displayAvatarURL())
        const historyButton = [new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setLabel('История нарушений')
                .setEmoji('🔒')
                .setStyle(ButtonStyle.Secondary)
                .setCustomId(`userInfo_history_${interaction.targetMember.user.id}`),
            new ButtonBuilder()
                .setLabel('Аватар пользователя')
                .setEmoji('🖼')
                .setStyle(ButtonStyle.Secondary)
                .setCustomId(`userInfo_Avatar_${interaction.targetMember.user.id}`),
            new ButtonBuilder()
                .setLabel('Логи')
                .setEmoji('👾')
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(true)
                .setCustomId(`userInfo_Logs_${interaction.targetMember.user.id}`)
        )]
        await interaction.editReply({ embeds: [embed], components: historyButton })
    }
}