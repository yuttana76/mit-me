const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mailConfig = require('../config/mail-conf');

const dbConfig = require('../config/db-config');

const utility = require('./utility');


var prop = require("../config/backend-property");
var logger = require("../config/winston");

var mitLog = require('./mitLog');


const SALT_WORK_FACTOR = dbConfig.SALT_WORK_FACTOR;
const JWT_SECRET_STRING = dbConfig.JWT_SECRET_STRING;
const JWT_EXPIRES = dbConfig.JWT_EXPIRES;
const JWT_EXTERNAL_EXPIRES = dbConfig.JWT_EXTERNAL_EXPIRES;

var config = dbConfig.dbParameters;

// let transporter = nodemailer.createTransport(mailConfig.MPAM_MailParameters); //MPAM
let transporter = nodemailer.createTransport(mailConfig.GmailParameters); //GMAIL

//reference https://nodemailer.com/about/
exports.sendMail = (req, res, next) =>{

  // let transporter = nodemailer.createTransport(mailConfig.mailParameters);

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

  // let transporter = nodemailer.createTransport(mailConfig.GmailParameters);

  const _PID = '41121225';
  let _from = mailConfig.mail_form;
  let _to = 'yuttana76@gmail.com';
  let _subject = 'Interview suit by MPAM.'
  let _msg = '';
  let _target = req.body.target || 'test';
  let _url='';

  if (_target =='prod'){
    _url = 'http://mit.wealth-merchant.com:3000/suit?has='
  }else{
    _url = 'http://localhost:4200/suit?has='
  }

  //Encrypt token
  bcrypt.hash(_PID, SALT_WORK_FACTOR)
  .then(hash =>{

        // setup email data with unicode symbols


      let mailOptions = {
        from: _from,
        to: _to,
        subject: _subject,
        html: `${_msg}
        <br>Click this link for risk intereview. <br> ${_url}${hash}` // html body
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

  SELECT Cust_Code
  ,[Title_Name_T] + ' ' +  [First_Name_T] + ' ' + [Last_Name_T] AS fullName
  ,[Title_Name_E] + ' ' +  [First_Name_E] + ' ' + [Last_Name_E] AS fullName_Eng
  ,Email
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

  // let transporter = nodemailer.createTransport(mailConfig.MPAM_MailParameters); //MPAM
  // let transporter = nodemailer.createTransport(mailConfig.GmailParameters); //GMAIL

  const _PID = req.body.custCode ||'41121225'
  const _compInfo = mailConfig.mailCompInfo_TH;
  let _from = mailConfig.mail_form;
  let _to ;//= 'yuttana76@gmail.com';
  let _subject = 'การสำรวจ และตรวจสอบข้อมูล บลจ. เมอร์ชั่น พาร์ทเนอร์ จำกัด'
  let _msgTH = '';
  var logMsg ;

  let _target = req.body.target || 'test';
  let _url='';

  if (_target =='prod'){
    _url = 'http://mit.wealth-merchant.com:3000/suit?has='
  }else{
    _url = 'http://localhost:4200/suit?has='
  }

  getCustomerInfo(_PID).then( (data) =>{

    try {
      logMsg = `;url=${req.originalUrl} ;ip=${req.ip} - ;Cust_Code=${data.Cust_Code} ;Email=${data.Email}`;
      logger.info(`API /surveyByMailToken - ${logMsg}`);

      // Incase has Email
        if(data.Email){
          //Generate token
          const token = jwt.sign(
            {USERID: _PID},
            JWT_SECRET_STRING,
            { expiresIn: JWT_EXTERNAL_EXPIRES},
          );

          _to = data.Email;

          // Thai message
          _msgTH = `
          เรียน ${data.fullName}
          <br>
          <br>
          ด้วยทาง บริษัทหลักทรัพย์จัดการกองทุน เมอร์ชั่น พาร์ทเนอร์ จำกัด ได้มีการสำวจและตรวจสอบข้อมูลของลูกค้า
          <br>
          เพื่อให้มีความเป็นปัจจุบันและถูกต้องตามข้อกำหนดของหน่วยงาน
          <br>
          สามารถเข้าใช้ระบบตามลิงค์ด้านล่างนี้
          <br>${_url}${token}
          <br>
          <br>
          ขอแสดงความนับถือ
          <br>
          <p>
          <br>*** อีเมลนี้เป็นการแจ้งจากระบบอัตโนมัติ กรุณาอย่าตอบกลับ ***
          <p>
          `;

          // English message
          if(data.fullName_Eng){
          _msgTH += `
          <br>
          <br>
          Dear ${data.fullName_Eng}
          <br>
          For review and update your information.Please access this link below.
          <br>${_url}${token}
          <br>
          <br>
          Yours Sincerely, 
          <br>
          <p>
          <br>*** This is an automatically generated email, please do not reply. ***
          </p>
          `;
          }

          _msgTH +=_compInfo

          // setup email data with unicode symbols
          let mailOptions = {
            from: _from,
            to: _to,
            subject: _subject,
            html: _msgTH,
          };

        /**
         * SEND mail to suctomer
         */
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }

              /*
              Save MIT_LOG
              */
              try {
                mitLog.saveMITlog('SYSTEM','SEND_MAIL_USER_SURVEY',logMsg,req.ip,req.originalUrl,function(){
                      // console.log("Save MIT log");
                })
              } catch (error) {
                console.log(error);
              }

            logger.info(`API /surveyByMailToken -  Send mail successful!`);
            res.status(200).json({ message: 'Send mail successful!' });

          });

          // Incase No Email
        }else{
          logger.error(`API /surveyByMailToken - NO E-mail`);

        }
    } catch (error) {
      res.status(400).json({ message: 'surveyByMailToken' });

    }

  },(err)=>{
    if(err) {
      console.log(' Error on send mail >>>' + err)
      logger.error( ''+err );
      rsp_code = 902;
      return res.status(422).json({
        code: rsp_code,
        msg: prop.getRespMsg(rsp_code),
      });
    }

  });

}



