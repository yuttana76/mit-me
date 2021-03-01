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

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0" //this is insecure

var config_BULK = mpamConfig.dbParameters_BULK;
var config = mpamConfig.dbParameters;
const sql = require("mssql");

exports.UnitholderBalance = (req, res, next) => {


  let data = {AMC_Code:'MPAM'  }

  res.status(200).json('API UnitholderBalance ' + JSON.stringify(data));
}

exports.AllottedTransactions = (req, res, next) => {

  let data = {AccountID:'MPAM'  }

  res.status(200).json('API AllottedTransactions. ' + JSON.stringify(data));
}
