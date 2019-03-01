
const dbConfig = require('../config/db-config');
// var sql = require("mssql");
var config = dbConfig.dbParameters;
var logger = require('../config/winston');
var prop = require("../config/backend-property");

exports.getCDDinfo = (req, res, next) => {

  var fncName = 'getCustomer';
  var _custCode = req.params.cusCode;

  logger.info( `API /cddInfo - ${req.originalUrl} - ${req.ip} - ${_custCode}`);

  var queryStr = `
  BEGIN

  select top 1 a.Cust_Code,a.Title_Name_T,a.First_Name_T,a.Last_Name_T,a.Birth_Day,a.Mobile,a.Email
  ,b.Account_No,b.Occupation_Code,b.Occupation_Desc
,b.Position_Code,b.Position,b.Politician_Desc
,b.BusinessType_Code
,b.Income,b.Income_Code,b.Income_Source,b.Income_Source_Code
,b.Modify_Date
  FROM [Account_Info] a
  left join MFTS_Account b on b.Account_No like a.Cust_Code
  WHERE Cust_Code= @custCode
  order by b.Modify_Date desc

  END
  `;

  const sql = require('mssql')
  const pool1 = new sql.ConnectionPool(config, err => {
    pool1.request() // or: new sql.Request(pool1)
    .input('custCode', sql.VarChar(50), _custCode)
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


exports.saveCDDInfo = (req, res, next) => {

  var fncName = 'saveCDDInfo';
  var custCode = req.body.custCode
  var actionBy = req.body.actionBy
  var pid = req.body.pid
  var title = req.body.title
  var firstName = req.body.firstName
  var lastName = req.body.lastName
  var dob = req.body.dob
  var mobile = req.body.mobile
  var email = req.body.email
  var occupation = req.body.occupation
  var position = req.body.position
  var typeBusiness = req.body.typeBusiness
  var incomeLevel = req.body.incomeLevel
  var incomeSource = req.body.incomeSource

  logger.info( `POST API /saveCDDInfo - ${req.originalUrl} - ${req.ip} - ${custCode}`);

  var queryStr = `
  BEGIN
    UPDATE MIT_CUSTOMER_INFO SET
      [ID_CARD]=@ID_CARD
      ,[Title_Name_T]=@Title_Name_T
      ,[First_Name_T]=@First_Name_T
      ,[Last_Name_T]=@Last_Name_T
      ,[Birth_Day]=@Birth_Day
      ,[Mobile]=@Mobile
      ,[Email]=@Email
      ,[Occupation_Code]=@Occupation_Code
      ,[Position_Code]=@Position_Code
      ,[BusinessType_Code]=@BusinessType_Code
      ,[Income_Code]=@Income_Code
      ,[Income_Source_Code]=@Income_Source_Code
      ,[UpdateBy]=@ActionBy
      ,[UpdateDate]=GETDATE()
    WHERE CustCode = @CustCode

    if @@rowcount = 0
        begin
        INSERT INTO MIT_CUSTOMER_INFO ([CustCode],[ID_CARD] ,[Title_Name_T],[First_Name_T] ,[Last_Name_T] ,[Birth_Day] ,[Mobile] ,[Email]
            ,[Occupation_Code] ,[Position_Code] ,[BusinessType_Code] ,[Income_Code] ,[Income_Source_Code],[CreateBy] ,[CreateDate] )
        VALUES(@CustCode,@ID_CARD ,@Title_Name_T,@First_Name_T ,@Last_Name_T ,'@Birth_Day' ,@Mobile ,@Email
            ,@Occupation_Code ,@Position_Code ,@BusinessType_Code ,@Income_Code ,@Income_Source_Code ,@ActionBy ,GETDATE())
        END
  END

  `;

  const sql = require('mssql')
  const pool1 = new sql.ConnectionPool(config, err => {
    pool1.request() // or: new sql.Request(pool1)
    .input('CustCode', sql.VarChar(50), custCode)
    .input('ID_CARD', sql.VarChar(50), pid)
    .input('Title_Name_T', sql.VarChar(200), title)
    .input('First_Name_T', sql.VarChar(200), firstName)
    .input('Last_Name_T', sql.VarChar(200), lastName)
    .input('Birth_Day', sql.VarChar(20), dob)
    .input('Mobile', sql.VarChar(50), mobile)
    .input('Email', sql.VarChar(200), email)
    .input('Occupation_Code', sql.VarChar(3), occupation)
    .input('Position_Code', sql.VarChar(3), position)
    .input('BusinessType_Code', sql.VarChar(3), typeBusiness)
    .input('Income_Code', sql.VarChar(3), incomeLevel)
    .input('Income_Source_Code', sql.VarChar(3), incomeSource)
    .input('ActionBy', sql.VarChar(50), actionBy)
    .query(queryStr, (err, result) => {
        if(err){
          logger.error( '' + err );
          rsp_code = "902"; // Was error
          res.status(422).json({
            code: rsp_code,
            msg: prop.getRespMsg(rsp_code),
          });

        }else {
          rsp_code = "000";
          res.status(200).json({
            code: rsp_code,
            msg: prop.getRespMsg(rsp_code)
          });
        }
    })
  })

  pool1.on('error', err => {
    // ... error handler
    console.log("EROR>>"+err);
  })
}
