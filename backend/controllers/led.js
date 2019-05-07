
const readline = require('readline');
const fs = require('fs');
const path = require('path');
const dbConfig = require('../config/db-config');
const utility = require('./utility');

var prop = require("../config/backend-property");
var logger = require("../config/winston");
var mitLog = require('./mitLog');
var config = dbConfig.dbParameters;
var config_BULK = dbConfig.dbParameters_BULK;
var config_stream = dbConfig.dbParameters_stream;

const readPath = __dirname + '/readFiles/LED/';
const readFile = 'exp_lom.txt';

const bakPath = __dirname + '/readFiles/LEDBackup/';


exports.uploadFile = (req, res, next) =>{

  logger.info('Welcome uploadFile()');
  const userCode = req.body.userCode;

    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + "-" + today.getMinutes()
    var dateTime = date+'-'+time;
    const bakFile =  dateTime+'-exp_lom.txt';

    if ( !userCode) {
      logger.error( 'Not found userCode: ' + userCode);
      // rsp_code = 301;
      return res.status(401);
    }

    line_no = 0;

    let rFile = readline.createInterface({
      input: fs.createReadStream(readPath+readFile, 'utf8')
    });


    rFile.on('line', function(line) {
        line_no++;
        console.log('line_no >>:' + line_no);
        if(line_no >1){

          //On action what to do?
          // xxx()
          insertMIT_LED(userCode,line).then( (data) =>{
          console.log('insertMIT_LED  result >>:' + data);
          },(err)=>{
            if(err) {
              logger.error( ''+err );
              rsp_code = 902;
              return res.status(422).json({
                code: rsp_code,
                msg: prop.getRespMsg(rsp_code),
              });
            }
          });
        }
    });

    // end
    rFile.on('close', function(line) {
      console.log('Total lines : ' + line_no);

      //Move file to Backup
      fs.rename(readPath+readFile, bakPath+bakFile,  (err) => {
        if (err) {
          res.status(422).json({ message: err });
        };
        res.status(200).json({ message: 'uploadFile successful!' });
      });
    });
}


exports.uploadBulkFile = (req, res, next) =>{

  logger.info('Welcome uploadBulkFile()');
  const userCode = req.body.userCode;

  var today = new Date();
  var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
  var time = today.getHours() + "-" + today.getMinutes()
  var dateTime = date+'-'+time;
  const bakFile =  dateTime+'-exp_lom.txt';
  var LED_Status ='A';

  // Check userCode
  if ( !userCode) {
    logger.error( 'Not found userCode: ' + userCode);
    // rsp_code = 301;
    return res.status(401);
  }


// Check file exist
  fs.stat(readPath+readFile, function(err, stat) {
    if(err == null) {
        console.log('File exists');
    } else if(err.code === 'ENOENT') {
        // file does not exist
        console.log('***file does not exist: ');
        res.status(400).json({ message: 'file does not exist'});
    } else {
        console.log('Some other error: ', err.code);
    }
  });


    //Table config
    const sql = require('mssql');
    const pool1 = new sql.ConnectionPool(config_BULK, err => {

        console.log('connected');
        const table = new sql.Table('MIT_LED_MASTER');
        // table.create = true;
        table.columns.add('twsid', sql.Int, {nullable: false, primary: true});
        table.columns.add('black_case', sql.NVarChar(20));
        table.columns.add('black_yy', sql.NVarChar(4), { nullable: true });
        table.columns.add('red_case', sql.NVarChar(20), { nullable: true });
        table.columns.add('red_yy', sql.VarChar(4), { nullable: true });
        table.columns.add('court_name ', sql.NVarChar(180), { nullable: true });
        table.columns.add('plaintiff1 ', sql.NVarChar(1024), { nullable: true });
        table.columns.add('df_id ', sql.NVarChar(50), { nullable: true });
        table.columns.add('df_name ', sql.NVarChar(1024), { nullable: true });
        table.columns.add('df_surname ', sql.NVarChar(1024), { nullable: true });
        table.columns.add('tmp_prot_dd ', sql.VarChar(2), { nullable: true });
        table.columns.add('tmp_prot_mm ', sql.VarChar(2), { nullable: true });
        table.columns.add('tmp_prot_yy ', sql.VarChar(4), { nullable: true });
        table.columns.add('abs_prot_dd ', sql.VarChar(2), { nullable: true });
        table.columns.add('abs_prot_mm ', sql.VarChar(2), { nullable: true });
        table.columns.add('abs_prot_yy ', sql.VarChar(4), { nullable: true });
        table.columns.add('df_manage_dd ', sql.VarChar(2), { nullable: true });
        table.columns.add('df_manage_mm ', sql.VarChar(2), { nullable: true });
        table.columns.add('df_manage_yy ', sql.VarChar(4), { nullable: true });
        table.columns.add('bkr_prot_dd ', sql.VarChar(2), { nullable: true });
        table.columns.add('bkr_prot_mm ', sql.VarChar(2), { nullable: true });
        table.columns.add('bkr_prot_yy ', sql.VarChar(4), { nullable: true });
        table.columns.add('statusdf ', sql.VarChar(1), { nullable: true });
        table.columns.add('CreateBy ', sql.VarChar(20), { nullable: true });
        table.columns.add('CreateDate ', sql.Date, { nullable: true });
        table.columns.add('UpdateBy ', sql.VarChar(20), { nullable: true });
        table.columns.add('UpdateDate ', sql.Date, { nullable: true });
        table.columns.add('LED_Status ', sql.Char(2), { nullable: true });

        //  File
      line_no = 0;

      let rFile = readline.createInterface({
        input: fs.createReadStream(readPath+readFile, 'utf8')
      });

      rFile.on('line', function(line) {
          line_no++;
          console.log('line_no >>:' + line_no);
            if(line_no >0){
              var array = line.split("|");
              // console.log( 'DATA(1)>>' + array[22] );

              //On action what to do?
              // isEmpty()
              table.rows.add(array[0].trim(), array[1].trim(), array[2].trim(), array[3].trim(), array[4].trim(), array[5].trim(), array[6].trim(), array[7].trim(), array[8].trim(), array[9].trim(), array[10].trim()
                , array[11].trim(), array[12].trim(), array[13].trim(), array[14].trim(), array[15].trim(), array[16].trim(), array[17].trim(), array[18].trim(), array[19].trim(), array[20].trim(), array[21].trim(), array[22].trim()
                , userCode,new Date,'',null,LED_Status);

            }
        });

            // end
        rFile.on('close', function(line) {
          console.log('Total lines : ' + line_no);

          // Execute insert Bulk data to  MIT_LED table
          const request = new sql.Request(pool1)
          request.bulk(table, (err, result) => {
              // ... error checks
            if(err){
              console.log(err);
              // Response to client
              res.status(400).json({ message: 'BULK was error' });
            }

            if(result){
              console.log(result);

              //Move file to Backup
              fs.rename(readPath+readFile, bakPath+bakFile,  (err) => {
                if (err) {
                  // Response to client
                  res.status(422).json({ message: err });
                };
              });

              // Response to client
              res.status(200).json({ message: 'Total lines : ' + line_no });
            }

          })



        });
        // file

  });

  pool1.on("error", err => {
    console.log("EROR>>" + err);
    reject(err);
  });

}


