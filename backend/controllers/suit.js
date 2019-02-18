const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dbConfig = require('../config/db-config');
var prop = require('../config/backend-property');

var logger = require('../config/winston');

var config = dbConfig.dbParameters;

// const SALT_WORK_FACTOR = 10;
const JWT_SECRET_STRING = dbConfig.JWT_SECRET_STRING;

exports.verifyExtLink = (req, res, next) => {

  logger.info(`API /verifyExtLink - ${req.originalUrl} - ${req.ip} `);
  let rsp_code;

  try {
    const token = req.headers.authorization.split(" ")[1];
    const pid = req.body.pid;

    // 1. Verify token till life
    jwt.verify(token, JWT_SECRET_STRING, function (err, decoded) {

      if (err) {
        //  logger.error(`${pid} was error: `+err);
         rsp_code = '205';
        return res.status(401).json(
          {
            code: rsp_code,
            msg: prop.getRespMsg(rsp_code)
          }
          );
      }

      logger.debug(` verify correct PID  - ${pid} `);
      //2. Verify correct PID
      if (decoded.USERID === pid) {
        rsp_code = '000';
        logger.info(`*** PID  - ${prop.getRespMsg(rsp_code)} `);

        return res.status(200).json({
          code: rsp_code,
          msg: prop.getRespMsg(rsp_code),
          USERDATA: {
            Cust_Code: pid
            , First_Name_T: 'Mr.' + pid
            , Last_Name_T: 'XXX'

            , accounts: [{ acc: pid + '_1' }, { acc: pid + '_2' }]
          }
        });
      } else {

        rsp_code = '204';

        return res.status(405).json({
          code: rsp_code,
          msg: prop.getRespMsg(rsp_code)
        });
      }

    });
  } catch (error) {
    console.log('verify fail>>' + JSON.stringify(error));
    return res.status(401).json({ message: 'Auth failed!' });
  }
}

exports.suitEvaluate = (req, res, next) => {

  logger.info(`API /suitEvaluate - ${req.originalUrl} - ${req.ip} `);
  let rsp_code;
  var pid = req.body.pid;
  var score = req.body.score || '0';
  var ans = req.body.ans || '';

  console.log(` PID:${pid}`)
  console.log(` SCORE:${score}`)
  console.log(` ANS->>:${ans}`)

  try {

    return res.status(200).json({
      code: rsp_code,
      msg: prop.getRespMsg(rsp_code),
      USERDATA: {
        Cust_Code: pid

      }
    });

} catch (error) {
  console.log('Suit Evaluate fail>>' + JSON.stringify(error));
  return res.status(401).json({ message: 'Suit Evaluate failed!' });
}

}

function getCustomerData(_pid) {

  logger.info(` getCustomerData - ${_pid} `);

  let queryStr = `SELECT a.* ,b.FIRST_NAME + ' ' + b.LAST_NAME AS FULLNAME
                  FROM [MIT_USERS] a
                  LEFT JOiN MIT_EMPLOYEE b ON a.USERID = b.USERID
                 WHERE a.STATUS = 'A'  AND CURRENT_TIMESTAMP < ISNULL(EXPIRE_DATE,CURRENT_TIMESTAMP+1)
                 AND MIT_GROUP <>'C1'
                 AND LoginName=@id
                 `;
  const sql = require('mssql')

  sql.connect(config).then(pool => {

    // Query
    return pool.request()
      .input('id', sql.VarChar(50), _pid)
      .query(queryStr)
  })
    .then(user => {

      console.log();

      if (!user) {
        logger.error(`API /Login Auth failed. 1 - ${req.originalUrl} - ${req.ip} `);
        sql.close();

        return { user: null };
      } else {
        sql.close();
        return { user: user };
      }
    })

  sql.on("error", err => {
    err.message
    sql.close();
    logger.error(`API /Login error - ${req.originalUrl} - ${req.ip} - ${err} `);
    return { error: err.message };
  });
}
