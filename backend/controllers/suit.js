const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dbConfig = require("../config/db-config");
var prop = require("../config/backend-property");
var logger = require("../config/winston");
var mitLog = require('./mitLog');

var config = dbConfig.dbParameters;

// const SALT_WORK_FACTOR = 10;
const JWT_SECRET_STRING = dbConfig.JWT_SECRET_STRING;

exports.verifyExtLink_TEST = (req, res, next) => {
  logger.info(`API /verifyExtLink - ${req.originalUrl} - ${req.ip} `);
  let rsp_code;

  try {
    const token = req.headers.authorization.split(" ")[1];
    const pid = req.body.pid;

    // 1. Verify token till life
    jwt.verify(token, JWT_SECRET_STRING, function(err, decoded) {
      if (err) {
        //  logger.error(`${pid} was error: `+err);
        rsp_code = "205";
        return res.status(401).json({
          code: rsp_code,
          msg: prop.getRespMsg(rsp_code)
        });
      }

      logger.debug(` verify correct PID  ${decoded.USERID} - ${pid} `);
      //2. Verify correct PID
      if (decoded.USERID === pid) {

        rsp_code = "000";
              return res.status(200).json({
                code: rsp_code,
                msg: prop.getRespMsg(rsp_code),
                USERDATA: {Title_Name_T:'Mr.',First_Name_T:'XXX',Last_Name_T:'YYY'}

              });

      } else {

        rsp_code = "204";
        logger.error( `${rsp_code} - ${prop.getRespMsg(rsp_code)}` );
        return res.status(422).json({
          code: rsp_code,
          msg: prop.getRespMsg(rsp_code)
        });
      }
    });
  } catch (error) {
    console.log("verify fail>>" + JSON.stringify(error));
    return res.status(401).json({ message: "Auth failed!" });
  }
};


exports.verifyExtLink = (req, res, next) => {
  logger.info(`API /verifyExtLink - ${req.originalUrl} - ${req.ip} `);
  let rsp_code;
  let logMsg ;
  try {
    const token = req.headers.authorization.split(" ")[1];
    const pid = req.body.pid;

    // 1. Verify token till life
    logger.debug(logMsg);
    jwt.verify(token, JWT_SECRET_STRING, function(err, decoded) {
      if (err) {

        //  logger.error(`${pid} was error: `+err);
        // SAVE MIT_LOG
        mitLog.saveMITlog(pid,'MIT-Survey','1. Verify mail token fail. '+logMsg,req.ip,req.originalUrl,function(){});

        rsp_code = "205";
        return res.status(401).json({
          code: rsp_code,
          msg: prop.getRespMsg(rsp_code)
        });
      }

      // SAVE MIT_LOG
      mitLog.saveMITlog(pid,'MIT-Survey',' 1. Verify mail token successful. '+logMsg,req.ip,req.originalUrl,function(){});

      logMsg =` Correct PID  ${decoded.USERID} - ${pid} `
      logger.debug(logMsg);
      //2. Verify correct PID
      if (decoded.USERID === pid) {

        // SAVE MIT_LOG
        mitLog.saveMITlog(pid,'MIT-Survey','2. Correct PID successful. '+logMsg,req.ip,req.originalUrl,function(){});

        rsp_code = "000";
        // logger.info(`*** PID  - ${prop.getRespMsg(rsp_code)} `);

        // Get customer info
        // logMsg =` PID - ${pid} `
        getCustomerData(pid).then(
          function(data) {

            if (!data){
              rsp_code = "206"; //"ไม่พบข้อมูล",

              logMsg += ' ;code:'+rsp_code + ' ;msg:' + prop.getRespMsg(rsp_code)
              // SAVE MIT_LOG
              mitLog.saveMITlog(pid,'MIT-Survey','3. getCustomerData() Not found data. '+logMsg,req.ip,req.originalUrl,function(){});

              return res.status(422).json({
                code: rsp_code,
                msg: prop.getRespMsg(rsp_code),
              });

            }else{

              rsp_code = "000";

              // SAVE MIT_LOG
              mitLog.saveMITlog(pid,'MIT-Survey','3. getCustomerData() Successful. '+logMsg,req.ip,req.originalUrl,function(){});

              return res.status(200).json({
                code: rsp_code,
                msg: prop.getRespMsg(rsp_code),
                USERDATA: data

              });
            }

          },
          function(err) {
            console.log(' Error>>>' + err)
            logger.error( ''+err );
            rsp_code = 902;
            return res.status(422).json({
              code: rsp_code,
              msg: prop.getRespMsg(rsp_code),
            });

          }
        );
      } else {
        // SAVE MIT_LOG
        mitLog.saveMITlog(pid,'MIT-Survey','2. Correct PID fail. '+logMsg,req.ip,req.originalUrl,function(){});

        rsp_code = "204";
        logger.error( `${rsp_code} - ${prop.getRespMsg(rsp_code)}` );
        return res.status(422).json({
          code: rsp_code,
          msg: prop.getRespMsg(rsp_code)
        });
      }
    });
  } catch (error) {
    console.log("verify fail>>" + JSON.stringify(error));
    return res.status(401).json({ message: "Auth failed!" });
  }
};

