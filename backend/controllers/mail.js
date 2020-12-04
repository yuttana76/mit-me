const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mailConfig = require('../config/mail-conf');
const mpamConfig = require('../config/mpam-config');

const path = require('path');
const readline = require('readline');
const fs = require('fs');
const utility = require('./utility');
var request = require("request");
var prop = require("../config/backend-property");
var logger = require("../config/winston");
var mitLog = require('./mitLog');
const smsConfig = require('../config/sms-conf');
const JWT_SECRET_STRING = mpamConfig.JWT_SECRET_STRING;
const JWT_EXTERNAL_EXPIRES = mpamConfig.JWT_EXTERNAL_EXPIRES;
var config = mpamConfig.dbParameters;

let transporter = nodemailer.createTransport(mpamConfig.MPAM_MailParameters); //MPAM

//reference https://nodemailer.com/about/
exports.sendMail = (req, res, next) =>{

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


exports.sendMailToRespondor = (obj) =>{

  if(!obj.to){
    obj.to = mailConfig.mail_developer;
  }

  // setup email data with unicode symbols
  let mailOptions = {
    from: mailConfig.mail_it,
    to: obj.to,
    subject: obj.subject ,
    html: obj.body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        logger.error(error);
    }

  });
}

exports.sendMailIT = (obj) =>{

  if(!obj.to){
    obj.to = mailConfig.mail_it;
  }

  // setup email data with unicode symbols
  let mailOptions = {
    from: mailConfig.mail_it,
    to: obj.to,
    subject: obj.subject ,
    html: obj.body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        logger.error(error);
    }

  });
}


/*
Send mail  by encypt use bcrypt
*/
// const FILE_SEND_MAIL = __dirname+'..\downloadFiles\mail\mail.txt';
exports.surveyBulkFile = (req, res, next) =>{

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


exports.mailStreamingCustFile = (req, res, next) =>{

var today = new Date();
var date = today.getFullYear()+""+(today.getMonth()+1)+""+today.getDate();
var time = today.getHours() +""+  today.getMinutes()
// var time = today.getHours() + "-" + today.getMinutes() + ":" + today.getSeconds();
var dateTime = date+''+time;

const readPath = __dirname + '/readFiles/Streaming/';
const readFile = 'STmailCust.txt';

const bakPath = __dirname + '/readFiles/StreamingBackup/';
const bakFile =  dateTime+'-'+readFile;

let checkFile = readline.createInterface({
  input: fs.createReadStream(readPath+readFile)
});

checkFile.on('error', function(){ /*handle error*/
  res.status(400).json({ message: `${readFile} File not found` });
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
            // console.log('ARRAY >> ID:' + array[1] + ' ;Email:' + array[2] );

            //SEND mail function
            mailStreaming(req,res,array[1],array[2]).then(data=>{
              // res.status(200).json(data);
              console.log('Success Email >' + array[2]);
              // res.status(200).json('Send mail completed');

            },err=>{
              res.status(400).json({
                message: err,
                code:"999",
              });
            });

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


      res.status(200).json('Send mail completed');
    }else{
      console.log('Data incorrect ; data lines =' + (line_no-1) + ' ;Header =' + numData );

      res.status(501).json({ message: 'Data incorrect' });
    }

 });

}



exports.mailGenerialByFile = (req, res, next) =>{

  var today = new Date();
  var date = today.getFullYear()+""+(today.getMonth()+1)+""+today.getDate();
  var time = today.getHours() +""+  today.getMinutes()
  // var time = today.getHours() + "-" + today.getMinutes() + ":" + today.getSeconds();
  var dateTime = date+''+time;

  const readPath = __dirname + '/readFiles/sendMail/';
  const readFile = 'listmail.txt';

  const bakPath = __dirname + '/readFiles/sendMailBackup/';
  const bakFile =  dateTime+'-'+readFile;

  let checkFile = readline.createInterface({
    input: fs.createReadStream(readPath+readFile)
  });

  checkFile.on('error', function(){ /*handle error*/
    res.status(400).json({ message: `${readFile} File not found` });
  });


  // Check data is correct
  let line_no = 0;
  let numData = 0;

  checkFile.on('line', function(line) {
    line_no++;
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

              console.log('line data :' + line );

              //SEND mail function
              // mailGenerial(req,res,line).then(data=>{
                 mailMaintenance(req,res,line).then(data=>{

                console.log('Success Email >' + line);
                // res.status(200).json('Send mail completed');

              },err=>{
                res.status(400).json({
                  message: err,
                  code:"999",
                });
              });

            }
        });

        // end
        rFile.on('close', function(line) {
          console.log('Total lines : ' + line_no);

          // //Move file to Backup
          fs.rename(readPath+readFile, bakPath+bakFile,  (err) => {
            if (err) throw err;
            console.log('Rename/Move complete!');
          });

        });


        res.status(200).json('Send mail completed');
      }else{
        console.log('Data incorrect ; data lines =' + (line_no-1) + ' ;Header =' + numData );

        res.status(501).json({ message: 'Data incorrect' });
      }

   });

  }


