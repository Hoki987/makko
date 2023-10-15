//===========================================/ Import the modeles \===========================================\\
const { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js');

//==========< OTHERS >==========\\
const Canvas = require('@napi-rs/canvas');
const { join } = require("path")

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
        if (!['1154731363132514324', '1000307646588534786'].includes(interaction.channel.id)) {
            await interaction.reply({
                ephemeral: true,
                content: 'Используйте чат, соответствующий вашей стафф роли!'
            })
            return
        }
        await interaction.deferReply()
        let target = interaction.options.getMember('пользователь') || interaction.member
        target = await target.fetch()
        const isAssistant = interaction.channel.id === '1154731363132514324'
        const isControl = interaction.channel.id === '1000307646588534786'
        let content;
        switch (true) {
            case isAssistant:
                if (target.user.bannerURL() === null) {
                    const canvas = Canvas.createCanvas(1920, 1080);
                    const context = canvas.getContext("2d");
                    const background = await Canvas.loadImage(join(__dirname, '..', '..', 'MEDIA', 'nonBannerProfile.jpg'))
                    const avatar = await Canvas.loadImage(target.user.displayAvatarURL())
                    console.log(avatar);
                    console.log(background);

                    context.drawImage(background, 0, 0, canvas.width, canvas.height)
                    context.drawImage(avatar, 25, 25, 200, 200)
                    content = new AttachmentBuilder(await canvas.encode('png'), { name: 'profile-image.png' })
                } else {
                    Canvas.GlobalFonts.registerFromPath(join(__dirname, '..', '..', 'MEDIA', 'APEX REGULAR.OTF'), 'Apex-Regular')

                    const canvas = Canvas.createCanvas(1920, 1080);
                    const context = canvas.getContext("2d");

                    const background = await Canvas.loadImage(target.user.bannerURL())
                    context.drawImage(background, 0, 0, canvas.width, canvas.height)

                    context.font = '200px Apex-Regular';
                    context.fillStyle = `${target.displayHexColor}`;
                    context.fillText(`${target.user.displayName}`, 305, 945)

                    console.log(target.displayHexColor);
                    console.log(target.user.hexAccentColor);
                    const avatar = await Canvas.loadImage(target.displayAvatarURL())
                    context.drawImage(avatar, 25, 25, 200, 200)
                    content = new AttachmentBuilder(await canvas.encode('png'), { name: 'profile-image.png' })
                }
                break;
            case isControl:
                content = 'Контрол'
                break;
        }
        await interaction.editReply({ files: [content] })
    }
}