const dbConfig = require('../config/db-config');
const fs = require('fs');
const path = require('path');

var config = dbConfig.dbParameters;
const https = require('https')
const crypto = require('crypto');
var logger = require("../config/winston");

// SIT Environment: https://ndidproxydev.finnet.co.th
// UAT Environment: https://ndidproxytest.finnet.co.th
// Production Environment: https://ndidproxy.finnet.co.th

const HTTPS ='https://';
const PROXY_HTTPS = "ndidproxydev.finnet.co.th";
const API_AUTH_TOKEN_PATH = "/api/auth/token";
const API_GET_PROVIDERS_PATH = "/ndidproxy/api/identity/providers";
const API_GET_SERVICES_PATH = "/ndidproxy/api/services";
const API_GET_SERVICES_AS_PATH = "/ndidproxy/api/as/";
const API_POST_IDEN_VERIFY_PATH = "/ndidproxy/api/identity/verify";


exports.callback = (req, res, next) => {

  logger.info("/api/proxy/callback" + JSON.stringify(req.body));

  res.status(200).json({
    result:"MPAM callback successful"
  });
}

exports.ProxyAuthtoken = (req, res, next) => {
  logger.info("Welcome API /authtoken");

  fnAuthtoken().then(result=>{
    res.status(200).json(result);
  },err=>{
    res.status(401).json(err);
  });
}

exports.ProxyProviders = (req, res, next) => {
  logger.info("Welcome API /providers");

  const token = req.body.token;
  const identifier= req.body.identifier;
  const namespace = req.body.namespace;
  const min_ial= req.body.min_ial;
  const min_aal= req.body.min_aal;

  fnGetProviders(token,identifier,namespace,min_ial,min_aal).then(result=>{
    res.status(200).json(result);
  },err=>{
    res.status(401).json(err);
  });
}



exports.ProxyServices = (req, res, next) => {
  logger.info("Welcome API /services");

  const token = req.body.token;

  fnGetServices(token).then(result=>{
    res.status(200).json(result);
  },err=>{
    res.status(401).json(err);
  });
}

exports.ProxyServiceAs = (req, res, next) => {
  logger.info("Welcome API /serviceAs");

  const token = req.body.token;
  const service_id = req.body.service_id;

  fnGetServicesAS(token,service_id).then(result=>{
    res.status(200).json(result);
  },err=>{
    res.status(401).json(err);
  });
}


// **********************FUNCTIONs
function fnGetServicesAS(token,service_id){

  return new Promise(function(resolve, reject) {

      process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0" //this is insecure
      /**
     * HTTPS REQUEST (START)
     */
      const request = require('request');
      const HTTPS_ENDPOIN =`https://${PROXY_HTTPS}${API_GET_SERVICES_AS_PATH}${service_id}`;

      var propertiesObject = {
        "token":token,
      };

      request({url:HTTPS_ENDPOIN, qs:propertiesObject}, function(err, response, body) {
      logger.info(response.body.url);
      if(err) {
        logger.error(err);
        reject(err);
      }else{
        logger.info(body);
        resolve(body)
      }
    });
    /**
     * HTTPS REQUEST (END)
     */

  });

}

function fnGetServices(token){

  return new Promise(function(resolve, reject) {

      process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0" //this is insecure
      /**
     * HTTPS REQUEST (START)
     */
      const request = require('request');
      const HTTPS_ENDPOIN =`https://${PROXY_HTTPS}${API_GET_SERVICES_PATH}`;

      var propertiesObject = {
        "token":token,
      };

      request({url:HTTPS_ENDPOIN, qs:propertiesObject}, function(err, response, body) {
      logger.info(response.body.url);
      if(err) {
        logger.error(err);
        reject(err);
      }else{
        logger.info(body);
        resolve(body)
      }
    });
    /**
     * HTTPS REQUEST (END)
     */

  });

}


function fnGetProviders(token,identifier,namespace,min_ial,min_aal){

  return new Promise(function(resolve, reject) {

      process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0" //this is insecure
      /**
     * HTTPS REQUEST (START)
     */
      const request = require('request');
      const HTTPS_ENDPOIN =`https://${PROXY_HTTPS}${API_GET_PROVIDERS_PATH}`;

      var propertiesObject = {
        "token":token,
        "namespace": namespace,
        "identifier":identifier,
        "min_ial": min_ial,
        "min_aal": min_aal
      };

      request({url:HTTPS_ENDPOIN, qs:propertiesObject}, function(err, response, body) {
      logger.info(response.body.url);
      if(err) {
        logger.error(err);
        reject(err);
      }else{
        logger.info(body);
        resolve(body)
      }
    });
    /**
     * HTTPS REQUEST (END)
     */

  });

}

function fnAuthtoken(){

  console.log("Welcome Function authtoken()");

  return new Promise(function(resolve, reject) {

      var _Path = path.resolve('./backend/merchantasset_CA/proxy/proxy_auth.json');
      let authData = fs.readFileSync(_Path, "utf8"); //ascii,utf8
      let authObj = JSON.parse(authData);

      const _request_time = NOW();
      authObj.request_time = _request_time;

      let data = authObj.client_code +"|" +authObj.request_time;

      fnSignPrivateKey(data).then(signature=>{

        authObj.signature = signature;

        authObj_JSON = JSON.stringify(authObj);
        // console.log(` authObj_JSON >> ${authObj_JSON}`);
        // resolve(authObj_JSON);

      /**
       * HTTPS REQUEST
       */
        var options = {
          host: PROXY_HTTPS,
          path:API_AUTH_TOKEN_PATH,
          method: "POST",
          timeout: 10000,
          headers: {
            "Content-Type": "application/json",
            'Content-Length': authObj_JSON.length
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
            // console.log("RESULT >>" + _chunk);
            logger.info(_chunk);

            resolve(_chunk);
          });
        });

        request.on('error', (e) => {
          // console.log('HTTP ERR>>' + e);
          reject(e);
        });

        // Write data to request body
        logger.info(authObj_JSON);

        request.write(authObj_JSON);
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

        let signature = sign.sign(_privateKey,'base64');

        // console.log('1>>' + signature);

        var URLSafeBase64 = require('urlsafe-base64');
        signature = randomURLSafeBase64 = URLSafeBase64.encode(signature);
        // console.log('2>>' + signature);

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


function NOW() {
  var INC_TIME_SEC = 5;
  var date = new Date();
  var aaaa = date.getFullYear();
  var gg = date.getDate();
  var mm = (date.getMonth() + 1);

  if (gg < 10)
      gg = "0" + gg;

  if (mm < 10)
      mm = "0" + mm;

  var cur_day = aaaa + "-" + mm + "-" + gg;

  var hours = date.getHours()
  var minutes = date.getMinutes()
  var seconds = date.getSeconds()+INC_TIME_SEC;

  if (hours < 10)
      hours = "0" + hours;

  if (minutes < 10)
      minutes = "0" + minutes;

  if (seconds < 10)
      seconds = "0" + seconds;

  return cur_day + "T" + hours + ":" + minutes + ":" + seconds;

}
