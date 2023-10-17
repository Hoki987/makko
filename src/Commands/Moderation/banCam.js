//===========================================/ Import the modeles \===========================================\\
const { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

//==========< OTHERS >==========\\
const color = require('colors');
const { WorkRoles, Utility, StaffRoles } = require('../../../config.js');
const History = require('../../Structures/Models/History.js');
//===========================================< Code >===========================================\\
module.exports = {
    data: new SlashCommandBuilder()
        .setName("bancam")
        .setDescription("Причины для выдачи: 3.2 | 3.4 | 3.12 | 4.3")
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
        const hasRole = (id) => getUser.member.roles.cache.has(id);

        const memberPosition = interaction.member.roles.cache.filter(r => Object.values(StaffRoles).includes(r.id))?.sort((a, b) => b.position - a.position)?.first()?.position || 1;
        const targetPosition = getUser.member.roles.cache.filter(r => Object.values(StaffRoles).includes(r.id))?.sort((a, b) => b.position - a.position)?.first()?.position || 0;

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
            case hasRole(WorkRoles.BanCam):
                description = `**[<:pred:1159081335349063720>] Пользователю <@${getUser.user.id}> не было выдано <@&${WorkRoles.BanCam}>\n\n\`\`\`Причина: уже имеется banCam\`\`\`**`
                color = Utility.colorRed
                break;
            default:
                description = `**[<:pred:1159081335349063720>] Пользователю <@${getUser.user.id}> был выдан <@&${WorkRoles.BanCam}> на 14 дней\n\n\`\`\`Причина: ${getReason}\`\`\`**`
                color = Utility.colorYellow

                await History.create({
                    executor: interaction.user.id,
                    target: getUser.user.id,
                    reason: getReason,
                    type: 'BanCam',
                    expiresAt: new Date(Date.now() + 1209600000), // 14 дней
                })

                const embedAppel = new EmbedBuilder().setTitle(`[${Utility.banEmoji}] Вы получили banCam на 14 дней`).setDescription(`\`\`\`Причина: ${getReason} \`\`\` \n${Utility.pointEmoji} Если хотите оспорить наказание, нажмите **на кнопку ниже.**\n${Utility.pointEmoji} Имейте ввиду, что для быстрого решения вопроса вам лучше \n${Utility.fonEmoji} иметь **доказательства** свой невиновности.\n${Utility.pointEmoji} Если ваше обжалование будет сформировано неадекватно,\n ${Utility.fonEmoji} **оно будет закрыто.**`).setColor(Utility.colorDiscord).setFooter({ text: `Выполнил(а) ${interaction.user.tag} | ` + 'Сервер ' + interaction.guild.name, iconURL: interaction.user.displayAvatarURL() });
                const AppelButton = new ButtonBuilder().setCustomId('AppelButton').setLabel('ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤОбжаловатьㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ').setStyle(ButtonStyle.Primary);

                await getUser.member.roles.add(WorkRoles.BanCam)
                await getUser.user.send({ embeds: [embedAppel], components: [new ActionRowBuilder().addComponents(AppelButton)] });
                break;
        }
        const embed = new EmbedBuilder().setColor(color).setDescription(description)

        interaction.editReply({ embeds: [embed] })
    }
}