const bcrypt = require('bcryptjs');
const dbConfig = require('../config/db-config');
var logger = require('../config/winston');
var config = dbConfig.dbParameters;
const mailConfig = require('../config/mail-conf');
const nodemailer = require('nodemailer');
const { validationResult } = require('express-validator');

const  YES_VAL = 'Y';
const  NO_VAL = 'N';

/*
// Response code
code: '100',
data: 'Not found customer'

*/
exports.addRegis = (req,res,next)=>{

  logger.info("Welcome API regis/");

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const idCard = req.body.idCard;
  const fname = req.body.fname;
  const lname = req.body.lname;
  const email = req.body.email;
  const mobile = req.body.mobile;

  var ip = req.headers['x-forwarded-for'] ||
     req.connection.remoteAddress ||
     req.socket.remoteAddress ||
     (req.connection.socket ? req.connection.socket.remoteAddress : null);

  console.log(`Params idCard ${idCard}; fname=${fname} ;lname=${lname} ;email=${email} ;mobile=${mobile} ; ip=${ip}`);

  //Check is customer
  hasExistAcc(idCard,email,mobile).then(data=>{

  if(data ===YES_VAL){

    // Insert new registration
    fnAddNewRegister(ID,Fname,Lname,Email,Mobile,clientInfo).then(data=>{
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
    res.status(200).json({
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

exports.updateAcceptInfo = (req,res,next)=>{
  console.log("Welcome API regisAccept/");

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const idCard = req.body.idCard;
  const acceptFlag = req.body.acceptFlag;
  const otp = req.body.otp;

  var ip = req.headers['x-forwarded-for'] ||
     req.connection.remoteAddress ||
     req.socket.remoteAddress ||
     (req.connection.socket ? req.connection.socket.remoteAddress : null);

  // Update registration acceptance
  fnUpdateAcceptInfo(idCard,acceptFlag,otp,ip).then(data=>{

    if(data ===NO_VAL){
      res.status(200).json({
        code: '100',
        data: 'Not found customer'
      });
    }else{
      res.status(200).json({
        code: '000',
        data:data
      });
    }

  },err=>{
    res.status(400).json({
      message: err,
      code:"999",
    });
  });
}

exports.reqOTP = (req,res,next)=>{
  console.log("Welcome API reqOTP/");

  return res.status(200).json({
    code: rsp_code,
    otp: {id:"123"}
  });
}

exports.sendData = (req,res,next)=>{
  console.log("Welcome API sendData/");

  return res.status(200).json({
    code: rsp_code,
    otp: {id:"123"}
  });
}

// ********************* Functions
function hasExistAcc(ID,Email,Mobile){

  var _result ="N";
  return new Promise(function(resolve, reject) {

  var queryStr = `select count(*) AS cnt
  FROM [MFTS].[dbo].[Account_Info]
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

function fnAddNewRegister(ID,Fname,Lname,Email,Mobile,clientInfo){

  return new Promise(function(resolve, reject) {

  var queryStr = `INSERT  INTO MIT_ST_Register (ID,Fname,Lname,Email,Mobile,CreateDate,clientInfo)
  VALUES('${ID}','${Fname}','${Lname}','${Email}','${Mobile}',getdate(),'${clientInfo}')`;

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

function fnUpdateAcceptInfo(ID,acceptFlag,acceptOTP,acceptClientInfo){

  return new Promise(function(resolve, reject) {

  var queryStr = `
  Update MIT_ST_Register
  SET AcceptCond='${acceptFlag}',AcceptOTP='${acceptOTP}',AcceptDate=getdate(),AcceptClientInfo='${acceptClientInfo}'
  where ID='${ID}'
`;

  const sql = require('mssql')
  const pool1 = new sql.ConnectionPool(config, err => {
    pool1.request()
    .query(queryStr, (err, result) => {
        if(err){
          reject(err)
        }else {

console.log('RESULT>>' + JSON.stringify(result));
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
