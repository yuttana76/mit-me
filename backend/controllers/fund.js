const dbConfig = require('../config/db-config');
var AdmZip = require('adm-zip');
var config = dbConfig.dbParameters;
var fs = require('fs');

exports.getFunds = (req, res, next) => {

  console.log('Welcome getFunds()');

  var fncName = 'getFunds()';

  var queryStr = `SELECT * FROM [MFTS_Fund]
  WHERE CURRENT_TIMESTAMP < ISNULL(End_Date,CURRENT_TIMESTAMP+1)
  ORDER  BY Amc_Id ,Thai_Name`;

  const sql = require('mssql')
  const pool1 = new sql.ConnectionPool(config, err => {
    pool1.request() // or: new sql.Request(pool1)
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
    console.log("EROR>>"+err);
  })
}

exports.getFundsByAMC = (req, res, next) => {

  console.log('Welcome getFundsByAMC()');

  var fncName = 'getFunds()';
  var amcCode = req.query.amcCode || '';

  if (amcCode != ''){
    whereCond = whereCond + ` AND Amc_Id= ${amcCode} `
  }

  var queryStr = `SELECT * FROM [MFTS_Fund]
  WHERE CURRENT_TIMESTAMP < ISNULL(End_Date,CURRENT_TIMESTAMP+1) ${whereCond}
  ORDER  BY Amc_Id ,Thai_Name
   `;

  const sql = require('mssql')
  const pool1 = new sql.ConnectionPool(config, err => {
    pool1.request() // or: new sql.Request(pool1)
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
    console.log("EROR>>"+err);
  })
}

