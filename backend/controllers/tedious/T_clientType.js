var Connection = require('tedious').Connection;
const dbConfig = require('../config');
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;
var async = require('async');

// Create connection to database
var config = {
  userName: dbConfig.mssql_db_user, // update me
  password: dbConfig.mssql_db_password, // update me
  server: dbConfig.mssql_db_server,
  options: {
    encrypt: true,
    database: dbConfig.mssql_db_database
  }
}

var connection = new Connection(config);

function Start(callback) {
  console.log('Starting...');
  callback(null, 'Jake', 'United States');
}

function Read(callback) {
  console.log('Reading rows from the Table...');

  // Read all rows from table
  request = new Request(
  'SELECT * FROM [MFTS].[dbo].[REF_ClientTypes];',
  function(err, rowCount, rows) {
  if (err) {
      callback(err);
  } else {
      console.log(rowCount + ' row(s) returned');
      callback(null);
  }
  });

  // Print the rows read
  var result = "";
  request.on('row', function(columns) {
      columns.forEach(function(column) {
          if (column.value === null) {
              console.log('NULL');
          } else {
              result += column.value + " ";
          }
      });
      console.log(result);
      result = "";
  });

  // Execute SQL statement
  connection.execSql(request);
}

function executeClientType() {
  console.log('Reading rows from the Table...');

  // Read all rows from table
  request = new Request(
  'SELECT * FROM [MFTS].[dbo].[REF_ClientTypes];',
  function(err, rowCount, rows) {
  if (err) {
      callback(err);
  } else {
      console.log(rowCount + ' row(s) returned');
      callback(null);
  }
  });

  // Print the rows read
  var result = "";
  request.on('row', function(columns) {
      columns.forEach(function(column) {
          if (column.value === null) {
              console.log('NULL');
          } else {
              result += column.value + " ";
          }
      });
      console.log(result);
      result = "";
  });

  // Execute SQL statement
  connection.execSql(request);
}

function Complete(err, result) {
  if (err) {
      callback(err);
  } else {
      console.log("Done!");
  }
}

exports.getClientTypes = (req, res, next) => {
 console.log('Welcome to getClientTypes(T) ');

// Attempt to connect and execute queries if connection goes through
connection.on('connect', function(err) {
  if (err) {
    console.log(err);
  } else {

    console.log('Connected');

    executeClientType();

    // // Execute all functions in the array serially
    // async.waterfall([
    //     Start,
    //     Insert,
    //     Update,
    //     Delete,
    //     Read
    // ], Complete)
  }

});


console.log('  ********* END ******* ');

}


