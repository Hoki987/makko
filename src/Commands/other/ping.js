//===========================================/ Import the modeles \===========================================\\
const { Client, ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");

//===========================================< Code >===========================\\
module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Текущее состояние бота")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false),

    /**
     * @param {Client} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(client, interaction) {
        try {
            //Uptime
            let days = Math.floor(client.uptime / 86400000);
            let hours = Math.floor(client.uptime / 3600000) % 24;
            let minutes = Math.floor(client.uptime / 60000) % 60;
            let seconds = Math.floor(client.uptime / 1000) % 60;

            //Latency Check
            let webLatency = new Date() - interaction.createdAt;
            let apiLatency = client.ws.ping;
            let totaLatency = webLatency + apiLatency;

            //Emoji Color
            let emLatency = {
                Green: "🟩",
                Yellow: "🟨",
                Red: "🟥"
            };

            //Respond
            interaction.reply({
                ephemeral: true,
                embeds: [
                    new EmbedBuilder()
                        .setColor(totaLatency < 200 ? "Green" : totaLatency < 500 ? "Yellow" : "Red")
                        .addFields(
                            { name: "Websocket Latency", value: `\`${webLatency <= 200 ? emLatency.Green : webLatency <= 400 ? emLatency.Yellow : emLatency.Red}\` \`${webLatency}\`ms` },
                            { name: "API Latency", value: `\`${apiLatency <= 200 ? emLatency.Green : apiLatency <= 400 ? emLatency.Yellow : emLatency.Red}\` \`${apiLatency}\`ms` },
                            { name: "Uptime", value: `\`${days} Days\` : \`${hours} Hrs\` : \`${minutes} Mins\` : \`${seconds} Secs\`` },
                        )
                ]
            });

        } catch (error) {
            console.log(`${color.bold.red(`[COMMAND > PING : ERROR]`)}` + `${error}.`.bgRed);
        };
    }
};