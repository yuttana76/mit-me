/*
https://nodejs.org/api/crypto.html#crypto_sign_sign_privatekey_outputencoding
*/

const mpamConfig = require('../config/mpam-config');
var logger = require('../config/winston');
var prop = require("../config/backend-property");

const crypto = require('crypto');
const fs = require('fs');
const https = require('https')
var mitLog = require('./mitLog');
const mail = require('./mail');


const { validationResult } = require('express-validator');

var config = mpamConfig.dbParameters;

// const FC_API_URL= mpamConfig.FC_API_URL

let ejs = require("ejs");
let pdf = require("html-pdf");
let path = require("path");


var eOpen = {
  publicKey: '',
  privateKey: '',
};

try{
  eOpen = {
    publicKey: fs.readFileSync(process.env.EOPEN_PUBLIC_KEY),
    privateKey: fs.readFileSync(process.env.EOPEN_PRIVATE_KEY),
  };

}catch{
  logger.error("Not found EOPEN_PUBLIC_KEY & EOPEN_PRIVATE_KEY")

}

const EOPEN_API_URL = process.env.EOPEN_API_URL
const EOPEN_BROKER_ID = process.env.EOPEN_BROKER_ID
const EOPEN_PATH = '/api/eopenaccount/v1/'+EOPEN_BROKER_ID+'/broker-login'


let students = [
  {name: "Joy",
   email: "joy@example.com",
   city: "New York",
   country: "USA"},
  {name: "John",
   email: "John@example.com",
   city: "San Francisco",
   country: "USA"},
  {name: "Clark",
   email: "Clark@example.com",
   city: "Seattle",
   country: "USA"},
  {name: "Watson",
   email: "Watson@example.com",
   city: "Boston",
   country: "USA"},
  {name: "Tony",
   email: "Tony@example.com",
   city: "Los Angels",
   country: "USA"
}];

exports.testApi = (req,res,next)=>{

//   var submitDate = new Date("2021-03-31T17:34:04.342");
//   var currDate = new Date();
// logger.info(`submittedTime=${submitDate}   ;DATE=${currDate}`)

// const milliseconds = Math.abs(currDate - submitDate);
// const hours = milliseconds / 36e5;
// logger.info(hours);
// res.status(200).json(hours);

  fundConnextFormPDF().then(data=>{
    res.status(200).json(JSON.stringify(data));
  })

}


// https://stackabuse.com/generating-pdf-files-in-node-js-with-pdfkit/
    const fundConnextFormPDF =(obj)=>{

// logger.info(`Fund data>> ${JSON.stringify(obj)}`)

      return new Promise(function(resolve, reject) {

        ejs.renderFile(path.join(__dirname, './ejs-template/', "report-template.ejs"), {fund: obj}, (err, data) => {
          if (err) {
                logger.error(`Renderfile ${err}`)
                reject(err)
          } else {
              let options = {
                  "height": "11.25in",
                  "width": "8.5in",
                  "header": {
                      "height": "20mm"
                  },
                  "footer": {
                      "height": "20mm",
                  },
              };
              pdf.create(data, options).toFile("fundConnxt-generate.pdf", function (err, data) {
                  if (err) {
                    logger.error(`Create file ${err}`)
                      reject(err)
                  } else {
                      // res.send("File created successfully");
                      resolve("File created successfully");
                  }
              });
          }
        });

    });
}

exports.signVerify = (req,res,next)=>{

  logger.info("Welcome API brokerLogin/");
  // "requestTime":"yyyyMMddHHmmss",
  var moment = require('moment')
  var requestTime = moment().format('YYYYMMDDHHmmss')
  console.log('***requestTime>> ' +requestTime);

// *********METHOD 2************
// sign String
var signerObject = crypto.createSign("RSA-SHA256");
signerObject.update(requestTime);
// var signature2 = signerObject.sign({key:eOpen.privateKey,padding:crypto.constants.RSA_PKCS1_PSS_PADDING}, "base64");
var signature2 = signerObject.sign({key:eOpen.privateKey}, "base64");
logger.info(`***encypted METHOD2: ${signature2.toString("base64")}`);

 //verify String
 var verifierObject = crypto.createVerify("RSA-SHA256");
 verifierObject.update(requestTime);
//  var verified = verifierObject.verify({key:eOpen.publicKey, padding:crypto.constants.RSA_PKCS1_PSS_PADDING}, signature, "base64");
 var verified = verifierObject.verify({key:eOpen.publicKey}, signature2, "base64");
logger.info(`is signature ok? ${verified}`)
// *********METHOD 2************

  res.status(200).json({
    code: '000',
    msg:"Hello on " + requestTime,
    verifyResult:verified
  });

}


