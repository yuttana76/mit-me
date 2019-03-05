
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


exports.getCDDinfo_MIT = (req, res, next) => {

  var fncName = 'getCustomer';
  var _custCode = req.params.cusCode;

  logger.info( `API /cddInfo - ${req.originalUrl} - ${req.ip} - ${_custCode}`);

  var queryStr = `
  BEGIN

  DECLARE @ROW_COUNT int=0;

  SELECT @ROW_COUNT = count(*)
  FROM MIT_CUSTOMER_INFO
  WHERE Cust_Code= @custCode

  IF  @ROW_COUNT> 0 BEGIN

  SELECT *
  FROM MIT_CUSTOMER_INFO
  WHERE Cust_Code= @custCode

  END ELSE
    BEGIN
      SELECT top 1 a.Cust_Code,a.Cust_Code AS ID_CARD, a.Title_Name_T,a.First_Name_T,a.Last_Name_T,a.Birth_Day,a.Mobile,a.Email
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
  END
  `;

  const sql = require('mssql')
  const pool1 = new sql.ConnectionPool(config, err => {
    pool1.request() // or: new sql.Request(pool1)
    .input('custCode', sql.VarChar(50), _custCode)
    .query(queryStr, (err, result) => {
        // ... error checks
        if(err){

          let rsp_code = "902"; // Was error
          res.status(422).json({
            code: rsp_code,
            msg: prop.getRespMsg(rsp_code),
          });

          // console.log( fncName +' Quey db. Was err !!!' + err);
          // res.status(201).json({
          //   message: err,
          // });

        }else {

          let rsp_code = "000";
          res.status(200).json({
            code: rsp_code,
            msg: prop.getRespMsg(rsp_code),
            result: result.recordset
          });

          // res.status(200).json({
          //   message: fncName + "Quey db. successfully!",
          //   result: result.recordset
          // });

        }
    })
  })
  pool1.on('error', err => {
    // ... error handler
    console.log("EROR>>"+err);
  })
}


