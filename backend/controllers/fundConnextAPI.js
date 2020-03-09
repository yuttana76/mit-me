const readline = require('readline');
const fs = require('fs');
const path = require('path');
const dbConfig = require('../config/db-config');
const FC_API_Config = require('../config/fundConnextAPI');
var logger = require("../config/winston");
// const log = require('logger')('myfilename');

var mail = require('./mail');
const https = require('https')
const download = require('download');
const { check, validationResult } = require('express-validator');
var AdmZip = require('adm-zip');
var CronJob = require('cron').CronJob;
var mitLog = require('./mitLog');
var  FCCustInfo = require('../models/fcCustInfo.model');
var  util = require('./utility');

const FC_API_URI= FC_API_Config.FC_API_URI
const FC_API_AUTH=FC_API_Config.FC_API_AUTH

const FC_AUTH_PATH = FC_API_Config.FC_API_PATH.AUTH_PATH
const FC_DOWNLOAD_PATH = FC_API_Config.FC_API_PATH.DOWNLOAD_PATH
const DOWNLOAD_PATH  = FC_API_Config.LOCAL.DOWNLOAD_PATH
const INVEST_PROFILE_PATH = FC_API_Config.FC_API_PATH.INVEST_PROFILE_PATH
const INVEST_INDIVIDUAL = FC_API_Config.FC_API_PATH.INVEST_INDIVIDUAL
const FC_API_MODULE ='FC API';

var config_BULK = dbConfig.dbParameters_BULK;
var config = dbConfig.dbParameters;

exports.getIndCust = (req, res, next) =>{

  logger.info("Validate API /GetIndCust/");
  var actionBy = req.params.actionBy || 'SYSTEM';

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  var cardNumber = req.params.cardNumber;
  logger.info("Welcome API /GetIndCust/"+ cardNumber);

    fnGetIndCust(cardNumber).then(obj=>{

      // console.log('FC result->' + JSON.stringify(obj))
      if(obj.errMsg){
        // {"errMsg":{"code":"E114","message":"Customer not found"}}
        // res.status(200).json({"code":obj.errMsg.code,"message":obj.errMsg.message});
        res.status(200).json(obj.errMsg);
      }

      getIndCustDEVProc(obj,actionBy).then(result=>{
        res.status(200).json(result);
      },err=>{
        res.status(401).json(err);
      });

    },err=>{
      res.status(401).json(err);
    });

}


exports.getIndCustDEV = (req, res, next) =>{

  logger.info(" API /individual-DEV");

  const custInfoObj = new FCCustInfo();
  var actionBy = req.params.actionBy || 'SYSTEM';

  getIndCustDEVProc(custInfoObj.getCustInfo(),actionBy).then(result=>{

    res.status(200).json(result);

    },err=>{

      res.status(401).json({code:1,msg:err});
    });
}


exports.updateCustomerIndPartial = (req, res, next) =>{

  logger.info("Validate API /updateCustomerInd/");

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  // On develop
  // var fcCustInfoObj = JSON.parse(req.body.fcCustInfo)
  // var actionBy = req.body.actionBy;

  var identificationCardType = req.body.identificationCardType;
  var passportCountry = req.body.passportCountry;

  var cardNumber = req.body.cardNumber;
  var referralPerson = req.body.referralPerson;
  var approved = req.body.approved;

  var suitabilityRiskLevel = req.body.suitabilityRiskLevel;
  var suitabilityEvaluationDate = req.body.suitabilityEvaluationDate;

  var fatca = req.body.fatca;
  var fatcaDeclarationDate = req.body.fatcaDeclarationDate;

  var cddScore = req.body.cddScore;
  var cddDate = req.body.cddDate;
  var actionBy = req.body.actionBy;

  logger.info("Welcome API /updateCustomerInd/"+ cardNumber);

  var currentDate = util.getDate_yyyymmdd();

  if(!suitabilityEvaluationDate){
    suitabilityEvaluationDate=currentDate;
  }
  if(!fatcaDeclarationDate){
    fatcaDeclarationDate=currentDate;
  }
  if(!cddDate){
    cddDate=currentDate;
  }

  // EXECUTE
  fnArray=[];
    // fnArray.push(updateMFTSsuit(cardNumber,suitabilityRiskLevel,suitabilityEvaluationDate,actionBy));
  // fnArray.push(updateMIT_ACCOUNT_INFO_EXT(cardNumber ,cddScore, cddDate ,suitabilityRiskLevel,suitabilityEvaluationDate , fatca ,fatcaDeclarationDate ,actionBy));

  fnArray.push(updateCustomerIndPartial(req,identificationCardType,passportCountry,cardNumber,referralPerson,approved,suitabilityRiskLevel,suitabilityEvaluationDate,fatca,fatcaDeclarationDate,cddScore,cddDate,actionBy));
  fnArray.push(execACCOUNT_INFO(cardNumber,actionBy)); // 1. Account_Info & MIT_ACCOUNT_INFO_EXT
  fnArray.push(execCUST_ADDR(cardNumber,1,actionBy)); // 2.1 Residence MFTS_Holder_Address  & MIT_CUST_ADDR
  fnArray.push(execCUST_ADDR(cardNumber,2,actionBy)); // 2.2 Current MFTS_Holder_Address  & MIT_CUST_ADDR
  fnArray.push(execCUST_ADDR(cardNumber,3,actionBy)); // 2.3 Work MFTS_Holder_Address  & MIT_CUST_ADDR

  fnArray.push(execCUST_CHILDREN(cardNumber,actionBy)); // 2. MIT_CUST_CHILDREN
  fnArray.push(execSUIT(cardNumber,actionBy)); // 2. MIT_CUST_CHILDREN


  Promise.all(fnArray)
  .then(result => {

    console.log('RS>>' +JSON.stringify(result));
    res.status(200).json({code:"000",resust:result[0]});
  })
  .catch(error => {

    logger.error(error.message)
    res.status(401).json(error.message);
  });

}

// GET
function getIndCustDEVProc(custInfoObj,actionBy){
  console.log("Welcome getIndCustDEVProc()"+ JSON.stringify(custInfoObj));

  return new Promise(function(resolve, reject) {

    // 1 MIT_FC_CUST_INFO
    saveMIT_FC_CUST_INFO(custInfoObj,actionBy).then((result)=>{
      logger.info("MIT_FC_CUST_INFO() successful")
    },err=>{
      logger.error("ERROR MIT_FC_CUST_INFO() :" + err)
      reject(err);
    })

    // 2 MIT_FC_CUST_ADDR
    saveMIT_FC_CUST_ADDR(custInfoObj,actionBy).then(result=>{
      logger.info("saveMIT_FC_CUST_ADDR() successful")
    },err=>{
      logger.error("saveMIT_FC_CUST_ADDR() error:" + err)
      reject(err);
    })

    // 3	MIT_FC_CUST_CHILDREN
    saveMIT_FC_CUST_CHILDREN(custInfoObj,actionBy).then(result=>{
      logger.info("saveMIT_FC_CUST_CHILDREN() successful")
    },err=>{
      logger.error("saveMIT_FC_CUST_CHILDREN() error:" + err)
      reject(err);
    })

    // 4	MIT_FC_CUST_ACCOUNT
    saveMIT_FC_CUST_ACCOUNT(custInfoObj,actionBy).then(result=>{
      logger.info("saveMIT_FC_CUST_ACCOUNT() successful")
    },err=>{
      logger.error("saveMIT_FC_CUST_ACCOUNT() error:" + err)
      reject(err);
    })

    // 5	MIT_FC_CUST_BANK
    // 6	MIT_FC_CUST_SUIT

    if(custInfoObj.suitability){
      saveMIT_FC_CUST_SUIT_Detail(custInfoObj.cardNumber,custInfoObj,actionBy).then((result)=>{
        logger.info("saveMIT_FC_CUST_SUIT_Detail() successful")

        },err=>{
          logger.error("saveMIT_FC_CUST_SUIT_Detail() error:" + err)
          reject(err);
        })
    }


      resolve({code:0})

  });
}