exports.smsStreamingCustFile = (req, res, next) =>{

  // let msg =`เปิดบริการซื้อขายกองทุนรวมกับบลจ. เมอร์ชั่น พาร์ทเนอร์ ผ่าน Mobile App สนใจติดต่อ Wealthservice Tel. 02-6606689 หรือ www.merchantasset.co.th`
  let msg =`!!! ดูพอร์ต ซื้อขาย สับเปลี่ยนกองทุนรวมผ่าน Mobile App ได้แล้ววันนี้ คลิก http://mit.wealth-merchant.com:3000/set-welcome `

  var today = new Date();
  var date = today.getFullYear()+""+(today.getMonth()+1)+""+today.getDate();
  var time = today.getHours() +""+  today.getMinutes()
  // var time = today.getHours() + "-" + today.getMinutes() + ":" + today.getSeconds();
  var dateTime = date+''+time;

  const readPath = __dirname + '/readFiles/Streaming/';
  const readFile = 'STsmsCust.txt';

  const bakPath = __dirname + '/readFiles/StreamingBackup/';
  const bakFile =  dateTime+'-'+readFile;

  let checkFile = readline.createInterface({
    input: fs.createReadStream(readPath+readFile)
  });

  checkFile.on('error', function(){ /*handle error*/
    res.status(400).json({ message: `${readFile} File not found` });
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
              // console.log('ARRAY >> ID:' + array[1] + ' ;Mobile:' + array[2] );
              logger.info('Call smsStreamingCustFile API  to ' + array[2]);

              // // SMS
              smsStreaming(array[2],msg).then(data=>{
                logger.info('Complete SMS  ' + array[2]);

              },err=>{
                res.status(400).json({
                  message: err,
                  code:"999",
                });
              });

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

        res.status(200).json('Send SMS completed');
      }else{
        console.log('Data incorrect ; data lines =' + (line_no-1) + ' ;Header =' + numData );
        res.status(501).json({ message: 'Data incorrect' });
      }
   });
  }

function smsStreaming(mobile,msg){

  return new Promise(function(resolve, reject) {
    var _url = smsConfig.SMSCompleteURL2(mobile,msg);
    var options = {
      url: _url,
      headers: {
          'User-Agent': 'request'
      }
    };

        request.get(options, function(err, resp, body) {
          if (err) {
              reject(err);
          } else {
              resolve(body);
          }
      });

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
        <a href="http://www.merchantasset.co.th/home.html"><img src="https://www.merchantasset.co.th/assets/images/logo.png" title=""></a>
        </div>

      <div class="a">
        <p >เรียน ท่านลูกค้า </p>
        <p >เรื่อง ขอความอนุเคราะห์ตรวจสอบข้อมูลส่วนบุคคล</p>
        <p >
    เพื่อเป็นการปฏิบัติให้เป็นไปตามประกาศกำหนดของสำนักงานป้องกันและปราบปรามการฟอกเงิน และสำนักงานคณะกรรมการกำกับหลักทรัพย์และตลาดหลักทรัพย์ เรื่อง การทบทวนข้อมูลลูกค้าและการทำแบบประเมินความเสี่ยงของผู้ลงทุน
        </p>
        <p >
        บริษัทหลักทรัพย์จัดการกองทุน เมอร์ชั่น พาร์ทเนอร์ จำกัด (“ บริษัท ”) จึงขอความอนุเคราะห์ท่านตรวจสอบข้อมูลที่เคยให้ไว้กับบริษัท และแก้ไขข้อมูลให้เป็นปัจจุบัน พร้อมทั้งทำแบบประเมินความเสี่ยง เพื่อท่านจะสามารถรับการบริการได้อย่างต่อเนื่อง ผ่านลิงก์ด้านล่างนี้
        </p>
      	<p>
        ลิงก์สำหรับการตรวจสอบข้อมูลเดิมและแก้ไขข้อมูล
        </p>
        <p>
        ${_url}${token}
        </p>
        <p>
        บริษัทขอขอบพระคุณที่ท่านสละเวลาในการตรวจสอบ/แก้ไขข้อมูลดังกล่าว หากท่านต้องการสอบถามข้อมูลเพิ่มเติม หรือมีข้อเสนอแนะประการใดขอความกรุณาติดต่อเจ้าหน้าที่ลูกค้าสัมพันธ์  ได้ทางอีเมล์ wealthservice@merchantasset.co.th หรือ โทรศัพท์ 02 660 6696
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


function mailGenerial2_Attach(req,res,_Email){

  const fileName1='STT_Main_newAcc.pdf';
  const attachfile1 = __dirname + '/readFiles/Streaming/'+fileName1;

  // const attachfile2 = __dirname + '/readFiles/Streaming/NDID Specification.pdf';

  // const _compInfo = mailConfig.mailCompInfo_TH;
  let _from = 'wealthservice@merchantasset.co.th';
  let _subject = 'แจ้งปิดระบบ Streaming For Fund เพื่อปรับปรุงระบบ '

  let _msgTH = '';

  return new Promise(function(resolve, reject) {

  try {
    logger.info(`mailStreaming() ;_Email=${_Email}`);

    // Incase has Email
      if(_Email){

        // Thai message
        _msgTH = `
        <html>
        <head>
        </head>
        <body>



        </body>
        </html>

        <br>
        <p>
        <br>*** อีเมลนี้เป็นการแจ้งจากระบบอัตโนมัติ กรุณาอย่าตอบกลับ ***
        <p>
        `;
        // _msgTH +=_compInfo
        // setup email data with unicode symbols
        let mailOptions = {
          from: _from,
          to: _Email,
          subject: _subject,
          html: _msgTH,

          attachments: [{
            filename: fileName1,
            path: attachfile1,
            contentType: 'application/pdf'
          },
          // {
          //   filename: 'file2.pdf',
          //   path: attachfile2,
          //   contentType: 'application/pdf'
          // },
        ],
        };

      /**
       * SEND mail to suctomer
       */
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            reject(error);
          }

            // /*
            // Save MIT_LOG
            // */
            // try {
            //   mitLog.saveMITlog('SYSTEM','SEND_MAIL_CUST_STREAMING',logMsg,req.ip,req.originalUrl,function(){
            //         // console.log("Save MIT log");
            //   })
            // } catch (error) {
            //   console.log(error);
            // }

          logger.info(`API /surveyByMailToken -  Send mail successful!`);
          // res.status(200).json({ message: 'Send mail successful!' });
          resolve('Send mail successful');

        });

        // Incase No Email
      }else{
        logger.error(`API /surveyByMailToken - NO E-mail`);

      }
  } catch (error) {
    // res.status(400).json({ message: 'surveyByMailToken' });

    reject(error);
  }

});
}