exports.getFundByCode = (req, res, next) => {

  console.log('Welcome getFundByCode()');

  var fncName = 'getFundByCode()';
  var _fundCode = req.params.code;
  var queryStr = `select * FROM [MFTS_Fund] WHERE Fund_Code ='${_fundCode}'`;

  const sql = require('mssql')
  const pool1 = new sql.ConnectionPool(config, err => {
    pool1.request() // or: new sql.Request(pool1)
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



// exports.getFundByCode = (req, res, next) => {

//   var _fundCode = req.params.code;
//   var queryStr = `select * FROM [MFTS].[dbo].[MFTS_Fund] WHERE Fund_Code ='${_fundCode}'`;

//   var sql = require("mssql");
//   sql.connect(config, err => {
//     // Callbacks
//     new sql.Request().query(queryStr, (err, result) => {
//       // ... error checks
//         if(err){
//           console.log('Was err !!!' + err);
//           res.status(201).json({
//             message: err,
//           });
//           sql.close();
//         }else{
//           res.status(200).json({
//             message: "Connex  successfully!",
//             result: result.recordset

//           });
//           sql.close();
//         }
//     })
//   });

//   sql.on("error", err => {
//     // ... error handler
//     console.log('sql.on !!!' + err);
//     sql.close();
//   });
// }

exports.getFundsXX = (req, res, next) => {

  // const pageSize = +req.query.pageSize;
  // const currentPage = +req.query.page;
  console.log('Welome getFundsXX ');
    var numRows;
    var queryPagination;
    var numPerPage = parseInt(req.query.pageSize, 10) || 1;
    var page = parseInt(req.query.page, 10) || 0;
    console.log('numPerPage>'+numPerPage + ';page>' + page);

    var numPages;
    var skip = page * numPerPage;
    // Here we compute the LIMIT parameter for MySQL query
    var limit = skip + ',' + skip + numPerPage;
    queryAsync('SELECT count(*) as numRows FROM [MFTS].[dbo].[MFTS_Fund]')
    .then(function(results) {
      numRows = results[0].numRows;
      numPages = Math.ceil(numRows / numPerPage);
      console.log('number of pages:', numPages);
    })
    .then(() => queryAsync(`
    SELECT * FROM (
                 SELECT ROW_NUMBER() OVER(ORDER BY Cust_Code) AS NUMBER,
                        * FROM [MFTS].[dbo].[Account_Info]
                   ) AS TBL
    WHERE NUMBER BETWEEN ((${numPages} - 1) * ${numRows} + 1) AND (${numPages} * ${numRows})
    ORDER BY Cust_Code`))
    .then(function(results) {
      var responsePayload = {
        results: results
      };
      if (page < numPages) {
        responsePayload.pagination = {
          current: page,
          perPage: numPerPage,
          previous: page > 0 ? page - 1 : undefined,
          next: page < numPages - 1 ? page + 1 : undefined
        }
      }
      else responsePayload.pagination = {
        err: 'queried page ' + page + ' is >= to maximum page number ' + numPages
      }
      res.json(responsePayload);
    })
    .catch(function(err) {
      console.error(err);
      res.json({ err: err });
    });
}


exports.UploadFoundNAV = (req, res, next) => {

  console.log("Welcome UploadFoundNAV");

  var DOWNLOAD_DIR = './backend/downloadFiles/';
  var fileName = req.params.fineName;
  var textfile_name = 'NAV.txt';

  try{

    console.log("File path >>"+ DOWNLOAD_DIR + fileName);

    var zip = new AdmZip(DOWNLOAD_DIR + fileName);
    console.log("STEP 1");
    zip.extractAllTo(/*target path*/DOWNLOAD_DIR, /*overwrite*/true);
    console.log("STEP 2");

    fs.readFile(DOWNLOAD_DIR + textfile_name, function(err, data) {

      console.log("STEP 3");
      if(err) {
        res.status(422).json({
          code: 402,
          message: err
        });
      }

      var array = data.toString().split("\n");
      var attr = array[0].split("|") ;
      // console.log('Record data:' +array.length + 'Fund data:' + attr[2]);

      if ( attr[2] != (array.length - 1 ) ){
          console.log('Download data missing. Try again')
          res.status(422).json({
            code: 403,
            message: "Data missing."
          });
      }

      array.shift(); //removes the first array element
      // //attr.length
      for(i in array) {
          var item = array[i].split("|") ;

        var _Close_Date = transformDate(item[8]);
          fundData = `{
            "Fund_Code":"${item[1]}"
            ,"Close_Date":"${_Close_Date}"
            ,"Asset_Size":"${item[2] || 0}"
            ,"Nav_Price":"${item[3] || 0}"
            ,"Offer_Price":"${item[4] || 0}"
            ,"Bid_Price":"${item[5] || 0}"
            ,"OfferSwitch_Price":"${item[6] || 0}"
            ,"BidSwitch_Price":"${item[7] || 0}"
          }`;

          // console.log('fundData >>',JSON.stringify(fundData));

        uploadNAV(fundData);
      }
  });

    fs.unlink(DOWNLOAD_DIR + textfile_name, function () {
      console.log('write operation complete.');
      res.status(200).json({
          message: "Upload complete."
      });
    });

  } catch (err) {

    console.log("STEP X" + err);

    res.status(422).json({
      code: 401,
      message: err
    });
  }

}

// exports.uploadNAV = (data) => {
  function uploadNAV(data){

  console.log('Welcome uploadNAV() ');
  // console.log(JSON.stringify(data));
  var dataObj = JSON.parse(data);

  var fncName = 'uploadNAV()';
  var _createBy ='AMPM-CONNEXT';
  var queryStr = `
  BEGIN

  INSERT INTO MFTS_NavTable
  SELECT a.[Fund_Id],'${dataObj.Close_Date}',${dataObj.Asset_Size},${dataObj.Nav_Price},${dataObj.Offer_Price},${dataObj.Bid_Price},${dataObj.OfferSwitch_Price},${dataObj.BidSwitch_Price},'${_createBy}',GETDATE()
        ,NULL
        ,NULL
    FROM [MFTS_Fund] a
    WHERE Fund_Code ='${dataObj.Fund_Code}'
  END
  `;
  // console.log( '>>>>' + JSON.stringify(queryStr) );

  const sql = require('mssql')
  const pool1 = new sql.ConnectionPool(config, err => {

    pool1.request() // or: new sql.Request(pool1)
    .query(queryStr, (err, result) => {
        // ... error checks
        console.log( '>>>> EXECUTE ON '  + dataObj.Fund_Code + ' ;Close_Date=' + dataObj.Close_Date);
        if(err){
          console.log("*** ERR >>"+err);
          return {"code":201,"message":err}
        }else {
          console.log("*** Complete "  + dataObj.Fund_Code);
          return {"code":200}
        }
    })
  })
  pool1.on('error', err => {
    console.log("EROR>>"+err);
  })

}


// 20181128
function transformDate(val) {
  var  _year = val.slice(0, 4);
  var  _month = val.slice(4, 6);
  var  _date = val.slice(6, 8);
  return _year+"-"+_month+"-"+_date;
}
