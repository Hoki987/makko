//===========================================/ Import the modeles \===========================================\\
const { Client, ActivityType } = require("discord.js");

//===========================================< Code >===========================\\
module.exports = {
    name: "ready",
    once: true,

    /**
     * @param {Client} client 
     */

    async execute(client) {
        client.user.setPresence({ activities: [{ name: "На 1337", type: ActivityType.Watching }], status: "online" });
    },
};