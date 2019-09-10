const bcrypt = require('bcryptjs');
const dbConfig = require('../config/db-config');
var logger = require('../config/winston');
var config = dbConfig.dbParameters;
const mailConfig = require('../config/mail-conf');
var prop = require("../config/backend-property");
const path = require('path');
const fs = require('fs');
const otpTokenController = require('./otpToken');
const mailController = require('./mail');

const nodemailer = require('nodemailer');
const { validationResult } = require('express-validator');

const genStreamPDFController = require('./exmPDF/genStreamPDF');

const  YES_VAL = 'Y';
const  NO_VAL = 'N';
const EMAIL_WEALTH ='yuttana76@gmail.com';

/*
// Response code
code: '100',
data: 'Not found customer'

*/
exports.addRegis = (req,res,next)=>{

  logger.info("Welcome API regis/");

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.info("Validate API regis/ FAIL!");
    return res.status(422).json({ errors: errors.array() });
  }

  const idCard = req.body.idCard;
  const fname = req.body.fname;
  const lname = req.body.lname;
  const email = req.body.email;
  const mobile = req.body.mobile;
  const counter = req.body.counter;

  var ip = req.headers['x-forwarded-for'] ||
     req.connection.remoteAddress ||
     req.socket.remoteAddress ||
     (req.connection.socket ? req.connection.socket.remoteAddress : null);

  console.log(`Params idCard ${idCard}; fname=${fname} ;lname=${lname} ;email=${email} ;mobile=${mobile} ; ip=${ip}`);

  //Check is customer
  hasExistAcc(idCard,email,mobile).then(data=>{

    console.log('hasExistAcc()' > JSON.stringify(data))

  if(data ===YES_VAL){

    // Insert new registration
    fnAddNewRegister(idCard,fname,lname,email,mobile,ip,"0").then(data=>{
      res.status(200).json({
          code: '000',
          data:data
        });
    },err=>{
      res.status(400).json({
        message: err,
        code:"999",
      });
    });

  }else{

    //Send mail to officer
      // Save to log
    if(counter ===3){

      var regisStatus = 1;
      fnUpdateRegisStatus(idCard,fname,lname,email,mobile,ip,regisStatus).then(data=>{

        //Send mail to staff
        _content =`
        <p>ID card: ${idCard}</p>
        <p>Name:  ${fname}  ${lname}</p>
        <p>Mobile: ${mobile}</p>
        <p>Email: ${email}</p>

        `;
        mailController.mailStreamingToStaff(EMAIL_WEALTH,'Streaming For Fund registration (FAIL)',_content).then(mailRs=>{});

      });

    }

      res.status(401).json({
        code: '100',
        data: 'Not found customer'
      });

  }

},err=>{

  res.status(400).json({
    message: err,
    code:"999",
  });
});

}


