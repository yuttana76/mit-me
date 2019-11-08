const readline = require('readline');
const fs = require('fs');
const path = require('path');
const dbConfig = require('../config/db-config');
const utility = require('./utility');

var prop = require("../config/backend-property");
var logger = require("../config/winston");
var mitLog = require('./mitLog');
var soap = require('soap');
var cron = require('node-cron');

var CronJob = require('cron').CronJob;

var led = require('./led');
var mail = require('./mail');


var config = dbConfig.dbParameters;
var config_BULK = dbConfig.dbParameters_BULK;
var config_stream = dbConfig.dbParameters_stream;

const mysql_dbConfig = require("../config/mysql-config");
var swan_config = mysql_dbConfig.swan_dbParameters;
var mysql = require('mysql');

const LED_FILE_BAK_PATH = __dirname + '/readFiles/LEDBackup/';
const LED_FILE_PATH = __dirname + '/readFiles/LED/';

// const directoryPath = path.join(__dirname, '/readFiles/LED/');
const LED_FILE_NAME= "led_list.txt";
const LED_LIST_FILE_NAME = 'led_list.txt';

const HTTP_SOAP = 'https://192.168.10.48:444/CrytoService.svc';

// const HTTP_SOAP = 'http://192.168.10.48:8080/CrytoService.svc';

/*
Production Endpoint
https://debtor.led.go.th/api/public/GetBankruptList
*/
// const HOST_LED= "uatdebtor.led.go.th";
const HOST_LED= "debtor.led.go.th";

var userPath = path.resolve('./backend/merchantasset_CA/led/led_user.json');
var userData = fs.readFileSync(userPath, "utf8"); //ascii,utf8

// const API_KEY ="328010cc65ecf3a5f0bcdbb51e339d36";//UAT
const API_KEY =JSON.parse(userData).apikey;


const PATH_GetBankruptList ="/api/public/GetBankruptList";
const PATH_ReceiverBreezeWebService ="/api/public/ReceiverBreezeWebService";
const PATH_GetBankruptListByDate ="/api/public/GetBankruptListByDate";


exports.checkAPI = (req, res, next) =>{

  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;

  // console.log(`ip>> - ${ip}`);
  // console.log(`fullUrl>> - ${fullUrl}`);

}

exports.checkPostAPI = (req, res, next) =>{

  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;

  console.log("checkPostAPI");
  console.log(`ip>> - ${ip}`);
  console.log(`fullUrl>> - ${fullUrl}`);

  //Body
  console.log(`headers>> - ${JSON.stringify(req.headers)}`);
  console.log(`input>> - ${req.body.input}`);

  res.status(200).json({ message: 'API successful' });

}


exports.ledEncrypt = (req, res, next) =>{

  fncSOAPEncrypt().then(result =>{

    res.status(200).json({
      message: "Successfully!",
      result: result
    });

  },err=>{
    res.status(400).json({
      message: 'Error on call API'
    });

  })
}


exports.ledDecrypt = (req, res, next) =>{

  var input = req.body.input;

  fncDecrypt(input).then(result =>{

    res.status(200).json({
      message: "Successfully!",
      result: result
    });

  },err=>{
    res.status(400).json({
      message: 'Error on call API'
    });

  })
}

exports.callGetBankruptList = (req, res, next) =>{
  // console.log("Welcome to API /callGetBankruptList/");
  fnGetBankruptList().then(result =>{
    res.status(200).json({
      message: "Successfully!",
      code:"000",
      result: result
    });
  },err =>{
    res.status(400).json({
      message: err,
      code:"999",
    });
  });

}

exports.GetBankruptListByDate = (req, res, next) =>{
  const req_key="";
  const req_status = ""
  const startdate=req.body.startdate;
  const enddate =req.body.enddate;

  fnGetBankruptListByDate(req_key,req_status,startdate,enddate).then(result =>{
    res.status(200).json({
      message: "Successfully!",
      code:"000",
      result: result
    });
  },err =>{
    res.status(400).json({
      message: err,
      code:"999",
    });
  });
};

// ******************** SCHEDULE
// https://www.npmjs.com/package/cron

var LED_JOB;

exports.ledGetBankruptListSchedule = (req, res, next) =>{

  const schStatus =req.body.schStatus;
  const schData =req.body.schData;

  fnLedGetBankruptListSchedule(schStatus,schData).then(result=>{
    res.status(200).json({ message: "Successfully!",code:"000", result: result });
  },err=>{
    res.status(400).json({message: err, code:"999"});
  });
}


exports.cleanCustFromFile = (req, res, next) =>{

  const actionBy = req.body.actionBy

  fnCleanCustFromFile(actionBy).then(result=>{
    res.status(200).json({ message: "Successfully!",code:"000", result: result });
  },err=>{
    res.status(400).json({message: err, code:"999"});
  });
}

exports.cleanInitial = (req, res, next) =>{

  const actionBy = req.body.actionBy

    // getLedInitialFile(actionBy).then(result=>{

  fnCleanInitial(actionBy).then(result=>{
    res.status(200).json({ message: "Successfully!",code:"000", result: result });
  },err=>{
    res.status(400).json({message: err, code:"999"});
  });
}


/**
 * Compare ledFile & SWAN & MFTS
 */
