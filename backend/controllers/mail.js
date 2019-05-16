const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mailConfig = require('../config/mail-conf');
const path = require('path');
const readline = require('readline');
const fs = require('fs');
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

let transporter = nodemailer.createTransport(mailConfig.MPAM_MailParameters); //MPAM
// let transporter = nodemailer.createTransport(mailConfig.GmailParameters); //GMAIL

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
// const FILE_SEND_MAIL = __dirname+'..\downloadFiles\mail\mail.txt';

exports.surveyBulkFile = (req, res, next) =>{

  // let transporter = nodemailer.createTransport(mailConfig.GmailParameters);

  let _target = req.body.target || 'test';
  let _url='';


  // create instance of readline
// each instance is associated with single input stream
// console.log('DIR>' + __dirname);

var today = new Date();
var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
var time = today.getHours() + "-" + today.getMinutes()
// var time = today.getHours() + "-" + today.getMinutes() + ":" + today.getSeconds();
var dateTime = date+'-'+time;

const readPath = __dirname + '/readFiles/SURVEY/';
const readFile = 'sendMail.txt';

const bakPath = __dirname + '/readFiles/SURVEYBackup/';
const bakFile =  dateTime+'-sendMail.txt';

  if (_target =='prod'){
    _url = 'http://mit.wealth-merchant.com:3000/suit?has='
  }else{
    _url = 'http://localhost:4200/suit?has='
  }

let checkFile = readline.createInterface({
  input: fs.createReadStream(readPath+readFile)
});



// Check data is correct
let line_no = 0;
let numData = 0;

checkFile.on('line', function(line) {
  line_no++;

  //Get number of data in line #1
  if (line_no == 1){
    numData = line;
  }
});

// end
checkFile.on('close', function(line) {

    if(((line_no-1) == numData) && (numData != 0) ){

      line_no = 0;
      let rFile = readline.createInterface({
        input: fs.createReadStream(readPath+readFile)
      });

      rFile.on('line', function(line) {
          line_no++;
          console.log('line_no >>:' + line_no);
          if(line_no >1){
            var array = line.split("|");
            console.log('ARRAY >> ID:' + array[0] + ' ;Email:' + array[2] + ' ;URL='+ _url);

            senMailFromFile(req,res,array[0],array[2],_url);
          }
      });

      // end
      rFile.on('close', function(line) {
        console.log('Total lines : ' + line_no);

        //Move file to Backup
        fs.rename(readPath+readFile, bakPath+bakFile,  (err) => {
          if (err) throw err;
          console.log('Rename/Move complete!');
        });

      });


    }else{
      console.log('Data incorrect ; data lines =' + (line_no-1) + ' ;Header =' + numData );

      res.status(501).json({ message: 'Data incorrect' });
    }

 });

}

