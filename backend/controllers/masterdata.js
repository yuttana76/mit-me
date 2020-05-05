
const mpamConfig = require('../config/mpam-config');
var prop = require("../config/backend-property");
var logger = require("../config/winston");
var config = mpamConfig.dbParameters;

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
  WHERE MIT_FLAG = 'A'
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
// ************** fundconnext

exports.getFCbusinessType = (req, res, next) => {

  logger.info(`API /getFcBusinessType - ${req.originalUrl} - ${req.ip} `);
  let rsp_code;
  var queryStr = `
  select  [Code]
  ,[Thai_Name]
  ,[Eng_Name]
from MIT_FC_BUSINESS_TYPE
order by SEQ,Thai_Name

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


exports.getFCoccupation = (req, res, next) => {

  logger.info(`API /getFCoccupation - ${req.originalUrl} - ${req.ip} `);
  let rsp_code;
  var queryStr = `
  select  [Code]
  ,[Thai_Name]
  ,[Eng_Name]
from MIT_FC_OCCUPATION
order by SEQ,Thai_Name

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


exports.getFCincomeLevel = (req, res, next) => {
  logger.info(`API /getFCincomeLevel - ${req.originalUrl} - ${req.ip} `);
  let rsp_code;
  var queryStr = `
    select *
    from MIT_FC_INCOME_LEVEL
    order by Code
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


exports.getFCincomeSource = (req, res, next) => {
  logger.info(`API /getFCincomeSource - ${req.originalUrl} - ${req.ip} `);
  let rsp_code;
  var queryStr = `
  select  [Code]
  ,[Thai_Name]
  ,[Eng_Name]
    from MIT_FC_INCOME_SOURCE
    order by SEQ,Thai_Name
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


exports.getFCnation = (req, res, next) => {
  logger.info(`API /getFCnation - ${req.originalUrl} - ${req.ip} `);
  let rsp_code;
  var queryStr = `
  select *
  from MIT_FC_NATION
  order by Eng_Name
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



exports.getMFTSnationBYSET_CODE = (code) => {
  logger.info(`API /getMFTSnationBYSET_CODE`);
  let rsp_code;
  var queryStr = `
  select *
  from REF_Nations
  WHERE SET_Code=@SET_Code
  `;
  const sql = require('mssql')
  const pool1 = new sql.ConnectionPool(config, err => {
    pool1.request()
    .input("SET_Code", sql.VarChar(20), code)
    .query(queryStr, (err, result) => {
      console.log('RESULT>' + JSON.stringify(result.recordset));
        return result.recordset
    })
  })
  pool1.on('error', err => {
    console.log("EROR>>"+err);
    return null
  })
}



exports.getFCcountry = (req, res, next) => {
  logger.info(`API /getFCcountry - ${req.originalUrl} - ${req.ip} `);
  let rsp_code;
  var queryStr = `
  select *
  from MIT_FC_COUNTRY
  order by Eng_Name
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


exports.getCodeLookup = (req, res, next) => {
  logger.info(`API /getCodeLookup - ${req.originalUrl} - ${req.ip} `);
  var keyname = req.query.keyname || false;
  let rsp_code;

  // VALIDATION
  if(!keyname){
    return res.status(400).json();
  }

  var queryStr = `
    SELECT keycode,keyText
    FROM MIT_CODE_LOOKUP
    WHERE keyname='${keyname}'
    AND status=1
    ORDER BY fieldOrder
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

exports.getBank = (req, res, next) => {
  logger.info(`API /bank - ${req.originalUrl} - ${req.ip} `);
  let rsp_code;
  var queryStr = `
  SELECT [Bank_ID] ,[Bank_Name_T]
  FROM [dbo].[REF_Banks]
  ORDER BY [Bank_Name_T]
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

exports.getBranch = (req, res, next) => {
  logger.info(`API /bank - ${req.originalUrl} - ${req.ip} `);
  let rsp_code;
  var queryStr = `
  SELECT [Bank_ID],[Branch_ID],[Branch_Name_T]
  FROM [dbo].[REF_Bank_Branchs]
  order by Branch_Name_T
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