function mailMaintenance(req,res,_Email){

  const fileName1='STT_Main_newAcc.pdf';
  const attachfile1 = __dirname + '/readFiles/Streaming/'+fileName1;

  // const attachfile2 = __dirname + '/readFiles/Streaming/NDID Specification.pdf';

  // const _compInfo = mailConfig.mailCompInfo_TH;
  let _from = 'wealthservice@merchantasset.co.th';
  let _subject = 'แจ้งปิดระบบ Streaming For Fund เพื่อปรับปรุงระบบ '

  let _msgTH = '';

  return new Promise(function(resolve, reject) {

  try {
    logger.info(`mailStreaming() ;_Email=${_Email}`);

    // Incase has Email
      if(_Email){

        // Thai message
        _msgTH = `

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
          width:70%;
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

        .nowrap{white-space: nowrap;}

        .txtCenter{
          text-align: center;
        }

        .download{
          margin:auto;
          margin-left: 100px;
        }
        .download img{
          width:150px;
          height: 49px;
        }

        </style>
        </head>
        <body>
        <br>

        <div class='blog-content-outer'>

        <br>
        <div class="logo-area col-xs-12 col-sm-12 col-md-3">
        <a href="https://www.merchantasset.co.th/home.html"><img src="https://www.merchantasset.co.th/assets/images/logo.png" title=""></a>
        </div>

        <br>
        <p >เรียน ท่านลูกค้า</p>
        <br>

        <div class="a">
        <p>
        แจ้งปิดระบบ Streaming For Fund เพื่อปรับปรุงระบบ <br>
        </p>
        <p>ตั้งแต่ วันที่ 03/12/2020  เวลา 18.00 น. ถึง วันที่ 04/12/2020 เวลา 06.00 น.
        </p>

        <p>หากท่านพบปัญหากรุณาติดต่อ wealthservice@merchantasset.co.th<br>
        </p>

        <p>โทร 02-660-6689<br></p>
        <p>Line:@merchantasset
        </p>
        <p>ขออภัยในความไม่สะดวกมา ณ ที่นี้
        </p>

        <br>
        </div>


        </body>
        </html>

        <br>
        <p>
        <br>*** อีเมลนี้เป็นการแจ้งจากระบบอัตโนมัติ กรุณาอย่าตอบกลับ ***
        <p>

        `;

        // _msgTH +=_compInfo


        // setup email data with unicode symbols
        let mailOptions = {
          from: _from,
          to: _Email,
          subject: _subject,
          html: _msgTH,
          // attachments: [{
          //   filename: fileName1,
          //   path: attachfile1,
          //   contentType: 'application/pdf'
          // },
          //       // {
          //       //   filename: 'file2.pdf',
          //       //   path: attachfile2,
          //       //   contentType: 'application/pdf'
          //       // },
          // ],

        };

      /**
       * SEND mail to suctomer
       */
      transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            reject(error);
          }

            // /*
            // Save MIT_LOG
            // */
            // try {
            //   mitLog.saveMITlog('SYSTEM','SEND_MAIL_CUST_STREAMING',logMsg,req.ip,req.originalUrl,function(){
            //         // console.log("Save MIT log");
            //   })
            // } catch (error) {
            //   console.log(error);
            // }

          logger.info(`API /surveyByMailToken -  Send mail successful!`);
          // res.status(200).json({ message: 'Send mail successful!' });
          resolve('Send mail successful');

        });

        // Incase No Email
      }else{
        logger.error(`API /surveyByMailToken - NO E-mail`);

      }
  } catch (error) {
    // res.status(400).json({ message: 'surveyByMailToken' });

    reject(error);
  }

});

}