exports.saveCDDInfo = (req, res, next) => {

  // var fncName = 'saveCDDInfo';
  var Cust_Code = req.body.Cust_Code
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
  var workPlace = req.body.workPlace


  logger.info( `POST API /saveCDDInfo - ${req.originalUrl} - ${req.ip} - ${Cust_Code} - ${dob}`);

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
      ,[WorkPlace]=@WorkPlace
      ,[UpdateBy]=@ActionBy
      ,[UpdateDate]=GETDATE()
    WHERE Cust_Code = @Cust_Code

    if @@rowcount = 0
        begin
        INSERT INTO MIT_CUSTOMER_INFO ([Cust_Code],[ID_CARD] ,[Title_Name_T],[First_Name_T] ,[Last_Name_T] ,[Birth_Day] ,[Mobile] ,[Email]
            ,[Occupation_Code] ,[Position_Code] ,[BusinessType_Code] ,[Income_Code] ,[Income_Source_Code],WorkPlace,[CreateBy] ,[CreateDate] )
        VALUES(@Cust_Code,@ID_CARD ,@Title_Name_T,@First_Name_T ,@Last_Name_T ,@Birth_Day ,@Mobile ,@Email
            ,@Occupation_Code ,@Position_Code ,@BusinessType_Code ,@Income_Code ,@Income_Source_Code ,@WorkPlace,@ActionBy ,GETDATE())
        END
  END

  `;

  // console.log( 'saveCDDInfo() >>' + queryStr);

  const sql = require('mssql')
  const pool1 = new sql.ConnectionPool(config, err => {
    pool1.request() // or: new sql.Request(pool1)
    .input('Cust_Code', sql.VarChar(50), Cust_Code)
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
    .input('WorkPlace', sql.VarChar(500), workPlace)
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



exports.getCDDAddr = (req, res, next) => {

  var fncName = 'getCustomer';

  var _Cust_Code = req.params.cusCode;
  var _Addr_Seq = req.query.Addr_Seq



  logger.info( `API /getCDDAddr - ${req.originalUrl} - ${req.ip} - ${_Cust_Code} - ${_Addr_Seq}`);

  var queryStr = `
  BEGIN
    SELECT *
    FROM MIT_CUSTOMER_ADDR
    Where Cust_Code = @Cust_Code
    AND Addr_Seq = @Addr_Seq
  END
  `;

  const sql = require('mssql')
  const pool1 = new sql.ConnectionPool(config, err => {
    pool1.request() // or: new sql.Request(pool1)
    .input('Cust_Code', sql.VarChar(50), _Cust_Code)
    .input('Addr_Seq', sql.Int, _Addr_Seq)
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


exports.saveCDDAddr = (req, res, next) => {

  var actionBy = req.body.actionBy
  var Cust_Code = req.body.Cust_Code

  var Addr_Seq = req.body.Addr_Seq
  var Addr_No = req.body.Addr_No
  var Moo = req.body.Moo
  var Place = req.body.Place
  var Floor = req.body.Floor
  var Soi = req.body.Soi
  var Road = req.body.Road
  var Tambon_Id = req.body.Tambon_Id
  var Amphur_Id = req.body.Amphur_Id
  var Province_Id = req.body.Province_Id
  var Country_Id = req.body.Country_Id
  var Zip_Code = req.body.Zip_Code
  var Tel = req.body.Tel
  var Fax = req.body.Fax

  logger.info( `POST API /saveCDDAddr - ${req.originalUrl} - ${req.ip} - ${Cust_Code} - ${Addr_Seq}`);

  var queryStr = `
BEGIN

  UPDATE MIT_CUSTOMER_ADDR SET
  [Addr_No] =@Addr_No ,[Moo] =@Moo ,[Place]=@Place ,[Floor]=@Floor,[Soi]=@Soi ,[Road]=@Road ,[Tambon_Id]=@Tambon_Id ,[Amphur_Id]=@Amphur_Id ,[Province_Id]=@Province_Id ,
  [Country_Id]=@Country_Id ,[Zip_Code]=@Zip_Code ,[Tel]=@Tel ,[Fax] =@Fax ,[UpdateBy]=@ActionBy ,[UpdateDate]=GETDATE()
  WHERE
  Cust_Code = @Cust_Code
  AND Addr_Seq =@Addr_Seq

    if @@rowcount = 0
      BEGIN

      INSERT INTO MIT_CUSTOMER_ADDR
      ([Cust_Code] ,[Addr_Seq] ,[Addr_No] ,[Moo] ,[Place] ,[Floor],[Soi] ,[Road] ,[Tambon_Id] ,[Amphur_Id] ,[Province_Id] ,[Country_Id] ,[Zip_Code] ,[Tel] ,[Fax] ,[CreateBy] ,[CreateDate] )
      VALUES
      (@Cust_Code,@Addr_Seq,@Addr_No ,@Moo,@Place ,@Floor ,@Soi ,@Road ,@Tambon_Id ,@Amphur_Id ,@Province_Id ,@Country_Id,@Zip_Code ,@Tel ,@Fax ,@ActionBy ,GETDATE() )

      END

END
  `;

  const sql = require('mssql')
  const pool1 = new sql.ConnectionPool(config, err => {
    pool1.request() // or: new sql.Request(pool1)
    .input('Cust_Code', sql.VarChar(50), Cust_Code)
    .input('Addr_Seq', sql.Int, Addr_Seq)
    .input('Addr_No', sql.NVarChar(100), Addr_No)
    .input('Moo', sql.NVarChar(50), Moo)
    .input('Place', sql.NVarChar(100), Place)
    .input('Floor', sql.NVarChar(50), Floor)
    .input('Soi', sql.NVarChar(50), Soi)
    .input('Road', sql.NVarChar(100), Road)
    .input('Tambon_Id', sql.Int, Tambon_Id)
    .input('Amphur_Id', sql.Int, Amphur_Id)
    .input('Province_Id', sql.Int, Province_Id)
    .input('Country_Id', sql.Int, Country_Id)
    .input('Zip_Code', sql.VarChar(10), Zip_Code)
    .input('Tel', sql.VarChar(50), Tel)
    .input('Fax', sql.VarChar(50), Fax)
    .input('ActionBy', sql.VarChar(10), actionBy)
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
