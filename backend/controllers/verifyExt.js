const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dbConfig = require('../config/db-config');
var prop = require('../config/backend-property');

var logger = require('../config/winston');

var config = dbConfig.dbParameters;

// const SALT_WORK_FACTOR = 10;
const JWT_SECRET_STRING = dbConfig.JWT_SECRET_STRING;

exports.verifyExtLink = (req,res,next)=>{

  logger.info( `API /verifyExtLink - ${req.originalUrl} - ${req.ip} `);
  let rsp_code ;

  try{
    // logger.debug(`headers =` + JSON.stringify(req.headers));

    const token = req.headers.authorization.split(" ")[1];
    const pid = req.body.pid;

    logger.debug(`pid = ${pid}`);
    logger.debug(` token = ${token}`);

    // 1. Verify token till life
    jwt.verify(token, JWT_SECRET_STRING, function(err, decoded) {

      if (err) {
       logger.info(`${pid} was error: `+err);
       return res.status(401).json({message: 'Auth failed!'});
      }

      logger.debug( ` verify correct PID  - ${pid} `);
      //2. Verify correct PID
      if (decoded.USERID===pid){
        rsp_code = '000';
        logger.info( `*** PID  - ${prop.getRespMsg(rsp_code)} `);

       return res.status(200).json({
          code: rsp_code,
          msg: prop.getRespMsg(rsp_code)
        });
      }else{

        rsp_code = '204';

       return res.status(405).json({
          code: rsp_code,
          msg: prop.getRespMsg(rsp_code)
        });
      }

    });
  }catch(error){
    console.log('S3 ' +error);
   return  res.status(401).json({message: 'Auth failed!'});
  }
}