function mailGenerial(req,res,_Email){

  const fileName1='STT_Main_newAcc.pdf';
  const attachfile1 = __dirname + '/readFiles/Streaming/'+fileName1;

  // const attachfile2 = __dirname + '/readFiles/Streaming/NDID Specification.pdf';

  // const _compInfo = mailConfig.mailCompInfo_TH;
  let _from = 'wealthservice@merchantasset.co.th';
  let _subject = 'แจ้งปิดระบบ Streaming For Fund เพื่อปรับปรุงระบบ '

  let _msgTH = '';

  return new Promise(function(resolve, reject) {

  try {
    logger.info(`mailStreaming() ;_Email=${_Email}`);

    // Incase has Email
      if(_Email){

        // Thai message
        _msgTH = `
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
          width:70%;
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

        .nowrap{white-space: nowrap;}

        .txtCenter{
          text-align: center;
        }

        .download{
          margin:auto;
          margin-left: 100px;
        }
        .download img{
          width:150px;
          height: 49px;
        }

        </style>
        </head>
        <body>
        <br>

        <div class='blog-content-outer'>

        <div class="logo-area col-xs-12 col-sm-12 col-md-3">
        <a href="https://www.merchantasset.co.th/home.html"><img src="https://www.merchantasset.co.th/assets/images/logo.png" title=""></a>
        </div>

        <br>
        <p >เรียน ท่านลูกค้าที่นับถือ</p>
        <br>

        <div class="a">
        <p>
        บล.เมอร์ชั่น พาร์ทเนอร์ จำกัด(มหาชน) ขอนำเสนอการลงทุนในหุ้นกู้ บมจ.เนชั่นแนล เพาเวอร์ ซัพพลาย (NPS) ที่ TRIS Rating จัดอันดับความน่าเชื่อถือ “BBB-” จ่ายดอกเบี้ยทุก 3 เดือน ให้กับคุณลูกค้าได้เลือกลงทุนดังนี้
        </p>
        <p>
        ชุดที่ 1 อายุ 3.5 ปี ดอกเบี้ย 4.70% ต่อปี
        </p>
        <p>
        ชุดที่ 2 อายุ 5 ปี ดอกเบี้ย 5.20% ต่อปี จองซื้อขั้นต่ำ 500,000 บาท และทวีคูณครั้งละ 100,000 บาท เสนอขายนักลงทุนทั่วไป ตั้งแต่วันที่ 4-6 สิงหาคม 2563
        </p>
        <p>
        ข้อมูลเพิ่มเติม <a href='https://www.merchantasset.co.th/detail/ขอนำเสนอการลงทุนในหุ้นกู้-บมจ.เนชั่นแนล-เพาเวอร์-ซัพพลาย--NPS--172.html'>คลิก</a>  หรือ โทร.<a href="tel:02-660-6689">02-660-6689</a> / <a href="tel:064-152-4029">064-152-4029</a>/ line : @Merchantasset
        </p>
        </div>

        <br>
        <p>
        ขอแสดงความนับถือ
        </p>
      <br>
      <p>บริษัทหลักทรัพย์จัดการกองทุน เมอร์ชั่น พาร์ทเนอร์ จำกัด</p>
      <br>
        </body>
        </html>

        <br>
        <p>
        <br>*** อีเมลนี้เป็นการแจ้งจากระบบอัตโนมัติ กรุณาอย่าตอบกลับ ***
        <p>

        `;

        // _msgTH +=_compInfo


        // setup email data with unicode symbols
        let mailOptions = {
          from: _from,
          to: _Email,
          subject: _subject,
          html: _msgTH,

        //   attachments: [{
        //     filename: fileName1,
        //     path: attachfile1,
        //     contentType: 'application/pdf'
        //   },
        //   // {
        //   //   filename: 'file2.pdf',
        //   //   path: attachfile2,
        //   //   contentType: 'application/pdf'
        //   // },
        // ],

        };

      /**
       * SEND mail to suctomer
       */
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            reject(error);
          }

            // /*
            // Save MIT_LOG
            // */
            // try {
            //   mitLog.saveMITlog('SYSTEM','SEND_MAIL_CUST_STREAMING',logMsg,req.ip,req.originalUrl,function(){
            //         // console.log("Save MIT log");
            //   })
            // } catch (error) {
            //   console.log(error);
            // }

          logger.info(`API /surveyByMailToken -  Send mail successful!`);
          // res.status(200).json({ message: 'Send mail successful!' });
          resolve('Send mail successful');

        });

        // Incase No Email
      }else{
        logger.error(`API /surveyByMailToken - NO E-mail`);

      }
  } catch (error) {
    // res.status(400).json({ message: 'surveyByMailToken' });

    reject(error);
  }

});

}



