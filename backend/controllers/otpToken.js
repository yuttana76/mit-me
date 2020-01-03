
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config/mail-conf');
const dbConfig = require('../config/db-config');

const smsConfig = require('../config/sms-conf');

var prop = require("../config/backend-property");
var logger = require("../config/winston");
var request = require("request");
var mitLog = require('./mitLog');

var dbParameters = dbConfig.dbParameters;

/*
https://www.npmjs.com/package/otpauth
https://hectorm.github.io/otpauth/index.html
*/
const OTPAuth = require('otpauth');

// const TOKEN_PERIOD = 300;// 30 milisec
const TOKEN_PERIOD = 60000; // 6 hours

// Cancel to use totp_pid (Change secret by PID)
let totp = new OTPAuth.TOTP({
  issuer: 'ACME',
  label: 'AzureDiamond',
  algorithm: 'SHA1',
  digits: 6,
  period: TOKEN_PERIOD, //sec
  secret: OTPAuth.Secret.fromB32('NB2W45DFOIZA')
});


/*
Send mail  by OTP
// https://member.smsmkt.com/SMSLink/SendMsg/index.php?User=merchant&Password=123456&Msnlist=0897765331&Msg=Test MPAMxxx&Sender=MERCHANT
*/
exports.OTPtokenToSMS = (req, res, next) => {

  const _mobile = req.body.m;
  const _pid = req.body.pid;

  let totp_pid = new OTPAuth.TOTP({
    issuer: 'ACME',
    label: 'AzureDiamond',
    algorithm: 'SHA1',
    digits: 6,
    period: TOKEN_PERIOD, //sec
    secret: OTPAuth.Secret.fromRaw(_pid)
  });


  // let token = totp.generate();
  let token = totp_pid.generate();

  let _msg = `OTP = ${token}`;
  var _url = smsConfig.SMSCompleteURL2(_mobile,_msg);

  // SAVE MIT_LOG
  mitLog.saveMITlog(_pid,'MIT-Survey','Require OTP '+_pid +' Mobile=' + _mobile+ ' ;'+_msg,req.ip,req.originalUrl,function(){});

  logger.info( `API /getOTPtokenSMS - ${req.originalUrl} - ${req.ip} - ${_mobile}`);
  logger.info(`SMS URL: ${_url}`);

  var options = {
    url: _url,
    headers: {
        'User-Agent': 'request'
    }
  };

  // Return new promise
  // Do async job
    request.get(options, function(err, resp, body) {
        if (err) {
            // reject(err);
            console.log(err);
            let rsp_code = "902";
            res.status(200).json({
              code: rsp_code,
              msg: prop.getRespMsg(rsp_code),
            });
        } else {
            // resolve(JSON.parse(body));
            let rsp_code = "000";
            res.status(200).json({
              code: rsp_code,
              msg: prop.getRespMsg(rsp_code),
            });
        }
    })
}

exports.getOTPtokenToMail = (req, res, next) => {

    const _pid = req.body.pid
    console.log('Welcome /getOTPtoken API. >>' + _pid);
    // res.status(200).json({ message: 'getOTPtokenToMail', OTP: token });

      let transporter = nodemailer.createTransport(config.GmailParameters);

      // const _PID = '41121225';
      // const _PID = req.body.custCode ||'41121225'

      let _from = config.mail_form;
      let _to = 'yuttana76@gmail.com';
      let _subject = 'OTP by MPAM.'
      let _msg = ' Virify access MPAM application by OTP : ';

  //   // OTP token
  //   let totp = new OTPAuth.TOTP({
  //     issuer: 'ACME',
  //     label: 'AzureDiamond',
  //     algorithm: 'SHA1',
  //     digits: 6,
  //     period: TOKEN_PERIOD, //sec
  //     secret: OTPAuth.Secret.fromB32('NB2W45DFOIZA')
  // });
    let token = totp.generate();
    let token_date = new Date();

            // setup email data with unicode symbols
          let mailOptions = {
            from: _from,
            to: _to,
            subject: _subject,
            html: `${_msg}
            <br> ${token}` // html body
          };

          // send mail with defined transport object
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {

              let rsp_code = "902";
              res.status(200).json({
                code: rsp_code,
                msg: prop.getRespMsg(rsp_code),
              });
                // return console.log(error);
            }

            console.log('Already sent: %s', info.messageId);
            let rsp_code = "000";
            res.status(200).json({
              code: rsp_code,
              msg: prop.getRespMsg(rsp_code),
              TOKEN_PEROID: TOKEN_PERIOD,
              TOKEN_DATE: token_date
            });
          });
}

