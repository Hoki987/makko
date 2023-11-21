//===========================================/ Import the modeles \===========================================\\
const { Client, ChatInputCommandInteraction } = require("discord.js");

//==========< OTHERS >==========\\
const color = require("colors");

//===========================================< Code >===========================\\
module.exports = {
    name: "interactionCreate",

    /**
     * 
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction 
     */

    async execute(interaction, client) {
        if (interaction.isChatInputCommand()) {
            if (interaction.user.bot) return;
            const command = client.slashCommands.get(interaction.commandName);
            if (!command) {
                interaction.reply({
                    ephemeral: true,
                    content: "This Command is outdated!"
                });
            };
            try {
                command.execute(client, interaction);
            } catch (error) {
                console.log(`${color.bold.red(`[INTERACTION > CREATE SLASH : ERROR]`)}` + `${error}.`.bgRed);
            }
        };
        if (interaction.isContextMenuCommand()) {
            if (interaction.user.bot) return;
            const context = client.slashCommands.get(interaction.commandName);
            if (!context) {
                interaction.reply({
                    ephemeral: true,
                    context: "This command is outdated!"
                });
            };
            try {
                context.execute(client, interaction);
            } catch (error) {
                console.log(`${color.bold.red(`[INTERACTION > CREATE CONTEXT : ERROR]`)}` + `${error}.`.bgRed);
            }
        };
        if (interaction.isButton()) {
            console.log(interaction.customId);
            const command = client.buttons.get(interaction.customId.split('_')[0]);
            console.log(command);
            if (!command) {
                interaction.reply({
                    ephemeral: true,
                    content: "This Command is outdated!"
                });
            };
            try {
                command.execute(client, interaction);
            } catch (error) {
                console.log(`${color.bold.red(`[INTERACTION > BUTTON : ERROR]`)}` + `${error}.`.bgRed);
            }
        };
        if (interaction.isModalSubmit()) {
            console.log(interaction.customId);
            const command = client.buttons.get(interaction.customId.split('_')[0]);
            console.log(command);
            if (!command) {
                interaction.reply({
                    ephemeral: true,
                    content: "This Command is outdated!"
                });
            };
            try {
                command.execute(client, interaction);
            } catch (error) {
                console.log(`${color.bold.red(`[INTERACTION > MODAL SUBMIT : ERROR]`)}` + `${error}.`.bgRed);
            }
        };
    },
};
