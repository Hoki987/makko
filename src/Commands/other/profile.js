//===========================================/ Import the modeles \===========================================\\
const { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, AttachmentBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
//==========< OTHERS >==========\\
const Canvas = require('@napi-rs/canvas');
const { join } = require("path");
const { StaffChats, Utility } = require('../../../config.js');
const { doc, docAssist } = require('../../Structures/Untils/googlesheet.js');
const { tableValue } = require('../../Structures/Untils/Functions/action.js');
//===========================================< Code >===========================================\\
module.exports = {
    data: new SlashCommandBuilder()
        .setName("profile")
        .setDescription("g")
        .setDMPermission(false)
        .addUserOption((target) => target.setName("пользователь").setDescription("Выбери пользователя")),

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
        await interaction.deferReply()
        let target = interaction.options.getMember('пользователь') || interaction.member
        target = await target.fetch()
        const isAssistant = interaction.channel.id === StaffChats.Assistant
        const isControl = interaction.channel.id === StaffChats.Control
        let content;
        async function profile(staffSheet, customId, target) {
            try {
                const marketButton = new ButtonBuilder()
                    .setLabel('Магазин')
                    .setCustomId(`${customId[0]}`)
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('🛒')
                const questButton = new ButtonBuilder()
                    .setLabel('Квесты')
                    .setCustomId(`${customId[1]}`)
                    .setDisabled(true)
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('📑')

                if (target.user.bannerURL() === null) {
                    Canvas.GlobalFonts.registerFromPath(join(__dirname, '..', '..', 'MEDIA', 'Montserrat.ttf'), 'Montserrat SemiBold')

                    const canvas = Canvas.createCanvas(1920, 1080);
                    const context = canvas.getContext("2d");
                    const background = await Canvas.loadImage(join(__dirname, '..', '..', 'MEDIA', 'nonBannerProfile.jpg'))

                    context.filter = 'blur(70px)';
                    context.drawImage(background, 0, 0, canvas.width, canvas.height)


                    const profile = await Canvas.loadImage((join(__dirname, '..', '..', 'MEDIA', 'withoutIcons.png')))
                    const bif = context.getImageData(10, 10, 10, 10).data
                    const color = "#" + ((1 << 24) + (bif[0] << 16) + (bif[1] << 8) + bif[2]).toString(16).slice(1);

                    const profileImages = await Canvas.loadImage((join(__dirname, '..', '..', 'MEDIA', 'onlyIcons.png')))
                    context.filter = 'blur(0px)';
                    context.drawImage(profileImages, 0, 0, canvas.width, canvas.height)

                    context.filter = 'blur(0px)';
                    context.fillStyle = `${color}`
                    context.fillRect(30, 64, 5, 5)
                    context.drawImage(profile, 0, 0, canvas.width, canvas.height)

                    const avatar = await Canvas.loadImage(target.displayAvatarURL())

                    let valueCell = await tableValue(staffSheet, target.id)

                    context.fillStyle = `#faf4f4`
                    context.font = '50px Montserrat SemiBold';
                    context.fillText(`${valueCell[0]}`, 188, 653)
                    context.fillText(`${valueCell[1]}`, 188, 793)
                    context.fillText(`${valueCell[2]}`, 188, 937)
                    context.fillText(`${valueCell[3]}`, 718, 653)
                    context.fillText(`${valueCell[4]} / ${valueCell[5]}`, 718, 793)
                    context.fillText(`${valueCell[6]}`, 718, 937)
                    context.fillText(`${valueCell[7]}`, 1280, 653)
                    context.fillText(`${valueCell[8]}`, 1280, 793)
                    context.fillText(`${valueCell[9]}`, 1280, 937)
                    context.font = '143px Montserrat SemiBold';
                    valueCell[13] < 9 ? context.fillText(`${valueCell[13]}`, 1435, 400) : context.fillText(`${valueCell[13]}`, 1410, 400)
                    context.font = '40px Montserrat SemiBold';
                    context.fillText(`${valueCell[12]}`, 460, 287)
                    context.fillStyle = `#eee9e9`
                    context.fillText(`${valueCell[10]}`, 918, 343)
                    context.fillText(`${valueCell[11]}`, 652, 343)

                    const truncateString = (s, w) => s.length > w ? s.slice(0, w).trim() + "..." : s;

                    context.fillStyle = `#faf4f4`
                    context.font = '90px Montserrat SemiBold';
                    context.fillText(`${truncateString(target.user.displayName, 6)}`, 390, 230)
                    context.beginPath();
                    context.arc(249, 249, 126, 0, 2 * Math.PI, true);
                    context.closePath();
                    context.clip();
                    context.drawImage(avatar, 115, 115, 270, 270)

                    content = new AttachmentBuilder(await canvas.encode('png'), { name: 'profile-image.png' })
                    await interaction.editReply({ files: [content], components: [new ActionRowBuilder().addComponents(marketButton, questButton)] })
                } else {
                    Canvas.GlobalFonts.registerFromPath(join(__dirname, '..', '..', 'MEDIA', 'Montserrat.ttf'), 'Montserrat SemiBold')

                    const canvas = Canvas.createCanvas(1920, 1080);
                    const context = canvas.getContext("2d");
                    const background = await Canvas.loadImage(target.user.bannerURL())

                    context.filter = 'blur(70px)';
                    context.drawImage(background, 0, 0, canvas.width, canvas.height)


                    const profile = await Canvas.loadImage((join(__dirname, '..', '..', 'MEDIA', 'withoutIcons.png')))
                    const bif = context.getImageData(10, 10, 10, 10).data
                    const color = "#" + ((1 << 24) + (bif[0] << 16) + (bif[1] << 8) + bif[2]).toString(16).slice(1);

                    const profileImages = await Canvas.loadImage((join(__dirname, '..', '..', 'MEDIA', 'onlyIcons.png')))
                    context.filter = 'blur(0px)';
                    context.drawImage(profileImages, 0, 0, canvas.width, canvas.height)

                    context.filter = 'blur(0px)';
                    context.fillStyle = `${color}`
                    context.fillRect(30, 64, 5, 5)
                    context.drawImage(profile, 0, 0, canvas.width, canvas.height)

                    const avatar = await Canvas.loadImage(target.displayAvatarURL())

                    let valueCell = await tableValue(staffSheet, target.id)

                    context.fillStyle = `#faf4f4`
                    context.font = '50px Montserrat SemiBold';
                    context.fillText(`${valueCell[0]}`, 188, 653)
                    context.fillText(`${valueCell[1]}`, 188, 793)
                    context.fillText(`${valueCell[2]}`, 188, 937)
                    context.fillText(`${valueCell[3]}`, 718, 653)
                    context.fillText(`${valueCell[4]} / ${valueCell[5]}`, 718, 793)
                    context.fillText(`${valueCell[6]}`, 718, 937)
                    context.fillText(`${valueCell[7]}`, 1280, 653)
                    context.fillText(`${valueCell[8]}`, 1280, 793)
                    context.fillText(`${valueCell[9]}`, 1280, 937)
                    context.font = '143px Montserrat SemiBold';
                    valueCell[13] < 9 ? context.fillText(`${valueCell[13]}`, 1435, 400) : context.fillText(`${valueCell[13]}`, 1410, 400)
                    context.font = '40px Montserrat SemiBold';
                    context.fillText(`${valueCell[12]}`, 460, 287)
                    context.fillStyle = `#eee9e9`
                    context.fillText(`${valueCell[10]}`, 918, 343)
                    context.fillText(`${valueCell[11]}`, 652, 343)

                    const truncateString = (s, w) => s.length > w ? s.slice(0, w).trim() + "..." : s;

                    context.fillStyle = `#faf4f4`
                    context.font = '90px Montserrat SemiBold';
                    context.fillText(`${truncateString(target.user.displayName, 6)}`, 390, 230)
                    context.beginPath();
                    context.arc(250, 250, 125, 0, 2 * Math.PI, true);
                    context.closePath();
                    context.clip();
                    context.drawImage(avatar, 75, 75, 300, 300)
                    content = new AttachmentBuilder(await canvas.encode('png'), { name: 'profile-image.png' })
                    await interaction.editReply({ files: [content], components: [new ActionRowBuilder().addComponents(marketButton, questButton)] })
                }
            } catch (error) {
                console.log(error);
                await interaction.editReply({
                    embeds: [
                        new EmbedBuilder().setColor(Utility.colorRed).setDescription(`\`\`\`Ничего не найдено по id: ${target.id}\`\`\``).setFooter({ text: '/add - взять на стафф', iconURL: interaction.guild.iconURL() })
                    ]
                })
            }
        }
        switch (true) {
            case isAssistant:
                profile(0, ['profile_shop_assist', 'porfile_quest_assist'], target)
                break;
            case isControl:
                profile(1162940648, ['profile_shop_control', 'porfile_quest_control'], target)
                break;
        }
    }
}