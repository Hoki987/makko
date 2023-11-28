//===========================================/ Import the modeles \===========================================\\
const { Client, ContextMenuCommandBuilder, ApplicationCommandType, ContextMenuCommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')
//==========< OTHERS >==========\\

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
        const embed = new EmbedBuilder()
            .setTitle(`Информация о пользователе | ${interaction.targetMember.user.username}`)
            .setFields(
                { name: `\`Полное имя:\``, value: interaction.targetMember.user.username, inline: true },
                { name: `\`Id пользователя:\``, value: `${interaction.targetMember.user.id}`, inline: true },
                { name: `\`Аккаунт создан:\``, value: `${interaction.targetMember.user.createdAt.toLocaleDateString()}`, inline: true },
                { name: `\`Дата присоединения:\``, value: `${interaction.targetMember.joinedAt.toLocaleDateString()}`, inline: true },
                { name: `\`Статус:\``, value: `${interaction.targetMember.presence?.status === undefined ? 'offline' : interaction.targetMember.presence.status}`, inline: true },
                { name: `\`Голосовой онлайн:\``, value: `0ч.0м.0с`, inline: true })
            .setThumbnail(interaction.user.displayAvatarURL())
            const historyButton = new ButtonBuilder()
            .setLabel('История нарушений')
            .setEmoji('🔒')
            .setStyle(ButtonStyle.Secondary)
            .setCustomId('userInfo_history')
        await interaction.deferReply({ ephemeral: true })
        await interaction.editReply({ embeds: [embed], components: [new ActionRowBuilder().addComponents(historyButton)] })
    }
}