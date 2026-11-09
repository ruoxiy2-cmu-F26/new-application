const pg = require("pg");
const Pool = pg.Pool;
require("dotenv").config();

//create a new pool object to manage connections to the PostgreSQL database
const pool = new Pool({
    host: process.env.PGHOST,
    port: Number(process.env.PGPORT || 5432),
    database: process.env.PGDATABASE,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD
});

module.exports = pool;//export the pool object so that other files can use it to interact with the database