/*
Send mail  to Whom related with this customer
  1:Customer
  2: RM
*/
exports.sendMailThankCust = (req, res, next) =>{

  // let transporter = nodemailer.createTransport(mailConfig.MPAM_MailParameters); //MPAM
  // let transporter = nodemailer.createTransport(mailConfig.GmailParameters); //GMAIL

  const _PID = req.body.custCode;
  let _from = mailConfig.mail_form;
  let _to ;
  let _toRM = mailConfig.mailRM;
  let _subject = 'แจ้งผลการสำรวจ และตรวจสอบข้อมูล  บลจ. เมอร์ชั่น พาร์ทเนอร์ จำกัด'
  let _subjectRM = 'แจ้งผลการสำรวจ และตรวจสอบข้อมูล(MIT-survey) '
  let _msg = '';
  let _msgRM = '';
  const _compInfo = mailConfig.mailCompInfo_TH;
  var logMsg ;

  getCustomerInfo(_PID).then( (data) =>{

    try {
      logMsg = `;url=${req.originalUrl} ;ip=${req.ip} - ;Cust_Code=${data.Cust_Code} ;Email=${data.Email}`;
      logger.info(`API /sendMailToRelated - ${logMsg}`);

      // Incase has Email
        if(data.Email){

          _to = data.Email;
          _msg =  `
          เรียน ${data.fullName}
          <br>
          บริษัทหลักทรัพย์จัดการกองทุน เมอร์ชั่น พาร์ทเนอร์ จำกัด  ได้รับข้อมูลและบันทึกข้อมูลเรียบร้อยแล้ว
          บริษัท ขอขอบพระคุณที่ท่านใช้บริการจากเรา
          <br>
          ขอแสดงความนับถือ
          <br>
          <br>*** อีเมลนี้เป็นการแจ้งจากระบบอัตโนมัติ กรุณาอย่าตอบกลับ ***
          <br>
          `;

          if(data.fullName_Eng){
            _msg += `
            <br>
            <br>
            Dear ${data.fullName_Eng}
            <br>
              We got your data and saved.Thank you
            <br>
            Yours Sincerely, 
            <br>
            <p>
            <br>*** This is an automatically generated email, please do not reply. ***
            <br>
            </p>
            `;
            }
            _msg +=_compInfo


          // message to customer
          let mailOptions = {
            from: _from,
            to: _to,
            subject: _subject,
            html: _msg
          };

          // message to RM.
          _subjectRM += ` (${data.fullName})`;
          _msgRM = `
          ${data.fullName}  was finsih survey on ${utility.getDateTime()}
          <br>
          <br>Code: ${_PID}
          <br>Name: ${data.fullName}
          <br>
          `;

          let mailOptions_RM = {
            from: _from,
            to: _toRM,
            subject: _subjectRM,
            html: _msgRM
          };

        /**
         * SEND mail to suctomer
         */
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              return logger.error(`API /sendMailToRelated - ${error} `);
                // return console.log(error);
            }
              /*
              Save MIT_LOG
              */
             mitLog.saveMITlog('SYSTEM','SEND_MAIL_USER_FINISH_SURVEY',logMsg,req.ip,req.originalUrl,function(){});
            logger.info(`API /sendMailToRelated -  Send mail successful!`);
            res.status(200).json({ message: 'Send mail successful!' });
          });

           /**
         * SEND mail RM.
         */
        transporter.sendMail(mailOptions_RM, (error, info) => {
          if (error) {
            return logger.error(`API /sendMailToRelated - ${error} `);
              // return console.log(error);
          }
            /*
            Save MIT_LOG
            */
          //  mitLog.saveMITlog('SYSTEM','SEND_MAIL_USER_SURVEY',logMsg,req.ip,req.originalUrl,function(){});
          logger.info(`API /sendMailToRelated -  Send mail to RM. successful!`);
          res.status(200).json({ message: 'Send mail successful!' });
        });
          // Incase No Email
        }else{
          logger.error(`API /sendMailToRelated -   NO E-mail`);
        }
    } catch (error) {
      res.status(400).json({ message: 'sendMailToRelated' });
    }

  },(err)=>{
    if(err) {
      console.log(' Error on send mail >>>' + err)
      logger.error( ''+err );
      rsp_code = 902;
      return res.status(422).json({
        code: rsp_code,
        msg: prop.getRespMsg(rsp_code),
      });
    }

  });

}
