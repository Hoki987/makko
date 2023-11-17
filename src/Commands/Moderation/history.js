//===========================================/ Import the modeles \===========================================\\
const { Client, ChatInputCommandInteraction, SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require('discord.js');

//==========< OTHERS >==========\\
const color = require('colors');
const { Utility } = require('../../../config.js');
const History = require('../../Structures/Models/History.js');
const { renderHistory } = require('../../Structures/Untils/render.js');

//===========================================< Code >===========================\\
module.exports = {
    data: new SlashCommandBuilder()
        .setName("history")
        .setDescription("Выводит историю нарушений")
        .setDMPermission(false)
        .addUserOption((target) => target.setName('пользователь').setDescription("Выбери пользователя")),

    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */

    async execute(client, interaction) {
        await interaction.deferReply()
        const target = interaction.options.getMember('пользователь') || interaction.member

        const history = await History.findAll({ where: { target: target.id }, order: [['createdAt', 'DESC']] })
        let description = ''
        if (!history.length) {
            await interaction.editReply({
                embeds: [new EmbedBuilder().setTitle(`История нарушений |  ${target.user.username}`).setDescription('**Пользователь ничего не нарушал**').setColor(Utility.colorDiscord).setThumbnail(target.displayAvatarURL())]
            })
            return;
        } else {
            const warns = history.filter(w => w.type === 'Warn' && w.expiresAt.getTime() > Date.now())
            const mute = history.find(m => m.type === 'Mute' && m.expiresAt.getTime() > Date.now())
            const banCam = history.find(bc => bc.type === 'BanCam' && bc.expiresAt.getTime() > Date.now())
            const banJPG = history.find(bj => bj.type === 'BanJPG' && bj.expiresAt.getTime() > Date.now())
            const ban = history.find(b => b.type === 'Ban' && b.expiresAt || b.expiresAt?.getTime() > Date.now())
            const pred = history.find(p => p.type === 'Pred' && p.expiresAt.getTime() > Date.now())

            if (warns.length) {
                description += `Активных варнов: ${warns.length}\n`
            }
            if (mute) {
                description += `Мут истекает <t:${Math.floor(mute.expiresAt.getTime() / 1000)}:R>\n`
            }
            if (banCam) {
                description += `Запрет камеры истекает <t:${Math.floor(banCam.expiresAt.getTime() / 1000)}:R>\n`
            }
            if (banJPG) {
                description += `Запрет картинок истекает <t:${Math.floor(banJPG.expiresAt.getTime() / 1000)}:R>\n`
            }
            if (ban) {
                description += `Бан истекает **никогда**\n` || `Бан истекает <t:${Math.floor(ban.expiresAt.getTime() / 1000)}:R>\n`
            }
            if (pred) {
                description += `Предупреждение истекает <t:${Math.floor(pred.expiresAt.getTime() / 1000)}:R>\n`
            }

        }
        await interaction.editReply(renderHistory(history.slice(0, 10), 1, Math.ceil(history.length / 10), description, target, interaction.user.id))
    }
}