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

// *************** MODEL


let customerModel = {
  "customer_name":"xxx-yyy",
  portfolios:[]
}

let portModel = {
  "product": "PF",
  "current_value": 4206333,
  "capital_value": 8031200,
  "balance": -3824867,
  "balance_percent": -47.625099611515,
  "as_of_date": "2021-03-01",
  "portfolio_code": "P53001",
  "outstanding_list":[]
}


let outstandingModel = {
  "instrument": "L44",
  "percent": 10,
  "price": 10,
  "current_value": 10,
  "capital_value": 10,
  "balance": 10,
  "balance_percent": 10
  }

// *************** MODEL

exports.hellomi = (req, res, next) => {
  res.status(200).json(`Hello mi ${req.connection.remoteAddress}` );
}

// exports.UnitholderBalance = (req, res, next) => {

//   // let compCode ='MPAM';
//   // let crmCustCode='M1901362';
//   const custCode = req.query.custCode

//   fnArray=[];
//   fnArray.push(unitholderBalanceLBDU_BycustCode(custCode));
//   Promise.all(fnArray)
//   .then(data => {

//     var rs_data={}

//       //LBDU
//       if(data[0]){

//         //Calculate
//         let cost =0
//         cost = data[0].recordsets[0].reduce((a, b) => {
//             cost += b['Unit_balance'] * b['Average_Cost'];
//             // console.log(`*** CAL cost > ${b['Unit_balance']} * ${b['Average_Cost']} = ${cost}`)
//             return cost
//           }, {});

//         let marketVal=0
//           marketVal = data[0].recordsets[0].reduce((a, b) => {
//           marketVal += b['Unit_balance'] * b['NAV'];
//           // console.log(`*** CAL cost > ${b['Unit_balance']} * ${b['Average_Cost']} = ${cost}`)

//           return marketVal
//         }, {});

//         // ans = data[0].recordsets[0].reduce((a, b) => {
//         //       if(!a[b['Account_ID']]) {
//         //         a[b['Account_ID']] = [];
//         //       }
//         //       a[b['Account_ID']].push(b);
//         //       return a;
//         //     }, {});

//           rs_data.outstanding_list=data[0].recordsets[0]
//           // rs_data.lbdu["cost"] = cost;
//           // rs_data.lbdu["marketVal"] = marketVal;

//       };

//       //Private fund
//       if(data[1]){
//         // rs_data['private']=data[1].recordsets[0]
//         rs_data.private=data[1]
//       }

//       //BOND
//       if(data[2]){
//         // rs_data['bond']=data[2].recordsets[0]
//         rs_data.bond=data[2]
//       }



//     // Return
//     res.status(200).json(rs_data);
//     // res.status(200).json({code:'000',message:'sucessful',data:rs_data});
//   })
//   .catch(error => {
//     logger.error('UnitholderBalance: ' +error.message)
//     res.status(401).json({code:'001',message:error.message });
//   });

// }

exports.getPortDetailByAgents = (req, res, next) => {

  try{
    logger.info('Welcome getPortDetailByAgents');

    const agent_list = req.query.agent_list;
    const as_of_date = req.query.as_of_date;

    agentCustomerList =[];


    // #1
    customerModel.customer_name='Yuttana';
    customerModel.portfolios.push(portModel);
    agentCustomerList.push(customerModel);

    // #2
    customerModel.customer_name='Mr. xxxx';
    // customerModel.portfolios.push(portModel);
    agentCustomerList.push(customerModel);

    res.status(200).json(agentCustomerList);

  } catch (error) {
    logger.error(JSON.stringify(error))
    res.status(500).json(error);
  }

}


exports.getPortDetailByPort = (req, res, next) => {

  try {
    let portfolio_code = req.query.portfolio_code;
    let as_of_date = req.query.as_of_date;
    let product = req.query.product;

    var compCode = 'MPAM'
    product = 'MF'
     portfolio_code='M1901362'
     as_of_date='2021-02-06'

portdata={
  "product": product,
"as_of_date": as_of_date,
"portfolio_code": portfolio_code,
}


  //LBDU
  fnArray=[];
  fnArray.push(funcPortDetailByPort(compCode,portfolio_code,as_of_date));
  Promise.all(fnArray)
  .then(data => {

    logger.info(JSON.stringify(data[0]))

      // has data
      sum_current_value=0;
      sum_capital_value=0;

      if(data[0]){

        // portdata.outstanding_list.push(data[0])
        //Calculate

        sum_current_value = data[0].reduce((a, b) => {
            sum_current_value +=b['current_value']
            return sum_current_value
          }, {});

        sum_capital_value = data[0].reduce((a, b) => {
            sum_capital_value +=b['capital_value'];
            return sum_capital_value
          }, {});

          portdata.current_value=sum_current_value;
          portdata.capital_value=sum_capital_value;
          portdata.balance=sum_current_value-sum_capital_value;
          portdata.balance_percent= ((sum_current_value-sum_capital_value) /sum_capital_value)*100 ;

          portdata.outstanding_list = data[0]


          // rs_data.outstanding_list=data[0].recordsets[0]
          // rs_data.lbdu["cost"] = cost;
          // rs_data.lbdu["marketVal"] = marketVal;

      };

    res.status(200).json(portdata);
  });

  } catch (error) {
    logger.error(JSON.stringify(error))
    res.status(500).json(error);
  }
}


