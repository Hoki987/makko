//===========================================/ Import the modeles \===========================================\\
const { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require('discord.js');

//==========< OTHERS >==========\\
const color = require('colors');
const { WorkRoles, Utility } = require('../../../config.js');
const History = require('../../Structures/Models/History.js');
const { doc } = require('../../Structures/Untils/googlesheet.js');
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
        try {
            const getUser = interaction.options.get('пользователь');
            const getReason = interaction.options.getString('причина');
            const hasRole = (id) => getUser.member.roles.cache.has(id);

            let description
            let color

            if (hasRole(WorkRoles.Pred)) {
                description = `**[<:pred:1159081335349063720>] Пользователю <@${getUser.user.id}> не было выдано <@&${WorkRoles.Pred}>\n\n\`\`\`Причина: уже имеется предупреждение\`\`\`**`
                color = Utility.colorRed
            } else {
                description = `**[<:pred:1159081335349063720>] Пользователю <@${getUser.user.id}> было выдано <@&${WorkRoles.Pred}>\n\n\`\`\`Причина: ${getReason}\`\`\`**`
                color = Utility.colorYellow
                getUser.member.roles.add(WorkRoles.Pred)
            }
            const embed = new EmbedBuilder().setColor(color).setDescription(description)


                await History.create({
                    executor: interaction.user.id,
                    target: getUser.user.id,
                    reason: getReason,
                    type: 'Pred',
                    expiresAt: new Date(Date.now() + 86400000), // 24 часа
                })

            const sheet = doc.sheetsById[1162940648];
            await sheet.loadCells()
            const rows = await sheet.getRows();
            const row = rows.find((r) => r._rawData.includes(interaction.user.id))
            const day = (new Date().getDay() + 1) % 7
            const cell = sheet.getCell(row.rowNumber - 1, 8 + day * 7)

            cell.value = Number(cell.value || 0) + 1
            sheet.saveUpdatedCells();

           await interaction.reply({ embeds: [embed] })
        } catch (error) {
            console.log(`${color.bold.red(`[COMMAND > HISTORY : ERROR]`)}` + `${error}.`.bgRed);
        }
    }
}