// exports.brokerLogin = (req,res,next)=>{

//   logger.info("Welcome API brokerLogin/");
//   eOnpeAuth().then(result =>{

//     logger.info("result>" + JSON.stringify(result))

//   res.status(200).json({
//     code: '000',
//     msg: JSON.stringify(result),
//   });
//   },err =>{
//     logger.error('ERR AUTH>>'+err);
//     res.status(401).json(err.message);
//   });
// }

exports.brokerLogin = (req,res,next)=>{

  logger.info("Welcome API brokerLogin/");

  eOnpeAuth().then(result =>{
    logger.info("result>" + JSON.stringify(result))
    res.status(200).json({
      code: '000',
      msg: JSON.stringify(result),
    });
  },err =>{
    logger.error('ERR AUTH>>'+err);
    res.status(401).json(err.message);
  });

}


// time.navy.mi.th
const timeSync =()=>{

  return new Promise(function(resolve, reject) {

    var ntpClient = require('ntp-client');

// ntpClient.getNetworkTime("asia.pool.ntp.org", 123, function(err, date) {
ntpClient.getNetworkTime("1.th.pool.ntp.org", 123, function(err, _date) {
    if(err) {
        console.error(err);
        return;
    }

    // console.log(`Current time : ${_date}` );

    let date_ob = new Date(_date);
    // current date
    // adjust 0 before single digit date
    let date = ("0" + date_ob.getDate()).slice(-2);

    // current month
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

    // current year
    let year = date_ob.getFullYear();

    // current hours
    // let hours = date_ob.getHours();
    let hours = ("0" + (date_ob.getHours())).slice(-2);

    // current minutes
    // let minutes = date_ob.getMinutes();
    let minutes = ("0" + (date_ob.getMinutes())).slice(-2);

    // current seconds
    // let seconds = date_ob.getSeconds();
    let seconds = ("0" + (date_ob.getSeconds())).slice(-2);

    // YYYYMMDDHHmmss
    let dateFormated = ''
    dateFormated=dateFormated.concat(year,month,date,hours,minutes,seconds)

    resolve(dateFormated)
});

  });
}

const eOnpeAuth = async () => {
// function eOnpeAuth(){

    // Method 1
    // var moment = require('moment')
    // var requestTime = moment().format('YYYYMMDDHHmmss')

    // Sync time
    const requestTime = await timeSync()
    // logger.info('Welcome fnFCAuth() requestTime > ' + requestTime);


    // signature
    var signerObject = crypto.createSign("RSA-SHA256");
    signerObject.update(requestTime);

    // console.log(`PUB>>`+eOpen.publicKey)

    var signature2 = signerObject.sign({key:eOpen.privateKey}, "base64");
    // logger.info(`***signature : ${signature2.toString("base64")}`);

    //verify String
    // var verifierObject = crypto.createVerify("RSA-SHA256");
    // verifierObject.update(requestTime);
    // var verified = verifierObject.verify({key:eOpen.publicKey}, signature2, "base64");
    // logger.info(`signature verify? ${verified}`)
    // *********METHOD 2************

    //Body
    const body = JSON.stringify({
      requestTime:requestTime,
      signature:signature2
    })

    // logger.info(`***body : ${JSON.stringify(body)}`);

  return new Promise(function(resolve, reject) {

    // EOPEN_API_URL

    var options = {
      host: EOPEN_API_URL,
      path:'/api/eopenaccount/v1/'+EOPEN_BROKER_ID+'/broker-login',
      method: "POST",
      headers: {
         "Content-Type": "application/json",
        'Content-Length': body.length
      },
    };

    // logger.info('***auth options > ' + JSON.stringify(options));

  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0" //this is insecure

  // Call STT
  const request = https.request(options,(res) => {
    // logger.info(`statusCode: ${res.statusCode}`)
    if(res.statusCode==='400'){
      reject(res.statusCode);
    }

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
    logger.error('err fnFCAuth>');
    reject(e);
  });

  request.write(body);
  request.end();

  });
}