function saveMIT_FC_CUST_INFO(custInfoObj,actionBy) {

  logger.info('saveMIT_FC_CUST_INFO()');

  if(custInfoObj.cardExpiryDate ==='N/A')
    custInfoObj.cardExpiryDate=''

  var fncName = "saveMIT_FC_CUST_INFO()";
  var queryStr = `
  BEGIN

    UPDATE MIT_FC_CUST_INFO
    SET
    thFirstName=@thFirstName
    ,thLastName=@thLastName
    ,birthDate=@birthDate
    ,mobileNumber=@mobileNumber
    ,email=@email
    ,occupationId=@occupationId
    ,occupationOther=@occupationOther
    ,businessTypeId=@businessTypeId
    ,businessTypeOther=@businessTypeOther
    ,monthlyIncomeLevel=@monthlyIncomeLevel
    ,incomeSource=@incomeSource
    ,incomeSourceOther=@incomeSourceOther
    ,companyName=@companyName
    ,identificationCardType=@identificationCardType
    ,passportCountry=@passportCountry
    ,title=@title
    ,titleOther=@titleOther
    ,enFirstName=@enFirstName
    ,enLastName=@enLastName
    ,cardExpiryDate=@cardExpiryDate
    ,maritalStatus=@maritalStatus
    ,SPidentificationCardType=@SPidentificationCardType
    ,SPpassportCountry=@SPpassportCountry
    ,SPcardNumber=@SPcardNumber
    ,SPtitle=@SPtitle
    ,SPtitleOther=@SPtitleOther
    ,SPthFirstName=@SPthFirstName
    ,SPthLastName=@SPthLastName
    ,SPidCardExpiryDate=@SPidCardExpiryDate
    ,SPphoneNumber=@SPphoneNumber
    ,committedMoneyLaundering=@committedMoneyLaundering
    ,politicalRelatedPerson=@politicalRelatedPerson
    ,rejectFinancialTransaction=@rejectFinancialTransaction
    ,confirmTaxDeduction=@confirmTaxDeduction
    ,nationality=@nationality
    ,cddScore=@cddScore
    ,cddDate=@cddDate
    ,canAcceptDerivativeInvestment=@canAcceptDerivativeInvestment
    ,canAcceptFxRisk=@canAcceptFxRisk
    ,accompanyingDocument=@accompanyingDocument
    ,gender=@gender
    ,referalPerson=@referalPerson
    ,applicationDate=@applicationDate
    ,incomeSourceCountry=@incomeSourceCountry
    ,acceptBy=@acceptBy
    ,openFundConnextFormFlag=@openFundConnextFormFlag
    ,approved=@approved
    ,vulnerableFlag=@vulnerableFlag
    ,vulnerableDetail=@vulnerableDetail
    ,ndidFlag=@ndidFlag
    ,ndidRequestId=@ndidRequestId
    ,suitabilityRiskLevel=@suitabilityRiskLevel
    ,suitabilityEvaluationDate=@suitabilityEvaluationDate
    ,fatca=@fatca
    ,fatcaDeclarationDate=@fatcaDeclarationDate

    ,workAddressSameAsFlag=@workAddressSameAsFlag
    ,currentAddressSameAsFlag=@currentAddressSameAsFlag

    ,CreateBy=@CreateBy
    ,CreateDate=getdate()
    WHERE cardNumber=@cardNumber


    IF @@ROWCOUNT =0
    BEGIN
        INSERT INTO MIT_FC_CUST_INFO (
          cardNumber
          ,thFirstName
          ,thLastName
          ,birthDate
          ,mobileNumber
          ,email
          ,occupationId
          ,occupationOther
          ,businessTypeId
          ,businessTypeOther
          ,monthlyIncomeLevel
          ,incomeSource
          ,incomeSourceOther
          ,companyName
          ,identificationCardType
          ,passportCountry
          ,title
          ,titleOther
          ,enFirstName
          ,enLastName
          ,cardExpiryDate
          ,maritalStatus
          ,SPidentificationCardType
          ,SPpassportCountry
          ,SPcardNumber
          ,SPtitle
          ,SPtitleOther
          ,SPthFirstName
          ,SPthLastName
          ,SPidCardExpiryDate
          ,SPphoneNumber
          ,committedMoneyLaundering
          ,politicalRelatedPerson
          ,rejectFinancialTransaction
          ,confirmTaxDeduction
          ,nationality
          ,cddScore
          ,cddDate
          ,canAcceptDerivativeInvestment
          ,canAcceptFxRisk
          ,accompanyingDocument
          ,gender
          ,referalPerson
          ,applicationDate
          ,incomeSourceCountry
          ,acceptBy
          ,openFundConnextFormFlag
          ,approved
          ,vulnerableFlag
          ,vulnerableDetail
          ,ndidFlag
          ,ndidRequestId
          ,suitabilityRiskLevel
          ,suitabilityEvaluationDate
          ,fatca
          ,fatcaDeclarationDate
          ,workAddressSameAsFlag
          ,currentAddressSameAsFlag
          ,CreateBy
          ,CreateDate)
        VALUES(
           @cardNumber
          ,@thFirstName
          ,@thLastName
          ,@birthDate
          ,@mobileNumber
          ,@email
          ,@occupationId
          ,@occupationOther
          ,@businessTypeId
          ,@businessTypeOther
          ,@monthlyIncomeLevel
          ,@incomeSource
          ,@incomeSourceOther
          ,@companyName
          ,@identificationCardType
          ,@passportCountry
          ,@title
          ,@titleOther
          ,@enFirstName
          ,@enLastName
          ,@cardExpiryDate
          ,@maritalStatus
          ,@SPidentificationCardType
          ,@SPpassportCountry
          ,@SPcardNumber
          ,@SPtitle
          ,@SPtitleOther
          ,@SPthFirstName
          ,@SPthLastName
          ,@SPidCardExpiryDate
          ,@SPphoneNumber
          ,@committedMoneyLaundering
          ,@politicalRelatedPerson
          ,@rejectFinancialTransaction
          ,@confirmTaxDeduction
          ,@nationality
          ,@cddScore
          ,@cddDate
          ,@canAcceptDerivativeInvestment
          ,@canAcceptFxRisk
          ,@accompanyingDocument
          ,@gender
          ,@referalPerson
          ,@applicationDate
          ,@incomeSourceCountry
          ,@acceptBy
          ,@openFundConnextFormFlag
          ,@approved
          ,@vulnerableFlag
          ,@vulnerableDetail
          ,@ndidFlag
          ,@ndidRequestId
          ,@suitabilityRiskLevel
          ,@suitabilityEvaluationDate
          ,@fatca
          ,@fatcaDeclarationDate
          ,@workAddressSameAsFlag
          ,@currentAddressSameAsFlag
          ,@CreateBy
          ,getdate())
    END

  END
    `;
  const sql = require("mssql");
  return new Promise(function(resolve, reject) {

    try{
    const pool1 = new sql.ConnectionPool(config, err => {
      pool1
        .request() // or: new sql.Request(pool1)
        .input("cardNumber", sql.VarChar(20), custInfoObj.cardNumber)
        .input("thFirstName", sql.NVarChar(100), custInfoObj.thFirstName)
        .input("thLastName", sql.NVarChar(100), custInfoObj.thLastName)
        .input("birthDate", sql.VarChar(10), custInfoObj.birthDate || '')
        .input("mobileNumber", sql.VarChar(50), custInfoObj.mobileNumber)
        .input("email", sql.NVarChar(100), custInfoObj.email)
        .input("occupationId", sql.VarChar(3), custInfoObj.occupationId)
        .input("occupationOther", sql.NVarChar(100), custInfoObj.occupationOther)
        .input("businessTypeId", sql.VarChar(3), custInfoObj.businessTypeId)
        .input("businessTypeOther", sql.NVarChar(50), custInfoObj.businessTypeOther)
        .input("monthlyIncomeLevel", sql.VarChar(10), custInfoObj.monthlyIncomeLevel)
        .input("incomeSource", sql.VarChar(100), custInfoObj.incomeSource)
        .input("incomeSourceOther", sql.NVarChar(100), custInfoObj.incomeSourceOther)
        .input("companyName", sql.NVarChar(200), custInfoObj.companyName)
        .input("identificationCardType", sql.VarChar(15), custInfoObj.identificationCardType)
        .input("passportCountry", sql.VarChar(2), custInfoObj.passportCountry)
        .input("title", sql.VarChar(5), custInfoObj.title)
        .input("titleOther", sql.NVarChar(100), custInfoObj.titleOther)
        .input("enFirstName", sql.NVarChar(100), custInfoObj.enFirstName)
        .input("enLastName", sql.NVarChar(100), custInfoObj.enLastName)
        .input("cardExpiryDate", sql.VarChar(10), custInfoObj.cardExpiryDate || '')
        .input("maritalStatus", sql.VarChar(10), custInfoObj.maritalStatus)
        .input("SPidentificationCardType", sql.VarChar(15), custInfoObj.spouse.identificationCardType)
        .input("SPpassportCountry", sql.VarChar(2), custInfoObj.spouse.passportCountry)
        .input("SPcardNumber", sql.VarChar(13), custInfoObj.spouse.cardNumber)
        .input("SPtitle", sql.VarChar(5), custInfoObj.spouse.title)
        .input("SPtitleOther", sql.NVarChar(100), custInfoObj.spouse.titleOther)
        .input("SPthFirstName", sql.NVarChar(50), custInfoObj.spouse.thFirstName)
        .input("SPthLastName", sql.NVarChar(50), custInfoObj.spouse.thLastName)
        .input("SPidCardExpiryDate", sql.VarChar(10), custInfoObj.spouse.idCardExpiryDate || '')
        .input("SPphoneNumber", sql.VarChar(20), custInfoObj.spouse.phoneNumber)
        .input("committedMoneyLaundering", sql.VarChar(10), custInfoObj.committedMoneyLaundering)
        .input("politicalRelatedPerson", sql.VarChar(10), custInfoObj.politicalRelatedPerson)
        .input("rejectFinancialTransaction", sql.VarChar(10), custInfoObj.rejectFinancialTransaction)
        .input("confirmTaxDeduction", sql.VarChar(10), custInfoObj.confirmTaxDeduction)
        .input("nationality", sql.VarChar(2), custInfoObj.nationality)
        .input("cddScore", sql.VarChar(1), custInfoObj.cddScore)
        .input("cddDate", sql.VarChar(10), custInfoObj.cddDate || '')
        .input("canAcceptDerivativeInvestment", sql.VarChar(10), custInfoObj.canAcceptDerivativeInvestment)
        .input("canAcceptFxRisk", sql.VarChar(10), custInfoObj.canAcceptFxRisk)
        .input("accompanyingDocument", sql.VarChar(20), custInfoObj.accompanyingDocument)
        .input("gender", sql.VarChar(10), custInfoObj.gender)
        .input("referalPerson", sql.NVarChar(100), custInfoObj.referalPerson)
        .input("applicationDate", sql.VarChar(10), custInfoObj.applicationDate || '')
        .input("incomeSourceCountry", sql.VarChar(2), custInfoObj.incomeSourceCountry)
        .input("acceptBy", sql.NVarChar(100), custInfoObj.acceptBy)
        .input("openFundConnextFormFlag", sql.VarChar(10), custInfoObj.openFundConnextFormFlag)
        .input("approved", sql.VarChar(10), custInfoObj.approved)
        .input("vulnerableFlag", sql.VarChar(10), custInfoObj.vulnerableFlag)
        .input("vulnerableDetail", sql.NVarChar(100), custInfoObj.vulnerableDetail)
        .input("ndidFlag", sql.VarChar(10), custInfoObj.ndidFlag)
        .input("ndidRequestId", sql.VarChar(100), custInfoObj.ndidRequestId)
        .input("suitabilityRiskLevel", sql.VarChar(1), custInfoObj.suitabilityRiskLevel)
        .input("suitabilityEvaluationDate", sql.VarChar(10), custInfoObj.suitabilityEvaluationDate || '')
        .input("fatca", sql.VarChar(10), custInfoObj.fatca)
        .input("fatcaDeclarationDate", sql.VarChar(10), custInfoObj.fatcaDeclarationDate || '')

        .input("workAddressSameAsFlag", sql.VarChar(50), custInfoObj.workAddressSameAsFlag)
        .input("currentAddressSameAsFlag", sql.VarChar(50), custInfoObj.currentAddressSameAsFlag)

        .input("CreateBy", sql.VarChar(50), actionBy)
        .query(queryStr, (err, result) => {
          if (err) {
            console.log(fncName + " Quey db. Was err !!!" + err);
            reject(err);
          } else {
            resolve(result);
          }

        });
    });

    pool1.on("error", err => {
      console.log("ERROR>>" + err);
      reject(err);

    });

  }catch(e){
    logger.error(e);
  }

  });

}


function saveMIT_FC_CUST_ACCOUNT(obj,actionBy) {
  logger.info('saveMIT_FC_CUST_ACCOUNT()'+obj.cardNumber);

  return new Promise(function(resolve, reject) {

    if(obj.accounts){
      for(var i = 0; i < obj.accounts.length;i++){

        logger.info(`Save accounts ${i}  ${obj.accounts[i].accountId}`);
        logger.info(`subscriptionBankAccounts >> ${i}  ${obj.accounts[i].subscriptionBankAccounts.length}`);
        logger.info(`redemptionBankAccounts >> ${i}  ${obj.accounts[i].redemptionBankAccounts.length}`);

        // subscriptionBankAccounts
        if(obj.accounts[i].subscriptionBankAccounts && obj.accounts[i].subscriptionBankAccounts.length >0){
          for(var j = 0; j < obj.accounts[i].subscriptionBankAccounts.length;j++){
            saveMIT_FC_CUST_BANK_Detail(obj.cardNumber,obj.accounts[i].accountId,'sub',obj.accounts[i].subscriptionBankAccounts[j],actionBy)
          }

        }
        // redemptionBankAccounts
        if(obj.accounts[i].redemptionBankAccounts && obj.accounts[i].redemptionBankAccounts.length >0){
          for(var j = 0; j < obj.accounts[i].redemptionBankAccounts.length;j++){
            saveMIT_FC_CUST_BANK_Detail(obj.cardNumber,obj.accounts[i].accountId,'red',obj.accounts[i].redemptionBankAccounts[j],actionBy)
          }

        }

        saveMIT_FC_CUST_ACCOUNT_Detail(obj.cardNumber,obj.accounts[i],actionBy).then((result=>{
          logger.info(`Save accounts ${i} complete`);
        }));

      }
      resolve({code:0});

    }else{
      resolve({code:1,message:"Not found children"});
    }

  });
}


// function saveMIT_FC_CUST_BANK(cardNumber,obj,actionBy) {
//   logger.info('saveMIT_FC_CUST_BANK()'+cardNumber);

//   return new Promise(function(resolve, reject) {

//     if(obj.accounts){
//       for(var i = 0; i < obj.accounts.length;i++){

//         logger.info(`Save accounts ${i}  ${obj.accounts[i].accountId}`);

