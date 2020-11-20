/*
https://nodejs.org/api/crypto.html#crypto_sign_sign_privatekey_outputencoding

*/

const mpamConfig = require('../config/mpam-config');
var logger = require('../config/winston');
var prop = require("../config/backend-property");
const crypto = require('crypto');

const { validationResult } = require('express-validator');

exports.brokerLogin = (req,res,next)=>{

  logger.info("Welcome API brokerLogin/");

  var moment = require('moment')



  // "requestTime":"yyyyMMddHHmmss",
  var requestTime = moment().format('YYYYMMDDHHmmss')
  console.log(requestTime);

  // "signature":"RSA_SHA256(privateKey, yyyyMMddHHmmss)"
  const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
  });

  const sign = crypto.createSign('SHA256');
  sign.update(requestTime);
  sign.end();
  const signature = sign.sign(privateKey);

  const verify = crypto.createVerify('SHA256');
  verify.update(requestTime);
  verify.end();

  verifyResult = verify.verify(publicKey, signature)
  // Prints: true

  res.status(200).json({
    code: '000',
    msg:"Hello on " + requestTime,
    verify:verifyResult
  });

}
