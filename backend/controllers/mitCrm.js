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

exports.getTaskById = (req, res, next) =>{

  var taskId = req.params.taskId;
  var compCode = req.query.compCode;

  logger.info('Start getTaskById();' + taskId +" ;compCode:" + compCode)

  getTaskById(taskId,compCode).then(data=>{
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
  var compCode = JSON.parse(JSON.stringify(req.body.compCode))
  var actionBy = JSON.parse(JSON.stringify(req.body.actionBy))


  logger.info(`createPersonal ()compCode: ${compCode};actionBy:${actionBy}  ;personObj:${JSON.stringify(personObj)} ` )

  createPersonal(compCode,actionBy,personObj).then(data=>{
    res.status(200).json(data);
  },err=>{
      res.status(400).json({
        message: err,
        code:"999",
      });
  });
}

exports.createTask = (req, res, next) =>{

  var taskObj = JSON.parse(JSON.stringify(req.body.obj))
  var compCode = JSON.parse(JSON.stringify(req.body.compCode))
  var actionBy = JSON.parse(JSON.stringify(req.body.actionBy))

  logger.info(`createTask ()compCode: ${compCode};actionBy:${actionBy}  ;taskObj:${JSON.stringify(taskObj)} ` )

  createTask(compCode,actionBy,taskObj).then(data=>{
    res.status(200).json(data);
  },err=>{
      res.status(400).json({
        message: err,
        code:"999",
      });
  });
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


exports.updateTask = (req, res, next) =>{

  // var custCode = req.params.cusCode;
  var taskObj = JSON.parse(JSON.stringify(req.body.obj))
  var compCode = JSON.parse(JSON.stringify(req.body.compCode))
  var actionBy = JSON.parse(JSON.stringify(req.body.actionBy))

  logger.info(`updateTask ()compCode: ${compCode};actionBy:${actionBy}  ;taskObj:${JSON.stringify(taskObj)} ` )

  updateTask(compCode,actionBy,taskObj).then(data=>{
    res.status(200).json(data);
  },err=>{
      res.status(400).json({
        message: err,
        code:"999",
      });
  });
}

exports.searchPersonal = (req, res, next) =>{

  var numPerPage = parseInt(req.query.pagesize, 10) || 10;
  var page = parseInt(req.query.page, 10) || 1;
  var compCode = req.query.compCode || false;
  var actionBy = req.query.actionBy || false;

  var idCard = req.query.idCard;
  var firstName = req.query.firstName;
  var lastName = req.query.lastName;
  var mobile = req.query.mobile || false;
  var CustomerAlias = req.query.CustomerAlias || false;

  console.log('Welcome searchPersonal()')

  searchPersonal(numPerPage,page,compCode,actionBy,idCard,firstName,lastName,mobile,CustomerAlias).then(result=>{

    res.status(200).json({
      message: "Successfully!",
      records:result.recordsets[0].length,
      result: result.recordsets[0].length !=0?result.recordsets[0]:result.recordsets[0].length
      // result: result.recordsets[0].length !=0?result.recordsets[0]:result.recordsets[1]
    });

  },err=>{
      res.status(400).json({
        message: err,
        code:"999",
      });
  });
}


exports.portfolio = async (req, res, next) =>{
  var compCode = req.query.compCode
  var crmCustCode = req.params.cusCode;

  console.log(`portfolio compCode:${compCode} ; custCode:${crmCustCode}`);
  // compCode = 'MPAM';
  // custCode = '1';

  //Get lbdu account id
  // var  lbdu_accountId='M1901362';

  // let lbdu_accountId = await getLBDU_Account(compCode,crmCustCode);
  // console.log('***lbdu_accountId>>'+JSON.stringify(lbdu_accountId));
  // lbdu_accountId =lbdu_accountId.recordsets[0][0].ext_module_ref

  fnArray=[];
  fnArray.push(unitholderBalanceLBDU_ByCRMcustCode(compCode,crmCustCode));
  // fnArray.push(unitholderBalanceLBDU_ByCRMcustCode(compCode,crmCustCode));
  // fnArray.push(unitholderBalanceLBDUByAccount(lbdu_accountId));

  Promise.all(fnArray)
  .then(data => {

    var rs_data={}
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

    //Private fund
    if(data[1]){
      // rs_data['private']=data[1].recordsets[0]
      rs_data.private=data[1]
    }

    //BOND
    if(data[2]){
      // rs_data['bond']=data[2].recordsets[0]
      rs_data.bond=data[2]
    }

    res.status(200).json(rs_data);

  })
  .catch(error => {
    logger.error('Error FundConnext portfolio;' +error.message)
    res.status(401).json(error.message);
  });



  // unitholderBalanceLBDUByAccount(accountId).then(data=>{

  //   res.status(200).json(data);
  // },err=>{
  //     res.status(400).json({
  //       message: err,
  //       code:"999",
  //     });
  // });
}

// *******************
// FUNCTION
// *******************


function searchPersonal(numPerPage,page,compCode,actionBy,idCard,firstName,lastName,mobile,CustomerAlias){
  logger.info(`searchPersonal()  numPerPage:${numPerPage},page:${page},compCode:${compCode},actionBy:${actionBy},idCard:${idCard},firstName:${firstName},mobile:${mobile},CustomerAlias:${CustomerAlias} `);

  var fncName = "searchPersonal()";

  var conditionStr =` WHERE compCode='${compCode}'`;

  if(idCard){
    conditionStr = conditionStr +` AND  idCard like '%${idCard}%' `;
  }

  if(firstName){
    conditionStr = conditionStr +` AND  FirstName like '%${firstName}%' `;
  }

  if(lastName){
    conditionStr = conditionStr +` AND  LastName like '%${lastName}%' `;
  }

  if(mobile){
    conditionStr = conditionStr +` AND Mobile like '%${mobile}%'`;
  }

  if(CustomerAlias){
    conditionStr = conditionStr +` AND CustomerAlias like '%${CustomerAlias}%'`;
  }

  var queryStr = `
  BEGIN

      SELECT * FROM (
          SELECT ROW_NUMBER() OVER(ORDER BY FirstName,LastName) AS NUMBER
          ,CustCode,idCard,FirstName,LastName,CustomerAlias,Mobile,UserOwner
          FROM [MIT_CRM_Personal]
          ${conditionStr}

        ) AS TBL
      WHERE NUMBER BETWEEN ((@page - 1) * @numPerPage + 1) AND (@page * @numPerPage)
      ORDER BY FirstName,LastName

    END
    `;

  // const sql = require("mssql");
  return new Promise(function(resolve, reject) {
    const pool1 = new sql.ConnectionPool(config, err => {
      pool1
        .request()
        .input("numPerPage", sql.Int, numPerPage)
        .input("page", sql.Int, page)
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
      // console.log("ERROR>>" + err);
      logger.error(err)
      reject(err);
    });
  });
}

function getLBDU_Account(compCode,custCode) {

  console.log(`getLBDU_Account()>>  compCode:${compCode}   ;custCode:${custCode}  ;`)

  var queryStr = `
  BEGIN
    select *
    from MIT_CRM_Personal_product a
    where a.compCode= @compCode
    and custCode= @custCode
  END
    `;

  return new Promise(function(resolve, reject) {
    const pool1 = new sql.ConnectionPool(config, err => {
      pool1
        .request()
        .input("compCode", sql.NVarChar(20), compCode)
        .input("custCode", sql.NVarChar(20), custCode)
        .query(queryStr, (err, result) => {
          if (err) {
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



function unitholderBalanceLBDU_ByCRMcustCode(compCode,crmCustCode) {

  logger.info(`unitholderBalanceLBDU_ByCRMcustCode() ;compCode:${compCode}   ;CustCode: ${crmCustCode}`);

  var fncName = "getMaster()";
  var queryStr = `
  BEGIN

  select
  AA .*
  from (
      select A.Account_ID,A.NAVdate,A.Fund_Code ,A.Available_Amount,A.Available_Unit_Balance,A.Unit_balance,A.Average_Cost,A.NAV
      , (((A.Available_Amount -  (A.Unit_balance * A.Average_Cost)) / (A.Unit_balance * A.Average_Cost) ) * 100) AS UPL
      from MIT_FC_UnitholderBalance A
      where A.Account_ID IN(
          select ext_module_ref
            from MIT_CRM_Personal_product a
            where a.compCode=@compCode
            and custCode= @custCode
            and [status]='A'
      )
      and Available_Amount>0 AND Available_Unit_Balance>0  )AA
  INNER JOIN(
      select Fund_Code,MAX(CONVERT(DATETIME, NAVdate, 112)) AS NAVdate
      from MIT_FC_UnitholderBalance
      where Account_ID IN(
          select ext_module_ref
            from MIT_CRM_Personal_product a
            where a.compCode=@compCode
            and custCode= @custCode
            and [status]='A'
      )
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
        .input("compCode", sql.VarChar(20), compCode)
        .input("custCode", sql.VarChar(20), crmCustCode)

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

function unitholderBalanceLBDUByAccount(accountId) {

  logger.info('unitholderBalanceLBDUByAccount()>' +accountId);

  var fncName = "getMaster()";
  var queryStr = `
  BEGIN

  select
  AA .*
  from (
      select A.NAVdate,A.Fund_Code ,A.Available_Amount,A.Available_Unit_Balance,A.Unit_balance,A.Average_Cost,A.NAV
      , (((A.Available_Amount -  (A.Unit_balance * A.Average_Cost)) / (A.Unit_balance * A.Average_Cost) ) * 100) AS UPL
      from MIT_FC_UnitholderBalance A
      where A.Account_ID= @accountId
      and Available_Amount>0 AND Available_Unit_Balance>0  )AA
  INNER JOIN(
      select Fund_Code,MAX(CONVERT(DATETIME, NAVdate, 112)) AS NAVdate
      from MIT_FC_UnitholderBalance
      where Account_ID= @accountId
      and Available_Amount>0 AND Available_Unit_Balance>0
      group by Fund_Code) BB
  ON AA.Fund_Code=BB.Fund_Code  AND AA.NAVdate= BB.NAVdate

  END
    `;

  // const sql = require("mssql");
  return new Promise(function(resolve, reject) {
    const pool1 = new sql.ConnectionPool(config, err => {
      pool1
        .request()
        .input("accountId", sql.VarChar(20), accountId)

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

function getMaster(compCode,refType,lang) {
  // logger.info('getMaster()');

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
  logger.info('getPersonalById()');

  var fncName = "getPersonalById()";
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

function getTaskById(task_id,compCode) {
  logger.info('getTaskById()');

  var fncName = "getTaskById()";
  var queryStr = `
  BEGIN

    select *
    from MIT_CRM_Task
    where compCode=@compCode
    AND task_id=@task_id

  END
    `;
  return new Promise(function(resolve, reject) {
    const pool1 = new sql.ConnectionPool(config, err => {
      pool1
        .request()
        .input("compCode", sql.VarChar(20), compCode)
        .input("task_id", sql.Int, task_id)
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
        .input("Sex", sql.NVarChar(10), personObj.Sex)
        .input("State", sql.NVarChar(50), personObj.State)
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

function updateTask(compCode,actionBy,taskObj){

  var fncName = "updatePersonal()";
  var queryStr = `
  BEGIN

    UPDATE MIT_CRM_Task SET
      schType=@schType,
      schStartDate=@schStartDate,
      title=@title,
      note=@note,
      channel=@channel,
      prodCate=@prodCate,
      productItem=@productItem,
      schCloseDate=@schCloseDate,
      feedBackRS=@feedBackRS,
      feedBackReson=@feedBackReson,
      feedBackNote=@feedBackNote,
      investType=@investType,
      investValue=@investValue,
      investDate=@investDate,
      UpdateBy=@UpdateBy,
      UpdateDate=GETDATE()
    WHERE compCode=@compCode
    AND task_id=@task_id

  END
    `;

  // const sql = require("mssql");
  return new Promise(function(resolve, reject) {
    const pool1 = new sql.ConnectionPool(config, err => {
      pool1
        .request()
        .input("compCode", sql.VarChar(20), compCode)
        .input("task_id", sql.Int, taskObj.task_id)
        .input("schType", sql.VarChar(2), taskObj.schType)
        .input("schStartDate", sql.VarChar(50), taskObj.schStartDate)
        .input("title", sql.NVarChar(200), taskObj.title)
        .input("note", sql.NVarChar(500), taskObj.note)
        .input("channel", sql.VarChar(2), taskObj.channel)
        .input("prodCate", sql.NVarChar(50), taskObj.prodCate)
        .input("productItem", sql.NVarChar(50), taskObj.productItem)
        .input("schCloseDate", sql.NVarChar(50), taskObj.custschCloseDateType)
        .input("feedBackRS", sql.VarChar(50), taskObj.feedBackRS)
        .input("feedBackReson", sql.VarChar(50), taskObj.feedBackReson)
        .input("feedBackNote", sql.NVarChar(200), taskObj.feedBackNote)
        .input("investType", sql.NVarChar(50), taskObj.investType)
        .input("investValue", sql.NVarChar(20), taskObj.investValue)
        .input("investDate", sql.NVarChar(50), taskObj.UserOwner)
        .input("UpdateBy", sql.NVarChar(50), actionBy)

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



function createTask(compCode,actionBy,taskObj){

  var fncName = "createTask()";
  var queryStr = `
  BEGIN
    INSERT INTO MIT_CRM_Task (
          compCode,
          schType,
          schStartDate,
          title,
          note,
          channel,
          prodCate,
          productItem,
          schCloseDate,
          feedBackRS,
          feedBackReson,
          feedBackNote,
          investType,
          investValue,
          investDate,
          CreateBy,
          CreateDate
      )VALUES(
          @compCode,
          @schType,
          @schStartDate,
          @title,
          @note,
          @channel,
          @prodCate,
          @productItem,
          @schCloseDate,
          @feedBackRS,
          @feedBackReson,
          @feedBackNote,
          @investType,
          @investValue,
          @investDate,
          @CreateBy,
          GETDATE()
      )

  END
    `;

  // const sql = require("mssql");
  return new Promise(function(resolve, reject) {
    const pool1 = new sql.ConnectionPool(config, err => {
      pool1
        .request()
        .input("compCode", sql.VarChar(20), compCode)
        .input("schType", sql.VarChar(2), taskObj.schType)
        .input("schStartDate", sql.VarChar(50), taskObj.schStartDate)
        .input("title", sql.NVarChar(200), taskObj.title)
        .input("note", sql.NVarChar(500), taskObj.note)
        .input("channel", sql.VarChar(2), taskObj.channel)
        .input("prodCate", sql.NVarChar(50), taskObj.prodCate)
        .input("productItem", sql.NVarChar(50), taskObj.productItem)
        .input("schCloseDate", sql.NVarChar(50), taskObj.custschCloseDateType)
        .input("feedBackRS", sql.VarChar(50), taskObj.feedBackRS)
        .input("feedBackReson", sql.VarChar(50), taskObj.feedBackReson)
        .input("feedBackNote", sql.NVarChar(200), taskObj.feedBackNote)
        .input("investType", sql.NVarChar(50), taskObj.investType)
        .input("investValue", sql.NVarChar(20), taskObj.investValue)
        .input("investDate", sql.NVarChar(50), taskObj.UserOwner)
        .input("CreateBy", sql.NVarChar(50), actionBy)

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