// Test data
// AppID:11002915
// CID:1309913659936

exports.downloadFiles = (req, res, next) =>{

  var applicationId = req.params.applicationId;

  downloadFiles(applicationId).then(result =>{

    // logger.info("downloadFiles Result>" + JSON.stringify(result))

  res.status(200).json({
    code: '000',
    data: JSON.stringify(result),
  });

  },err =>{

    logger.error('downloadJSON Error>>'+err);
    res.status(401).json(err.message);

  });

}

exports.downloadJSON = (req, res, next) =>{

  let actionBy='MIT-SYS'

  var applicationId = req.params.applicationId;

  downloadJSON(applicationId).then(jsonData =>{

    if(jsonData){

      objData = JSON.parse(jsonData);
      sttAccDataToDB(objData,actionBy).then({

      });

      logger.info(`Finish E-Open JSON download `)
      res.status(200).json(objData);

    }else{
          logger.info(`Not found data with>> ${JSON.stringify(jsonData)}`)
          res.status(200).json(jsonData);
    }

  },err =>{

    logger.error('downloadJSON Error>>'+err);
    res.status(401).json(err.message);

  });

}

/*
status: (blank is get all status)
- CREATED - SUBMITTED - NEED_MODIFICATION - REJECTED - APPROVED
 */
exports.applications = (req, res, next) =>{

  // var status = req.query.status
  var startdate = req.query.startdate //yyyy-mm-dd
  var enddate = req.query.enddate //yyyy-mm-dd

  // let status='SUBMITTED'
  let status=''
  let startLastUpdatedTime= startdate +'T00:00:00';
  let endLastUpdatedTime=enddate +'T23:59:59';

  // let startLastUpdatedTime= '2021-03-31T00:00:00'
  // let endLastUpdatedTime='2021-04-01T23:59:59'
  let actionBy='MIT-SYS'

  logger.info(`*** status:${status}  ;startLastUpdatedTime:${startLastUpdatedTime}  ;endLastUpdatedTime:${endLastUpdatedTime}`)

  applications(status,startLastUpdatedTime,endLastUpdatedTime).then(appData =>{


    if(appData){

      objData = JSON.parse(appData);
      if(objData && objData.length>0){
        objData.forEach(function(obj) {

          sttAccToDB(obj,actionBy).then({
          });

          // var submittedTime   = obj.submittedTime
          var submitDate = new Date(obj.submittedTime);
          var currDate = new Date();

        // Calculate to be hours
        const milliseconds = Math.abs(currDate - submitDate);
        const hours = milliseconds / 36e5;

        logger.info(`submittedTime=${submitDate}   ;DATE=${currDate}`)
        logger.info(`hours=${hours} `)

          if(obj.status==='SUBMITTED' && hours < 25){

            //GET JSON data
            downloadJSON(obj.applicationId).then(jsonData =>{

              if(jsonData){

                objInfo=JSON.parse(jsonData)
                otherInfo = objInfo.data.otherInfo;

                _ReferralCodeArray =  otherInfo.filter(it => it.questionId === 'ReferralCode');
                _ReferralCodeObj=_ReferralCodeArray[0].answer;
                // logger.info(` ***_ReferralCode RS>> ${JSON.stringify(_ReferralCodeObj[0].label)}` )

                _ReferralNameArray =  otherInfo.filter(it => it.questionId === 'ReferralName');
                _ReferralNameObj=_ReferralNameArray[0].answer;
                // logger.info(` ***_ReferralName RS>> ${JSON.stringify(_ReferralNameObj[0].label)}` )

              data=` ${objInfo.applicationId}|${objInfo.submittedTime}|${objInfo.data.thFirstName}  ${objInfo.data.thLastName}|${_ReferralCodeObj[0].label}|${_ReferralNameObj[0].label}|              `
              mitLog.saveMITlog(objInfo.applicationId,'STT_EOPEN_SUBMITTED',data,req.ip,req.originalUrl,function(){});

              }


            });
          }

        });
        logger.info(`Finish E-Open download `)
        res.status(200).json(objData);
      }else{
        logger.info(`Not found data with>> ${JSON.stringify(objData)}`)
        res.status(200).json(objData);
      }

    }else{
      logger.info(`Not found data with>> ${JSON.stringify(appData)}`)
      res.status(200).json(appData);
    }

  },err =>{
    logger.error('applications Error>>'+err);
    res.status(401).json(err.message);
  });
}

