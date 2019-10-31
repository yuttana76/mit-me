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

const HOST_FC= FC_API_Config.fundConnextApi_PROD.host
const USER_API=FC_API_Config.fundConnextApi_PROD.auth

const FC_AUTH_PATH = FC_API_Config.FC_API_PATH.AUTH_PATH
const FC_DOWNLOAD_PATH = FC_API_Config.FC_API_PATH.DOWNLOAD_PATH
const DOWNLOAD_PATH  = FC_API_Config.LOCAL.DOWNLOAD_PATH

var config_BULK = dbConfig.dbParameters_BULK;
var config = dbConfig.dbParameters;

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



        // Download to be excel file.
        if(fileType ==ACCOUNT_PROFILE){

          if(fileAs=='excel'){
            fnAccToExcel(data.path).then(excelFile=>{
            res.download(excelFile);
            },err=>{
              res.status(400).json({
                message: err,
                code:"999",
              });
            });
          }else{
            console.log('STEP 2');
            res.download(data.path);
            // Export to general  data
            // res.status(200).json(data);
          }
        }else{  // Other file Nav.zip

          console.log('STEP 1-2');
          // res.download(data.path);
          unZipFile(data.path).then(unzipedPath=>{
            res.status(200).json(unzipedPath);
          },err=>{
              res.status(422).json(err);

          });
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

     // Split name
  var arr = data.path.toString().split("/");

  var fileName = arr[arr.length-1]
  var fileNameArr = fileName.toString().split("-");
  var _prefix =fileNameArr[0];

  var extAccFileNameList=[];

  const DOWNLOAD_DIR = path.resolve('./backend/downloadFiles/fundConnext/');
  const DOWNLOAD_DIR2 = './backend/downloadFiles/fundConnext/';
  var _zipFile= DOWNLOAD_DIR+'/'+fileName;
  const EXCEL_FILE_NAME=_prefix+'_MPAM_ACCOUNT.xlsx';

     //Unzip file
     try{

      var zip = new AdmZip(_zipFile);

      var zipEntries = zip.getEntries();
      zipEntries.forEach(function(zipEntry) {
        var extAccFileName = zipEntry.entryName
        zip.extractEntryTo(/*entry name*/extAccFileName, /*target path*/DOWNLOAD_DIR, /*maintainEntryPath*/false, /*overwrite*/true);
        extAccFileNameList.push(extAccFileName);
    });

      //Read file
      if(extAccFileNameList.length==1){
        fs.readFile(DOWNLOAD_DIR +"/"+ extAccFileNameList[0], function(err, data) {
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
              extract:JSON.parse(JSON.stringify(extAccFileNameList))
            });
        });
      }else{
        res.status(200).json({
          records: extAccFileNameList.length,
          fileType:fileType,
          extract:JSON.parse(JSON.stringify(extAccFileNameList))
        });
      }

    }
    catch (e) {
      // reject(e)
      console.log(e)
      res.status(400).json({
        message: e,
        code:"999",
      });
    }

    // fnGetDownloadAPI
  },err=>{
    res.status(400).json({message: err,code:"999"});
  });
}


