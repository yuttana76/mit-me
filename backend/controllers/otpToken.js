
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config/mail-conf');
const dbConfig = require('../config/db-config');

var prop = require("../config/backend-property");
var logger = require("../config/winston");

/*
https://www.npmjs.com/package/otpauth
https://hectorm.github.io/otpauth/index.html
*/
const OTPAuth = require('otpauth');

let totp = new OTPAuth.TOTP({
    issuer: 'ACME',
    label: 'AzureDiamond',
    algorithm: 'SHA1',
    digits: 6,
    period: 60, //sec
    secret: OTPAuth.Secret.fromB32('NB2W45DFOIZA')
});


/*
Send mail  by OTP
*/
exports.getOTPtokenToMail = (req, res, next) => {

    console.log('Welcome /getOTPtoken API.');

    // res.status(200).json({ message: 'getOTPtokenToMail', OTP: token });

      let transporter = nodemailer.createTransport(config.GmailParameters);

      // const _PID = '41121225';
      const _PID = req.body.custCode ||'41121225'

      let _from = config.mail_form;
      let _to = 'yuttana76@gmail.com';
      let _subject = 'OTP by MPAM.'
      let _msg = ' Virify access MPAM application by OTP : ';

    // OTP token
    let token = totp.generate();

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
                return console.log(error);
            }
            // Keep log incase send success
            console.log('Message sent: %s', info.messageId);
            res.status(200).json({ message: 'Send mail successful!' });
          });
}

exports.verityOTPtoken = (req, res, next) => {

    console.log('Welcome /verityOTPtoken API.');

    const _token = req.body.token
    /*
    0: ok
    -1: token expired (1 period)
    null: not found
    */
    let delta = totp.validate({
        token: _token,
        window: 10
    });

    if (delta===0){
      let rsp_code = "000"; //"ไม่พบข้อมูล",
              return res.status(422).json({
                code: rsp_code,
                msg: prop.getRespMsg(rsp_code),
              });

    }else if(delta < 0 ){
      let rsp_code = "207"; //"ไม่พบข้อมูล",
              return res.status(422).json({
                code: rsp_code,
                msg: prop.getRespMsg(rsp_code),
              });

    }else {
      let rsp_code = "206"; //"ไม่พบข้อมูล",
              return res.status(422).json({
                code: rsp_code,
                msg: prop.getRespMsg(rsp_code),
              });

    }

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


  // var sql = require("mssql");
  // var queryStr = `select *
  // FROM [REF_PIDTypes]
  // ORDER  BY [PIDType_Code],[PIDType_Desc]`;

  // sql.connect(config, err => {
  //   new sql.Request().query(queryStr, (err, result) => {

  //       if(err){
  //         console.log( fncName +' Quey db. Was err !!!' + err);
  //         res.status(201).json({
  //           message: err,
  //         });
  //         sql.close();
  //       }else {
  //         res.status(200).json({
  //           message: fncName + "Quey db. successfully!",
  //           result: result.recordset
  //         });
  //         sql.close();
  //       }
  //   })
  // });
  // sql.on("error", err => {
  //   console.log(fncName + 'Quey db. sql.on !!!' + err);
  //   sql.close();
  // });
}

