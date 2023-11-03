const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");
const { Utility, HistoryEmojis } = require("../../../config")

function renderHistory(data, page, totalPages, description, target, executor) {
    let components;
    const embed = new EmbedBuilder()
        .setTitle(`История нарушений | ${target.displayName}`)
        .setColor(Utility.colorDiscord)
        .setThumbnail(target.displayAvatarURL())
        .setFields([{
            name: '```   Тип / Дата   ```',
            value: data.map((p, i) => `**#${(page - 1) * 10 + i + 1}**${HistoryEmojis[p.type]}<t:${Math.round(p.createdAt.getTime() / 1000)}:d>`).join('\n'),
            inline: true
        }, {
            name: '```   Причина   ```',
            value: data.map(p => p.reason).join('\n'),
            inline: true
        }, {
            name: '```   Исполнитель   ```',
            value: data.map(p => target.guild.members.cache.get(p.executor)?.toString() || 'Не найден').join('\n'),
            inline: true
        }])
    if (totalPages > 1) {
        embed.setFooter({ text: `Страница ${page}/${totalPages}`})
        components = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId(`history_left_${target.id}_${executor}`)
                .setEmoji('◀')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(page === 1),
            new ButtonBuilder()
                .setCustomId(`history_right_${target.id}_${executor}`)
                .setEmoji('▶')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(page === totalPages),
        )
    }
    if (description) {
        embed.setDescription(description)
    }
    return {
        embeds: [embed], components: components? [components] : undefined
    }
}

module.exports = { renderHistory }