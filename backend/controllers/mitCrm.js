const fs = require('fs');
const path = require('path');
const dbConfig = require('../config/db-config');
const mpamConfig = require('../config/mpam-config');
var logger = require("../config/winston");
const https = require('https')
const download = require('download');
const { check, validationResult } = require('express-validator');
var AdmZip = require('adm-zip');
var CronJob = require('cron').CronJob;
var mitLog = require('./mitLog');
var  FCCustInfo = require('../models/fcCustInfo.model');
var  util = require('./utility');
var slackTools = require('./tools/slack');
const { JsonFormatter } = require('tslint/lib/formatters');
const customer = require('./customer');
const mail = require('./mail');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0" //this is insecure
//FundConnext configuration
const FC_API_URL= mpamConfig.FC_API_URL
const FC_API_AUTH=mpamConfig.FC_API_AUTH

const FC_AUTH_PATH = mpamConfig.AUTH_PATH
const FC_DOWNLOAD_PATH = mpamConfig.API_DOWNLOAD_PATH
const DOWNLOAD_PATH  = mpamConfig.DOWNLOAD_PATH
const INVEST_PROFILE_PATH = mpamConfig.INVEST_PROFILE_PATH
const INVEST_INDIVIDUAL = mpamConfig.INVEST_INDIVIDUAL
const FC_API_MODULE ='FC API';

// Database configuration
var config_BULK = mpamConfig.dbParameters_BULK;
var config = mpamConfig.dbParameters;

const sql = require("mssql");



exports.getMastert = (req, res, next) =>{
  var compCode = req.query.compCode
  var refType = req.query.refType
  var lang = req.query.lang

  logger.info('Start getMastert;' + refType )
  getMaster(compCode,refType,lang).then(data=>{
    res.status(200).json(data);
  },err=>{
      res.status(400).json({
        message: err,
        code:"999",
      });
  });
}


exports.getPersonalById = (req, res, next) =>{

  var custCode = req.params.cusCode;
  var compCode = req.query.compCode

  logger.info('Start getPersonalById();' + custCode +" ;compCode:" + compCode)

  getPersonalById(custCode,compCode).then(data=>{
    res.status(200).json(data);
  },err=>{
      res.status(400).json({
        message: err,
        code:"999",
      });
  });
}


exports.createPersonal = (req, res, next) =>{

  var custCode = req.params.cusCode;

  var personObj = JSON.parse(JSON.stringify(req.body.personObj))

  logger.info(`createPersonal ()custCode: ${custCode}  ;personObj:${personObj} ` )

  res.status(200).json({code:000,msg:'create successful'});

  // getPersonalById(custCode).then(data=>{
  //   res.status(200).json(data);
  // },err=>{
  //     res.status(400).json({
  //       message: err,
  //       code:"999",
  //     });
  // });
}

exports.updatePersonal = (req, res, next) =>{

  // var custCode = req.params.cusCode;
  var personObj = JSON.parse(JSON.stringify(req.body.personObj))
  var compCode = JSON.parse(JSON.stringify(req.body.compCode))
  var actionBy = JSON.parse(JSON.stringify(req.body.actionBy))

  logger.info(`updatePersonal ()compCode: ${compCode};actionBy:${actionBy}  ;personObj:${JSON.stringify(personObj)} ` )

  updatePersonal(compCode,actionBy,personObj).then(data=>{
    res.status(200).json(data);
  },err=>{
      res.status(400).json({
        message: err,
        code:"999",
      });
  });
}

// *******************
// FUNCTION
// *******************

function getMaster(compCode,refType,lang) {
  logger.info('getMaster()');

  var fncName = "getMaster()";
  var queryStr = `
  BEGIN

  SELECT refCode as code ,
  CASE
      WHEN @lang = 'TH' THEN nameTh
      ELSE nameEn
  END AS text
  FROM MIT_CRM_MasterData
  WHERE status='A'
  AND compCode=@compCode
  AND refType=@refType
  ORDER BY nameTh

  END
    `;

  // const sql = require("mssql");
  return new Promise(function(resolve, reject) {
    const pool1 = new sql.ConnectionPool(config, err => {
      pool1
        .request()
        .input("compCode", sql.VarChar(20), compCode)
        .input("refType", sql.VarChar(20), refType)
        .input("lang", sql.VarChar(20), lang)
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

function getPersonalById(custCode,compCode) {
  logger.info('getMaster()');

  var fncName = "getMaster()";
  var queryStr = `
  BEGIN

  select *
  from MIT_CRM_Personal
  where compCode=@compCode AND CustCode=@CustCode

  END
    `;

  // const sql = require("mssql");
  return new Promise(function(resolve, reject) {
    const pool1 = new sql.ConnectionPool(config, err => {
      pool1
        .request()
        .input("compCode", sql.VarChar(20), compCode)
        .input("CustCode", sql.Int, custCode)
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

function updatePersonal(compCode,actionBy,personObj){

  var fncName = "updatePersonal()";
  var queryStr = `
  BEGIN

  UPDATE MIT_CRM_Personal SET
  idCard=@idCard,
  FirstName=@FirstName,
  LastName=@LastName,

  CustomerAlias=@CustomerAlias,
  Dob=@Dob,
  Sex=@Sex,
  State=@State,
  custType=@custType,
  Mobile=@Mobile,
  Telephone=@Telephone,
  Email=@Email,
  SocialAccount=@SocialAccount,
  Interested=@Interested,
  UserOwner=@UserOwner,
  Refer=@Refer,
  Class=@Class,
  InvestCondition=@InvestCondition,
  ImportantData=@ImportantData,

  UpdateBy=@UpdateBy,
  UpdateDate=GETDATE()
  WHERE compCode=@compCode
  AND CustCode=@CustCode
  END
    `;

  // const sql = require("mssql");
  return new Promise(function(resolve, reject) {
    const pool1 = new sql.ConnectionPool(config, err => {
      pool1
        .request()
        .input("compCode", sql.VarChar(20), compCode)
        .input("CustCode", sql.Int, personObj.CustCode)

        .input("idCard", sql.VarChar(50), personObj.idCard)
        .input("FirstName", sql.NVarChar(200), personObj.FirstName)
        .input("LastName", sql.NVarChar(200), personObj.LastName)
        .input("CustomerAlias", sql.NVarChar(200), personObj.CustomerAlias)
        .input("Dob", sql.VarChar(50), personObj.Dob)
        .input("Sex", sql.NVarChar(10), personObj.Sex.trim())
        .input("State", sql.NVarChar(50), personObj.State.trim())
        .input("custType", sql.NVarChar(50), personObj.custType)
        .input("Mobile", sql.VarChar(50), personObj.Mobile)
        .input("Telephone", sql.VarChar(50), personObj.Telephone)
        .input("Email", sql.NVarChar(100), personObj.Email)
        .input("SocialAccount", sql.NVarChar(200), personObj.SocialAccount)
        .input("Interested", sql.NVarChar(200), personObj.Interested)
        .input("UserOwner", sql.NVarChar(50), personObj.UserOwner)
        .input("Refer", sql.NVarChar(50), personObj.Refer)
        .input("Class", sql.NVarChar(20), personObj.Class)
        .input("InvestCondition", sql.NVarChar(200), personObj.InvestCondition)
        .input("ImportantData", sql.NVarChar(200), personObj.ImportantData)
        .input("UpdateBy", sql.NVarChar(50), actionBy)

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
