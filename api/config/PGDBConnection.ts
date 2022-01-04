const PgConnection = require('postgresql-easy');
const dbConfig = require('./configlocal/pgConfig');
const pg = new PgConnection(dbConfig);
module.exports = pg;