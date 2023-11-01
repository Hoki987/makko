//===========================================/ Import the modeles \===========================================\\
const { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

//==========< OTHERS >==========\\
const { Utility, StaffChats, StaffRoles, WorkRoles, NotRrolls } = require('../../../config.js');
//===========================================< Code >===========================================\\
module.exports = {
    data: new SlashCommandBuilder()
        .setName("rroles")
        .setDescription("Очищает роли пользователя")
        .setDMPermission(false)
        .addUserOption((target) => target.setName('пользователь').setDescription("Выбери пользователя")),

    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */

    async execute(client, interaction) {
        const getUser = interaction.options.get('пользователь');
        const hasRole = (id) => getUser.member.roles.cache.has(id);

        const memberPosition = interaction.member.roles.cache.filter(r => Object.values(StaffRoles).includes(r.id))?.sort((a, b) => b.position - a.position)?.first()?.position || 1;
        const targetPosition = getUser.member.roles.cache.filter(r => Object.values(StaffRoles).includes(r.id))?.sort((a, b) => b.position - a.position)?.first()?.position || 0;

        let description;
        let badDescription
        let color;

        await interaction.deferReply()
        switch (true) {
            case interaction.user.id === getUser.member.id:
            case getUser.user.bot:
            case memberPosition <= targetPosition:
                description = '**Недостаточно прав!**';
                color = Utility.colorRed;
                break;
            default:
                description = `Роли <@${getUser.user.id}> были очищены`
                color = Utility.colorYellow
                await getUser.member.roles.cache.forEach(r => {
                    if (Object.values(NotRrolls).includes(r.id)) {
                        return;
                    } else {
                        getUser.member.roles.remove(r.id)
                    }
                })
                break;
        }
        const embed = new EmbedBuilder().setDescription(description || badDescription).setColor(color)

        if (badDescription) {
            await interaction.editReply({ embeds: [embed] }) && client.channels.cache.get(StaffChats.Logs).send({ embeds: [embed.setTitle(`**Команда: </arrole:1167037867151867956>**`).setFields({ name: "`Пользователь`", value: `<@${getUser.user.id}>`, inline: true }, { name: "`Выдаваемая роль`", value: `<@&${getRole}>`, inline: true }).setFooter({ iconURL: interaction.user.avatarURL(), text: `Выполнил(а): ${interaction.user.username}` })] })
        } else {
            await interaction.editReply({ embeds: [embed] }) && client.channels.cache.get(StaffChats.Logs).send({ embeds: [embed.setFooter({ iconURL: interaction.user.avatarURL(), text: `Выполнил(а): ${interaction.user.username}` })] })
        }
    }
}