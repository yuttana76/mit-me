const dbConfig = require('./config');

var config = dbConfig.dbParameters;


exports.getAuthority= (req, res, next) => {

  var fncName = 'getAuthority()';
  var queryStr = `SELECT * FROM MIT_Authority WHERE STATUS='A' ORDER BY MIT_GROUP`;

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


exports.getAuthorityByGroup= (req, res, next) => {

  var fncName = 'getAuthorityByGroup()';
  var groupId = req.params.groupId;

  var queryStr =`SELECT a.* ,b.AppName
                  FROM MIT_Authority a
                  LEFT JOIN MIT_ApplicationInfo b ON a.AppId=b.AppId
                  WHERE  MIT_GROUP = '${groupId}'
                  ORDER BY MIT_GROUP`;


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

