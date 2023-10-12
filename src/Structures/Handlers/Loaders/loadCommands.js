//===========================================< Code >===========================\\
async function loadCommands(client, color) {
    const { readdirSync } = require("fs");
    await client.slashCommands.clear();
    let publicCommandsArray = [];

    console.log(`${color.bold.green(`[GLOBAL COMMANDS]`)}` + `Started refreshing application commands...`.yellow);

    const commandFolders = readdirSync(`${process.cwd()}/src/Commands`);
    for (const folder of commandFolders) {
        const commandFiles = readdirSync(`${process.cwd()}/src/Commands/${folder}`).filter(file => file.endsWith(".js"));
        for (const file of commandFiles) {
            const command = require(`${process.cwd()}/src/Commands/${folder}/${file}`);
            client.slashCommands.set(command.data.name, command);
            publicCommandsArray.push(command.data.toJSON());
        };
    };

    const buttonFolder = readdirSync(`${process.cwd()}/src/Buttons`);
    for (const file of buttonFolder) {
        const command = require(`${process.cwd()}/src/Buttons/${file}`);
        client.buttons.set(command.data.name, command);
    };

    client.application.commands.set(publicCommandsArray).then(
        console.log(`${color.bold.green(`[GLOBAN COMMANDS]`)}` + `[${publicCommandsArray.length}]`.cyan + `Successfully loaded!`.yellow)
    );
};

async function unloadCommands(client, color) {
    client.application.commands.set([]);
    console.log(`${color.bold.green(`[GLOBAN COMMANDS]`)}` + `Successfully unloaded application commands!`.yellow);
};

module.exports = { loadCommands, unloadCommands };