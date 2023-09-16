async function loadDatabase(client, color) {
    const sequelize = require('../../Untils/database.js')
    console.log(`${color.bold.green(`[DATABASE]`)}` + `Started connection to database...`.yellow);

    try {
        await sequelize.authenticate();
        console.log(`${color.bold.green(`[DATABASE]`)}` + `Successfully connection to database!`.yellow);
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

module.exports = { loadDatabase };