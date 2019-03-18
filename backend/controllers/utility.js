
const bcrypt = require('bcryptjs');
const dbConfig = require('../config/db-config');
var logger = require('../config/winston');
var config = dbConfig.dbParameters;

// const SALT_WORK_FACTOR = 10;
const SALT_WORK_FACTOR = dbConfig.SALT_WORK_FACTOR;


exports.autoGeneratePassword = (req,res,next)=>{

  logger.info( `API /autoGeneratePassword - ${req.originalUrl} - ${req.ip} - ${req.body.privtecode} - ${req.body.password}`);

  var _privtecode = dbConfig.UTIL_PRIVATE_CODE;
  var _password = req.body.password;

  if (_privtecode === req.body.privtecode ){

    logger.info( `API /autoGeneratePassword code Correct!  - ${req.originalUrl} - ${req.ip} `);
    bcrypt.hash(_password, SALT_WORK_FACTOR)
    .then(hash =>{

        var queryStr = `
          UPDATE MIT_USERS SET PASSWD='${hash}'
          WHERE MIT_GROUP='C1'
        `;

        var sql = require("mssql");

        sql.connect(config, err => {
          new sql.Request().query(queryStr, (err, result) => {
            sql.close();
              if(err){
                res.status(500).json({
                  error:err
                });

              } else {
                logger.info( `API /autoGeneratePassword successful  - ${req.originalUrl} - ${req.ip} - ${req.body.privtecode}`);
                res.status(200).json({
                  message: 'User upated',
                  result: result
                });
              }

          })

        });

        sql.on("error", err => {

          logger.error( `API /register - ${err}`);

          sql.close();
          res.status(500).json({
            error:err
          });
        });
    });
  } else {
    logger.warn( `API /autoGeneratePassword code Incorrect!  - ${req.originalUrl} - ${req.ip} - ${req.body.privtecode}`);
    res.status(400).json({
    });
  }

}

exports.getDateTime = (req,res,next)=>{

  var date = new Date();

  var hour = date.getHours();
  hour = (hour < 10 ? "0" : "") + hour;

  var min  = date.getMinutes();
  min = (min < 10 ? "0" : "") + min;

  var sec  = date.getSeconds();
  sec = (sec < 10 ? "0" : "") + sec;

  var year = date.getFullYear();

  var month = date.getMonth() + 1;
  month = (month < 10 ? "0" : "") + month;

  var day  = date.getDate();
  day = (day < 10 ? "0" : "") + day;

  return day +"/"+ month +"/"+ year + "  " + hour + ":" + min ;

  // return year + ":" + month + ":" + day + ":" + hour + ":" + min + ":" + sec;

}
