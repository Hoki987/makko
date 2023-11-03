//===========================================/ Import the modeles \===========================================\\
const { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
//==========< OTHERS >==========\\
const { WorkRoles, Utility, StaffRoles, StaffChats, HistoryEmojis } = require('../../../config.js');
const { doc, docAssist } = require('../../Structures/Untils/googlesheet.js');
const { Op } = require('sequelize');
const History = require('../../Structures/Models/History.js');
//===========================================< Code >===========================================\\
module.exports = {
    data: new SlashCommandBuilder()
        .setName("pred")
        .setDescription("Выдает предупреждение")
        .setDMPermission(false)
        .addUserOption((target) => target.setName('пользователь').setDescription("Выбери пользователя").setRequired(true))
        .addStringOption((reason) => reason.setName('причина').setDescription('напиши причину предупреждения').setRequired(true)),

    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */

    async execute(client, interaction) {
        if (![StaffChats.Assistant, StaffChats.Control].includes(interaction.channel.id)) {
            await interaction.reply({
                ephemeral: true,
                content: 'Используйте чат, соответствующий вашей стафф роли!'
            })
            return
        }
        const isAssistant = interaction.channel.id === StaffChats.Assistant
        const isControl = interaction.channel.id === StaffChats.Control

        const getUser = interaction.options.get('пользователь');
        const getReason = interaction.options.getString('причина');
        const hasRoleExecutor = (id) => interaction.member.roles.cache.has(id);
        const hasRole = (id) => getUser.member.roles.cache.has(id);

        const memberPosition = interaction.member.roles.cache.filter(r => Object.values(StaffRoles).includes(r.id))?.sort((a, b) => b.position - a.position)?.first()?.position || 1;
        const targetPosition = getUser.member.roles.cache.filter(r => Object.values(StaffRoles).includes(r.id))?.sort((a, b) => b.position - a.position)?.first()?.position || 0;

        let description;
        let badDescription;
        let color;
        let staffSheet;
        let customId;

        await interaction.deferReply()

        switch (true) {
            case isControl:
                await doc.loadInfo()
                staffSheet = doc.sheetsById[1162940648]
                customId = 'ControlAppelButton'
                break;
            case isAssistant:
                await docAssist.loadInfo()
                staffSheet = docAssist.sheetsById[0]
                customId = 'AssistAppelButton'
                break;
        }

        switch (true) {
            case interaction.user.id === getUser.member.id:
            case getUser.user.bot:
            case memberPosition <= targetPosition:
                description = `\`\`\`Недостаточно прав!\`\`\``;
                color = Utility.colorRed;
                break;
            case hasRole(WorkRoles.Pred):
                const activePred = await History.findOne({
                    where: {
                        target: getUser.user.id,
                        type: 'Pred',
                        expiresAt: { [Op.gt]: new Date() },
                    }
                })
                if (activePred) {
                    description = `**[${HistoryEmojis.Pred}] Пользователю <@${getUser.user.id}> не было выдано <@&${WorkRoles.Pred}>\n\`\`\`ansi\n[2;35m[2;30m[2;35mПричина:[0m[2;30m[0m[2;35m[0m [2;36mуже имеется предупреждение[0m\`\`\`**`
                    color = Utility.colorRed
                } else {
                    description = `**[${HistoryEmojis.Pred}] Активные записи отсутствуют! Предупреждение будет снято.**`
                    color = Utility.colorRed
                    getUser.member.roles.remove(WorkRoles.Pred)
                }
                break;
            default:
                async function fetchStaff(user, staffSheet) {
                    const sheet = staffSheet;
                    await sheet.loadCells()
                    const rows = await sheet.getRows();
                    const row = rows.find((r) => r._rawData.includes(user))
                    const day = (new Date().getDay() + 1) % 7
                    const cell = sheet.getCell(row.rowNumber - 1, 8 + day * 7)

                    cell.value = Number(cell.value || 0) + 1
                    sheet.saveUpdatedCells();
                }

                try {
                    if (hasRoleExecutor(StaffRoles.Admin || StaffRoles.Developer || StaffRoles.Moderator) || ['295493530548174848', '297372127768870913'].includes(interaction.user.id)) {
                        description = `**[${HistoryEmojis.Pred}] Пользователю <@${getUser.user.id}> было выдано <@&${WorkRoles.Pred}>\n\`\`\`ansi\n[2;35m[2;30m[2;35mПричина:[0m[2;30m[0m[2;35m[0m [2;36m${getReason}[0m\`\`\`**`
                        color = Utility.colorYellow
                    } else {
                        await fetchStaff(interaction.user.id, staffSheet)
                        description = `**[${HistoryEmojis.Pred}] Пользователю <@${getUser.user.id}> было выдано <@&${WorkRoles.Pred}>\n\`\`\`ansi\n[2;35m[2;30m[2;35mПричина:[0m[2;30m[0m[2;35m[0m [2;36m${getReason}[0m\`\`\`**`
                        color = Utility.colorYellow
                    }
                } catch (error) {
                    console.log(error);
                    badDescription = `**Вы не являетесь** \`Контролом / Ассистентом\``
                    color = Utility.colorDiscord
                    break;
                }
                const embedAppel = new EmbedBuilder().setTitle(`[${HistoryEmojis.Pred}] Вы получили предупреждение на 24 часа`).setDescription(`\`\`\`ansi\n[2;35m[2;30m[2;35mПричина:[0m[2;30m[0m[2;35m[0m [2;36m${getReason}[0m\`\`\` \n${Utility.pointEmoji} Если хотите оспорить наказание, нажмите **на кнопку ниже.**\n${Utility.pointEmoji} Имейте ввиду, что для быстрого решения вопроса вам лучше \n${Utility.fonEmoji} иметь **доказательства** свой невиновности.\n${Utility.pointEmoji} Если ваше обжалование будет сформировано неадекватно,\n ${Utility.fonEmoji} **оно будет закрыто.**`).setColor(Utility.colorDiscord).setFooter({ text: `Выполнил(а) ${interaction.user.tag} | ` + 'Сервер ' + interaction.guild.name, iconURL: interaction.user.displayAvatarURL() });
                const AppelButton = new ButtonBuilder().setCustomId(customId).setLabel('ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤОбжаловатьㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ').setStyle(ButtonStyle.Primary);

                await History.create({
                    executor: interaction.user.id,
                    target: getUser.user.id,
                    reason: getReason,
                    type: 'Pred',
                    expiresAt: new Date(Date.now() + 86400000), // 24 часа
                })
                await getUser.member.roles.add(WorkRoles.Pred)
                await getUser.user.send({ embeds: [embedAppel], components: [new ActionRowBuilder().addComponents(AppelButton)] });
                break;
        }
        console.log(description);
        console.log(badDescription);
        const embed = new EmbedBuilder().setColor(color).setDescription(description || badDescription)
        if (badDescription) {
            await interaction.editReply({ embeds: [embed] }) && client.channels.cache.get(StaffChats.Logs).send({ embeds: [embed.setTitle(`**Команда: </pred:1159075761681092658>**`).setFields({ name: "`Пользователь`", value: `<@${interaction.user.id}>`, inline: true }, { name: "`Использовал на`", value: `<@${getUser.user.id}>`, inline: true })] })
        } else {
            await interaction.editReply({ embeds: [embed] }) && client.channels.cache.get(StaffChats.Logs).send({ embeds: [embed.setFooter({ iconURL: interaction.user.avatarURL(), text: `Выполнил(а): ${interaction.user.username}` })]})
        }
    }
}