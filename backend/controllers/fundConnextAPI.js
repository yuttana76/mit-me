const readline = require('readline');
const fs = require('fs');
const path = require('path');
const dbConfig = require('../config/db-config');
const FC_API_Config = require('../config/fundConnextAPI');
var logger = require("../config/winston");
var mail = require('./mail');
const https = require('https')
const download = require('download');
const { check, validationResult } = require('express-validator');
var AdmZip = require('adm-zip');

const HOST_FC= FC_API_Config.fundConnextApi_STAGE.host
const USER_API=FC_API_Config.fundConnextApi_STAGE.auth

const FC_AUTH_PATH = FC_API_Config.FC_API_PATH.AUTH_PATH
const FC_DOWNLOAD_PATH = FC_API_Config.FC_API_PATH.DOWNLOAD_PATH
const DOWNLOAD_PATH  = FC_API_Config.LOCAL.DOWNLOAD_PATH

var config_BULK = dbConfig.dbParameters_BULK;

exports.downloadFileAPI = (req, res, next) =>{
  console.log("Validate  API /downloadFileAPI/");

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  console.log("Welcome to API /downloadFileAPI/");

  const ACCOUNT_PROFILE='AccountProfile.zip';

  var businessDate = req.query.businessDate
  var fileType = req.query.fileType
  var fileAs = req.query.fileAs


    fnGetDownloadAPI(businessDate,fileType).then(data=>{

      console.log('fnGetDownloadAPI()'+data.path);
      console.log('fileAs>'+fileAs);
      console.log('fileType>'+fileType);

      if(fileAs=='excel'){

        // Download to be excel file.
        if(fileType ==ACCOUNT_PROFILE){

          fnAccToExcel(data.path).then(excelFile=>{

            res.download(excelFile);

          },err=>{
            res.status(400).json({
              message: err,
              code:"999",
            });
          })

        }else{
          console.log('STEP 1-2');
          res.download(data.path);
        }

      }else{
        console.log('STEP 2');
        res.download(data.path);
        // Export to general  data
        // res.status(200).json(data);
      }


    },err=>{
      res.status(400).json({
        message: err,
        code:"999",
      });
    });
}



exports.downloadInfo = (req, res, next) =>{

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  var businessDate = req.query.businessDate
  var fileType = req.query.fileType
  var fileAs = req.query.fileAs

  fnGetDownloadAPI(businessDate,fileType).then(data=>{

    console.log('fnGetDownloadAPI()'+data.path);
    console.log('fileAs>'+fileAs);
    console.log('fileType>'+fileType);

     // Split name
  var arr = data.path.toString().split("/");

  var fileName = arr[arr.length-1]
  var fileNameArr = fileName.toString().split("-");
  var _prefix =fileNameArr[0];

  var extAccFileName;

  const DOWNLOAD_DIR = path.resolve('./backend/downloadFiles/fundConnext/');
  const DOWNLOAD_DIR2 = './backend/downloadFiles/fundConnext/';
  var _zipFile= DOWNLOAD_DIR+'/'+fileName;
  const EXCEL_FILE_NAME=_prefix+'_MPAM_ACCOUNT.xlsx';

     //Unzip file
     try{

      var zip = new AdmZip(_zipFile);

      var zipEntries = zip.getEntries();
      zipEntries.forEach(function(zipEntry) {
        extAccFileName = zipEntry.entryName
    });

    // console.log('_zipFile>' + _zipFile);
    // console.log('extAccFileName>' + extAccFileName);
    // console.log('DOWNLOAD_DIR>' + DOWNLOAD_DIR);

    zip.extractEntryTo(/*entry name*/extAccFileName, /*target path*/DOWNLOAD_DIR, /*maintainEntryPath*/false, /*overwrite*/true);
        //Read file
      fs.readFile(DOWNLOAD_DIR +"/"+ extAccFileName, function(err, data) {
        if(err) {
          // reject(err);
          res.status(400).json({
            message: err,
            code:"999",
          });
        }
        var array = data.toString().split("\n");
        var attr = array[0].split("|") ;

          res.status(200).json({
          records: attr[2],
          fileType:fileType,
          extract:extAccFileName
          // path:DOWNLOAD_DIR,
        });
      });
    }
    catch (e) {
      // reject(e)
      console.log(e)
      res.status(400).json({
        message: e,
        code:"999",
      });
    }
  },err=>{
    res.status(400).json({
      message: err,
      code:"999",
    });
  });
}