//         saveMIT_FC_CUST_ACCOUNT_Detail(obj.cardNumber,obj.accounts[i],actionBy).then((result=>{
//           logger.info(`Save accounts ${i} complete`);
//         }));

//       }
//       resolve({code:0});

//     }else{
//       resolve({code:1,message:"Not found children"});
//     }

//   });
// }



function saveMIT_FC_CUST_ACCOUNT_Detail(cardNumber,obj,actionBy) {

  logger.info('saveMIT_FC_CUST_ACCOUNT_Detail()'+obj.cardNumber);

  var fncName = "saveMIT_FC_CUST_ACCOUNT_Detail()";
  var queryStr = `
  BEGIN
    UPDATE MIT_FC_CUST_ACCOUNT
    SET
    icLicense=@icLicense
    ,accountOpenDate=@accountOpenDate
    ,investmentObjective=@investmentObjective
    ,investmentObjectiveOther=@investmentObjectiveOther
    ,approvedDate=@approvedDate
    ,mailingAddressSameAsFlag=@mailingAddressSameAsFlag
    ,openOmnibusFormFlag=@openOmnibusFormFlag
    ,CreateBy=@CreateBy
    ,CreateDate=getdate()
    WHERE cardNumber=@cardNumber AND accountId=@accountId

   IF @@ROWCOUNT =0
    BEGIN
        INSERT INTO MIT_FC_CUST_ACCOUNT (
        cardNumber
        ,accountId
        ,icLicense
        ,accountOpenDate
        ,investmentObjective
        ,investmentObjectiveOther
        ,approvedDate
        ,mailingAddressSameAsFlag
        ,openOmnibusFormFlag
        ,CreateBy
        ,CreateDate)
      VALUES(
        @cardNumber
        ,@accountId
        ,@icLicense
        ,@accountOpenDate
        ,@investmentObjective
        ,@investmentObjectiveOther
        ,@approvedDate
        ,@mailingAddressSameAsFlag
        ,@openOmnibusFormFlag
          ,@CreateBy
          ,getdate())
    END
  END

    `;
  const sql = require("mssql");
  return new Promise(function(resolve, reject) {
    const pool1 = new sql.ConnectionPool(config, err => {
      pool1
        .request() // or: new sql.Request(pool1)
        .input("cardNumber", sql.VarChar(13), cardNumber)
        .input("accountId", sql.VarChar(20), obj.accountId)
        .input("icLicense", sql.VarChar(20), obj.icLicense)
        .input("accountOpenDate", sql.VarChar(20), obj.accountOpenDate)
        .input("investmentObjective", sql.NVarChar(100), obj.investmentObjective)
        .input("investmentObjectiveOther", sql.NVarChar(100), obj.investmentObjectiveOther)
        .input("approvedDate", sql.VarChar(20), obj.approvedDate)
        .input("mailingAddressSameAsFlag", sql.VarChar(20), obj.mailingAddressSameAsFlag)
        .input("openOmnibusFormFlag", sql.VarChar(10), obj.openOmnibusFormFlag)
        .input("CreateBy", sql.VarChar(50), actionBy)
        .query(queryStr, (err, result) => {
          if (err) {
            console.log(fncName + " Quey db. Was err !!!" + err);
            reject(err);

          } else {
            // console.log(" Quey RS>>" + JSON.stringify(result));
            resolve(result);

          }
        });
    });
    pool1.on("error", err => {
      console.log("ERROR>>" + err);
      reject(err);
    });
  });
}

function saveMIT_FC_CUST_CHILDREN(obj,actionBy) {
  logger.info('saveMIT_FC_CUST_CHILDREN()'+obj.cardNumber);

  return new Promise(function(resolve, reject) {

    if(obj.children){
      console.log("Has children");
      for(var i = 0; i < obj.children.length;i++){

        saveMIT_FC_CUST_CHILDREN_Detail(obj.cardNumber,obj.children[i],actionBy).then((result=>{
          logger.info(`Save children ${i} complete`);
        }));

      }
      resolve({code:0});

    }else{
      resolve({code:1,message:"Not found children"});
    }

  });
}

function saveMIT_FC_CUST_CHILDREN_Detail(cardNumber,obj,actionBy) {

  logger.info('saveMIT_FC_CUST_CHILDREN_Detail()'+obj.cardNumber);

  var fncName = "saveMIT_FC_CUST_CHILDREN_Detail()";
  var queryStr = `
  BEGIN
    UPDATE MIT_FC_CUST_CHILDREN
    SET
    identificationCardType=@identificationCardType
    ,passportCountry=@passportCountry
    ,idCardExpiryDate=@idCardExpiryDate
    ,title=@title
    ,thFirstName=@thFirstName
    ,thLastName=@thLastName
    ,birthDate=@birthDate
    ,CreateBy=@CreateBy
    ,CreateDate=getdate()
    WHERE cardNumber=@cardNumber AND childCardNumber=@childCardNumber

    IF @@ROWCOUNT =0
    BEGIN
        INSERT INTO MIT_FC_CUST_CHILDREN (
        cardNumber
        ,childCardNumber
        ,identificationCardType
        ,passportCountry
        ,idCardExpiryDate
        ,title
        ,thFirstName
        ,thLastName
        ,birthDate
          ,CreateBy
          ,CreateDate)
        VALUES(
          @cardNumber
        ,@childCardNumber
        ,@identificationCardType
        ,@passportCountry
        ,@idCardExpiryDate
        ,@title
        ,@thFirstName
        ,@thLastName
        ,@birthDate
          ,@CreateBy
          ,getdate())
    END

  END
    `;
  const sql = require("mssql");
  return new Promise(function(resolve, reject) {
    const pool1 = new sql.ConnectionPool(config, err => {
      pool1
        .request() // or: new sql.Request(pool1)
        .input("cardNumber", sql.VarChar(13), cardNumber)
        // .input("childCardNumber", sql.VarChar(20),obj.cardNumber)
        .input("childCardNumber", sql.VarChar(13),obj.cardNumber)
        .input("identificationCardType", sql.VarChar(20),obj.identificationCardType)
        .input("passportCountry", sql.NVarChar(20),obj.passportCountry)
        .input("idCardExpiryDate", sql.VarChar(20),obj.idCardExpiryDate)
        .input("title", sql.VarChar(20),obj.title)
        .input("thFirstName", sql.NVarChar(20),obj.thFirstName)
        .input("thLastName", sql.NVarChar(20),obj.thLastName)
        .input("birthDate", sql.VarChar(20),obj.birthDate)
        .input("CreateBy", sql.VarChar(50), actionBy)
        .query(queryStr, (err, result) => {
          if (err) {
            console.log(fncName + " Quey db. Was err !!!" + err);
            reject(err);

          } else {
            // console.log(" Quey RS>>" + JSON.stringify(result));
            resolve(result);

          }
        });
    });
    pool1.on("error", err => {
      console.log("ERROR>>" + err);
      reject(err);

    });
  });
}

function saveMIT_FC_CUST_BANK_Detail(cardNumber,accountId,accType,obj,actionBy) {

  logger.info('saveMIT_FC_CUST_BANK_Detail()'+cardNumber);
  logger.info('saveMIT_FC_CUST_BANK_Detail()'+JSON.stringify(obj));

  var fncName = "saveMIT_FC_CUST_BANK_Detail()";
  var queryStr = `
    BEGIN
      UPDATE MIT_FC_CUST_BANK
      SET
      cardNumber=@cardNumber
      ,accountId=@accountId
      ,accType=@accType
      ,bankCode=@bankCode
      ,bankBranchCode=@bankBranchCode
      ,bankAccountNo=@bankAccountNo
      ,[default]=@default
      ,finnetCustomerNo=@finnetCustomerNo
      ,CreateBy=@CreateBy
      ,CreateDate=getdate()
      WHERE cardNumber=@cardNumber AND bankAccountNo=@bankAccountNo AND accType=@accType AND accountId=@accountId

      IF @@ROWCOUNT =0
      BEGIN
          INSERT INTO MIT_FC_CUST_BANK (
          cardNumber
          ,accountId
          ,accType
          ,bankCode
          ,bankBranchCode
          ,bankAccountNo
          ,[default]
          ,finnetCustomerNo
            ,CreateBy
            ,CreateDate)
          VALUES(
            @cardNumber
            ,@accountId
            ,@accType
          ,@bankCode
          ,@bankBranchCode
          ,@bankAccountNo
          ,@default
          ,@finnetCustomerNo
            ,@CreateBy
            ,getdate())
      END

  END
    `;
  const sql = require("mssql");
  return new Promise(function(resolve, reject) {
    const pool1 = new sql.ConnectionPool(config, err => {
      pool1
        .request() // or: new sql.Request(pool1)
        .input("cardNumber", sql.VarChar(13), cardNumber)
        .input("accountId", sql.VarChar(10), accountId)
        .input("accType", sql.VarChar(10), accType)
        .input("bankCode", sql.VarChar(4),obj.bankCode)
        .input("bankBranchCode", sql.VarChar(5),obj.bankBranchCode)
        .input("bankAccountNo", sql.NVarChar(20),obj.bankAccountNo)
        .input("default", sql.VarChar(10),obj.default)
        .input("finnetCustomerNo", sql.VarChar(30),obj.finnetCustomerNo)
        .input("CreateBy", sql.VarChar(50), actionBy)
        .query(queryStr, (err, result) => {
          if (err) {
            logger.error(fncName + " Quey db. Was err !!!" + err);
            reject(err);

          } else {
            // console.log(" Quey RS>>" + JSON.stringify(result));
            resolve(result);

          }
        });
    });
    pool1.on("error", err => {
      console.log("ERROR>>" + err);
      reject(err);

    });
  });

}

function saveMIT_FC_CUST_ADDR(obj,actionBy) {
  logger.info('saveMIT_FC_CUST_ADDR()'+obj.cardNumber);

  return new Promise(function(resolve, reject) {
  // 1:Resident
  // let addrObj = obj.residence;
  if(obj.residence){
    saveMIT_FC_CUST_ADDR_Detail(obj.cardNumber,obj.residence,1,actionBy).then((result=>{
      logger.info(" Save Resident complete");
    }));
  }

  // 2:Current
  // let curObj = obj.contact;
  // if(obj.contact){
  //   saveMIT_FC_CUST_ADDR_Detail(obj.cardNumber,obj.contact,2,actionBy).then((result=>{
  //     logger.info(" Save Current address complete");
  //   }));
  // }
  if(obj.current){
    saveMIT_FC_CUST_ADDR_Detail(obj.cardNumber,obj.current,2,actionBy).then((result=>{
      logger.info(" Save Current address complete");
    }));
  }

  // 3:Work
  // let workObj = obj.work;
  if(obj.work){
    saveMIT_FC_CUST_ADDR_Detail(obj.cardNumber,obj.work,3,actionBy).then((result=>{
      logger.info(" Save Work address complete");
    }));
  }

  resolve({code:0});

  });

}

