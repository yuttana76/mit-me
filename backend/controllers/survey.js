const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mailConfig = require('../config/mail-conf');
const path = require('path');
const readline = require('readline');
const fs = require('fs');
const dbConfig = require('../config/db-config');

const utility = require('./utility');
var request = require("request");

var prop = require("../config/backend-property");
var logger = require("../config/winston");
var mitLog = require('./mitLog');
const smsConfig = require('../config/sms-conf');

const suitPDFController = require('../controllers/exmPDF/suitPDF');

const SALT_WORK_FACTOR = dbConfig.SALT_WORK_FACTOR;
const JWT_SECRET_STRING = dbConfig.JWT_SECRET_STRING;
const JWT_EXPIRES = dbConfig.JWT_EXPIRES;
const JWT_EXTERNAL_EXPIRES = dbConfig.JWT_EXTERNAL_EXPIRES;

var config = dbConfig.dbParameters;

let transporter = nodemailer.createTransport(mailConfig.MPAM_MailParameters); //MPAM
// let transporter = nodemailer.createTransport(mailConfig.GmailParameters); //GMAIL

//reference https://nodemailer.com/about/
/*
Send mail  by token
*/
exports.surveyKYCByID = (req, res, next) =>{

  const _PID = req.body.custCode ||'41121225'

  var logMsg ;

  let _target = req.body.target || 'test';
  let _url='';

  if (_target =='prod'){
    _url = 'http://mit.wealth-merchant.com:3000/suit?has='
  }else{
    _url = 'http://localhost:4200/suit?has='
  }

  getCustomerInfo(_PID).then( _data =>{

    logger.info('_data>>' + JSON.stringify(_data));

    data = _data[0];

    try {
      logMsg = `;url=${req.originalUrl} ;ip=${req.ip} - ;Cust_Code=${data.Cust_Code} ;Email=${data.Email}`;
      logger.info(`API /surveyByMailToken - ${logMsg}`);

      senMailKYC(req,res,_PID,data.Email,_url);

    } catch (error) {

      console.log(error);
      res.status(400).json({ msg: error });

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

exports.surveySuitByMailToken = (req, res, next) =>{

  const _PID = req.body.custCode ||'41121225'

  var logMsg ;

  let _target = req.body.target || 'test';
  let _url='';

  if (_target =='prod'){
    _url = 'http://mit.wealth-merchant.com:3000/suitSurvey?has='
  }else{
    _url = 'http://localhost:4200/suitSurvey?has='
  }

  getCustomerInfo(_PID).then( _data =>{

    logger.info('_data>>' + JSON.stringify(_data));

    data = _data[0];

    try {
      logMsg = `;url=${req.originalUrl} ;ip=${req.ip} - ;Cust_Code=${data.Cust_Code} ;Email=${data.Email}`;
      logger.info(`API /surveySuit - ${logMsg}`);

      sendSuitMail(req,res,_PID,data.Email,_url);

    } catch (error) {

      console.log(error);
      res.status(400).json({ msg: error });

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



// **********************************
/*
Send mail  by encypt use bcrypt
*/
// const FILE_SEND_MAIL = __dirname+'..\downloadFiles\mail\mail.txt';

exports.surveyKYCBulkFile = (req, res, next) =>{
  console.log('STEP 1');

  // let transporter = nodemailer.createTransport(mailConfig.GmailParameters);

  let _target = req.body.target || 'test';
  let _url='';

  // create instance of readline
// each instance is associated with single input stream
// console.log('DIR>' + __dirname);

var today = new Date();
var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
var time = today.getHours() + "-" + today.getMinutes()
var dateTime = date+'-'+time;

const readPath = __dirname + '/readFiles/SURVEY/';
const readFile = 'kycSurvey.txt';

const bakPath = __dirname + '/readFiles/SURVEYBackup/';
// const bakFile =  dateTime+'-sendMail.txt';
const bakFile =  dateTime+readFile;

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
            senMailKYC(req,res,array[0],array[2],_url);
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


exports.surveyByMailToken = (req, res, next) =>{

  const _PID = req.body.custCode ||'41121225'

  var logMsg ;

  let _target = req.body.target || 'test';
  let _url='';

  if (_target =='prod'){
    _url = 'http://mit.wealth-merchant.com:3000/suit?has='
  }else{
    _url = 'http://localhost:4200/suit?has='
  }

  getCustomerInfo(_PID).then( _data =>{

    logger.info('_data>>' + JSON.stringify(_data));

    logger.info('_data[1] >>'+ JSON.stringify(_data[0]) );
    data = _data[0];

    try {
      logMsg = `;url=${req.originalUrl} ;ip=${req.ip} - ;Cust_Code=${data.Cust_Code} ;Email=${data.Email}`;
      logger.info(`API /surveyByMailToken - ${logMsg}`);

      senMailKYC(req,res,_PID,data.Email,_url);

    } catch (error) {

      console.log(error);
      res.status(400).json({ msg: error });

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


exports.sendMailThankCustSuit = (req, res, next) =>{

  const _PID = req.body.custCode;

  let _from = mailConfig.mail_form;
  let _to ;
  let _toRM = mailConfig.mailRM;

  let _subject = 'ยืนยันแบบประเมิน Suitability Test ของลูกค้า บลจ. เมอร์ชั่น พาร์ทเนอร์ จำกัด'
  let _subjectRM = 'แจ้งผลการสำรวจ แบบประเมิน Suitability Test ของลูกค้า บลจ. เมอร์ชั่น พาร์ทเนอร์ จำกัด '
  let _msg = '';
  let _msgRM = '';
  const _compInfo = mailConfig.mailCompInfo_TH;
  var logMsg ;


  getCustomerInfo(_PID).then( (_data) =>{

    data = _data[0];

    try {
      logMsg = `;url=${req.originalUrl} ;ip=${req.ip} - ;Cust_Code=${data.Cust_Code} ;Email=${data.Email}`;
      logger.info(`API /surveySuitThankCust - ${logMsg}`);

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

          .tab { margin-left: 40px; }
          .tab2 { margin-left: 80px; }

          div.a {
          left:50px;
          }

          .txt-Indent{
            text-indent: 50px;
          }

          @media screen and (min-width: 768px) {
            .blog-content-outer{
              width:1024px;
              }
          }
          </style>


          </head>
          <body>
          <br>

          <div class='blog-content-outer'>

          <div class="logo-area col-xs-12 col-sm-12 col-md-3">
          <a href="http://www.merchantasset.co.th/home.html"><img src="http://www.merchantasset.co.th/assets/images/logo.png" title=""></a>
          </div>

          <p class="txt-Indent">เรียน   ท่านลูกค้า</p>
          <p class="txt-Indent">
          ระบบได้รับข้อมูลของท่านเรียบร้อยแล้ว บริษัทขอขอบพระคุณที่ท่านสละเวลาในการ ทำแบบประเมิน Suitability Test หากท่านต้องการสอบถามข้อมูลเพิ่มเติม หรือมีข้อเสนอแนะประการใดขอความกรุณาติดต่อเจ้าหน้าที่ลูกค้าสัมพันธ์ ได้ทางอีเมล์ wealthservice@merchantasset.co.th หรือ โทรศัพท์ 02 660 6696
          </p>
          <br>
          <p class="txt-Indent">
            ขอแสดงความนับถือ
          </p>
          <p class="txt-Indent">
            บริษัทหลักทรัพย์จัดการกองทุน เมอร์ชั่น พาร์ทเนอร์ จำกัด
          <p>
          <br>
          </div>

          <p>
          <br>*** อีเมลนี้เป็นการแจ้งจากระบบอัตโนมัติ กรุณาอย่าตอบกลับ ***
          <p>

          </body>
          </html>
          `;

          _msgTH +=_compInfo


  // Get Suit data
  getCustSuitData(data.Cust_Code).then( (_data) =>{

    //Create Suit PDF
    suitPDFController.suitCreatePDF(_data[0]).then(result=>{

      const attachSuitFilepath = __dirname + '/readFiles/suit/'+result.filePDF;
      const attachFileName = 'แบบประเมินSuittability.pdf';


          // message to customer
          let mailOptions = {
            from: _from,
            to: _to,
            subject: _subject,
            html: _msgTH,
            attachments: [
              {
                filename: attachFileName,
                path: attachSuitFilepath,
                contentType: 'application/pdf'
              },
            ]
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



    },err=>{
      res.status(401).json(err);
    });

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


exports.surveySuitBulkFile = (req, res, next) =>{

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
const readFile = 'suitSurvey.txt';

const bakPath = __dirname + '/readFiles/SURVEYBackup/';
const bakFile =  dateTime+'-suitSurvey.txt';

  if (_target =='prod'){
    _url = 'http://mit.wealth-merchant.com:3000/suitSurvey?has='
  }else{
    _url = 'http://localhost:4200/suitSurvey?has='
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
          // console.log('line_no >>:' + line_no);
          if(line_no >1){
            var array = line.split("|");
            // console.log('ARRAY >> ID:' + array[0] + ' ;Email:' + array[2] + ' ;URL='+ _url);
            sendSuitMail(req,res,array[0],array[2],_url);

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


// **********************************
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

// **********************************
/*
Send mail  to Whom related with this customer
  1:Customer
  2: RM
*/
exports.sendMailThankCust = (req, res, next) =>{

  const _PID = req.body.custCode;

  let _from = mailConfig.mail_form;
  let _to ;
  let _toRM = mailConfig.mailRM;

  let _subject = 'ยืนยันการสำรวจ และตรวจสอบข้อมูล  บลจ. เมอร์ชั่น พาร์ทเนอร์ จำกัด'
  let _subjectRM = 'แจ้งผลการสำรวจ และตรวจสอบข้อมูล(MIT-survey) '
  let _msg = '';
  let _msgRM = '';
  const _compInfo = mailConfig.mailCompInfo_TH;
  var logMsg ;

  getCustomerInfo(_PID).then( (_data) =>{

    data = _data[0];

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
            margin-top: 20px;
            margin-bottom: 40px;
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
          left:50px;
          }

          .txt-Indent{
            text-indent: 50px;
          }

          @media screen and (min-width: 768px) {
            .blog-content-outer{
              width:1024px;
              }
          }

          .button {
            background-color: gold;
            border: none;
            color: white;
            padding: 20px 34px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 20px;
            margin: 4px 2px;
            cursor: pointer;
            }
            a:link a:visited a:hover, a:active, a:focus {
              color: white;
            }
            .center_div{
              text-align: center;
            }

            .sameline{
              display: inline-block;
            }
          </style>

          </head>
          <body>
          <br>

          <div class='blog-content-outer'>

          <div class="logo-area col-xs-12 col-sm-12 col-md-3">
          <a href="http://www.merchantasset.co.th/home.html"><img src="http://www.merchantasset.co.th/assets/images/logo.png" title=""></a>
          </div>

          <p >เรียน ท่านลูกค้า </p>
          <p class="txt-Indent">
          ระบบได้รับข้อมูลของท่านเรียบร้อยแล้ว บริษัทขอขอบพระคุณที่ท่านสละเวลาในการตรวจสอบ/แก้ไขข้อมูลดังกล่าว หากท่านต้องการสอบถามข้อมูลเพิ่มเติม หรือมีข้อเสนอแนะประการใดขอความกรุณาติดต่อเจ้าหน้าที่ลูกค้าสัมพันธ์ ได้ทางอีเมล์ <span class='sameline'>wealthservice@merchantasset.co.th</span> หรือ <span class='sameline'>โทร 02-660-6689</span>
          </p>
          <br>
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

exports.requestPDF = (req, res, next) =>{

  logger.info("Welcome API /requestPDF");
  const custCode = req.body.custCode;

  getCustSuitData(custCode).then( (_data) =>{

    suitPDFController.suitCreatePDF(_data[0]).then(result=>{

      res.status(200).json({
        msg:'successful',
        path:result.pdfPath,
        filePDF:result.filePDF
      });

    },err=>{
      res.status(401).json(err);
    });
  });
}

/**
 * Sendmail to wealth service
 * Save to MIT_LOG
 */
exports.reqNewMobile = (req, res, next) =>{

  logger.info("Welcome API /reqNewMobile");

  const LoginName = req.body.custCode || '';
  const module = req.body.module || 'MIT-survey reqNewMobile';
  const log_msg = req.body.log_msg || '';


  senMailInternal_NewMob(req,LoginName,module,log_msg).then( (_data) =>{
      res.status(200).json({
        msg:'successful',
      });
  });

}


function senMailInternal_NewMob(req,LoginName,module,log_msg){

    let _from = mailConfig.mail_form;

    // let _to = mailConfig.mail_wealthservice;  // Change on PROD
    let _to = mailConfig.mail_developer;

    let _subjectRM = 'KYC & Suit survey ลูกค้าแจ้งเปลี่ยนข้อมูล (MIT-survey) '
    let _msgRM = '';
    var logMsg ;

    return new Promise(function(resolve, reject) {


      try {
        logMsg = `;Module=${module} - ;Cust_Code=${LoginName}  ;url=${req.originalUrl} ;ip=${req.ip} `;
        logger.info(`API /senMailInternal_NewMob - ${logMsg}`);

            // message to RM.
            _subjectRM += ` (${LoginName})`;
            _msgRM = `
            <html>
            <body>

            <h3>KYC & Suit survey ลูกค้าแจ้งเปลี่ยนข้อมูล On ${utility.getDateTime()} </h3>

              <div class='container'>
                  <p>Customer Code: ${LoginName}</p>
                  <p>Message: ${log_msg}</p>
                <hr>
                <br>
              </div>
            </body>
            </html>
            `;

            let mailOptions_RM = {
              from: _from,
              to: _to,
              subject: _subjectRM,
              html: _msgRM
            };

          /**
           * SEND mail RM.
           */
          transporter.sendMail(mailOptions_RM, (error, info) => {
            if (error) {
              // return logger.error(`API /sendMailToRelated - ${error} `);
                // return console.log(error);
                reject(error);
            }

             mitLog.saveMITlog(LoginName,module,log_msg,req.ip,req.originalUrl,function(){});

            // logger.info(`API /sendMailToRelated -  Send mail to RM. successful!`);
            // res.status(200).json({ message: 'Send mail successful!' });
            resolve('successful');
          });
            // Incase No Email

      } catch (error) {
        // res.status(400).json({ message: 'sendMailToRelated' });
        reject(error);
      }

    });

  }


function getCustomerInfo(Cust_Code) {

  logger
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
            // console.log(" Quey RS>>" + JSON.stringify(result));
            if(result.recordset.length>0){
              resolve(result.recordset);
            }else{
              resolve(result.recordsets[1]);
            }

            // resolve(result.recordsets);
            // resolve(result.recordset[0]);

          }
        });
    });
    pool1.on("error", err => {

      console.log("ERROR>>" + err);
      reject(err);

    });
  });
}


function getCustSuitData(Cust_Code) {

  logger.info("Welcome getCustSuitData() " + Cust_Code);

  var queryStr = `
  BEGIN

  SELECT TOP 1 a.CustCode, B.First_Name_T + ' ' +B.Last_Name_T AS FullName,a.RiskLevel,a.TotalScore, convert(varchar, a.CreateDate, 103) as SuitDate
  ,a.ANS_JSON as Ans
  from MIT_CUSTOMER_SUIT a,Account_Info B
  where a.CustCode = b.Cust_Code
  and a.CustCode= @Cust_Code
  AND a.Status ='A'
  ORDER BY a.CreateDate DESC

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
            // console.log(" Quey RS>>" + JSON.stringify(result));
            if(result.recordset.length>0){
              resolve(result.recordset);
            }else{
              resolve(result.recordsets[1]);
            }

            // resolve(result.recordsets);
            // resolve(result.recordset[0]);

          }
        });
    });
    pool1.on("error", err => {

      console.log("ERROR>>" + err);
      reject(err);

    });
  });
}

function senMailKYC(req,res,_PID,_Email,_url){

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
  			left:50px;
        }

        .txt-Indent{
          text-indent: 50px;
        }

        @media screen and (min-width: 768px) {
          .blog-content-outer{
            width:1024px;
            }
        }

        .button {
          background-color: gold;
          border: none;
          color: white;
          padding: 20px 34px;
          text-align: center;
          text-decoration: none;
          display: inline-block;
          font-size: 20px;
          margin: 4px 2px;
          cursor: pointer;
          }
          a:link a:visited a:hover, a:active, a:focus {
            color: white;
          }
          .center_div{
            text-align: center;
          }
          .sameline{
            display: inline-block;
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
        <p >เรียน ท่านลูกค้า </p>
        <p >เรื่อง ขอความอนุเคราะห์ตรวจสอบข้อมูลส่วนบุคคล</p>
        <p class='txt-Indent'>
    เพื่อเป็นการปฏิบัติให้เป็นไปตามประกาศกำหนดของสำนักงานป้องกันและปราบปรามการฟอกเงิน และสำนักงานคณะกรรมการกำกับหลักทรัพย์และตลาดหลักทรัพย์ เรื่อง การทบทวนข้อมูลลูกค้าและการทำแบบประเมินความเสี่ยงของผู้ลงทุน
        </p>
        <p class='txt-Indent'>
        บริษัทหลักทรัพย์จัดการกองทุน เมอร์ชั่น พาร์ทเนอร์ จำกัด (“ บริษัท ”) จึงขอความอนุเคราะห์ท่านตรวจสอบข้อมูลที่เคยให้ไว้กับบริษัท และแก้ไขข้อมูลให้เป็นปัจจุบัน พร้อมทั้งทำแบบประเมินความเสี่ยง เพื่อท่านจะสามารถรับการบริการได้อย่างต่อเนื่อง
        สามารถใช้ระบบโดยคลิ๊กปุ่มด้านล่างนี้
        </p>
        <br>

        <br>
        <div class='center_div'>
          <a href="${_url}${token}" class="button">เข้าระบบ คลิ๊กที่นี่</a>
        </div>
        <br>

        <br>
        <p class='txt-Indent'>
        บริษัทขอขอบพระคุณที่ท่านสละเวลาในการตรวจสอบ/แก้ไขข้อมูลดังกล่าว หากท่านต้องการสอบถามข้อมูลเพิ่มเติม หรือมีข้อเสนอแนะประการใดขอความกรุณาติดต่อเจ้าหน้าที่ลูกค้าสัมพันธ์  ได้ทางอีเมล์ wealthservice@merchantasset.co.th หรือ โทร 02-660-6689
        </p>
        <p>
          ขอแสดงความนับถือ
        </p>
        <p>
          บริษัทหลักทรัพย์จัดการกองทุน เมอร์ชั่น พาร์ทเนอร์ จำกัด
        <p>
    </div>

        </body>
        </html>
        <br>
        <p>
        <br>*** อีเมลนี้เป็นการแจ้งจากระบบอัตโนมัติ กรุณาอย่าตอบกลับ ***
        <p>

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

function sendSuitMail(req,res,_PID,_Email,_url){

  const _compInfo = mailConfig.mailCompInfo_TH;
  let _from = mailConfig.mail_form;
  let _to ;
  let _subject = 'แบบประเมิน Suitability Test ของลูกค้า บลจ. เมอร์ชั่น พาร์ทเนอร์ จำกัด'
  let _msgTH = '';
  var logMsg ;


  try {
    logger.info(`sendSuitMail() _PID=${_PID}- _Email=${_Email}`);

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
  			left:50px;
        }

        .txt-Indent{
          text-indent: 50px;
        }

        @media screen and (min-width: 768px) {
          .blog-content-outer{
            width:1024px;
            }
        }

        .button {
          background-color: gold;
          border: none;
          color: white;
          padding: 20px 34px;
          text-align: center;
          text-decoration: none;
          display: inline-block;
          font-size: 20px;
          margin: 4px 2px;
          cursor: pointer;
          }
          a:link a:visited a:hover, a:active, a:focus {
            color: white;
          }
          .center_div{
            text-align: center;
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
        <p class="txt-Indent">เรียน ท่านลูกค้า </p>
        <p class="txt-Indent">เรื่อง ประเมิน Suitability Test</p>

        <p class="txt-Indent">
        บริษัทหลักทรัพย์จัดการกองทุน เมอร์ชั่น พาร์ทเนอร์ จำกัด  ใคร่ขอความกรุณาจากท่านในการจัดทำแบบประเมิน Suitability เพื่อประเมินระดับความเสี่ยงของผู้ลงทุน (Risk profile) ตาม
        หลักเกณฑ์ที่ ก.ล.ต. กำหนดไว้ โดยคลิ๊กที่ปุ่มด้านล่าง
        </p>

        <br>
        <br>
        <div class='center_div'>
          <a href="${_url}${token}" class="button">กรอกแบบประเมิน Suitability Test Click</a>
        </div>
        <br>
        <br>

        <p class="txt-Indent">
        บริษัทขอขอบพระคุณที่ท่านสละเวลาในการทำแบบประเมิน Suitability Test หากท่านต้องการสอบถามข้อมูลเพิ่มเติม หรือมีข้อเสนอแนะประการใดขอความกรุณาติดต่อเจ้าหน้าที่ลูกค้าสัมพันธ์  ได้ทางอีเมล์ wealthservice@merchantasset.co.th หรือ โทรศัพท์ 02 660 6689
        </p>
        <br>
        <p class="txt-Indent">
          ขอแสดงความนับถือ
        </p>
        <p class="txt-Indent">
          บริษัทหลักทรัพย์จัดการกองทุน เมอร์ชั่น พาร์ทเนอร์ จำกัด
        <p>
    </div>

        </body>
        </html>
        <br>
        <p>
        <br>*** อีเมลนี้เป็นการแจ้งจากระบบอัตโนมัติ กรุณาอย่าตอบกลับ ***
        <p>

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
              mitLog.saveMITlog('SYSTEM','SEND_MAIL_USER_SUIT_SURVEY',logMsg,req.ip,req.originalUrl,function(){
                    // console.log("Save MIT log");
              })
            } catch (error) {
              console.log(error);
            }
          logger.info(`API /sendSuitMail -  Send mail successful!`);
          res.status(200).json({ message: 'Send mail successful!' });
        });
        // Incase No Email
      }else{
        logger.error(`API /sendSuitMail - NO E-mail`);
      }
  } catch (error) {
    res.status(400).json({ message: 'sendSuitMail' });
  }
}

