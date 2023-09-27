async function loadGoogleSheet(client, color) {
    const { GoogleSpreadsheet } = require('google-spreadsheet');
    const { JWT } = require('google-auth-library');
    require("dotenv").config();

    try {
        const serviceAccountAuth = new JWT({
            email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            key: process.env.GOOGLE_PRIVATE_KEY,
            scopes: [
                'https://www.googleapis.com/auth/spreadsheets',
                'https://www.googleapis.com/auth/drive'
            ],
        });

        const doc = new GoogleSpreadsheet(process.env.SPREADSHEET_TABLE_ID, serviceAccountAuth);
        await doc.loadInfo(); // loads document properties and worksheets
    } catch (error) {
        console.log(error);
    }
}

module.exports = { loadGoogleSheet };