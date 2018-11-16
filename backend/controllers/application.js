const dbConfig = require('./config');

var config = dbConfig.dbParameters;


exports.getApplication = (req, res, next) => {

  var fncName = 'getApplication()';
  var queryStr = `SELECT * FROM MIT_ApplicationInfo  WHERE STATUS='A'  order by AppName `;

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


exports.deleteApplication = (req, res, next) => {

  var appId = req.params.appId;

  var fncName = 'deleteApplication()';
  var queryStr = `SELECT * FROM MIT_ApplicationInfo  WHERE AppId ='${appId}' `;

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
    console.log("EROR>>"+err);
  })
}

exports.updateApplication = (req, res, next) => {
  var appId = req.body.appId;
  var appName = req.body.AppName;
  var appGroup = req.body.AppGroup;
  var appLink = req.body.AppLink;
  var status = req.body.status;

  var fncName = 'updateApplication()';
  var queryStr = `UPDATE MIT_ApplicationInfo
                  SET  AppName = '${appName}', AppGroup='${appGroup}', AppLink='${appLink}', status='${status}'
                  WHERE AppId ='${appId}' `;

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

exports.addApplication = (req, res, next) => {
  var appId = req.body.appId;
  var appName = req.body.AppName;
  var appGroup = req.body.AppGroup;
  var appLink = req.body.AppLink;
  var status = req.body.status;

  var fncName = 'addApplication()';
  var queryStr = `INSERT INTO MIT_ApplicationInfo  (AppId,AppName,AppGroup,AppLink,status)
                  VALUES( '${appId}','${appName}', '${appGroup}', '${appLink}', '${status}'`;

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
