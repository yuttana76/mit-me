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

const eOpen = {
  publicKey: fs.readFileSync(process.env.EOPEN_PUBLIC_KEY),
  privateKey: fs.readFileSync(process.env.EOPEN_PRIVATE_KEY),
};

const EOPEN_API_URL = process.env.EOPEN_API_URL
const EOPEN_BROKER_ID = process.env.EOPEN_BROKER_ID
const EOPEN_PATH = '/api/eopenaccount/v1/'+EOPEN_BROKER_ID+'/broker-login'


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

const eOnpeAuth = () => {
// function eOnpeAuth(){
  logger.info('Welcome fnFCAuth() ');

    // "requestTime":"yyyyMMddHHmmss",
    var moment = require('moment')
    var requestTime = moment().format('YYYYMMDDHHmmss')

    logger.info('***requestTime > ' + requestTime);

    // signature
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

    //Body
    const body = JSON.stringify({
      requestTime:requestTime,
      signature:signature2
    })

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

  const request = https.request(options,(res) => {

    console.log(`statusCode: ${res.statusCode}`)

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

  // Write data to request body
  // logger.info('***FC_API_AUTH > ' + JSON.stringify(FC_API_AUTH));
  request.write(body);
  request.end();

  });
}


exports.downloadJSON = (req, res, next) =>{

  var cardNapplicationIdumber = req.params.applicationId;

  downloadJSON(cardNapplicationIdumber).then(result =>{

    logger.info("downloadJSON Result>" + JSON.stringify(result))

  res.status(200).json({
    code: '000',
    msg: JSON.stringify(result),
  });

  },err =>{

    logger.error('downloadJSON Error>>'+err);
    res.status(401).json(err.message);

  });

}

// function downloadJSON(applicationId){
const downloadJSON = async (applicationId) => {

  const token = await eOnpeAuth()

  return new Promise(function(resolve, reject) {

    var options = {
      host: 'oacctest.settrade.com',
      path: `/api/eopenaccount/v1/${EOPEN_BROKER_ID}/applications/${applicationId}`,
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        //  "Content-Type": "application/json",
      },
    };

    logger.info('***token > ' + token);
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0" //this is insecure
    logger.info('***options > ' + JSON.stringify(options));
  const request = https.request(options,(res) => {

    console.log(`statusCode: ${res.statusCode}`)

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

  // Write data to request body
  // logger.info('***FC_API_AUTH > ' + JSON.stringify(FC_API_AUTH));
  request.write(body);
  request.end();

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