function senMailFromFile(req,res,_PID,_Email,_url){


  const _compInfo = mailConfig.mailCompInfo_TH;
  let _from = mailConfig.mail_form;
  let _to ;
  let _subject = 'การสำรวจ และตรวจสอบข้อมูล บลจ. เมอร์ชั่น พาร์ทเนอร์ จำกัด'
  let _msgTH = '';
  var logMsg ;


  try {
    logger.info(`senMailFromFile() _PID=${_PID}- _Email=${_Email}`);

    // Incase has Email
      if(_Email){
        //Generate token
        const token = jwt.sign(
          {USERID: _PID},
          JWT_SECRET_STRING,
          { expiresIn: JWT_EXTERNAL_EXPIRES},
        );

        _to = _Email;

        // Thai message
        _msgTH = `
        <html>
        <head>
        <style>


        .blog-content-outer {
          background: whitesmoke;
          border: 1px solid #e1e1e1;
          border-radius: 5px;
          margin-top: 40px;
          margin-bottom: 20px;
          padding: 0 15px;
          font-size: 16px;
        }

        .logo-area{
          margin-top:20px;
          margin-left:60px;
          margin-bottom:20px;
        }

		.tab { margin-left: 40px; }
        .tab2 { margin-left: 80px; }

        div.a {
  			text-indent: 50px;
		}
        </style>
        </head>
        <body>
        <br>

        <div class='blog-content-outer'>

        <div class="logo-area col-xs-12 col-sm-12 col-md-3">
        <a href="http://www.merchantasset.co.th/home.html"><img src="http://www.merchantasset.co.th/assets/images/logo.png" title=""></a>
        </div>

        <div class="a">
        เรียน    ท่านลูกค้า
        </div>

    <div id="content2" class="a">
    <p >
      เรื่อง ขอความอนุเคราะห์ตรวจสอบข้อมูลส่วนบุคคคลของท่าน
        </p>
    </div>


      <div class="a">
        <p >
    เพื่อเป็นการปฏิบัติให้เป็นไปตามประกาศกำหนดของสำนักงานป้องกันและปราบปรามการฟอกเงิน และสำนักงานคณะกรรมการกำกับหลักทรัพย์และตลาดหลักทรัพย์ เรื่อง การทบทวนข้อมูลลูกค้าและการทำแบบประเมินความเสี่ยงของผู้ลงทุน
        </p>

        <div class="a">
        <p >
        บริษัทหลักทรัพย์จัดการกองทุน เมอร์ชั่น พาร์ทเนอร์ จำกัด (“ บริษัท ”) จึงเรียนมาเพื่อขอความอนุเคราะห์ท่านตรวจสอบข้อมูลที่เคยให้ไว้กับบริษัท และหากท่านมีความประสงค์จะแก้ไขข้อมูลที่เคยให้ไว้สามารถมาดำเนินการด้วยตนเองที่บริษัท หรือ แจ้งข้อมูลผ่านลิงก์ด้านล่างนี้
            </p>
    </div>
          <div class="a">
          <p>
        บริษัทขอขอบพระคุณท่านที่สละเวลาในการตรวจสอบข้อมูล หากท่านมีข้อสอบถามเพิ่มเติม ได้ทางอีเมล์  wealthservice@merchantasset.co.th   หรือ โทรศัพท์ 02 660 6696
            </p>
      </div>

	      <div class="a">
    	  <p>
        ลิงก์สำหรับการตรวจสอบข้อมูลเดิมและแก้ไขข้อมูล
        </p>
        <p>
        ${_url}${token}
        </p>
        </div>

        </div>
        </div>

        <p>
        <br>*** อีเมลนี้เป็นการแจ้งจากระบบอัตโนมัติ กรุณาอย่าตอบกลับ ***
        <p>
        </body>
        </html>
        `;

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

}

function getCustomerInfo(Cust_Code) {

  var fncName = "getCustomerData";
  var queryStr = ` BEGIN

  select Cust_Code
  ,a.First_Name_T +' ' + a.Last_Name_T AS fullName
  ,a.First_Name_E +' ' + a.Last_Name_E AS fullName_Eng
  ,Email
  from MIT_CUSTOMER_INFO a
  where cust_code= @Cust_Code


  if @@rowcount = 0
  BEGIN

  SELECT Cust_Code
  ,[Title_Name_T] + ' ' +  [First_Name_T] + ' ' + [Last_Name_T] AS fullName
  ,[Title_Name_E] + ' ' +  [First_Name_E] + ' ' + [Last_Name_E] AS fullName_Eng
  ,Email
  FROM [Account_Info]
  WHERE Cust_Code= @Cust_Code

  END

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
          <html>
        <head>
        <style>


        .blog-content-outer {
          background: whitesmoke;
          border: 1px solid #e1e1e1;
          border-radius: 5px;
          margin-top: 40px;
          margin-bottom: 20px;
          padding: 0 15px;
          font-size: 16px;
        }

        .logo-area{
          margin-top:20px;
          margin-left:60px;
          margin-bottom:20px;
        }

		.tab { margin-left: 40px; }
        .tab2 { margin-left: 80px; }

        div.a {
  			text-indent: 50px;
		}
        </style>
        </head>
        <body>
        <br>

        <div class='blog-content-outer'>

        <div class="logo-area col-xs-12 col-sm-12 col-md-3">
        <a href="http://www.merchantasset.co.th/home.html"><img src="http://www.merchantasset.co.th/assets/images/logo.png" title=""></a>
        </div>

        <div class="a">
        เรียน    ท่านลูกค้า
        </div>

    <div id="content2" class="a">
    <p >
      เรื่อง    ขอความอนุเคราะห์ตรวจสอบข้อมูลส่วนบุคคคลของท่าน
        </p>
    </div>

    <div class="a">
        <p >
    เพื่อเป็นการปฏิบัติให้เป็นไปตามประกาศกำหนดของสำนักงานป้องกันและปราบปรามการฟอกเงิน และสำนักงานคณะกรรมการกำกับหลักทรัพย์และตลาดหลักทรัพย์ เรื่อง การทบทวนข้อมูลลูกค้าและการทำแบบประเมินความเสี่ยงของผู้ลงทุน
        </p>
      <div class="a">
        <p >
        บริษัทหลักทรัพย์จัดการกองทุน เมอร์ชั่น พาร์ทเนอร์ จำกัด (“ บริษัท ”) จึงเรียนมาเพื่อขอความอนุเคราะห์ท่านตรวจสอบข้อมูลที่เคยให้ไว้กับบริษัท และหากท่านมีความประสงค์จะแก้ไขข้อมูลที่เคยให้ไว้สามารถมาดำเนินการด้วยตนเองที่บริษัท หรือ แจ้งข้อมูลผ่านลิงก์ด้านล่างนี้
            </p>
    </div>
          <div class="a">
          <p>
        บริษัทขอขอบพระคุณท่านที่สละเวลาในการตรวจสอบข้อมูล หากท่านมีข้อสอบถามเพิ่มเติม ได้ทางอีเมล์  wealthservice@merchantasset.co.th   หรือ โทรศัพท์ 02 660 6696
            </p>
      </div>

	      <div class="a">
    	  <p>
        ลิงก์สำหรับการตรวจสอบข้อมูลเดิมและแก้ไขข้อมูล
        </p>
        <p>
        ${_url}${token}
        </p>
        </div>

        </div>
        </div>

        <p>
        <br>*** อีเมลนี้เป็นการแจ้งจากระบบอัตโนมัติ กรุณาอย่าตอบกลับ ***
        <p>
        </body>
        </html>
          `;

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

          _msgTH = `
          <html>
          <head>
          <style>


          .blog-content-outer {
            background: whitesmoke;
            border: 1px solid #e1e1e1;
            border-radius: 5px;
            margin-top: 40px;
            margin-bottom: 20px;
            padding: 0 15px;
            font-size: 16px;
          }

          .logo-area{
            margin-top:20px;
            margin-left:60px;
            margin-bottom:20px;
          }

          div.a {
            text-indent: 50px;
        }

          </style>
          </head>
          <body>
          <br>

          <div class='blog-content-outer'>

          <div class="logo-area col-xs-12 col-sm-12 col-md-3">
          <a href="http://www.merchantasset.co.th/home.html"><img src="http://www.merchantasset.co.th/assets/images/logo.png" title=""></a>
          </div>
          <pre>
          เรียน    ท่านลูกค้า

          <div class="a">
          บริษัทขอขอบพระคุณที่ท่านสละเวลาในการตรวจสอบข้อมูล หากท่านมีข้อสอบถามเพิ่มเติม ได้ทางอีเมล์ wealthservice@merchantasset.co.th หรือ โทรศัพท์ 02 660 6696
          </div>

          </pre>
          </div>

          <p>
          <br>*** อีเมลนี้เป็นการแจ้งจากระบบอัตโนมัติ กรุณาอย่าตอบกลับ ***
          <p>
          </body>
          </html>
          `;

          _msgTH +=_compInfo


          // message to customer
          let mailOptions = {
            from: _from,
            to: _to,
            subject: _subject,
            html: _msgTH
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