function mailStreaming(req,res,_name,_Email){

  const fileName1='StreamingforFund_Letter.pdf';
  const attachfile1 = __dirname + '/readFiles/Streaming/'+fileName1;

  // const attachfile2 = __dirname + '/readFiles/Streaming/NDID Specification.pdf';

  const _compInfo = mailConfig.mailCompInfo_TH;
  let _from = mailConfig.mail_form;
  let _subject = 'เปิดซื้อขายกองทุนรวม กับบลจ. เมอร์ชั่น พาร์ทเนอร์ จำกัด ผ่าน Mobile App ได้แล้ว'
  // let _subject = 'ดูพอร์ต ซื้อขาย สับเปลี่ยนกองทุนรวมผ่าน Mobile App ได้แล้ววันนี้'

  let _msgTH = '';

  return new Promise(function(resolve, reject) {

  try {
    logger.info(`mailStreaming() Name=${_name} ;_Email=${_Email}`);

    // Incase has Email
      if(_Email){

        // Thai message
        _msgTH = `
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
          width:70%;
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

        .nowrap{white-space: nowrap;}

        .txtCenter{
          text-align: center;
        }

        .download{
          margin:auto;
          margin-left: 100px;
        }
        .download img{
          width:150px;
          height: 49px;
        }

        </style>
        </head>
        <body>
        <br>

        <div class='blog-content-outer'>

        <div class="logo-area col-xs-12 col-sm-12 col-md-3">
        <a href="https://www.merchantasset.co.th/home.html"><img src="https://www.merchantasset.co.th/assets/images/logo.png" title=""></a>
        </div>

        <br>
        <p >เรียน ท่านผู้ถือหน่วยลงทุน</p>
        <br>
        <p>เรื่อง  การทำรายการซื้อขายกองทุนรวมผ่าน Mobile App</p>
        <br>
        <div class="a">
        <p>
        ตั้งแต่วันที่ 4 ตุลาคม 2562 เป็นต้นไป ท่านสามารถดูพอร์ต ซื้อขาย หรือสับเปลี่ยนกองทุนรวมผ่าน Mobile App ด้วยตัวท่านเอง <span class='nowrap'><a href='http://mit.wealth-merchant.com:3000/set-welcome'>ลงทะเบียนคลิกที่นี่ </a></span>
        </p>

        </div>

        <br>
        <br>
        <p>
        ขอแสดงความนับถือ
        </p>

      <br>
      <p>Wealthservice โทร. 02-6606689</p>
      <p>บริษัทหลักทรัพย์จัดการกองทุน เมอร์ชั่น พาร์ทเนอร์ จำกัด</p>
      <p>E-mail : <a href='mailto:wealthservice@merchantasset.co.th'>wealthservice@merchantasset.co.th</a></p>
      <p><a href='https://www.merchantasset.co.th/detail/Streaming-for-Fund-168.html'>www.merchantasset.co.th</a></p>
      <br>

        </body>
        </html>
        <br>
        <p>
        <br>*** อีเมลนี้เป็นการแจ้งจากระบบอัตโนมัติ กรุณาอย่าตอบกลับ ***
        <p>

        `;

        // _msgTH +=_compInfo


        // setup email data with unicode symbols
        let mailOptions = {
          from: _from,
          to: _Email,
          subject: _subject,
          html: _msgTH,
          attachments: [{
            filename: fileName1,
            path: attachfile1,
            contentType: 'application/pdf'
          },
          // {
          //   filename: 'file2.pdf',
          //   path: attachfile2,
          //   contentType: 'application/pdf'
          // },
        ],
        };

      /**
       * SEND mail to suctomer
       */
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            reject(error);
          }

            // /*
            // Save MIT_LOG
            // */
            // try {
            //   mitLog.saveMITlog('SYSTEM','SEND_MAIL_CUST_STREAMING',logMsg,req.ip,req.originalUrl,function(){
            //         // console.log("Save MIT log");
            //   })
            // } catch (error) {
            //   console.log(error);
            // }

          logger.info(`API /surveyByMailToken -  Send mail successful!`);
          // res.status(200).json({ message: 'Send mail successful!' });
          resolve('Send mail successful');

        });

        // Incase No Email
      }else{
        logger.error(`API /surveyByMailToken - NO E-mail`);

      }
  } catch (error) {
    // res.status(400).json({ message: 'surveyByMailToken' });

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

            console.log(" Quey RS>>" + JSON.stringify(result));
            resolve(result.recordsets);
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


/*
Send mail  by token
*/
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

    logger.info('_data[1] >>'+ JSON.stringify(_data[1][0]) );
    data = _data[1][0];

    try {
      logMsg = `;url=${req.originalUrl} ;ip=${req.ip} - ;Cust_Code=${data.Cust_Code} ;Email=${data.Email}`;
      logger.info(`API /surveyByMailToken - ${logMsg}`);

      senMailFromFile(req,res,_PID,data.Email,_url);

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
          <a href="http://www.merchantasset.co.th/home.html"><img src="https://www.merchantasset.co.th/assets/images/logo.png" title=""></a>
          </div>
          <pre>
          เรียน    ท่านลูกค้า

          <div class="a">
          ระบบได้รับข้อมูลของท่านเรียบร้อยแล้ว บริษัทขอขอบพระคุณที่ท่านสละเวลาในการตรวจสอบ/แก้ไขข้อมูลดังกล่าว หากท่านต้องการสอบถามข้อมูลเพิ่มเติม หรือมีข้อเสนอแนะประการใดขอความกรุณาติดต่อเจ้าหน้าที่ลูกค้าสัมพันธ์ ได้ทางอีเมล์ wealthservice@merchantasset.co.th หรือ โทรศัพท์ 02 660 6696
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

/*
Send mail  to Whom response LED

*/
exports.mailLedResponseToday = function(){

  // console.log( "Welcome mailLedResponse()");


  const FROM_LED_SYS = mailConfig.FROM_LED_SYS;
  const TO_LED_RES = mailConfig.TO_LED_RES;
  const LED_CLEANING_SUBJECT  = mailConfig.LED_CLEANING_SUBJECT

  let _msg = `
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

  <h3>MPAM - LED  Cleaning data on ${utility.getDateTime()} </h3>`;

  let _msgLedHeader = "";
  let _msgContent = "";

  return new Promise(function(resolve, reject) {

    getInspToday().then(value=>{

      // console.log(" getInspToday() >>" + JSON.stringify(value));

      value.forEach(function(data,i) {

        _msgLedHeader =`<h3>LED today amount ${data.CNT_LED_DATA} </h3>`;
        _msgLedHeader +=`<h3>Cleaning result found ${value.length} records. </h3>`;

        _msgContent += `
        <div class='blog-content-outer'>
          <p>
          <B>No:</B> ${i+1}
          </p>
          <p>
          <B>ID:</B> ${data.cust_code}
          </p>
          <p>
          <B>Full name:</B> ${data.firstName} ${data.lastName}
          </p>
          <p>
          <B>Source:</B> ${data.cust_source}
          </p>
          <p>
          <B>led_code:</B> ${data.led_code}
          </p>
          <h4>LED data</h4>
          <p>
          <B>ศาล</B> ${data.court_name}
          </p>
          <p>
          <B>โจทก์ ที่ 1:</B> ${data.plaintiff1}
          </p>
          <p>
          <B>วันที่พิทักษ์ทรัพย์เด็ดขาด </B> ${data.abs_prot_dd}/${data.abs_prot_mm}/${data.abs_prot_yy}
          </p>
          <p>
          <B>ชื่อนิติกรเจ้าของสานวน</B> ${data.OWN_NAME}
          </p>
          <p>
          <B>หน่วยงานนิติกรเจ้าของสานวน</B> ${data.OWN_DEPT}
          </p>
          <p>
          <B>เบอร์โทรศัพท์นิติกรเจ้าของสานวน:</B> ${data.OWN_TEL}
          </p>
          </div>
          `;
        });

        _msg +=_msgLedHeader;
        _msg +=_msgContent;
        _msg +='</body></html>';

        let mailOptions = {
          from: FROM_LED_SYS,
          to: TO_LED_RES,
          subject: LED_CLEANING_SUBJECT,
          html: _msg
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            reject(error);
          }
          resolve("000")
        });



    }
    ,err=>{
      reject(reject);
    })

  });
}


