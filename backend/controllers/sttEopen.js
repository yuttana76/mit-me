/*
https://nodejs.org/api/crypto.html#crypto_sign_sign_privatekey_outputencoding
*/

const mpamConfig = require('../config/mpam-config');
var logger = require('../config/winston');
var prop = require("../config/backend-property");

const crypto = require('crypto');
const fs = require('fs');
const https = require('https')

const { validationResult } = require('express-validator');

// const FC_API_URL= mpamConfig.FC_API_URL


var eOpen = {
  publicKey: '',
  privateKey: '',
};

try{
  eOpen = {
    publicKey: fs.readFileSync(process.env.EOPEN_PUBLIC_KEY),
    privateKey: fs.readFileSync(process.env.EOPEN_PRIVATE_KEY),
  };

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


exports.testApi = (req,res,next)=>{

  timeSync().then(result =>{

    logger.info("testApi>" + JSON.stringify(result))
    res.status(200).json({
      code: '000',
      msg: JSON.stringify(result),
    });
  },err =>{
    logger.error('ERR testApi>>'+err);
    res.status(401).json(err.message);
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

  //   fnArray=[];
  //   fnArray.push(timeSync());
  //   Promise.all(fnArray)
  //   .then(data => {

  //     console.log('***Time sync:'+ JSON.stringify(data))

  //     eOnpeAuth(data[0]).then(result =>{
  //       logger.info("result>" + JSON.stringify(result))
  //       res.status(200).json({
  //         code: '000',
  //         msg: JSON.stringify(result),
  //       });
  //     },err =>{
  //       logger.error('ERR AUTH>>'+err);
  //       res.status(401).json(err.message);
  //     });

  //   })
  // .catch(error => {
  //   logger.error('Error FundConnext schedule;' +error.message)
  //   res.status(401).json(error.message);
  // });

  // *********
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

    var options = {
      host: 'oacctest.settrade.com',
      path:'/api/eopenaccount/v1/'+EOPEN_BROKER_ID+'/broker-login',
      method: "POST",
      headers: {
         "Content-Type": "application/json",
        'Content-Length': body.length
      },
    };

    // logger.info('***options > ' + JSON.stringify(options));

  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0" //this is insecure

  // Call STT
  const request = https.request(options,(res) => {
    logger.info(`statusCode: ${res.statusCode}`)
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

    logger.info("downloadFiles Result>" + JSON.stringify(result))

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

  var applicationId = req.params.applicationId;

  downloadJSON(applicationId).then(result =>{

    logger.info("downloadJSON Result>" + JSON.stringify(result))

  res.status(200).json({
    code: '000',
    data: JSON.stringify(result),
  });

  },err =>{

    logger.error('downloadJSON Error>>'+err);
    res.status(401).json(err.message);

  });

}

exports.applications = (req, res, next) =>{

  var status = req.query.status
  var startLastUpdatedTime = req.query.startLastUpdatedTime +'T00:00:00'
  var endLastUpdatedTime = req.query.endLastUpdatedTime+'T23:59:59';

  logger.info(`*** status:${status}  ;startLastUpdatedTime:${startLastUpdatedTime}  ;endLastUpdatedTime:${endLastUpdatedTime}`)


  // let status='SUBMITTED'
  // let startLastUpdatedTime='2021-02-01T00:00:00'
  // let endLastUpdatedTime='2021-02-20T23:59:59'

  applications(status,startLastUpdatedTime,endLastUpdatedTime).then(result =>{

    logger.info("applications Result>" + JSON.stringify(result))

    if (result === null || result===''){
      res.status(204).json("Not Found");
    }else{
      res.status(200).json(JSON.parse(result));

    }



  },err =>{
    logger.error('applications Error>>'+err);
    res.status(401).json(err.message);
  });

}

//Download file function
const download = require('download');
const DOWNLOAD_PATH  = mpamConfig.EOPEN_DOWNLOAD_PATH
// const EOPEN_API_URL= 'https://oacctest.settrade.com'

const downloadFiles = async (applicationId) => {

  console.log(`Welcome downloadFiles() ${applicationId} `);
  const EOPEN_API_URL= 'https://oacctest.settrade.com'

  var DOWNLOAD_PATH_FILENAME  = DOWNLOAD_PATH  + applicationId;

  const _token = await eOnpeAuth()
  const tokenObj = JSON.parse(_token);

  return new Promise(function(resolve, reject) {

      const HTTPS_ENDPOIN =`${EOPEN_API_URL}/api/eopenaccount/v1/${EOPEN_BROKER_ID}/applications/${applicationId}/files`;
      const option = {
        "Authorization": `Bearer ${tokenObj.token}`,
      };

      console.log(' option >>' + JSON.stringify(option) );
      console.log('HTTPS_ENDPOIN >>' + HTTPS_ENDPOIN);


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

      const EOPEN_API_URL= 'https://oacctest.settrade.com'
      const request = require('request');

      // var param=`?status=${status}&startLastUpdatedTime=${startLastUpdatedTime}&endLastUpdatedTime=${endLastUpdatedTime}`

      const HTTPS_ENDPOIN =`${EOPEN_API_URL}/api/eopenaccount/v1/${EOPEN_BROKER_ID}/applications/${applicationId}`;
      const option = {
        "Authorization": `Bearer ${tokenObj.token}`,
      };

      logger.info(`***OPTION>> ${JSON.stringify(option)}`)
      logger.info(`***HTTPS_ENDPOIN>> ${HTTPS_ENDPOIN}`)

      request({url:HTTPS_ENDPOIN, headers:option}, function(err, response, body) {

        if(err) {
          logger.error(err);
          reject(err);
        }else{
          console.log('RESULT RS>>'+JSON.stringify(JSON.parse(body)))
          resolve(JSON.parse(body))
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

      const EOPEN_API_URL= 'https://oacctest.settrade.com'
      const request = require('request');

      var param=`?status=${status}&startLastUpdatedTime=${startLastUpdatedTime}&endLastUpdatedTime=${endLastUpdatedTime}`

      const HTTPS_ENDPOIN =`${EOPEN_API_URL}/api/eopenaccount/v1/${EOPEN_BROKER_ID}/applications${param}`;
      const option = {
        "Authorization": `Bearer ${tokenObj.token}`,
      };

      logger.info(`***PARAM>> ${param}`)
      logger.info(`***OPTION>> ${JSON.stringify(option)}`)
      logger.info(`***HTTPS_ENDPOIN>> ${HTTPS_ENDPOIN}`)

      request({url:HTTPS_ENDPOIN, headers:option}, function(err, response, body) {

        if(err) {
          logger.error(err);
          reject(err);
        }else{
          console.log('RESULT RS>>'+JSON.stringify(body))
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