exports.uploadDB = (req, res, next) =>{

  var businessDate = req.body.businessDate;
  var fileType = req.body.fileType;
  var extract = req.body.extract;

  logger.info(`API uploadDB  // businessDate=${businessDate} ;fileType=${fileType} ;extract=${extract}`);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.error('API validate params ' + JSON.stringify({ errors: errors.array() }));
    return res.status(422).json({ errors: errors.array() });
  }

    switch(fileType) {
      case 'Nav.zip':
          fcNAV_ToDB(extract).then(data=>{
          res.status(200).json({data: data});
        },err=>{
          res.status(422).json({error: err});
        });

        break

      case 'value2':  // if (x === 'value2')
        break

      default:
          res.status(422).json({
            error: 'No fileType'
          });
        break
    }
}

exports.exportExcel = (req, res, next) =>{

  var businessDate = req.body.businessDate;
  var fileType = req.body.fileType;
  var extract = req.body.extract;

  logger.info(`API uploadDB  // businessDate=${businessDate} ;fileType=${fileType} ;extract=${extract}`);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.error('API validate params ' + JSON.stringify({ errors: errors.array() }));
    return res.status(422).json({ errors: errors.array() });
  }

    switch(fileType) {
      case 'Nav.zip':

          fcNAV_ToExcel(extract,businessDate).then(file=>{

            console.log('fcNAV_ToExcel>>' + file);

          res.download(file);

        },err=>{
          res.status(422).json({error: err});
        });

        break

      case 'value2':  // if (x === 'value2')
        break

      default:
          res.status(422).json({
            error: 'No fileType'
          });
        break
    }
}

// *****************************************************