exports.uploadMITdb = (req, res, next) =>{

  // var businessDate = req.body.businessDate;
  // var extract = req.body.extract;
  var fileType = req.body.fileType;
  var fileName = req.body.fileName;

  // logger.info(`API uploadDB  // businessDate=${businessDate} ;fileType=${fileType} ;extract=${extract}`);
  logger.info(`API uploadMITdb  ;fileType=${fileType} ;fileName=${fileName}`);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.error('API validate params ' + JSON.stringify({ errors: errors.array() }));
    return res.status(422).json({ errors: errors.array() });
  }

    switch(fileType) {
      case 'Nav':
          fcNAV_ToDB(fileName).then(data=>{
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
/**
 * check
 */

exports.navSync = (req, res, next) =>{

  var createDate = req.body.createDate;
  logger.info(`API navSysc()  createDate=${createDate}`);

  // Validate parameter
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.error('API validate params ' + JSON.stringify({ errors: errors.array() }));
    return res.status(422).json({ errors: errors.array() });
  }

  navSyncFunc(createDate).then(syncData=>{
    res.status(200).json({message: syncData});
  },syncErr=>{
    res.status(422).json({error: syncErr});
  })
}

exports.exportExcel = (req, res, next) =>{

  var businessDate = req.body.businessDate;
  var fileType = req.body.fileType;
  var extract = req.body.extract;

  console.log('File Name>'+extract[0]);

  logger.info(`API exportExcel  // businessDate=${businessDate} ;fileType=${fileType} ;extract=${extract}`);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.error('API validate params ' + JSON.stringify({ errors: errors.array() }));
    return res.status(422).json({ errors: errors.array() });
  }

    switch(fileType) {
      case 'Nav.zip':

          fcNAV_ToExcel(extract,businessDate).then(file=>{
          res.download(file);
        },err=>{
          res.status(422).json({error: err});
        });

        break

      case 'CustomerProfile.zip':

        fcCustomerProfile_ToExcel(extract,businessDate).then(file=>{
          res.download(file);
        },err=>{
          res.status(422).json({error: err});
        });

        break

      default:
          res.status(422).json({
            error: 'No fileType'
          });
        break
    }
}

// *****************************************************
// createDate format  yyyymmdd(20191030)
function navSyncFunc(createDate){

  return new Promise(function(resolve, reject) {
    try{

// ********************************************
var queryStr = `
--Has in MIT_FC_NAV create date
-- Has in MFTS_Fund  Not expire ([Start_Date]      ,[End_Date_Flag]      ,[End_Date])

BEGIN

DECLARE @createDate VARCHAR(20) ='${createDate}';
DECLARE @Fund_Id [varchar](50);
DECLARE @FundCode [varchar](50);
DECLARE @NAVDate [varchar](10);
DECLARE @AUM [numeric](18, 2);
DECLARE @NAV [numeric](18, 4) ;
DECLARE @OfferNAV [numeric](18, 4) ;
DECLARE @BidNAV [numeric](18, 4) ;
DECLARE @SwitchOutNAV [numeric](18, 4) ;
DECLARE @SwitchInNAV [numeric](18, 4) ;
DECLARE @createBy [varchar](50)='MIT_SYSTEM';

DECLARE MIT_FC_NAV_cursor CURSOR LOCAL  FOR
  SELECT B.Fund_Id
  ,[FundCode]
,[NAVDate]
,[AUM]
,[NAV]
,[OfferNAV]
,[BidNAV]
,[SwitchOutNAV]
,[SwitchInNAV]
  FROM MIT_FC_NAV A,MFTS_Fund B
  WHERE CONVERT(varchar, A.createDate , 112)=@createDate
  AND A.FundCode=B.Fund_Code
  AND B.End_Date_Flag='0'
  AND ISNULL(B.End_Date,getdate()) >=getdate()
  order by A.NAVDate

OPEN MIT_FC_NAV_cursor
  FETCH NEXT FROM MIT_FC_NAV_cursor INTO @Fund_Id,@FundCode,@NAVDate,@AUM,@NAV,@OfferNAV,@BidNAV,@SwitchOutNAV,@SwitchInNAV

    WHILE @@FETCH_STATUS = 0
        BEGIN

            if exists (
            SELECT * FROM MFTS_NavTable WHERE Fund_Id= @Fund_Id AND convert(varchar, Close_Date, 112)=@NAVDate
            )
            BEGIN
              -- print 'Update '+@Fund_Id
              UPDATE MFTS_NavTable
              SET [Asset_Size]=@AUM
                  ,[Nav_Price]=@NAV
                  ,[Offer_Price]=@OfferNAV
                  ,[Bid_Price]=@BidNAV
                  ,[OfferSwitch_Price]=@SwitchInNAV
                  ,[BidSwitch_Price]=@SwitchOutNAV
                  ,[Modify_By]='MIT-SYSTEM'
                  ,[Modify_Date] =getdate()
              WHERE  Fund_Id= @Fund_Id  AND Close_Date=@NAVDate

            END
            ELSE
            BEGIN
                -- print 'Insert '+ @Fund_Id
                INSERT INTO MFTS_NavTable
                ([Fund_Id]
                ,[Close_Date]
                ,[Asset_Size]
                ,[Nav_Price]
                ,[Offer_Price]
                ,[Bid_Price]
                ,[OfferSwitch_Price]
                ,[BidSwitch_Price]
                ,[Create_By]
                ,[Create_Date]   )
                VALUES(@Fund_Id,@NAVDate,@AUM,@NAV,@OfferNAV,@BidNAV,@SwitchInNAV,@SwitchOutNAV,@createBy,@createDate)

            END
            FETCH NEXT FROM MIT_FC_NAV_cursor INTO @Fund_Id,@FundCode,@NAVDate,@AUM,@NAV,@OfferNAV,@BidNAV,@SwitchOutNAV,@SwitchInNAV
        END;
    CLOSE MIT_FC_NAV_cursor
    DEALLOCATE MIT_FC_NAV_cursor
END
`;
  const sql = require('mssql')

  const pool1 = new sql.ConnectionPool(config, err => {
    pool1.request() // or: new sql.Request(pool1)
    .query(queryStr, (err, result) => {
        if(err){
          logger.error('SQL Error >' +err);
          reject(err);
        }else {
          // logger.info(JSON.stringify(result))
          resolve(`Effect ${result.rowsAffected.length} records`)
        }
    })
  })

  pool1.on('error', err => {
    logger.error('POOL Error >'+err);
  })

// ********************************************

    }catch(e){
      logger.error('CATCH >' + e);
      reject(e);
    }

  });
}

function fcCustomerProfile_ToExcel(fileName,businessDate){
  logger.info('Function fcCustomerProfile_ToExcel() // fileName='+fileName +' ;businessDate='+ businessDate);

  const DOWNLOAD_DIR = path.resolve('./backend/downloadFiles/fundConnext/');
  const EXCEL_FILE_NAME ='CustomerProfile.xlsx';

  // Require library
  var xl = require('excel4node');

  // Create a new instance of a Workbook class
  var wb = new xl.Workbook();

  // Add Worksheets to the workbook
  var ws = wb.addWorksheet('NAV_'+ businessDate);
  // var ws2 = wb.addWorksheet('Summary');

  // Create a reusable style
  var HeaderStyle = wb.createStyle({
    font: {
      bold: true,
      color: '#000000',
      size: 12,
    },
    // numberFormat: '$#,##0.00; ($#,##0.00); -',
  });

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

        let jsonData = {}
        fs.readFile(DOWNLOAD_DIR +"/"+ fileName, 'utf-8', (err, data) => {
          if (err) reject(err);

          var jsonData =JSON.parse(data);
          var _row =1;
          ws.cell(_row, 1).string(`DATE ${businessDate}`).style(HeaderStyle);

          _row++;
          ws.cell(_row, 1).string('IdentificationCard Type').style(HeaderStyle);
          ws.cell(_row, 2).string('Passport Country').style(HeaderStyle);
          ws.cell(_row, 3).string('Card Number').style(HeaderStyle);
          ws.cell(_row, 4).string('Card Expiry Date').style(HeaderStyle);
          ws.cell(_row, 5).string('Accompanying Document').style(HeaderStyle);
          ws.cell(_row, 6).string('Gender').style(HeaderStyle);
          ws.cell(_row, 7).string('Title').style(HeaderStyle);
          ws.cell(_row, 8).string('Title Other').style(HeaderStyle);
          ws.cell(_row, 9).string('En First Name').style(HeaderStyle);
          ws.cell(_row, 10).string('En Last Name').style(HeaderStyle);
          ws.cell(_row, 11).string('Th First Name').style(HeaderStyle);
          ws.cell(_row, 12).string('Th Last Name').style(HeaderStyle);
          ws.cell(_row, 13).string('Birth Date').style(HeaderStyle);
          ws.cell(_row, 14).string('Nationality').style(HeaderStyle);
          ws.cell(_row, 15).string('Mobile').style(HeaderStyle);
          ws.cell(_row, 16).string('Email').style(HeaderStyle);
          ws.cell(_row, 17).string('Marital Status').style(HeaderStyle);
          // spouse
          ws.cell(_row, 18).string('Ooccupation Id').style(HeaderStyle);
          ws.cell(_row, 19).string('Occupation Other').style(HeaderStyle);
          ws.cell(_row, 20).string('BusinessType Id').style(HeaderStyle);
          ws.cell(_row, 21).string('BusinessType Other').style(HeaderStyle);
          ws.cell(_row, 22).string('MonthlyIncome Level').style(HeaderStyle);
          ws.cell(_row, 23).string('Income Source').style(HeaderStyle);
          ws.cell(_row, 24).string('IncomeSource Other').style(HeaderStyle);
          // residence
          ws.cell(_row, 25).string('Contact AddressSameAsFlag').style(HeaderStyle);
          ws.cell(_row, 26).string('Company Name').style(HeaderStyle);
          // work
          ws.cell(_row, 27).string('committedMoneyLaundering').style(HeaderStyle);
          ws.cell(_row, 28).string('politicalRelatedPerson').style(HeaderStyle);
          ws.cell(_row, 29).string('rejectFinancialTransaction').style(HeaderStyle);
          ws.cell(_row, 30).string('confirmTaxDeduction').style(HeaderStyle);
          ws.cell(_row, 31).string('canAcceptFxRisk').style(HeaderStyle);
          ws.cell(_row, 32).string('canAcceptDerivativeInvestment').style(HeaderStyle);
          ws.cell(_row, 33).string('suitabilityRiskLevel').style(HeaderStyle);
          ws.cell(_row, 34).string('suitabilityEvaluationDate').style(HeaderStyle);
          ws.cell(_row, 35).string('fatca').style(HeaderStyle);
          ws.cell(_row, 36).string('fatcaDeclarationDate').style(HeaderStyle);
          ws.cell(_row, 37).string('cddScore').style(HeaderStyle);
          ws.cell(_row, 38).string('cddDate').style(HeaderStyle);
          ws.cell(_row, 39).string('referalPerson').style(HeaderStyle);
          ws.cell(_row, 40).string('applicationDate').style(HeaderStyle);
          ws.cell(_row, 41).string('incomeSourceCountry').style(HeaderStyle);
          ws.cell(_row, 42).string('acceptBy').style(HeaderStyle);
          // children
          // accounts
          // -mailing
          // -redemptionBankAccounts
          // -subscriptionBankAccounts

            _row++;
            for(i in jsonData){
              obj = jsonData[i]
              // for(var key in jsonData[i]){
                // console.log( `${i} >>` +key);

                ws.cell(_row, 1).string(obj['identificationCardType']).style(style);
                ws.cell(_row, 2).string(obj['passportCountry']).style(style);
                ws.cell(_row, 3).string(obj['cardNumber']).style(style);
                ws.cell(_row, 4).string(obj['cardExpiryDate']).style(style);
                ws.cell(_row, 5).string(obj['accompanyingDocument']).style(style);
                ws.cell(_row, 6).string(obj['gender']).style(style);
                ws.cell(_row, 7).string(obj['title']).style(style);
                ws.cell(_row, 8).string(obj['titleOther']).style(style);
                ws.cell(_row, 9).string(obj['enFirstName']).style(style);
                ws.cell(_row, 10).string(obj['enLastName']).style(style);
                ws.cell(_row, 11).string(obj['thFirstName']).style(style);
                ws.cell(_row, 12).string(obj['thLastName']).style(style);
                ws.cell(_row, 13).string(obj['birthDate']).style(style);
                ws.cell(_row, 14).string(obj['nationality']).style(style);
                ws.cell(_row, 15).string(obj['mobileNumber']).style(style);
                ws.cell(_row, 16).string(obj['email']).style(style);
                ws.cell(_row, 17).string(obj['maritalStatus']).style(style);
                // spouse
                ws.cell(_row, 18).string(obj['occupationId']).style(style);
                ws.cell(_row, 19).string(obj['occupationOther']).style(style);
                ws.cell(_row, 20).string(obj['businessTypeId']).style(style);
                ws.cell(_row, 21).string(obj['businessTypeOther']).style(style);
                ws.cell(_row, 22).string(obj['monthlyIncomeLevel']).style(style);
                ws.cell(_row, 23).string(obj['incomeSource']).style(style);
                ws.cell(_row, 24).string(obj['incomeSourceOther']).style(style);
                // residence
                ws.cell(_row, 25).string(obj['contactAddressSameAsFlag']).style(style);
                ws.cell(_row, 26).string(obj['companyName']).style(style);
                // work
                ws.cell(_row, 27).string(obj['committedMoneyLaundering']).style(style);
                ws.cell(_row, 28).string(obj['politicalRelatedPerson']).style(style);
                ws.cell(_row, 29).string(obj['rejectFinancialTransaction']).style(style);
                ws.cell(_row, 30).string(obj['confirmTaxDeduction']).style(style);
                ws.cell(_row, 31).string(obj['canAcceptFxRisk']).style(style);
                ws.cell(_row, 32).string(obj['canAcceptDerivativeInvestment']).style(style);
                ws.cell(_row, 33).string(obj['suitabilityRiskLevel']).style(style);
                ws.cell(_row, 34).string(obj['suitabilityEvaluationDate']).style(style);
                ws.cell(_row, 35).string(obj['fatca']).style(style);
                ws.cell(_row, 36).string(obj['fatcaDeclarationDate']).style(style);
                ws.cell(_row, 37).string(obj['cddScore']).style(style);
                ws.cell(_row, 38).string(obj['cddDate']).style(style);
                ws.cell(_row, 39).string(obj['referalPerson']).style(style);
                ws.cell(_row, 40).string(obj['applicationDate']).style(style);
                ws.cell(_row, 41).string(obj['incomeSourceCountry']).style(style);
                ws.cell(_row, 42).string(obj['acceptBy']).style(style);
                // children

                  _row++;

              // }
            }

          wb.write(DOWNLOAD_DIR +"/"+ EXCEL_FILE_NAME, function(err, stats) {
            if (err) {
              logger.error(err);
              reject(err);
            } else {
              resolve(DOWNLOAD_DIR +"/"+ EXCEL_FILE_NAME);
            }
          });

        })

    }catch(e){
      logger.error(e);
      reject(e);
    }
  });
}

