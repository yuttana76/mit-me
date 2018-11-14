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


exports.addAuthority = (req, res, next) => {

  var AppId = req.body.AppId;
  var MIT_GROUP  = req.body.MIT_GROUP;
  var Status = req.body.Status;
  var mcreate  = req.body.mcreate;
  var medit =req.body.medit;
  var mview =req.body.mview;
  var mdelete =req.body.mdelete;
  var EXPIRE_DATE = req.body.EXPIRE_DATE;

  var fncName = 'addAuthority()';

  console.log(fncName + 'MIT_GROUP=' + MIT_GROUP + '  ;AppId=' + AppId);


  var queryStr = `INSERT INTO MIT_Authority
  (AppId ,MIT_GROUP ,Status  ,mcreate  ,medit ,mview ,mdelete  ,EXPIRE_DATE)
  VALUES ('${AppId}' ,'${MIT_GROUP}' ,'${Status}'  ,'${mcreate}'  ,'${medit}' ,'${mview}' ,'${mdelete}'  ,'${EXPIRE_DATE}')`;

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


exports.deleteAuthority = (req, res, next) => {

  var MIT_GROUP  = req.params.groupId;
  var AppId = req.params.AppId;
  var fncName = 'deleteAuthority()';

  console.log(fncName + 'MIT_GROUP=' + MIT_GROUP + '  ;AppId=' + AppId);


  var queryStr = `DELETE FROM MIT_Authority WHERE MIT_GROUP='${MIT_GROUP}'  AND AppId ='${AppId}' `;

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
            AppId: AppId,
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