function fcNAV_ToExcel(fileName,businessDate){
  logger.info('Function fcNAV_ToExcel() // fileName='+fileName +' ;businessDate='+ businessDate);

  const DOWNLOAD_DIR = path.resolve('./backend/downloadFiles/fundConnext/');
  const EXCEL_FILE_NAME ='NAV.xlsx';

  // Require library
  var xl = require('excel4node');

  // Create a new instance of a Workbook class
  var wb = new xl.Workbook();

  // Add Worksheets to the workbook
  var ws = wb.addWorksheet('NAV_'+ businessDate);
  // var ws2 = wb.addWorksheet('Summary');

  // Create a reusable style
  var style = wb.createStyle({
    font: {
      color: '#000000',
      size: 12,
    },
    // numberFormat: '$#,##0.00; ($#,##0.00); -',
  });

  return new Promise(function(resolve, reject) {

      //Read file
      try{

      fs.readFile(DOWNLOAD_DIR +"/"+ fileName, function(err, data) {

        if(err) {
          logger.error(err);
          reject(err);
        }


        var array = data.toString().split("\n");
        var attr = array[0].split("|") ;

        array.shift(); //removes the first array element

        var _row =1;

        ws.cell(_row, 1).string('AMC Code').style(style);
        ws.cell(_row, 2).string('Fund Code').style(style);
        ws.cell(_row, 3).string('AUM').style(style);
        ws.cell(_row, 4).string('NAV').style(style);
        ws.cell(_row, 5).string('Offer NAV').style(style);
        ws.cell(_row, 6).string('Bid NAV').style(style);
        ws.cell(_row, 7).string('Switch Out NAV').style(style);
        ws.cell(_row, 8).string('Switch In NAV').style(style);
        ws.cell(_row, 9).string('NAV Date').style(style);
        ws.cell(_row, 10).string('SA Code').style(style);
        ws.cell(_row, 11).string('Total Unit').style(style);
        ws.cell(_row, 12).string('Total AUM').style(style);

        _row = _row+2;
          for(i in array) {

            var item = array[i].split("|") ;

            //  console.log(`AMC Code: ${item[0]} ; Fund Code=${item[1]}`);
            AMCCode_Str = String(item[0].trim());
            FundCode_Str = String(item[1].trim());
            AUM_int = item[2]?item[2].trim():'';
            NAV_int =item[3]?item[3].trim():'';
            OfferNAV_int =item[4]?item[4].trim():'';
            BidNAV_int =item[5]?item[5].trim():'';
            SwitchOutNAV_int= item[6]?item[6].trim():'';
            SwitchInNAV_int= item[7]?item[7].trim():'';
            NAVDate_date= item[8];
            SACode_str= item[9];
            TotalUnit_int= item[10]?item[10].trim():'';
            TotalAUM_int=item[11]?item[11].trim():'';

            ws.cell(_row, 1).string(AMCCode_Str).style(style);
            ws.cell(_row, 2).string(FundCode_Str).style(style);
            ws.cell(_row, 3).string(AUM_int).style(style);
            ws.cell(_row, 4).string(NAV_int).style(style);
            ws.cell(_row, 5).string(OfferNAV_int).style(style);
            ws.cell(_row, 6).string(BidNAV_int).style(style);
            ws.cell(_row, 7).string(SwitchOutNAV_int).style(style);
            ws.cell(_row, 8).string(SwitchInNAV_int).style(style);
            ws.cell(_row, 9).string(NAVDate_date).style(style);
            ws.cell(_row, 10).string(SACode_str).style(style);
            ws.cell(_row, 11).string(TotalUnit_int).style(style);
            ws.cell(_row, 12).string(TotalAUM_int).style(style);

              _row++;
          }

          wb.write(DOWNLOAD_DIR +"/"+ EXCEL_FILE_NAME, function(err, stats) {
            if (err) {
              logger.error(err);
              reject(err);
            } else {
              resolve(DOWNLOAD_DIR +"/"+ EXCEL_FILE_NAME);
            }
          });


      });//fs.readFile

    }catch(e){
      logger.error(e);
      reject(e);
    }
  });
}

