
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

const mysql_dbConfig = require("../config/mysql-config");
var swan_config = mysql_dbConfig.swan_dbParameters;
var mysql = require('mysql');

const readPath = __dirname + '/readFiles/LED/';
const readFile = 'exp_lom.txt';

const bakPath = __dirname + '/readFiles/LEDBackup/';

const LED_INSP_LED_CODE = '001';
const LED_INSP_STATUS =1;

// var msdb = require("../config/msdb");

// exports.uploadFile = (req, res, next) =>{

//   logger.info('Welcome uploadFile()');
//   const userCode = req.body.userCode;

//     var today = new Date();
//     var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
//     var time = today.getHours() + "-" + today.getMinutes()
//     var dateTime = date+'-'+time;
//     const bakFile =  dateTime+'-exp_lom.txt';

//     if ( !userCode) {
//       logger.error( 'Not found userCode: ' + userCode);
//       // rsp_code = 301;
//       return res.status(401);
//     }

//     line_no = 0;

//     let rFile = readline.createInterface({
//       input: fs.createReadStream(readPath+readFile, 'utf8')
//     });


//     rFile.on('line', function(line) {
//         line_no++;
//         console.log('line_no >>:' + line_no);
//         if(line_no >1){

//           //On action what to do?
//           // xxx()
//           insertMIT_LED(userCode,line).then( (data) =>{
//           console.log('insertMIT_LED  result >>:' + data);
//           },(err)=>{
//             if(err) {
//               logger.error( ''+err );
//               rsp_code = 902;
//               return res.status(422).json({
//                 code: rsp_code,
//                 msg: prop.getRespMsg(rsp_code),
//               });
//             }
//           });
//         }
//     });

//     // end
//     rFile.on('close', function(line) {
//       console.log('Total lines : ' + line_no);

//       //Move file to Backup
//       fs.rename(readPath+readFile, bakPath+bakFile,  (err) => {
//         if (err) {
//           res.status(422).json({ message: err });
//         };
//         res.status(200).json({ message: 'uploadFile successful!' });
//       });
//     });
// }


// exports.uploadBulkFileMaster = (req, res, next) =>{

//   logger.info('Welcome uploadBulkFile()');
//   const userCode = req.body.userCode;

//   var today = new Date();
//   var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
//   var time = today.getHours() + "-" + today.getMinutes()
//   var dateTime = date+'-'+time;
//   const bakFile =  dateTime+'-exp_lom.txt';
//   var LED_Status ='A';

//   // Check userCode
//   if ( !userCode) {
//     logger.error( 'Not found userCode: ' + userCode);
//     // rsp_code = 301;
//     return res.status(401);
//   }

// // Check file exist
//   fs.stat(readPath+readFile, function(err, stat) {
//     if(err == null) {
//         console.log('File exists');
//     } else if(err.code === 'ENOENT') {
//         // file does not exist
//         console.log('***file does not exist: ');
//         res.status(400).json({ message: 'file does not exist'});
//     } else {
//         console.log('Some other error: ', err.code);
//     }
//   });

//     //Table config
//     const sql = require('mssql');
//     const pool1 = new sql.ConnectionPool(config_BULK, err => {

//         console.log('connected');
//         const table = new sql.Table('MIT_LED_DB_MASTER');
//         // table.create = true;
//         table.columns.add('twsid', sql.Int, {nullable: false, primary: true});
//         table.columns.add('black_case', sql.NVarChar(20));
//         table.columns.add('black_yy', sql.NVarChar(4), { nullable: true });
//         table.columns.add('red_case', sql.NVarChar(20), { nullable: true });
//         table.columns.add('red_yy', sql.VarChar(4), { nullable: true });
//         table.columns.add('court_name ', sql.NVarChar(180), { nullable: true });
//         table.columns.add('plaintiff1 ', sql.NVarChar(1024), { nullable: true });
//         table.columns.add('df_id ', sql.NVarChar(50), { nullable: true });
//         table.columns.add('df_name ', sql.NVarChar(1024), { nullable: true });
//         table.columns.add('df_surname ', sql.NVarChar(1024), { nullable: true });
//         table.columns.add('tmp_prot_dd ', sql.VarChar(2), { nullable: true });
//         table.columns.add('tmp_prot_mm ', sql.VarChar(2), { nullable: true });
//         table.columns.add('tmp_prot_yy ', sql.VarChar(4), { nullable: true });
//         table.columns.add('abs_prot_dd ', sql.VarChar(2), { nullable: true });
//         table.columns.add('abs_prot_mm ', sql.VarChar(2), { nullable: true });
//         table.columns.add('abs_prot_yy ', sql.VarChar(4), { nullable: true });
//         table.columns.add('df_manage_dd ', sql.VarChar(2), { nullable: true });
//         table.columns.add('df_manage_mm ', sql.VarChar(2), { nullable: true });
//         table.columns.add('df_manage_yy ', sql.VarChar(4), { nullable: true });
//         table.columns.add('bkr_prot_dd ', sql.VarChar(2), { nullable: true });
//         table.columns.add('bkr_prot_mm ', sql.VarChar(2), { nullable: true });
//         table.columns.add('bkr_prot_yy ', sql.VarChar(4), { nullable: true });
//         table.columns.add('statusdf ', sql.VarChar(1), { nullable: true });
//         table.columns.add('createBy ', sql.VarChar(20), { nullable: true });
//         table.columns.add('createDate ', sql.Date, { nullable: true });
//         table.columns.add('updateBy ', sql.VarChar(20), { nullable: true });
//         table.columns.add('updateDate ', sql.Date, { nullable: true });
//         table.columns.add('ledStatus ', sql.Char(2), { nullable: true });

//         //  File
//       line_no = 0;

//       let rFile = readline.createInterface({
//         input: fs.createReadStream(readPath+readFile, 'utf8')
//       });

//       rFile.on('line', function(line) {
//           line_no++;
//           console.log('line_no >>:' + line_no);
//             if(line_no >0){
//               var array = line.split("|");
//               // console.log( 'DATA(1)>>' + array[22] );

