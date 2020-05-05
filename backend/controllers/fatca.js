const mpamConfig = require('../config/mpam-config');
var config = mpamConfig.dbParameters;

var fs = require('fs');

var builder = require('xmlbuilder');
var file = "booksxml.xml";
var dirPath = __dirname + "/../downloadFiles/xmlfiles/"+file;

var logger = require("../config/winston");
var prop = require("../config/backend-property");
var mitLog = require('./mitLog');

exports.getCustAM = (req, res, next) => {

  console.log('Welcome getCustAM()');

  var fncName = 'getFunds()';

  var queryStr = `SELECT * FROM [MFTS_Fund]
  WHERE CURRENT_TIMESTAMP < ISNULL(End_Date,CURRENT_TIMESTAMP+1)
  ORDER  BY Amc_Id ,Thai_Name`;

  const sql = require('mssql')
  const pool1 = new sql.ConnectionPool(config, err => {
    pool1.request() // or: new sql.Request(pool1)
    .query(queryStr, (err, result) => {

        var xml = builder.create('bookstore');

        if(err){
          console.log( fncName +' Quey db. Was err !!!' + err);
          res.status(201).json({
            message: err,
          });
        }else {

          for(var i=0; i< result.rowsAffected; i++){

            xml.ele('book')
            .ele('Fund_Code', result.recordset[i]['Fund_Code']).up()
            .ele('Thai_Name', result.recordset[i]['Thai_Name']).up()
            .ele('Eng_Name', result.recordset[i]['Eng_Name']).end();

        }

        var xmldoc = xml.toString({ pretty: true });
        fs.writeFile(dirPath, xmldoc, function(err) {
            if(err) { return console.log(err); }
            console.log("The file was saved!");
            res.download(dirPath, file);
            // res.render('index', { title: 'Generate XML using NodeJS' });

          });

          // res.status(200).json({
          //   message: fncName + "Quey db. successfully!",
          //   result: result.recordset
          // });
        }
    })

  })

  pool1.on('recordset', columns => {
    // Emitted once for each recordset in a query
    console.log("recordset>>"+JSON.stringify(columns));
  })

  pool1.on('error', err => {
    console.log("EROR>>"+err);
  })
}


exports.saveFATCA = (req, res, next) => {

  var fncName = 'saveFATCA';
  let rsp_code;
  var userId = req.body.userId;
  var pid = req.body.pid;
  var ans = req.body.ans ;
  var otp_id = req.body.opt_id ;

  var logMsg = `POST API /saveFATCA - ${req.originalUrl} - ${req.ip} - ${pid}`;
  logger.info( logMsg);

  var queryStr = `
  BEGIN

  DECLARE @TranName VARCHAR(20);

  --SELECT @TranName = 'MyTransaction';
  --BEGIN TRANSACTION @TranName;

  update MIT_CUSTOMER_FATCA set FATCA_FLAG='A',FATCA_DATA=@FATCA_DATA,FATCA_BY=@FATCA_BY,FATCA_DATE=GETDATE(),OTP_ID = @otp_id
  where CustCode = @CustCode

  if @@rowcount = 0
  begin
     insert into MIT_CUSTOMER_FATCA(CustCode,FATCA_FLAG,FATCA_DATA,FATCA_BY,FATCA_DATE,OTP_ID)
     values (@CustCode,'A',@FATCA_DATA,@FATCA_BY,GETDATE(),@otp_id) ;
  end

  --COMMIT TRANSACTION @TranName;

  END;
    `;

  const sql = require('mssql')
  const pool1 = new sql.ConnectionPool(config, err => {
    pool1.request() // or: new sql.Request(pool1)
    .input("CustCode", sql.VarChar(50), pid)
    .input("FATCA_DATA", sql.NText, JSON.stringify(ans))
    .input("FATCA_BY",sql.VarChar(100), userId)
    .input('otp_id', sql.VarChar(50), otp_id)

    .query(queryStr, (err, result) => {
        // ... error checks
        if(err){
         rsp_code = "902"; // Was error

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


exports.getFATCA = (req, res, next) => {

  var _custCode = req.params.cusCode;

  logger.info(`API /fatca - ${req.originalUrl} - ${req.ip} - ${_custCode} `);
  var fncName = 'getFunds()';

  var queryStr = `
  BEGIN

  select *
  from MIT_CUSTOMER_FATCA
  where CustCode =@CustCode

  END
  `;

  const sql = require('mssql')
  const pool1 = new sql.ConnectionPool(config, err => {
    pool1.request() // or: new sql.Request(pool1)
    .input("CustCode", sql.VarChar(50), _custCode)
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

  pool1.on('recordset', columns => {
    // Emitted once for each recordset in a query
    console.log("recordset>>"+JSON.stringify(columns));
  })

  pool1.on('error', err => {
    console.log("EROR>>"+err);
  })
}