function fnCleanInitial(actionBy){

  return new Promise(function(resolve, reject) {

  /**
   * GET data SWAN & MFTS
   */
   Promise.all([
    led.getSWANCustomers().catch(err => { res.status(401).json({ message: 'Error getSWANCustomers()'+err }); }),
    led.getMFTSCustomers().catch(err => { res.status(401).json({ message: 'Error getMFTSCustomers()'+err }); }),
    getLedInitialFile().catch(err => { res.status(401).json({ message: 'Error getLedFiles()' +err }); }),
    ]).then(values => {

      /**
       * Compare LED list with SWAN & MFTS
       * values[0] = SWAN
       * values[1] = MFTS
       * values[2] = LED list
       */

      //  Convert to  array
      var ledArray = [];
      for(var i in values[2])
      ledArray.push(values[2][i].Cust_Code,values[2][i].twsid);

      // *Test set led id
      // values[1].push({"Cust_Code":"5100900112000","First_Name_T":"x1","Last_Name_T":"YYY"});
      // values[1].push({"Cust_Code":"3810400269314","First_Name_T":"x2","Last_Name_T":"YYY"});

      // *Show array data
      // ledArray.forEach(function(element) {
      //   console.log(element);
      // });

      Promise.all([
        led.compareLED_3array(ledArray,values[0]).catch(err => { res.status(401).json({ message: 'Error Compare LED & SWAN >>'+err }); }),
        led.compareLED_3array(ledArray,values[1]).catch(err => { res.status(401).json({ message: 'Error Compare LED & MFTS >>'+err }); }),
        ]).then(values2 => {

          /**
           * Incase Found  has data in values[] array
           *1.Insert to MIT_LED_INSP_CUST
           *2.Insert all LED list to MIT_LED_DB_MASTER
           *3.Move LED download file to backup folder
           */
          Promise.all([
            led.insertLEDInspect(values2[0],"SWAN",actionBy).catch(err => { res.status(401).json({ message: 'Error SWAN to inspection >>'+err }); }),
            led.insertLEDInspect(values2[1],"MFTS",actionBy).catch(err => { res.status(401).json({ message: 'Error MFTS  to inspection>>'+err }); }),
            insertInitialMIT_LED_DB_MASTER(actionBy).catch(err => { res.status(401).json({ message: 'Error SWAP >>'+err }); })
            ]).then(values => {

              logger.info(`LED found>> SWAN(${values2[0].length})  ;MFTS(${values2[1].length}) `);
              /**
               * Send mail to responsibility
               */
              mail.mailLedResponseToday().then(data=>{
                resolve('Successful /checkCustDialy');
              },err=>{
                reject(err);
              });


            },function(err){
              logger.error(err);
                reject(err);
            })

        },function(err){
          // res.status(401).json({ message: err });
          logger.error(err);
          reject(err);
        })
    });

  });
}


/**
 * Compare ledFile & SWAN & MFTS
 */
function fnCleanCustFromFile(actionBy){

  return new Promise(function(resolve, reject) {

  /**
   * GET data SWAN & MFTS
   */
   Promise.all([
    led.getSWANCustomers().catch(err => { res.status(401).json({ message: 'Error getSWANCustomers()'+err }); }),
    led.getMFTSCustomers().catch(err => { res.status(401).json({ message: 'Error getMFTSCustomers()'+err }); }),
    getLedFiles().catch(err => { res.status(401).json({ message: 'Error getLedFiles()' +err }); }),
    ]).then(values => {

      /**
       * Compare LED list with SWAN & MFTS
       * values[0] = SWAN
       * values[1] = MFTS
       * values[2] = LED list
       */
      Promise.all([
        led.compareLED_2(values[2],values[0]).catch(err => { res.status(401).json({ message: 'Error Compare LED & SWAN >>'+err }); }),
        led.compareLED_2(values[2],values[1]).catch(err => { res.status(401).json({ message: 'Error Compare LED & MFTS >>'+err }); }),
        ]).then(values2 => {

          /**
           * Incase Found  has data in values[] array
           *1.Insert to MIT_LED_INSP_CUST
           *2.Insert all LED list to MIT_LED_DB_MASTER
           *3.Move LED download file to backup folder
           */
          Promise.all([
            led.insertLEDInspect(values2[0],"SWAN",actionBy).catch(err => { res.status(401).json({ message: 'Error SWAN to inspection >>'+err }); }),
            led.insertLEDInspect(values2[1],"MFTS",actionBy).catch(err => { res.status(401).json({ message: 'Error MFTS  to inspection>>'+err }); }),
            insertAllFilesMIT_LED_DB_MASTER(actionBy).catch(err => { res.status(401).json({ message: 'Error SWAP >>'+err }); })
            ]).then(values => {

              logger.info(`LED found>> SWAN(${values2[0].length})  ;MFTS(${values2[1].length}) `);
              /**
               * Send mail to responsibility
               */
              mail.mailLedResponseToday().then(data=>{
                resolve('Successful /checkCustDialy');
              },err=>{
                // res.status(401).json({ message: 'LED send mail error SWAP >>'+err });
                reject(err);
              });

              // /**
              //  * In case not found MPAM DB.
              //  * Auto response to LED ;
              //  */
              //  fnReceiverBreezeWebService(req_key,req_status,actionBy).then(result =>{
              //   logger.info(result);
              //   resolve(Successfully);
              //   // res.status(200).json({  message: "Successfully!", code:"000", result: result });
              // },err =>{
              //   logger.error(err);
              //   reject(err);
              //   // res.status(400).json({message: err, code:"999"});
              // });

            },function(err){
              // res.status(401).json({ message: err });
              logger.error(err);
                reject(err);
            })
        },function(err){
          // res.status(401).json({ message: err });
          logger.error(err);
          reject(err);
        })
    });

  });
}

exports.ReceiverBreezeWebService = (req, res, next) =>{
  const req_key= req.body.req_key;
  const req_status = req.body.req_status;
  const actionBy = req.body.actionBy;

  fnReceiverBreezeWebService(req_key,req_status,actionBy).then(result =>{

    logger.info(result);
    res.status(200).json({  message: "Successfully!",
      code:"000",
      result: result
    });
  },err =>{
    logger.error(err);

    res.status(400).json({
      message: err,
      code:"999",
    });
  });

};


// ****************************** FUNCTION HERE
function fnReceiverBreezeWebService(req_key,req_status,actionBy){

  // logger.info(`Welcome fnReceiverBreezeWebService() req_key:${req_key}; req_status:${req_status}` );

  return new Promise(function(resolve, reject) {

    // #1 Encryt
    fncSOAPEncrypt(req_key,req_status,"","").then(result =>{

      const input= result.EncryptResult;
      // #2 Call APIs
      fnCallLEDapis(PATH_ReceiverBreezeWebService,input).then(result =>{
        var resultObj =  JSON.parse(result);

        if(resultObj.responseCode ==='000'){
            updateResponseMIT_LED_DB_MASTER(req_key,req_status,actionBy).then(result=>{
            },err=>{
              // console.log("updateResponseMIT_LED_DB_MASTER >> " +err);
              logger.error(err);
            });
        }

        resolve(resultObj);

      },err=>{
        reject(err);
      })

    },err=>{
      reject(err);
    });
  });
}

