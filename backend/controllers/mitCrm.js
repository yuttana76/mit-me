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
