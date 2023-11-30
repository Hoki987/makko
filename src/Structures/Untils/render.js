const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");
const { Utility, HistoryEmojis, HistoryNames } = require("../../../config")

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
        embed.setFooter({ text: `Страница ${page}/${totalPages}` })
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
        embeds: [embed], components: components ? [components] : undefined
    }
}

function renderClearHistory(data, page, totalPages, target) {
    const components = [];
    const embed = new EmbedBuilder()
        .setDescription(`Выбери **${HistoryNames[data[0].type]}**, который хотите очистить и нажмите на кнопку, соответствующую его номеру`)
        .setColor(Utility.colorDiscord)
        .setFields([{
            name: '```   Тип / Дата   ```',
            value: data.map((p, i) => `**#${(page - 1) * 3 + i + 1}**${HistoryEmojis[p.type]}<t:${Math.round(p.createdAt.getTime() / 1000)}:d>`).join('\n'),
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
    components.push(...data.map((p) =>
        new ButtonBuilder()
            .setCustomId(`chistory_delete_${data[0].type}_${target.id}_${p.id}`)
            .setEmoji('🟥')
            .setStyle(ButtonStyle.Primary)
    ))
    if (totalPages > 1) {
        embed.setFooter({ text: `Страница ${page}/${totalPages}` })
        components.unshift(
            new ButtonBuilder()
                .setCustomId(`chistory_left_${data[0].type}_${target.id}`)
                .setEmoji('◀')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(page === 1)
        )
        components.push(
            new ButtonBuilder()
                .setCustomId(`chistory_right_${data[0].type}_${target.id}`)
                .setEmoji('▶')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(page === totalPages)
        )
    }
    return {
        embeds: [embed], components: [new ActionRowBuilder().addComponents(components)]
    }
}
module.exports = { renderHistory, renderClearHistory }