function updateResponseMIT_LED_DB_MASTER(REQ_KEY,REQ_STATUS,RESPONSE_BY){

  console.log(`updateResponseMIT_LED_DB_MASTER() >> ${REQ_KEY} - ${REQ_STATUS} - ${RESPONSE_BY}`);

    return new Promise(function(resolve, reject) {
      // var queryStr = `SELECT * FROM MIT_LED_MASTER`;
      var queryStr = `
      BEGIN
        UPDATE MIT_LED_DB_MASTER
        SET REQ_STATUS=@REQ_STATUS,RESPONSE_BY=@RESPONSE_BY,ReceiverBreezeDate=getdate()
        WHERE REQ_KEY=@REQ_KEY
      END
      `;
      const sql = require('mssql')
      const pool1 = new sql.ConnectionPool(config, err => {
        pool1.request() // or: new sql.Request(pool1)
        .input('REQ_KEY', sql.VarChar, REQ_KEY)
        .input('REQ_STATUS', sql.VarChar, REQ_STATUS)
        .input('RESPONSE_BY', sql.VarChar, RESPONSE_BY)
        .query(queryStr, (err, result) => {
            // ... error checks
            if(err){
              reject(err);
            }else {
              resolve(result.recordset);
            }
        })

      })
      pool1.on('error', err => {
        reject(err);
        console.log("EROR>>"+err);
      })
    });
  }


  function getLedInitialFile(){

    logger.info('Welcome getLedInitialFile(); ' );
    var fileInitial ='init.txt';

    let _fileArray=[];
    return new Promise(function(resolve, reject) {

      let rFile = readline.createInterface({
        input: fs.createReadStream(LED_FILE_PATH+fileInitial, 'utf8')
      });

      // logger.info('STEP 1>> ' + LED_FILE_PATH+fileInitial);
      rFile.on('line', function(line) {
        // const dataObj = JSON.parse(line);

        // console.log( "line>>"+ line);
        lineArray = line.split("|");

        // 1	twsid
        _twsid = lineArray[0];
        // 2	black_case
        // 3	black_yy
        // 4	red_case
        // 5	red_yy
        // 6	court_name
        // 7	plaintiff1
        // 8	df_id
        _df_id = lineArray[7];
        // 9	df_name
        _df_name = lineArray[8];
        // 10	df_surname
        _df_surname = lineArray[9];
        // 11	tmp_prot_dd
        // 12	tmp_prot_mm
        // 13	tmp_prot_yy
        // 14	abs_prot_dd
        // 15	abs_prot_mm
        // 16	abs_prot_yy
        // 17	df_manage_dd
        // 18	df_manage_mm
        // 19	df_manage_yy
        // 20	bkr_prot_dd
        // 21	bkr_prot_mm
        // 22	bkr_prot_yy
        // 23	statusdf

        // for (i in dataObj) {

        //   // console.log( "TWS_KEY>>"+ dataObj[i].TWS_KEY);
        // // console.lin
        _fileArray.push({"twsid": _twsid ,"Cust_Code":_df_id,"First_Name_T":_df_name,"Last_Name_T":_df_surname});

        // let _twsid;
        // if(dataObj[i].TWS_ID ){
        //   _twsid=dataObj[i].TWS_ID
        // }

        // if(dataObj[i].TWS_KEY ){
        //   _twsid=dataObj[i].TWS_KEY
        // }

        // _fileArray.push({"twsid": _twsid ,"Cust_Code":dataObj[i].DF_ID,"First_Name_T":dataObj[i].DF_NAME,"Last_Name_T":dataObj[i].DF_SURNAME});

        // }

        });//Read file(line)
        rFile.on('close', function(line) {
          resolve(_fileArray);
        });//Read file(close)
    });
  }


function getLedFiles(){

  let _fileArray=[];
  return new Promise(function(resolve, reject) {
    // console.log(`*** LED_FILE_PATH>${LED_FILE_PATH} ;NAME>${LED_FILE_NAME}`);
      fs.readdir(LED_FILE_PATH, function (err, files) {
        if (err) {
            reject(err);
        }

        let num_files=0;

        // console.log('file (1)>' + JSON.stringify(files));
        files.forEach(function (file,i) {
            // Do whatever you want to do with the file
            // console.log('file (2)>' + file);
            var j =file.indexOf(LED_FILE_NAME);
            // console.log('file (3)>' + j);
            if(j != -1){
              // i++;
              num_files++;

              // console.log("File>>" +LED_FILE_PATH+file);
              // Read file
              let rFile = readline.createInterface({
                input: fs.createReadStream(LED_FILE_PATH+file, 'utf8')
              });

              rFile.on('line', function(line) {
                const dataObj = JSON.parse(line);


                for (i in dataObj) {
                  // console.log( "TWS_KEY>>"+ dataObj[i].TWS_KEY);
                // console.lin
                // _fileArray.push({"twsid": dataObj.TWS_ID ,"Cust_Code":dataObj.DF_ID,"First_Name_T":dataObj.DF_NAME,"Last_Name_T":dataObj.DF_SURNAME});

                let _twsid;
                if(dataObj[i].TWS_ID ){
                  _twsid=dataObj[i].TWS_ID
                }

                if(dataObj[i].TWS_KEY ){
                  _twsid=dataObj[i].TWS_KEY
                }

                _fileArray.push({"twsid": _twsid ,"Cust_Code":dataObj[i].DF_ID,"First_Name_T":dataObj[i].DF_NAME,"Last_Name_T":dataObj[i].DF_SURNAME});

                }

                });//Read file(line)
                rFile.on('close', function(line) {
                  resolve(_fileArray);
                });//Read file(close)

            }else{
              resolve(_fileArray);
            }
        }
        );

        console.log("num_files >" + num_files);
        if(num_files==0){
          reject('Not found LED files.');
        }
    });

  });
}