exports.suitEvaluate = (req, res, next) => {
  logger.info(`API /suitEvaluate - ${req.originalUrl} - ${req.ip} `);

  let rsp_code;
  var pid = req.body.pid;
  var suitSerieId = req.body.suitSerieId;
  var score = req.body.score || "0";
  // console.log(` PID:${pid} ;suitSerieId:${suitSerieId} ;SCORE:${score}`);

  calculateRiskLevel(suitSerieId,score).then(
    function(data) {
      // console.log("*** data  promise >>" + JSON.stringify(data));

      if (!data){
        rsp_code = "206"; //"ไม่พบข้อมูล",
        return res.status(422).json({
          code: rsp_code,
          msg: prop.getRespMsg(rsp_code),
        });

      }else{
        rsp_code = "000";
        return res.status(200).json({
          code: rsp_code,
          msg: prop.getRespMsg(rsp_code),
          DATA: data

        });
      }

    },
    function(err) {
      console.log(' Error>>>' + err)
      logger.error( ''+err );
      rsp_code = 902;
      return res.status(422).json({
        code: rsp_code,
        msg: prop.getRespMsg(rsp_code),
      });
    }
  );
}

// exports.suitSave = (req, res, next) => {
//   logger.info(`API /suitSave - ${req.originalUrl} - ${req.ip} `);
//   let rsp_code;
//   var pid = req.body.pid;
//   var score = req.body.score || "0";

//   var riskLevel = req.body.riskLevel;
//   var riskLevelTxt = req.body.riskLevelTxt;
//   var riskLevelDesc = req.body.riskLevelDesc;

//   var ans = req.body.ans || "";

//   try {
//     console.log(` PID:${pid}`);
//     console.log(` SCORE:${score}`);
//     console.log(` riskLevel:${riskLevel}`);
//     console.log(` riskLevelTxt:${riskLevelTxt}`);
//     console.log(` riskLevelDesc:${riskLevelDesc}`);

//     console.log(` ANS->>:${JSON.stringify(ans)}`);

//     rsp_code = "000";
//     return res.status(200).json({
//       code: rsp_code,
//       msg: prop.getRespMsg(rsp_code)
//     });
//   } catch (error) {
//     console.log("Suit Save fail>>" + JSON.stringify(error));
//     return res.status(401).json({ message: "Suit Save failed!" });
//   }
// };


