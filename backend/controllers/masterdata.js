const dbConfig = require('../config/db-config');
var prop = require("../config/backend-property");
var logger = require("../config/winston");
var config = dbConfig.dbParameters;

exports.getOccupation = (req, res, next) => {

  logger.info(`API /occupations - ${req.originalUrl} - ${req.ip} `);
  var fncName = 'getOccupation';
  let rsp_code;
  var queryStr = `
  SELECT *
  FROM [REF_Occupation]
  ORDER BY Describe
  `;

  const sql = require('mssql')
  const pool1 = new sql.ConnectionPool(config, err => {
    pool1.request() // or: new sql.Request(pool1)
    .query(queryStr, (err, result) => {
        // ... error checks
        if(err){
          rsp_code = "205";
          return res.status(401).json({
            code: rsp_code,
            msg: prop.getRespMsg(rsp_code)
          });
        }else {
          rsp_code = "000";
          return res.status(200).json({
            code: rsp_code,
            msg: prop.getRespMsg(rsp_code),
            result: result.recordset
          });
        }
    })
  })
  pool1.on('error', err => {
    console.log("EROR>>"+err);
  })
}


exports.getBusinessType = (req, res, next) => {

  logger.info(`API /getBusinessType - ${req.originalUrl} - ${req.ip} `);
  let rsp_code;
  var queryStr = `
  SELECT *
  FROM [REF_Business_Type]
  ORDER BY Describe
  `;

  const sql = require('mssql')
  const pool1 = new sql.ConnectionPool(config, err => {
    pool1.request() // or: new sql.Request(pool1)
    .query(queryStr, (err, result) => {
        // ... error checks
        if(err){
          rsp_code = "205";
          return res.status(401).json({
            code: rsp_code,
            msg: prop.getRespMsg(rsp_code)
          });
        }else {
          rsp_code = "000";
          return res.status(200).json({
            code: rsp_code,
            msg: prop.getRespMsg(rsp_code),
            result: result.recordset
          });
        }
    })
  })
  pool1.on('error', err => {
    console.log("EROR>>"+err);
  })
}


exports.getPosition = (req, res, next) => {

  logger.info(`API /getPosition - ${req.originalUrl} - ${req.ip} `);
  let rsp_code;
  var queryStr = `
  SELECT *
  FROM [REF_Position]
  ORDER BY Thai_Name
  `;

  const sql = require('mssql')
  const pool1 = new sql.ConnectionPool(config, err => {
    pool1.request() // or: new sql.Request(pool1)
    .query(queryStr, (err, result) => {
        // ... error checks
        if(err){
          rsp_code = "205";
          return res.status(401).json({
            code: rsp_code,
            msg: prop.getRespMsg(rsp_code)
          });
        }else {
          rsp_code = "000";
          return res.status(200).json({
            code: rsp_code,
            msg: prop.getRespMsg(rsp_code),
            result: result.recordset
          });
        }
    })
  })
  pool1.on('error', err => {
    console.log("EROR>>"+err);
  })
}


exports.getIncome = (req, res, next) => {

  logger.info(`API /getIncome - ${req.originalUrl} - ${req.ip} `);
  var fncName = 'getIncome';
  let rsp_code;
  var queryStr = `
  SELECT *
  FROM [dbo].[REF_Income]
  where Amc_Id=0
  and TypeHolder=1
  order  by Amc_Id,Code
  `;

  const sql = require('mssql')
  const pool1 = new sql.ConnectionPool(config, err => {
    pool1.request() // or: new sql.Request(pool1)
    .query(queryStr, (err, result) => {
        // ... error checks
        if(err){
          rsp_code = "205";
          return res.status(401).json({
            code: rsp_code,
            msg: prop.getRespMsg(rsp_code)
          });
        }else {
          rsp_code = "000";
          return res.status(200).json({
            code: rsp_code,
            msg: prop.getRespMsg(rsp_code),
            result: result.recordset
          });
        }
    })
  })
  pool1.on('error', err => {
    console.log("EROR>>"+err);
  })
}



exports.getIncomeSource = (req, res, next) => {

  logger.info(`API /getIncomeSource - ${req.originalUrl} - ${req.ip} `);
  let rsp_code;
  var queryStr = `
  SELECT *
  FROM [REF_IncomeSource]
  where Amc_Id=0 and TypeHolder=1
  order by Thai_Name
  `;

  const sql = require('mssql')
  const pool1 = new sql.ConnectionPool(config, err => {
    pool1.request() // or: new sql.Request(pool1)
    .query(queryStr, (err, result) => {
        // ... error checks
        if(err){
          rsp_code = "205";
          return res.status(401).json({
            code: rsp_code,
            msg: prop.getRespMsg(rsp_code)
          });
        }else {
          rsp_code = "000";
          return res.status(200).json({
            code: rsp_code,
            msg: prop.getRespMsg(rsp_code),
            result: result.recordset
          });
        }
    })
  })
  pool1.on('error', err => {
    console.log("EROR>>"+err);
  })
}