function insertAllFilesMIT_LED_DB_MASTER(userName){
  console.log("Welcome insertAllFilesMIT_LED_DB_MASTER()");

  var today = new Date();
  var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
  var time = today.getHours() + "-" + today.getMinutes()
  var dateTime = date+'-'+time+'_';

  var dateTimeStr ="";
  dateTimeStr = dateTimeStr.concat(today.getFullYear(), (today.getMonth()+1),today.getDate(),today.getHours(),today.getMinutes(),'_');


  return new Promise(function(resolve, reject) {

    fs.readdir(LED_FILE_PATH, function (err, files) {
        if (err) {
            logger.error('Unable to scan directory: ' + err);
            reject(err);
        }
        //listing all files using forEach
        var foundFiles=0;
        // var ledArray = new Array();
        files.forEach(function (file) {

            // Do whatever you want to do with the file
            var i =file.indexOf(LED_FILE_NAME);
            if(i != -1){

              foundFiles++;

                insertMIT_LED_DB_MASTER(LED_FILE_PATH+file,userName).then(result=>{

                    //Move file to Backup
                // fs.rename(LED_FILE_PATH+file, LED_FILE_BAK_PATH+ dateTimeStr+ file,  (err) => {
                fs.rename(LED_FILE_PATH+file, LED_FILE_BAK_PATH+ file,  (err) => {
                  if (err) {
                    reject(err);
                  };
                });

                resolve(result);
              },err=>{
                reject(err);
              });

            }else{
              resolve('success');
            }
        }
        );

        if(foundFiles==0){
          reject('Not found LED files.');
        }
    });

  });
}

function insertInitialMIT_LED_DB_MASTER(userName){

  logger.info('Welcome insertInitialMIT_LED_DB_MASTER(); ' );

  var today = new Date();
  var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
  var time = today.getHours() + "-" + today.getMinutes()
  var dateTime = date+'-'+time+'_';

  var dateTimeStr ="";
  dateTimeStr = dateTimeStr.concat(today.getFullYear(), (today.getMonth()+1),today.getDate(),today.getHours(),today.getMinutes(),'_');


  return new Promise(function(resolve, reject) {

    fs.readdir(LED_FILE_PATH, function (err, files) {
        if (err) {
            logger.error('Unable to scan directory: ' + err);
            reject(err);
        }
        //listing all files using forEach
        var foundFiles=0;
        // var ledArray = new Array();
        files.forEach(function (file) {

            // Do whatever you want to do with the file
            var i =file.indexOf('init.txt');
            if(i != -1){

              foundFiles++;

                insertInitialMIT_LED_DB_MASTER_detail(LED_FILE_PATH+file,userName).then(result=>{

                    //Move file to Backup
                // fs.rename(LED_FILE_PATH+file, LED_FILE_BAK_PATH+ dateTimeStr+ file,  (err) => {
                fs.rename(LED_FILE_PATH+file, LED_FILE_BAK_PATH+ file,  (err) => {
                  if (err) {
                    reject(err);
                  };
                });

                resolve(result);
              },err=>{
                reject(err);
              });

            }else{
              resolve('success');
            }
        }
        );

        if(foundFiles==0){
          reject('Not found LED files.');
        }
    });

  });
}

