//===========================================/ Import the modeles \===========================================\\
const { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require('discord.js');

//==========< OTHERS >==========\\
const color = require('colors');
const { WorkRoles, StuffRoles, Utility } = require('../../../config.js');

//===========================================< Code >===========================\\
module.exports = {
    data: new SlashCommandBuilder()
        .setName("ban")
        .setDescription('Банит выбранного пользователя')
        .setDMPermission(false)
        .addUserOption((banUser) => banUser.setName("пользователь").setDescription("Выбери пользователя").setRequired(true))
        .addStringOption((reason) => reason.setName("причина").setDescription("Введи причину бана").addChoices(
            { name: 'переход', value: 'переход' },
            { name: '4.4', value: '4.4' },
            { name: '3.1', value: '3.1' },
            { name: '3.3', value: '3.3' },
            { name: '3.6', value: '3.6' },
            { name: '3.7', value: '3.7' },
            { name: '3.8', value: '3.8' },
            { name: '3.9', value: '3.9' },
            { name: '3.10', value: '3.10' },
            { name: '3.11', value: '3.11' },
            { name: '3.13', value: '3.13' },
            { name: '4.3', value: '4.3' },
            { name: '<13', value: '<13' },
        )),

    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */

    async execute(client, interaction) {
        let description;  // присваивать это все в switch - case 
        let color;
        
        const NotBanYourself = new EmbedBuilder()
            .setColor(Utility.colorRed)
            .setDescription('**Вы не можете забанить сами себя!**')
            .setFooter({ text: 'Сервер:' + Utility.guildName, iconURL: Utility.guildAvatar });

        const NotBanBot = new EmbedBuilder()
            .setColor(Utility.colorRed)
            .setDescription('**Вы не можете забанить бота!**')
            .setFooter({ text: 'Сервер:' + Utility.guildName, iconURL: Utility.guildAvatar });

        const NotBanRoleHigh = new EmbedBuilder()
            .setColor(Utility.colorRed)
            .setTitle('**Пользователь не был забанен!**')
            .setDescription('**Причина:** Позиция человека в стаффе выше, чем ваша.')
            .setFooter({ text: 'Сервер:' + Utility.guildName, iconURL: Utility.guildAvatar });

        const NotBanRoleEquals = new EmbedBuilder()
            .setColor(Utility.colorRed)
            .setTitle('**Пользователь не был забанен!**')
            .setDescription('**Причина:** Позиция человека в стаффе равна вашей.')
            .setFooter({ text: 'Сервер:' + Utility.guildName, iconURL: Utility.guildAvatar });  // сделать 1 эмбед, которпый будет меняться в switch - case (disc - color)

        const BanNo = new EmbedBuilder()
            .setColor(Utility.colorRed)
            .setTitle('**Пользователь не был забанен!**')
            .setDescription('**Причина:** Пользователь уже в бане.')
            .setFooter({ text: 'Сервер:' + Utility.guildName, iconURL: Utility.guildAvatar });

        const BanOk = new EmbedBuilder()
            .setColor(Utility.colorGreen)
            .setTitle('**Пользователь был забанен!**')
            .setDescription('**Причина: **' + '`' + `${getReason}` + '`')
            .setFooter({ text: 'Сервер:' + Utility.guildName, iconURL: Utility.guildAvatar });

        const BanOkNoReason = new EmbedBuilder()
            .setColor(Utility.colorGreen)
            .setTitle('**Пользователь был забанен!**')
            .setDescription('**Причина: **' + '`' + 'пусто' + '`')
            .setFooter({ text: 'Сервер:' + Utility.guildName, iconURL: Utility.guildAvatar });

        const getUser = interaction.options.get('пользователь');
        const getReason = interaction.options.getString('причина');

        const memberPosition = interaction.member.roles.cache.filter(r => Object.values(StuffRoles).includes(r.id))?.sort((a, b) => b.position - a.position)?.first()?.position || 1;
        const targetPosition = getUser.member.roles.cache.filter(r => Object.values(StuffRoles).includes(r.id))?.sort((a, b) => b.position - a.position)?.first()?.position || 0;

        await interaction.deferReply()
        if (interaction.user.id === getUser.member.id) {  // переделать под switch - case 
        await  interaction.reply({ embeds: [NotBanYourself] }) // обязательно все await'ить 
        } else if (getUser.user.bot === true) {
        await  interaction.reply({ embeds: [NotBanBot] })
        } else if (memberPosition < targetPosition) {
            interaction.reply({ embeds: [NotBanRoleHigh] })
        } else if (memberPosition == targetPosition) {
            interaction.reply({ embeds: [NotBanRoleEquals] })
        } else if (memberPosition > targetPosition) {
            const hasRole = (id) => getUser.member.roles.cache.has(id);

            if (hasRole(WorkRoles.Ban)) {
                interaction.reply({ embeds: [BanNo] })
            } else {
                if (getReason == null) {
                    getUser.member.roles.add(WorkRoles.Ban)
                    interaction.reply({ embeds: [BanOkNoReason] })
                } else {
                    getUser.member.roles.add(WorkRoles.Ban)
                    interaction.reply({ embeds: [BanOk] })
                }
            }
        }
    }
}