function getInspToday() {
    // logger.info(`Welcome cntInspToday() `);

    return new Promise(function(resolve, reject) {
      // var queryStr = `SELECT * FROM MIT_LED_MASTER`;
      var queryStr = `
      BEGIN

      DECLARE @CNT_LED_DATA   int;

      SELECT  @CNT_LED_DATA = count(*)
      FROM MIT_LED_DB_MASTER b
      WHERE  CONVERT(date,createDate)= CONVERT(date, getdate())


      SELECT @CNT_LED_DATA AS CNT_LED_DATA,b.court_name,b.plaintiff1,b.abs_prot_dd,b.abs_prot_mm,b.abs_prot_yy,b.OWN_NAME,b.OWN_DEPT,b.OWN_TEL
      ,a.*
      FROM MIT_LED_INSP_CUST a
      LEFT JOIN MIT_LED_DB_MASTER  b ON b.twsid=a.twsid
      WHERE  CONVERT(date,a.createDate)= CONVERT(date, getdate())

      END
      `;

      const sql = require('mssql')
      const pool1 = new sql.ConnectionPool(config, err => {
        pool1.request() // or: new sql.Request(pool1)
        .query(queryStr, (err, result) => {
            // ... error checks
            if(err){
              reject(err);
            }else {
              resolve(result.recordset);
            }
        })
      })
      pool1.on('error', err => {
        reject(err);
        console.log("EROR>>"+err);
      })
    });
  }



function getLedMaster(twsid) {
  // logger.info(`Welcome cntInspToday() `);

  return new Promise(function(resolve, reject) {
    // var queryStr = `SELECT * FROM MIT_LED_MASTER`;
    var queryStr = `
    BEGIN
      SELECT top 1 a.*
      FROM MIT_LED_DB_MASTER a
      where twsid=${twsid}
    END
    `;

    const sql = require('mssql')
    const pool1 = new sql.ConnectionPool(config, err => {
      pool1.request() // or: new sql.Request(pool1)
      .query(queryStr, (err, result) => {
          // ... error checks
          if(err){
            reject(err);
          }else {
            resolve(result.recordset);
          }
      })
    })
    pool1.on('error', err => {
      reject(err);
      console.log("EROR>>"+err);
    })
  });
}