function insertMIT_LED_DB_MASTER(path_file,userName){

  const LEDSTATUS='A';
  const SOURCE='API';

  return new Promise(function(resolve,reject){

     //Table config
     const sql = require('mssql');
     const pool1 = new sql.ConnectionPool(config_BULK, err => {
         const table = new sql.Table('MIT_LED_DB_MASTER');
         table.create = true;
         // 1-10
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
        table.columns.add('RECV_NO', sql.VarChar(50), { nullable: true });
        table.columns.add('RECV_YR', sql.VarChar(4), { nullable: true });
        table.columns.add('DF_NO', sql.VarChar(3), { nullable: true });
        table.columns.add('COURT_TYPE', sql.VarChar(3), { nullable: true });
        table.columns.add('PLAINTIFF2', sql.NVarChar(500), { nullable: true });
        table.columns.add('PLAINTIFF3', sql.NVarChar(500), { nullable: true });
        table.columns.add('DEFENDANT1', sql.NVarChar(500), { nullable: true });
        table.columns.add('DEFENDANT2', sql.NVarChar(500), { nullable: true });
        table.columns.add('DEFENDANT3', sql.NVarChar(500), { nullable: true });
        table.columns.add('IMAGE_COURT', sql.NVarChar(1024), { nullable: true });
        table.columns.add('CASE_CAPITA', sql.VarChar(16), { nullable: true });
        table.columns.add('OWN_NAME', sql.NVarChar(500), { nullable: true });
        table.columns.add('OWN_DEPT', sql.NVarChar(500), { nullable: true });
        table.columns.add('OWN_TEL', sql.VarChar(100), { nullable: true });
        table.columns.add('RCV_DATE', sql.VarChar(50), { nullable: true });
        table.columns.add('REQ_KEY', sql.VarChar(50), { nullable: true });

        table.columns.add('createBy ', sql.VarChar(20), { nullable: true });
        table.columns.add('createDate ', sql.Date, { nullable: true });
        table.columns.add('updateBy ', sql.VarChar(20), { nullable: true });
        table.columns.add('updateDate ', sql.Date, { nullable: true });
        table.columns.add('ledStatus ', sql.Char(2), { nullable: true });
        table.columns.add('source ', sql.Char(5), { nullable: true });

      // Read file
      let rFile = readline.createInterface({
        input: fs.createReadStream(path_file, 'utf8')
      });

      rFile.on('line', function(line) {

        const dataObj = JSON.parse(line);
          for (i in dataObj) {
            console.log( "TWS_KEY>>"+ dataObj[i].TWS_KEY);
            let _TWS_ID;
            if(dataObj[i].TWS_ID){
              _TWS_ID =dataObj[i].TWS_ID
              // console.log("_TWS_ID 1>>" + _TWS_ID);
            }

            if(dataObj[i].TWS_KEY){
              _TWS_ID =dataObj[i].TWS_KEY
              // console.log("_TWS_ID 2>>" + _TWS_ID);
            }

              table.rows.add(
              _TWS_ID// twsid
              ,dataObj[i].BLACK_CASE//dataObj['BLACK_CASE'],// black_case
              ,dataObj[i].BLACK_YY//dataObj['BLACK_YY'],// black_yy
              ,dataObj[i].RED_CASE//dataObj['RED_CASE'],// red_case
              ,dataObj[i].RED_YY//dataObj['RED_YY'],// red_yy
              ,dataObj[i].COURT_NAME//dataObj['COURT_NAME'],// court_name
              ,dataObj[i].PLAINTIFF1//dataObj['PLAINTIFF1'],// plaintiff1
              ,dataObj[i].DF_ID//dataObj['DF_ID'],// df_id
              ,dataObj[i].DF_NAME//dataObj['DF_NAME'],// df_name
              ,dataObj[i].DF_SURNAME//dataObj['DF_SURNAME'],// df_surname
            ,''// tmp_prot_dd
            ,''// tmp_prot_mm
            ,''// tmp_prot_yy
            ,dataObj[i].ABS_PROT_DD//dataObj['ABS_PROT_DD'],// abs_prot_dd
            ,dataObj[i].ABS_PROT_MM//dataObj['ABS_PROT_MM'],// abs_prot_mm
            ,dataObj[i].ABS_PROT_YY//dataObj['ABS_PROT_YY'],// abs_prot_yy
            ,''// df_manage_dd
            ,''// df_manage_mm
            ,''// df_manage_yy
            ,''// bkr_prot_dd
            ,''// bkr_prot_mm
            ,''// bkr_prot_yy
            ,''// statusdf
    // API fields.
            ,dataObj[i].RECV_NO//dataObj['RECV_NO'],
            ,dataObj[i].RECV_YR//dataObj['RECV_YR'],
            ,dataObj[i].DF_NO//dataObj['DF_NO'],
            ,dataObj[i].COURT_TYPE//dataObj['COURT_TYPE'],
            ,dataObj[i].PLAINTIFF2//dataObj['PLAINTIFF2'],
            ,dataObj[i].PLAINTIFF3//dataObj['PLAINTIFF3'],
            ,dataObj[i].DEFENDANT1//dataObj['DEFENDANT1'],
            ,dataObj[i].DEFENDANT2//dataObj['DEFENDANT2'],
            ,dataObj[i].DEFENDANT3//dataObj['DEFENDANT3'],
            ,dataObj[i].IMAGE_COURT//dataObj['IMAGE_COURT'],
            ,dataObj[i].CASE_CAPITAL//dataObj['CASE_CAPITAL'],
            ,dataObj[i].OWN_NAME//dataObj['OWN_NAME'],
            ,dataObj[i].OWN_DEPT//dataObj['OWN_DEPT'],
            ,dataObj[i].OWN_TEL//dataObj['OWN_TEL'],
            ,dataObj[i].RCV_DATE//dataObj['RCV_DATE'],
            ,dataObj[i].REQ_KEY//dataObj['REQ_KEY'],
              ,userName  //createBy
              ,new Date //createDate
              ,null //updateBy
              ,null //updateDate
              ,LEDSTATUS  //ledStatus
              ,SOURCE //source
              );

          }//end for
        });//Read file(line)

        rFile.on('close', function(line) {
          console.log("close >>");

          // Execute insert Bulk data to  MIT_LED table
          const request = new sql.Request(pool1)
          request.bulk(table, (err, result) => {

            if(err){
              logger.error("BULK ERR>>" +err);
              reject(err);
            }else{
              console.log("BULK-> "+ JSON.stringify(result));
              resolve(result);
            }
          });

        });//Read file(close)
      });// SQL ConnectionPool
    });//Promise
}
function insertInitialMIT_LED_DB_MASTER_detail(path_file,userName){

  const LEDSTATUS='A';
  const SOURCE='INIT';

  return new Promise(function(resolve,reject){

     //Table config
     const sql = require('mssql');
     const pool1 = new sql.ConnectionPool(config_BULK, err => {
         const table = new sql.Table('MIT_LED_DB_MASTER');
         table.create = true;
         // 1-10
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
        table.columns.add('RECV_NO', sql.VarChar(50), { nullable: true });
        table.columns.add('RECV_YR', sql.VarChar(4), { nullable: true });
        table.columns.add('DF_NO', sql.VarChar(3), { nullable: true });
        table.columns.add('COURT_TYPE', sql.VarChar(3), { nullable: true });
        table.columns.add('PLAINTIFF2', sql.NVarChar(500), { nullable: true });
        table.columns.add('PLAINTIFF3', sql.NVarChar(500), { nullable: true });
        table.columns.add('DEFENDANT1', sql.NVarChar(500), { nullable: true });
        table.columns.add('DEFENDANT2', sql.NVarChar(500), { nullable: true });
        table.columns.add('DEFENDANT3', sql.NVarChar(500), { nullable: true });
        table.columns.add('IMAGE_COURT', sql.NVarChar(1024), { nullable: true });
        table.columns.add('CASE_CAPITA', sql.VarChar(16), { nullable: true });
        table.columns.add('OWN_NAME', sql.NVarChar(500), { nullable: true });
        table.columns.add('OWN_DEPT', sql.NVarChar(500), { nullable: true });
        table.columns.add('OWN_TEL', sql.VarChar(100), { nullable: true });
        table.columns.add('RCV_DATE', sql.VarChar(50), { nullable: true });
        table.columns.add('REQ_KEY', sql.VarChar(50), { nullable: true });

        table.columns.add('createBy ', sql.VarChar(20), { nullable: true });
        table.columns.add('createDate ', sql.Date, { nullable: true });
        table.columns.add('updateBy ', sql.VarChar(20), { nullable: true });
        table.columns.add('updateDate ', sql.Date, { nullable: true });
        table.columns.add('ledStatus ', sql.Char(2), { nullable: true });
        table.columns.add('source ', sql.Char(5), { nullable: true });

      // Read file
      let rFile = readline.createInterface({
        input: fs.createReadStream(path_file, 'utf8')
      });

      rFile.on('line', function(line) {

        // console.log( "line>>"+ line);
        lineArray = line.split("|");

        // 1	twsid
        _twsid = lineArray[0];
        // 2	black_case
        _black_case = lineArray[1];
        // 3	black_yy
        _black_yy = lineArray[2];
        // 4	red_case
        _red_case = lineArray[3];
        // 5	red_yy
        _red_yy = lineArray[4];
        // 6	court_name
        _court_name = lineArray[5];
        // 7	plaintiff1
        _plaintiff1 = lineArray[6];
        // 8	df_id
        _df_id = lineArray[7];
        // 9	df_name
        _df_name = lineArray[8];
        // 10	df_surname
        _df_surname = lineArray[9];
        // 11	tmp_prot_dd
        _tmp_prot_dd = lineArray[10];
        // 12	tmp_prot_mm
        _tmp_prot_mm = lineArray[11];
        // 13	tmp_prot_yy
        _tmp_prot_yy = lineArray[12];
        // 14	abs_prot_dd
        _abs_prot_dd = lineArray[13];
        // 15	abs_prot_mm
        _abs_prot_mm = lineArray[14];
        // 16	abs_prot_yy
        _abs_prot_yy = lineArray[15];
        // 17	df_manage_dd
        _df_manage_dd = lineArray[16];
        // 18	df_manage_mm
        _df_manage_mm = lineArray[17];
        // 19	df_manage_yy
        _df_manage_yy = lineArray[18];
        // 20	bkr_prot_dd
        _bkr_prot_dd = lineArray[19];
        // 21	bkr_prot_mm
        _bkr_prot_mm = lineArray[20];
        // 22	bkr_prot_yy
        _bkr_prot_yy = lineArray[21];
        // 23	statusdf
        _statusdf = lineArray[22];

              table.rows.add(
                _twsid// twsid
              ,_black_case// black_case
              ,_black_yy// black_yy
              ,_red_case// red_case
              ,_red_yy// red_yy
              ,_court_name// court_name
              ,_plaintiff1// plaintiff1
              ,_df_id// df_id
              ,_df_name// df_name
              ,_df_surname// df_surname
            ,_tmp_prot_dd// tmp_prot_dd
            ,_tmp_prot_mm// tmp_prot_mm
            ,_tmp_prot_yy// tmp_prot_yy
            ,_abs_prot_dd// abs_prot_dd
            ,_abs_prot_mm// abs_prot_mm
            ,_abs_prot_yy// abs_prot_yy
            ,_df_manage_dd// df_manage_dd
            ,_df_manage_mm// df_manage_mm
            ,_df_manage_yy// df_manage_yy
            ,_bkr_prot_dd// bkr_prot_dd
            ,_bkr_prot_mm// bkr_prot_mm
            ,_bkr_prot_yy// bkr_prot_yy
            ,_statusdf// statusdf
    // API fields.
            ,''//dataObj['RECV_NO'],
            ,''//dataObj['RECV_YR'],
            ,''//dataObj['DF_NO'],
            ,''//dataObj['COURT_TYPE'],
            ,''//dataObj['PLAINTIFF2'],
            ,''//dataObj['PLAINTIFF3'],
            ,''//dataObj['DEFENDANT1'],
            ,''//dataObj['DEFENDANT2'],
            ,''//dataObj['DEFENDANT3'],
            ,''//dataObj['IMAGE_COURT'],
            ,''//dataObj['CASE_CAPITAL'],
            ,''//dataObj['OWN_NAME'],
            ,''//dataObj['OWN_DEPT'],
            ,''//dataObj['OWN_TEL'],
            ,''//dataObj['RCV_DATE'],
            ,''//dataObj['REQ_KEY'],
              ,userName  //createBy
              ,new Date //createDate
              ,null //updateBy
              ,null //updateDate
              ,LEDSTATUS  //ledStatus
              ,SOURCE //source
              );

        });//Read file(line)

        rFile.on('close', function(line) {
          console.log("close >>");

          // Execute insert Bulk data to  MIT_LED table
          const request = new sql.Request(pool1)
          request.bulk(table, (err, result) => {

            if(err){
              logger.error("BULK ERR>>" +err);
              reject(err);
            }else{
              console.log("BULK-> "+ JSON.stringify(result));
              resolve(result);
            }
          });

        });//Read file(close)
      });// SQL ConnectionPool
    });//Promise
}