exports.suitSave = (req, res, next) => {

  var fncName = 'suitSave';
  let rsp_code;

  var userId = req.body.userId;
  var pid = req.body.pid;
  var suitSerieId = req.body.suitSerieId;
  var score = req.body.score || "0";
  var riskLevel = req.body.riskLevel;
  var riskLevelTxt = req.body.riskLevelTxt;

  var type_Investor = req.body.type_Investor;
  var ans = req.body.ans ;
  var otp_id = req.body.otp_id;

  var logMsg = `API /suitSave - ${req.originalUrl} - ${req.ip} - pid=${pid}  ;userId=${userId};  `

  logger.info( logMsg);

  var queryStr = `
  BEGIN
  DECLARE @AccSuitId VARCHAR(50);
  DECLARE @TranName VARCHAR(20);

  SELECT @TranName = 'MyTransaction';

  BEGIN TRANSACTION @TranName;

  -- Generate  AccSuitId
  select  @AccSuitId = @CustCode+'-'+CONVERT(varchar(5), YEAR(getdate()))   +'-'+ CONVERT(varchar(5),(count(*)+1))
  from MIT_CUSTOMER_SUIT
  where CustCode= @CustCode
  and YEAR(CreateDate) =YEAR(getdate())

  UPDATE MIT_CUSTOMER_SUIT SET Status ='I' WHERE CustCode=@CustCode;

  -- 1. Insert MIT_CUSTOMER_SUIT
      INSERT INTO MIT_CUSTOMER_SUIT
    ([AccSuitId],CustCode,SuitSerieId,Status,TotalScore,RiskLevel,RiskLevelTxt,Type_Investor,ANS_JSON,CreateBy,CreateDate,OTP_ID)
      VALUES
      (@AccSuitId,@CustCode,@SuitSerieId,'A',@TotalScore,@RiskLevel,@RiskLevelTxt,@Type_Investor,@ANS_JSON,@CreateBy,GETDATE(),@OTP_ID)

  COMMIT TRANSACTION @TranName;

  END;
    `;

  const sql = require('mssql')
  const pool1 = new sql.ConnectionPool(config, err => {
    pool1.request() // or: new sql.Request(pool1)
    .input("CustCode", sql.VarChar(50), pid)
    .input("SuitSerieId", sql.VarChar(10), suitSerieId)
    .input("TotalScore", sql.Int, score)
    .input("RiskLevel", sql.Int, riskLevel)
    .input("RiskLevelTxt", sql.NVarChar(100), riskLevelTxt)
    .input("Type_Investor", sql.NVarChar(1000), type_Investor)
    .input("ANS_JSON", sql.NText, JSON.stringify(ans))
    .input("CreateBy",sql.VarChar(100), userId)
    .input("OTP_ID",sql.VarChar(50), otp_id)

    .query(queryStr, (err, result) => {
        // ... error checks
        if(err){
          rsp_code = "902"; //"ไม่พบข้อมูล",

          logMsg += ` ;Result=${prop.getRespMsg(rsp_code)}` ;
          logger.error(logMsg);
          logger.error(err);
          mitLog.saveMITlog(pid,fncName,logMsg,req.ip,req.originalUrl,function(){});

          res.status(422).json({
            module: fncName,
            code: rsp_code,
            msg: prop.getRespMsg(rsp_code),
          });
        }else {

          // UPDATE MFTS_SUIT table
          updateMFTS_Suit(userId,pid,score,riskLevel,riskLevelTxt).then((result)=>{
            logger.info('SAVE MFTS_Suit successful cust_code:' + pid);
          },err=>{
            logger.error('SAVE MFTS_Suit cust_code:' + pid + ' error :' + err);
          });

          rsp_code = "000";
          logMsg += ` ;Result=${prop.getRespMsg(rsp_code)}` ;
          logger.info(logMsg);
          mitLog.saveMITlog(pid,fncName,logMsg,req.ip,req.originalUrl,function(){});

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
    logger.error( '' + err );
  })
}



function updateMFTS_Suit(actionBy,pid,score,riskLevel,riskLevelTxt){

  console.log(" Welcome updateMFTS_Suit() !!!" );

  var fncName = "updateMFTS_Suit";
  var queryStr = ` BEGIN

      DECLARE @Series_Id int =99;

      UPDATE  MFTS_Suit
      SET Active_Flag='I'
      WHERE Account_No =@Account_No

      UPDATE  MFTS_Suit
      SET Score = @Score,Risk_Level=@Risk_Level,Risk_Level_Desc=@Risk_Level_Desc,Modify_By=@Modify_By,Modify_Date=getdate(),Active_Flag='A'
      WHERE Account_No =@Account_No AND Series_Id=@Series_Id

      IF @@ROWCOUNT = 0
      BEGIN
        INSERT INTO MFTS_Suit (Series_Id,Account_No,Score,Risk_Level,Risk_Level_Desc,Create_By,Create_Date,Active_Flag)
        VALUES(@Series_Id,@Account_No,@Score,@Risk_Level,@Risk_Level_Desc,@Create_By,getdate(),'A')
      END

  END
    `;

  const sql = require("mssql");

  return new Promise(function(resolve, reject) {

    const pool1 = new sql.ConnectionPool(config, err => {
      pool1.request() // or: new sql.Request(pool1)
        .input("Account_No", sql.VarChar(50), pid)
        .input("Score", sql.Int, score)
        .input("Risk_Level", sql.Int, riskLevel)
        .input("Risk_Level_Desc", sql.NVarChar(1000), riskLevelTxt)
        .input("Create_By", sql.VarChar(50), actionBy)
        .input("Modify_By", sql.VarChar(50), actionBy)
        .query(queryStr, (err, result) => {
          if (err) {
            console.log(fncName + " Quey db. Was err !!!" + err);
            reject(err);

          } else {
            resolve(result);
          }
        });
    });
    pool1.on("error", err => {
      console.log("EROR>>" + err);
      reject(err);
    });
  });
}



function calculateRiskLevel(_suitSerieId,_score){

  console.log("calculateRiskLevel _score>>" + _score);
  var fncName = "calculateRiskLevel";
  var queryStr = ` BEGIN

  SELECT RiskLevel,RiskLevelTxt,Type_Investor
  FROM [MIT_SUIT_RISK_LEVEL]
  where @Score between min_value and max_value
  and status ='A'
  and SuitSerieId = @SuitSerieId

  END
    `;

  const sql = require("mssql");

  return new Promise(function(resolve, reject) {

    const pool1 = new sql.ConnectionPool(config, err => {
      pool1.request() // or: new sql.Request(pool1)
        .input("SuitSerieId", sql.VarChar(50), _suitSerieId)
        .input("Score", sql.Int, _score)
        .query(queryStr, (err, result) => {
          if (err) {
            console.log(fncName + " Quey db. Was err !!!" + err);
            reject(err);

          } else {
            resolve(result.recordset[0]);
          }
        });
    });
    pool1.on("error", err => {
      console.log("EROR>>" + err);
      reject(err);
    });
  });
}


function getCustomerData(_pid) {

  console.log("getCustomerData _pid>>" + _pid);
  var fncName = "getCustomerData";
  var queryStr = `
  BEGIN

  DECLARE @Title_Name_T VARCHAR(250);
  DECLARE @First_Name_T VARCHAR(250);
  DECLARE @Last_Name_T VARCHAR(250);
  DECLARE @First_Name_E VARCHAR(250);
  DECLARE @Last_Name_E  VARCHAR(250);
  DECLARE @DOB VARCHAR(20);
  DECLARE @Mobile VARCHAR(50);
  DECLARE @Email VARCHAR(250);

  DECLARE @Risk_Date date;
  DECLARE @Score int;
  DECLARE @Risk_Level int;
  DECLARE @Risk_Level_Txt VARCHAR(250);
  DECLARE @TypeInvestor VARCHAR(250);

  SELECT @Risk_Date=[Document_Date]
        ,@Score=[Score]
    FROM [MFTS_Suit]
    where Account_No = @pid
    and Active_Flag='A'


    select @Risk_Date=CreateDate
    ,@Score = TotalScore
    ,@Risk_Level = RiskLevel
    ,@Risk_Level_Txt = RiskLevelTxt
    ,@TypeInvestor = Type_Investor
    from   MIT_CUSTOMER_SUIT
    where CustCode= @pid
    and [Status]='A'


  IF @Score >0 AND @Risk_Level_Txt = ''
  BEGIN
  SELECT @Risk_Level = RiskLevel,@Risk_Level_Txt= RiskLevelTxt
    FROM [MIT_SUIT_RISK_LEVEL]
    where @Score between min_value and max_value
    and status ='A'
  END;


  select
    @Title_Name_T = a.title
    ,@First_Name_T = a.First_Name_T
    ,@Last_Name_T = a.Last_Name_T
    ,@First_Name_E = a.First_Name_E
    ,@Last_Name_E = a.Last_Name_E
    ,@DOB = convert(varchar, a.Birth_Day, 105)
    ,@Mobile = a.Mobile
    ,@Email = a.Email
    from MIT_CUSTOMER_INFO a
    where Cust_Code= @pid


  IF @@rowcount = 0
  BEGIN
    select
    @Title_Name_T = a.Title_Name_T
    ,@First_Name_T = a.First_Name_T
    ,@Last_Name_T = a.Last_Name_T
    ,@First_Name_E = a.First_Name_E
    ,@Last_Name_E = a.Last_Name_E
    ,@DOB =  convert(varchar, a.Birth_Day, 105)
    ,@Mobile = a.Mobile
    ,@Email = a.Email
    from Account_Info a
    where Cust_Code= @pid

  END

  SELECT
    @Title_Name_T AS Title_Name_T
    ,@First_Name_T AS First_Name_T
    ,@Last_Name_T AS Last_Name_T
    ,@First_Name_E AS First_Name_E
    ,@Last_Name_E AS Last_Name_E
    ,@DOB AS DOB
    ,@Mobile AS Mobile
    ,@Email AS Email
    ,@Risk_Date AS Risk_Date
    ,@Score AS Score
    ,@Risk_Level AS Risk_Level
    ,@Risk_Level_Txt AS Risk_Level_Txt
    ,@TypeInvestor AS TypeInvestor

  END
    `;

  const sql = require("mssql");

  return new Promise(function(resolve, reject) {

    const pool1 = new sql.ConnectionPool(config, err => {
      pool1
        .request() // or: new sql.Request(pool1)
        .input("pid", sql.VarChar(50), _pid)
        .query(queryStr, (err, result) => {
          if (err) {
            console.log(fncName + " Quey db. Was err !!!" + err);
            reject(err);

          } else {
            resolve(result.recordset[0]);

          }
        });
    });
    pool1.on("error", err => {
      console.log("EROR>>" + err);
      reject(err);
    });
  });
}


function saveSuitScore(_AccSuitId,_QuesNo,_ChoiceNo,_Score){

  console.log("saveSuitScore _accSuitId>>" + _AccSuitId + "-"+ _QuesNo + "-"+_ChoiceNo + "-"+_Score);

  var fncName = "calculateRiskLevel";
  var queryStr = `
  BEGIN
  DECLARE @TranName VARCHAR(20);
  SELECT @TranName = 'MyTransaction';

  BEGIN TRANSACTION @TranName;

  -- 2. Insert MIT_SUIT_ACCOUNT_SCORE
  INSERT INTO MIT_SUIT_ACCOUNT_SCORE
  (AccSuitId,QuesNo,ChoiceNo,Score)
  VALUES(@AccSuitId,@QuesNo,@ChoiceNo,@Score)

  COMMIT TRANSACTION @TranName;

  END
    `;
  const sql = require("mssql");

  return new Promise(function(resolve, reject) {

    const pool1 = new sql.ConnectionPool(config, err => {
      pool1
        .request() // or: new sql.Request(pool1)
        .input("AccSuitId", sql.VarChar(50), _AccSuitId)
        .input("QuesNo", sql.Int, _QuesNo)
        .input("ChoiceNo", sql.Int, _ChoiceNo)
        .input("Score", sql.Int, _Score)
        .query(queryStr, (err, result) => {
          if (err) {
            reject(err);

          } else {
            resolve({code:0});
          }
        });
    });
    pool1.on("error", err => {
      reject(err);
    });
  });
}
