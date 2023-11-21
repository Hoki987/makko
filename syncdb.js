const History = require('./src/Structures/Models/History.js');
const Staff = require('./src/Structures/Models/Staff.js');
const Appeals = require('./src/Structures/Models/Appeals.js');

History.drop();
History.sync({ force: true }); //forse, alter

Staff.drop();
Staff.sync({ force: true }); //forse, alter

Appeals.drop();
Appeals.sync({ force: true }); //forse, alter