//Download file function
const download = require('download');
const { json } = require('body-parser');
const DOWNLOAD_PATH  = mpamConfig.EOPEN_DOWNLOAD_PATH
// const EOPEN_API_URL= 'https://oacctest.settrade.com'

const downloadFiles = async (applicationId) => {

  console.log(`Welcome downloadFiles() ${applicationId} `);
  // const EOPEN_API_URL= 'https://oacctest.settrade.com'

  var DOWNLOAD_PATH_FILENAME  = DOWNLOAD_PATH  + applicationId;

  const _token = await eOnpeAuth()
  const tokenObj = JSON.parse(_token);

  return new Promise(function(resolve, reject) {

      const HTTPS_ENDPOIN =`https://${EOPEN_API_URL}/api/eopenaccount/v1/${EOPEN_BROKER_ID}/applications/${applicationId}/files`;
      const option = {
        "Authorization": `Bearer ${tokenObj.token}`,
      };

      // console.log(' option >>' + JSON.stringify(option) );
      // console.log('HTTPS_ENDPOIN >>' + HTTPS_ENDPOIN);


      // // ****** start CALL
      download(HTTPS_ENDPOIN,{'headers':option,'rejectUnauthorized': false}).then(data => {

        console.log(`data >>> ${data}`)

        try{
          fs.writeFile(DOWNLOAD_PATH_FILENAME, data, function(err) {
            if(err) {
                logger.error(err)
                reject(err);
            }
            resolve({path:DOWNLOAD_PATH_FILENAME});
          });
        }catch(err){
          reject(err);
        }
      },err=>{
        logger.error('DOWNLOAD'+err)
        reject(err);
      });
      // ****** end CALL

  });

}

  // const downloadFiles = async (applicationId) => {

  //   logger.info(`downloadFiles() ${applicationId} `)

  //   const _token = await eOnpeAuth()
  //   const tokenObj = JSON.parse(_token);

  //   // logger.info(`TOKEN>> ${JSON.stringify(tokenObj)}`)

  //   return new Promise(function(resolve, reject) {

  //     process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0" //this is insecure


  //     const request = require('request');

  //     // var param=`?status=${status}&startLastUpdatedTime=${startLastUpdatedTime}&endLastUpdatedTime=${endLastUpdatedTime}`

  //     const HTTPS_ENDPOIN =`${EOPEN_API_URL}/api/eopenaccount/v1/${EOPEN_BROKER_ID}/applications/${applicationId}/files`;
  //     const option = {
  //       "Authorization": `Bearer ${tokenObj.token}`,
  //     };

  //     logger.info(`***OPTION>> ${JSON.stringify(option)}`)
  //     logger.info(`***HTTPS_ENDPOIN>> ${HTTPS_ENDPOIN}`)

  //     request({url:HTTPS_ENDPOIN, headers:option}, function(err, response, body) {

  //       if(err) {
  //         logger.error(err);
  //         reject(err);
  //       }else{
  //         console.log('RESULT RS>>'+JSON.stringify(JSON.parse(body)))
  //         resolve(JSON.parse(body))
  //       }
  //     });

  //   });

  // }

  const downloadJSON = async (applicationId) => {

    logger.info(`downloadJSON() ${applicationId} `)

    const _token = await eOnpeAuth()
    const tokenObj = JSON.parse(_token);

    // logger.info(`TOKEN>> ${JSON.stringify(tokenObj)}`)

    return new Promise(function(resolve, reject) {

      process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0" //this is insecure

      // const EOPEN_API_URL= 'https://oacctest.settrade.com'
      const request = require('request');

      // var param=`?status=${status}&startLastUpdatedTime=${startLastUpdatedTime}&endLastUpdatedTime=${endLastUpdatedTime}`

      const HTTPS_ENDPOIN =`https://${EOPEN_API_URL}/api/eopenaccount/v1/${EOPEN_BROKER_ID}/applications/${applicationId}`;
      const option = {
        "Authorization": `Bearer ${tokenObj.token}`,
      };

      // logger.info(`***OPTION>> ${JSON.stringify(option)}`)
      // logger.info(`***HTTPS_ENDPOIN>> ${HTTPS_ENDPOIN}`)

      request({url:HTTPS_ENDPOIN, headers:option}, function(err, response, body) {

        if(err) {
          logger.error(err);
          reject(err);
        }else{

          if(body){
            // console.log('RESULT 2 RS>>'+JSON.stringify(JSON.parse(body)))
            resolve(JSON.stringify(JSON.parse(body)))
          }else{
            resolve()
          }

        }
      });

    });

  }

  const applications = async (status,startLastUpdatedTime,endLastUpdatedTime) => {

    logger.info(`applications() `)

    const _token = await eOnpeAuth()
    const tokenObj = JSON.parse(_token);

    // logger.info(`TOKEN>> ${JSON.stringify(tokenObj)}`)

    return new Promise(function(resolve, reject) {

      process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0" //this is insecure

      // const EOPEN_API_URL= 'https://oacctest.settrade.com'

      const request = require('request');

      var param=`?status=${status}&startLastUpdatedTime=${startLastUpdatedTime}&endLastUpdatedTime=${endLastUpdatedTime}`

      const HTTPS_ENDPOIN =`https://${EOPEN_API_URL}/api/eopenaccount/v1/${EOPEN_BROKER_ID}/applications${param}`;
      const option = {
        "Authorization": `Bearer ${tokenObj.token}`,
      };

      // logger.info(`***PARAM>> ${param}`)
      // logger.info(`***OPTION>> ${JSON.stringify(option)}`)
      // logger.info(`***HTTPS_ENDPOIN>> ${HTTPS_ENDPOIN}`)

      request({url:HTTPS_ENDPOIN, headers:option}, function(err, response, body) {

        if(err) {
          logger.error(err);
          reject(err);
        }else{
          // console.log('RESULT RS>>'+JSON.stringify(body))
          resolve(body)
        }
      });

    });

  }

