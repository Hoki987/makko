//===========================================< Code >===========================\\
async function loadEvents(client, color) {
    const { readdirSync } = require("fs");
    client.removeAllListeners();

    console.log(`${color.bold.green(`[EVENTS]`)}` + `Started refreshing application events...`.yellow);

    const eventsFolders = readdirSync(`${process.cwd()}/src/Events`);
    for (const folder of eventsFolders) {
        const eventsFiles = readdirSync(`${process.cwd()}/src/Events/${folder}`).filter(file => file.endsWith(".js"));
        for (const file of eventsFiles) {
            const events = require(`${process.cwd()}/src/Events/${folder}/${file}`);
            client.events.set(events.name, events);

            if (events.rest) {
                if (events.once) {
                    client.rest.once(events.name, (...args) => events.execute(...args, client, color));
                } else {
                    client.rest.on(events.name, (...args) => events.execute(...args, client, color));
                };
            } else {
                if (events.once) {
                    client.once(events.name, (...args) => events.execute(...args, client, color));
                } else {
                    client.on(events.name, (...args) => events.execute(...args, client, color));
                };
            };
            continue;
        };
        console.log(`${color.bold.green(`[EVENST]`)}` + `[${eventsFiles.length}]`.cyan + `in `.yellow + `${folder}`.magenta + ` Successfully loaded!`.yellow);
    }
};

async function unloadEvents(client, color) {
    client.application.events.set([]);
    console.log(`${color.bold.green(`[EVENST]`)}` + `Successfully unloaded application events...`.yellow);
};

module.exports = { loadEvents, unloadEvents };