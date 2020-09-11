
const bcrypt = require('bcryptjs');
const mpamConfig = require('../config/mpam-config');
var logger = require('../config/winston');
var config = mpamConfig.dbParameters;
const mailConfig = require('../config/mail-conf');
const nodemailer = require('nodemailer');

// const SALT_WORK_FACTOR = 10;
const SALT_WORK_FACTOR = mpamConfig.SALT_WORK_FACTOR;
let transporter = nodemailer.createTransport(mpamConfig.MPAM_MailParameters); //MPAM

exports.autoGeneratePassword = (req,res,next)=>{

  logger.info( `API /autoGeneratePassword - ${req.originalUrl} - ${req.ip} - ${req.body.privtecode} - ${req.body.password}`);

  var _privtecode = mpamConfig.UTIL_PRIVATE_CODE;
  var _password = req.body.password;

  if (_privtecode === req.body.privtecode ){

    logger.info( `API /autoGeneratePassword code Correct!  - ${req.originalUrl} - ${req.ip} `);
    bcrypt.hash(_password, SALT_WORK_FACTOR)
    .then(hash =>{

        var queryStr = `
          UPDATE MIT_USERS SET PASSWD='${hash}'
          WHERE MIT_GROUP='C1'
        `;

        var sql = require("mssql");

        sql.connect(config, err => {
          new sql.Request().query(queryStr, (err, result) => {
            sql.close();
              if(err){
                res.status(500).json({
                  error:err
                });

              } else {
                logger.info( `API /autoGeneratePassword successful  - ${req.originalUrl} - ${req.ip} - ${req.body.privtecode}`);
                res.status(200).json({
                  message: 'User upated',
                  result: result
                });
              }

          })

        });

        sql.on("error", err => {

          logger.error( `API /register - ${err}`);

          sql.close();
          res.status(500).json({
            error:err
          });
        });
    });
  } else {
    logger.warn( `API /autoGeneratePassword code Incorrect!  - ${req.originalUrl} - ${req.ip} - ${req.body.privtecode}`);
    res.status(400).json({
    });
  }

}

exports.getDateTime = (req,res,next)=>{

  // return year + ":" + month + ":" + day + ":" + hour + ":" + min + ":" + sec;

  return getDateTime();
}

function getDateTime(){

  var date = new Date();

  var hour = date.getHours();
  hour = (hour < 10 ? "0" : "") + hour;

  var min  = date.getMinutes();
  min = (min < 10 ? "0" : "") + min;

  var sec  = date.getSeconds();
  sec = (sec < 10 ? "0" : "") + sec;

  var year = date.getFullYear();

  var month = date.getMonth() + 1;
  month = (month < 10 ? "0" : "") + month;

  var day  = date.getDate();
  day = (day < 10 ? "0" : "") + day;

  return day +"/"+ month +"/"+ year + "  " + hour + ":" + min ;

}

exports.getDate_yyyymmdd = ()=>{

  var date = new Date();

  var hour = date.getHours();
  hour = (hour < 10 ? "0" : "") + hour;

  var min  = date.getMinutes();
  min = (min < 10 ? "0" : "") + min;

  var sec  = date.getSeconds();
  sec = (sec < 10 ? "0" : "") + sec;

  var year = date.getFullYear();

  var month = date.getMonth() + 1;
  month = (month < 10 ? "0" : "") + month;

  var day  = date.getDate();
  day = (day < 10 ? "0" : "") + day;

  // return day +"/"+ month +"/"+ year + "  " + hour + ":" + min ;
  return year+month+day;

}


// YYYYMMDDHHMMSS -> YYYY/MM/DD HH:MM:SS
exports.txtToDateTimeFormat = (str)=>{

  return new Promise(function(resolve, reject) {
    var _yyyy= str.substring(0, 3);
    var _mm = str.substring(4, 5);
    var _dd = str.substring(6, 7);
    var _hh = str.substring(8, 9);
    var _min = str.substring(10, 11);
    var _ss = str.substring(12, 13);
    var resultStr = _yyyy+'/'+_mm+'/'+_dd+' '+_hh+':'+_min+':'+_ss;
    resolve(resultStr)
  });
}


exports.regisToMail = (req,res,next)=>{
  console.log("Welcome API regisToMail/");

  const name = req.body.name;
  const surName = req.body.surName;
  const phone = req.body.phone;
  const email = req.body.email;
  const lineId = req.body.lineId;
  const description = req.body.description || '';

  regisToMail(name,surName,phone,email,lineId,description).then(result=>{
    res.status(200).json(result);
  },err=>{
    res.status(401).json(err);
  });
}

function regisToMail(name,surName,phone,email,lineId,description){
  console.log("Welcome Function regisToMail()");
  let _msgHtml = `
  <html>
  <head>
  <style>
  .blog-content-outer {
    border: 1px solid #e1e1e1;
    border-radius: 5px;
    margin-top: 40px;
    margin-bottom: 20px;
    padding: 0 15px;
    font-size: 16px;
  }
  </style>
  </head>
  <body>
  <h3>Streaming for fund registration  </h3>
  New customer submit on register form On ${getDateTime()}
  `;

  let _msgLedHeader = "";
  let _msgContent = `
        <div class='blog-content-outer'>
          <p>
          <B>Name:</B> ${name}
          </p>
          <p>
          <B>SurName:</B> ${surName}
          </p>
          <p>
          <B>Contact number:</B> ${phone}
          </p>
          <p>
          <B>Email:</B> ${email}
          </p>
          <p>
          <B>lineId:</B> ${lineId}
          </p>
          <p>
          <B>Description:</B> ${description}
          </p>
        </div>
          `;

  return new Promise(function(resolve, reject) {


    _msgHtml +=_msgLedHeader;
    _msgHtml +=_msgContent;
    _msgHtml +='</body></html>';

    let mailOptions = {
      from: mailConfig.mail_it,
      // to: mailConfig.mail_wealthservice,
      to: 'yuttana@merchantasset.co.th',
      subject: "Streaming For Fund registration",
      html: _msgHtml
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        logger.error(error);
        reject(error);
      }
      resolve(info)
    });
  });
}



exports.txtToDateTimeFormat = (str)=>{

  return new Promise(function(resolve, reject) {
    try{
      var _yyyy= str.substring(0, 4);
      var _mm = str.substring(4, 6);
      var _dd = str.substring(6, 8);
      var _hh = str.substring(8, 10);
      var _min = str.substring(10, 12);
      var _ss = str.substring(12, 14);
      var resultStr = _yyyy+'/'+_mm+'/'+_dd+' '+_hh+':'+_min+':'+_ss;
      // console.log('txtToDateTimeFormat: '+str + '>>' + resultStr);
      resolve(resultStr)
    }
    catch(err) {
      resolve(null)
    }
  });
}

exports.readJSONfile =(filePath,fileName)=>{
  logger.info("readJSONfile()"+ filePath +"/"+fileName)
  return new Promise(function(resolve, reject) {
    try{
      const fs = require("fs");
      // Read users.json file
      fs.readFile(filePath +"/"+ fileName, function(err, data) {

          // Check for errors
          if (err){
            logger.error( err)
            reject(err);
          }else{
            // Converting to JSON
            const jsonObj = JSON.parse(data);
            resolve(jsonObj)

          }
      });
    }
    catch(err) {
      reject(err)
    }

  });

}
