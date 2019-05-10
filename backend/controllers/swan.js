
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
const mysql_dbConfig = require("../config/mysql-config");
// var prop = require("../config/backend-property");
var logger = require("../config/winston");
// var mitLog = require('./mitLog');
var config = mysql_dbConfig.swan_dbParameters;

var mysql = require('mysql');
// var pool  = mysql.createPool(config);


// Execute Streaming data (OK)
//  exports.getCustomers = (req, res, next) => {
//   logger.info(`API /api/swan/getCustomers - ${req.originalUrl} - ${req.ip} `);
//   let rsp_code;

//   try {

//     var allData=[];
//     var query = connection.query('SELECT * from external_fireSwan.investor_profile');
//     query
//       .on('error', function(err) {
//         // Handle error, an 'end' event will be emitted after this as well
//       })
//       .on('fields', function(fields) {
//         // the field packets for the rows to follow
//       })
//       .on('result', function(row) {
//         // Pausing the connnection is useful if your processing involves I/O
//         connection.pause();
//         // console.log(row);
//         allData.push(row);
//         connection.resume();

//       })
//       .on('end', function() {
//         // all rows have been received
//         res.status(200).json({ message: allData });
//       });


//  } catch (error) {
//   // console.log("verify fail>>" + JSON.stringify(error));
//   return res.status(401).json({ message: error });
// }
// };

exports.getCustomers = (req, res, next) => {
    logger.info(`API /api/swan/getCustomers - ${req.originalUrl} - ${req.ip} `);

    getSWANCustomer().then((data)=>{
      
      res.status(200).json({record: data.length , data: data });
    }
    ,(err)=>{
      res.status(401).json({ message: err });
    });
}

// Use Streaming query
// exports.getSWANCustomer = function(){
  function getSWANCustomer(){

  logger.info(`Welcome getSWANCustomer() `);

  const connection = mysql.createConnection(config);
  connection.connect(function(err) {
  if(err) {
    console.log('error')
  } else {
    console.log('SWAN-Connected');
  }
  });

  return new Promise(function(resolve, reject) {
    var allData=[];
    var query = connection.query('SELECT * from external_fireSwan.investor_profile');
    query
      .on('error', function(err) {
        // Handle error, an 'end' event will be emitted after this as well
        reject(err);
      })
      .on('fields', function(fields) {
        // the field packets for the rows to follow
      })
      .on('result', function(row) {
        // Pausing the connnection is useful if your processing involves I/O
        connection.pause();
        // console.log(row);
        allData.push(row);
        connection.resume();

      })
      .on('end', function() {
        // all rows have been received
        // res.status(200).json({ message: allData });
        resolve(allData);
      });

  });
}

// Get use pool (OK)
// exports.getCustomers = (req, res, next) => {
//   logger.info(`API /api/swan/getCustomers - ${req.originalUrl} - ${req.ip} `);

//   try {

//     pool.query('SELECT * from external_fireSwan.investor_profile', function (error, results, fields) {
//       if (error) {
//         res.status(422).json({ message: error });
//       }
//       console.log('The solution is: ', results[0]);
//       res.status(200).json({ message: results[0] });
//     });

//  } catch (error) {
//   console.log("verify fail>>" + JSON.stringify(error));
//   return res.status(401).json({ message: "Auth failed!" });
// }
// };
