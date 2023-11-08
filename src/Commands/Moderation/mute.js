//===========================================/ Import the modeles \===========================================\\
const { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

//==========< OTHERS >==========\\
const color = require('colors');
const { WorkRoles, Utility, StaffRoles, StaffChats, HistoryEmojis, OwnerId } = require('../../../config.js');
const History = require('../../Structures/Models/History.js');
const { fetchStaff } = require('../../Structures/Untils/Functions/fetchStaff.js')
const { doc, docAssist } = require('../../Structures/Untils/googlesheet.js');
//===========================================< Code >===========================================\\
module.exports = {
    data: new SlashCommandBuilder()
        .setName("mute")
        .setDescription("Забирает возможность к общению")
        .setDMPermission(false)
        .addUserOption((target) => target.setName('пользователь').setDescription("Выбери пользователя").setRequired(true))
        .addIntegerOption((time) => time.setName('время').setDescription('Укажи время').setRequired(true).addChoices(
            { name: '30 минут', value: 30 },
            { name: '45 минут', value: 45 },
            { name: '60 минут', value: 60 },
            { name: '75 минут', value: 75 },
            { name: '90 минут', value: 90 },
        ))
        .addStringOption((reason) => reason.setName('причина').setDescription('Напиши причину предупреждения').setRequired(true)),

    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */

    async execute(client, interaction) {
        const isAssistant = interaction.channel.id === StaffChats.Assistant
        const isControl = interaction.channel.id === StaffChats.Control
        
        const getUser = interaction.options.get('пользователь');
        const getTime = interaction.options.get('время');
        const getReason = interaction.options.getString('причина');
        const hasRoleExecutor = (id) => interaction.member.roles.cache.has(id);
        const hasRole = (id) => getUser.member.roles.cache.has(id);

        const memberPosition = interaction.member.roles.cache.filter(r => Object.values(StaffRoles).includes(r.id))?.sort((a, b) => b.position - a.position)?.first()?.position || 1;
        const targetPosition = getUser.member.roles.cache.filter(r => Object.values(StaffRoles).includes(r.id))?.sort((a, b) => b.position - a.position)?.first()?.position || 0;

        let description;
        let badDescription;
        let color;
        let time;
        let staffSheet;
        let customId;

        await interaction.deferReply()

        switch (true) {
            case isControl:
                staffSheet = 1162940648
                break;
            case isAssistant:
                staffSheet = 0
                break;
                default: 
                staffSheet = null
                break;
        }
        console.log(await fetchStaff(staffSheet, interaction.user.id));
        await fetchStaff(staffSheet, interaction.user.id) 

        if ([StaffChats.Assistant].includes(interaction.channel.id) && await fetchStaff(0, interaction.user.id) === true || [StaffChats.Control].includes(interaction.channel.id) && await fetchStaff(1162940648, interaction.user.id) === true || !hasRoleExecutor([StaffRoles.Admin, StaffRoles.Developer, StaffRoles.Moderator].includes(interaction.user.id)) || interaction.user.id != [OwnerId.hoki]) {
            interaction.editReply({
                content: 'недостаточно прав'
            })
        }
 
        
        switch (true) {
            case getTime.value === 30:
                time = 1800000
                break;
            case getTime.value === 45:
                time = 2700000
                break;
            case getTime.value === 60:
                time = 3600000
                break;
            case getTime.value === 75:
                time = 4500000
                break;
            case getTime.value === 90:
                time = 5400000
                break;
        }

        switch (true) {
            case interaction.user.id === getUser.member.id:
            case getUser.user.bot:
            case memberPosition <= targetPosition:
                description = '**Недостаточно прав!**';
                color = Utility.colorRed;
                break;
            case hasRole(WorkRoles.Mute):
                description = `**[<:pred:1159081335349063720>] Пользователю <@${getUser.user.id}> не было выдано <@&${WorkRoles.Mute}>\n\n\`\`\`Причина: уже имеется Мут\`\`\`**`
                color = Utility.colorRed
                break;
            default:
                description = `**[<:pred:1159081335349063720>] Пользователю <@${getUser.user.id}> был выдан <@&${WorkRoles.Mute}> на ${getTime.name}\n\n\`\`\`Причина: ${getReason}\`\`\`**`
                color = Utility.colorYellow

                await History.create({
                    executor: interaction.user.id,
                    target: getUser.user.id,
                    reason: getReason,
                    type: 'Mute',
                    expiresAt: new Date(Date.now() + time),
                })

                const embedAppel = new EmbedBuilder().setTitle(`[${Utility.banEmoji}] Вы получили Мут на ${getTime.name}`).setDescription(`\`\`\`Причина: ${getReason} \`\`\` \n${Utility.pointEmoji} Если хотите оспорить наказание, нажмите **на кнопку ниже.**\n${Utility.pointEmoji} Имейте ввиду, что для быстрого решения вопроса вам лучше \n${Utility.fonEmoji} иметь **доказательства** свой невиновности.\n${Utility.pointEmoji} Если ваше обжалование будет сформировано неадекватно,\n ${Utility.fonEmoji} **оно будет закрыто.**`).setColor(Utility.colorDiscord).setFooter({ text: `Выполнил(а) ${interaction.user.tag} | ` + 'Сервер ' + interaction.guild.name, iconURL: interaction.user.displayAvatarURL() });
                const AppelButton = new ButtonBuilder().setCustomId('AppelButton').setLabel('ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤОбжаловатьㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ').setStyle(ButtonStyle.Primary);

                await getUser.member.roles.add(WorkRoles.Mute)
                await getUser.user.send({ embeds: [embedAppel], components: [new ActionRowBuilder().addComponents(AppelButton)] });
                break;
        }
        const embed = new EmbedBuilder().setColor(color).setDescription(description)

        await interaction.editReply({ embeds: [embed] })
    }
}