function removeByteOrderMark(str){
  return str.replace(/^\ufeff/g,"")
}

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

        _row++;
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
  const DOWNLOAD_DIR_BACKUP = path.resolve('./backend/downloadFiles/fundConnextBackup/');
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

        console.log('STEP1 >' + data);
        var array = data.toString().split("\n");
        // var attr = array[0].split("|") ;
         // console.log('Process NEXT !')
        array.shift(); //removes the first array element

        var _row =0;
        // console.log('STEP2 >' + array);

          for(i in array) {

            var item = array[i].split("|") ;

            // console.log("item >> "+item);
             AMCCode_Str = String(item[0]).trim();
             FundCode_Str = String(item[1]).trim();
             AUM_int = item[2]?item[2].trim():'';
              NAV_int =item[3]?item[3].trim():'';
              OfferNAV_int =item[4]?item[4].trim():'';
              BidNAV_int =item[5]?item[5].trim():'';
              SwitchOutNAV_int= item[6]?item[6].trim():'';
              SwitchInNAV_int= item[7]?item[7].trim():'';
              NAVDate_date= item[8]?item[8]:'';
              SACode_str= item[9]?item[9]:'';
              TotalUnit_int= item[10]?item[10].trim():'';
              TotalAUM_int=item[11]?item[11].trim():'';

              if(item[0]){
                table.rows.add(AMCCode_Str
                  ,FundCode_Str
                  ,AUM_int
                  ,NAV_int
                  ,OfferNAV_int
                  ,BidNAV_int
                  ,SwitchOutNAV_int
                  ,SwitchInNAV_int
                  ,NAVDate_date
                  ,SACode_str
                  ,TotalUnit_int
                  ,TotalAUM_int
                  ,userCode
                  ,new Date);
              }
              _row++;
          }

          // ***************** EXECUTE insert Bulk data to  MIT_LED table
          const request = new sql.Request(pool1)
          request.bulk(table, (err, result) => {
              // ... error checks
              console.log('ERROR BULK>>' + err);
            if(err){
              // console.log(err);
              logger.error(err);
              reject(err);
            }

            if(result){
              //Move file to Backup
              msg={msg:'Insert NAV DB. successful.',records:_row}
              logger.info('Function fcNAV_ToDB() //'+JSON.stringify(msg));

              //Move to backup folder
              fs.rename(DOWNLOAD_DIR +"/"+ fileName, DOWNLOAD_DIR_BACKUP+"/"+fileName,  (err) => {
                if (err) {
                  reject(err);
                };
                resolve(msg);
              });

            }
          });
          // ***************** Execute insert Bulk data to  MIT_LED table

        });//sql.ConnectionPool
      });//fs.readFile

    }catch(e){
      logger.error(e);
      reject(e);
    }
  });
}