function saveMIT_FC_CUST_ADDR_Detail(cardNumber,obj,seq,actionBy) {

  logger.info('saveMIT_FC_CUST_ADDR_Detail()'+seq);

  // logger.info('OBJ>>'+JSON.stringify(obj));

  var fncName = "saveMIT_FC_CUST_ADDR_Detail()";
  var queryStr = `
  BEGIN

    UPDATE MIT_FC_CUST_ADDR
    SET
    no=@no
    ,building=@building
    ,floor=@floor
    ,soi=@soi
    ,road=@road
    ,moo=@moo
    ,subDistrict=@subDistrict
    ,district=@district
    ,province=@province
    ,country=@country
    ,postalCode=@postalCode
    ,phoneNumber=@phoneNumber
    ,CreateBy=@CreateBy
    ,CreateDate=getdate()
    WHERE cardNumber=@cardNumber AND Addr_Seq= @Addr_Seq

    IF @@ROWCOUNT =0
    BEGIN
        INSERT INTO MIT_FC_CUST_ADDR (
          cardNumber
          ,Addr_Seq
          ,no
          ,building
          ,floor
          ,soi
          ,road
          ,moo
          ,subDistrict
          ,district
          ,province
          ,country
          ,postalCode
          ,phoneNumber
          ,CreateBy
          ,CreateDate)
        VALUES(
           @cardNumber
           ,@Addr_Seq
           ,@no
           ,@building
           ,@floor
           ,@soi
           ,@road
           ,@moo
           ,@subDistrict
           ,@district
           ,@province
           ,@country
           ,@postalCode
           ,@phoneNumber
          ,@CreateBy
          ,getdate())
    END

  END
    `;
  const sql = require("mssql");
  return new Promise(function(resolve, reject) {
    const pool1 = new sql.ConnectionPool(config, err => {
      pool1
        .request() // or: new sql.Request(pool1)
        .input("cardNumber", sql.VarChar(20), cardNumber)
        .input("Addr_Seq", sql.VarChar(2), seq)
        .input("no", sql.NVarChar(100), obj.no? obj.no:'')
        .input("building", sql.NVarChar(100), obj.building)
        .input("floor", sql.NVarChar(100), obj.floor)
        .input("soi", sql.NVarChar(100), obj.soi)
        .input("road", sql.NVarChar(100), obj.road)
        .input("moo", sql.NVarChar(100), obj.moo)
        .input("subDistrict", sql.NVarChar(100), obj.subdistrict)
        .input("district", sql.NVarChar(100), obj.district)
        .input("province", sql.NVarChar(100), obj.province)
        .input("country", sql.NVarChar(100), obj.country)
        .input("postalCode", sql.NVarChar(100), obj.postalCode)
        .input("phoneNumber", sql.NVarChar(100), obj.phoneNumber)
        .input("CreateBy", sql.VarChar(50), actionBy)
        .query(queryStr, (err, result) => {
          if (err) {
            console.log(fncName + " Quey db. Was err !!!" + err);
            reject(err);

          } else {
            // console.log(" Quey RS>>" + JSON.stringify(result));
            resolve(result);

          }
        });
    });
    pool1.on("error", err => {
      console.log("ERROR>>" + err);
      reject(err);

    });
  });

}



function saveMIT_FC_CUST_SUIT_Detail(cardNumber,obj,actionBy) {

  logger.info('saveMIT_FC_CUST_SUIT_Detail()'+obj.cardNumber);

  var fncName = "saveMIT_FC_CUST_SUIT_Detail()";
  var queryStr = `
  BEGIN

    UPDATE MIT_FC_CUST_SUIT
    SET
      suitNo1=@suitNo1
       ,suitNo2=@suitNo2
        ,suitNo3=@suitNo3
        ,suitNo4=@suitNo4
        ,suitNo5=@suitNo5
        ,suitNo6=@suitNo6
        ,suitNo7=@suitNo7
        ,suitNo8=@suitNo8
        ,suitNo9=@suitNo9
        ,suitNo10=@suitNo10
        ,suitNo11=@suitNo11
        ,suitNo12=@suitNo12
    ,CreateBy=@CreateBy
    ,CreateDate=getdate()
    WHERE cardNumber=@cardNumber

    IF @@ROWCOUNT =0
    BEGIN
        INSERT INTO MIT_FC_CUST_SUIT (
          cardNumber
          ,suitNo1
        ,suitNo2
        ,suitNo3
        ,suitNo4
        ,suitNo5
        ,suitNo6
        ,suitNo7
        ,suitNo8
        ,suitNo9
        ,suitNo10
        ,suitNo11
        ,suitNo12
          ,CreateBy
          ,CreateDate)
        VALUES(
           @cardNumber
           ,@suitNo1
           ,@suitNo2
          ,@suitNo3
          ,@suitNo4
          ,@suitNo5
          ,@suitNo6
          ,@suitNo7
          ,@suitNo8
          ,@suitNo9
          ,@suitNo10
          ,@suitNo11
          ,@suitNo12
          ,@CreateBy
          ,getdate())
    END

  END
    `;
  const sql = require("mssql");
  return new Promise(function(resolve, reject) {
    const pool1 = new sql.ConnectionPool(config, err => {
      pool1
        .request() // or: new sql.Request(pool1)
        .input("cardNumber", sql.VarChar(20), cardNumber)
        .input("suitNo1", sql.VarChar(1), obj.suitability.suitNo1)
        .input("suitNo2", sql.VarChar(1), obj.suitability.suitNo2)
        .input("suitNo3", sql.VarChar(1), obj.suitability.suitNo3)
        .input("suitNo4", sql.VarChar(10), obj.suitability.suitNo4)
        .input("suitNo5", sql.VarChar(1), obj.suitability.suitNo5)
        .input("suitNo6", sql.VarChar(1), obj.suitability.suitNo6)
        .input("suitNo7", sql.VarChar(1), obj.suitability.suitNo7)
        .input("suitNo8", sql.VarChar(1), obj.suitability.suitNo8)
        .input("suitNo9", sql.VarChar(1), obj.suitability.suitNo9)
        .input("suitNo10", sql.VarChar(1), obj.suitability.suitNo10)
        .input("suitNo11", sql.VarChar(1), obj.suitability.suitNo11)
        .input("suitNo12", sql.VarChar(1), obj.suitability.suitNo12)
        .input("CreateBy", sql.VarChar(50), actionBy)
        .query(queryStr, (err, result) => {
          if (err) {
            console.log(fncName + " Quey db. Was err !!!" + err);
            reject(err);
          } else {
            resolve(result);
          }
        });
    });
    pool1.on("error", err => {
      console.log("ERROR>>" + err);
      reject(err);
    });
  });

}

// GET
function fnGetIndCust(cardNumber){
  console.log("Welcome fnGetIndCust()"+ cardNumber);

  return new Promise(function(resolve, reject) {

    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0" //this is insecure

      /**
     * HTTPS REQUEST (START)
     */
    fnFCAuth().then(result =>{
      resultObj =JSON.parse(result);

        // console.log("AUTH result >>" + JSON.stringify(resultObj));
          const request = require('request');
          const HTTPS_ENDPOIN =`https://${FC_API_URI}${INVEST_PROFILE_PATH}?cardNumber=${cardNumber}`;
          const option = {
            'X-Auth-Token':resultObj.access_token,
          };

          console.log("OPTION>>" +JSON.stringify(option));

          request({url:HTTPS_ENDPOIN, headers:option}, function(err, response, body) {
            // logger.info(response.body.url);
            if(err) {
              logger.error(err);
              reject(err);
            }else{
              resolve(JSON.parse(body))
            }
          });
        /**
         * HTTPS REQUEST (END)
         */
      },err =>{
        console.log('ERR AUTH>>'+err);
        reject(err);
      });

  });

}

// PATCH
function updateCustomerIndPartial(req,identificationCardType,passportCountry,cardNumber,referralPerson,approved,suitabilityRiskLevel,suitabilityEvaluationDate,fatca,fatcaDeclarationDate,cddScore,cddDate,actionBy){

  logger.info("Welcome updateCustomerIndPartial()");

  return new Promise(function(resolve, reject) {

      process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0" //this is insecure

      var currentDate = util.getDate_yyyymmdd();
      /**
       * HTTPS REQUEST
       */
      fnFCAuth().then(result =>{
        resultObj =JSON.parse(result);

       var data={
        "identificationCardType": identificationCardType,
        "passportCountry": passportCountry,
        "cardNumber" : cardNumber,
        "referralPerson": referralPerson,
        "approved": approved,
        "suitabilityRiskLevel":"",
        "suitabilityEvaluationDate":"",
        "fatca":"",
        "fatcaDeclarationDate":"",
        "cddScore":"",
        "cddDate":"",
       };


      //  console.log('suitabilityRiskLevel>' + suitabilityRiskLevel);
       if(suitabilityRiskLevel){
        data["suitabilityRiskLevel"]=suitabilityRiskLevel;

        // Incase is suitabilityEvaluationDate input is null use current date
        if(suitabilityEvaluationDate){
          data["suitabilityEvaluationDate"]=suitabilityEvaluationDate;
        }else{
          data["suitabilityEvaluationDate"]=currentDate;
        }

       }

      //  console.log('fatca>' + fatca);
       if(fatca !='undefined' && fatca !=''){
        // console.log('fatca STEP 1>' +fatca);
          try {
            data.fatca=fatca.toLowerCase();
          }
          catch (e) {
            data.fatca=fatca;
          }

          // Incase is fatcaDeclarationDate input is null use current date
          if(fatcaDeclarationDate){
            data.fatcaDeclarationDate=fatcaDeclarationDate;
          }else{
            data.fatcaDeclarationDate=currentDate;
          }
       }

      //  console.log('cddScore >'+  cddScore);
       if(cddScore){
        data.cddScore=cddScore;

        // Incase is cddDate input is null use current date
        if(cddDate){
          data.cddDate=cddDate;
        }else{
          data.cddDate=currentDate;
        }
       }

      var options = {
        host: FC_API_URI,
        path:INVEST_INDIVIDUAL,
        // path:"/api/customer/individual",
        method: "PATCH",
        timeout: 10000,
        headers: {
          'X-Auth-Token':resultObj.access_token,
          "content-type": "application/json"
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

          if(_chunk !='OK'){
            apiRS =JSON.parse(_chunk);
            logger.error(JSON.stringify(apiRS.errMsg));
            reject(apiRS.errMsg);
          }else{
            mitLog.saveMITlog(referralPerson,FC_API_MODULE+INVEST_INDIVIDUAL,data,req.ip,req.originalUrl,function(){});
            resolve(_chunk);
          }

        });
      });
      request.on('error', (e) => {
        reject(e);
      });
      // Write data to request body
      logger.info(`DATA>>${JSON.stringify(data)}`);
      request.write(JSON.stringify(data));
      request.end();
    /**
     * HTTPS REQUEST (END)
     */

  },err =>{
    logger.error('ERR AUTH>>'+err);
    reject(err);
  });
  });

}
// ************************************

exports.updateSuitAPI = (req, res, next) =>{
  console.log("Validate  API /updateSuitAPI/");

  updateSuit('0105534033834',9,'TESTER').then(data=>{
    res.status(200).json(data);
  },err=>{
      res.status(400).json({
        message: err,
        code:"999",
      });
  });

}

function updateMFTSsuit(cardNumber,suitabilityRiskLevel,suitabilityEvaluationDate,actionBy){
// function updateMFTSsuit(account_No,riskLevel,actionBy) {
  logger.info('updateMFTSsuit()');

  var fncName = "updateMFTSsuit";
  var queryStr = `
  BEGIN

  --Reset all records
  UPDATE MFTS_Suit
  SET [Active_Flag]='N'
  ,Modify_Date=getDate()
  ,Modify_By=@actionBy
  WHERE Account_No = @Account_No

  --Insert new suit
  insert into MFTS_Suit (Account_No,[Active_Flag],Risk_Level,Document_Date,Create_By,Create_Date)
  VALUES(@Account_No,'A',@Risk_Level,@Document_Date,@actionBy,getDate())

END
    `;

  const sql = require("mssql");
  return new Promise(function(resolve, reject) {
    const pool1 = new sql.ConnectionPool(config, err => {
      pool1
      .request() // or: new sql.Request(pool1)
      .input("Account_No", sql.VarChar(30), cardNumber)
      .input("Risk_Level", sql.VarChar(30), suitabilityRiskLevel)
      .input("Document_Date", sql.NVarChar(50), suitabilityEvaluationDate)
      .input("actionBy", sql.VarChar(20), actionBy)
      .query(queryStr, (err, result) => {
          if (err) {
            logger.error(fncName + " Quey db. Was err !!!" + err);
            reject(err);

          } else {
            resolve(result);
          }
        });
    });
    pool1.on("error", err => {
      console.log("ERROR>>" + err);
      reject(err);
    });
  });
}


