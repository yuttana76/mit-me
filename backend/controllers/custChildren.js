
const dbConfig = require('../config/db-config');
var config = dbConfig.dbParameters;
var logger = require('../config/winston');
var prop = require("../config/backend-property");
var mitLog = require('./mitLog');


exports.getChildrenList = (req, res, next) => {

  // var fncName = 'getChildrenList';
  var custid = req.params.custid;

  logger.info( `API /getChildrenList - ${req.originalUrl} - ${req.ip} - ${custid}`);

  var queryStr = `
  BEGIN
    SELECT *
    FROM MIT_CUSTOMER_CHILDREN
    WHERE Cust_Code=@Cust_Code
  END
  `;

  const sql = require('mssql')
  const pool1 = new sql.ConnectionPool(config, err => {
    pool1.request() // or: new sql.Request(pool1)
    .input('Cust_Code', sql.VarChar(50), custid)
    .query(queryStr, (err, result) => {
        if(err){
          let rsp_code = "902"; // Was error
          res.status(422).json({
            code: rsp_code,
            msg: prop.getRespMsg(rsp_code),
          });
        }else {
          let rsp_code = "000";
          res.status(200).json({
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


exports.getChildren = (req, res, next) => {

  // var fncName = 'getChildren';
  var ChildCardNumber = req.params.id;
  logger.info( `API /getChildren - ${req.originalUrl} - ${req.ip} - ${ChildCardNumber}`);

  var queryStr = `
  BEGIN
    SELECT *
    FROM MIT_CUSTOMER_CHILDREN
    WHERE ChildCardNumber=@ChildCardNumber
  END
  `;

  const sql = require('mssql')
  const pool1 = new sql.ConnectionPool(config, err => {
    pool1.request() // or: new sql.Request(pool1)
    .input('ChildCardNumber', sql.VarChar(50), ChildCardNumber)
    .query(queryStr, (err, result) => {
        if(err){
          let rsp_code = "902"; // Was error
          res.status(422).json({
            code: rsp_code,
            msg: prop.getRespMsg(rsp_code),
          });
        }else {
          let rsp_code = "000";
          res.status(200).json({
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


exports.CreateChildren = (req, res, next) => {

  // var fncName = 'CreateChildren';
  var Cust_Code = req.body.Cust_Code;

  var ChildIDType = req.body.ChildIDType;
  var ChildPassportCountry = req.body.ChildPassportCountry;
  var ChildCardNumber = req.body.ChildCardNumber;
  var cardExpiryDate = req.body.cardExpiryDate;
  var cardNotExt = req.body.cardNotExt;
  var title = req.body.title;
  var titleOther = req.body.titleOther;
  var First_Name_T = req.body.First_Name_T;
  var Last_Name_T = req.body.Last_Name_T;
  var First_Name_E = req.body.First_Name_E;
  var Last_Name_E = req.body.Last_Name_E;
  var Birth_Day = req.body.Birth_Day;
  var CreateBy = req.body.CreateBy;

  logger.info( `API /CreateChildren - ${req.originalUrl} - ${req.ip} - ${Cust_Code} - ${ChildPassportCountry}`);

  var queryStr = `
  BEGIN

   INSERT INTO MIT_CUSTOMER_CHILDREN
   (Cust_Code, ChildIDType, ChildPassportCountry, ChildCardNumber, cardExpiryDate
    ,cardNotExt, title, titleOther, First_Name_T, Last_Name_T,First_Name_E, Last_Name_E
    ,Birth_Day, CreateBy, CreateDate)
   VALUES
   (@Cust_Code, @ChildIDType, @ChildPassportCountry, @ChildCardNumber, @cardExpiryDate
    ,@cardNotExt, @title, @titleOther, @First_Name_T, @Last_Name_T,@First_Name_E, @Last_Name_E
    ,@Birth_Day, @CreateBy, GETDATE())

  END
  `;

  const sql = require('mssql')
  const pool1 = new sql.ConnectionPool(config, err => {
    pool1.request()
    .input('Cust_Code', sql.VarChar(50), Cust_Code)
    .input('ChildIDType', sql.VarChar(50), ChildIDType)
    .input('ChildPassportCountry', sql.VarChar(50), ChildPassportCountry)
    .input('ChildCardNumber', sql.Int, ChildCardNumber)
    .input('cardExpiryDate', sql.VarChar(20), cardExpiryDate)
    .input('cardNotExt', sql.VarChar(1), cardNotExt)
    .input('title', sql.NVarChar(50), title)
    .input('titleOther', sql.NVarChar(50), titleOther)
    .input('First_Name_T', sql.NVarChar(200), First_Name_T)
    .input('Last_Name_T', sql.NVarChar(200), Last_Name_T)
    .input('First_Name_E', sql.VarChar(200), First_Name_E)
    .input('Last_Name_E', sql.VarChar(200), Last_Name_E)
    .input('Birth_Day', sql.VarChar(20), Birth_Day)
    .input('CreateBy', sql.VarChar(50), CreateBy)
    .query(queryStr, (err, result) => {
        if(err){
          let rsp_code = "902"; // Was error
          res.status(422).json({
            code: rsp_code,
            msg: prop.getRespMsg(rsp_code),
          });
        }else {
          let rsp_code = "000";
          res.status(200).json({
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


exports.UpdateChildren = (req, res, next) => {

  // var fncName = 'UpdateChildren';
  var ChildCardNumber = req.params.id;

  var ChildIDType = req.body.ChildIDType;
  var ChildPassportCountry = req.body.ChildPassportCountry;
  var cardExpiryDate = req.body.cardExpiryDate;
  var cardNotExt = req.body.cardNotExt;
  var title = req.body.title;
  var titleOther = req.body.titleOther;
  var First_Name_T = req.body.First_Name_T;
  var Last_Name_T = req.body.Last_Name_T;
  var First_Name_E = req.body.First_Name_E;
  var Last_Name_E = req.body.Last_Name_E;
  var Birth_Day = req.body.Birth_Day;
  var UpdateBy = req.body.UpdateBy;

  logger.info( `API /UpdateChildren - ${req.originalUrl} - ${req.ip} - ${ChildCardNumber}`);


  var queryStr = `
  BEGIN

    UPDATE MIT_CUSTOMER_CHILDREN
    SET  ChildIDType=@ChildIDType, ChildPassportCountry=@ChildPassportCountry, ChildCardNumber=@ChildCardNumber, cardExpiryDate=@cardExpiryDate, cardNotExt=@cardNotExt
    , title=@title, titleOther=@titleOther, First_Name_T=@First_Name_T, Last_Name_T=@Last_Name_T, First_Name_E=@First_Name_E, Last_Name_E=@Last_Name_E, Birth_Day=@Birth_Day
    , UpdateBy=@UpdateBy, UpdateDate=GETDATE()
    WHERE ChildCardNumber = @ChildCardNumber;

  END
  `;

  const sql = require('mssql')
  const pool1 = new sql.ConnectionPool(config, err => {
    pool1.request()
    .input('ChildIDType', sql.VarChar(50), ChildIDType)
    .input('ChildPassportCountry', sql.VarChar(50), ChildPassportCountry)
    .input('ChildCardNumber', sql.Int, ChildCardNumber)
    .input('cardExpiryDate', sql.VarChar(20), cardExpiryDate)
    .input('cardNotExt', sql.VarChar(1), cardNotExt)
    .input('title', sql.NVarChar(50), title)
    .input('titleOther', sql.NVarChar(50), titleOther)
    .input('First_Name_T', sql.NVarChar(200), First_Name_T)
    .input('Last_Name_T', sql.NVarChar(200), Last_Name_T)
    .input('First_Name_E', sql.VarChar(200), First_Name_E)
    .input('Last_Name_E', sql.VarChar(200), Last_Name_E)
    .input('Birth_Day', sql.VarChar(20), Birth_Day)
    .input('UpdateBy', sql.VarChar(50), UpdateBy)
    .query(queryStr, (err, result) => {
        if(err){
          let rsp_code = "902"; // Was error
          res.status(422).json({
            code: rsp_code,
            msg: prop.getRespMsg(rsp_code),
          });
        }else {
          let rsp_code = "000";
          res.status(200).json({
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
