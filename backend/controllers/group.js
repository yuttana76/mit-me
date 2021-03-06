const dbConfig = require('../config/db-config');

var config = dbConfig.dbParameters;


exports.getGroup = (req, res, next) => {

  var fncName = 'getGroup()';
  var queryStr = `select * FROM MIT_GROUP`;

  const sql = require('mssql')
  const pool1 = new sql.ConnectionPool(config, err => {
    pool1.request() // or: new sql.Request(pool1)
    .query(queryStr, (err, result) => {
        // ... error checks
        if(err){
          console.log( fncName +' Quey db. Was err !!!' + err);
          res.status(201).json({
            message: err,
          });
        }else {
          res.status(200).json({
            message: fncName + "Quey db. successfully!",
            result: result.recordset
          });
        }
    })
  })

  pool1.on('error', err => {
    // ... error handler
    console.log("EROR>>"+err);
  })
}

// exports.getGroupById = (req, res, next) => {

//   var groupId = req.params.groupId;
//   var fncName = 'getGroupById()';
//   var queryStr = `select * FROM MIT_GROUP WHERE GroupId='${groupId}' `;

//   const sql = require('mssql')
//   const pool1 = new sql.ConnectionPool(config, err => {
//     pool1.request() // or: new sql.Request(pool1)
//     .query(queryStr, (err, result) => {
//         // ... error checks
//         if(err){
//           console.log( fncName +' Quey db. Was err !!!' + err);
//           res.status(201).json({
//             message: err,
//           });
//         }else {
//           res.status(200).json({
//             message: fncName + "Quey db. successfully!",
//             result: result.recordset
//           });
//         }
//     })
//   })

//   pool1.on('error', err => {
//     // ... error handler
//     console.log("EROR>>"+err);
//   })
// }


exports.getGroupById = (req, res, next) => {

  var groupId = req.params.groupId;
  var fncName = 'getGroupById()';
  var queryStr = `select * FROM MIT_GROUP WHERE GroupId='${groupId}' `;

  const sql = require('mssql')
  const pool1 = new sql.ConnectionPool(config, err => {
    pool1.request() // or: new sql.Request(pool1)
    .query(queryStr, (err, result) => {
        // ... error checks
        if(err){
          console.log( fncName +' Quey db. Was err !!!' + err);
          res.status(201).json({
            message: err,
          });
        }else {
          res.status(200).json({
            message: fncName + "Quey db. successfully!",
            result: result.recordset
          });
        }
    })
  })

  pool1.on('error', err => {
    // ... error handler
    console.log("EROR>>"+err);
  })
}

exports.createGroup = (req, res, next) => {

  var groupId = req.body.groupId
  var groupName = req.body.groupName

  var fncName = 'createGroup()';

  var queryStr = `INSERT INTO MIT_GROUP (GroupId,GroupName,status)
  VALUES ('${groupId}' , '${groupName}' ,'A')`;

  const sql = require('mssql')
  const pool1 = new sql.ConnectionPool(config, err => {
    pool1.request() // or: new sql.Request(pool1)
    .query(queryStr, (err, result) => {
        // ... error checks
        if(err){
          console.log( fncName +' Quey db. Was err !!!' + err);
          res.status(201).json({
            message: err,
          });
        }else {

          console.log('result>>', JSON.stringify(result));

          res.status(200).json({
            message: fncName + "Quey db. successfully!",
            id: groupId,
            result: result.recordset
          });
        }
    })
  })

  pool1.on('error', err => {
    // ... error handler
    console.log("EROR>>"+err);
  })
}



exports.updateGroup = (req, res, next) => {

  var groupId = req.body.groupId;
  var groupName = req.body.groupName;
  var status = req.body.status || 'A';

  console.log('updateGroup()' + req.body.status + ' : ' +status);

  var fncName = 'updateGroup()';
  var queryStr = `UPDATE MIT_GROUP SET GroupName='${groupName}' , status ='${status}'
                WHERE GroupId='${groupId}' `;

  const sql = require('mssql')
  const pool1 = new sql.ConnectionPool(config, err => {
    pool1.request() // or: new sql.Request(pool1)
    .query(queryStr, (err, result) => {
        // ... error checks
        if(err){
          console.log( fncName +' Quey db. Was err !!!' + err);
          res.status(201).json({
            message: err,
          });
        }else {

          console.log('result>>', JSON.stringify(result));

          res.status(200).json({
            message: fncName + "Quey db. successfully!",
            id: groupId,
            result: result.recordset
          });
        }
    })
  })

  pool1.on('error', err => {
    // ... error handler
    console.log("EROR>>"+err);
  })
}


exports.deleteGroup = (req, res, next) => {

  var groupId = req.params.groupId;
  var fncName = 'deleteGroup()';
  var queryStr = `DELETE FROM MIT_GROUP WHERE GroupId='${groupId}' `;

  const sql = require('mssql')
  const pool1 = new sql.ConnectionPool(config, err => {
    pool1.request() // or: new sql.Request(pool1)
    .query(queryStr, (err, result) => {
        // ... error checks
        if(err){
          console.log( fncName +' Quey db. Was err !!!' + err);
          res.status(201).json({
            message: err,
          });
        }else {
          res.status(200).json({
            message: fncName + "Quey db. successfully!",
            id: groupId,
            result: result.recordset
          });
        }
    })
  })

  pool1.on('error', err => {
    // ... error handler
    console.log("EROR>>"+err);
  })
}
