const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mailConfig = require('../config/mail-conf');

const dbConfig = require('../config/db-config');
var prop = require("../config/backend-property");
var logger = require("../config/winston");

const SALT_WORK_FACTOR = dbConfig.SALT_WORK_FACTOR;
const JWT_SECRET_STRING = dbConfig.JWT_SECRET_STRING;
const JWT_EXPIRES = dbConfig.JWT_EXPIRES;
const JWT_EXTERNAL_EXPIRES = dbConfig.JWT_EXTERNAL_EXPIRES;

var config = dbConfig.dbParameters;

//reference https://nodemailer.com/about/
exports.sendMail = (req, res, next) =>{
    // console.log('sendMail()>>' + JSON.stringify(req.body));
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport(mailConfig.mailParameters);

    // setup email data with unicode symbols
    let mailOptions = {
      from: mailConfig.mail_form,//req.body.from, // sender address
      to: req.body.to, // list of receivers
      subject: req.body.subject , // Subject line
      // text: 'Text here', // plain text body
      html: `<b> ${req.body.msg}</b>` // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);
      // Preview only available when sending through an Ethereal account
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
      // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
      res.status(200).json({ message: 'Send mail successful!' });
    });
}

/*
Send mail  by encypt use bcrypt
*/
exports.surveyByMail = (req, res, next) =>{

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport(mailConfig.GmailParameters);

  const _PID = '41121225';
  let _from = mailConfig.mail_form;
  let _to = 'yuttana76@gmail.com';
  let _subject = 'Interview suit by MPAM.'
  let _msg = '';

  //Encrypt token
  bcrypt.hash(_PID, SALT_WORK_FACTOR)
  .then(hash =>{

        // setup email data with unicode symbols
      let mailOptions = {
        from: _from,
        to: _to,
        subject: _subject,
        html: `${_msg}
        <br>Click this link for risk intereview. <br>http://localhost:4200/suit?has=${hash}` // html body
      };

      // send mail with defined transport object
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          // Keep log incase send was error
            return console.log(error);
        }
        // Keep log incase send success

        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        // console.log('info: %s', JSON.stringify(info));

        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
        res.status(200).json({ message: 'Send mail successful!' });
      });

  });
}

function getCustomerInfo(Cust_Code) {

  var fncName = "getCustomerData";
  var queryStr = ` BEGIN

  SELECT [Title_Name_T] + ' ' +  [First_Name_T] + ' ' + [Last_Name_T] AS fullName
  FROM [Account_Info]
  WHERE Cust_Code= @Cust_Code

  END
    `;

  const sql = require("mssql");

  return new Promise(function(resolve, reject) {

    const pool1 = new sql.ConnectionPool(config, err => {
      pool1
        .request() // or: new sql.Request(pool1)
        .input("Cust_Code", sql.VarChar(50), Cust_Code)
        .query(queryStr, (err, result) => {
          if (err) {
            // console.log(fncName + " Quey db. Was err !!!" + err);
            reject(err);

          } else {
            resolve(result.recordset[0]);

          }
        });
    });
    pool1.on("error", err => {
      console.log("EROR>>" + err);
      reject(err);
    });
  });
}



/*
Send mail  by token
*/
exports.surveyByMailToken = (req, res, next) =>{
  let transporter = nodemailer.createTransport(mailConfig.GmailParameters);

  const _PID = req.body.custCode ||'41121225'

  let _from = mailConfig.mail_form;
  let _to = 'yuttana76@gmail.com';
  let _subject = 'Interview suit by MPAM.'
  let _msg = ' Mr. '+_PID ;


  getCustomerInfo(_PID).then( (data) =>{

    console.log('RETURN DATA>>' + JSON.stringify(data));

      _msg = ' To ' + data.fullName ;

      //Generate token
      const token = jwt.sign(
        {USERID: _PID},
        JWT_SECRET_STRING,
        { expiresIn: JWT_EXTERNAL_EXPIRES},
      );

      // setup email data with unicode symbols
      let mailOptions = {
        from: _from,
        to: _to,
        subject: _subject,
        html: `${_msg}
        <br> ${_PID}
        <br>Click this link for risk intereview. <br>http://localhost:4200/suit?has=${token}` // html body
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        res.status(200).json({ message: 'Send mail successful!' });
      });

  },(err)=>{

    if(err) {
      console.log(' Error>>>' + err)
      logger.error( ''+err );
      rsp_code = 902;
      return res.status(422).json({
        code: rsp_code,
        msg: prop.getRespMsg(rsp_code),
      });
    }

  });

}