function execSUIT(cardNumber,actionBy){
  var queryStr = `

  BEGIN

	  DECLARE @CustCode [varchar](50)='${cardNumber}'
	  DECLARE @SuitSerieId [varchar](10)
	  DECLARE @Document_Date datetime
	  DECLARE @Status [varchar](1)
	  DECLARE @TotalScore [int]
	  DECLARE @RiskLevel [int]
	  DECLARE @RiskLevelTxt [nvarchar](100)
	  DECLARE @Type_Investor [nvarchar](max)
	  DECLARE @CreateBy [varchar](100)
	  DECLARE @CreateDate [datetime]
	  DECLARE @UpdateBy [varchar](100)
	  DECLARE @UpdateDate [datetime]

  DECLARE survey_cursor CURSOR FOR
  SELECT SuitSerieId
    ,ISNULL(A.UpdateDate,A.CreateDate) AS Document_Date
	,Status
	,TotalScore
	,RiskLevel
	,RiskLevelTxt
	,Type_Investor
	,CreateBy
	,CreateDate
	,UpdateBy
	,UpdateDate
  FROM MIT_CUSTOMER_SUIT A
  WHERE A.CustCode = @CustCode AND status='A'

OPEN survey_cursor

FETCH NEXT FROM survey_cursor
INTO @SuitSerieId
    ,@Document_Date
	,@Status
	,@TotalScore
	,@RiskLevel
	,@RiskLevelTxt
	,@Type_Investor
	,@CreateBy
	,@CreateDate
	,@UpdateBy
	,@UpdateDate

WHILE @@FETCH_STATUS = 0
BEGIN

  -- 1. MIT_ACCOUNT_INFO_EXT
UPDATE MIT_ACCOUNT_INFO_EXT
SET [suitabilityRiskLevel]=@RiskLevel
,[suitabilityEvaluationDate]=@Document_Date
WHERE cardNumber=@CustCode

  -- 2. MIT_CUST_CHILDREN
UPDATE MFTS_Suit SET Active_Flag='I' WHERE Account_No=@CustCode

INSERT INTO MFTS_Suit([Account_No]
	,[Document_Date]
	,[Score]
	,[Risk_Level]
	,[Risk_Level_Desc]
	,[Active_Flag]
	,[Create_By]
	,[Create_Date]
)VALUES(@CustCode
	,@Document_Date
	,@TotalScore
	,@RiskLevelTxt
	,@Type_Investor
	,'A'
	,@CreateBy
	,getDate()
)

FETCH NEXT FROM survey_cursor
INTO @SuitSerieId
    ,@Document_Date
	,@Status
	,@TotalScore
	,@RiskLevel
	,@RiskLevelTxt
	,@Type_Investor
	,@CreateBy
	,@CreateDate
	,@UpdateBy
	,@UpdateDate

END
CLOSE survey_cursor;
DEALLOCATE survey_cursor;

END

  `;
  return new Promise(function(resolve, reject) {
    dbConfig.msByQuery(queryStr,config)
    .then(result=>{
        resolve(result);
      },err=>{
        reject(err);
    });
  });
}


function execCUST_CHILDREN(cardNumber,actionBy){
  var queryStr = `
  BEGIN
  DECLARE @Cust_Code VARCHAR(50)='${cardNumber}'

  DECLARE @ChildCardNumber [varchar](50)
  DECLARE @ChildIDType VARCHAR(15)
  DECLARE @ChildPassportCountry varchar(2)
  DECLARE @cardExpiryDate [date]
  DECLARE @cardNotExt [varchar](1)
  DECLARE @title [varchar](5)
  DECLARE @titleOther [nvarchar](50)
  DECLARE @First_Name_T [nvarchar](200)
  DECLARE @Last_Name_T [nvarchar](200)
  DECLARE @First_Name_E [nvarchar](200)
  DECLARE @Last_Name_E [nvarchar](200)
  DECLARE @Birth_Day [datetime]
  DECLARE @CreateBy [varchar](100)
  DECLARE @CreateDate [datetime]
  DECLARE @UpdateBy [varchar](100)
  DECLARE @UpdateDate [datetime]
  DECLARE @OTP_ID VARCHAR(100)

  DECLARE survey_cursor CURSOR FOR
  SELECT  ChildCardNumber
  ,ChildIDType
  ,ChildPassportCountry
  ,cardExpiryDate
  ,cardNotExt
  ,title
  ,titleOther
  ,First_Name_T
  ,Last_Name_T
  ,First_Name_E
  ,Last_Name_E
  ,Birth_Day
  ,CreateBy
  ,CreateDate
  ,UpdateBy
  ,UpdateDate
  ,OTP_ID
  FROM MIT_CUSTOMER_CHILDREN A
  WHERE A.Cust_Code = @Cust_Code

OPEN survey_cursor

FETCH NEXT FROM survey_cursor
INTO @ChildCardNumber
  ,@ChildIDType
  ,@ChildPassportCountry
  ,@cardExpiryDate
  ,@cardNotExt
  ,@title
  ,@titleOther
  ,@First_Name_T
  ,@Last_Name_T
  ,@First_Name_E
  ,@Last_Name_E
  ,@Birth_Day
  ,@CreateBy
  ,@CreateDate
  ,@UpdateBy
  ,@UpdateDate
  ,@OTP_ID

WHILE @@FETCH_STATUS = 0
BEGIN

  -- 1. MIT_CUST_CHILDREN
  UPDATE MIT_CUST_CHILDREN
  SET	identificationCardType=@ChildIDType
,passportCountry=@ChildPassportCountry
,idCardExpiryDate=@cardExpiryDate
,title=@title
,thFirstName=@First_Name_T
,thLastName=@Last_Name_T
,birthDate=@Birth_Day
,CreateBy=@CreateBy
,CreateDate=@CreateDate
,UpdateBy=@UpdateBy
,UpdateDate=@UpdateDate
  WHERE cardNumber=@Cust_Code AND childCardNumber=@childCardNumber

  IF @@ROWCOUNT=0
  BEGIN
      INSERT INTO  MIT_CUST_CHILDREN(cardNumber
    ,childCardNumber
      ,identificationCardType
      ,passportCountry
      ,idCardExpiryDate
      ,title
      ,thFirstName
      ,thLastName
      ,birthDate
      ,CreateBy
      ,CreateDate
      ,UpdateBy
      ,UpdateDate
      )
      VALUES(@Cust_Code
    ,@childCardNumber
      ,@ChildIDType
      ,@ChildPassportCountry
      ,@cardExpiryDate
      ,@title
      ,@First_Name_T
      ,@Last_Name_T
      ,@Birth_Day
      ,@CreateBy
      ,@CreateDate
      ,@UpdateBy
      ,@UpdateDate
      )
  END

FETCH NEXT FROM survey_cursor
INTO @ChildCardNumber
  ,@ChildIDType
  ,@ChildPassportCountry
  ,@cardExpiryDate
  ,@cardNotExt
  ,@title
  ,@titleOther
  ,@First_Name_T
  ,@Last_Name_T
  ,@First_Name_E
  ,@Last_Name_E
  ,@Birth_Day
  ,@CreateBy
  ,@CreateDate
  ,@UpdateBy
  ,@UpdateDate
  ,@OTP_ID

END
CLOSE survey_cursor;
DEALLOCATE survey_cursor;

END
  `;
  return new Promise(function(resolve, reject) {
    dbConfig.msByQuery(queryStr,config)
    .then(result=>{
        resolve(result);
      },err=>{
        reject(err);
    });
  });
}

function execCUST_ADDR(cardNumber,Addr_Seq,actionBy){
  var queryStr = `

  BEGIN
    DECLARE @Cust_Code VARCHAR(50)='${cardNumber}'
	  DECLARE @Addr_Seq INT =${Addr_Seq}

	DECLARE @Addr_No NVARCHAR(100)
	DECLARE @Moo NVARCHAR(50)
	DECLARE @Place NVARCHAR(100)
	DECLARE @Floor NVARCHAR(50)
	DECLARE @Soi NVARCHAR(50)
	DECLARE @Road NVARCHAR(100)
	DECLARE @Tambon_Id INT
	DECLARE @Amphur_Id INT
	DECLARE @Province_Id INT
	DECLARE @Country_Id INT
	DECLARE @Zip_Code NVARCHAR(10)
	DECLARE @Print_Address NVARCHAR(400)
	DECLARE @Tel NVARCHAR(50)
	DECLARE @Fax NVARCHAR(50)
	DECLARE @CreateBy NVARCHAR(50)
	DECLARE @CreateDate DATETIME
	DECLARE @UpdateBy NVARCHAR(50)
	DECLARE @UpdateDate DATETIME
	DECLARE @SameAs VARCHAR(50)
	DECLARE @Country_oth NVARCHAR(100)

	DECLARE @Ref_No NVARCHAR(20)

DECLARE survey_cursor CURSOR FOR
SELECT 	A.Addr_No
	,A.Moo
	,A.Place
	,A.Floor
	,A.Soi
	,A.Road
	,A.Tambon_Id
	,A.Amphur_Id
	,A.Province_Id
	,A.Country_Id
	,A.Zip_Code
	,A.Print_Address
	,A.Tel
	,A.Fax
	,A.CreateBy
	,A.CreateDate
	,A.UpdateBy
	,A.UpdateDate
    ,CASE A.SameAs WHEN 1 THEN 'Residence' WHEN 2 THEN 'Current' WHEN 3 THEN 'Work'  ELSE ''   END AS SameAs
	,A.Country_oth
    FROM MIT_CUSTOMER_ADDR A
    WHERE A.Cust_Code = @Cust_Code AND A.Addr_Seq=@Addr_Seq

OPEN survey_cursor

FETCH NEXT FROM survey_cursor
INTO @Addr_No,
@Moo,
@Place,
@Floor,
@Soi,
@Road,
@Tambon_Id,
@Amphur_Id,
@Province_Id,
@Country_Id,
@Zip_Code,
@Print_Address,
@Tel,
@Fax,
@CreateBy,
@CreateDate,
@UpdateBy,
@UpdateDate,
@SameAs,
@Country_oth

WHILE @@FETCH_STATUS = 0
BEGIN

    -- 1. Update MIT_ACCOUNT_INFO_EXT
    IF @Addr_Seq =2
    BEGIN
        UPDATE MIT_ACCOUNT_INFO_EXT SET currentAddressSameAsFlag= @SameAs WHERE cardNumber=@Cust_Code
    END

    IF @Addr_Seq =3
    BEGIN
        UPDATE MIT_ACCOUNT_INFO_EXT SET workAddressSameAsFlag=@SameAs WHERE cardNumber=@Cust_Code
    END

    -- 2. Account_Address
    UPDATE Account_Address
  SET[Addr_No]=@Addr_No
      ,[Place]=@floor +' '+ @Place+' ' +@soi
      ,[Road]=@road
      ,[Tambon_Id]=@Tambon_ID
      ,[Amphur_Id]=@Amphur_ID
      ,[Province_Id]=@Province_ID
      ,[Country_Id]=@Country_ID
      ,[Zip_Code]=@Zip_Code
      ,[Print_Address]=@Print_Address
  WHERE Cust_Code=@Cust_Code AND Addr_Seq=@Addr_Seq

    IF @@ROWCOUNT=0
    BEGIN
        INSERT INTO  Account_Address(Cust_Code
        ,Addr_Seq
        ,[Addr_No]
        ,[Place]
        ,[Road]
        ,[Tambon_Id]
        ,[Amphur_Id]
        ,[Province_Id]
        ,[Country_Id]
        ,[Zip_Code]
        ,[Print_Address]
        )
        VALUES(@Cust_Code
        ,@Addr_Seq
        ,@Addr_No
        ,@floor +' '+ @Place+' ' +@soi
        ,@road
        ,@Tambon_ID
        ,@Amphur_ID
        ,@Province_ID
        ,@Country_ID
        ,@Zip_Code
        ,@Print_Address
        )
    END

    -- 3. Update /Insert MIT_ACCOUNT_INFO_EXT
    UPDATE MIT_CUST_ADDR SET no=@Addr_No
	,floor=@Floor
	,building=@Place
	,soi=@Soi
	,road=@Road
	,moo=@Moo
	,subDistrict=@Tambon_Id
	,district=@Amphur_Id
	,province=@Province_Id
	,postalCode=@Zip_Code
	,country=@Country_Id
	,phoneNumber=@Tel
	,UpdateBy=UpdateBy
	,UpdateDate=@UpdateDate
    WHERE cardNumber = @Cust_Code AND Addr_Seq=@Addr_Seq

    IF @@ROWCOUNT=0
    BEGIN
        --4.
        INSERT INTO MIT_CUST_ADDR (cardNumber
        ,Addr_Seq
        ,[no]
        ,floor
        ,building
        ,soi
        ,road
        ,moo
        ,subDistrict
        ,district
        ,province
        ,postalCode
        ,country
        ,phoneNumber
        ,CreateBy
        ,CreateDate
        )
    VALUES( @Cust_Code
        ,@Addr_Seq
        ,@Addr_No
        ,@Floor
        ,@Place
        ,@Soi
        ,@Road
        ,@Moo
        ,@Tambon_Id
        ,@Amphur_Id
        ,@Province_Id
        ,@Zip_Code
        ,@Country_Id
        ,@Tel
        ,@CreateBy
        ,@CreateDate
        )

    END

FETCH NEXT FROM survey_cursor
INTO @Addr_No,
@Moo,
@Place,
@Floor,
@Soi,
@Road,
@Tambon_Id,
@Amphur_Id,
@Province_Id,
@Country_Id,
@Zip_Code,
@Print_Address,
@Tel,
@Fax,
@CreateBy,
@CreateDate,
@UpdateBy,
@UpdateDate,
@SameAs,
@Country_oth

END
CLOSE survey_cursor;
DEALLOCATE survey_cursor;

END
  `;
  return new Promise(function(resolve, reject) {
    dbConfig.msByQuery(queryStr,config)
    .then(result=>{
        resolve(result);
      },err=>{
        reject(err);
    });
  });
}

