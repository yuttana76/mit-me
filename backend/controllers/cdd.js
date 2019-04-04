
const dbConfig = require('../config/db-config');
// var sql = require("mssql");
var config = dbConfig.dbParameters;
var logger = require('../config/winston');
var prop = require("../config/backend-property");
var mitLog = require('./mitLog');

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
      SELECT top 1 a.Cust_Code,a.Cust_Code AS ID_CARD, a.Title_Name_T,a.First_Name_T,a.Last_Name_T,a.First_Name_E,a.Last_Name_E,a.Birth_Day,a.Mobile,a.Email
      ,b.Account_No,b.Occupation_Code,b.Occupation_Desc
      ,b.Position_Code,b.Position,b.Politician_Desc
      ,b.BusinessType_Code
      ,b.Income,b.Income_Code,b.Income_Source,b.Income_Source_Code
      ,b.Modify_Date
      ,b.PID_ExpiryDate AS cardExpiryDate
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

  var fncName = 'saveCDDInfo';
  var Cust_Code = req.body.Cust_Code;
  var actionBy = req.body.actionBy;
  var pid = req.body.pid;
  var title = req.body.title;
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  var dob = req.body.dob;
  var cardExpiryDate = req.body.cardExpiryDate;
  var mobile = req.body.mobile;
  var email = req.body.email;
  var occupation = req.body.occupation;
  var occupation_Oth = req.body.occupation_Oth;
  var position = req.body.position;
  var position_Oth = req.body.position_Oth;
  var typeBusiness = req.body.typeBusiness;
  var typeBusiness_Oth = req.body.typeBusiness_Oth;
  var reqModifyFlag = req.body.ReqModifyFlag;
  var incomeLevel = req.body.incomeLevel;
  var incomeSource = req.body.incomeSource;
  var incomeSource_Oth = req.body.incomeSource_Oth;
  var workPlace = req.body.workPlace;

  var identificationCardType = req.body.identificationCardType;
  var passportCountry = req.body.passportCountry;
  var title = req.body.title;
  var titleOther = req.body.titleOther;
  var firstNameE = req.body.firstNameE;
  var lastNameE = req.body.lastNameE;

  var logMsg = `POST API /saveCDDInfo - ${req.originalUrl} - ${req.ip} - ${Cust_Code}`;
  logger.info( logMsg);

  var queryStr = `
  BEGIN

  UPDATE MIT_CUSTOMER_INFO SET
   [ID_CARD]=@ID_CARD
   ,[First_Name_T]=@First_Name_T
   ,[Last_Name_T]=@Last_Name_T
   ,[Birth_Day]=@Birth_Day
   ,[cardExpiryDate]=@cardExpiryDate
   ,[Mobile]=@Mobile
   ,[Email]=@Email
   ,[Occupation_Code]=@Occupation_Code
   ,[Occupation_Desc]=@Occupation_Oth
   ,[Position_Code]=@Position_Code
   ,[Position_Desc]=@Position_Oth
   ,[BusinessType_Code]=@BusinessType_Code
   ,[BusinessType_Desc]=@BusinessType_Oth
   ,[Income_Code]=@Income_Code
   ,[Income_Source_Code]=@Income_Source_Code
   ,[Income_Source_Desc]=@Income_Source_Oth
   ,[WorkPlace]=@WorkPlace
   ,[ReqModifyFlag]=@ReqModifyFlag
   ,[UpdateBy]=@ActionBy
   ,[UpdateDate]=GETDATE()

   ,[identificationCardType]=@identificationCardType
   ,[passportCountry]=@passportCountry
   ,[title]=@title
   ,[titleOther]=@titleOther
   ,[First_Name_E]=@First_Name_E
   ,[Last_Name_E]=@Last_Name_E
   WHERE Cust_Code = @Cust_Code;


    if @@rowcount = 0
    BEGIN

    INSERT INTO MIT_CUSTOMER_INFO ([Cust_Code],[ID_CARD] ,[First_Name_T] ,[Last_Name_T] ,[Birth_Day] ,[Mobile] ,[Email]
      ,[Occupation_Code] ,[Occupation_Desc] ,[Position_Code],[Position_Desc] ,[BusinessType_Code],[BusinessType_Desc] ,[Income_Code] ,[Income_Source_Code],[Income_Source_Desc],WorkPlace,ReqModifyFlag,[CreateBy] ,[CreateDate]
      ,[identificationCardType],[passportCountry],[title],[titleOther],[First_Name_E],[Last_Name_E],cardExpiryDate)
    VALUES(@Cust_Code,@ID_CARD ,@First_Name_T ,@Last_Name_T ,@Birth_Day ,@Mobile ,@Email
        ,@Occupation_Code,@Occupation_Oth ,@Position_Code,@Position_Oth ,@BusinessType_Code,@BusinessType_Oth ,@Income_Code ,@Income_Source_Code,@Income_Source_Oth ,@WorkPlace,@ReqModifyFlag,@ActionBy ,GETDATE()
        ,@identificationCardType,@passportCountry,@title,@titleOther,@First_Name_E,@Last_Name_E,@cardExpiryDate)

    END

  END
  `;

  // console.log( 'saveCDDInfo() >>' + queryStr);

  const sql = require('mssql')
  const pool1 = new sql.ConnectionPool(config, err => {
    pool1.request()
    .input('Cust_Code', sql.NVarChar(50), Cust_Code)
    .input('ID_CARD', sql.VarChar(50), pid)
    .input('First_Name_T', sql.NVarChar(200), firstName)
    .input('Last_Name_T', sql.NVarChar(200), lastName)
    .input('Birth_Day', sql.VarChar(20), dob)
    .input('cardExpiryDate', sql.VarChar(20), cardExpiryDate)
    .input('Mobile', sql.VarChar(50), mobile)
    .input('Email', sql.NVarChar(200), email)
    .input('Occupation_Code', sql.VarChar(3), occupation)
    .input('Occupation_Oth', sql.NVarChar(100), occupation_Oth)
    .input('Position_Code', sql.VarChar(3), position)
    .input('Position_Oth', sql.NVarChar(100), position_Oth)
    .input('BusinessType_Code', sql.VarChar(3), typeBusiness)
    .input('BusinessType_Oth', sql.NVarChar(100), typeBusiness_Oth)
    .input('Income_Code', sql.VarChar(6), incomeLevel)
    .input('Income_Source_Code', sql.VarChar(100), incomeSource)
    .input('Income_Source_Oth', sql.NVarChar(100), incomeSource_Oth)
    .input('WorkPlace', sql.NVarChar(500), workPlace)
    .input('ReqModifyFlag', sql.VarChar(1), reqModifyFlag)
    .input('ActionBy', sql.VarChar(50), actionBy)

    .input('identificationCardType', sql.VarChar(15), identificationCardType)
    .input('passportCountry', sql.VarChar(2), passportCountry)
    .input('title', sql.VarChar(5), title)
    .input('titleOther', sql.NVarChar(50), titleOther)
    .input('First_Name_E', sql.NVarChar(200), firstNameE)
    .input('Last_Name_E', sql.NVarChar(200), lastNameE)
    .query(queryStr, (err, result) => {
        if(err){
          rsp_code = "902"; // Was error
          logMsg += ` ;Result=${prop.getRespMsg(rsp_code)}` ;
          logger.error(logMsg);
          logger.error(err);
          mitLog.saveMITlog(Cust_Code,fncName,logMsg,req.ip,req.originalUrl,function(){});

          res.status(422).json({
            module: fncName,
            code: rsp_code,
            msg: prop.getRespMsg(rsp_code),
          });

        }else {
          rsp_code = "000";
          logMsg += ` ;Result=${prop.getRespMsg(rsp_code)}` ;
          mitLog.saveMITlog(Cust_Code,fncName,logMsg,req.ip,req.originalUrl,function(){});

          res.status(200).json({
            module: fncName,
            code: rsp_code,
            msg: prop.getRespMsg(rsp_code)
          });
        }
    })
  })

  pool1.on('error', err => {
    // ... error handler
    // console.log("EROR>>"+err);
    logger.error(err);
  })
}



