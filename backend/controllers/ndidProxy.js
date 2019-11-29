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
const API_POST_IDEN_VERIFY_PATH = "/ndidproxy/api/identity/verify/";
const API_POST_IDEN_VERIFY_REQDATA_PATH = "/ndidproxy/api/identity/verify-and-request-data/";
const API_POST_IDEN_VERIFY_REQDATA_GETDATA_PATH = "/ndidproxy/api/identity/verify-and-request-data/data/";
const API_POST_IDEN_VERIFY_REQDATA_REMOVAL_PATH = "/ndidproxy/api/identity/verify-and-request-data/request-data-removal/";

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
  logger.info("Welcome API /as/service");

  const token = req.body.token;
  const service_id = req.body.service_id;

  fnGetServicesAS(token,service_id).then(result=>{
    res.status(200).json(result);
  },err=>{
    res.status(401).json(err);
  });
}


exports.IdVerify = (req, res, next) => {
  logger.info("Welcome API /identity/verify");

  const token = req.body.token || '';
  const namespace = req.body.namespace || '';
  const identifier = req.body.identifier || '';
  const request_message = req.body.request_message || '';
  const idp_id_list = req.body.idp_id_list || '' ;
  const min_idp = req.body.min_idp || '';
  const min_aal = req.body.min_aal || '';
  const min_ial = req.body.min_ial || '';
  const mode = req.body.mode || '';
  const callback_url = req.body.callback_url || '';
  const bypass_identity_check = req.body.bypass_identity_check ||'';

  fnIdverify(token,namespace,identifier,request_message,idp_id_list,min_idp,min_aal,min_ial,mode,callback_url,bypass_identity_check).then(result=>{
    res.status(200).json(result);
  },err=>{
    res.status(401).json(err);
  });
}


exports.IdVerifyStatus = (req, res, next) => {
  logger.info("Welcome API GET /identity/verifyStatus");

  const token = req.body.token;
  const reference_id = req.body.reference_id;

  fnIdVerifyStatus(token,reference_id).then(result=>{
    res.status(200).json(result);
  },err=>{
    res.status(401).json(err);
  });

}




exports.IdVerifyRequestData = (req, res, next) => {
  logger.info("Welcome API /identity/verify-and-request-data");

  const token = req.body.token || '';
  const namespace = req.body.namespace || '';
  const identifier = req.body.identifier || '';
  const request_message = req.body.request_message || '';
  const idp_id_list = req.body.idp_id_list || '' ;
  const min_idp = req.body.min_idp || '';
  const min_aal = req.body.min_aal || '';
  const min_ial = req.body.min_ial || '';
  const mode = req.body.mode || '';
  const bypass_identity_check = req.body.bypass_identity_check || '';
  const callback_url = req.body.callback_url || '';

  const data_request_list = req.body.data_request_list;

  fnIdVerifyRequestData(token,namespace,identifier,request_message,idp_id_list,min_idp,min_aal,min_ial,mode,bypass_identity_check,callback_url
    ,data_request_list).then(result=>{

    res.status(200).json(result);
  },err=>{
    res.status(401).json(err);
  });
}

exports.IdVerifyRequestDataGETdata = (req, res, next) => {
  logger.info("Welcome API /identity/verify-and-request-data/data");

  const token = req.body.token || '';
  const reference_id = req.body.reference_id || '';


  fnIdVerifyRequestDataGETdata(token,reference_id).then(result=>{
    res.status(200).json(result);
  },err=>{
    res.status(401).json(err);
  });
}


exports.IdVerifyRequestDataRemoval = (req, res, next) => {
  logger.info("Welcome API /identity/verify-and-request-data/request-data-removal");

  const token = req.body.token || '';
  const reference_id = req.body.reference_id || '';

  fnIdVerifyRequestDataRemoval(token,reference_id).then(result=>{
    res.status(200).json(result);
  },err=>{
    res.status(401).json(err);
  });
}


// **********************FUNCTIONs

// POST
function fnIdVerifyRequestDataRemoval(token,reference_id){

  return new Promise(function(resolve, reject) {

      process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0" //this is insecure

      /**
       * HTTPS REQUEST
       */
       var postData=JSON.stringify({
      })

      var options = {
        host: PROXY_HTTPS,
        path:API_POST_IDEN_VERIFY_REQDATA_REMOVAL_PATH +reference_id+'?token='+token,
        method: "POST",
        timeout: 10000,
        headers: {
          "Content-Type": "application/json",
          // 'Content-Length': postData.length
        },
      };
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0" //this is insecure

      const request = https.request(options,(res) => {

        var _chunk="";
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
          console.log('ON DATA>' + chunk);
          _chunk=_chunk.concat(chunk);
        });

        res.on('end', () => {
          logger.info(JSON.stringify(_chunk));
          console.log('ON END>' + _chunk);
          resolve(_chunk);
        });

      });

      request.on('error', (e) => {
        reject(e);
      });

      // Write data to request body
      logger.info(`POST DATA>>${postData}`);
      request.write(postData);
      request.end();
    /**
     * HTTPS REQUEST (END)
     */

  });
}

