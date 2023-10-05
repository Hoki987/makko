//===========================================/ Import the modeles \===========================================\\
const { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

//==========< OTHERS >==========\\
const color = require('colors');
const { WorkRoles, Utility } = require('../../../config.js');
const History = require('../../Structures/Models/History.js');
//===========================================< Code >===========================================\\
module.exports = {
    data: new SlashCommandBuilder()
        .setName("warn")
        .setDescription("Выдает варн")
        .setDMPermission(false)
        .addUserOption((target) => target.setName('пользователь').setDescription("Выбери пользователя").setRequired(true))
        .addStringOption((reason) => reason.setName('причина').setDescription('напиши причину предупреждения').setRequired(true)),

    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */

    async execute(client, interaction) {
        const getUser = interaction.options.get('пользователь');
        const getReason = interaction.options.getString('причина');

        const memberPosition = interaction.member.roles.cache.filter(r => Object.values(StuffRoles).includes(r.id))?.sort((a, b) => b.position - a.position)?.first()?.position || 1;
        const targetPosition = getUser.member.roles.cache.filter(r => Object.values(StuffRoles).includes(r.id))?.sort((a, b) => b.position - a.position)?.first()?.position || 0;

        let description
        let color

        await interaction.deferReply()
        switch (true) {
            case interaction.user.id === getUser.member.id:
            case getUser.user.bot:
            case memberPosition <= targetPosition:
                description = '**Недостаточно прав!**';
                color = Utility.colorRed;
                break;
            case findActiveWarn:  
            default:
                description = `**[<:pred:1159081335349063720>] Пользователю <@${getUser.user.id}> было выдано <@&${WorkRoles.Pred}>\n\n\`\`\`Причина: ${getReason}\`\`\`**`
                color = Utility.colorYellow

                const sheet = doc.sheetsById[1162940648];
                await sheet.loadCells()
                const rows = await sheet.getRows();
                const row = rows.find((r) => r._rawData.includes(interaction.user.id))
                const day = (new Date().getDay() + 1) % 7
                const cell = sheet.getCell(row.rowNumber - 1, 9 + day * 7)

                cell.value = Number(cell.value || 0) + 1
                sheet.saveUpdatedCells();

                const embedAppel = new EmbedBuilder().setTitle(`[${Utility.banEmoji}] Вы получили warn на 14 дней`).setDescription(`\`\`\`Причина: ${getReason} \`\`\` \n${Utility.pointEmoji} Если хотите оспорить наказание, нажмите **на кнопку ниже.**\n${Utility.pointEmoji} Имейте ввиду, что для быстрого решения вопроса вам лучше \n${Utility.fonEmoji} иметь **доказательства** свой невиновности.\n${Utility.pointEmoji} Если ваше обжалование будет сформировано неадекватно,\n ${Utility.fonEmoji} **оно будет закрыто.**`).setColor(Utility.colorDiscord).setFooter({ text: `Выполнил(а) ${interaction.user.tag} | ` + 'Сервер ' + interaction.guild.name, iconURL: interaction.user.displayAvatarURL() });
                const AppelButton = new ButtonBuilder().setCustomId('AppelButton').setLabel('ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤОбжаловатьㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ').setStyle(ButtonStyle.Primary);

                await History.create({
                    executor: interaction.user.id,
                    target: getUser.user.id,
                    reason: getReason,
                    type: 'warn',
                    expiresAt: new Date(Date.now() + 1209600000), // 14 дней
                })

                await getUser.user.send({ embeds: [embedAppel], components: [new ActionRowBuilder().addComponents(AppelButton)] });
                break;
        }
        const embed = new EmbedBuilder().setColor(color).setDescription(description)

        await interaction.editReply({ embeds: [embed] })
    }
}