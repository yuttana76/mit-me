
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
        table.columns.add('createBy ', sql.VarChar(20), { nullable: true });
        table.columns.add('createDate ', sql.Date, { nullable: true });
        table.columns.add('updateBy ', sql.VarChar(20), { nullable: true });
        table.columns.add('updateDate ', sql.Date, { nullable: true });
        table.columns.add('ledStatus ', sql.Char(2), { nullable: true });

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
      getSWANCustomers().catch(err => { res.status(401).json({ message: 'Error getSWANCustomers()'+err }); }),
      getMFTSCustomers().catch(err => { res.status(401).json({ message: 'Error getMFTSCustomers()'+err }); }),
      getLED_Dialy().catch(err => { res.status(401).json({ message: 'Error getLED_Dialy()' +err }); }),
      ]).then(values => {

        //index 0: is SWAN
        //index 1: is MFTS
        //index 2: is LED
        // Cleaning db. 2
        Promise.all([
          compareLED_2(values[2],values[0]).catch(err => { res.status(401).json({ message: 'Error Compare LED & SWAN >>'+err }); }),
          compareLED_2(values[2],values[1]).catch(err => { res.status(401).json({ message: 'Error Compare LED & MFTS >>'+err }); }),
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

// **** Functions

function compareLED_2(_ledData,_custData){

  const finalarray =[];
  return new Promise(function(resolve, reject) {

        for (var i = 0; i < _ledData.length; i++){
          // console.log( 'LED>>' +_ledData[i].Cust_Code)
          for (var j = 0; j < _custData.length; j++){
              if (_ledData[i].Cust_Code === _custData[j].Cust_Code){
                finalarray.push('{"twsid":"' +_ledData[i].twsid + '","LED_CUST_CODE":"' + _ledData[i].Cust_Code + '","MPAM_CUST_CODE":"' + _custData[j].Cust_Code + '"}');
              }
          }
        }
        resolve(finalarray);
    });
}

function insertLEDInspect(inspectData,cust_source,_createBy){


  return new Promise(function(resolve, reject) {

    for (var i = 0; i < inspectData.length; i++){
      _obj = JSON.parse(inspectData[i]);
// console.log(cust_source +" ;twsid:"+_obj.twsid +" ;LED_CUST_CODE:"+_obj.LED_CUST_CODE  +" ;MPAM_CUST_CODE:"+_obj.MPAM_CUST_CODE  );

        insertData(_obj.MPAM_CUST_CODE,_obj.twsid,cust_source,LED_INSP_STATUS,LED_INSP_LED_CODE,_createBy).then(result => {
          resolve('Insert Inspect success');
        })
    }
  })
}

function insertData(cust_code,twsid,cust_source,status,led_code,createBy){
  console.log("led_code>>" + led_code + "  createBy>>" +createBy );

  return new Promise(function(resolve, reject) {
    genInspectId(cust_code)
    .then(led_inspect_id=>{

      var queryStr = `
      BEGIN
        INSERT INTO MIT_LED_INSP_CUST
        (led_inspect_id, Cust_Code, twsid, cust_source, status, led_code, createBy , createDate )
        VALUES
        (@led_inspect_id, @Cust_Code, @twsid, @cust_source, @status, @led_code, @createBy, GETDATE())
      END
      `;

      const sql = require('mssql')
      const pool1 = new sql.ConnectionPool(config, err => {
        pool1.request() // or: new sql.Request(pool1)
        .input('led_inspect_id', sql.VarChar(100), led_inspect_id)
        .input('Cust_Code', sql.VarChar(50), cust_code)
        .input('twsid', sql.Int, parseInt(twsid))
        .input('cust_source', sql.VarChar(50), cust_source)
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
          ,[court_name ]
          ,[plaintiff1 ]
          ,[df_id ]
          ,[df_name ]
          ,[df_surname ]
          ,[tmp_prot_dd ]
          ,[tmp_prot_mm ]
          ,[tmp_prot_yy ]
          ,[abs_prot_dd ]
          ,[abs_prot_mm ]
          ,[abs_prot_yy ]
          ,[df_manage_dd ]
          ,[df_manage_mm ]
          ,[df_manage_yy ]
          ,[bkr_prot_dd ]
          ,[bkr_prot_mm ]
          ,[bkr_prot_yy ]
          ,[statusdf ]
          ,[createBy ]
          ,[createDate ]
          ,[ledStatus ])
      SELECT twsid,black_case
          ,[black_yy]
          ,[red_case]
          ,[red_yy]
          ,[court_name ]
          ,[plaintiff1 ]
          ,[df_id ]
          ,[df_name ]
          ,[df_surname ]
          ,[tmp_prot_dd ]
          ,[tmp_prot_mm ]
          ,[tmp_prot_yy ]
          ,[abs_prot_dd ]
          ,[abs_prot_mm ]
          ,[abs_prot_yy ]
          ,[df_manage_dd ]
          ,[df_manage_mm ]
          ,[df_manage_yy ]
          ,[bkr_prot_dd ]
          ,[bkr_prot_mm ]
          ,[bkr_prot_yy ]
          ,[statusdf ]
          ,[createBy ]
          ,[createDate ]
          ,[ledStatus ]
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

function genInspectId(cust_code){
  var today = new Date();
var dateStr = today.getFullYear()+''+(today.getMonth()+1)+''+today.getDate()+'-';

  return new Promise(function(resolve, reject) {
    let led_inspect_id = dateStr+ cust_code;
    resolve(led_inspect_id);
  })
}


function getSWANCustomers(){

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


function getMFTSCustomers(){
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


function getLED_Master(){

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

  logger.info(`Welcome getLEDMaster() `);

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
