// import { inspect } from 'util' // or directly
var util = require('util')

const dbConfig = require('../config/db-config');
var config = dbConfig.dbParameters;
var logger = require('../config/winston');


exports.getAnoucement = (req, res, next) => {

  logger.info('Welcome getAnoucement()');

  var fncName = 'getAnoucement()';
  var queryStr = `SELECT * FROM MIT_ANOUCEMENT  order by AnouceDate `;

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


exports.getActiveAnoucement = (req, res, next) => {

  var fncName = 'getAnoucement()';
  var queryStr = `SELECT * FROM MIT_ANOUCEMENT
                  WHERE status='A'
                  and AnouceDate <= GETDATE()
                  order by AnouceDate `;

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

exports.addAnoucement = (req, res, next) => {
  var fncName = 'addAnoucement()';

  // console.log('Welcome addAnoucement()' + util.inspect(req))
  console.log('Welcome addAnoucement()  req.file>>');
  const url = req.protocol + '://' + req.get('host');
  const _Path = url + '/images/' + req.file.filename;

  console.log('_Path>>' + _Path);

  var _Topic = req.body.Topic;
  var _AnouceFrom = req.body.AnouceFrom || '';
  var _Catgory = req.body.Catgory || '';
  var _status = req.body.status || '';
  var _AnouceDate = req.body.AnouceDate || '';
  var _SourceType = req.body.SourceType || '';
  var _SourcePath = req.body.SourcePath || _Path;
  var _SourceContent = req.body.SourceContent || '';
  var _CreateBy = req.body.CreateBy || '';

  var queryStr = `INSERT INTO MIT_ANOUCEMENT  (Topic,AnouceFrom,Catgory,status,AnouceDate,SourceType,SourcePath,SourceContent,CreateBy,CreateDate)
                  VALUES( '${_Topic}','${_AnouceFrom}', '${_Catgory}', '${_status}', '${_AnouceDate}' ,'${_SourceType}', '${_SourcePath}', '${_SourceContent}' , '${_CreateBy}' , GETDATE() )`;

  console.log('addApplication()>>', queryStr);

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


exports.updateAnoucement = (req, res, next) => {

  var fncName = 'updateAnoucement()';
  const url = req.protocol + '://' + req.get('host');
  const _Path = url + '/images/' + req.file.filename;

  var _Id = req.body.Id;
  var _Topic = req.body.Topic;
  var _AnouceFrom = req.body.AnouceFrom || '';
  var _Catgory = req.body.Catgory || '';
  var _status = req.body.status || '';
  var _AnouceDate = req.body.AnouceDate || '';
  var _SourceType = req.body.SourceType || '';
  var _SourcePath = req.body.SourcePath || _Path;
  var _SourceContent = req.body.SourceContent || '';
  var _UpdateBy = req.body.UpdateBy || '';

  var queryStr = `UPDATE MIT_ANOUCEMENT
                  SET  Topic = '${_Topic}', AnouceFrom='${_AnouceFrom}', Catgory='${_Catgory}', status='${_status}' , AnouceDate='${_AnouceDate}' , SourceType='${_SourceType}'
                  , SourcePath='${_SourcePath}' , SourceContent='${_SourceContent}'
                  ,UpdateBy='${_UpdateBy}'
                  ,UpdateDate= GETDATE()
                  WHERE ID ='${_Id}' `;

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

exports.delAnoucement = (req, res, next) => {

  var id = req.params.id;
  var fncName = 'delAnoucement()';
  var queryStr = `Delete FROM MIT_ANOUCEMENT  WHERE id ='${id}' `;

  const sql = require('mssql')
  const pool1 = new sql.ConnectionPool(config, err => {
    pool1.request() // or: new sql.Request(pool1)
    .query(queryStr, (err, result) => {
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
