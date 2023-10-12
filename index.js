//===========================================/ Import the modeles \===========================================\\
const { Client, GatewayIntentBits, Partials, Collection } = require("discord.js");
const color = require("colors");
require("dotenv").config();

//======================< Function >===================\\
const { loadDatabase } = require("./src/Structures/Handlers/Loaders/loadDatabase.js");
const { loadCommands } = require("./src/Structures/Handlers/Loaders/loadCommands.js");
const { loadEvents } = require("./src/Structures/Handlers/Loaders/loadEvents.js");;
//======================< Client >===================\\
const client = new Client({
    intents: [
        GatewayIntentBits.AutoModerationConfiguration,
        GatewayIntentBits.AutoModerationExecution,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildScheduledEvents,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent,
    ],
    partials: [
        Partials.Channel,
        Partials.GuildMember,
        Partials.GuildScheduledEvent,
        Partials.Message,
        Partials.Reaction,
        Partials.ThreadMember,
        Partials.User
    ],
})

//======================< Collection >===================\\
client.slashCommands = new Collection();
client.buttons = new Collection();
client.events = new Collection();

//======================< Handlers >===================\\
const Handlers = [

];

Handlers.forEach(handler => {
    require(`./Structures/Handlers/${handler}`)(client, color);
});

//======================< Login >===================\\
client.login(process.env.TOKEN).then(() => {
    loadDatabase(client, color);
    loadEvents(client, color);
    loadCommands(client, color);
})
    .catch(err => {
        console.log(`${color.bold.red(`[INDEX ERROR] `)}` + `${err}.`.bgRed);
    });
module.exports = client;
