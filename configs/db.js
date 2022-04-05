const Pool = require("pg").Pool;

const db = new Pool({
    user : "postgres",
    password : "",
    host : "localhost",
    port: 5432,
    database: "test"
})
module.exports = db
