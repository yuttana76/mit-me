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

  // let compCode ='MPAM';
  // let crmCustCode='M1901362';
  const custCode = req.query.custCode

  lbdu_data
  private_data
  bond_data

  fnArray=[];
  fnArray.push(unitholderBalanceLBDU_BycustCode(custCode));
  Promise.all(fnArray)
  .then(data => {



      //LBDU
      if(data[0]){

        //Calculate
        let cost =0
        cost = data[0].recordsets[0].reduce((a, b) => {
            cost += b['Unit_balance'] * b['Average_Cost'];
            // console.log(`*** CAL cost > ${b['Unit_balance']} * ${b['Average_Cost']} = ${cost}`)
            return cost
          }, {});

        let marketVal=0
          marketVal = data[0].recordsets[0].reduce((a, b) => {
          marketVal += b['Unit_balance'] * b['NAV'];
          // console.log(`*** CAL cost > ${b['Unit_balance']} * ${b['Average_Cost']} = ${cost}`)

          return marketVal
        }, {});

        // ans = data[0].recordsets[0].reduce((a, b) => {
        //       if(!a[b['Account_ID']]) {
        //         a[b['Account_ID']] = [];
        //       }
        //       a[b['Account_ID']].push(b);
        //       return a;
        //     }, {});

          rs_data.lbdu=data[0]
          rs_data.lbdu["cost"] = cost;
          rs_data.lbdu["marketVal"] = marketVal;

      };

    return_data={'lbdu':lbdu_data,
    'private':private_data,
    'bond':bond_data
    }


    // Return
    res.status(200).json({code:'000',message:'sucessful',data:JSON.stringify(return_data)});
  })
  .catch(error => {
    logger.error('UnitholderBalance: ' +error.message)
    res.status(401).json({code:'001',message:error.message });
  });

}

exports.AllottedTransactions = (req, res, next) => {

  let data = {AccountID:'MPAM'  }

  res.status(200).json('API AllottedTransactions. ' + JSON.stringify(data));
}



function unitholderBalanceLBDU_BycustCode(CustCode) {

  logger.info(`unitholderBalanceLBDU_BycustCode()   ;CustCode: ${CustCode}`);

  var fncName = "getMaster()";
  var queryStr = `
  BEGIN

  select
  AA .*
  from (
      select A.Account_ID,A.NAVdate,A.Fund_Code ,A.Available_Amount,A.Available_Unit_Balance,A.Unit_balance,A.Average_Cost,A.NAV
      , (((A.Available_Amount -  (A.Unit_balance * A.Average_Cost)) / (A.Unit_balance * A.Average_Cost) ) * 100) AS UPL
      from MIT_FC_UnitholderBalance A
      where A.Account_ID =@custCode
      and Available_Amount>0 AND Available_Unit_Balance>0  )AA
  INNER JOIN(
      select Fund_Code,MAX(CONVERT(DATETIME, NAVdate, 112)) AS NAVdate
      from MIT_FC_UnitholderBalance
      where Account_ID =@custCode
      and Available_Amount>0 AND Available_Unit_Balance>0
      group by Fund_Code) BB
  ON AA.Fund_Code=BB.Fund_Code  AND AA.NAVdate= BB.NAVdate
  ORDER BY AA.Account_ID,AA.Fund_Code

  END
    `;

  // const sql = require("mssql");
  return new Promise(function(resolve, reject) {
    const pool1 = new sql.ConnectionPool(config, err => {
      pool1
        .request()
        // .input("compCode", sql.VarChar(20), compCode)
        .input("custCode", sql.VarChar(20), CustCode)

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
