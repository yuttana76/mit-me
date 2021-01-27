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



exports.getMastert = (req, res, next) => {

  var refType = req.query.refType

  logger.info('Start getMastert;' + refType )

  data = [{
        refCode:'Lead',
        nameTh:'Lead-TH',
        nameEn:'Lead-EN',
      },
      {
        refCode:'Prospect',
        nameTh:'Prospect-TH',
        nameEn:'Prospect-EN',
      },
      {
        refCode:'Customer',
        nameTh:'Customer-TH',
        nameEn:'Customer-EN',
      },
      ];

  // Return
  res.status(200).json('API Schedule successful. ' + JSON.stringify(data));

}
