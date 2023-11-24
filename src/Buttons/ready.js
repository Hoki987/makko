//===========================================/ Import the modeles \===========================================\\
const { Client, SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonInteraction, EmbedBuilder } = require('discord.js');

//==========< OTHERS >==========\\
const History = require('../Structures/Models/History.js');
const { renderHistory } = require('../Structures/Untils/render.js');
const Obhod = require('../Structures/Models/Obhod.js');
const { action, timeAction } = require('../Structures/Untils/Functions/action.js');
const { StaffServerRoles } = require('../../config.js');
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
            .setDescription(`**Принял обход: <@${interaction.user.id}> | ${interaction.user.id}**`)
            .setFooter({ text: 'Время начала', iconURL: interaction.guild.iconURL() })
            .setTimestamp()
        switch (interaction.customId.split('_')[1]) {
            case 'accept':
                await Obhod.create({ target: interaction.user.id, status: 'active' })
                await interaction.message.edit({ content: 'Обход активен', embeds: [embed], components: [{ components: [{ ...interaction.message.components[0].components[0].data, customId: `ready_active_${interaction.user.id}`, label: 'Закончить обход', style: 4 }] }] }) &&
                    await interaction.reply({ content: 'Ты начал обход! Можешь начать модерить войсы.', ephemeral: true })
                break;
            case 'active':
                if (!interaction.user.id || !hasRoleExecutor(StaffServerRoles.Admin || StaffServerRoles.Curator || StaffServerRoles.Moderator)) {
                    await interaction.reply({ content: 'Ничего не произошло :с', ephemeral: true })
                } else {
                    await Obhod.update({ endAt: new Date(Date.now()), status: 'inactive' }, { where: { target: interaction.user.id, status: 'active' } })
                    await interaction.message.edit({ content: 'Обход окончен', embeds: [{ ...interaction.message.embeds[0].data, description: `${interaction.message.embeds[0].data.description}\n**Закончил обход: <@${interaction.user.id}> | ${interaction.user.id}**`, timestamp: new Date(Date.now()), footer: { text: 'Время конца обхода:', icon_url: interaction.guild.iconURL() } }], components: [] }) &&
                        await interaction.reply({ content: 'Обход был завершен!', ephemeral: true })
                    if (await countStaff(interaction.user.id) != 0) {
                        const findObhod = await Obhod.findOne({ where: { target: interaction.user.id, status: 'inactive' } });
                        const time = findObhod.endAt.getTime() - findObhod.createdAt.getTime()
                        let sheet = 1162940648
                        action(sheet, findObhod.target, 11) && timeAction(sheet, findObhod.target, 12, Math.floor((time / (1000 * 60)) % 60))
                        await Obhod.destroy({ where: { target: findObhod.target, status: 'inactive' } })
                    } else {
                        break;
                    }
                }
                break;
        }
    }
}