//               //On action what to do?
//               // isEmpty()
//               table.rows.add(array[0].trim(), array[1].trim(), array[2].trim(), array[3].trim(), array[4].trim(), array[5].trim(), array[6].trim(), array[7].trim(), array[8].trim(), array[9].trim(), array[10].trim()
//                 , array[11].trim(), array[12].trim(), array[13].trim(), array[14].trim(), array[15].trim(), array[16].trim(), array[17].trim(), array[18].trim(), array[19].trim(), array[20].trim(), array[21].trim(), array[22].trim()
//                 , userCode,new Date,'',null,LED_Status);

//             }
//         });

//             // end
//         rFile.on('close', function(line) {
//           console.log('Total lines : ' + line_no);

//           // Execute insert Bulk data to  MIT_LED table
//           const request = new sql.Request(pool1)
//           request.bulk(table, (err, result) => {
//               // ... error checks
//             if(err){
//               console.log(err);
//               // Response to client
//               res.status(400).json({ message: 'BULK was error' });
//             }

//             if(result){
//               console.log(result);

//               //Move file to Backup
//               fs.rename(readPath+readFile, bakPath+bakFile,  (err) => {
//                 if (err) {
//                   // Response to client
//                   res.status(422).json({ message: err });
//                 };
//               });

//               // Response to client
//               res.status(200).json({ message: 'Total lines : ' + line_no });
//             }

//           })

//         });
//         // file

//   });

//   pool1.on("error", err => {
//     console.log("EROR>>" + err);
//     reject(err);
//   });

// }




exports.callGetBankruptList = (req, res, next) =>{
  var led_options = {
    host: 'test.example.com',
    port: 443,
    path: '/api/service/'+servicename,
    // authentication headers
    headers: {
       'username': 'MPAM',
       'password': 'MPAM123',
       'api-key': '328010cc65ecf3a5f0bcdbb51e339d36',
      //  'api-key': 'Basic ' + new Buffer(username + ':' + passw).toString('base64')
    }
  };

  request = https.get(options, function(res){
    var body = "";
    res.on('data', function(data) {
       body += data;
    });
    res.on('end', function() {
     //here we have the full response, html or json object
       console.log(body);
    })
    res.on('error', function(e) {
       onsole.log("Got error: " + e.message);
    });
   });
}