exports.getCommission = (req, res, next) => {

  const agent_list = req.query.agent_list;

  let data = {AccountID:'MPAM'  }

  res.status(200).json('API Commission. ' + JSON.stringify(data));
}


// **********************************************************
// function unitholderBalanceLBDU_BycustCode(CustCode) {

//   logger.info(`unitholderBalanceLBDU_BycustCode()   ;CustCode: ${CustCode}`);

//   var fncName = "getMaster()";
//   var queryStr = `
//   BEGIN

//   select
//   AA .*
//   from (
//       select A.Account_ID,A.NAVdate,A.Fund_Code ,A.Available_Amount,A.Available_Unit_Balance,A.Unit_balance,A.Average_Cost,A.NAV
//       , (((A.Available_Amount -  (A.Unit_balance * A.Average_Cost)) / (A.Unit_balance * A.Average_Cost) ) * 100) AS UPL
//       from MIT_FC_UnitholderBalance A
//       where A.Account_ID =@custCode
//       and Available_Amount>0 AND Available_Unit_Balance>0  )AA
//   INNER JOIN(
//       select Fund_Code,MAX(CONVERT(DATETIME, NAVdate, 112)) AS NAVdate
//       from MIT_FC_UnitholderBalance
//       where Account_ID =@custCode
//       and Available_Amount>0 AND Available_Unit_Balance>0
//       group by Fund_Code) BB
//   ON AA.Fund_Code=BB.Fund_Code  AND AA.NAVdate= BB.NAVdate
//   ORDER BY AA.Account_ID,AA.Fund_Code

//   END
//     `;

//   // const sql = require("mssql");
//   return new Promise(function(resolve, reject) {
//     const pool1 = new sql.ConnectionPool(config, err => {
//       pool1
//         .request()
//         // .input("compCode", sql.VarChar(20), compCode)
//         .input("custCode", sql.VarChar(20), CustCode)

//         .query(queryStr, (err, result) => {
//           if (err) {
//             console.log(fncName + " Quey db. Was err !!!" + err);
//             reject(err);

//           } else {
//             // console.log(" queryStr >>" + queryStr);
//             // console.log(" Quey RS >>" + JSON.stringify(result));
//             resolve(result);
//           }
//         });
//     });
//     pool1.on("error", err => {
//       console.log("ERROR>>" + err);
//       reject(err);
//     });
//   });
// }

// **********************************************************

function funcPortDetailByPort(compCode,custCode,as_of_date) {

  logger.info(`funcPortDetailByPort()   ;CustCode: ${custCode} ;as_of_date:${as_of_date} `);

  var fncName = "getMaster()";
  var queryStr = `
  BEGIN

  select A.Account_ID
  ,A.Fund_Code as instrument
  ,A.NAV as price
  ,a.Unit_balance * a.NAV as current_value
  ,a.Unit_balance * a.Average_Cost as capital_value
  ,(A.Available_Amount -  (A.Unit_balance * A.Average_Cost))  as balance
  , (((A.Available_Amount -  (A.Unit_balance * A.Average_Cost)) / (A.Unit_balance * A.Average_Cost) ) * 100) AS balance_percent

      from MIT_FC_UnitholderBalance A
      where A.Account_ID =@custCode
      and Available_Amount>0
      AND Available_Unit_Balance>0
      and  CONVERT(DATETIME, businessDate) =
        (select   distinct top 1 businessDate
        from MIT_FC_UnitholderBalance
        where Account_ID = @custCode
        and  CONVERT(DATETIME, businessDate) <= CONVERT(DATETIME, @as_of_date)
        order by  businessDate desc )

  END
    `;

  // const sql = require("mssql");
  return new Promise(function(resolve, reject) {
    const pool1 = new sql.ConnectionPool(config, err => {
      pool1
        .request()
        // .input("compCode", sql.VarChar(20), compCode)
        .input("custCode", sql.VarChar(20), custCode)
        .input("as_of_date", sql.VarChar(20), as_of_date)

        .query(queryStr, (err, result) => {
          if (err) {
            console.log(fncName + " Quey db. Was err !!!" + err);
            reject(err);

          } else {
            // console.log(" queryStr >>" + queryStr);
            // console.log(" Quey RS >>" + JSON.stringify(result));
            resolve(result.recordset);
          }
        });
    });
    pool1.on("error", err => {
      console.log("ERROR>>" + err);
      reject(err);
    });
  });
}