module.exports.mailStreamingUserSecret = (_Email,custCode,fname,lname,birthdayStr,userFilePDF) => {

  console.log(`Function mailStreamingUserSecret ${_Email} - ${fname} - ${lname} - ${birthdayStr} - ${userFilePDF}`);

  // const fileName1='StreamingforFund_Letter.pdf';
  // const attachfile1 = __dirname + '/readFiles/Streaming/'+fileName1;

  const attachUserFilePDF = __dirname + '/readFiles/Streaming/'+userFilePDF;

  const fileName1 ="คาขอใช้บริการธุรกรรมผ่านทางอินเตอร์เน็ต.pdf";
  const fileName2 ="หนังสือขอให้หักบัญชีเงินฝาก.pdf";
  const fileName3 ="ขั้นตอนการสมัครยินยอมให้หักบัญชีเงินฝาก SCB CallCenter.pdf";
  const fileName4 ="ขั้นตอนการสมัครยินยอมให้หักบัญชีเงินฝาก ช่องทาง SCB Easy Net.pdf";
  const fileName5 ="ขั้นตอนการสมัครยินยอมให้หักบัญชีเงินฝาก ช่องทาง ตู้ ATM.pdf";

  const attachfile1 = __dirname + '/readFiles/Streaming/คำขอใช้บริการอินเตอร์เน็ต_MPAM_050919_Final.pdf';
  const attachfile2 = __dirname + '/readFiles/Streaming/หนังสือขอให้หักบัญชีเงินฝากATS_070819.pdf'
  const attachfile3 = __dirname + '/readFiles/Streaming/ขั้นตอนการสมัครยินยอมให้หักบัญชีเงินฝาก_SCB_Call_Center.pdf';
  const attachfile4 = __dirname + '/readFiles/Streaming/ขั้นตอนการสมัครยินยอมให้หักบัญชีเงินฝาก_SCB_Easy_Net.pdf';
  const attachfile5 = __dirname + '/readFiles/Streaming/ขั้นตอนการสมัครยินยอมให้หักบัญชีเงินฝาก_ตู้_ATM.pdf';

  const _link1 ="https://www.merchantasset.co.th/home.html";
  const _link2 ="https://www.merchantasset.co.th/home.html";
  const _link3 ="https://www.merchantasset.co.th/home.html";
  const _link4 ="https://www.merchantasset.co.th/home.html";
  const _link5 ="https://www.merchantasset.co.th/home.html";
  const _link6 ="https://www.merchantasset.co.th/home.html";

  const download_applePath = 'https://www.merchantasset.co.th/assets/images/download_apple.png'
  const download_googlePath = 'https://www.merchantasset.co.th/assets/images/download_google.png'

  const fullName = fname+' ' +lname + ' '

  const _compInfo = mailConfig.mailCompInfo_TH;
  let _from = mailConfig.mail_form;
  let _subject = 'User name และ Password';
  let _msgTH = '';

  return new Promise(function(resolve, reject) {

  try {
    logger.info(`mailStreaming() Name=${fullName} ;_Email=${_Email}`);

        // Incase has Email
        if(_Email){

          // Thai message
          _msgTH = `
          <html>
          <head>
          <style>

          html, body{ height:100%; margin:0;
            display:flex;
            flex-direction:column;
            width: 17cm;
            height: 27.7cm;
            margin-top:50px;
            margin-left:50px;
          }


          header{ height:50px;  }
          footer{ height:50px;  }


          .blog-content-outer {
            background: whitesmoke;
            border: 1px solid #e1e1e1;
            border-radius: 5px;
            margin-top: 40px;
            margin-bottom: 20px;
            padding: 0 15px;
            font-size: 16px;
            width:70%;
          }

          .logo-area{
            margin-top:20px;
            margin-left:60px;
            margin-bottom:20px;
          }

        .tab { margin-left: 40px; }
          .tab2 { margin-left: 80px; }


        .content{
          text-indent: 50px;
          text-align: justify;
          margin-left: 10px;
          margin-right: 10px;
        }

        .nowrap{white-space: nowrap;}

        .txtCenter{
          text-align: center;
        }

        .download{
          margin:auto;
          margin-left: 100px;
        }
        .download img{
          width:150px;
          height: 49px;
        }

          </style>
          </head>
          <body>
          <IMG SRC="https://www.merchantasset.co.th/assets/images/logo.png" >

          <br>
          <div class='blog-content-outer'>

            <div class="a">

            <p>เรียน ผู้ถือหน่วยลงทุน</p>

              <p class='content'>
              ตามที่ท่านมีความประสงค์ใช้บริการซื้อขายกองทุนผ่าน Mobile App บริษัทขอส่ง User name และ Password  ซึ่งท่านสามารถดูโดยคลิกไฟล์ (PDF file) และใส่รหัสส่วนตัวของท่านตามวิธีดังต่อไปนี้
              </p>

              <br>
              <p class='content'>
              กรุณาใส่รหัสผ่านในรูปแบบ ddMmmyyyy
              </p>
              <p class='content'>dd : วันเกิดของท่าน 2 หลัก</p>
              <p class='content'>Mmm : ตัวอักษรย่อ เดือนเกิดของท่าน 3 หลักเป็นภาษาอังกฤษ (อักษรตัวแรกเป็นตัวพิมพ์ใหญ่)</p>
              <p class='content'>yyyy : ปีเกิดของท่าน 4 หลักเป็นปี ค.ศ. (ตัวอย่าง 1970)</p>
              <p class='content'>ตัวอย่างเช่น ท่านที่เกิดวันที่ 9 มกราคม 2529 กรุณาใส่รหัส 09Jan1986</p>

              <br>

              <br>
              <div class="download">
              <p>ดาวน์โหลด Streaming For Fund ได้ที่</p>
              <a href="https://itunes.apple.com/th/app/streaming-for-fund/id1170482366?l=th&amp;mt=8" target="_blank">
                <img src="${download_applePath}" class="img-responsive" width="200"></a>

              <a href="https://play.google.com/store/apps/details?id=com.settrade.streaming.fund" target="_blank">
                <img src="${download_googlePath}" class="img-responsive" width="220"></a>
              </div>

              <br>
              <p class='content txtCenter'>
              ขอแสดงความนับถือ
              <p>
              <!--<p class='content txtCenter'>บริษัทหลักทรัพย์จัดการกองทุน เมอร์ชั่น พาร์ทเนอร์ จำกัด</p>-->
              <p class='content txtCenter'>บลจ. เมอร์ชั่น พาร์ทเนอร์ จำกัด</p>



            </div>
            <br>
            <br>
            <!--<footer >-->
            <div>
            <p>หมายเหตุ :</p>
            <p>
            จดหมายอิเล็กทรอนิกส์ฉบับนี้ เป็นการส่งจากระบบอัตโนมัติ ไม่สามารถตอบกลับได้ หากท่านต้องการติดต่อบริษัทฯ กรุณาติดต่อ Wealthservice <span class="nowrap">โทร. 02-6606689 ทุกวันทำการ เวลา 9.00-17.00 น. หรือ<span class="nowrap"> e-mail : Wealthservice@merchantasset.co.th</span>
            </p>
            </div>

          </body>
          </html>
          <br>



          `;

          // _msgTH +=_compInfo


          // setup email data with unicode symbols
          let mailOptions = {
            from: _from,
            to: _Email,
            subject: _subject,
            html: _msgTH,
            attachments: [
              {
                filename: 'streamingUser.pdf',
                path: attachUserFilePDF,
                contentType: 'application/pdf'
              },
              // {
              // filename: fileName1,
              // path: attachfile1,
              // contentType: 'application/pdf'
              // },
              // {
              // filename: fileName2,
              // path: attachfile2,
              // contentType: 'application/pdf'
              // },
              // {
              // filename: fileName3,
              // path: attachfile3,
              // contentType: 'application/pdf'
              // },
              // {
              // filename: fileName4,
              // path: attachfile4,
              // contentType: 'application/pdf'
              // },
              // {
              // filename: fileName5,
              // path: attachfile5,
              // contentType: 'application/pdf'
              // },

          ],
          };

        /**
         * SEND mail to suctomer
         */
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              reject(error);
            }
              /*
              Save MIT_LOG
              */
              // try {
              //   mitLog.saveMITlog('SYSTEM','SEND_MAIL_CUST_STREAMING',logMsg,req.ip,req.originalUrl,function(){
              //   })
              // } catch (error) {
              //   console.log(error);
              // }

            logger.info(`API /surveyByMailToken -  Send mail successful!`);
            // res.status(200).json({ message: 'Send mail successful!' });
            resolve('Send mail successful');

          });

          // Incase No Email
        }else{
          logger.error(`API /surveyByMailToken - NO E-mail`);
        }


    // });



  } catch (error) {
    // res.status(400).json({ message: 'surveyByMailToken' });

    reject(error);
  }

});

}



