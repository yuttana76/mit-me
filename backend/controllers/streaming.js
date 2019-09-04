const bcrypt = require('bcryptjs');
const dbConfig = require('../config/db-config');
var logger = require('../config/winston');
var config = dbConfig.dbParameters;
const mailConfig = require('../config/mail-conf');
const nodemailer = require('nodemailer');
const { validationResult } = require('express-validator');

exports.addRegis = (req,res,next)=>{

  logger.info("Welcome API streamRegis/");

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

fnAddNewRegister(idCard,fname,lname,email,mobile,ip).then(data=>{
  res.status(200).json({
      code: '000',
      data: data
    });

},err=>{
  res.status(400).json({
    message: err,
    code:"999",
  });
});
  // return res.status(200).json({
  //   code: '000',
  //   data: {id:"123"}
  // });

  // return res.status(401).json({
  //   code: rsp_code,
  //   msg: prop.getRespMsg(rsp_code)
  // });

}

exports.updateRegis = (req,res,next)=>{
  console.log("Welcome API updateStreamRegis/");

  return res.status(200).json({
    code: rsp_code,
    data: {id:"123"}
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
function fnAddNewRegister(ID,Fname,Lname,Email,Mobile,clientInfo){

  return new Promise(function(resolve, reject) {

  var queryStr = `INSERT  INTO MIT_ST_Register (ID,Fname,Lname,Email,Mobile,CreateDate,clientInfo)
  VALUES('${ID}','${Fname}','${Lname}','${Email}','${Mobile}',getdate(),'${clientInfo}')`;

  const sql = require('mssql')
  const pool1 = new sql.ConnectionPool(config, err => {
    pool1.request() // or: new sql.Request(pool1)
    .query(queryStr, (err, result) => {
        if(err){
          reject(err)
        }else {
          resolve(ID)
        }
    })
  })

  pool1.on('error', err => {
    console.log("EROR>>"+err);
  })

  });
}