function execACCOUNT_INFO(cardNumber,actionBy){
  var queryStr = `
  BEGIN
    DECLARE @actionBy VARCHAR(50)='${actionBy}'
    DECLARE @Cust_Code VARCHAR(50)='${cardNumber}'

	DECLARE @title VARCHAR(5)
	DECLARE @titleOther VARCHAR(50)
	DECLARE @First_Name_T VARCHAR(100)
	DECLARE @Last_Name_T VARCHAR(100)
	DECLARE @Birth_Day NVARCHAR(50)
	DECLARE @Mobile VARCHAR(50)
	DECLARE @Email NVARCHAR(100)
	DECLARE @Occupation_Code VARCHAR(3)
	DECLARE @Occupation_Desc VARCHAR(100)
	DECLARE @Position_Code VARCHAR(3)
	DECLARE @Position_Desc VARCHAR(100)
	DECLARE @BusinessType_Code VARCHAR(5)
	DECLARE @BusinessType_Desc VARCHAR(100)
	DECLARE @Income_Code VARCHAR(50)
	DECLARE @Income_Desc VARCHAR(100)
	DECLARE @Income_Source_Code VARCHAR(100)
	DECLARE @Income_Source_Desc VARCHAR(100)

	DECLARE @WorkPlace VARCHAR(100)
	DECLARE @identificationCardType VARCHAR(15)
	DECLARE @passportCountry VARCHAR(2)
	DECLARE @First_Name_E NVARCHAR(100)
	DECLARE @Last_Name_E NVARCHAR(100)
	DECLARE @cardExpiryDate NVARCHAR(50)
	DECLARE @MailSameAs VARCHAR(10)
	DECLARE @MaritalStatus VARCHAR(20)
	DECLARE @SpouseCardType VARCHAR(20)
	DECLARE @SpousePassportCountry VARCHAR(2)
	DECLARE @SpouseCardNumber VARCHAR(50)
	DECLARE @SpouseTitle VARCHAR(10)
	DECLARE @SpouseTitleOther VARCHAR(50)
	DECLARE @SpouseFirstName NVARCHAR(100)
	DECLARE @SpouseLastName NVARCHAR(100)
  --DECLARE @SpouseIDExpDate DATE
  DECLARE @SpouseIDExpDate VARCHAR(10)
	DECLARE @MoneyLaundaring VARCHAR(1)
	DECLARE @PoliticalRelate VARCHAR(1)
	DECLARE @RejectFinancial VARCHAR(1)
	DECLARE @SpouseIDNotExp VARCHAR(1)
	DECLARE @TaxDeduction VARCHAR(1)
	DECLARE @cardNotExp VARCHAR(1)
	DECLARE @NumChildren VARCHAR(100)
	DECLARE @nationality VARCHAR(2)
	DECLARE @OTP_ID VARCHAR(50)
	DECLARE @CDD_Score VARCHAR(2)
	DECLARE @CDD_Date DATE
	DECLARE @IS_FATCA VARCHAR(10)
	DECLARE @FATCA_DATE DATE
  DECLARE @suitabilityRiskLevel VARCHAR(1)
  DECLARE @suitabilityEvaluationDate DATE
	DECLARE @CreateBy NVARCHAR(100)
	DECLARE @CreateDate NVARCHAR(50)
	DECLARE @UpdateBy NVARCHAR(100)
	DECLARE @UpdateDate NVARCHAR(50)

  DECLARE customer_info_cursor CURSOR FOR
  SELECT  A.identificationCardType
    ,A.title
    ,A.First_Name_T
    ,A.Last_Name_T
    ,A.First_Name_E
    ,A.Last_Name_E
    ,A.Birth_Day
    ,A.nationality
    ,A.Email
    ,A.Mobile
    ,A.Occupation_Code
        ,A.Occupation_Desc
        ,A.BusinessType_Code
        ,A.BusinessType_Desc
        ,A.Income_Code
        ,A.Income_Source_Code
        ,A.Income_Source_Desc
        ,A.WorkPlace
        ,A.passportCountry
        ,A.titleOther
        ,A.cardExpiryDate
        ,A.maritalStatus
        ,A.SpouseCardType
        ,A.SpousePassportCountry
        ,A.SpouseCardNumber
        ,A.SpouseTitle
        ,A.SpouseTitleOther
        ,A.SpouseFirstName
        ,A.SpouseLastName
        ,convert(varchar, A.SpouseIDExpDate, 112) AS SpouseIDExpDate
        ,CASE A.MoneyLaundaring WHEN 'Y' THEN 1  ELSE 0   END AS MoneyLaundaring
        ,CASE A.PoliticalRelate WHEN 'Y' THEN 1  ELSE 0   END AS PoliticalRelate
        ,CASE A.RejectFinancial WHEN 'Y' THEN 1  ELSE 0   END AS RejectFinancial
        ,CASE A.TaxDeduction WHEN 'Y' THEN 1  ELSE 0   END AS TaxDeduction
        ,A.CDD_Score
        ,A.CDD_Date
        ,C.RiskLevel,C.CreateDate
        ,CASE B.FATCA_FLAG WHEN 'A' THEN 1  ELSE 0   END AS FATCA_FLAG
        ,B.FATCA_DATE
        ,A.CreateBy
        ,A.CreateDate
        ,A.UpdateBy
        ,A.UpdateDate
    FROM MIT_CUSTOMER_INFO A
    LEFT JOIN MIT_CUSTOMER_FATCA B ON   B.CustCode =  A.Cust_Code AND B.FATCA_FLAG='A'
    LEFT JOIN MIT_CUSTOMER_SUIT C ON   C.CustCode =  A.Cust_Code AND C.[Status]='A'
    WHERE A.Cust_Code = @Cust_Code


OPEN customer_info_cursor

FETCH NEXT FROM customer_info_cursor
INTO @identificationCardType
    ,@title
    ,@First_Name_T
    ,@Last_Name_T
    ,@First_Name_E
    ,@Last_Name_E
    ,@Birth_Day
    ,@nationality
    ,@Email
    ,@Mobile
    ,@Occupation_Code
    ,@Occupation_Desc
    ,@BusinessType_Code
    ,@BusinessType_Desc
    ,@Income_Code
    ,@Income_Source_Code
    ,@Income_Source_Desc
    ,@WorkPlace
    ,@passportCountry
    ,@titleOther
    ,@cardExpiryDate
    ,@maritalStatus
    ,@SpouseCardType
    ,@SpousePassportCountry
    ,@SpouseCardNumber
    ,@SpouseTitle
    ,@SpouseTitleOther
    ,@SpouseFirstName
    ,@SpouseLastName
    ,@SpouseIDExpDate
    ,@MoneyLaundaring
    ,@PoliticalRelate
    ,@RejectFinancial
    ,@TaxDeduction
    ,@CDD_Score
    ,@CDD_Date
    ,@suitabilityRiskLevel
    ,@suitabilityEvaluationDate
    ,@IS_FATCA
    ,@FATCA_DATE
    ,@CreateBy
    ,@CreateDate
    ,@UpdateBy
    ,@UpdateDate

WHILE @@FETCH_STATUS = 0
BEGIN

    -- Update Account_Info
    UPDATE Account_Info SET
    Card_Type=@identificationCardType
    ,Title_Name_T=@title
    ,First_Name_T=@First_Name_T
    ,Last_Name_T=@Last_Name_T
    ,Title_Name_E=@title
    ,First_Name_E=@First_Name_E
    ,Last_Name_E=@Last_Name_E
    ,Birth_Day=@Birth_Day
    ,Nation_Code=@nationality
    ,Email=@Email
    ,Mobile=@Mobile
    ,Modify_By=@UpdateBy
	,Modify_Date=@UpdateDate
    WHERE Cust_Code=@Cust_Code

    -- Update /Insert MIT_ACCOUNT_INFO_EXT
    UPDATE MIT_ACCOUNT_INFO_EXT SET
    occupationId = @Occupation_Code
    ,occupationOther=@Occupation_Desc
    ,businessTypeId=@BusinessType_Code
    ,businessTypeOther=@BusinessType_Desc
    ,monthlyIncomeLevel=@Income_Code
    ,incomeSource=@Income_Source_Code
    ,incomeSourceOther=@Income_Source_Desc
    ,companyName=@WorkPlace
    ,passportCountry=@passportCountry
    ,titleOther=@titleOther
    ,cardExpiryDate=@cardExpiryDate
    ,maritalStatus=@maritalStatus
    ,SPidentificationCardType=@SpouseCardType
    ,SPpassportCountry=@SpousePassportCountry
    ,SPcardNumber=@SpouseCardNumber
    ,SPtitle=@SpouseTitle
    ,SPtitleOther=@SpouseTitleOther
    ,SPthFirstName=@SpouseFirstName
    ,SPthLastName=@SpouseLastName
    ,SPidCardExpiryDate=@SpouseIDExpDate
    ,committedMoneyLaundering=@MoneyLaundaring
    ,politicalRelatedPerson=@PoliticalRelate
    ,rejectFinancialTransaction=@RejectFinancial
    ,confirmTaxDeduction=@TaxDeduction
    ,cddScore=@CDD_Score
    ,cddDate=@CDD_Date
    ,suitabilityRiskLevel=@suitabilityRiskLevel
    ,suitabilityEvaluationDate=@suitabilityEvaluationDate
    ,fatca=@IS_FATCA
    ,fatcaDeclarationDate=@FATCA_DATE
    ,UpdateBy=@UpdateBy
    ,UpdateDate=@UpdateDate
    ,MpamApproveBy =@actionBy
    ,MpamApproveDate=getDate()
    WHERE cardNumber=@Cust_Code

    IF @@ROWCOUNT=0
    BEGIN
      INSERT INTO  MIT_ACCOUNT_INFO_EXT (cardNumber
        ,occupationId
        ,occupationOther
        ,businessTypeId
        ,businessTypeOther
        ,monthlyIncomeLevel
        ,incomeSource
        ,incomeSourceOther
        ,companyName
        ,passportCountry
        ,titleOther
        ,cardExpiryDate
        ,maritalStatus
        ,SPidentificationCardType
        ,SPpassportCountry
        ,SPcardNumber
        ,SPtitle
        ,SPtitleOther
        ,SPthFirstName
        ,SPthLastName
        ,SPidCardExpiryDate
        ,committedMoneyLaundering
        ,politicalRelatedPerson
        ,rejectFinancialTransaction
        ,confirmTaxDeduction
        ,cddScore
        ,cddDate
        ,suitabilityRiskLevel
        ,suitabilityEvaluationDate
        ,fatca
        ,fatcaDeclarationDate
        ,CreateBy
        ,CreateDate
        ,UpdateBy
        ,UpdateDate
        ,MpamApproveBy
        ,MpamApproveDate
        )
      VALUES(@Cust_Code
        ,@Occupation_Code
        ,@Occupation_Desc
        ,@BusinessType_Code
        ,@BusinessType_Desc
        ,@Income_Code
        ,@Income_Source_Code
        ,@Income_Source_Desc
        ,@WorkPlace
        ,@passportCountry
        ,@titleOther
        ,@cardExpiryDate
        ,@maritalStatus
        ,@SpouseCardType
        ,@SpousePassportCountry
        ,@SpouseCardNumber
        ,@SpouseTitle
        ,@SpouseTitleOther
        ,@SpouseFirstName
        ,@SpouseLastName
        ,@SpouseIDExpDate
        ,@MoneyLaundaring
        ,@PoliticalRelate
        ,@RejectFinancial
        ,@TaxDeduction
        ,@CDD_Score
        ,@CDD_Date
        ,@suitabilityRiskLevel
        ,@suitabilityEvaluationDate
        ,@IS_FATCA
        ,@FATCA_DATE
        ,@CreateBy
        ,@CreateDate
        ,@UpdateBy
        ,@UpdateDate
        ,@actionBy
        ,getDate()
        )
        END

    FETCH NEXT FROM customer_info_cursor
    INTO @identificationCardType
    ,@title
    ,@First_Name_T
    ,@Last_Name_T
    ,@First_Name_E
    ,@Last_Name_E
    ,@Birth_Day
    ,@nationality
    ,@Email
    ,@Mobile
    ,@Occupation_Code
    ,@Occupation_Desc
    ,@BusinessType_Code
    ,@BusinessType_Desc
    ,@Income_Code
    ,@Income_Source_Code
    ,@Income_Source_Desc
    ,@WorkPlace
    ,@passportCountry
    ,@titleOther
    ,@cardExpiryDate
    ,@maritalStatus
    ,@SpouseCardType
    ,@SpousePassportCountry
    ,@SpouseCardNumber
    ,@SpouseTitle
    ,@SpouseTitleOther
    ,@SpouseFirstName
    ,@SpouseLastName
    ,@SpouseIDExpDate
    ,@MoneyLaundaring
    ,@PoliticalRelate
    ,@RejectFinancial
    ,@TaxDeduction
    ,@CDD_Score
    ,@CDD_Date
    ,@suitabilityRiskLevel
    ,@suitabilityEvaluationDate
    ,@IS_FATCA
    ,@FATCA_DATE
    ,@CreateBy
    ,@CreateDate
    ,@UpdateBy
    ,@UpdateDate
END
CLOSE customer_info_cursor;
DEALLOCATE customer_info_cursor;

END
  `;
  return new Promise(function(resolve, reject) {
    dbConfig.msByQuery(queryStr,config)
    .then(result=>{
        resolve(result);
      },err=>{
        reject(err);
    });
  });
}

