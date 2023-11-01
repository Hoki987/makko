//===========================================/ Import the modeles \===========================================\\
const { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
//==========< OTHERS >==========\\
const { Utility, StaffChats, StaffRoles, UntilsRoles } = require('../../../config.js');
//===========================================< Code >===========================================\\
module.exports = {
    data: new SlashCommandBuilder()
        .setName("clear")
        .setDescription("Удаляет сообщения в чате")
        .setDMPermission(false)
        .addNumberOption(num => num.setName('количество').setDescription('Количество удаляемых сообщений').setMinValue(1).setMaxValue(99).setRequired(true)) // если поставить в maxValue 100, то будет выдавать ошибку с NUMBER_TYPE_MAX
        .addUserOption((target) => target.setName('пользователь').setDescription("Выбери пользователя")),

    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */

    async execute(client, interaction) {
        const getUser = interaction.options.get('пользователь');
        const getAmmount = interaction.options.getNumber('количество')

        let description;
        const messages = interaction.channel.messages.fetch({
            limit: getAmmount + 1,
        });

        if (getUser) {
            let i = 0;
            const filtered = [];

            (await messages).filter((message) => {
                if (message.author.id === getUser.user.id && getAmmount > i) {
                    filtered.push(message)
                    i++
                }
            });

            await interaction.channel.bulkDelete(getAmmount, true).then(messages => {
                description = `Очищено **${messages.size}** сообщений от <@${getUser.user.id}>`
            })
        } else {
            await interaction.channel.bulkDelete(getAmmount, true).then(messages => {
                description = `Очищено **${messages.size}** сообщений`
            })
        }
        
        const embed = new EmbedBuilder().setDescription(description).setColor(Utility.colorDiscord)
        await interaction.reply({ embeds: [embed] }) && client.channels.cache.get(StaffChats.Logs).send({ embeds: [embed.setTitle(`Чат: <#${interaction.channel.id}>`).setFooter({ iconURL: interaction.user.avatarURL(), text: `Выполнил(а): ${interaction.user.username}` })] })
    }
}