// **** Functions

function insertMIT_LED(userCode,line) {

  var fncName = "insertMIT_LED()";
  var LED_Status ='A';
 var array = line.split("|");

  var queryStr = ` BEGIN

  INSERT INTO MFTS.dbo.MIT_LED (
  twsid, black_case, black_yy, red_case, red_yy, court_name, plaintiff1, df_id, df_name, df_surname,
  tmp_prot_dd, tmp_prot_mm, tmp_prot_yy, abs_prot_dd, abs_prot_mm, abs_prot_yy, df_manage_dd, df_manage_mm, df_manage_yy, bkr_prot_dd,
  bkr_prot_mm, bkr_prot_yy, statusdf,
  CreateBy, CreateDate, LED_Status)
  VALUES(
  @twsid, @black_case, @black_yy, @red_case, @red_yy, @court_name, @plaintiff1, @df_id, @df_name, @df_surname,
  @tmp_prot_dd, @tmp_prot_mm, @tmp_prot_yy, @abs_prot_dd, @abs_prot_mm, @abs_prot_yy, @df_manage_dd, @df_manage_mm, @df_manage_yy, @bkr_prot_dd,
  @bkr_prot_mm, @bkr_prot_yy, @statusdf,
  @CreateBy, GETDATE(), @LED_Status)

  END
    `;

  const sql = require("mssql");
  return new Promise(function(resolve, reject) {
    const pool1 = new sql.ConnectionPool(config, err => {
      pool1
        .request()
        .input("twsid", sql.VarChar(16), array[0])
        .input("black_case", sql.NVarChar(20), array[1])
        .input("black_yy", sql.VarChar(4), array[2])
        .input("red_case", sql.NVarChar(20), array[3])
        .input("red_yy", sql.VarChar(4), array[4])
        .input("court_name", sql.NVarChar(180), array[5])
        .input("plaintiff1", sql.NVarChar(1024), array[6])
        .input("df_id", sql.NVarChar(50), array[7])
        .input("df_name", sql.NVarChar(1024), array[8])
        .input("df_surname", sql.NVarChar(1024), array[9])

        .input("tmp_prot_dd", sql.VarChar(2), array[10])
        .input("tmp_prot_mm", sql.VarChar(2), array[11])
        .input("tmp_prot_yy", sql.VarChar(4), array[12])
        .input("abs_prot_dd", sql.VarChar(2), array[13])
        .input("abs_prot_mm", sql.VarChar(2), array[14])
        .input("abs_prot_yy", sql.VarChar(4), array[15])
        .input("df_manage_dd", sql.VarChar(2), array[16])
        .input("df_manage_mm", sql.VarChar(2), array[17])
        .input("df_manage_yy", sql.VarChar(4), array[18])
        .input("bkr_prot_dd", sql.VarChar(2), array[19])

        .input("bkr_prot_mm", sql.VarChar(2), array[20])
        .input("bkr_prot_yy", sql.VarChar(4), array[21])
        .input("statusdf", sql.VarChar(2), array[22])

        .input("CreateBy", sql.VarChar(100), userCode)
        .input("LED_Status", sql.VarChar(2), LED_Status)
        .query(queryStr, (err, result) => {
          if (err)
            reject(err);
          else
            resolve(array[7]);

        });
    });
    pool1.on("error", err => {
      console.log("EROR>>" + err);
      reject(err);
    });
  });
}
