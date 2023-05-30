/* mysql setting */
const mysql = require("mysql");
const conn = mysql.createConnection({
  host: "3.34.245.120",
  port: "3306",
  user: "nmomg",
  password: "123",
  database: "nmomg",
});

module.exports = conn;
