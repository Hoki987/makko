//===========================================/ Import the modeles \===========================================\\
const { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require('discord.js');

//==========< OTHERS >==========\\
const color = require('colors');
const { WorkRoles, Utility } = require('../../../config.js');
const History = require('../../Structures/Models/History.js');
//===========================================< Code >===========================================\\
module.exports = {
    data: new SlashCommandBuilder()
        .setName("banjpg")
        .setDescription("Причины для выдачи: 3.2 | 3.4 | 3.12")
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

            if (hasRole(WorkRoles.BanJPG)) {
                description = `**[<:pred:1159081335349063720>] Пользователю <@${getUser.user.id}> не было выдано <@&${WorkRoles.BanJPG}>\n\n\`\`\`Причина: уже имеется banJPG\`\`\`**`
                color = Utility.colorRed
            } else {
                description = `**[<:pred:1159081335349063720>] Пользователю <@${getUser.user.id}> был выдан <@&${WorkRoles.BanJPG}> на 14 дней\n\n\`\`\`Причина: ${getReason}\`\`\`**`
                color = Utility.colorYellow
                getUser.member.roles.add(WorkRoles.BanJPG)
            }

                await History.create({
                    executor: interaction.user.id,
                    target: getUser.user.id,
                    reason: getReason,
                    type: 'BanJPG',
                    expiresAt: new Date(Date.now() + 1209600000), // 14 дней
                })

            const embed = new EmbedBuilder().setColor(color).setDescription(description)

            interaction.reply({ embeds: [embed] })
        } catch (error) {
            console.log(`${color.bold.red(`[COMMAND > HISTORY : ERROR]`)}` + `${error}.`.bgRed);
        }
    }
}