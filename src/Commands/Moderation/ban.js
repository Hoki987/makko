//===========================================/ Import the modeles \===========================================\\
const { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { Op } = require('sequelize');

//==========< OTHERS >==========\\
const { WorkRoles, StuffRoles, Utility, Reasons } = require('../../../config.js');
const History = require('../../Structures/Models/History.js');
const { doc } = require('../../Structures/Untils/googlesheet.js')
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
        await doc.loadInfo();
        const getUser = interaction.options.get('пользователь');
        const getReason = interaction.options.getString('причина');

        const hasRole = (id) => getUser.member.roles.cache.has(id);
        const hasBan = (banType) => Object.values(banType).includes(getReason);

        const sheet = doc.sheetsById[1162940648];

        const memberPosition = interaction.member.roles.cache.filter(r => Object.values(StuffRoles).includes(r.id))?.sort((a, b) => b.position - a.position)?.first()?.position || 1;
        const targetPosition = getUser.member.roles.cache.filter(r => Object.values(StuffRoles).includes(r.id))?.sort((a, b) => b.position - a.position)?.first()?.position || 0;

        let description;
        let color;
        let expiresAt;
        let AppelDesc;

        await interaction.deferReply()
        switch (true) {
            case hasBan(Reasons.perm):
                description = `**[${Utility.banEmoji}]** Пользователь ${getUser.user} был **забанен навсегда**\n\`\`\`Причина: ${getReason || 'Отсутствует'} \`\`\``
                color = Utility.colorGreen
                expiresAt = new Date(Date.now() + 1000)
                break;
            case hasBan(Reasons.temp):
                const permBan = [`**[${Utility.banEmoji}]** Пользователь ${getUser.user} был **забанен навсегда**\n\`\`\`Причина: ${getReason || 'Отсутствует'} \`\`\``, Utility.colorGreen, new Date(Date.now() + 26000000 * 1000000), '**навсегда**']
                const monthBan = [`**[${Utility.banEmoji}]** Пользователь ${getUser.user} был **забанен на 30 дней**\n\`\`\`Причина: ${getReason || 'Отсутствует'} \`\`\``, Utility.colorGreen, new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), '**на 30 дней**']
                const records = await History.count({ where: { target: getUser.user.id, reason: getReason, type: 'ban' }, })
                description = records ? permBan[0] : monthBan[0]
                color = records ? permBan[1] : monthBan[1]
                expiresAt = records ? permBan[2] : monthBan[2]
                AppelDesc = records ? permBan[3] : monthBan[3]
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
                description = `**[${Utility.banEmoji}]** Пользователь ${getUser.user} не был **забанен**\n\`\`\`Причина: уже в бане\`\`\``
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

                const embedAppel = new EmbedBuilder().setTitle(`[${Utility.banEmoji}] Вы получили бан ` + AppelDesc).setDescription(`\`\`\`Причина: ${getReason} \`\`\` \n${Utility.pointEmoji} Если хотите оспорить наказание, нажмите **на кнопку ниже.**\n${Utility.pointEmoji} Имейте ввиду, что для быстрого решения вопроса вам лучше \n${Utility.fonEmoji} иметь **доказательства** свой невиновности.\n${Utility.pointEmoji} Если ваше обжалование будет сформировано неадекватно,\n ${Utility.fonEmoji} **оно будет закрыто.**`).setColor(Utility.colorDiscord).setFooter({ text: `Выполнил(а) ${interaction.user.tag} | ` + 'Сервер ' + interaction.guild.name, iconURL: interaction.user.displayAvatarURL() });
                const AppelButton = new ButtonBuilder().setCustomId('AppelButton').setLabel('ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤОбжаловатьㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ').setStyle(ButtonStyle.Primary);

                await sheet.loadCells()
                const rows = await sheet.getRows();
                const row = rows.find((r) => r._rawData.includes(interaction.user.id))
                const day = (new Date().getDay() + 1) % 7
                const cell = sheet.getCell(row.rowNumber - 1, 10 + day * 7)
                cell.value = Number(cell.value || 0) + 1
                sheet.saveUpdatedCells();

                await getUser.user.send({ embeds: [embedAppel], components: [new ActionRowBuilder().addComponents(AppelButton)] });
                break;
        }
        const embed = new EmbedBuilder().setDescription(description).setColor(color).setFooter({ text: 'Сервер:' + Utility.guildName, iconURL: Utility.guildAvatar });

        await interaction.editReply({ embeds: [embed] });
    }
}