function updateMIT_ACCOUNT_INFO_EXT(cardNumber ,cddScore, cddDate ,suitabilityRiskLevel,suitabilityEvaluationDate , fatca ,fatcaDeclarationDate ,actionBy) {
  logger.info('updateMIT_ACCOUNT_INFO_EXT()');
  var fncName = "updateMITsuit";
  var queryStr = `
  BEGIN

  UPDATE MIT_ACCOUNT_INFO_EXT
  SET
  [cddScore] =@cddScore
  ,[cddDate] =cddDate
  ,[suitabilityRiskLevel] =@suitabilityRiskLevel
  ,[suitabilityEvaluationDate]=@suitabilityEvaluationDate
  ,[fatca] =@fatca
  ,[fatcaDeclarationDate] =@fatcaDeclarationDate
  ,UpdateBy=@actionBy
  ,UpdateDate=getDate()
  WHERE cardNumber = @cardNumber

  IF @@ROWCOUNT=0
    BEGIN
      INSERT INTO MIT_ACCOUNT_INFO_EXT (cardNumber ,[cddScore], [cddDate] ,[suitabilityRiskLevel],[suitabilityEvaluationDate] , [fatca] ,	[fatcaDeclarationDate] ,CreateBy,CreateDate)
      VALUES (@cardNumber ,@cddScore, @cddDate ,@suitabilityRiskLevel,@suitabilityEvaluationDate , @fatca ,@fatcaDeclarationDate ,@actionBy,getDate())
    END

  END
    `;

  const sql = require("mssql");
  return new Promise(function(resolve, reject) {
    const pool1 = new sql.ConnectionPool(config, err => {
      pool1
      .request() // or: new sql.Request(pool1)
      .input("cardNumber", sql.VarChar(20), cardNumber)
      .input("cddScore", sql.VarChar(2), cddScore)
      .input("cddDate", sql.NVarChar(50), cddDate)
      .input("suitabilityRiskLevel", sql.VarChar(2), suitabilityRiskLevel)
      .input("suitabilityEvaluationDate", sql.NVarChar(50), suitabilityEvaluationDate)
      .input("fatca", sql.VarChar(10), fatca)
      .input("fatcaDeclarationDate", sql.NVarChar(50), fatcaDeclarationDate)
      .input("actionBy", sql.NVarChar(100), actionBy)
      .query(queryStr, (err, result) => {
          if (err) {
            console.log(fncName + " Quey db. Was err !!!" + err);
            reject(err);

          } else {
            // console.log(" queryStr >>" + queryStr);
            // console.log(" Quey RS >>" + JSON.stringify(result));
            resolve(result);
          }
        });
    });
    pool1.on("error", err => {
      console.log("ERROR>>" + err);
      reject(err);
    });
  });
}



function updateSuit(custCode,riskLevel,UpdateBy) {
  logger.info('updateSuit()');

  var fncName = "updateSuit()";
  var queryStr = `
  BEGIN

    UPDATE MIT_CUSTOMER_SUIT
    SET RiskLevel=${riskLevel}
    ,UpdateDate=getdate(),UpdateBy='${UpdateBy}'
    WHERE CustCode ='${custCode}'
    AND [Status]='A'


  END
    `;

  const sql = require("mssql");
  return new Promise(function(resolve, reject) {
    const pool1 = new sql.ConnectionPool(config, err => {
      pool1
        .request().query(queryStr, (err, result) => {
          if (err) {
            console.log(fncName + " Quey db. Was err !!!" + err);
            reject(err);

          } else {
            // console.log(" queryStr >>" + queryStr);
            // console.log(" Quey RS >>" + JSON.stringify(result));
            resolve(result);
          }
        });
    });
    pool1.on("error", err => {
      console.log("ERROR>>" + err);
      reject(err);
    });
  });
}


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


exports.downloadFileNavAPI = (req, res, next) =>{
  logger.info("Validate  API /downloadFileNavAPI/");
  const fileType = 'Nav.zip';
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  logger.info("Welcome to API /downloadFileNavAPI/");
  var businessDate = req.query.businessDate

    fnGetDownloadAPI(businessDate,fileType).then(data=>{

        unZipFile(data.path).then(fileName=>{

          // res.status(200).json(fileName);
          fcNAV_ToDB(fileName,businessDate).then(data=>{
            res.status(200).json({data: data});

          },err=>{
            res.status(422).json({error: err});
          });

          //Update to
        },err=>{
            res.status(422).json(err);
        });

    },err=>{
      res.status(400).json({
        message: err,
        code:"999",
      });
    });
}

exports.downloadNavAPI_V2 = (req, res, next) =>{

  logger.info("Validate  API /downloadNavAPI_V2/");
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  logger.info("Welcome to API /downloadNavAPI_V2/");
  var businessDate = req.body.businessDate

  downloadNavAPIproc(businessDate).then(dwRs=>{

    // console.log(JSON.stringify('EXIT>' + JSON.stringify(dwRs)));
    res.status(200).json({code:'000',message: 'Fund Effect '+dwRs["FundRecord"] + ' records.',DownloadRecord:dwRs["DownloadRecord"],record:dwRs["FundRecord"]});

  },err=>{
    res.status(422).json(err);
  });
}



exports.downloadAllottedAPI = (req, res, next) =>{

  logger.info("Validate  API /downloadAllottedAPI/");
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  logger.info("Welcome to API /downloadAllottedAPI/");
  var businessDate = req.body.businessDate

  downloadAllotedAPIproc(businessDate).then(dwRs=>{
    res.status(200).json({message: dwRs});
  },err=>{
    res.status(422).json(err);
  });
}


exports.allotedFile = (req, res, next) =>{

  fileName = '20191104_MPAM_ALLOTTEDTRANSACTIONS.txt';

  fcAlloted_ToDB(fileName).then(allottedToDB_RS=>{
    res.status(200).json({message: allottedToDB_RS});
  },err=>{
    res.status(422).json(err);
  });
}

function downloadAllotedAPIproc(businessDate){

  return new Promise(function(resolve, reject) {

    const fileType = 'AllottedTransactions.zip';

      // STEP 1: CALL API download
      fnGetDownloadAPI(businessDate,fileType).then(data=>{

          // //STEP 2: Upzip downloaded file.
          unZipFile(data.path).then(fileName=>{

          //   //STEP 3: Insert to DB.(MIT_FC_NAV)
            fcAlloted_ToDB(fileName).then(allottedToDB_RS=>{

              resolve(allottedToDB_RS)

          //     //STEP 4: Syncy to MFTS (MFTS_NavTable)
          //     navSyncFunc(navToDB_RS.businessDate).then(syncData=>{

          //       resolve(syncData)
          //       // res.status(200).json({message: syncData});

          //     },syncErr=>{
          //       // res.status(422).json({error: syncErr});
          //       reject(syncErr);
          //     })

            },err=>{
              reject(err);
              // res.status(422).json({error: err});
            });

          //   //Update to
          },err=>{
            reject(err);
              // res.status(422).json(err);
          });

      },err=>{
        reject(err);
      });

  });

}