exports.verityOTPtoken = (req, res, next) => {

    const _token = req.body.token;
    const _pid = req.body.pid;
    // const _pid = 'xxx';
    const otp_device_ref = req.body.mobile;
    const otp_device = 'Mobile';
    let logMsg;

    logger.info(`Welcome /verityOTPtoken API. ${_token}  - pid: ${_pid}`);

    let totp_pid = new OTPAuth.TOTP({
      issuer: 'ACME',
      label: 'AzureDiamond',
      algorithm: 'SHA1',
      digits: 6,
      period: TOKEN_PERIOD, //sec
      secret: OTPAuth.Secret.fromRaw(_pid)
    });

    // let delta = totp.validate({
    //     token: _token,
    //     window: 10
    // });
    let delta = totp_pid.validate({
        token: _token,
        window: 10
    });

    if (delta===0){
      let rsp_code = "000";
      logMsg = `VERIFY_OTP Successful   - pid: ${_pid} ;OTP: ${_token} `

      logger.info(logMsg);
      // SAVE MIT_LOG
      mitLog.saveMITlog(_pid,'MIT-Survey',logMsg,req.ip,req.originalUrl,function(){});

        // Save OTP tracking
        var otpDate ={'otp_device': otp_device,'otp_device_ref':otp_device_ref,'input_otp_code':_token};
        saveOTPtracking(otpDate).then(otp_id=>{

          return res.status(200).json({
            code: rsp_code,
            otp_id: otp_id
          });

        },err=>{
          logger.error({'saveOTPtracking error':err});
        });

    }else if(delta < 0 ){
      let rsp_code = "207";  //OTP  Expired

      logMsg = `VERIFY_OTP Expire   - pid: ${_pid} ;OTP: ${_token} ;msg:${prop.getRespMsg(rsp_code)}`
      logger.info(`Result /verityOTPtoken  ${logMsg}`);
      // SAVE MIT_LOG
      mitLog.saveMITlog(_pid,'MIT-Survey',logMsg,req.ip,req.originalUrl,function(){});

      return res.status(422).json({
        code: rsp_code,
        msg: prop.getRespMsg(rsp_code),
      });

    }else {
      let rsp_code = "206"; //"ไม่พบข้อมูล",

      logMsg = `VERIFY_OTP Notfound   - pid: ${_pid} ;OTP: ${_token} ;msg:${prop.getRespMsg(rsp_code)}`
      logger.info(`Result /verityOTPtoken  ${logMsg}`);
      // SAVE MIT_LOG
      mitLog.saveMITlog(_pid,'MIT-Survey',logMsg,req.ip,req.originalUrl,function(){});

      // logger.info(`Result /verityOTPtoken  -${prop.getRespMsg(rsp_code)} - ${_token}  - pid: ${_pid}`);

        return res.status(422).json({
          code: rsp_code,
          msg: prop.getRespMsg(rsp_code),
        });
    }
}

