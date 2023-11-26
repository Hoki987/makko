//===========================================/ Import the modeles \===========================================\\
const { Client, SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonInteraction, EmbedBuilder } = require('discord.js');

//==========< OTHERS >==========\\
const History = require('../Structures/Models/History.js');
const { renderHistory } = require('../Structures/Untils/render.js');
const Obhod = require('../Structures/Models/Obhod.js');
const { action, timeAction } = require('../Structures/Untils/Functions/action.js');
const { StaffServerRoles, Utility } = require('../../config.js');
const { countStaff } = require('../Structures/Untils/Functions/actionDB.js');

//===========================================< Code >===========================\\
module.exports = {
    data: {
        name: 'ready'
    },

    /**
     * @param {Client} client
     * @param {ButtonInteraction} interaction
     */

    async execute(client, interaction) {
        const hasRoleExecutor = (id) => interaction.member.roles.cache.has(id);

        const embed = new EmbedBuilder()
            .setAuthor({ name: `${interaction.user.username} | ${interaction.user.id}`, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp()
            .setFooter({ text: `Сервер | ${interaction.guild.name}`, iconURL: interaction.guild.iconURL() })
            .setColor(Utility.colorDiscord)
        switch (interaction.customId.split('_')[1]) {
            case 'accept':
                await Obhod.create({ target: interaction.user.id, status: 'active' })
                await interaction.message.edit({ content: 'Обход активен', embeds: [embed], components: [{ components: [{ ...interaction.message.components[0].components[0].data, customId: `ready_active_${interaction.user.id}`, label: 'Закончить обход', style: 4 }] }] }) &&
                    await interaction.reply({ content: 'Ты начал обход! Можешь начать модерить войсы.', ephemeral: true })
                break;
            case 'active':
                const findActive = await Obhod.findOne({ where: { status: 'active' } });
                console.log(findActive);
                if (findActive.target !== interaction.user.id && !hasRoleExecutor(StaffServerRoles.Curator)) {
                    await interaction.reply({ content: 'Ничего не произошло :с', ephemeral: true })
                } else {
                    await Obhod.update({ endAt: new Date(), status: 'inactive' }, { where: { target: findActive.target, status: 'active' } })
                    const findObhod = await Obhod.findOne({ where: { target: findActive.target, status: 'inactive' } });
                    await interaction.message.edit({ content: 'Обход окончен', embeds: [{ ...interaction.message.embeds[0].data, description: `**Закончил обход: <@${interaction.user.id}> | ${interaction.user.id}**`, fields: [{ name: `\`  Начало  \``, value: `**${new Date(findObhod.createdAt).toTimeString().split(' ')[0]}**`, inline: true }, { name: `\`  Конец  \``, value: `**${new Date(findObhod.endAt).toTimeString().split(' ')[0]}**`, inline: true }], timestamp: [] }], components: [] }) &&
                        await interaction.reply({ content: 'Обход был завершен!', ephemeral: true })
                    if (await countStaff(findObhod.target) != 0) {
                        const time = findObhod.endAt.getTime() - findObhod.createdAt.getTime()
                        let sheet = 1162940648
                        action(sheet, findObhod.target, 11) && timeAction(sheet, findObhod.target, 12, Math.floor((time / (1000 * 60)) % 60))
                        await Obhod.destroy({ where: { target: findObhod.target, status: 'inactive' } })
                    } else {
                        await Obhod.destroy({ where: { target: findObhod.target, status: 'inactive' } })
                        break;
                    }
                }
                break;
        }
    }
}