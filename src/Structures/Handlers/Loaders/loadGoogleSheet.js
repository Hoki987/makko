async function loadGoogleSheet(client, color) {
    const { doc } = require('../../Untils/googlesheet.js')
    require("dotenv").config();

    try {
        await doc.loadInfo(); // loads document properties and worksheets
        console.log(`${color.bold.green(`[GOOGLESHEET]`)}` + `Successfully connection to googlesheet!`.yellow);
        // const sheet = doc.sheetsByIndex[0];
        // await doc.updateProperties({title: 'Moderatio | META'})
        // await sheet.addRow({ name: 'Sundar Pichai', email: 'sundar@abc.xyz' });
        // const rows = await sheet.getRows();
        // console.log(rows.length);
        // console.log(rows[0].get('name')); 
        // console.log(rows[0].get('email')); 
    } catch (error) {
        console.error('Unable to connect to the googlesheet:', error);
    }
};

module.exports = { loadGoogleSheet };