function unZipFile(filePaht){

  console.log('Welcome unZipFile() '+ filePaht);

  var arr = filePaht.toString().split("/");
  var fileName = arr[arr.length-1]
  const DOWNLOAD_DIR = path.resolve('./backend/downloadFiles/fundConnext/');
  const DOWNLOAD_DIR2 = './backend/downloadFiles/fundConnext/';
  var _zipFile= DOWNLOAD_DIR+'/'+fileName;
  var _unzipPath="";


  return new Promise(function(resolve, reject) {

    //Unzip file
    try{
      var zip = new AdmZip(_zipFile);

      var zipEntries = zip.getEntries();
      zipEntries.forEach(function(zipEntry) {
        extAccFileName = zipEntry.entryName
    });

      zip.extractEntryTo(/*entry name*/extAccFileName, /*target path*/DOWNLOAD_DIR, /*maintainEntryPath*/false, /*overwrite*/true);

      //file removed
      fs.unlink(_zipFile, (err) => {
        if (err) {
          reject(err)
        }
        _unzipPath=_unzipPath.concat(DOWNLOAD_DIR,"/",extAccFileName);
        resolve(_unzipPath);
      })

    }
    catch (e) {
      reject(e)
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
    console.log('err fnFCAuth>' + e);
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
      console.log('ERR AUTH>>'+err);
      reject(err);
    });

  });

}