function fcNAV_ToDB(fileName){
  logger.info('Function fcNAV_ToDB() //'+fileName);

  const DOWNLOAD_DIR = path.resolve('./backend/downloadFiles/fundConnext/');
  const userCode='SYSTEM';

  return new Promise(function(resolve, reject) {

      //Read file
      try{

      fs.readFile(DOWNLOAD_DIR +"/"+ fileName, function(err, data) {

        if(err) {
          logger.error(err);
          reject(err);
        }

        //Table config
        const sql = require('mssql');
        const pool1 = new sql.ConnectionPool(config_BULK, err => {

        const table = new sql.Table('MIT_FC_NAV');
        table.create = true;
        table.columns.add('AMCCode', sql.VarChar(50), {nullable: true});
        table.columns.add('FundCode', sql.VarChar(50),{nullable: true});
        table.columns.add('AUM', sql.Numeric(18,2), { nullable: true });
        table.columns.add('NAV', sql.Numeric(18,4), { nullable: true });
        table.columns.add('OfferNAV', sql.Numeric(18,4), { nullable: true });
        table.columns.add('BidNAV', sql.Numeric(18,4), { nullable: true });
        table.columns.add('SwitchOutNAV', sql.Numeric(18,4), { nullable: true });
        table.columns.add('SwitchInNAV', sql.Numeric(18,4), { nullable: true });
        table.columns.add('NAVDate', sql.VarChar(10), { nullable: true });
        table.columns.add('SACode', sql.VarChar(15), { nullable: true });
        table.columns.add('TotalUnit', sql.Numeric(18,4), { nullable: true });
        table.columns.add('TotalAUM', sql.Numeric(18,2), { nullable: true });
        table.columns.add('createBy', sql.VarChar(50), { nullable: true });
        table.columns.add('createDate', sql.SmallDateTime, { nullable: true });

        var array = data.toString().split("\n");
        var attr = array[0].split("|") ;

         // console.log('Process NEXT !')
        array.shift(); //removes the first array element

        var _row =0;

          for(i in array) {

            var item = array[i].split("|") ;

             AMCCode_Str = String(item[0].trim());
             FundCode_Str = String(item[1].trim());
             AUM_int = item[2]?item[2].trim():'';
              NAV_int =item[3]?item[3].trim():'';
              OfferNAV_int =item[4]?item[4].trim():'';
              BidNAV_int =item[5]?item[5].trim():'';
              SwitchOutNAV_int= item[6]?item[6].trim():'';
              SwitchInNAV_int= item[7]?item[7].trim():'';
              NAVDate_date= item[8];
              SACode_str= item[9];
              TotalUnit_int= item[10]?item[10].trim():'';
              TotalAUM_int=item[11]?item[11].trim():'';

              if(item[0]){
                table.rows.add(AMCCode_Str,FundCode_Str,AUM_int,NAV_int,OfferNAV_int,BidNAV_int,SwitchOutNAV_int,SwitchInNAV_int,NAVDate_date,SACode_str,TotalUnit_int,TotalAUM_int
                  ,userCode,new Date);
              }
              _row++;
          }

          // Execute insert Bulk data to  MIT_LED table
          const request = new sql.Request(pool1)
          request.bulk(table, (err, result) => {
              // ... error checks
            if(err){
              // console.log(err);
              logger.error(err);
              reject(err);

            }

            if(result){
              //Move file to Backup
              msg={msg:'Insert NAV DB. successful.',records:_row}
              logger.info('Function fcNAV_ToDB() //'+JSON.stringify(msg));
              resolve(msg);
            }
          });

        });//sql.ConnectionPool
      });//fs.readFile

    }catch(e){
      logger.error(e);
      reject(e);
    }
  });
}

function fnAccToExcel(filePaht){

  console.log('Welcome fnAccToExcel() '+ filePaht);

  // Split name
  var arr = filePaht.toString().split("/");

  var fileName = arr[arr.length-1]
  var fileNameArr = fileName.toString().split("-");
  var _prefix =fileNameArr[0];

  // '20190820_MPAM_ACCOUNT.txt'
  // var extAccFileName = _prefix+'_MPAM_ACCOUNT.txt';
  var extAccFileName ;

  const DOWNLOAD_DIR = path.resolve('./backend/downloadFiles/fundConnext/');
  const DOWNLOAD_DIR2 = './backend/downloadFiles/fundConnext/';
  var _zipFile= DOWNLOAD_DIR+'/'+fileName;
  const EXCEL_FILE_NAME=_prefix+'_MPAM_ACCOUNT.xlsx';

  //EXCEL config

    // Require library
  var xl = require('excel4node');

  // Create a new instance of a Workbook class
  var wb = new xl.Workbook();

  // Add Worksheets to the workbook
  var ws = wb.addWorksheet('Overview');
  // var ws2 = wb.addWorksheet('Summary');

  // Create a reusable style
  var style = wb.createStyle({
    font: {
      color: '#000000',
      size: 12,
    },
    numberFormat: '$#,##0.00; ($#,##0.00); -',
  });

  return new Promise(function(resolve, reject) {

    //Unzip file
    try{
      var zip = new AdmZip(_zipFile);

      var zipEntries = zip.getEntries();
      zipEntries.forEach(function(zipEntry) {
        extAccFileName = zipEntry.entryName
    });

      zip.extractEntryTo(/*entry name*/extAccFileName, /*target path*/DOWNLOAD_DIR, /*maintainEntryPath*/false, /*overwrite*/true);
    }
    catch (e) {
      reject(e)
    }

    //Read file
    fs.readFile(DOWNLOAD_DIR +"/"+ extAccFileName, function(err, data) {
      if(err) {
        reject(err);
      }
      var array = data.toString().split("\n");
      var attr = array[0].split("|") ;

      if ( attr[2] != (array.length - 1 ) ){
        logger.error('Download data missing. Try again');
        reject('Download data missing. Try again');
      }

    // console.log('Process NEXT !')
    array.shift(); //removes the first array element

    var _row =1;
      for(i in array) {
        var item = array[i].split("|") ;

        // Account ID
        ws.cell(_row, 1).string(item[1]).style(style);
        // Gender
        ws.cell(_row, 2).string(item[34]).style(style);
        // Title
        ws.cell(_row, 3).string(item[35]).style(style);
        // First Name TH
        ws.cell(_row, 4).string(item[36]).style(style);
        // Last Name TH
        ws.cell(_row, 5).string(item[37]).style(style);
        // First Name EN
        ws.cell(_row, 6).string(item[38]).style(style);
        // Last Name EN
        ws.cell(_row, 7).string(item[39]).style(style);
        _row++;
      }

      wb.write(DOWNLOAD_DIR2 +"/"+ EXCEL_FILE_NAME, function(err, stats) {
        if (err) {
          reject(err);
        } else {
          resolve(DOWNLOAD_DIR2 +"/"+ EXCEL_FILE_NAME);
        }
      });

    });
  });
}