// GET
function fnIdVerifyRequestDataGETdata(token,reference_id){

  return new Promise(function(resolve, reject) {

      process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0" //this is insecure
      /**
     * HTTPS REQUEST (START)
     */
      const request = require('request');
      const HTTPS_ENDPOIN =`https://${PROXY_HTTPS}${API_POST_IDEN_VERIFY_REQDATA_GETDATA_PATH}${reference_id}`;

      var propertiesObject = {
        "token":token,
      };

      request({url:HTTPS_ENDPOIN, qs:propertiesObject}, function(err, response, body) {
      logger.info(response.body.url);
      if(err) {
        logger.error(err);
        reject(err);
      }else{
        // logger.info(body);
        logger.info(JSON.stringify(body));
        resolve(body)
      }
    });
    /**
     * HTTPS REQUEST (END)
     */

  });

}


// POST
function fnIdVerifyRequestData(token,namespace,identifier,request_message,idp_id_list,min_idp,min_aal,min_ial,mode,bypass_identity_check,callback_url,
  data_request_list){

  logger.info("Welcome fnIdVerifyRequestData()");

  return new Promise(function(resolve, reject) {

      process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0" //this is insecure

      /**
       * HTTPS REQUEST
       */

       var postData=JSON.stringify({
            "namespace": namespace,
            "identifier": identifier,
            "request_message": request_message,
            "idp_id_list": idp_id_list,
            "min_ial": min_ial,
            "min_aal": min_aal,
            "min_idp": min_idp,
            "callback_url":callback_url,
            "mode": mode,
            "bypass_identity_check": bypass_identity_check,
            "data_request_list": data_request_list
      })

      var options = {
        host: PROXY_HTTPS,
        path:API_POST_IDEN_VERIFY_REQDATA_PATH +'?token='+token,
        method: "POST",
        timeout: 10000,
        headers: {
          "Content-Type": "application/json",
          'Content-Length': postData.length,
          "X-Auth-Token":token,
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
          logger.info(JSON.stringify(_chunk));

          resolve(_chunk);
        });

      });

      request.on('error', (e) => {
        reject(e);
      });

      // Write data to request body
      logger.info(`POST DATA>>${postData}`);
      request.write(postData);
      request.end();
    /**
     * HTTPS REQUEST (END)
     */

  });

}

// GET
function fnIdVerifyStatus(token,reference_id){

  logger.info("fnIdVerifyStatus() " + reference_id);

  return new Promise(function(resolve, reject) {

      process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0" //this is insecure
      /**
     * HTTPS REQUEST (START)
     */
      const request = require('request');
      const HTTPS_ENDPOIN =`https://${PROXY_HTTPS}${API_POST_IDEN_VERIFY_PATH}${reference_id}`;

      var propertiesObject = {
        "token":token,
      };

      request({url:HTTPS_ENDPOIN, qs:propertiesObject}, function(err, response, body) {
      // logger.info(response.body.url);
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


function fnIdverify(token,namespace,identifier,request_message,idp_id_list,min_idp,min_aal,min_ial,mode,callback_url,bypass_identity_check){

  logger.info("Welcome fnIdverify()");

  return new Promise(function(resolve, reject) {

      process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0" //this is insecure

      /**
       * HTTPS REQUEST
       */

       var postData=JSON.stringify({
        "namespace": namespace,
        "identifier": identifier,
        "request_message": request_message,
        "idp_id_list": idp_id_list,
        "min_ial": min_ial,
        "min_aal": min_aal,
        "min_idp": min_idp,
        "callback_url": callback_url,
        "mode": mode,
        // "bypass_identity_check": bypass_identity_check
      })

      var options = {
        host: PROXY_HTTPS,
        path:API_POST_IDEN_VERIFY_PATH +'?token='+token,
        method: "POST",
        timeout: 10000,
        headers: {
          "Content-Type": "application/json",
          'Content-Length': postData.length,
          "X-Auth-Token":token,
        },
      };
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0" //this is insecure

      console.log("STEP 2")
      const request = https.request(options,(res) => {

        var _chunk="";
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
          _chunk=_chunk.concat(chunk);
        });

        res.on('end', () => {
          logger.info(JSON.stringify(_chunk));

          resolve(_chunk);
        });

      });

      request.on('error', (e) => {
        reject(e);
      });

      // Write data to request body
      logger.info(postData);
      request.write(postData);
      request.end();
    /**
     * HTTPS REQUEST (END)
     */

  });

}


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

      logger.info('POSTDATA>'+JSON.stringify(propertiesObject));

      request({url:HTTPS_ENDPOIN, qs:propertiesObject}, function(err, response, body) {
      // logger.info(response.body.url);
      if(err) {
        logger.error(err);
        reject(err);
      }else{
        logger.info(body);
        resolve(body);
      }
    });
    /**
     * HTTPS REQUEST (END)
     */

  });

}


function ISODateString(d) {

  d.setSeconds(d.getSeconds()+10);

  function pad(n) {return n<10 ? '0'+n : n}
  return d.getUTCFullYear()+'-'
       + pad(d.getUTCMonth()+1)+'-'
       + pad(d.getUTCDate())+'T'
       + pad(d.getHours())+':'
       + pad(d.getMinutes())+':'
       + pad(d.getSeconds())

}


function fnAuthtoken(){

  console.log("Welcome Function authtoken()");

  return new Promise(function(resolve, reject) {

      var _Path = path.resolve('./backend/merchantasset_CA/proxy/proxy_auth.json');
      let authData = fs.readFileSync(_Path, "utf8"); //ascii,utf8
      let authObj = JSON.parse(authData);

      var _newDate = new Date();

      authObj.request_time = ISODateString(_newDate);

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
            console.log("RESULT >>" + _chunk);
            logger.info(_chunk);

            resolve(_chunk);
          });
        });

        request.on('error', (e) => {
          console.log('HTTP ERR>>' + e);
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
