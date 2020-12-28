/*
https://nodejs.org/api/crypto.html#crypto_sign_sign_privatekey_outputencoding
*/

const mpamConfig = require('../config/mpam-config');
var logger = require('../config/winston');
var prop = require("../config/backend-property");

const crypto = require('crypto');
const fs = require('fs');

const { validationResult } = require('express-validator');


const { generateKeyPairSync } = require('crypto');


const { privateKey, publicKey } = crypto.generateKeyPairSync('ec', {
  namedCurve: 'sect239k1',
  publicKeyEncoding:  { type: 'spki', format: 'pem' },
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
});

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


exports.brokerLogin = (req,res,next)=>{

  logger.info("Welcome API brokerLogin/");


  // "requestTime":"yyyyMMddHHmmss",
  var moment = require('moment')
  var requestTime = moment().format('YYYYMMDDHHmmss')
  console.log(requestTime);

  // signature
  const sign = crypto.createSign('SHA256')
  sign.write(requestTime)
  sign.end()
  const signature = sign.sign(eOpen.privateKey, 'hex')


  const verify = crypto.createVerify('SHA256');
  verify.write(requestTime);
  verify.end();
  verifyResult =  verify.verify(eOpen.publicKey, signature,'hex')


  console.log(verifyResult)

  res.status(200).json({
    code: '000',
    msg:"Hello on " + requestTime,
    verify:verifyResult
  });

}
