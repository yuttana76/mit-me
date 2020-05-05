const mpamConfig = require('../config/mpam-config');
var config = mpamConfig.dbParameters;

var logger = require('../config/winston');

exports.getAuthority= (req, res, next) => {

  var fncName = 'getAuthority()';
  var queryStr = `SELECT * FROM MIT_Authority WHERE STATUS='A' ORDER BY MIT_GROUP`;

  const sql = require('mssql')
  const pool1 = new sql.ConnectionPool(config, err => {
    pool1.request() // or: new sql.Request(pool1)
    .query(queryStr, (err, result) => {

        if(err){
          // console.log( fncName +' Quey db. Was err !!!' + err);
          logger.error(fncName + err);
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
    logger.error(fncName + err);
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
          logger.error(fncName + err);
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
    logger.error(fncName + err);
  })
}

exports.addAuthority = (req, res, next) => {

  var AppId = req.body.AppId;
  var MIT_GROUP  = req.body.MIT_GROUP;
  var Status = req.body.Status;
  var mCreate  = req.body.mCreate == true? 'Y': 'N';
  var mEdit =req.body.mEdit == true? 'Y': 'N';
  var mView =req.body.mView == true? 'Y': 'N';
  var mDelete =req.body.mDelete == true? 'Y': 'N';
  var EXPIRE_DATE = req.body.EXPIRE_DATE != null? req.body.EXPIRE_DATE : null;

  var fncName = 'addAuthority()';

  var queryStr = `INSERT INTO MIT_Authority
  (AppId ,MIT_GROUP ,Status  ,mcreate  ,medit ,mview ,mdelete  ,EXPIRE_DATE)
  VALUES ('${AppId}' ,'${MIT_GROUP}' ,'${Status}'  ,'${mCreate}'  ,'${mEdit}' ,'${mView}' ,'${mDelete}'  , ${EXPIRE_DATE} ) `;

  console.log('INSERT QUERY>>' , queryStr);

  const sql = require('mssql')
  const pool1 = new sql.ConnectionPool(config, err => {
    pool1.request() // or: new sql.Request(pool1)
    .query(queryStr, (err, result) => {
        // ... error checks
        if(err){
          logger.error(fncName + err);
          res.status(201).json({
            message: err,
          });
        }else {

          res.status(200).json({
            message: fncName + "Quey db. successfully!",
            id: MIT_GROUP,
            result: result.recordset
          });
        }
    })
  })
  pool1.on('error', err => {
    logger.error(fncName + err);
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
          logger.error(fncName + err);
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
    logger.error(fncName + err);
  })
}


exports.getPermissionByAppId = (req, res, next) => {

  var userId = req.params.userId;
  var appId = req.params.appId;

  var fncName = 'getPermissionByAppId()';

  var queryStr = `    SELECT B.*
  from MIT_USERS_GROUP A
,MIT_Authority B
,MIT_ApplicationInfo C
WHERE A.USERID = '${userId}' AND C.AppId ='${appId}'
  AND A.[STATUS] ='A'
AND CURRENT_TIMESTAMP < ISNULL(A.EXPIRE_DATE,CURRENT_TIMESTAMP+1)
 AND B.MIT_GROUP =A.GroupId
  AND B.[Status]='A'
  AND CURRENT_TIMESTAMP < ISNULL(B.EXPIRE_DATE,CURRENT_TIMESTAMP+1)
AND B.AppId = C.AppId
order by C.menuGroup, C.menuOrder
 `;

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