module.exports.mailStreamingToStaff = (_to,_subject,_content) => {

  console.log(`Function mailStreamingToStaff ${_to} - ${_content} `);

  const _compInfo = mailConfig.mailCompInfo_TH;
  let _from = mailConfig.mail_form;
  let _msgTH = '';


  var today = new Date();
  var date = today.getFullYear()+"/"+(today.getMonth()+1)+"/"+today.getDate();
  var time = today.getHours() +":"+  today.getMinutes()

  var dateTime = date+' '+time;

  return new Promise(function(resolve, reject) {

  try {
        // Incase has Email
        if(_to){
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

        }
        .content{
          text-align: justify;
          margin-left: 10px;
          margin-right: 10px;
        }

          </style>
          </head>
          <body>

          <h3>${_subject}  ON:${dateTime}<h3>
          <p>Already send all files. </p>
          <br>
          ${_content}
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
              reject(error);
            }

            logger.info(`API /mailStreamingToStaff -  Send mail successful!`);
            // res.status(200).json({ message: 'Send mail successful!' });
            resolve('Send mail successful');
          });

          // Incase No Email
        }else{
          logger.error(`API /mailStreamingToStaff - NO E-mail`);
        }
  } catch (error) {
    // res.status(400).json({ message: 'surveyByMailToken' });
    reject(error);
  }

});

}


module.exports.regisToMail = (name,surName,phone,email,lineId,description) => {

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
  New customer register form On ${utility.getDateTime()}
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
      to: mailConfig.mail_wealthservice,
      subject: "New Cust Streaming For Fund registration",
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