exports.regisProcess = (req,res,next)=>{

  console.log("Welcome API regisProcess/");

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  // const DOWNLOAD_DIR = path.resolve('./backend/controllers/readFiles/Streaming/');
  // const fileName ='streamUsers.txt';

  const _idCard = req.body.idCard;
  const _otp = req.body.otp;
  const _otpCounter = req.body.otpCounter;
  const _acceptFlag = req.body.acceptFlag;

  const _originalUrl = req.originalUrl;

  var _ip = req.headers['x-forwarded-for'] ||
     req.connection.remoteAddress ||
     req.socket.remoteAddress ||
     (req.connection.socket ? req.connection.socket.remoteAddress : null);

  let userPwdObj

    // 1.Verify OTP
  otpTokenController.verifyOTP_OnStreamRegis(_idCard,_otp,_ip,_originalUrl).then(data=>{

    console.log("verifyOTP_OnStreamRegis >" + JSON.stringify(data));

      if(data==="000"){
        console.log("verifyOTP_OnStreamRegis > SUCCESSFUL");
        // 2.Update OTP to MIT_ST_Register
        var success_flag="0";
        fnUpdateAcceptInfo(_idCard,_acceptFlag,_otp,_ip,success_flag).then(data=>{

          if(data ===NO_VAL){
            res.status(200).json({
              code: '100',
              data: 'Not found customer'
            });
          }else{
            //3. Get customer information
            getCustomerInfo(_idCard).then(data=>{

              console.log("3-1 Info >>" + JSON.stringify(data));
              if(!data.UserName){
                res.status(422).json({ code: 102,msg:'Not found streaming user' });
              }else{
                userPwdObj = { "cusCode":data.Cust_Code,"user":data.UserName,"password":data.PWD,"dob":data.Birth_Day_2}
                console.log("3-3 userPwdObj >>" + JSON.stringify(userPwdObj));
                // Create PDF
                genStreamPDFController.FNgenerateStreamingPDF(userPwdObj).then(result=>{
                  console.log('genStreamPDFController Result >' + JSON.stringify(result));

                    //4. Send E-mail
                    mailController.mailStreamingUserSecret(data.Email,_idCard,data.First_Name,data.Last_Name,data.Birth_Day_1,result.filePDF).then(data=>{
                      console.log("4. Send E-mail sussful " + data);
                    });

                    var regisStatus = 0;//Successful
                    fnUpdateRegisStatus(_idCard,data.First_Name,data.Last_Name,data.Email,data.Mobile,_ip,regisStatus).then(data=>{

                      //Send mail to staff
                      _content =`
                      <p>ID card: ${_idCard}</p>
                      <p>Name:  ${data.First_Name}  ${data.Last_Name}</p>
                      <p>Mobile: ${data.Mobile}</p>
                      <p>Email: ${data.Email}</p>

                      `;

                      mailController.mailStreamingToStaff(EMAIL_WEALTH,'Streaming For Fund registration (Successful)',_content).then(mailRs=>{});

                    });

                });

                res.status(200).json({
                  code: '000',
                  data:data
                });

              }
              // 3.2 Has user / password ?
              // Redad user/pwd file
              // fs.readFile(DOWNLOAD_DIR +"/"+ fileName, 'utf-8', (err, file_data) => {

              //   if (err) reject(err);
              //   var array = file_data.toString().split("\n");
              //   for(i in array) {

              //     var item = array[i].split("|") ;
              //     console.log('**ITEM>' + JSON.stringify(item));
              //     console.log('**_idCard>' + _idCard);
              //     if(item[0]==_idCard){
              //       console.log( `item  ${item[0]}  ${item[1]}  ${item[2]}` );
              //       userPwdObj = { "cusCode":item[0],"user":item[1],"password":item[2],"dob":data.Birth_Day_1}
              //       break;
              //     }
              //   }

              //   console.log('USER is >' +JSON.stringify(userPwdObj));
              //   // Create PDF
              //   genStreamPDFController.FNgenerateStreamingPDF(userPwdObj).then(result=>{
              //     console.log('genStreamPDFController Result >' + JSON.stringify(result));

              //       //4. Send E-mail
              //       mailController.mailStreamingUserSecret(data.Email,_idCard,data.First_Name,data.Last_Name,data.Birth_Day_1,result.filePDF).then(data=>{
              //         console.log("4. Send E-mail sussful " + data);
              //       });
              //   });
              // });
            });

          }

        },err=>{

          console.log("verifyOTP_OnStreamRegis > ERROR");
          res.status(400).json({
            message: err,
            code:"999",
          });
        });

      }else{
        console.log("verifyOTP_OnStreamRegis > FAIL " +data);
        res.status(200).json({
          code: data,
          msg: prop.getRespMsg(data)
        });
      }

  },err=>{

    res.status(400).json({
      message: err,
      code:"999",
    });

  });

}

exports.sendDataMail = (req,res,next)=>{

  //4. Send E-mail
  _Email='yuttana76@gmail.com'
  _idCard='3560100350330'
  _First_Name='Yuttana'
  _Last_Name='Khumnual'
  _Birth_Day_1='01 Jan 1976'


  mailController.mailStreamingUserSecret(_Email,_idCard,_First_Name,_Last_Name,_Birth_Day_1,'123.pdf').then(data=>{

    console.log("4. Send E-mail sussful " + data);

    res.status(200).json({
      code: '000',
      data:data
    });

  });

}



exports.creatPDF = (req,res,next)=>{

    res.status(200).json({
      code: '000',
    });

}

// ********************* Functions


function hasExistAcc(ID,Email,Mobile){

  return new Promise(function(resolve, reject) {

  var queryStr = `select count(*) AS cnt
  FROM [dbo].[Account_Info]
  WHERE Cust_Code='${ID}'
  AND Mobile='${Mobile}'
  AND Email='${Email}'`;

  const sql = require('mssql')
  const pool1 = new sql.ConnectionPool(config, err => {
    pool1.request()
    .query(queryStr, (err, result) => {
        if(err){
          reject(err)
        }else {
          _obj= JSON.parse(JSON.stringify(result));
          if(_obj.recordset[0].cnt === 0){
            resolve(NO_VAL)
          }else{
            resolve(YES_VAL)
          }
        }
    })
  })

  pool1.on('error', err => {
    reject(err)
  })
  });
}

