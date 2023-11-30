//===========================================/ Import the modeles \===========================================\\
const { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
//==========< OTHERS >==========\\
const { Utility, HistoryEmojis } = require('../../../config.js');
const History = require('../../Structures/Models/History.js');
//===========================================< Code >===========================\\
module.exports = {
    data: new SlashCommandBuilder()
        .setName("ch")
        .setDescription("Очистка истории нарушений")
        .setDMPermission(false)
        .addUserOption((target) => target.setName('пользователь').setDescription("Выбери пользователя").setRequired(true)),

    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */

    async execute(client, interaction) {
        await interaction.deferReply({ephemeral: true})
        const target = interaction.options.getMember('пользователь') || interaction.member;

        const data = await History.findAll({ where: { target: target.id }, order: [['createdAt', 'DESC']] })
        let description = ''

        if (!data.length) {
            await interaction.editReply({
                embeds: [new EmbedBuilder().setTitle(`История нарушений |  ${target.user.username}`).setDescription('**Пользователь ничего не нарушал**').setColor(Utility.colorDiscord).setThumbnail(target.displayAvatarURL())]
            })
            return;
        } else {
            const warn = data.filter(w => w.type === 'Warn')
            const mute = data.filter(m => m.type === 'Mute')
            const banCam = data.filter(bc => bc.type === 'BanCam')
            const banJPG = data.filter(bj => bj.type === 'BanJPG')
            const ban = data.filter(b => b.type === 'Ban')
            const pred = data.filter(p => p.type === 'Pred')

            if (warn.length) {
                description += `> Количество варнов: ${warn.length}\n`
            }
            if (mute.length) {
                description += `> Количество мутов: ${mute.length}\n`
            }
            if (banCam.length) {
                description += `> Количество запретов камеры: ${banCam.length}\n`
            }
            if (banJPG.length) {
                description += `> Количество запретов картинок: ${banJPG.length}\n`
            }
            if (ban.length) {
                description += `> Количество банов: ${ban.length}\n`
            }
            if (pred.length) {
                description += `> Количество предупреждений: ${pred.length}\n`
            }
            const embed = new EmbedBuilder().setTitle(`Управление нарушениями | ${target.user.tag}`).setDescription(description)
            const btnsMute = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setLabel('Выборочная чистка мутов')
                    .setEmoji(HistoryEmojis.Mute)
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(mute.length === 0)
                    .setCustomId(`chistory_list_Mute_${target.id}`),
                new ButtonBuilder()
                    .setLabel('Очистить все муты')
                    .setEmoji(HistoryEmojis.Mute)
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(mute.length === 0)
                    .setCustomId(`chistory_all_Mute_${target.id}`)
            )
            const btnsWarn = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setLabel('Выборочная чистка варнов')
                    .setEmoji(HistoryEmojis.Warn)
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(warn.length === 0)
                    .setCustomId(`chistory_list_Warn_${target.id}`),
                new ButtonBuilder()
                    .setLabel('Очистить все варны')
                    .setEmoji(HistoryEmojis.Warn)
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(warn.length === 0)
                    .setCustomId(`chistory_all_Warn_${target.id}`)
            )
            const btnsPred = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setLabel('Выборочная чистка предупреждений')
                    .setEmoji(HistoryEmojis.Pred)
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(pred.length === 0)
                    .setCustomId(`chistory_list_Pred_${target.id}`),
                new ButtonBuilder()
                    .setLabel('Очистить все предупреждения')
                    .setEmoji(HistoryEmojis.Pred)
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(pred.length === 0)
                    .setCustomId(`chistory_all_Pred_${target.id}`)
            )
            const btnsBan = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setLabel('Выборочная чистка банов')
                    .setEmoji(HistoryEmojis.Ban)
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(ban.length === 0)
                    .setCustomId(`chistory_list_Ban_${target.id}`),
                new ButtonBuilder()
                    .setLabel('Очистить все баны')
                    .setEmoji(HistoryEmojis.Ban)
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(ban.length === 0)
                    .setCustomId(`chistory_all_Ban_${target.id}`)
            )
            const btnsCamJpg = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setLabel('Выборочная чистка запретов камеры')
                    .setEmoji(HistoryEmojis.BanCam)
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(banCam.length === 0)
                    .setCustomId(`chistory_list_BanCam_${target.id}`),
                new ButtonBuilder()
                    .setLabel('Очистить все запреты камеры')
                    .setEmoji(HistoryEmojis.BanCam)
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(banCam.length === 0)
                    .setCustomId(`chistory_all_BanCam_${target.id}`),
                new ButtonBuilder()
                    .setLabel('Выборочная чистка запретов картинок')
                    .setEmoji(HistoryEmojis.BanJPG)
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(banJPG.length === 0)
                    .setCustomId(`chistory_list_BanJPG_${target.id}`),
                new ButtonBuilder()
                    .setLabel('Очистить все запреты картинок')
                    .setEmoji(HistoryEmojis.BanJPG)
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(banJPG.length === 0)
                    .setCustomId(`chistory_all_BanJPG_${target.id}`)
            )
            await interaction.editReply({ embeds: [embed], components: [btnsMute, btnsWarn, btnsPred, btnsBan, btnsCamJpg] })
        }
    }
}