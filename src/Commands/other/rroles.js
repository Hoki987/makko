//===========================================/ Import the modeles \===========================================\\
const { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
//==========< OTHERS >==========\\
const { Utility, StaffChats, StaffRoles, UntilsRoles } = require('../../../config.js');
//===========================================< Code >===========================================\\
module.exports = {
    data: new SlashCommandBuilder()
        .setName("rroles")
        .setDescription("Очищает роли пользователя")
        .setDMPermission(false)
        .addUserOption((target) => target.setName('пользователь').setDescription("Выбери пользователя").setRequired(true)),

    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */

    async execute(client, interaction) {
        const getUser = interaction.options.get('пользователь');

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
                badDescription = `\`\`\`Недостаточно прав!\`\`\``;
                color = Utility.colorRed;
                break;
            default:
                description = `Роли <@${getUser.user.id}> были очищены`
                color = Utility.colorYellow
                await getUser.member.roles.cache.forEach(r => {
                    if (Object.values(UntilsRoles).includes(r.id)) {
                        return;
                    } else {
                        getUser.member.roles.remove(r.id)
                    }
                })
                break;
        }
        const embed = new EmbedBuilder().setDescription(description || badDescription).setColor(color)

        if (badDescription) {
            await interaction.editReply({ embeds: [embed] }) && client.channels.cache.get(StaffChats.Logs).send({ embeds: [embed.setTitle(`**Команда: </rroles:1168068122423599214>**`).setFields({ name: "`Пользователь`", value: `<@${interaction.user.id}>`, inline: true }, { name: "`Использовалось на`", value: `<@${getUser.user.id}>`, inline: true })] })
        } else {
            await interaction.editReply({ embeds: [embed] }) && client.channels.cache.get(StaffChats.Logs).send({ embeds: [embed.setFooter({ iconURL: interaction.user.avatarURL(), text: `Выполнил(а): ${interaction.user.username}` })] })
        }
    }
}