// function verifyOTP_OnStreamRegis(_idCard,_otp,_ip,_originalUrl){
  module.exports.verifyOTP_OnStreamRegis = (_idCard,_otp,_ip,_originalUrl) => {

  logger.info(`Welcome /verifyOTP API. - IdCard= ${_idCard}; OTP= ${_otp} ;IP= ${_ip}  ;URL=${_originalUrl}`);
  let rsp_code="";
  return new Promise(function(resolve, reject) {

    /*
    0: ok
    -1: token expired (1 period)
    null: not found
    */
  //  let totp = new OTPAuth.TOTP({
  //   issuer: 'ACME',
  //   label: 'AzureDiamond',
  //   algorithm: 'SHA1',
  //   digits: 6,
  //   period: TOKEN_PERIOD, //sec
  //   secret: OTPAuth.Secret.fromB32('NB2W45DFOIZA')
  //   });

    let delta = totp.validate({
        token: _otp,
        window: 10
    });

    if (delta===0){
      rsp_code = "000";
      let logMsg = `Result /verifyOTP_OnStreamRegis -${prop.getRespMsg(rsp_code)} - ${_otp}  - _idCard: ${_idCard}`
      logger.info(logMsg);

      mitLog.saveMITlog(_idCard,'ST_REG_VERIFY_OTP',logMsg,_ip,_originalUrl,function(){});
        // return res.status(200).json({
        //   code: rsp_code,
        //   msg: prop.getRespMsg(rsp_code),
        // });

    }else if(delta < 0 ){
      rsp_code = "207";  //OTP  Expired

      logger.info(`Result /verityOTPtoken  -${prop.getRespMsg(rsp_code)} - ${_otp}  - _idCard: ${_idCard}`);
        // return res.status(422).json({
        //   code: rsp_code,
        //   msg: prop.getRespMsg(rsp_code),
        // });

    }else {
      rsp_code = "206"; //"ไม่พบข้อมูล",
      logger.info(`Result /verityOTPtoken  -${prop.getRespMsg(rsp_code)} - ${_otp}  - _idCard: ${_idCard}`);
        // return res.status(422).json({
        //   code: rsp_code,
        //   msg: prop.getRespMsg(rsp_code),
        // });
    }

    resolve(rsp_code)

  });
}



exports.verityByDOB = (req, res, next) => {
  var fncName = 'verityByDOB';
  console.log('Welcome /verityByDOB API.');

  const _pid = req.body.pid
  const _dob = req.body.dob

  const _dob_match= true;

  if (_dob_match){
    let rsp_code = "000"; //"ไม่พบข้อมูล",
            return res.status(422).json({
              code: rsp_code,
              msg: prop.getRespMsg(rsp_code),
            });

  }else{
    let rsp_code = "208"; // "Incorrect data"
            return res.status(422).json({
              code: rsp_code,
              msg: prop.getRespMsg(rsp_code),
            });
  }

}

exports.testOTPTracking = (req, res, next) => {

  var otpDate ={'otp_device':'Mobile','otp_device_ref':'0897765331','input_otp_code':'123456'};
  saveOTPtracking(otpDate).then(result=>{
    res.status(200).json(result);
  },err=>{
    res.status(401).json(err);
  });

}


function saveOTPtracking(otpDate){

  otp_id = 'OTP'.concat(NOW());

  return new Promise(function(resolve, reject) {
    // var queryStr = `SELECT * FROM MIT_LED_MASTER`;
    var queryStr = `
    BEGIN

      --DECLARE @OTP_ID varchar(50);
      --DECLARE @OTP_DEVICE varchar(10);
      --DECLARE @OTP_DEVICE_REF varchar(200);
      --DECLARE @INPUT_OTP_CODE varchar(10);

      INSERT INTO MIT_OTP_TRACKING
      (OTP_ID,OTP_DEVICE,OTP_DEVICE_REF,INPUT_OTP_CODE,INPUT_OTP_DATE)
      VALUES
      (@OTP_ID,@OTP_DEVICE,@OTP_DEVICE_REF,@INPUT_OTP_CODE,getdate())

    END
    `;

    const sql = require('mssql')
    const pool1 = new sql.ConnectionPool(dbParameters, err => {
      pool1.request() // or: new sql.Request(pool1)
      .input('OTP_ID', sql.VarChar, otp_id)
      .input('OTP_DEVICE', sql.VarChar, otpDate.otp_device)
      .input('OTP_DEVICE_REF', sql.VarChar, otpDate.otp_device_ref)
      .input('INPUT_OTP_CODE', sql.VarChar, otpDate.input_otp_code)
      .query(queryStr, (err, result) => {
          // ... error checks
          if(err){
            reject(err);
          }else {
             resolve(otp_id);
          }
      })
    })
    pool1.on('error', err => {
      logger.error(`${err}` );
      reject(err);
    })
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

  var cur_day = aaaa + "" + mm + "" + gg;

  var hours = date.getHours()
  var minutes = date.getMinutes()
  var seconds = date.getSeconds()+INC_TIME_SEC;

  if (hours < 10)
      hours = "0" + hours;

  if (minutes < 10)
      minutes = "0" + minutes;

  if (seconds < 10)
      seconds = "0" + seconds;

  return cur_day + "" + hours + "" + minutes + "" + seconds;
  // return cur_day + "T" + hours + ":" + minutes + ":" + seconds;
}