function insertMIT_LED_GetBankruptList(path_file,userName){

  return new Promise(function(resolve,reject){

     //Table config
     const sql = require('mssql');
     const pool1 = new sql.ConnectionPool(config_BULK, err => {
         const table = new sql.Table('MIT_LED_GetBankruptList');
         table.create = true;
         // 1-10
         // table.columns.add('TWS_ID', sql.Int, {nullable: false, primary: true});
         table.columns.add('TWS_ID', sql.Int);
         table.columns.add('RECV_NO', sql.NVarChar(20));
         table.columns.add('RECV_YR', sql.NVarChar(4), { nullable: true });
         table.columns.add('DF_ID', sql.NVarChar(20), { nullable: true });
         table.columns.add('DF_NAME', sql.NVarChar(400), { nullable: true });
         table.columns.add('DF_SURNAME', sql.NVarChar(400), { nullable: true });
         table.columns.add('DF_NO', sql.VarChar(2), { nullable: true });
         table.columns.add('COURT_NAME', sql.NVarChar(400), { nullable: true });
         table.columns.add('COURT_TYPE', sql.VarChar(2), { nullable: true });
         table.columns.add('BLACK_CASE', sql.NVarChar(50), { nullable: true });
         // 11-20
         table.columns.add('BLACK_YY', sql.VarChar(5), { nullable: true });
         table.columns.add('RED_CASE', sql.NVarChar(50), { nullable: true });
         table.columns.add('RED_YY', sql.VarChar(5), { nullable: true });
         table.columns.add('PLAINTIFF1', sql.NVarChar(400), { nullable: true });
         table.columns.add('PLAINTIFF2', sql.NVarChar(400), { nullable: true });
         table.columns.add('PLAINTIFF3', sql.NVarChar(400), { nullable: true });
         table.columns.add('DEFENDANT1', sql.NVarChar(400), { nullable: true });
         table.columns.add('DEFENDANT2', sql.NVarChar(400), { nullable: true });
         table.columns.add('DEFENDANT3', sql.NVarChar(400), { nullable: true });
         table.columns.add('ABS_PROT_DD', sql.VarChar(2), { nullable: true });
         // 21-29
         table.columns.add('ABS_PROT_MM', sql.VarChar(2), { nullable: true });
         table.columns.add('ABS_PROT_YY', sql.VarChar(5), { nullable: true });
         table.columns.add('IMAGE_COURT', sql.NVarChar(1024), { nullable: true });
         table.columns.add('CASE_CAPITAL', sql.VarChar(20), { nullable: true });
         table.columns.add('OWN_NAME', sql.VarChar(500), { nullable: true });
         table.columns.add('OWN_DEPT', sql.VarChar(500), { nullable: true });
         table.columns.add('OWN_TEL', sql.VarChar(20), { nullable: true });
         table.columns.add('RCV_DATE', sql.VarChar(50), { nullable: true });
         table.columns.add('REQ_KEY', sql.VarChar(50), { nullable: true });

         table.columns.add('createBy', sql.VarChar(20), { nullable: true });
         table.columns.add('createDate', sql.Date, { nullable: true });
         table.columns.add('updateBy', sql.VarChar(20), { nullable: true });
         table.columns.add('updateDate', sql.Date, { nullable: true });

      // Read file
      let rFile = readline.createInterface({
        input: fs.createReadStream(path_file, 'utf8')
      });

      rFile.on('line', function(line) {
        const dataObj = JSON.parse(line);
        console.log("LINE >>" + JSON.stringify(dataObj));
        table.rows.add(
          dataObj['TWS_ID'],
          dataObj['RECV_NO'],
          dataObj['RECV_YR'],
          dataObj['DF_ID'],
          dataObj['DF_NAME'],
          dataObj['DF_SURNAME'],
          dataObj['DF_NO'],
          dataObj['COURT_NAME'],
          dataObj['COURT_TYPE'],
          dataObj['BLACK_CASE'],
          dataObj['BLACK_YY'],
          dataObj['RED_CASE'],
          dataObj['RED_YY'],
          dataObj['PLAINTIFF1'],
          dataObj['PLAINTIFF2'],
          dataObj['PLAINTIFF3'],
          dataObj['DEFENDANT1'],
          dataObj['DEFENDANT2'],
          dataObj['DEFENDANT3'],
          dataObj['ABS_PROT_DD'],
          dataObj['ABS_PROT_MM'],
          dataObj['ABS_PROT_YY'],
          dataObj['IMAGE_COURT'],
          dataObj['CASE_CAPITAL'],
          dataObj['OWN_NAME'],
          dataObj['OWN_DEPT'],
          dataObj['OWN_TEL'],
          dataObj['RCV_DATE'],
          dataObj['REQ_KEY'],
          userName,new Date,null,null);
        });//Read file(line)

        rFile.on('close', function(line) {
          console.log("close >>");

          // Execute insert Bulk data to  MIT_LED table
          const request = new sql.Request(pool1)
          request.bulk(table, (err, result) => {

            if(err){
              reject(err);
            }else{
              resolve("Successful");
            }
          });
        });//Read file(close)

      });// SQL ConnectionPool

    });//Promise
}

