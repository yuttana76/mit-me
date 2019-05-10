
// db.js
var mssql = require("mssql");
const dbConfig = require('./db-config');
var config = dbConfig.dbParameters;

var connection = mssql.connect(config, function (err) {
    if (err)
        throw err;
});

module.exports = connection;
