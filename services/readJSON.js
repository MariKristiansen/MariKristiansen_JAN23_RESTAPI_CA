var db = require('../models')
const fs = require('fs');
const { QueryTypes } = require('sequelize');

//Populate db with JSON
const createStatusesTable = async () => {
    try {
        await db.sequelize.sync({ force: true });   //set to true when testing, this will empty the db (NB!! Also in app.js)

        const filename = 'statuses.json';
        const { records } = await JSON.parse(fs.readFileSync(`./data/${filename}`));
        for (const record of records) {
            await db.sequelize.query(record.query, {
                raw: true,
                type: QueryTypes.INSERT,
            });
        }
        console.log('Statuses data inserted successfully.');
    } catch (err) {
        console.log('Error inserting data from statuses.json.', err);
    }
};

//Function to check if the db has data
const checkIfDBHasData = async () => {
    try {
        const result = await db.sequelize.query('SELECT COUNT(*) as total FROM Statuses', {
            raw: true,
            type: QueryTypes.SELECT,
        });
        return result[0].total === 0;
    } catch (err) {
        console.error('Error checking db data:', err);
        return false;
    }
};

createStatusesTable();

module.exports = {
    createStatusesTable,
    checkIfDBHasData,
};