function fnLedGetBankruptListSchedule(schStatus,schData){

  const SCH_STOP = 'STOP';
  const SCH_START = 'START';
  const actionBy = 'MPAM_SCH';
  return new Promise(function(resolve, reject) {

        if(schStatus.toUpperCase() === SCH_START){
          logger.info("START LED_JOB");
          // START SCH
          // var LED_JOB_SCH ='* 22 * * *'; //Every day on 22.00
          var LED_JOB_SCH =' * * * * *'; // Every minute

          if(schData)
            LED_JOB_SCH=schData;

          LED_JOB = new CronJob(LED_JOB_SCH, function() {

            // logger.info("Complete LED_JOB download & write files.");
            //****************** */ Call Tempolary for test & development
            const req_key="";
            const req_status = ""
            const startdate= "2019-07-02";
            const enddate = "2019-07-02";

            fnGetBankruptListByDate(req_key,req_status,startdate,enddate).then(result =>{
              logger.info("Complete LED_JOB download & write files.");
              fnCleanCustFromFile(actionBy);

            },err =>{
              logger.info(err);
            });

             //****************** */ Call on production
            // fnGetBankruptList().then(result =>{
            //     // Download LED -> write file complese
            //     // Next clean your data base
            //     logger.info("Complete LED_JOB download & write files.");

            // fnCleanCustFromFile(actionBy);
            // },err =>{
            //   // Download & Write file error
            //   // Send mail to system addmin
            //   logger.error(err);
            // });

          });

          resolve("000");

        }else if(schStatus.toUpperCase() === SCH_STOP){

            LED_JOB.stop();
            logger.info("STOP LED_JOB");

            resolve("000");
        }else{
          reject("Incorrect condition.");
        }
  });
}

function fnGetBankruptList(){

  return new Promise(function(resolve, reject) {

      var input ="";
      // #1 Encryt
      fncSOAPEncrypt().then(result =>{

        input= result.EncryptResult;

        // console.log("Input >>" + JSON.stringify(input));

        // #2 Call APIs
        fnCallLEDapis(PATH_GetBankruptList,input).then(result =>{

          // console.log("fnCallLEDapis>> "+ result);

          var resultObj =  JSON.parse(result);

          if(resultObj.responseCode == "000"){
            if(resultObj.data){
            // #3 Decrypt
            fncSOAPDecrypt(resultObj.data).then(result =>{

              // #4 write file
              writeLocalFile(result,LED_LIST_FILE_NAME).then(result =>{
                resolve(result);
              },err=>{
                logger.error(err);
                reject(err);
              });

            },err=>{
              logger.error(err);
              reject(err);
            })

            }
          }else{
            resolve(result);
          }
        },err=>{
          logger.error(err);
          reject(err);

        })

      },err=>{
        logger.error(err);
        reject(err);
      })
  });
}

function fnGetBankruptListByDate(req_key,req_status,startdate,enddate){
  // console.log("Welcome to API /callGetBankruptList/");

  return new Promise(function(resolve, reject) {
    // #1 Encryt
    fncSOAPEncrypt(req_key,req_status,startdate,enddate).then(result =>{

      const input= result.EncryptResult;
      // #2 Call APIs
      fnCallLEDapis(PATH_GetBankruptListByDate,input).then(result =>{

        var resultObj =  JSON.parse(result);
        if(resultObj.responseCode == "000"){
            if(resultObj.data){
            // #3 Decrypt
              fncSOAPDecrypt(resultObj.data).then(result =>{

                // #4 write file
                writeLocalFile(result,LED_LIST_FILE_NAME).then(result =>{
                  resolve(result);
                },err=>{
                  reject(err);
                });

              },err=>{// Error  fncSOAPDecrypt
                reject(err);
              })
            }
          }else{
            resolve(result);
          }
      },err=>{
        reject(err);
      })
    },err=>{
      reject(err);
    });
  });
}