// const promiseToDoSomething = () => {
//   return new Promise(resolve => {
//     setTimeout(() => resolve('I did something'), 10000)
//   })
// }

// const watchOverSomeoneDoingSomething = async () => {
//   const something = await eOnpeAuth()
//   return something + '\nand I watched'
// }

// const watchOverSomeoneWatchingSomeoneDoingSomething = async () => {
//   const something = await watchOverSomeoneDoingSomething()
//   return something + '\nand I watched as well'
// }

// watchOverSomeoneWatchingSomeoneDoingSomething().then(res => {
//   console.log(res)
// })


function sttAccToDB(accObj,actionBy){

  console.log("sttAccToDB()" + JSON.stringify(accObj));

  let firstName=''
  let lastName=''
  let telNo=''

  if(accObj.user){
    firstName=accObj.user.firstName
    lastName=accObj.user.lastName
    telNo=accObj.user.telNo
  }

  var queryStr = `
  BEGIN TRANSACTION TranName;

  UPDATE MIT_stt_Acc_app_list SET
      [status]=@status,
      [types]=@types,
      [verificationType]=@verificationType,
      [ndidStatus]=@ndidStatus,
      [jsonData]=@jsonData,
      firstName=@firstName,
      lastName=@lastName,
      telNo=@telNo,
      accCreatedTime=@accCreatedTime,
      accLastUpdatedTime=@accLastUpdatedTime,
      accSubmittedTime=@accSubmittedTime,
      [UpdateBy]=@actionBy,
      [UpdateDate]=getDate()
      WHERE applicationId =@applicationId
      AND status =@status
  IF @@ROWCOUNT=0
    BEGIN
        INSERT INTO MIT_stt_Acc_app_list(
            applicationId,
            status,
            types,
            verificationType,
            ndidStatus,
            jsonData,
            firstName,
            lastName,
            telNo,
            accCreatedTime,
            accLastUpdatedTime,
            accSubmittedTime,
            CreateBy,
            CreateDate
            )values(
          @applicationId
          ,@status
          ,@types
          ,@verificationType
          ,@ndidStatus
          ,@jsonData
          ,@firstName
          ,@lastName
          ,@telNo
          ,@accCreatedTime
          ,@accLastUpdatedTime
          ,@accSubmittedTime
          ,@actionBy
          ,getDate()
        )
    END

COMMIT TRANSACTION TranName;
  `;

  const sql = require('mssql')

  return new Promise(function(resolve, reject) {

    const pool1 = new sql.ConnectionPool(config, err => {
      pool1.request()
      .input("actionBy", sql.VarChar(50), actionBy)
      .input("applicationId", sql.VarChar(20), accObj.applicationId)
      .input("status", sql.VarChar(30), accObj.status)
      .input("types", sql.VarChar(30), accObj.types)
      .input("verificationType", sql.VarChar(10), accObj.verificationType)
      .input("ndidStatus", sql.VarChar(20), accObj.ndidStatus)
      .input("jsonData", sql.NVarChar('max'), JSON.stringify(accObj))
      .input("firstName", sql.NVarChar(50), firstName)
      .input("lastName", sql.NVarChar(50),lastName)
      .input("telNo", sql.VarChar(30), telNo)

      .input("accCreatedTime", sql.VarChar(30),accObj.createdTime)
      .input("accLastUpdatedTime", sql.VarChar(30), accObj.lastUpdatedTime)
      .input("accSubmittedTime", sql.VarChar(30), accObj.submittedTime)

      .query(queryStr, (err, result) => {
        // console.log(JSON.stringify(result));
          if(err){
            const err_msg=err;
            logger.error('Messge:'+err_msg);
            resolve({code:'9',message:''+err_msg});
          }else {
            resolve({code:'0'});
          }
      })
    })
    pool1.on('error', err => {
      logger.error(err);
      reject(err);
    })
  });
}

