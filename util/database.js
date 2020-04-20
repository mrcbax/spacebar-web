var fs = require('fs');
var config = JSON.parse(fs.readFileSync('./db_config.json', 'utf8'));

const { Pool, Client } = require('pg');
const pool = new Pool ({
    user: config.user,
    host: config.host,
    database: config.database,
    password: config.password,
    port: config.port
});

module.exports = pool;