function fnAddNewRegister(ID,Fname,Lname,Email,Mobile,clientInfo,regisStatus){

  return new Promise(function(resolve, reject) {

  var queryStr = `INSERT  INTO MIT_ST_Register (ID,Fname,Lname,Email,Mobile,CreateDate,clientInfo,regisStatus)
  VALUES('${ID}','${Fname}','${Lname}','${Email}','${Mobile}',getdate(),'${clientInfo}' ,'${regisStatus}')`;

  const sql = require('mssql')
  const pool1 = new sql.ConnectionPool(config, err => {
    pool1.request()
    .query(queryStr, (err, result) => {
        if(err){
          reject(err)
        }else {
          resolve(ID)
        }
    })
  })

  pool1.on('error', err => {
    reject(err)
  })

  });
}

function fnUpdateAcceptInfo(ID,acceptFlag,acceptOTP,acceptClientInfo,success_flag){

  return new Promise(function(resolve, reject) {

  var queryStr = `
  BEGIN

    Update MIT_ST_Register
    SET AcceptCond='${acceptFlag}',AcceptOTP='${acceptOTP}',AcceptDate=getdate(),AcceptClientInfo='${acceptClientInfo}', regisStatus='${success_flag}',UpdateDate=getdate()
    where ID='${ID}'

    UPDATE MIT_ST_User SET Status='1',UpdateDate=GETDATE() WHERE ID='${ID}'

  END;
`;

  const sql = require('mssql')
  const pool1 = new sql.ConnectionPool(config, err => {
    pool1.request()
    .query(queryStr, (err, result) => {
        if(err){
          reject(err)
        }else {

          _obj= JSON.parse(JSON.stringify(result));
          if(_obj.rowsAffected[0]=== 0){
            resolve(NO_VAL)
          }else{
            resolve(ID)
          }

        }
    })
  })

  pool1.on('error', err => {
    reject(err)
  })

  });
}


function getCustomerInfo(ID){

  return new Promise(function(resolve, reject) {

  // var queryStr = `
  // SELECT
  // [First_Name_T]
  // ,[Last_Name_T]
  // ,[Mobile]
  // ,[Email]
  // ,Birth_Day
  // ,convert(varchar, Birth_Day, 111) as Birth_Day_1
  // , convert(varchar, Birth_Day, 106) as Birth_Day_2
  // FROM [dbo].[Account_Info]
  // WHERE Cust_Code='${ID}'
  // `;

  var queryStr = `
  SELECT
  Cust_Code
  ,[First_Name_T]
  ,[Last_Name_T]
  ,[Mobile]
  ,[Email]
  ,Birth_Day
  ,convert(varchar, Birth_Day, 111) as Birth_Day_1
  , convert(varchar, Birth_Day, 106) as Birth_Day_2
  ,B.UserName
  ,B.PWD
  FROM [dbo].[Account_Info]  A LEFT JOIN MIT_ST_User B ON A.Cust_Code=B.ID
  WHERE Cust_Code='${ID}'
  `;

  const sql = require('mssql')
  const pool1 = new sql.ConnectionPool(config, err => {
    pool1.request()
    .query(queryStr, (err, result) => {
        if(err){
          reject(err)
        }else {
          // resolve(result.recordset[0])
          resolve({
            Cust_Code:result.recordset[0].Cust_Code,
            First_Name:result.recordset[0].First_Name_T,
            Last_Name:result.recordset[0].Last_Name_T,
            Mobile:result.recordset[0].Mobile,
            Email:result.recordset[0].Email,
            Birth_Day:result.recordset[0].Birth_Day,
            Birth_Day_1:result.recordset[0].Birth_Day_1,
            Birth_Day_2:result.recordset[0].Birth_Day_2,
            UserName:result.recordset[0].UserName,
            PWD:result.recordset[0].PWD,
          });
        }
    })
  })

  pool1.on('error', err => {
    reject(err)
  })
  });
}

function fnUpdateRegisStatus(ID,Fname,Lname,Email,Mobile,clientInfo,regisStatus){

  return new Promise(function(resolve, reject) {

  var queryStr = `
  BEGIN

  SELECT * FROM MIT_ST_Register where ID ='${ID}'

  IF @@ROWCOUNT = 0
    BEGIN
      INSERT  INTO MIT_ST_Register (ID,Fname,Lname,Email,Mobile,CreateDate,clientInfo,regisStatus)
      VALUES('${ID}','${Fname}','${Lname}','${Email}','${Mobile}',getdate(),'${clientInfo}','${regisStatus}')
    END
  ELSE
    BEGIN
      Update MIT_ST_Register
      SET regisStatus='${regisStatus}',clientInfo='${clientInfo}',UpdateDate=getDate()
      where ID='${ID}'
    END

  END;

  `;

  const sql = require('mssql')
  const pool1 = new sql.ConnectionPool(config, err => {
    pool1.request()
    .query(queryStr, (err, result) => {
        if(err){
          reject(err)
        }else {
          resolve(ID)
        }
    })
  })

  pool1.on('error', err => {
    reject(err)
  })

  });
}