exports.uploadBulkFileDialy = (req, res, next) =>{

  logger.info('Welcome uploadBulkFileDialy()');
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
        const table = new sql.Table('MIT_LED_DB_DIALY');
        // table.create = true;
        table.columns.add('twsid', sql.Int, {nullable: false, primary: true});
        table.columns.add('black_case', sql.NVarChar(20));
        table.columns.add('black_yy', sql.NVarChar(4), { nullable: true });
        table.columns.add('red_case', sql.NVarChar(20), { nullable: true });
        table.columns.add('red_yy', sql.VarChar(4), { nullable: true });
        table.columns.add('court_name', sql.NVarChar(180), { nullable: true });
        table.columns.add('plaintiff1', sql.NVarChar(1024), { nullable: true });
        table.columns.add('df_id', sql.NVarChar(50), { nullable: true });
        table.columns.add('df_name', sql.NVarChar(1024), { nullable: true });
        table.columns.add('df_surname', sql.NVarChar(1024), { nullable: true });
        table.columns.add('tmp_prot_dd', sql.VarChar(2), { nullable: true });
        table.columns.add('tmp_prot_mm', sql.VarChar(2), { nullable: true });
        table.columns.add('tmp_prot_yy', sql.VarChar(4), { nullable: true });
        table.columns.add('abs_prot_dd', sql.VarChar(2), { nullable: true });
        table.columns.add('abs_prot_mm', sql.VarChar(2), { nullable: true });
        table.columns.add('abs_prot_yy', sql.VarChar(4), { nullable: true });
        table.columns.add('df_manage_dd', sql.VarChar(2), { nullable: true });
        table.columns.add('df_manage_mm', sql.VarChar(2), { nullable: true });
        table.columns.add('df_manage_yy', sql.VarChar(4), { nullable: true });
        table.columns.add('bkr_prot_dd', sql.VarChar(2), { nullable: true });
        table.columns.add('bkr_prot_mm', sql.VarChar(2), { nullable: true });
        table.columns.add('bkr_prot_yy', sql.VarChar(4), { nullable: true });
        table.columns.add('statusdf', sql.VarChar(1), { nullable: true });
        table.columns.add('createBy', sql.VarChar(20), { nullable: true });
        table.columns.add('createDate', sql.Date, { nullable: true });
        table.columns.add('updateBy', sql.VarChar(20), { nullable: true });
        table.columns.add('updateDate', sql.Date, { nullable: true });
        table.columns.add('ledStatus', sql.Char(2), { nullable: true });

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


exports.checkCustDialy = (req, res, next) => {
    logger.info(`API /api/led/checkCustDialy - ${req.originalUrl} - ${req.ip} `);
    var actionBy = req.body.actionBy
    // let swanCust =[];
    // let mftsCust =[];
    // let ledMaster =[];

    console.log('Start checkCustAll()' + new Date())
      // GET data
      Promise.all([
      this.getSWANCustomers().catch(err => { res.status(401).json({ message: 'Error getSWANCustomers()'+err }); }),
      this.getMFTSCustomers().catch(err => { res.status(401).json({ message: 'Error getMFTSCustomers()'+err }); }),
      getLED_Dialy().catch(err => { res.status(401).json({ message: 'Error getLED_Dialy()' +err }); }),
      ]).then(values => {

        //index 0: is SWAN
        //index 1: is MFTS
        //index 2: is LED
        // Cleaning db. 2
        Promise.all([
          this.compareLED_2(values[2],values[0]).catch(err => { res.status(401).json({ message: 'Error Compare LED & SWAN >>'+err }); }),
          this.compareLED_2(values[2],values[1]).catch(err => { res.status(401).json({ message: 'Error Compare LED & MFTS >>'+err }); }),
          ]).then(values => {

            Promise.all([
              insertLEDInspect(values[0],"SWAN",actionBy).catch(err => { res.status(401).json({ message: 'Error SWAN to inspection >>'+err }); }),
              insertLEDInspect(values[1],"MFTS",actionBy).catch(err => { res.status(401).json({ message: 'Error MFTS  to inspection>>'+err }); }),
              swapLEDDialyToMaster().catch(err => { res.status(401).json({ message: 'Error SWAP >>'+err }); }),
              ]).then(values => {

                console.log('End checkCustAll()' + new Date())
                res.status(200).json({ message: 'Successful /checkCustDialy' });

              },function(err){
                res.status(401).json({ message: err });
              })

          });
      });
}


exports.searchInsp = (req, res, next) => {
  var fncName = "searchInsp";

  logger.info(`searchInsp API/ `);

  var numPerPage = parseInt(req.query.pagesize, 10) || 10;
  var page = parseInt(req.query.page, 10) || 1;
  var custId = req.query.custId || false;
  var firstName = req.query.firstName || false;
  var lastName = req.query.lastName || false;
  var fromSource = req.query.fromSource || false;
  var led_code = req.query.led_code || false;

  var chooseDate = req.query.chooseDate || false;
  var led_state = req.query.led_state || false;

  var whereCond = "1=1";

  if(custId){
    whereCond += ` AND Cust_Code= '${custId}' `
  }

  if(firstName){
    whereCond += ` AND firstName like '%${firstName}%' `
  }

  if(lastName){
    whereCond += ` AND lastName like '%${lastName}%' `
  }

  if(fromSource && fromSource != '0' ){
    whereCond += ` AND cust_source= '${fromSource}' `
  }

  if(led_code && led_code != '0'){
    whereCond += ` AND led_code= '${led_code}' `
  }


  if(chooseDate){
    whereCond += ` AND CONVERT(date,createDate)= CONVERT(date, '${chooseDate}')  `
  }

  if(led_state === 'led_insp'){
    whereCond += ` AND led_code IN ('001','201') `
  }else if(led_state === 'led_freeze') {
    whereCond += ` AND led_code IN ('100','101','102') `
  }

  // VALIDATION Condifiton
  // console.log('Validate COND. >>' + whereCond );

  if(whereCond.length<=3 && fromSource != '0' && led_code != '0'){
    res.status(400).json();
    return;
  }

  //Call Query
  searchInspCust(whereCond,page,numPerPage).then(result =>{
    res.status(200).json({
      message: "Successfully!",
      result: result
    });

  },err=>{
    // console.log(fncName + " Quey db. Was err !!!" + err);
    res.status(400).json({
      message: err
    });

  })
}


exports.searchLedMaster = (req, res, next) => {
  var fncName = "searchInsp";

  logger.info(`searchLedMaster API/ `);

  var numPerPage = parseInt(req.query.pagesize, 10) || 10;
  var page = parseInt(req.query.page, 10) || 1;

  var id = req.query.id || false;
  var firstName = req.query.firstName || false;
  var lastName = req.query.lastName || false;

  var whereCond = "1=1";

  if(id){
    whereCond += ` AND df_id= '${id}' `
  }

  if(firstName){
    whereCond += ` AND df_name like '%${firstName}%' `
  }

  if(lastName){
    whereCond += ` AND df_surname like '%${lastName}%' `
  }

  // VALIDATION Condifiton
  // console.log('Validate COND. >>' + whereCond );
  if(whereCond.length<=3){
    res.status(400).json();
    return;
  }

  //Call Query
  searchLedMaster(whereCond,page,numPerPage).then(result =>{
    res.status(200).json({
      message: "Successfully!",
      result: result
    });

  },err=>{
    // console.log(fncName + " Quey db. Was err !!!" + err);
    res.status(400).json({
      message: err
    });

  })
}


exports.getLEDMasterBykey = (req, res, next) => {

  var _key = req.query.key;
  // console.log("getLEDMasterBykey() " + _key)
  logger.info(`getLEDMasterBykey API/ `);

  getLEDMasterBykey(_key)
  .then(result=>{
    res.status(200).json({
      message: "Successfully!",
      result: result
    });
  },err=>{
    res.status(400).json({
      message: err
    });
  });

}


exports.getInspByKey = (req, res, next) => {

  var _key = req.query.key;
  // console.log("getInspByKey() " + _key)
  logger.info(`getInspByKey API/ `);

  getInspByKey(_key)
  .then(result=>{

    res.status(200).json({
      message: "Successfully!",
      result: result
    });

  },err=>{
    res.status(400).json({
      message: err
    });
  });

}


exports.getInspByCustCode = (req, res, next) => {

  var _key = req.query.key;
  // console.log("getInspByCustCode() " + _key)
  logger.info(`getInspByCustCode API/ `);

  getInspByCustCode(_key)
  .then(result=>{

    res.status(200).json({
      message: "Successfully!",
      result: result
    });

  },err=>{
    res.status(400).json({
      message: err
    });
  });

}





exports.getInspByGroupId = (req, res, next) => {

  var _key = req.query.key;
  // console.log("getInspByGroupId() " + _key)
  logger.info(`getInspByGroupId API/ `);

  getInspByGroupId(_key)
  .then(result=>{
    res.status(200).json({
      message: "Successfully!",
      result: result
    });
  },err=>{
    res.status(400).json({
      message: err
    });
  });

}

exports.getInspHistory = (req, res, next) => {

  var _key = req.query.key;
  // console.log("inspHistory API " + _key)
  logger.info(`getInspHistory API/ `);

  getInspHistory(_key)
  .then(result=>{
    res.status(200).json({
      message: "Successfully!",
      result: result
    });
  },err=>{
    res.status(400).json({
      message: err
    });
  });

}

exports.getAddInspHistory = (req, res, next) => {

  var _key = req.body.key
  var _version = req.body.version
  var _his_topic = req.body.his_topic
  var _memo = req.body.memo
  var _actionBy = req.body.actionBy

  // console.log("inspHistory API " + _key)
  logger.info(`getAddInspHistory API/ `);

  getAddInspHistory(_key,_version,_his_topic,_memo,_actionBy)
  .then(result=>{
    res.status(200).json({
      message: "Successfully!",
      result: result
    });
  },err=>{
    res.status(400).json({
      message: err
    });
  });

}

exports.updateInspCust = (req, res, next) => {

  var led_inspect_id = req.body.led_inspect_id
  var no = req.body.no
  var version = req.body.version
  var cust_code = req.body.cust_code
  var firstName = req.body.firstName
  var lastName = req.body.lastName
  var memo = req.body.memo

  var status = req.body.status
  var led_code = req.body.led_code
  var updateBy = req.body.updateBy

  // console.log("inspHistory API " + _key)
  logger.info(`updateInspCust API/ `);

  updateInspCust(led_inspect_id,no,version,cust_code,firstName,lastName,memo,status,led_code,updateBy)
  .then(result=>{
    res.status(200).json({
      message: "Successfully!",
      result: result
    });
  },err=>{
    res.status(400).json({
      message: err
    });
  });

}


exports.getInspResource = (req, res, next) => {
  var _key = req.query.key;

  logger.info(`getInspResource API/ `);

  getInspResource(_key)
  .then(result=>{
    res.status(200).json({
      message: "Successfully!",
      result: result
    });
  },err=>{
    res.status(400).json({
      message: err
    });
  });
}

exports.cntInspToday = (req, res, next) => {
  logger.info(`cntInspToday API/ `);

  cntInspToday()
  .then(result=>{
    res.status(200).json({
      key:"TODAY",
      message: "Successfully!",
      result: result[0].CNT
    });
  },err=>{
    res.status(400).json({
      message: err
    });
  });
}


exports.cntOnInspection = (req, res, next) => {

  logger.info(`cntOnInspection API/ `);
  cntOnInspection()
  .then(result=>{
    res.status(200).json({
      key:"INSP",
      message: "Successfully!",
      result: result[0].CNT
    });
  },err=>{
    res.status(400).json({
      message: err
    });
  });
}


exports.cntOnFreeze = (req, res, next) => {

  logger.info(`cntOnFreeze API/ `);
  cntOnFreeze()
  .then(result=>{
    res.status(200).json({
      key:"FREEZE",
      message: "Successfully!",
      result: result[0].CNT
    });
  },err=>{
    res.status(400).json({
      message: err
    });
  });
}

exports.cntByDate = (req, res, next) => {

  logger.info(`cntByDate API/ `);

  cntByDate(req)
  .then(result=>{
    res.status(200).json({
      message: "Successfully!",
      result: result[0]
    });
  },err=>{
    res.status(400).json({
      message: err
    });
  });
}

// **** FUNCTION HERE
  function searchInspCust(whereCond,page,numPerPage){
    // console.log( ' fnc searchInspCust() whereCond='+whereCond);
      var queryStr = `


      BEGIN
        SELECT b.keyText AS led_code_text, TBL.* FROM (
          SELECT ROW_NUMBER() OVER(ORDER BY led_inspect_id) AS NUMBER,
            * FROM [MIT_LED_INSP_CUST]
              WHERE ${whereCond}
        ) AS TBL
        left join MIT_CODE_LOOKUP b ON b.keyname='LEDCODE' AND b.keycode=TBL.led_code
      WHERE NUMBER BETWEEN ((${page} - 1) * ${numPerPage} + 1) AND (${page} * ${numPerPage})
        ORDER BY Cust_Code
      END

      `;

    return new Promise(function(resolve, reject) {

        const sql = require('mssql')
        const pool1 = new sql.ConnectionPool(config, err => {
          pool1.request() // or: new sql.Request(pool1)
          // .input('whereCond', sql.VarChar(100), led_inspect_id)
          // .input('page', sql.VarChar(50), cust_code)
          // .input('numPerPage', sql.Int, parseInt(twsid))
          .query(queryStr, (err, result) => {
              if(err){
                reject(err);
              }else {
                resolve(result.recordset);
              }
          })
        })
        pool1.on('error', err => {
          reject(err);
        })

    })
  }

  function searchLedMaster(whereCond,page,numPerPage){

    logger.info(' fnc searchLedMaster() whereCond='+whereCond);

      var queryStr = `
      BEGIN
      SELECT TBL.*,B.led_inspect_id FROM (
        SELECT ROW_NUMBER() OVER(ORDER BY twsid) AS NUMBER,
           * FROM [MIT_LED_DB_MASTER]
            WHERE ${whereCond}
      ) AS TBL
      left join MIT_LED_INSP_CUST B ON  B.twsid = TBL.twsid
       WHERE NUMBER BETWEEN ((${page} - 1) * ${numPerPage} + 1) AND (${page} * ${numPerPage})
       ORDER BY TBL.twsid
END
      `;

    return new Promise(function(resolve, reject) {

        const sql = require('mssql')
        const pool1 = new sql.ConnectionPool(config, err => {
          pool1.request() // or: new sql.Request(pool1)
          // .input('whereCond', sql.VarChar(100), led_inspect_id)
          // .input('page', sql.VarChar(50), cust_code)
          // .input('numPerPage', sql.Int, parseInt(twsid))
          .query(queryStr, (err, result) => {
              if(err){
                reject(err);
              }else {
                resolve(result.recordset);
              }
          })
        })
        pool1.on('error', err => {
          reject(err);
        })

    })
  }



// function compareLED_2(_ledData,_custData){
  exports.compareLED_2 = function(_ledData,_custData) {

  const finalarray =[];
  return new Promise(function(resolve, reject) {

        for (var i = 0; i < _ledData.length; i++){
          // console.log( 'LED>>' +_ledData[i].Cust_Code)
          for (var j = 0; j < _custData.length; j++){

            // console.log("COMP>> " +_ledData[i].Cust_Code + "  & " +_custData[j].Cust_Code);
              if (_ledData[i].Cust_Code === _custData[j].Cust_Code){
                console.log("_custData>>" + JSON.stringify(_custData[j]))
                finalarray.push('{"twsid":"' +_ledData[i].twsid + '","LED_CUST_CODE":"' + _ledData[i].Cust_Code + '","MPAM_CUST_CODE":"' + _custData[j].Cust_Code + '","firstName":"'+_custData[j].First_Name_T+'" ,"lastName":"'+_custData[j].Last_Name_T+'"}');
              }
          }
        }
        resolve(finalarray);
    });
}

// function insertLEDInspect(inspectData,cust_source,_createBy){
exports.insertLEDInspect =function (inspectData,cust_source,_createBy){

  return new Promise(function(resolve, reject) {

    if(inspectData.length == 0){
      resolve("0")
    }

    for (var i = 0; i < inspectData.length; i++){
      _obj = JSON.parse(inspectData[i]);

        insertInspCust(_obj.MPAM_CUST_CODE,_obj.twsid,cust_source,_obj.firstName,_obj.lastName,LED_INSP_STATUS,LED_INSP_LED_CODE,_createBy).then(result => {
          resolve(result);
        },err=>{
          reject(err)
        })
    }
  })
}

function insertInspCust(cust_code,twsid,cust_source,firstName,lastName,status,led_code,createBy){
  // console.log("led_code>>" + led_code + "  createBy>>" +createBy );
  return new Promise(function(resolve, reject) {
    genInspectId(twsid)
    .then(led_inspect_id=>{

      var queryStr = `
      BEGIN

        DECLARE @NO int;

        select @NO = count(1) +1
        from MIT_LED_INSP_CUST
        where led_inspect_id= @led_inspect_id
        and version=@version

        INSERT INTO MIT_LED_INSP_CUST
        (led_inspect_id,NO,version, Cust_Code, twsid, cust_source,firstName,lastName, status, led_code, createBy , createDate )
        VALUES
        (@led_inspect_id,@NO,@version, @Cust_Code, @twsid, @cust_source,@firstName,@lastName, @status, @led_code, @createBy, GETDATE())
      END
      `;

      const sql = require('mssql')
      const pool1 = new sql.ConnectionPool(config, err => {
        pool1.request() // or: new sql.Request(pool1)
        .input('led_inspect_id', sql.VarChar(100), led_inspect_id)
        .input('version', sql.Int, 1)
        .input('Cust_Code', sql.VarChar(50), cust_code)
        .input('twsid', sql.Int, parseInt(twsid))
        .input('cust_source', sql.VarChar(50), cust_source)
        .input('firstName', sql.NVarChar(50), firstName)
        .input('lastName', sql.NVarChar(50), lastName)
        .input('status', sql.Bit, status)
        .input('led_code', sql.VarChar(5), led_code)
        .input('createBy', sql.VarChar(50), createBy)
        .query(queryStr, (err, result) => {
            if(err){
              reject(err);
            }else {
              resolve(result.recordset);
            }
        })
      })
      pool1.on('error', err => {
        reject(err);
      })
    })
  })
}


function swapLEDDialyToMaster(){

  return new Promise(function(resolve, reject) {

      var queryStr = `


      BEGIN TRY

      BEGIN TRANSACTION

        INSERT INTO MIT_LED_DB_MASTER ([twsid]
          ,[black_case]
          ,[black_yy]
          ,[red_case]
          ,[red_yy]
          ,[court_name]
          ,[plaintiff1]
          ,[df_id]
          ,[df_name]
          ,[df_surname]
          ,[tmp_prot_dd]
          ,[tmp_prot_mm]
          ,[tmp_prot_yy]
          ,[abs_prot_dd]
          ,[abs_prot_mm]
          ,[abs_prot_yy]
          ,[df_manage_dd]
          ,[df_manage_mm]
          ,[df_manage_yy]
          ,[bkr_prot_dd]
          ,[bkr_prot_mm]
          ,[bkr_prot_yy]
          ,[statusdf]
          ,[createBy]
          ,[createDate]
          ,[ledStatus])
      SELECT twsid,black_case
          ,[black_yy]
          ,[red_case]
          ,[red_yy]
          ,[court_name]
          ,[plaintiff1]
          ,[df_id]
          ,[df_name]
          ,[df_surname]
          ,[tmp_prot_dd]
          ,[tmp_prot_mm]
          ,[tmp_prot_yy]
          ,[abs_prot_dd]
          ,[abs_prot_mm]
          ,[abs_prot_yy]
          ,[df_manage_dd]
          ,[df_manage_mm]
          ,[df_manage_yy]
          ,[bkr_prot_dd]
          ,[bkr_prot_mm]
          ,[bkr_prot_yy]
          ,[statusdf]
          ,[createBy]
          ,[createDate]
          ,[ledStatus]
      FROM MIT_LED_DB_DIALY

      DELETE FROM MIT_LED_DB_DIALY

      COMMIT
    END TRY

    BEGIN CATCH
        ROLLBACK
    END CATCH


      `;

      const sql = require('mssql')
      const pool1 = new sql.ConnectionPool(config, err => {
        pool1.request() // or: new sql.Request(pool1)
        .query(queryStr, (err, result) => {
            if(err){
              console.log("SWAP was error>>" +err)
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

function genInspectId(twsid){

  return new Promise(function(resolve, reject) {
    resolve(twsid);
  })
}
// function genInspectId(cust_code){
//   var today = new Date();
// var dateStr = today.getFullYear()+''+(today.getMonth()+1)+''+today.getDate()+'-';

//   return new Promise(function(resolve, reject) {
//     let led_inspect_id = dateStr+ cust_code;
//     resolve(led_inspect_id);
//   })
// }


// function getSWANCustomers(){
  exports.getSWANCustomers = function() {

  logger.info(`Welcome getSWANCustomers() `);

  const connection = mysql.createConnection(swan_config);
  connection.connect(function(err) {
  if(err) {
    console.log('error')
  } else {
    console.log('SWAN-Connected');
  }
  });

  return new Promise(function(resolve, reject) {
    var allData=[];
    var query = connection.query('SELECT AlienNo AS Cust_Code,ThaiName AS First_Name_T,ThaiSurname AS Last_Name_T from external_fireSwan.investor_profile');
    query
      .on('error', function(err) {
        // Handle error, an 'end' event will be emitted after this as well
        reject(err);
      })
      .on('fields', function(fields) {
        // the field packets for the rows to follow
      })
      .on('result', function(row) {
        // Pausing the connnection is useful if your processing involves I/O
        connection.pause();
        // console.log(row);
        allData.push(row);
        connection.resume();

      })
      .on('end', function() {
        // all rows have been received
        // res.status(200).json({ message: allData });
        resolve(allData);
      });
  });
}


// function getMFTSCustomers(){
  exports.getMFTSCustomers = function() {

  logger.info(`Welcome getMFTSCustomers() `);

  return new Promise(function(resolve, reject) {
    var queryStr = `SELECT Cust_Code,First_Name_T,Last_Name_T FROM Account_Info`;

    const sql = require('mssql')
    const pool1 = new sql.ConnectionPool(config, err => {
      pool1.request() // or: new sql.Request(pool1)
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


function getLEDMaster(){

  logger.info(`Welcome getLEDMaster() `);

  return new Promise(function(resolve, reject) {
    // var queryStr = `SELECT * FROM MIT_LED_MASTER`;
    var queryStr = `SELECT twsid AS twsid,df_id AS Cust_Code,df_name AS First_Name_T,df_surname AS Last_Name_T FROM MIT_LED_DB_MASTER`;

    const sql = require('mssql')
    const pool1 = new sql.ConnectionPool(config, err => {
      pool1.request() // or: new sql.Request(pool1)
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


function getLED_Dialy(){

  logger.info(`Welcome getLED_Dialy() `);

  return new Promise(function(resolve, reject) {
    // var queryStr = `SELECT * FROM MIT_LED_MASTER`;
    var queryStr = `SELECT twsid AS twsid,df_id AS Cust_Code,df_name AS First_Name_T,df_surname AS Last_Name_T FROM MIT_LED_DB_DIALY`;

    const sql = require('mssql')
    const pool1 = new sql.ConnectionPool(config, err => {
      pool1.request() // or: new sql.Request(pool1)
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


function getLEDMasterBykey(key){

  logger.info(`Welcome getLEDMasterBykey() `);

  return new Promise(function(resolve, reject) {
    // var queryStr = `SELECT * FROM MIT_LED_MASTER`;
    var queryStr = `
    BEGIN
      SELECT * FROM MIT_LED_DB_MASTER WHERE twsid=@twsid
    END
    `;

    const sql = require('mssql')
    const pool1 = new sql.ConnectionPool(config, err => {
      pool1.request() // or: new sql.Request(pool1)
      .input('twsid', sql.Int, parseInt(key))
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


function getInspByKey(key){

  logger.info(`Welcome getInspBykey() `);

  return new Promise(function(resolve, reject) {
    // var queryStr = `SELECT * FROM MIT_LED_MASTER`;
    var queryStr = `
    BEGIN

    DECLARE @REQ_KEY VARCHAR(50);
    DECLARE @ReceiverBreezeDate DATETIME
    DECLARE @twsid VARCHAR(50);

    SELECT @twsid = a.twsid
    FROM MIT_LED_INSP_CUST a
    where a.led_inspect_id=@key

    SELECT top 1 @REQ_KEY=x.REQ_KEY,@ReceiverBreezeDate=ReceiverBreezeDate
    FROM MIT_LED_DB_MASTER x
    WHERE twsid=@twsid

    SELECT @REQ_KEY AS REQ_KEY,@ReceiverBreezeDate AS ReceiverBreezeDate,b.keyText as led_code_text, a.*
    FROM MIT_LED_INSP_CUST a
    LEFT JOIN MIT_CODE_LOOKUP b on  b.keyname='LEDCODE' and b.keycode = a.led_code
    where a.led_inspect_id=@key

    END
    `;

    const sql = require('mssql')
    const pool1 = new sql.ConnectionPool(config, err => {
      pool1.request() // or: new sql.Request(pool1)
      .input('key', sql.VarChar, key)
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


function getInspByCustCode(custCode){

  logger.info(`Welcome getInspBykey() `);

  return new Promise(function(resolve, reject) {
    // var queryStr = `SELECT * FROM MIT_LED_MASTER`;
    var queryStr = `
    BEGIN

      SELECT b.keyText as led_code_text, a.*
      FROM MIT_LED_INSP_CUST a
      LEFT JOIN MIT_CODE_LOOKUP b on  b.keyname='LEDCODE' and b.keycode = a.led_code
      where a.Cust_Code= @Cust_Code

    END
    `;
    const sql = require('mssql')
    const pool1 = new sql.ConnectionPool(config, err => {
      pool1.request() // or: new sql.Request(pool1)
      .input('Cust_Code', sql.VarChar, custCode)
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

function getInspByGroupId(grpId){

  logger.info(`Welcome getInspBykey() `);

  return new Promise(function(resolve, reject) {
    // var queryStr = `SELECT * FROM MIT_LED_MASTER`;
    var queryStr = `
    BEGIN

      SELECT b.keyText as led_code_text, a.*
      FROM MIT_LED_INSP_CUST a
      LEFT JOIN MIT_CODE_LOOKUP b on  b.keyname='LEDCODE' and b.keycode = a.led_code
      where a.grpid=@grpid

    END
    `;

    const sql = require('mssql')
    const pool1 = new sql.ConnectionPool(config, err => {
      pool1.request() // or: new sql.Request(pool1)
      .input('grpid', sql.VarChar, grpId)
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


function getInspHistory(led_inspect_id){

  logger.info(`Welcome getInspHistory() `);

  return new Promise(function(resolve, reject) {
    // var queryStr = `SELECT * FROM MIT_LED_MASTER`;
    var queryStr = `
    BEGIN
      SELECT * FROM MIT_LED_INSP_HISTORY
      WHERE led_inspect_id=@led_inspect_id
      AND [status]=1
      ORDER BY createDate desc
    END
    `;

    const sql = require('mssql')
    const pool1 = new sql.ConnectionPool(config, err => {
      pool1.request() // or: new sql.Request(pool1)
      .input('led_inspect_id', sql.VarChar, led_inspect_id)
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




function getAddInspHistory(led_inspect_id,version,his_topic,memo,createBy){

  logger.info(`Welcome getAddInspHistory() `);

  return new Promise(function(resolve, reject) {
    // var queryStr = `SELECT * FROM MIT_LED_MASTER`;
    var queryStr = `
    BEGIN

    DECLARE @NO int;

    select @NO = count(1) +1
    from MIT_LED_INSP_HISTORY
    where led_inspect_id= @led_inspect_id
    and version=@version

    INSERT INTO MFTS.dbo.MIT_LED_INSP_HISTORY
    (led_inspect_id, version, [no], memo, status, createBy, createDate)
    VALUES
    (@led_inspect_id, @version, @NO, @memo, 1, @createBy, getDate());

    END
    `;

    const sql = require('mssql')
    const pool1 = new sql.ConnectionPool(config, err => {
      pool1.request() // or: new sql.Request(pool1)
      .input('led_inspect_id', sql.VarChar, led_inspect_id)
      .input('version', sql.VarChar, version)
      .input('memo', sql.NVarChar, memo)
      .input('createBy', sql.NVarChar, createBy)
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


function updateInspCust(led_inspect_id,no,version,cust_code,firstName,lastName,memo,status,led_code,updateBy){

  logger.info(`Welcome updateInspCust() `);

  return new Promise(function(resolve, reject) {
    // var queryStr = `SELECT * FROM MIT_LED_MASTER`;
    var queryStr = `
    BEGIN

    UPDATE MFTS.dbo.MIT_LED_INSP_CUST
    SET cust_code=@cust_code,firstName=@firstName,lastName=@lastName,memo=@memo, status=@status, led_code=@led_code,  updateBy=@updateBy, updateDate= GETDATE()
    WHERE  led_inspect_id=@led_inspect_id
    AND version=@version
    AND no=@no

    END
    `;

    const sql = require('mssql')
    const pool1 = new sql.ConnectionPool(config, err => {
      pool1.request() // or: new sql.Request(pool1)
      .input('led_inspect_id', sql.VarChar, led_inspect_id)
      .input('version', sql.Int, version)
      .input('no', sql.Int, no)
      .input('cust_code', sql.NVarChar, cust_code)
      .input('firstName', sql.NVarChar, firstName)
      .input('lastName', sql.NVarChar, lastName)
      .input('memo', sql.NVarChar, memo)
      .input('status', sql.Bit, status)
      .input('led_code', sql.VarChar, led_code)
      .input('updateBy', sql.VarChar, updateBy)
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

function getInspResource(led_inspect_id){
  // logger.info(`Welcome getInspResource() `);

  return new Promise(function(resolve, reject) {
    // var queryStr = `SELECT * FROM MIT_LED_MASTER`;
    var queryStr = `
    BEGIN
    SELECT * FROM MIT_LED_INSP_RESOURCE
    WHERE led_inspect_id=@led_inspect_id
    END
    `;

    const sql = require('mssql')
    const pool1 = new sql.ConnectionPool(config, err => {
      pool1.request() // or: new sql.Request(pool1)
      .input('led_inspect_id', sql.VarChar, led_inspect_id)
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


function cntInspToday(){
  // logger.info(`Welcome cntInspToday() `);

  return new Promise(function(resolve, reject) {
    // var queryStr = `SELECT * FROM MIT_LED_MASTER`;
    var queryStr = `
    BEGIN
      SELECT count(*) AS CNT
      FROM MIT_LED_INSP_CUST a
      --WHERE led_code IN('001','100')
      WHERE  CONVERT(date,a.createDate)= CONVERT(date, getdate())
    END
    `;

    const sql = require('mssql')
    const pool1 = new sql.ConnectionPool(config, err => {
      pool1.request() // or: new sql.Request(pool1)
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


function cntOnInspection(){
  // logger.info(`Welcome cntOnInspection() `);

  return new Promise(function(resolve, reject) {
    // var queryStr = `SELECT * FROM MIT_LED_MASTER`;
    var queryStr = `
    BEGIN
      SELECT count(*) AS CNT
      FROM MIT_LED_INSP_CUST a
      WHERE led_code IN('001')
    END
    `;

    const sql = require('mssql')
    const pool1 = new sql.ConnectionPool(config, err => {
      pool1.request() // or: new sql.Request(pool1)
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
    })
  });
}


function cntOnFreeze(){
  // logger.info(`Welcome cntOnInspection() `);

  return new Promise(function(resolve, reject) {
    // var queryStr = `SELECT * FROM MIT_LED_MASTER`;
    var queryStr = `
    BEGIN
      SELECT count(*) AS CNT
      FROM MIT_LED_INSP_CUST a
      WHERE led_code IN('100','101','102')
    END
    `;

    const sql = require('mssql')
    const pool1 = new sql.ConnectionPool(config, err => {
      pool1.request() // or: new sql.Request(pool1)
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
    })
  });
}


function cntByDate(req){

  // var _onDate = req.param.onDate;
  var _onDate = req.param('onDate');

  logger.info(`Welcome cntByDate() ${_onDate}` );

  return new Promise(function(resolve, reject) {
    // var queryStr = `SELECT * FROM MIT_LED_MASTER`;
    var queryStr = `
    BEGIN

    DECLARE @CNT_ALL int;
    DECLARE @CNT_INSP int;
    DECLARE @CNT_FREEZE int;
    --DECLARE @ONDATE varchar(30);

      -- Count LED
      SELECT @CNT_ALL = count(*)
      FROM MIT_LED_DB_MASTER a
      --WHERE led_code IN('001','100')
      WHERE  CONVERT(date,a.createDate)= CONVERT(date, @ONDATE)

      -- Inspection
      SELECT @CNT_INSP = count(*)
      FROM MIT_LED_INSP_CUST a
      WHERE led_code IN('001','201')
      AND  CONVERT(date,a.createDate)= CONVERT(date, @ONDATE)

      -- Freeze
      SELECT @CNT_FREEZE = count(*)
      FROM MIT_LED_INSP_CUST a
      WHERE led_code IN('100','101','102')
      AND  CONVERT(date,a.createDate)= CONVERT(date, @ONDATE)

      SELECT @CNT_ALL AS CNT_ALL,@CNT_INSP AS CNT_INSP,@CNT_FREEZE AS CNT_FREEZE
    END
    `;

    const sql = require('mssql')
    const pool1 = new sql.ConnectionPool(config, err => {
      pool1.request() // or: new sql.Request(pool1)
      .input('ONDATE', sql.VarChar(50), _onDate)
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
    })
  });
}

exports.getledMasHis = (req, res, next) => {

  logger.info(`getledMasHis API/ `);
  // var id = req.query.id || false;
  var _id = req.param('id');

  //Call Query
  getledMasHis(_id).then(result =>{
    res.status(200).json({
      message: "Successfully!",
      result: result
    });

  },err=>{
    res.status(400).json({
      message: err
    });

  })
}

exports.createLedMasHis = (req, res, next) => {

  logger.info(`createLedMasHis API/ `);

  const url = req.protocol +"://"+ req.get("host");

  // var id = req.query.id || false;
  var _id = req.param('id');
  var led_state = req.body.led_state;
  var memo = req.body.memo;

  var resourceRef = '' ;

  if(req.file)
    resourceRef = url+"/downloadFiles/files/" + req.file.filename;

  var status = req.body.status;
  var createBy = req.body.createBy;

  //Call Query
  createLedMasHis(_id,led_state,memo,resourceRef,status,createBy).then(result =>{

    // console.log("Result >>" + JSON.stringify(result))

    res.status(200).json({
      message: "Successfully!",
      result: result
    });

  },err=>{
    res.status(400).json({
      message: err
    });

  })
}

exports.updateLedMasHis = (req, res, next) => {

  logger.info(`updateLedMasHis API/ `);

  let _resourceRef = req.body.resourceRef;
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    _resourceRef = url+"/downloadFiles/files/" + req.file.filename;
  }

  // var id = req.query.id || false;
  var _id = req.param('id');
  // var _id = req.body.id;
  var no = req.body.no;
  var led_state = req.body.led_state;
  var memo = req.body.memo;
  // var resourceRef = _resourceRef;
  var status = req.body.status;
  var updateBy = req.body.updateBy;

  //Call Query
  updateLedMasHis(_id,no,led_state,memo,_resourceRef,status,updateBy).then(result =>{

    res.status(200).json({
      message: "Successfully!",
      result: result
    });

  },err=>{
    res.status(400).json({
      message: err
    });

  })
}

function getledMasHis(id){

  logger.info(`Welcome getledMasHis() ${id}` );

  return new Promise(function(resolve, reject) {
    // var queryStr = `SELECT * FROM MIT_LED_MASTER`;
    var queryStr = `
    BEGIN

    SELECT B.keyText AS led_state_txt,A.*
    from MIT_LED_DB_MASTER_HIS A
    LEFT join MIT_CODE_LOOKUP B ON B.keyname='LEDCODE' AND B.keycode=A.led_state
    where twsid= @twsid
    ORDER  BY A.[no] ASC

    END
    `;

    const sql = require('mssql')
    const pool1 = new sql.ConnectionPool(config, err => {
      pool1.request() // or: new sql.Request(pool1)
      .input('twsid', sql.VarChar, id)
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
    })
  });
}


function createLedMasHis(id,led_state,memo,resourceRef,status,createBy){
  logger.info(`Welcome createLedMasHis() ${id}` );

  return new Promise(function(resolve, reject) {
    // var queryStr = `SELECT * FROM MIT_LED_MASTER`;
    var queryStr = `
    BEGIN

      DECLARE @no int;

      SELECT @no =count(twsid)+1 from MIT_LED_DB_MASTER_HIS where twsid=@twsid

      INSERT INTO MIT_LED_DB_MASTER_HIS
      (twsid,no,led_state,memo,status,resourceRef,createBy,createDate)
      VALUES (@twsid,@no,@led_state,@memo,@status,@resourceRef,@createBy,getdate())

    END
    `;

    const sql = require('mssql')
    const pool1 = new sql.ConnectionPool(config, err => {
      pool1.request() // or: new sql.Request(pool1)
      .input('twsid', sql.VarChar, id)
      .input('led_state', sql.VarChar, led_state)
      .input('memo', sql.NVarChar, memo)
      .input('status', sql.Bit, status)
      .input('resourceRef', sql.NVarChar, resourceRef)
      .input('createBy', sql.VarChar, createBy)
      .query(queryStr, (err, result) => {
          // ... error checks
          if(err){
            reject(err);
          }else {

            console.log("Result >>" + JSON.stringify(result))

            resolve(result.recordset);
          }
      })
    })
    pool1.on('error', err => {
      reject(err);
    })
  });
}

function updateLedMasHis(id,no,led_state,memo,resourceRef,status,updateBy){
  logger.info(`Welcome updateLedMasHis() ${id}; ${no} ` );

  return new Promise(function(resolve, reject) {
    var queryStr = `
    BEGIN

      UPDATE MIT_LED_DB_MASTER_HIS
      SET led_state=@led_state,memo=@memo,status=@status,resourceRef=@resourceRef,updateBy=@updateBy,updateDate=getdate()
      WHERE twsid = @twsid AND [no]=@no

    END
    `;
    const sql = require('mssql')
    const pool1 = new sql.ConnectionPool(config, err => {
      pool1.request() // or: new sql.Request(pool1)
      .input('twsid', sql.VarChar, id)
      .input('no', sql.Int, parseInt(no))
      .input('led_state', sql.VarChar, led_state)
      .input('memo', sql.NVarChar, memo)
      .input('status', sql.Bit, status)
      .input('resourceRef', sql.NVarChar, resourceRef)
      .input('updateBy', sql.VarChar, updateBy)
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
    })
  });
}
