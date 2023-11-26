const History = require('./src/Structures/Models/History.js');
const Staff = require('./src/Structures/Models/Staff.js');
const Obhod = require('./src/Structures/Models/Obhod.js');

History.drop();
History.sync({ force: true }); //forse, alter

// Staff.drop();
// Staff.sync({ force: true }); //forse, alter

Obhod.drop();
Obhod.sync({ force: true }); //forse, alter