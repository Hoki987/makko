//===========================================/ Import the modeles \===========================================\\
const { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { Op } = require('sequelize');

//==========< OTHERS >==========\\
const { WorkRoles, StuffRoles, Utility } = require('../../../config.js');
const History = require('../../Structures/Models/History.js');

//===========================================< Code >===========================\\
module.exports = {
    data: new SlashCommandBuilder()
        .setName("ban")
        .setDescription('Банит выбранного пользователя')
        .setDMPermission(false)
        .addUserOption((banUser) => banUser.setName("пользователь").setDescription("Выбери пользователя").setRequired(true))
        .addStringOption((reason) => reason.setName("причина").setDescription("Введи причину бана").setRequired(true).addChoices(
            { name: 'переход', value: 'переход' }, // бан навсегда
            { name: '4.4', value: '4.4' }, // 2 бана по причине - бан навсегда
            { name: '3.1', value: '3.1' }, // 2 бана по причине - бан навсегда
            { name: '3.3', value: '3.3' }, // 2 бана по причине - бан навсегда
            { name: '3.6', value: '3.6' }, // 2 бана по причине - бан навсегда
            { name: '3.7', value: '3.7' }, // 2 бана по причине - бан навсегда
            { name: '3.8', value: '3.8' }, // 2 бана по причине - бан навсегда
            { name: '3.9', value: '3.9' }, // бан навсегда. если человек получает варн по этой причине, то + неделя бана
            { name: '3.10', value: '3.10' }, // 2 бана по причине - бан навсегда
            { name: '3.11', value: '3.11' }, // 2 бана по причине - бан навсегда
            { name: '3.13', value: '3.13' }, // 2 бана по причине - бан навсегда
            { name: '4.3', value: '4.3' },
            { name: '<13', value: '<13' }, // бан навсегда
        )),

    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */

    async execute(client, interaction) {
        const getUser = interaction.options.get('пользователь');
        const getReason = interaction.options.getString('причина');
        const hasRole = (id) => getUser.member.roles.cache.has(id);

        const memberPosition = interaction.member.roles.cache.filter(r => Object.values(StuffRoles).includes(r.id))?.sort((a, b) => b.position - a.position)?.first()?.position || 1;
        const targetPosition = getUser.member.roles.cache.filter(r => Object.values(StuffRoles).includes(r.id))?.sort((a, b) => b.position - a.position)?.first()?.position || 0;

        // const findActiveBan = History.findAll({ where: { status: active } });

        let description;
        let color;
        let expiresAt;

        await interaction.deferReply()

        switch (getReason) {
            case 'переход':
                description = `**[<:ban:1155041800319422555>]** Пользователь ${getUser.user} был **забанен навсегда**\n\`\`\`Причина: ${getReason || 'Отсутствует'} \`\`\``
                color = Utility.colorGreen
                expiresAt = new Date(Date.now() + 26000000 * 1000000)
                break;
            case '4.4':
                const permBan = [`**[<:ban:1155041800319422555>]** Пользователь ${getUser.user} был **забанен навсегда**\n\`\`\`Причина: ${getReason || 'Отсутствует'} \`\`\``,  Utility.colorGreen, new Date(Date.now() + 26000000 * 1000000)]
                const monthBan = [`**[<:ban:1155041800319422555>]** Пользователь ${getUser.user} был **забанен на 30 дней**\n\`\`\`Причина: ${getReason || 'Отсутствует'} \`\`\``, color = Utility.colorGreen, expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)]
                const records = await History.count({ where: { [Op.and]: [{ target: getUser.user.id }, { reason: getReason }], }, })
                description = records ? permBan[0] : monthBan[0]
                color = records ? permBan[1] : monthBan[1]
                break;
            case '3.1':
                await History.findAll({
                    where: {
                        target: getUser.user.id,
                        reason: getReason
                    }
                })
                    ?
                    (description = `**[<:ban:1155041800319422555>]** Пользователь ${getUser.user} был **забанен навсегда**\n\`\`\`Причина: ${getReason || 'Отсутствует'} \`\`\``,
                        color = Utility.colorGreen,
                        expiresAt = new Date(Date.now() + 26000000 * 1000000)
                    )
                    :
                    (description = `**[<:ban:1155041800319422555>]** Пользователь ${getUser.user} был **забанен на 30d**\n\`\`\`Причина: ${getReason || 'Отсутствует'} \`\`\``,
                        color = Utility.colorGreen,
                        expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                    )
                break;
            case '3.3':
                await History.findAll({
                    where: {
                        target: getUser.user.id,
                        reason: getReason
                    }
                })
                    ?
                    (description = `**[<:ban:1155041800319422555>]** Пользователь ${getUser.user} был **забанен навсегда**\n\`\`\`Причина: ${getReason || 'Отсутствует'} \`\`\``,
                        color = Utility.colorGreen,
                        expiresAt = new Date(Date.now() + 26000000 * 1000000)
                    )
                    :
                    (description = `**[<:ban:1155041800319422555>]** Пользователь ${getUser.user} был **забанен на 30d**\n\`\`\`Причина: ${getReason || 'Отсутствует'} \`\`\``,
                        color = Utility.colorGreen,
                        expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                    )
                break;
            case '3.6':
                await History.findAll({
                    where: {
                        target: getUser.user.id,
                        reason: getReason
                    }
                })
                    ?
                    (description = `**[<:ban:1155041800319422555>]** Пользователь ${getUser.user} был **забанен навсегда**\n\`\`\`Причина: ${getReason || 'Отсутствует'} \`\`\``,
                        color = Utility.colorGreen,
                        expiresAt = new Date(Date.now() + 26000000 * 1000000)
                    )
                    :
                    (description = `**[<:ban:1155041800319422555>]** Пользователь ${getUser.user} был **забанен на 30d**\n\`\`\`Причина: ${getReason || 'Отсутствует'} \`\`\``,
                        color = Utility.colorGreen,
                        expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                    )
                break;
            case '3.7':
                await History.findAll({
                    where: {
                        target: getUser.user.id,
                        reason: getReason
                    }
                })
                    ?
                    (description = `**[<:ban:1155041800319422555>]** Пользователь ${getUser.user} был **забанен навсегда**\n\`\`\`Причина: ${getReason || 'Отсутствует'} \`\`\``,
                        color = Utility.colorGreen,
                        expiresAt = new Date(Date.now() + 26000000 * 1000000)
                    )
                    :
                    (description = `**[<:ban:1155041800319422555>]** Пользователь ${getUser.user} был **забанен на 30d**\n\`\`\`Причина: ${getReason || 'Отсутствует'} \`\`\``,
                        color = Utility.colorGreen,
                        expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                    )
                break;
            case '3.8':
                await History.findAll({
                    where: {
                        target: getUser.user.id,
                        reason: getReason
                    }
                })
                    ?
                    (description = `**[<:ban:1155041800319422555>]** Пользователь ${getUser.user} был **забанен навсегда**\n\`\`\`Причина: ${getReason || 'Отсутствует'} \`\`\``,
                        color = Utility.colorGreen,
                        expiresAt = new Date(Date.now() + 26000000 * 1000000)
                    )
                    :
                    (description = `**[<:ban:1155041800319422555>]** Пользователь ${getUser.user} был **забанен на 30d**\n\`\`\`Причина: ${getReason || 'Отсутствует'} \`\`\``,
                        color = Utility.colorGreen,
                        expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                    )
                break;
            case '3.9':
                await History.findAll({
                    where: {
                        target: getUser.user.id,
                        reason: getReason
                    }
                })
                    ?
                    (description = `**[<:ban:1155041800319422555>]** Пользователь ${getUser.user} был **забанен навсегда**\n\`\`\`Причина: ${getReason || 'Отсутствует'} \`\`\``,
                        color = Utility.colorGreen,
                        expiresAt = new Date(Date.now() + 26000000 * 1000000)
                    )
                    :
                    (description = `**[<:ban:1155041800319422555>]** Пользователь ${getUser.user} был **забанен на 30d**\n\`\`\`Причина: ${getReason || 'Отсутствует'} \`\`\``,
                        color = Utility.colorGreen,
                        expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                    )
                break;
            case '3.10':
                await History.findAll({
                    where: {
                        target: getUser.user.id,
                        reason: getReason
                    }
                })
                    ?
                    (description = `**[<:ban:1155041800319422555>]** Пользователь ${getUser.user} был **забанен навсегда**\n\`\`\`Причина: ${getReason || 'Отсутствует'} \`\`\``,
                        color = Utility.colorGreen,
                        expiresAt = new Date(Date.now() + 26000000 * 1000000)
                    )
                    :
                    (description = `**[<:ban:1155041800319422555>]** Пользователь ${getUser.user} был **забанен на 30d**\n\`\`\`Причина: ${getReason || 'Отсутствует'} \`\`\``,
                        color = Utility.colorGreen,
                        expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                    )
                break;
            case '3.11':
                await History.findAll({
                    where: {
                        target: getUser.user.id,
                        reason: getReason
                    }
                })
                    ?
                    (description = `**[<:ban:1155041800319422555>]** Пользователь ${getUser.user} был **забанен навсегда**\n\`\`\`Причина: ${getReason || 'Отсутствует'} \`\`\``,
                        color = Utility.colorGreen,
                        expiresAt = new Date(Date.now() + 26000000 * 1000000)
                    )
                    :
                    (description = `**[<:ban:1155041800319422555>]** Пользователь ${getUser.user} был **забанен на 30d**\n\`\`\`Причина: ${getReason || 'Отсутствует'} \`\`\``,
                        color = Utility.colorGreen,
                        expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                    )
                break;
            case '3.13':
                await History.findAll({
                    where: {
                        target: getUser.user.id,
                        reason: getReason
                    }
                })
                    ?
                    (description = `**[<:ban:1155041800319422555>]** Пользователь ${getUser.user} был **забанен навсегда**\n\`\`\`Причина: ${getReason || 'Отсутствует'} \`\`\``,
                        color = Utility.colorGreen,
                        expiresAt = new Date(Date.now() + 26000000 * 1000000)
                    )
                    :
                    (description = `**[<:ban:1155041800319422555>]** Пользователь ${getUser.user} был **забанен на 30d**\n\`\`\`Причина: ${getReason || 'Отсутствует'} \`\`\``,
                        color = Utility.colorGreen,
                        expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                    )
                break;
            case '4.3':
                await History.findAll({
                    where: {
                        target: getUser.user.id,
                        reason: getReason
                    }
                })
                    ?
                    (description = `**[<:ban:1155041800319422555>]** Пользователь ${getUser.user} был **забанен навсегда**\n\`\`\`Причина: ${getReason || 'Отсутствует'} \`\`\``,
                        color = Utility.colorGreen,
                        expiresAt = new Date(Date.now() + 26000000 * 1000000)
                    )
                    :
                    (description = `**[<:ban:1155041800319422555>]** Пользователь ${getUser.user} был **забанен на 30d**\n\`\`\`Причина: ${getReason || 'Отсутствует'} \`\`\``,
                        color = Utility.colorGreen,
                        expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                    )
                break;
            case '<13':
                description = `**[<:ban:1155041800319422555>]** Пользователь ${getUser.user} был **забанен навсегда**\n\`\`\`Причина: ${getReason || 'Отсутствует'} \`\`\``
                color = Utility.colorGreen
                expiresAt = new Date(Date.now() + 26000000 * 1000000)
                break;
        }

        switch (true) {
            case interaction.user.id === getUser.member.id:
            case getUser.user.bot:
            case memberPosition <= targetPosition:
                description = '**Недостаточно прав!**';
                color = Utility.colorRed;
                break;
            case hasRole(WorkRoles.Ban):
                description = `**[<:ban:1155041800319422555>]** Пользователь ${getUser.user} не был **забанен**\n\`\`\`Причина: уже в бане\`\`\``
                color = Utility.colorRed
                break;
            default:
                description
                color
                await History.create({
                    executor: interaction.user.id,
                    target: getUser.user.id,
                    reason: getReason || null,
                    type: 'ban',
                    expiresAt: expiresAt,
                })
                await getUser.member.roles.add(WorkRoles.Ban)
                break;
        }


        const embed = new EmbedBuilder().setDescription(description).setColor(color).setFooter({ text: 'Сервер:' + Utility.guildName, iconURL: Utility.guildAvatar });
        await interaction.editReply({ embeds: [embed] });
        // чс обжалований
        // function unban() {
        //     History.findAll({  })
        // }
        // setInterval(unban, 10000) // 2629800000 - 1 месяц в миллисекундах
    }
}
