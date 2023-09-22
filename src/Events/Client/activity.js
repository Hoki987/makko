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
        client.user.setPresence({ activities: [{ name: "за порядком", type: ActivityType.Watching }], status: "online" });
    },
};