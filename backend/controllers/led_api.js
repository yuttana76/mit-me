const readline = require('readline');
const fs = require('fs');
const path = require('path');
const dbConfig = require('../config/db-config');
const utility = require('./utility');

var prop = require("../config/backend-property");
var logger = require("../config/winston");
var mitLog = require('./mitLog');
var soap = require('soap');

var config = dbConfig.dbParameters;
var config_BULK = dbConfig.dbParameters_BULK;
var config_stream = dbConfig.dbParameters_stream;

const mysql_dbConfig = require("../config/mysql-config");
var swan_config = mysql_dbConfig.swan_dbParameters;
var mysql = require('mysql');

const readPath = __dirname + '/readFiles/LED/';
const readFile = 'exp_lom.txt';


const writePath = __dirname + '/readFiles/LED/';
const writeFile = 'dialy_led.txt';


const HTTP_SOAP = 'https://192.168.10.48:444/CrytoService.svc';
const HOST_LED= "uatdebtor.led.go.th";
const API_KEY ="328010cc65ecf3a5f0bcdbb51e339d36";

const PATH_GetBankruptList ="/api/public/GetBankruptList";
const PATH_ReceiverBreezeWebService ="/api/public/ReceiverBreezeWebService";
const PATH_GetBankruptListByDate ="/api/public/GetBankruptListByDate";

// const HTTP_GetBankruptList ='https://uatdebtor.led.go.th/api/public/GetBankruptList';
// const HTTP_ReceiverBreezeWebService ='https://uatdebtor.led.go.th/api/public/ReceiverBreezeWebService';
// const HTTP_GetBankruptListByDate ='https://uatdebtor.led.go.th/api/public/GetBankruptListByDate';


exports.checkAPI = (req, res, next) =>{

  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;

  console.log(`ip>> - ${ip}`);
  console.log(`fullUrl>> - ${fullUrl}`);

  res.status(200).json({ message: 'API successful' });

}

exports.checkPostAPI = (req, res, next) =>{

  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;

  console.log("checkPostAPI");
  console.log(`ip>> - ${ip}`);
  console.log(`fullUrl>> - ${fullUrl}`);

  //Body
  console.log(`headers>> - ${JSON.stringify(req.headers)}`);
  console.log(`input>> - ${req.body.input}`);

  res.status(200).json({ message: 'API successful' });

}


exports.ledEncrypt = (req, res, next) =>{

  fncSOAPEncrypt().then(result =>{

    res.status(200).json({
      message: "Successfully!",
      result: result
    });

  },err=>{
    res.status(400).json({
      message: 'Error on call API'
    });

  })
}


exports.ledDecrypt = (req, res, next) =>{

  var input = req.body.input;

  fncDecrypt(input).then(result =>{

    res.status(200).json({
      message: "Successfully!",
      result: result
    });

  },err=>{
    res.status(400).json({
      message: 'Error on call API'
    });

  })
}

exports.callGetBankruptList = (req, res, next) =>{
  // console.log("Welcome to API /callGetBankruptList/");

  var input ="";
  // #1 Encryt
  fncSOAPEncrypt().then(result =>{

    // console.log("fncSOAPEncrypt() >>" + result.EncryptResult );
    input= result.EncryptResult;
    // #2 Call APIs
    fnCallLEDapis(PATH_GetBankruptList,input).then(result =>{

      console.log(result);

      var resultObj =  JSON.parse(result);

      if(resultObj.responseCode == "000"){
        if(resultObj.data){
        // #3 Decrypt
        fncSOAPDecrypt(resultObj.data).then(result =>{

          // #4 write file
          let writeStream = fs.createWriteStream(writePath+writeFile);
          writeStream.write(result, 'utf8');
          // the finish event is emitted when all data has been flushed from the stream
          writeStream.on('finish', () => {
            // console.log('wrote all data to file');

            res.status(200).json({
              message: "Successfully!",
              code:"000",
              result: result
            });

          });
          // close the stream
          writeStream.end();

        },err=>{
          res.status(200).json({
            message: "Error on SOAP decrypt.",
            code:"501",
            result: err
          });
        })

        }
      }else{
        res.status(200).json({
          message: "Successfully!",
          result: result
        });
      }



    },err=>{
      res.status(400).json({
        message: 'Error on call API'
      });

    })

  },err=>{
 res.status(400).json({
        message: 'Error on SOAP Encrypt'
      });
  })
}


exports.GetBankruptListByDate = (req, res, next) =>{
  // console.log("Welcome to API /callGetBankruptList/");

  // #1 Encryt
  const req_key="";
  const req_status = ""
  const startdate=req.body.startdate;
  const enddate =req.body.enddate;

  fncSOAPEncrypt(req_key,req_status,startdate,enddate).then(result =>{

    // console.log("fncSOAPEncrypt() >>" + result.EncryptResult );
    const input= result.EncryptResult;
    // #2 Call APIs
    fnCallLEDapis(PATH_GetBankruptListByDate,input).then(result =>{

      var resultObj =  JSON.parse(result);

      if(resultObj.responseCode == "000"){
          if(resultObj.data){
          // #3 Decrypt
          fncSOAPDecrypt(resultObj.data).then(result =>{

            // #4 write file
            let writeStream = fs.createWriteStream(writePath+writeFile);
            writeStream.write(result, 'utf8');
            // the finish event is emitted when all data has been flushed from the stream
            writeStream.on('finish', () => {
              // console.log('wrote all data to file');

              res.status(200).json({
                message: "Successfully!",
                code:"000",
                result: result
              });

            });
            // close the stream
            writeStream.end();

          },err=>{
            res.status(200).json({
              message: "Error on SOAP decrypt.",
              code:"501",
              result: err
            });
          })

          }
        }else{
          res.status(200).json({
            message: "Successfully!",
            result: result
          });
        }
      // result.responseMessage
      // console.log();

    },err=>{
      res.status(400).json({
        message: 'Error on call API'
      });

    })

  },err=>{
 res.status(400).json({
        message: 'Error on SOAP Encrypt'
      });
  })
}