// Login to the FC. system and acquire access tokens
function fnFCAuth(){
  console.log('Welcome fnFCAuth() ');

  return new Promise(function(resolve, reject) {

    // const userData = fs.readFileSync(USER_CONFIG_PATH, "utf8"); //ascii,utf8
    // let userDataObj  = JSON.parse(userData);
    // let userDataObj  = fundConnextAPIConfig.fundConnextApi_DEMO.auth;

    // const postData = JSON.stringify({
    //   username:USER_API.username,
    //   password:USER_API.password
    // });

    var options = {
      host: HOST_FC,
      path:FC_AUTH_PATH,
      method: "POST",
      headers: {
         "Content-Type": "application/json",
        //  'Content-Length': postData.length
      },
    };

    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0" //this is insecure
  const request = https.request(options,(res) => {
    var _chunk="";
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
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
  request.write(JSON.stringify(USER_API));
  request.end();

  });
}


// GET
function fnGetDownloadAPI(businessDate,fileType){

  console.log(`Welcome fnGetDownloadAPI() ${businessDate} - ${fileType}`);
  var DOWNLOAD_PATH_FILENAME  = DOWNLOAD_PATH  + businessDate+'-'+fileType;
  return new Promise(function(resolve, reject) {

    fnFCAuth().then(result =>{
      resultObj =JSON.parse(result);

      const HTTPS_ENDPOIN =`https://${HOST_FC}${FC_DOWNLOAD_PATH}${businessDate}/${fileType}`;
      const propertiesObject = {
        "x-auth-token":resultObj.access_token,
        "Content-Type": "application/json"
      };

      // console.log(' propertiesObject >>' + JSON.stringify(propertiesObject) );
      console.log('HTTPS_ENDPOIN >>' + HTTPS_ENDPOIN);

      download(HTTPS_ENDPOIN,{'headers':propertiesObject}).then(data => {
        console.log('AIP RS >' );
        try{
          fs.writeFile(DOWNLOAD_PATH_FILENAME, data, function(err) {
            if(err) {
                reject(err);
            }
            resolve({path:DOWNLOAD_PATH_FILENAME});
          });

        }catch(err){
          reject(err);
        }

      },err=>{
        console.log('AIP ERR >' + err);
        reject(err);
      });

    },err =>{
      reject(err);
    });

  });

}