function writeLocalFile(data,fileName) {

  var today = new Date();

  // var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
  // var time = today.getHours() + "-" + today.getMinutes()
  // var dateTime = date+'-'+time;
  var date = today.getFullYear()+''+(today.getMonth()+1)+''+today.getDate();
  var time = today.getHours() + "" + today.getMinutes()
  var dateTime = date+''+time;

  const _fileName =  dateTime+'-'+fileName;

  return new Promise(function(resolve, reject) {
    // #4 write file
    let writeStream = fs.createWriteStream(LED_FILE_PATH+_fileName);
    writeStream.write(data, 'utf8');
    // the finish event is emitted when all data has been flushed from the stream
    writeStream.on('finish', () => {
      resolve(data);
    });
    // close the stream
    writeStream.end();
  });
}

function fnCallLEDapis(path,input){

  return new Promise(function(resolve, reject) {

  const https = require('https')
  const postData = JSON.stringify({
    input:input
  });

  // console.log('input>>'+ input);
  // // https://debtor.led.go.th/api/public/GetBankruptList
  var options_1 = {
    host: HOST_LED,
    path:path,
    method: "POST",
    headers: {
       "api-key": API_KEY,
       "Content-Type": "application/json",
       'Content-Length': postData.length
    },
  };

  // console.log('options_1>>' + JSON.stringify(options_1));

  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0" //this is insecure
  const request = https.request(options_1,(res) => {
    var _chunk="";
    var i=0;
    res.setEncoding('utf8');
    res.on('data', (chunk) => {

      // console.log("(chunk)>>"+ JSON.stringify(chunk));
      i++;
      // console.log("i>>"+i);
      _chunk=_chunk.concat(chunk);
    });
    res.on('end', () => {
      console.log('No more data in response.');
      resolve(_chunk);
    });

  });

  request.on('error', (e) => {
    reject(e);
  });

  // Write data to request body
  request.write(postData);
  request.end();

  });
}

function fncSOAPEncrypt(req_key,req_status,startdate,enddate){

  logger.info(`Welcome fncEncry() req_key:${req_key}; req_status:${req_status}; startdate:${startdate}; enddate:${enddate}` );

  return new Promise(function(resolve, reject) {

    // var userPath = path.resolve('./backend/merchantasset_CA/led/led_user.json');
    // var userData = fs.readFileSync(userPath, "utf8"); //ascii,utf8

    var signerPath = path.resolve('./backend/merchantasset_CA/led/mpam_cert.pem');
    var signerCert = fs.readFileSync(signerPath, "utf8");  //ascii,utf8

    var recipientPath = path.resolve('./backend/merchantasset_CA/led/led.pub');
    var recipientCert = fs.readFileSync(recipientPath, "utf8"); //ascii,utf8

    var url = HTTP_SOAP +'?wsdl';

    let userDataObj  = JSON.parse(userData);

    // 1 GetBankruptList (Default)
    //   'input': '{"username":"MPAM", "password":"MPAM123"}',

    if(req_key && req_status && (req_key !='') && (req_status != '')){
      // console.log('fncSOAPEncrypt() 2');
    // 2 ReceiverBreezeWebService
    //   'input': '{"username":"MPAM", "password":"MPAM123", "req_key":"LED2019062000086","req_status":"20002"}',
      userDataObj.req_key = req_key;
      userDataObj.req_status = req_status;

    }else if(startdate && enddate && (startdate != '') && (enddate!='')){
      // console.log('fncSOAPEncrypt() 3');
    // 3 GetBankruptListByDate
    //   'input': '{"username":"MPAM", "password":"MPAM123", "startdate":"2019-06-11","enddate":"2019-06-17"}',
      userDataObj.startdate=startdate;
      userDataObj.enddate=enddate;

    }

    // console.log("input>" + JSON.stringify(userDataObj));
    // console.log("signerCertificate>" + JSON.stringify(signerCert));
    // console.log("recipientCertificate>" + JSON.stringify(recipientCert));

    //GetBankruptList
    var args = {
      'input': `${JSON.stringify(userDataObj)}`,
      'signerCertificate':signerCert,
      'recipientCertificate':recipientCert
    };

    // console.log('input>' + JSON.stringify(args));
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0" //this is insecure
    soap.createClient(url, function(err, client) {
      if(err){
        console.log('WAS ERROR  createClient() >>'+err)
        reject(err);
      }else{
        // console.log('setEndpoint>>' +HTTP_SOAP);
        client.setEndpoint(HTTP_SOAP);
        // client.setEndpoint('https://192.168.10.48:444/CrytoService.svc');
        client.Encrypt(args, function(err, result) {
          if(err){
            console.log("WAS ERROR Encrypt() >>" + err);
            reject(err);
          }else{
            resolve(result);
          }
        });
      }
    });

  });
}


function fncSOAPDecrypt(reqInput){

  // logger.info(`Welcome fncDecrypt()>>`);
  return new Promise(function(resolve, reject) {

    const utf8 = require('utf8');
    var url = HTTP_SOAP +'?wsdl';

    var args = {
      'input': reqInput
    };

    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0" //this is insecure
    soap.createClient(url, function(err, client) {

      // console.log(client)

      if(err){
        console.log('WAS ERROR  createClient() >>'+err)
        reject(err);
      }else{

        client.setEndpoint(HTTP_SOAP);
        client.Decrypt(args, function(err, result) {
          if(err){
            console.log("WAS ERROR Encrypt() >>" + err);
            reject(err);
          }else{

            var resultObj =  JSON.parse(JSON.stringify(result));
            // console.log("result>>"+ JSON.stringify(resultObj));

            if(resultObj.hasOwnProperty('DecryptResult')){
              // console.log('**** OK>>' + resultObj["DecryptResult"]);
              rsObj=JSON.parse(resultObj["DecryptResult"]) ;

              // resolve(JSON.stringify(rsObj[0]));
              resolve(JSON.stringify(rsObj));
            }else{
              reject({"msg":"Not found result"})
            }

          //   var jsonObj =  JSON.parse(JSON.stringify(result));
          //   // console.log("KEY>>" + jsonObj.key);
          //   // console.log("Connection successful >>" + JSON.stringify(str));



          }
        });
      }

    });

    // reject(err);
    // resolve("true");
  });

}