function sttAccDataToDB(accObj,actionBy){

  console.log("sttAccToDB()" + JSON.stringify(accObj));

  let firstName=''
  let lastName=''
  let telNo=''

  if(accObj.user){
    firstName=accObj.data.thFirstName
    lastName=accObj.data.thLastName
    telNo=accObj.data.mobileNumber
  }

  var queryStr = `
  BEGIN TRANSACTION TranName;

  UPDATE MIT_stt_Acc_app_data SET
      [status]=@status,
      [types]=@types,
      [verificationType]=@verificationType,
      [ndidStatus]=@ndidStatus,
      [jsonData]=@jsonData,
      firstName=@firstName,
      lastName=@lastName,
      telNo=@telNo,
      accCreatedTime=@accCreatedTime,
      accLastUpdatedTime=@accLastUpdatedTime,
      submittedTime=@submittedTime,

      [UpdateBy]=@actionBy,
      [UpdateDate]=getDate()
      WHERE applicationId =@applicationId
      AND status =@status
  IF @@ROWCOUNT=0
    BEGIN
        INSERT INTO MIT_stt_Acc_app_data(
            applicationId,
            status,
            types,
            verificationType,
            ndidStatus,
            jsonData,
            firstName,
            lastName,
            telNo,
            accCreatedTime,
            accLastUpdatedTime,
            submittedTime,
            CreateBy,
            CreateDate
            )values(
          @applicationId
          ,@status
          ,@types
          ,@verificationType
          ,@ndidStatus
          ,@jsonData
          ,@firstName
          ,@lastName
          ,@telNo
          ,@accCreatedTime
          ,@accLastUpdatedTime
          ,@submittedTime
          ,@actionBy
          ,getDate()
        )
    END

COMMIT TRANSACTION TranName;
  `;

  const sql = require('mssql')

  return new Promise(function(resolve, reject) {

    const pool1 = new sql.ConnectionPool(config, err => {
      pool1.request()
      .input("actionBy", sql.VarChar(50), actionBy)
      .input("applicationId", sql.VarChar(20), accObj.applicationId)
      .input("status", sql.VarChar(30), accObj.status)
      .input("types", sql.VarChar(30), accObj.types)
      .input("verificationType", sql.VarChar(10), accObj.verificationType)
      .input("ndidStatus", sql.VarChar(20), accObj.ndidStatus)
      .input("jsonData", sql.NVarChar('max'), JSON.stringify(accObj))

      .input("firstName", sql.NVarChar(50), firstName)
      .input("lastName", sql.NVarChar(50),lastName)
      .input("telNo", sql.VarChar(30), telNo)

      .input("accCreatedTime", sql.VarChar(30),accObj.createdTime)
      .input("accLastUpdatedTime", sql.VarChar(30), accObj.lastUpdatedTime)
      .input("submittedTime", sql.VarChar(30), accObj.submittedTime)

      .query(queryStr, (err, result) => {
        // console.log(JSON.stringify(result));
          if(err){
            const err_msg=err;
            logger.error('Messge:'+err_msg);
            resolve({code:'9',message:''+err_msg});
          }else {
            resolve({code:'0'});
          }
      })
    })
    pool1.on('error', err => {
      logger.error(err);
      reject(err);
    })
  });
}


