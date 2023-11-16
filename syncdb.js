const History = require('./src/Structures/Models/History.js');
const Staff = require('./src/Structures/Models/Staff.js');

History.drop();
History.sync({ force: true }); //forse, alter

Staff.drop();
Staff.sync({ force: true }); //forse, alter