//===========================================/ Import the modeles \===========================================\\
const { Client } = require("discord.js");
const { doc } = require('../../Structures/Untils/googlesheet.js');
const { promisify } = require('util')
const cron = require('node-cron');
//==========< OTHERS >==========\\

//===========================================< Code >===========================\\
module.exports = {
    name: "ready",

    /**
     * @param {Client} client 
     */

    async execute(client) {
        await doc.loadInfo();
        const sheet = doc.sheetsById[1162940648];
        await sheet.loadCells();

        // cron.schedule('* * * * *', async () => {
        // await sheet.duplicate();


        // await sheet.clear('H4:BD24');
        // await sheet.saveUpdatedCells();
        // });
    },
};
