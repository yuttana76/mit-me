
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
var msdb = require("../config/msdb");

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

let mftsCust =[];
let swanCust =[];
let ledMaster =[];

exports.checkCustAll = (req, res, next) => {
    logger.info(`API /api/led/checkCustAll - ${req.originalUrl} - ${req.ip} `);


    //Get SWAN customer
    // getSWANCustomers()
    // .then((data)=>{
    //   console.log('getSWANCustomers()>>' + data.length);
    //   res.status(200).json({record: data.length , data: data });
    // }
    // ,(err)=>{
    //   res.status(401).json({ message: err });
    // });

    // getMFTSCustomers()
    // .then((data)=>{
    //   console.log('getMFTSCustomers()>>' + data.length);
    //   res.status(200).json({record: data.length , data: data });
    // }
    // ,(err)=>{
    //   res.status(401).json({ message: err });
    // });


Promise.all([
  getSWANCustomers().catch(err => { res.status(401).json({ message: 'getSWANCustomers()'+err }); }),
  getMFTSCustomers().catch(err => { res.status(401).json({ message: 'getMFTSCustomers()'+err }); }),
  getLEDMaster().catch(err => { res.status(401).json({ message: 'getLEDMaster()' +err }); }),
  ]).then(values => {
    // swanCust = values[0];
    // mftsCust = values[1];
    // ledMaster = values[2];

    // console.log("swanCust=" + swanCust.length  );
    // console.log("mftsCust=" + mftsCust.length  );
    // console.log("ledMaster=" + ledMaster.length  );

    // res.status(200).json({record: swanCust.length + mftsCust.length  , message: 'API successful' });

    console.log("values 1 =" + values[0].length  );
    console.log("values 2 =" + values[1].length  );
    console.log("values 3 =" + values[2].length  );
    res.status(200).json({ message: 'API successful' });
});


}


exports.checkCustByID = (req, res, next) => {
    logger.info(`API /api/led/checkCustByID - ${req.originalUrl} - ${req.ip} `);

    // getSWANCustomer().then((data)=>{

    //   res.status(200).json({record: data.length , data: data });
    // }
    // ,(err)=>{
    //   res.status(401).json({ message: err });
    // });

    res.status(200).json({message: 'API successful' });

}

// **** Functions
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


function getLEDMaster(){

  logger.info(`Welcome getLEDMaster() `);

  return new Promise(function(resolve, reject) {
    var queryStr = `SELECT * FROM MIT_LED_MASTER`;
    // var queryStr = `SELECT twsid,df_id,df_name,df_surname FROM MIT_LED_MASTER`;

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


// function getMFTSCustomers(){

//   logger.info(`Welcome getMFTSCustomers() `);

//   return new Promise(function(resolve, reject) {
//     var allData=[];

//     const sql = require('mssql')
//     const mftsQuery ='SELECT Cust_Code,First_Name_T,Last_Name_T FROM Account_Info';

//       sql.connect(config, err => {
//           // ... error checks
//           if(err){
//             reject(err);
//           }

//           const request = new sql.Request()
//           request.stream = true // You can set streaming differently for each request
//           request.query(mftsQuery) // or request.execute(procedure)

//           request.on('recordset', columns => {
//               // Emitted once for each recordset in a query
//           })

//           request.on('row', row => {
//               // Emitted for each row in a recordset
//               //  request.pause();
//               // console.log(row);
//               allData.push(row);
//               // request.resume();

//           })

//           request.on('error', err => {
//               // May be emitted multiple times
//               console.log('SQL closed.');
//               sql.close();
//               reject(err);
//           })

//           request.on('done', result => {
//               // Always emitted as the last one
//               console.log('SQL closed.');
//               sql.close();
//               resolve(allData);
//           })
//       })

//       sql.on('error', err => {
//           // ... error handler
//           console.log('SQL closed.');
//           sql.close();
//           reject(err);
//       })

//   });
// }


// function getLEDMaster(){

//   logger.info(`Welcome getLEDMaster() `);

//   return new Promise(function(resolve, reject) {
//     var allData=[];

//     const sql = require('mssql')

//     const mftsQuery ='SELECT twsid,df_id,df_name,df_surname FROM MIT_LED_MASTER ';

//       sql.connect(config, err => {
//           // ... error checks
//           if(err){
//             reject(err);
//           }

//           const request = new sql.Request()
//           request.stream = true // You can set streaming differently for each request
//           request.query(mftsQuery) // or request.execute(procedure)

//           request.on('recordset', columns => {
//               // Emitted once for each recordset in a query
//           })

//           request.on('row', row => {
//               // Emitted for each row in a recordset
//               //  request.pause();
//               // console.log(row);
//               allData.push(row);
//               // request.resume();

//           })

//           request.on('error', err => {
//               // May be emitted multiple times
//               console.log('SQL closed.');
//               sql.close();

//               reject(err);
//           })

//           request.on('done', result => {
//               // Always emitted as the last one
//               console.log('SQL closed.');
//               sql.close();

//               resolve(allData);
//           })
//       })

//       sql.on('error', err => {
//           // ... error handler
//           console.log('SQL closed.');
//           sql.close();

//           reject(err);
//       })

//   });
// }

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



function insertCustInspect(_pid,_ledKey) {

  console.log(`insertCustInspect _pid=$_pid ; _ledKey=$_ledKey`  );
  var fncName = "insertCustInspect";
  var queryStr = `
  BEGIN


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
