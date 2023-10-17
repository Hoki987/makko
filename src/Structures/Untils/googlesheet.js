const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');
require("dotenv").config();

const serviceAccountAuth = new JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY,
    scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive'
    ],
});
const doc = new GoogleSpreadsheet(process.env.SPREADSHEET_TABLE_ID, serviceAccountAuth);

const serviceAccountAuthAssist = new JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY,
    scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive'
    ],
});
const docAssist = new GoogleSpreadsheet(process.env.SPREADSHEET_TABLE_ID_ASSISTANT, serviceAccountAuthAssist);

module.exports = { doc, docAssist };