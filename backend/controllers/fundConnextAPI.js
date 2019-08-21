const readline = require('readline');
const fs = require('fs');
const path = require('path');
const dbConfig = require('../config/db-config');
var logger = require("../config/winston");
var mail = require('./mail');
const https = require('https')
const download = require('download');
const { check, validationResult } = require('express-validator');

// https://demo.fundconnext.com/api/auth
const HOST_FC= "demo.fundconnext.com";
const FC_AUTH_PATH ="/api/auth"
const FC_DOWNLOAD_PATH ="/api/files/"

const USER_CONFIG_PATH = path.resolve('./backend/merchantasset_CA/fundConnext/fundConnext_user.json');
const DOWNLOAD_PATH  = './backend/downloadFiles/fundConnext/'



exports.downloadFile = (req, res, next) =>{
  console.log("Validate  API /downloadFileAPI/");

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  // var businessDate = NOW()
  // var fileType = 'FundMapping.zip';
  console.log("Welcome to API /downloadFileAPI/");

  var businessDate = req.body.businessDate
  var fileType = req.body.fileType

  fnFCAuth().then(result =>{

    resultObj =JSON.parse(result);
    resultObj.access_token

    fnGetDownloadAPI(resultObj.access_token,businessDate,fileType).then(data=>{
      res.status(200).json(data);

    },err=>{
      res.status(400).json({
        message: err,
        code:"999",
      });
    });

  },err =>{
    console.log("Error" + err);

    res.status(400).json({
      message: err,
      code:"999",
    });
  });
}


function NOW() {
  var date = new Date();
  var aaaa = date.getFullYear();
  var gg = date.getDate();
  var mm = (date.getMonth() + 1);

  if (gg < 10)
      gg = "0" + gg;

  if (mm < 10)
      mm = "0" + mm;

  var cur_day = aaaa +  mm +  gg;

  return cur_day ;

}

// Login to the FC. system and acquire access tokens
function fnFCAuth(){
  console.log('Welcome fnFCAuth() ');

  return new Promise(function(resolve, reject) {

    const userData = fs.readFileSync(USER_CONFIG_PATH, "utf8"); //ascii,utf8
    let userDataObj  = JSON.parse(userData);

    const postData = JSON.stringify({
      username:userDataObj.username,
      password:userDataObj.password
    });

    var options = {
      host: HOST_FC,
      path:FC_AUTH_PATH,
      method: "POST",
      headers: {
         "Content-Type": "application/json",
         'Content-Length': postData.length
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


// GET
function fnGetDownloadAPI(token,businessDate,fileType){

  console.log(`Welcome fnGetDownloadAPI() ${businessDate} - ${fileType}`);

  var DOWNLOAD_PATH_FILENAME  = DOWNLOAD_PATH  + businessDate+'-'+fileType;

  return new Promise(function(resolve, reject) {

    const HTTPS_ENDPOIN =`https://${HOST_FC}${FC_DOWNLOAD_PATH}${businessDate}/${fileType}`;
    const propertiesObject = {
          "x-auth-token":token,
          "Content-Type": "application/json"
        };

    download(HTTPS_ENDPOIN,{'headers':propertiesObject}).then(data => {

      fs.writeFile(DOWNLOAD_PATH_FILENAME, data, function(err) {
        if(err) {
            reject(err);
        }
      });

      resolve({paht:DOWNLOAD_PATH_FILENAME});

    },err=>{
      reject(err);
    });

  });

}
