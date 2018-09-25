var Connection = require('tedious').Connection;
const dbConfig = require('../config');
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;

// Create connection to database
var config = {
  userName: 'mftsuser', // update me
  password: "P@ssw0rd", // update me
  server: "192.168.10.48",
  options: {
    encrypt: true,
    database: "MFTS"
  }
}

var connection = new Connection(config);

// Attempt to connect and execute queries if connection goes through
connection.on('connect', function(err) {
  if (err) {
    console.log(err);
  } else {
    console.log('Connected');
  }
});
