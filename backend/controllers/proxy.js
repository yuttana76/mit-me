const dbConfig = require('../config/db-config');
const fs = require('fs');
const path = require('path');

var config = dbConfig.dbParameters;
const https = require('https')
const crypto = require('crypto');

// SIT Environment: https://ndidproxydev.finnet.co.th
// UAT Environment: https://ndidproxytest.finnet.co.th
// Production Environment: https://ndidproxy.finnet.co.th

const PROXY_HTTPS = "https://ndidproxydev.finnet.co.th";
const API_AUTH_TOKEN_PATH = "/api/auth/token";
// const API_AUTH_TOKEN = "/api/auth/token";


exports.callback = (req, res, next) => {
  console.log("Welcome API /callback");
  res.status(200).json({
    result:JSON.stringify(req.body)
  });
}

exports.authtoken = (req, res, next) => {
  console.log("Welcome API /authtoken");
  fnAuthtoken().then(result=>{
    res.status(200).json({
      message: "Proxy auth successful",
      result:result
    });
  },err=>{
    res.status(401).json({
      message: err
    });
  });
}



function fnAuthtoken(){

  console.log("Welcome Function authtoken()");

  return new Promise(function(resolve, reject) {

      var _Path = path.resolve('./backend/merchantasset_CA/proxy/auth.json');
      let authData = fs.readFileSync(_Path, "utf8"); //ascii,utf8
      let authObj = JSON.parse(authData);
      const _request_time =new Date().toISOString().replace(/\..+/, '') ;
      authObj.request_time = _request_time;

      let data = authObj.client_code +"|" +authObj.request_time;
      fnSignPrivateKey(data).then(result=>{

        authObj.signature = result;
        console.log(` authObj >> ${JSON.stringify(authObj)}`);
      /**
       * HTTPS REQUEST
       */
        var options = {
          host: PROXY_HTTPS,
          path:API_AUTH_TOKEN_PATH,
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        };

        process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0" //this is insecure
        const request = https.request(options,(res) => {
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
          reject(e);
        });

        // Write data to request body
        request.write(authObj);
        request.end();
      /**
       * HTTPS REQUEST (END)
       */

        },err=>{
          reject(err);
        })
  });
}


function fnSignPrivateKey(data){
  return new Promise(function(resolve, reject) {

    // ****************Crypto
      try {

        var _privateKeyPath = path.resolve('./backend/merchantasset_CA/proxy/private_key.pem');
        let _privateKey = fs.readFileSync(_privateKeyPath, "utf8"); //ascii,utf8

        /**
         * SHA256
         */
        const sign = crypto.createSign('RSA-SHA256');
        sign.update(data);
        sign.end();

        const signature = sign.sign(_privateKey,'base64');

        resolve(signature);

        /**
         * VERIFY SIGN
         */
        // var _publicKeyPath = path.resolve('./backend/merchantasset_CA/proxy/786c_key.pub');
        // let _publicKeyData = fs.readFileSync(_publicKeyPath, "utf8"); //ascii,utf8
        // const verify = crypto.createVerify('RSA-SHA256');
        // verify.update(_signatureData);
        // verify.end();
        // console.log('VERIFY >>'+ verify.verify(_publicKeyData, signature,'base64'));

      }
      catch (e) {
        reject(e)
        console.log("entering catch block");
        console.log(e);
        console.log("leaving catch block");
      }

  });
}