exports.reportSCHMitlog = (req, res, next) => {
  var businessDate = getCurrentDate();
  logger.info('reportSCHMitlog API; businessDate:' + businessDate )
  const REPORT_SUBJECT =`E-Open submited On  ${businessDate} `
  const HTML_HEADER=`
  <head>
<style>
table {
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 100%;
}

td, th {
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
}

tr:nth-child(even) {
  background-color: #dddddd;
}
</style>
</head>
<body>
  `;

  const HTML_FOOTER=`
  </body>
</html>
  `;

  const MaskData = require('maskdata');
  const maskCardOptions = {
    maskWith: "X",
    unmaskedStartDigits: 4,
    unmaskedEndDigits: 3
  };


  fnArray=[];
  fnArray.push(exports.reportSCHMitlogPROC(businessDate,'STT_EOPEN_SUBMITTED'));

  Promise.all(fnArray)
  .then(repData => {

    // Report process result by Mail
    var mailBody='<h1>E-Open submited On' + businessDate + '</h1>'
    mailBody += '<h3>Application submied ('+repData[0].length+') </h3>'


 // *** Customer profile
 mailBody +=`<TABLE>
 <th>applicationId</th>
 <th>submitted Time</th>
 <th>Applicate Name</th>
 <th>Referral Code</th>
 <th>Referral Name</th>
`

  // MAIL to IT
    repData[0].forEach(function(item){

      var _splitData = item.msg.split("|")
      // logger.info('Report before split>>' + JSON.stringify(_splitData))
      // const dataAfterMasking = MaskData.maskCard(_splitData[0], maskCardOptions);

      mailBody += '<tr>'
      + '<td>' +_splitData[0]+ '</td>'
      + '<td>' +_splitData[1]+ '</td>'
      + '<td>' +_splitData[2]+ '</td>'
      + '<td>' +_splitData[3]+ '</td>'
      + '<td>' +_splitData[4]+ '</td>'
      +'</tr>'
    })
    mailBody +='</TABLE>'

    // *** Send mail
    var mailObj={
      subject:REPORT_SUBJECT,
      body:HTML_HEADER + mailBody + HTML_FOOTER,
      to:'yuttana@merchantasset.co.th'
    }
    mail.sendMailIT(mailObj);

    res.status(200).json('reportSCHMitlog successful.');
  })
  .catch(error => {
    logger.error(error.message)
    res.status(401).json(error.message);
  });
}



exports.reportSCHMitlogPROC = ((_date,keyword) => {

  // logger.info('reportSCHMitlogPROC()' + _date + ' ;keyword:' + keyword);

  return new Promise((resolve, reject) => {

    const sql = require('mssql')

    var queryStr = `
    SELECT distinct(log_msg) AS msg
    FROM MIT_LOG
    WHERE [module]= @module
    AND CONVERT(varchar,LogDateTime,112)  = CONVERT(varchar,@LogDateTime,112)
    `
    const pool1 = new sql.ConnectionPool(config, err => {
      pool1.request() // or: new sql.Request(pool1)
      .input("module", sql.VarChar(50), keyword)
      .input("LogDateTime", sql.VarChar(50), _date)
      .query(queryStr, (err, result) => {
          if(err){
            logger.error(err);
            reject(err);
          }else {
            resolve(result.recordset);
          }
      })
    })
    pool1.on('error', err => {
      logger.error(err);
      resolve(err);
    })
  });
});


function getCurrentDate(){
  var today = new Date();
  var returnDate_yyyymmddDate;

  today.setDate(today.getDate());
  returnDate_yyyymmddDate = today.getFullYear()+''+("0" + (today.getMonth() + 1)).slice(-2)+''+("0" + today.getDate()).slice(-2);

  return returnDate_yyyymmddDate
}