function downloadNavAPIproc(businessDate){

  return new Promise(function(resolve, reject) {

    const fileType = 'Nav.zip';

      // STEP 1: CALL API download
      fnGetDownloadAPI(businessDate,fileType).then(data=>{

          //STEP 2: Upzip downloaded file.
          unZipFile(data.path).then(fileName=>{

            //STEP 3: Insert to DB.(MIT_FC_NAV)
            fcNAV_ToDB(fileName,businessDate).then(navToDB_RS=>{

              //STEP 4: Syncy to MFTS (MFTS_NavTable)
              navSyncFunc(navToDB_RS.businessDate).then(syncData=>{

                _rtn_msg={DownloadRecord:navToDB_RS["records"],FundRecord:syncData[0][0]["FUND_RECORD"]}


                resolve(_rtn_msg)
                // res.status(200).json({message: syncData});

              },syncErr=>{
                // res.status(422).json({error: syncErr});
                reject(syncErr);
              })

            },err=>{
              reject(err);
              // res.status(422).json({error: err});
            });

            //Update to
          },err=>{
            reject(err);
              // res.status(422).json(err);
          });

      },err=>{
        reject(err);
      });

  });

}



exports.downloadNavSchedule = (req, res, next) =>{

  logger.info("Validate  API /downloadNavSchedule/");
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  var schStatus = req.body.schStatus
  logger.info("downloadNavSchedule/" + schStatus);

  try{

    downloadNavSchedule(schStatus);
    res.status(200).json({message: 'NAV download on schedual was:' +schStatus});

  }catch(err){
    res.status(400).json({
      message: err,
      code:"999",
    });
  }


};

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

          console.log('STEP 1');
            res.status(200).json({
              records: attr[2],
              fileType:fileType,
              extract:JSON.parse(JSON.stringify(extAccFileNameList))
            });
        });
      }else{
        console.log('STEP 2');
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


exports.uploadMITNAV_db = (req, res, next) =>{

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
        fcNAV_ToDB(fileName,'N/A').then(data=>{
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
    res.status(200).json({message: 'Effect '+syncData + ' records.',record:syncData});
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
  logger.info('navSyncFunc-' + createDate);
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
                VALUES(@Fund_Id,@NAVDate,@AUM,@NAV,@OfferNAV,@BidNAV,@SwitchInNAV,@SwitchOutNAV,@createBy,getdate())

            END
            FETCH NEXT FROM MIT_FC_NAV_cursor INTO @Fund_Id,@FundCode,@NAVDate,@AUM,@NAV,@OfferNAV,@BidNAV,@SwitchOutNAV,@SwitchInNAV
        END;
    CLOSE MIT_FC_NAV_cursor
    DEALLOCATE MIT_FC_NAV_cursor

select  count(Fund_Id) AS FUND_RECORD
from MFTS_NavTable
where CONVERT(VARCHAR(10), Modify_Date, 112) = CONVERT(VARCHAR(10), getdate(), 112)

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
          // resolve(result.rowsAffected.length)
          resolve(result.recordsets)
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

function fcAlloted_ToDB(fileName){
  logger.info('Function fcAlloted_ToDB() //'+fileName);

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

        var array = data.toString().split("\n");
        array.shift(); //removes the first array element

        var _row =0;
          for(i in array) {

            var item = array[i].split("|") ;

// 1	SA Order Reference No
var referenceNo = item[0]?item[0].trim():''
// 2	Transaction Date-Time(YYYYMMDDHHMMSS)
var transactionDate = item[1]?item[1].trim():''
// 3	Filler
// 4	AMC Code
var amc = item[3]?item[3].trim():''
// 5	Unitholder ID
var unitholderID = item[4]?item[4].trim():''
// 6	New Unitholder Reference No
// 7	Transaction Code
var transactionCode = item[6]?item[6].trim():''
// 8	Fund Code
var fundCode =item[7]?item[7].trim():''
// 9	Override RisK Profile Flag
// 10	Override FX Risk Flag
// 11	Redemption Type
var redemptionType=item[10]?item[10].trim():''
// 12	Amount
var amount =item[11]?item[11].trim():''
// 13	Unit
var unit =item[12]?item[12].trim():''
// 14	Effective Date
var effectiveDate =item[13]?item[13].trim():''
// 15	Filler
// 16	Filler
// 17	Payment Type
var paymentType =item[16]?item[16].trim():''
// 18	Bank Code
var bankCode =item[17]?item[17].trim():''
// 19	Bank Account / Credit Card Number
var bankAccount =item[18]?item[18].trim():''
// 20	Cheque No
// 21	Cheque Date
// 22	IC License
// 23	Branch No
// 24	Channel
// 25	Force Entry
// 26	LTF Condition
// 27	Reason to sell LTF/RMF
// 28	RMF Capital gain withholding tax choice
// 29	RMF Capital amount redeem choice
// 30	Auto redeem fund code
// 31	Transaction ID
// 32	Status
// 33	AMC Order Reference No
// 34	Allotment Date
// 35	Allotted NAV
// 36	Allotted Amount
// 37	Alloted Unit
// 38	Fee
// 39	Withholding Tax
// 40	VAT
// 41	Brokerage fee
// 42	Withholding Tax for LTF/RMF
// 43	AMC Pay Date
// 44	Registrar Transaction Flag
// 45	Sell all unit flag
// 46	Settlement Bank Code
// 47	Settlement Bank Account
// 48	Reject Reason
// 49	CHQ Branch
// 50	Tax Invoice No
// 51	AMC Switching Order Reference No
// 52	IC Code
// 53	Brokerage fee  VAT
// 54	Filler
// 55	NAV Date


              if(transactionDate){
                console.log(`referenceNo=${referenceNo}
                ;transactionDate=${transactionDate}
                ;amc=${amc}
                ;unitholderID=${unitholderID}
                ;transactionCode=${transactionCode}
                ;fundCode=${fundCode}
                ;redemptionType=${redemptionType}
                ;amount=${amount}
                ;unit=${unit}
                ;effectiveDate=${effectiveDate}
                ;paymentType=${paymentType}
                ;bankCode=${bankCode}
                ;bankAccount=${bankAccount}
                `)
                _row++;
              }

          }

          resolve('Read allocated file successful >>' + _row);

          // //Move to backup folder
          // fs.rename(DOWNLOAD_DIR +"/"+ fileName, DOWNLOAD_DIR_BACKUP+"/"+fileName,  (err) => {
          //   if (err) {
          //     reject(err);
          //   };
          //   resolve('Read allocated file successful >>' + _row);
          // });

      });//fs.readFile

    }catch(e){
      logger.error(e);
      reject(e);
    }
  });
}

function fcNAV_ToDB(fileName,businessDate){
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
        table.columns.add('businessDate', sql.VarChar(50), { nullable: true });
        table.columns.add('createBy', sql.VarChar(50), { nullable: true });
        table.columns.add('createDate', sql.SmallDateTime, { nullable: true });

        var array = data.toString().split("\n");
        array.shift(); //removes the first array element

        var _row =0;
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
                  ,businessDate
                  ,userCode
                  ,new Date);
              }
              _row++;
          }

          // ***************** EXECUTE insert Bulk data to  MIT_LED table
          const request = new sql.Request(pool1)
          request.bulk(table, (err, result) => {
              // ... error checks
              // console.log('ERROR BULK>>' + err);
            if(err){
              // console.log(err);
              logger.error(err);
              reject(err);
            }

            if(result){
              var today = new Date();
              var yyyymmddDate = today.getFullYear()+''+("0" + (today.getMonth() + 1)).slice(-2)+''+("0" + today.getDate()).slice(-2);
              msg={msg:'Insert NAV DB. successful.',records:_row,'businessDate': yyyymmddDate}

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
        // resolve(_unzipPath);
        resolve(extAccFileName);
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
      host: FC_API_URI,
      path:FC_AUTH_PATH,
      method: "POST",
      headers: {
         "Content-Type": "application/json",
        // 'Content-Length': postData.length
      },
    };

  // console.log('***FC_API_URI > ' + JSON.stringify(FC_API_URI));
  // console.log('***FC_AUTH_PATH > ' + JSON.stringify(FC_AUTH_PATH));
  // console.log('***FC_API_AUTH > ' + JSON.stringify(FC_API_AUTH));

    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0" //this is insecure

  const request = https.request(options,(res) => {
    var _chunk="";
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
      _chunk=_chunk.concat(chunk);
    });
    res.on('end', () => {
      resolve(_chunk);
    });

  });

  request.on('error', (e) => {
    console.log('err fnFCAuth>' + e);
    reject(e);
  });

  // Write data to request body
  request.write(JSON.stringify(FC_API_AUTH));
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

      logger.info("***TOKEN>>"+resultObj.access_token);

      const HTTPS_ENDPOIN =`https://${FC_API_URI}${FC_DOWNLOAD_PATH}${businessDate}/${fileType}`;
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

// field          allowed values
// -----          --------------
// minute         0-59
// hour           0-23
// day of month   0-31
// month          0-12 (or names, see below)
// day of week    0-7 (0 or 7 is Sun, or use names)

var SCH_JOB;
function downloadNavSchedule(schStatus){

  const SCH_STOP = 'STOP';
  const SCH_START = 'START';

  if(schStatus.toUpperCase() === SCH_START){

    // START SCH
    var SCH_JOB_SCH = '30 09 * * Mon-Fri';  // Run at Mon-Fri on 09:30 AM
    // var SCH_JOB_SCH = '31 16 * * Mon-Fri';  // Run at Mon-Fri on 09:30 AM

    logger.info("START NAV SCH>" + SCH_JOB_SCH);
    SCH_JOB = new CronJob(SCH_JOB_SCH, function() {

      logger.info("Nav schedual running..."+new Date());

      var today = new Date();
      var navDate_yyyymmddDate;
      // var navDate_yyyymmddDate = today.getFullYear()+''+("0" + (today.getMonth() + 1)).slice(-2)+''+("0" + today.getDate()).slice(-2);

      // Check is monday ?
      // if is monday use friday date instead
      if(today.getDay() == 1 ){
        // logger.info(`To day(${yyyymmddDate}) is monday backword to friday`);
        today.setDate(today.getDate()-3);
        navDate_yyyymmddDate = today.getFullYear()+''+("0" + (today.getMonth() + 1)).slice(-2)+''+("0" + today.getDate()).slice(-2);
      }else{
        today.setDate(today.getDate()-1);
        navDate_yyyymmddDate = today.getFullYear()+''+("0" + (today.getMonth() + 1)).slice(-2)+''+("0" + today.getDate()).slice(-2);
      }

      downloadNavAPIproc(navDate_yyyymmddDate).then(dwRs=>{
        logger.info(`Download NAV(${navDate_yyyymmddDate}) API schedual on  ${new Date()}successful `  );
      },err=>{
        logger.error(`Download NAV(${navDate_yyyymmddDate}) API schedual on  ${new Date()} Error: ${err}`  );
      });

    });

    SCH_JOB.start();
  }else if(schStatus.toUpperCase() === SCH_STOP){

    SCH_JOB.stop();
    logger.info("STOP SCH_JOB");

  }else{

  }

}
