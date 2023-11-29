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
        async function profile(staffSheet, customId, user) {
            try {
                const marketButton = new ButtonBuilder()
                    .setLabel('Магазин')
                    .setCustomId(customId[0])
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('🛒')
                const questButton = new ButtonBuilder()
                    .setLabel('Квесты')
                    .setCustomId(customId[1])
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
                    context.fillText(`${valueCell[0]}`, 205, 653)
                    context.fillText(`${valueCell[1]}`, 203, 793)
                    context.fillText(`${valueCell[2]}`, 205, 937)
                    context.fillText(`${valueCell[3]}`, 730, 653)
                    context.fillText(`${valueCell[4]}`, 730, 793)
                    context.fillText('|', 825, 787)
                    context.fillText(`${valueCell[5]}`, 845, 793)
                    context.fillText(`${valueCell[6]}`, 730, 937)
                    context.fillText(`${valueCell[7]}`, 1280, 653)
                    context.fillText(`${valueCell[8]}`, 1280, 793)
                    context.fillText(`${valueCell[9]}`, 1280, 937)
                    context.font = '143px Montserrat SemiBold';
                    valueCell[13] < 9 ? context.fillText(`${valueCell[13]}`, 1455, 400) : context.fillText(`${valueCell[13]}`, 1430, 400)
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

                    await doc.loadInfo()
                    let staffSheet = doc.sheetsById[sheetId]
                    const sheet = staffSheet;
                    await sheet.loadCells()
                    const getRows = await sheet.getRows();
                    const rowTarget = getRows.find((r) => r._rawData.includes(target.id))
                    const cellBan = sheet.getCell(rowTarget.rowNumber - 1, 60)
                    const cellMute = sheet.getCell(rowTarget.rowNumber - 1, 57)
                    const cellWarn = sheet.getCell(rowTarget.rowNumber - 1, 59)
                    const cellPred = sheet.getCell(rowTarget.rowNumber - 1, 58)
                    const cellOCount = sheet.getCell(rowTarget.rowNumber - 1, 61)
                    const cellOTime = sheet.getCell(rowTarget.rowNumber - 1, 62)
                    const cellTicket = sheet.getCell(rowTarget.rowNumber - 1, 63)
                    const cellMoney = sheet.getCell(rowTarget.rowNumber - 1, 66)
                    const cellNorma = sheet.getCell(rowTarget.rowNumber - 1, 64)
                    const cellDateStaff = sheet.getCell(rowTarget.rowNumber - 1, 5)
                    const cellStaffWarnY = sheet.getCell(rowTarget.rowNumber - 1, 6)
                    const cellStaffWarnP = sheet.getCell(rowTarget.rowNumber - 1, 5)
                    const cellPosition = sheet.getCell(rowTarget.rowNumber - 1, 2)
                    const cellTop = sheet.getCell(rowTarget.rowNumber - 1, 65)

                    const cellBanValue = Number(cellBan.value)
                    const cellMuteValue = Number(cellMute.value)
                    const cellWarnValue = Number(cellWarn.value)
                    const cellPredValue = Number(cellPred.value)
                    const cellOCountValue = Number(cellOCount.value)
                    const cellOTimeValue = Number(cellOTime.value)
                    const cellTicketValue = Number(cellTicket.value)
                    const cellMoneyValue = Number(cellMoney.value)
                    const cellNormaValue = Number(cellNorma.value)
                    const cellDateStaffValue = Number(cellDateStaff.value)
                    const cellStaffWarnYValue = Number(cellStaffWarnY.value)
                    const cellStaffWarnPValue = Number(cellStaffWarnP.value)
                    const cellPositionValue = cellPosition.value
                    const cellTopValue = Number(cellTop.value)

                    sheet.saveUpdatedCells();

                    context.fillStyle = `#faf4f4`
                    context.font = '50px Montserrat SemiBold';
                    context.fillText(`${cellBanValue}`, 205, 653)
                    context.fillText(`${cellMuteValue}`, 203, 793)
                    context.fillText(`${cellWarnValue}`, 205, 937)
                    context.fillText(`${cellPredValue}`, 730, 653)
                    context.fillText(`${cellOCountValue}`, 730, 793)
                    context.fillText('|', 825, 787)
                    context.fillText(`${cellOTimeValue}`, 845, 793)
                    context.fillText(`${cellTicketValue}`, 730, 937)
                    context.fillText(`${cellMoneyValue}`, 1280, 653)
                    context.fillText(`${cellNormaValue}`, 1280, 793)
                    context.fillText(`${cellDateStaffValue}`, 1280, 937)
                    context.font = '143px Montserrat SemiBold';
                    cellTopValue < 9 ? context.fillText(`${cellTopValue}`, 1455, 400) : context.fillText(`${cellTopValue}`, 1430, 400)
                    context.font = '40px Montserrat SemiBold';
                    context.fillText(`${cellPositionValue}`, 460, 287)
                    context.font = '40px Montserrat SemiBold';
                    context.fillStyle = `#eee9e9`
                    context.fillText(`${cellStaffWarnYValue}`, 918, 343)
                    context.fillText(`${cellStaffWarnPValue}`, 652, 343)

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
                await interaction.editReply({
                    embeds: [
                        new EmbedBuilder().setColor(Utility.colorRed).setDescription(`\`\`\`Ничего не найдено по id: ${target.id}\`\`\``).setFooter({ text: '/add - взять на стафф', iconURL: interaction.guild.iconURL() })
                    ]
                })
            }
        }
        switch (true) {
            case isAssistant:
                profile(docAssist, 0, ['profile_shop_assist', 'porfile_quest_assist'])
                break;
            case isControl:
                profile(doc, 1162940648, ['profile_shop_control', 'porfile_quest_control'])
                break;
        }
    }
}