// ****************************** FUNCTION HERE

function fnCallLEDapis(path,input){

  return new Promise(function(resolve, reject) {
  const https = require('https')
  // var input = req.body.input;
  const postData = JSON.stringify({
    input:input
  });

  // // https://uatdebtor.led.go.th/api/public/GetBankruptList
  var options_1 = {
    host: HOST_LED,
    path:path,
    method: "POST",
    headers: {
       "api-key": API_KEY,
       "Content-Type": "application/json",
       'Content-Length': postData.length
    },
  };

  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0" //this is insecure
  const request = https.request(options_1,(res) => {
var _chunk="";
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
      // console.log(`BODY: ${chunk}`);
      _chunk=_chunk.concat(chunk);
    });
    res.on('end', () => {
      console.log('No more data in response.');
      resolve(_chunk);
    });

  });

  request.on('error', (e) => {
    reject(e);
  });

  // Write data to request body
  request.write(postData);
  request.end();

  });
}

function fncSOAPEncrypt(req_key,req_status,startdate,enddate){

  // logger.info(`Welcome fncEncry() req_key:${req_key}; req_status:${req_status}; startdate:${startdate}; enddate:${enddate}` );
  return new Promise(function(resolve, reject) {
    // reject(err);
    // resolve(result.recordset);

    var userPath = path.resolve('./backend/merchantasset_CA/led/led_user.json');
    var userData = fs.readFileSync(userPath, "utf8"); //ascii,utf8

    var signerPath = path.resolve('./backend/merchantasset_CA/led/mpam_cert.pem');
    var signerCert = fs.readFileSync(signerPath, "utf8");  //ascii,utf8

    var recipientPath = path.resolve('./backend/merchantasset_CA/led/led.pub');
    var recipientCert = fs.readFileSync(recipientPath, "utf8"); //ascii,utf8

    var url = HTTP_SOAP +'?wsdl';

    let userDataObj  = JSON.parse(userData);

    // 1 GetBankruptList (Default)
    //   'input': '{"username":"MPAM", "password":"MPAM123"}',

    if(req_key && req_status && (req_key !='') && (req_status != '')){
      // console.log('fncSOAPEncrypt() 2');
    // 2 ReceiverBreezeWebService
    //   'input': '{"username":"MPAM", "password":"MPAM123", "req_key":"LED2019062000086","req_status":"20002"}',
      userDataObj.req_key = req_key;
      userDataObj.req_status = req_status;

    }else if(startdate && enddate && (startdate != '') && (enddate!='')){
      // console.log('fncSOAPEncrypt() 3');
    // 3 GetBankruptListByDate
    //   'input': '{"username":"MPAM", "password":"MPAM123", "startdate":"2019-06-11","enddate":"2019-06-17"}',
      userDataObj.startdate=startdate;
      userDataObj.enddate=enddate;
    }
    // console.log("userDataObj >>" + JSON.stringify(userDataObj));
    //GetBankruptList
    var args = {
      'input': `${JSON.stringify(userDataObj)}`,
      'signerCertificate':signerCert,
      'recipientCertificate':recipientCert
    };

    // console.log('wsdlData>>' + wsdlData);
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0" //this is insecure
    soap.createClient(url, function(err, client) {
      if(err){
        // console.log('WAS ERROR  createClient() >>'+err)
        reject(err);
      }else{
        // console.log('setEndpoint>>' +HTTP_SOAP);
        client.setEndpoint(HTTP_SOAP);
        // client.setEndpoint('https://192.168.10.48:444/CrytoService.svc');
        client.Encrypt(args, function(err, result) {
          if(err){
            console.log("WAS ERROR Encrypt() >>" + err);
            reject(err);
            // console.log(err);
            // res.status(422).json({ message: err });
          }else{
            // console.log("Connection successful >>" + result);
            resolve(result);
            // console.log('Result>>' + result);
            // res.status(200).json({ message: result });
          }
        });
      }
    });

  });
}


function fncSOAPDecrypt(reqInput){

  // logger.info(`Welcome fncDecrypt()>>`);
  return new Promise(function(resolve, reject) {

    const utf8 = require('utf8');
    var url = HTTP_SOAP +'?wsdl';

    var args = {
      'input': reqInput
    };

    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0" //this is insecure
    soap.createClient(url, function(err, client) {

      // console.log(client)

      if(err){
        console.log('WAS ERROR  createClient() >>'+err)
        reject(err);
      }else{

        client.setEndpoint(HTTP_SOAP);
        client.Decrypt(args, function(err, result) {
          if(err){
            console.log("WAS ERROR Encrypt() >>" + err);
            reject(err);
          }else{

            var resultObj =  JSON.parse(JSON.stringify(result));
            // console.log("result>>"+ JSON.stringify(resultObj));

            if(resultObj.hasOwnProperty('DecryptResult')){
              // console.log('**** OK>>' + resultObj["DecryptResult"]);
              rsObj=JSON.parse(resultObj["DecryptResult"]) ;

              resolve(JSON.stringify(rsObj[0]));
            }else{
              reject({"msg":"Not found result"})
            }

          //   var jsonObj =  JSON.parse(JSON.stringify(result));
          //   // console.log("KEY>>" + jsonObj.key);
          //   // console.log("Connection successful >>" + JSON.stringify(str));



          }
        });
      }

    });

    // reject(err);
    // resolve("true");
  });

}
