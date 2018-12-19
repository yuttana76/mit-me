/*
1. Download file HTTP
2. Save file to /downloadFiles/yyyymmdd-hhmm-NAV.zip
3. Extract data
4. Upload NAV to db.

remark:
https://www.npmjs.com/package/request#promises--asyncawait
*/
const fs = require('fs');
var request = require('request');
var AdmZip = require('adm-zip');

var logger = require('../config/connextLog');

var dbConfig = {
  user: 'mftsuser',//process.env.AUTH_SRV_USER,
  password: 'P@ssw0rd',//process.env.AUTH_SRV_PWD,
  server: '192.168.10.48',//process.env.AUTH_SRV_IP,
  database: 'MFTS',//process.env.AUTH_SRV_db,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  },
  options: {
    encrypt: false // Use this if you're on Windows Azure
  }
}


var file_url = 'http://localhost:3000/api/download/NAV.zip'

// var srcfile_name = 'NAV.zip';
var DOWNLOAD_DIR = '../downloadFiles/connext/';
var textfile_name = 'NAV.txt';

exports.downloadToDB = () => {

  logger.info('Start call downloadToDB');

      let curDate = new Date();
      let prefixFile =  curDate.getFullYear() +""+ (curDate.getMonth()+1)+""+ curDate.getDate() +"-"+curDate.getHours() +""+ curDate.getMinutes()+"-";
      var targetfile_name = prefixFile+'NAV.zip';

    // Download file from server
    request(file_url)
    .pipe(fs.createWriteStream(DOWNLOAD_DIR + targetfile_name))
    .on('close', function () {

      var zip = new AdmZip(DOWNLOAD_DIR + targetfile_name);
      zip.extractAllTo(/*target path*/DOWNLOAD_DIR, /*overwrite*/true);

          fs.readFile(DOWNLOAD_DIR + textfile_name, function(err, data) {

            if(err) {
              logger.error(err);
              throw err;
            }
            var array = data.toString().split("\n");
            var attr = array[0].split("|") ;

            // console.log('Record data:' +array.length );
            // console.log('Fund data:' + attr[2]);

            if ( attr[2] != (array.length - 1 ) ){
                // console.log('Download data missing. Try again')
                logger.error('Download data missing. Try again');
                return ;
            }

            // console.log('Process NEXT !')
            array.shift(); //removes the first array element
            // UploadFundNAV.uploadNAV(array);

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

                // console.log(JSON.stringify(fundData));
              // UploadFundNAV.uploadNAV(fundData);
              uploadNAV(fundData);

            }

          });

    });

    logger.info('Finish call downloadToDB');
}

// exports.uploadNAV = (data) => {
  function uploadNAV(data){

    // console.log('Welcome uploadNAV() >>');
    var dataObj = JSON.parse(data);

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

    const sql = require('mssql')
    const pool1 = new sql.ConnectionPool(dbConfig, err => {
      pool1.request() // or: new sql.Request(pool1)
      .query(queryStr, (err, result) => {
          // ... error checks
          // console.log( '>>>> EXECUTE ON '  + dataObj.Fund_Code + ' ;Close_Date=' + dataObj.Close_Date);
          if(err){
            // console.log("*** ERR >>"+err);
            logger.error("ERR during query for "+dataObj.Fund_Code +" ;Close_Date:"+ dataObj.Close_Date + " MSG:" + err);
            // return {"code":201,"message":err}
          }else {
            // console.log('RESULT >> ' + JSON.stringify(result));
            // console.log("*** RESULT "  + dataObj.Fund_Code);
            // return {"code":200}
          }
      })
    })
    pool1.on('error', err => {
      // console.log("EROR>>"+err);
      logger.error("Pool error for "+dataObj.Fund_Code +" ;Close_Date:"+ dataObj.Close_Date + " MSG:" + err);
    })
  }

// 20181128
function transformDate(val) {
  var  _year = val.slice(0, 4);
  var  _month = val.slice(4, 6);
  var  _date = val.slice(6, 8);
  return _year+"-"+_month+"-"+_date;
}