function fnNAVProcess(){

  console.log(`Welcome fnNAVProcess()`);
  return new Promise(function(resolve, reject) {

//     BEGIN
//     DECLARE @Fund_Id int;
//     DECLARE @AMCCode  varchar(15);
// 	DECLARE @FundCode varchar(30);
// 	DECLARE @AUM [decimal](18, 2)=0;
// 	DECLARE @NAV [decimal](18, 4)=0;
// 	DECLARE @OfferNAV [decimal](18, 4)=0;
// 	DECLARE @BidNAV [decimal](18, 4)=0;
// 	DECLARE @SwitchOutNAV [decimal](18, 4)=0;
// 	DECLARE @SwitchInNAV [decimal](18, 4)=0;
// 	DECLARE @NAVDate varchar(8) ='20190828';
// 	DECLARE @SACode varchar(15);
// 	DECLARE @TotalUnit [decimal](18, 4)=0;
// 	DECLARE @TotalAUM [decimal](18, 2)=0;

//     DECLARE FC_NAV_cursor CURSOR LOCAL  FOR

//     select A.[Fund_Id],
//     B.AMCCode,B.FundCode,B.AUM,B.NAV,B.OfferNAV,B.BidNAV,B.SwitchOutNAV,B.SwitchInNAV,B.SACode,B.TotalUnit,B.TotalAUM
//     from MFTS_Fund A,MIT_FC_NAV B
//     WHERE  A.Fund_Code=B.FundCode
//     AND B.NAVDate=@NAVDate;

//     OPEN FC_NAV_cursor
//         FETCH NEXT FROM FC_NAV_cursor INTO @Fund_Id,@AMCCode,@FundCode,@AUM,@NAV,@OfferNAV,@BidNAV,@SwitchOutNAV,@SwitchInNAV,@SACode,@TotalUnit,@TotalAUM

//             WHILE @@FETCH_STATUS = 0
//             BEGIN

//                 SELECT  *
//                 FROM MFTS_NavTable
//                 WHERE  convert(varchar, Close_Date, 112)=@NAVDate
//                 AND Fund_Id =@Fund_Id

//                 IF @@ROWCOUNT > 0
//                     BEGIN
//                         PRINT 'Update'
//                         update MFTS_NavTable
//                         SET [Fund_Id]=@Fund_Id,
//                         [Close_Date]=@NAVDate,
//                         [Asset_Size]=@AUM,
//                         [Nav_Price]=@NAV ,
//                         [Offer_Price]= @OfferNAV,
//                         [Bid_Price]=@BidNAV,
//                         [OfferSwitch_Price]=@SwitchInNAV,
//                         [BidSwitch_Price] =@SwitchOutNAV,
//                         [Modify_By] ='MIT_SYSTEM',
//                         [Modify_Date] =getdate()
//                         WHERE  convert(varchar, Close_Date, 112)=@NAVDate
//                         AND Fund_Id =@Fund_Id

//                     END
//                 ELSE
//                     BEGIN
//                         PRINT 'Insert '
//                         Insert into MFTS_NavTable
//                         ([Fund_Id],[Close_Date],[Asset_Size],[Nav_Price] ,[Offer_Price] ,[Bid_Price],[OfferSwitch_Price],[BidSwitch_Price],[Create_By] ,[Create_Date])
//                         VALUES(@Fund_Id,@NAVDate,@AUM,@NAV,@OfferNAV,@BidNAV,@SwitchOutNAV,@SwitchInNAV,'MIT_SYSTEM',getdate())
//                     END
//                 FETCH NEXT FROM FC_NAV_cursor INTO @Fund_Id,@AMCCode,@FundCode,@AUM,@NAV,@OfferNAV,@BidNAV,@SwitchOutNAV,@SwitchInNAV,@SACode,@TotalUnit,@TotalAUM
//             END

//     CLOSE FC_NAV_cursor
//     DEALLOCATE FC_NAV_cursor

// -- 1. Get FC NAV list
// -- 2. Check for insert or update

// END

  });
}