exports.getCDDAddr = (req, res, next) => {

  var fncName = 'getCustomer';
  var _Cust_Code = req.params.cusCode;
  var _Addr_Seq = req.query.Addr_Seq

  logger.info( `API /getCDDAddr - ${req.originalUrl} - ${req.ip} - ${_Cust_Code} - ${_Addr_Seq}`);

  var queryStr = `
  BEGIN

    DECLARE @Addr_No [nvarchar](100);
    DECLARE @Moo [nvarchar](50);
    DECLARE @Place [nvarchar](100);
    DECLARE @Floor [nvarchar](50) ;
    DECLARE @Soi [nvarchar](50);
    DECLARE @Road [nvarchar](100);
    DECLARE @Tambon_Id [int];
    DECLARE @Amphur_Id [int];
    DECLARE @Province_Id [int];
    DECLARE @Country_Id [int];
    DECLARE @Zip_Code [varchar](10);
    DECLARE @Print_Address [nvarchar](400);
    DECLARE @Tel [varchar](50);
    DECLARE @Fax [varchar](50);
    DECLARE @SameAs [int];

    -- MFTS
    select @Addr_No=Addr_No
    ,@Place=Place
    ,@Road=Road
    ,@Tambon_Id=[Tambon_Id]
      ,@Amphur_Id=[Amphur_Id]
      ,@Province_Id=[Province_Id]
      ,@Country_Id=[Country_Id]
      ,@Zip_Code=[Zip_Code]
      ,@Print_Address=Print_Address
      ,@Tel=Tel
      ,@Fax=Fax
    from Account_Address
    where Cust_Code = @Cust_Code
    And Addr_Seq = @Addr_Seq

    -- MIT
    SELECT @Addr_No =Addr_No
    ,@Moo =Moo
    ,@Place =Place
    ,@Floor =Floor
    ,@Soi =Soi
    ,@Road =Road
    ,@Tambon_Id=Tambon_Id
    ,@Amphur_Id=Amphur_Id
    ,@Province_Id=Province_Id
    ,@Country_Id=Country_Id
    ,@Zip_Code=Zip_Code
    ,@Print_Address=Print_Address
    ,@Tel=Tel
    ,@Fax=Fax
    ,@SameAs=SameAs
    FROM MIT_CUSTOMER_ADDR
    Where Cust_Code = @Cust_Code
    AND Addr_Seq = @Addr_Seq

    select @Addr_No AS Addr_No
    ,@Moo AS Moo
    ,@Place AS Place
    ,@Floor AS Floor
    ,@Soi AS Soi
    ,@Road AS Road
    ,@Tambon_Id AS Tambon_Id
    ,@Amphur_Id AS Amphur_Id
    ,@Province_Id AS Province_Id
    ,@Country_Id AS Country_Id
    ,@Zip_Code AS Zip_Code
    ,@Print_Address AS Print_Address
    ,@Tel AS Tel
    ,@Fax AS Fax
    ,@SameAs AS SameAs

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

  var fncName = 'saveCDDAddr';
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

  var SameAs = req.body.SameAs
  var ReqModifyFlag = req.body.ReqModifyFlag

  var logMsg = `POST API /saveCDDAddr - ${req.originalUrl} - ${req.ip} - ${Cust_Code} - ${Addr_Seq}`;
  logger.info( logMsg);

  var queryStr = `
BEGIN

  DECLARE @FULL_TXT VARCHAR(500);

  UPDATE MIT_CUSTOMER_ADDR SET
  [Addr_No] =@Addr_No ,[Moo] =@Moo ,[Place]=@Place ,[Floor]=@Floor,[Soi]=@Soi ,[Road]=@Road ,[Tambon_Id]=@Tambon_Id ,[Amphur_Id]=@Amphur_Id ,[Province_Id]=@Province_Id ,
  [Country_Id]=@Country_Id ,[Zip_Code]=@Zip_Code ,[Tel]=@Tel ,[Fax] =@Fax ,[UpdateBy]=@ActionBy ,[UpdateDate]=GETDATE()
  ,SameAs=@SameAs,ReqModifyFlag=@ReqModifyFlag
  WHERE
  Cust_Code = @Cust_Code
  AND Addr_Seq =@Addr_Seq

    if @@rowcount = 0
      BEGIN

      INSERT INTO MIT_CUSTOMER_ADDR
      ([Cust_Code] ,[Addr_Seq] ,[Addr_No] ,[Moo] ,[Place] ,[Floor],[Soi] ,[Road] ,[Tambon_Id] ,[Amphur_Id] ,[Province_Id] ,[Country_Id] ,[Zip_Code] ,[Tel] ,[Fax] ,[CreateBy] ,[CreateDate]
        ,SameAs,ReqModifyFlag)
      VALUES
      (@Cust_Code,@Addr_Seq,@Addr_No ,@Moo,@Place ,@Floor ,@Soi ,@Road ,@Tambon_Id ,@Amphur_Id ,@Province_Id ,@Country_Id,@Zip_Code ,@Tel ,@Fax ,@ActionBy ,GETDATE()
      ,@SameAs,@ReqModifyFlag)

    END


    SELECT @FULL_TXT=
    ISNULL(Addr_No,'')
    +' '  + ISNULL(Moo,'')
    +' '  + ISNULL(Place,'')
    +' '  + ISNULL(Floor,'')
    +' '  + ISNULL(Soi,'')
    +' '  + ISNULL(Road,'')
    +' '+ ISNULL(e.Name_Thai,'')
    +' '+ISNULL(d.Name_Thai,'')
    +' '+ISNULL(c.Name_Thai,'')
    +' '+ISNULL(Zip_Code,'')
    from MIT_CUSTOMER_ADDR a
    LEFT JOIN REF_Countrys b ON b.Country_Id = a.Country_ID
    LEFT JOIN REF_Provinces c ON c.Province_Id = a.Province_ID and c.Country_ID = a.Country_ID
    LEFT JOIN REF_Amphurs d ON d.Province_Id = a.Province_ID and d.Amphur_ID=a.Amphur_Id
    LEFT JOIN REF_Tambons e ON e.Amphur_ID=a.Amphur_Id and e.Tambon_ID=a.Tambon_Id
    where a.Cust_Code = @Cust_Code
    and a.Addr_Seq = @Addr_Seq
    and b.Nation=0

    UPDATE MIT_CUSTOMER_ADDR SET  Print_Address = @FULL_TXT WHERE Cust_Code = @Cust_Code AND Addr_Seq = @Addr_Seq
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
    .input('SameAs', sql.VarChar(2), SameAs)
    .input('ReqModifyFlag', sql.VarChar(2), ReqModifyFlag)
    .input('ActionBy', sql.VarChar(10), actionBy)
    .query(queryStr, (err, result) => {
        if(err){
          logger.error( '' + err );
          rsp_code = "902"; // Was error

          logMsg += ` ;Result=${prop.getRespMsg(rsp_code)}` ;
          logger.error(logMsg);
          logger.error(err);
          mitLog.saveMITlog(Cust_Code,fncName,logMsg,req.ip,req.originalUrl,function(){});

          res.status(422).json({
            module: fncName,
            seq: Addr_Seq,
            code: rsp_code,
            msg: prop.getRespMsg(rsp_code),
          });

        }else {
          rsp_code = "000";
          logMsg += ` ;Result=${prop.getRespMsg(rsp_code)}` ;
          logger.info(logMsg);
          mitLog.saveMITlog(Cust_Code,fncName,logMsg,req.ip,req.originalUrl,function(){});

          res.status(200).json({
            module: fncName,
            seq: Addr_Seq,
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
