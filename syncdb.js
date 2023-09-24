const History = require('./src/Structures/Models/History.js');

// History.drop();
History.sync({ force: true }); //forse, alter