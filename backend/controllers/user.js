
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dbConfig = require('../config/db-config');

var logger = require('../config/winston');

var config = dbConfig.dbParameters;

// const SALT_WORK_FACTOR = 10;
const SALT_WORK_FACTOR = dbConfig.SALT_WORK_FACTOR;

const JWT_SECRET_STRING = dbConfig.JWT_SECRET_STRING;
const JWT_EXPIRES = dbConfig.JWT_EXPIRES;
const TOKEN_EXPIRES_SEC = 3600;


exports.userLogin = (req, res, next) => {

  let fetchedUser;
  let _userName = req.body.email
  logger.info( `API /Login - ${req.originalUrl} - ${req.ip} - ${_userName}`);

  let queryStr = `SELECT a.* ,b.FIRST_NAME + ' ' + b.LAST_NAME AS FULLNAME
                  FROM [MIT_USERS] a
                  LEFT JOiN MIT_EMPLOYEE b ON a.USERID = b.USERID
                 WHERE a.STATUS = 'A'  AND CURRENT_TIMESTAMP < ISNULL(EXPIRE_DATE,CURRENT_TIMESTAMP+1)
                 AND MIT_GROUP <>'C1'
                 AND LoginName='${_userName}'`;
  const sql = require('mssql')

 sql.connect(config).then(pool => {
    // Query
    return pool.request()
    .query(queryStr)})
    .then(user => {

      console.log();

      if(!user){
       logger.error( `API /Login Auth failed. 1 - ${req.originalUrl} - ${req.ip} `);
       sql.close();
        return res.status(401).json({
          message: 'Auth failed. 1'
        });
      } else {
         sql.close();
         fetchedUser = user;
         return bcrypt.compare(req.body.password,user.recordset[0].PASSWD);
      }

    })
    .then(result =>{
     // INCORRECT PWD.
      if(!result){
        logger.info( `API /Login Auth failed by incorrect password - ${req.originalUrl} - ${req.ip} - ${_userName} `);
        return res.status(401).json({
          message: 'Auth failed. by incorrect password'
        });
      }

      //Generate token
      const token = jwt.sign(
        {USERID: fetchedUser.recordset[0].USERID},
        JWT_SECRET_STRING,
        { expiresIn: JWT_EXPIRES},
      );
      //Return
      res.status(200).json({
        token: token,
        expiresIn: TOKEN_EXPIRES_SEC,//3600 = 1h
        userData: fetchedUser.recordset[0].LoginName,
        LoginName: fetchedUser.recordset[0].LoginName,
        USERID: fetchedUser.recordset[0].USERID,
        FULLNAME: fetchedUser.recordset[0].FULLNAME,
        DEP_CODE: fetchedUser.recordset[0].DEP_CODE,
        MIT_GROUP: fetchedUser.recordset[0].MIT_GROUP,
      });
      sql.close();
    })
    .catch(err => {
        // NOT FOUND USER
        logger.warn( `API /Login Auth failed by no user - ${req.originalUrl} - ${req.ip} - ${_userName} `);
        sql.close();
        return res.status(401).json({
          message: 'Auth failed. by user'
        });
    })

  sql.on("error", err => {
   err.message
    // ... error handler
    sql.close();
    logger.error( `API /Login error - ${req.originalUrl} - ${req.ip} - ${err} `);
    return res.status(401).json({
      message: 'Auth failed. 4'
    });

  });
 }

exports.createUser = (req,res,next)=>{

  logger.info( `API /register - ${req.originalUrl} - ${req.ip} - ${req.body.email}`);

  var _userName = req.body.email
  bcrypt.hash(req.body.password, SALT_WORK_FACTOR)
  .then(hash =>{

      var queryStr = `INSERT INTO   [MFTS].[dbo].[MIT_USERS] (LoginName,USERID,PASSWD,EMAIL,STATUS,CREATEBY,CREATEDATE)
                      VALUES('${_userName}','${_userName}','${hash}','${_userName}','A','WEB-APP',GETDATE());`;

      var sql = require("mssql");

      sql.connect(config, err => {
        new sql.Request().query(queryStr, (err, result) => {
          sql.close();
            if(err){
              res.status(500).json({
                error:err
              });

            } else {
              res.status(200).json({
                message: 'User created',
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
}

exports.resetPassword = (req,res,next)=>{

  logger.info( `API /resetPassword - ${req.originalUrl} - ${req.ip} - ${req.body.LoginName}`);
  bcrypt.hash(req.body.password, SALT_WORK_FACTOR)
  .then(hash =>{

      var queryStr = `UPDATE [MFTS].[dbo].[MIT_USERS]
                      SET PASSWD='${hash}',UPDATEBY='WEB-APP',UPDATEDATE=GETDATE()
                      WHERE LoginName='${req.body.LoginName}'`;

      var sql = require("mssql");

      sql.connect(config, err => {
        new sql.Request().query(queryStr, (err, result) => {
          sql.close();
            if(err){
              res.status(500).json({
                error:err
              });

            } else {
              res.status(200).json({
                message: 'User updated',
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
}

exports.getUserLevel = (req, res, next) => {

  var _userId = req.query.userId || '';
  var _appId = req.query.appId || '';

  // console.log(' getUserLevel() _userId>>' + _userId + ' ;_appId>>' + _appId );
  logger.info( `API /UserLevel - ${req.originalUrl} - ${req.ip} - ;USERID=${_userId}  ;APPID=${_appId}`);

  var fncName = 'getUserLevel';
  var queryStr = `
    SELECT * from MIT_Users_Level
    WHERE STATUS = 'A'  AND CURRENT_TIMESTAMP < ISNULL(EXPIRE_DATE,CURRENT_TIMESTAMP+1)
    AND USERID = '${_userId}'
    AND APPID = '${_appId}'
    `;

  const sql = require('mssql')
  const pool1 = new sql.ConnectionPool(config, err => {
    pool1.request() // or: new sql.Request(pool1)
    .query(queryStr, (err, result) => {
        // ... error checks
        if(err){
          console.log( fncName +' Quey db. Was err !!!' + err);
          res.status(201).json({
            message: err,
          });
        }else {
          res.status(200).json({
            message: fncName + "Quey db. successfully!",
            result: result.recordset
          });
        }
    })
  })

  pool1.on('error', err => {
    // ... error handler
    console.log("EROR>>"+err);
  })
}


exports.getUserInfo = (req, res, next) => {

  var _userId = req.query.userId || '';

  console.log('getUserInfo() _userId>>' + _userId );

  var fncName = 'getUserInfo';
  var queryStr = `
  SELECT USERID,EMAIL,DEP_CODE
  FROM MIT_USERS
  WHERE USERID='${_userId}'
    `;

  const sql = require('mssql')
  const pool1 = new sql.ConnectionPool(config, err => {
    pool1.request() // or: new sql.Request(pool1)
    .query(queryStr, (err, result) => {
        // ... error checks
        if(err){
          console.log( fncName +' Quey db. Was err !!!' + err);
          res.status(201).json({
            message: err,
          });
        }else {
          res.status(200).json({
            message: fncName + "Quey db. successfully!",
            result: result.recordset
          });
        }
    })
  })

  pool1.on('error', err => {
    // ... error handler
    console.log("EROR>>"+err);
  })
}


exports.searchUser = (req, res, next) => {

  logger.info( `API /searchUser - ${req.originalUrl} - ${req.ip}`);

  var fncName ='searchUser';
  var numPerPage = parseInt(req.query.pagesize, 10) || 10;
  var page = parseInt(req.query.page, 10) || 1;

  var firstName = req.query.firstName || false;
  var lastName = req.query.lastName || false;
  var email = req.query.email || false;
  var depCode = req.query.depCode || false;
  var whereCond = "";

  if (firstName !== false) {
    whereCond = whereCond + `AND First_Name like N'%${firstName}%'`;
  }
  if (lastName !== false) {
    whereCond = whereCond +`AND Last_Name like N'%${lastName}%'`;
  }
  if (email !== false) {
    whereCond =  whereCond + `AND EMAIL = N'${email}'`;
  }
  if (depCode !== false) {
    whereCond = whereCond + `AND B.DEP_CODE ='${depCode}'`;
  }

  var queryStr = `  SELECT * FROM (
        SELECT  ROW_NUMBER() OVER(ORDER BY First_Name) AS NUMBER
        ,A.LoginName,A.[STATUS],A.EMAIL,A.USERID
        ,B.First_Name,B.Last_Name,B.DEP_CODE ,B.Position,B.Branch
        , C.NAME AS DEP_NAME
        FROM MIT_USERS A,MIT_EMPLOYEE B
        LEFT JOIN MIT_DEPARTMENT C ON B.DEP_CODE=c.DEP_CODE
        WHERE  A.USERID=B.UserId
        ${whereCond}
    ) AS TBL
    WHERE NUMBER BETWEEN ((${page} - 1) * ${numPerPage} + 1) AND (${page} * ${numPerPage})
    ORDER BY First_Name`;

  const sql = require("mssql");
  const pool1 = new sql.ConnectionPool(config, err => {
    pool1
      .request() // or: new sql.Request(pool1)
      .query(queryStr, (err, result) => {
        // ... error checks
        if (err) {
          console.log(fncName + " Quey db. Was err !!!" + err);
          res.status(201).json({
            message: err
          });
        } else {
          res.status(200).json({
            message: fncName + "Quey db. successfully!",
            result: result.recordset
          });
        }
      });
  });
  pool1.on("error", err => {
    // ... error handler
    console.log("EROR>>" + err);
  });
};



exports.ExeUserEmp = (req, res, next) => {

  // console.log("ExeWIPCustomer>> ");
  var o2x = require('object-to-xml');
  var fncName = "ExeInsertUserEmp";
  var mode = req.body.mode || 'NEW';

  console.log('Welcome ' +fncName + '  ;mode=' + mode);
  console.log('USER>>',JSON.stringify(req.body.user));


  var userObj = JSON.parse(req.body.user);
  // var ceAddressObj = JSON.parse(req.body.ceAddress);
  // var ofAddressObj = JSON.parse(req.body.ofAddress);
  // var maAddressObj = JSON.parse(req.body.maAddress);

  console.log(` empDate=${userObj.empDate}   ;quitDate=${userObj.quitDate}`);

  // var PASSWD = userObj.PASSWD;
  // userObj.EmpId = userObj.LoginName
  // userObj.userId = userObj.LoginName
  // userObj.PASSWD = userObj.LoginName

  // console.log('PASSWD>>', userObj.PASSWD);

  bcrypt.hash(userObj.PASSWD, SALT_WORK_FACTOR)
  .then(hash =>{

      userObj.PASSWD =hash;


      // console.log('PASSWD (hash)>>',userObj.PASSWD);

      const sql = require("mssql");
      const pool1 = new sql.ConnectionPool(config, err => {
        pool1.request()
          .input('userXML', sql.Xml,  o2x(userObj))
          // .input('ceAddressXML', sql.Xml,  o2x(ceAddressObj))
          // .input('ofAddressXML', sql.Xml,  o2x(ofAddressObj))
          // .input('maAddressXML', sql.Xml,  o2x(maAddressObj))
          .input('mode', sql.VarChar(20),  mode)
          .output('empID', sql.VarChar(20))
          // .output('message', sql.VarChar(500))
          .execute('[dbo].[MIT_EXEC_User_EMP]', (err, result) => {

            console.log('err>>',JSON.stringify(err));

            if (err) {
              console.log(fncName + " Quey db. Was err !!!" + JSON.stringify(result));

              res.status(201).json({
                message: err
                // result: result.output
              });
            } else {
              console.log(fncName + " Result>>" + JSON.stringify(result));
              res.status(200).json({
                message: fncName + "Quey db. successfully!",
                result: result.output
              });
            }
          });
      });
      pool1.on("error", err => {
        // ... error handler
        console.log("EROR>>" + err);
      });

  });
};



exports.getUserLevelByUserId = (req, res, next) => {

  var _userId = req.query.userId || '';

  // console.log(' getUserLevel() _userId>>' + _userId + ' ;_appId>>' + _appId );
  logger.info( `API /userLevelByUserId - ${req.originalUrl} - ${req.ip} - ;USERID=${_userId} `);

  var fncName = 'getUserLevel';
  var queryStr = `
    SELECT B.AppName,A.*
    FROM MIT_USERS_LEVEL A
    LEFT JOIN MIT_ApplicationInfo  B ON A.AppId=B.AppId
    WHERE A.USERID = '${_userId}'
    `;

  const sql = require('mssql')
  const pool1 = new sql.ConnectionPool(config, err => {
    pool1.request() // or: new sql.Request(pool1)
    .query(queryStr, (err, result) => {
        // ... error checks
        if(err){
          console.log( fncName +' Quey db. Was err !!!' + err);
          res.status(201).json({
            message: err,
          });
        }else {
          res.status(200).json({
            message: fncName + "Quey db. successfully!",
            result: result.recordset
          });
        }
    })
  })

  pool1.on('error', err => {
    // ... error handler
    console.log("EROR>>"+err);
  })
}


exports.deleteUserLevelByAppId = (req, res, next) => {

  var fncName = 'deleteUserLevelByAppId';
  var _userId = req.params.userId || '';
  var _appId = req.params.appId || '';

  logger.info( `API /deleteUserLevelByAppId - ${req.originalUrl} - ${req.ip} - ;USERID=${_userId}  ;APPID=${_appId}`);

  var queryStr = `  DELETE FROM MIT_USERS_LEVEL
                    WHERE USERID = '${_userId}' AND AppId ='${_appId}'
    `;

  const sql = require('mssql')
  const pool1 = new sql.ConnectionPool(config, err => {
    pool1.request() // or: new sql.Request(pool1)
    .query(queryStr, (err, result) => {
        // ... error checks
        if(err){
          console.log( fncName +' Quey db. Was err !!!' + err);
          res.status(201).json({
            message: err,
          });
        }else {
          res.status(200).json({
            message: fncName + "Quey db. successfully!",
            result: result.recordset
          });
        }
    })
  })
  pool1.on('error', err => {
    console.log("EROR>>"+err);
  })
}


exports.addUserLevel = (req,res,next)=>{

  logger.info( `API /addUserLevel - ${req.originalUrl} - ${req.ip} - ${req.body.email}`);

  var userId = req.body.userId;
  var appId = req.body.appId;
  var level = req.body.level;
  var remark = req.body.remark;
  var status = req.body.status;
  var expireDate = req.body.expireDate || '';
  var createBy = req.body.createBy || 'SYS';

      var queryStr = `INSERT INTO  MIT_USERS_LEVEL (USERID,AppId,Level,Remark,STATUS,EXPIRE_DATE,CREATEBY,CREATEDATE)
                      VALUES('${userId}','${appId}','${level}','${remark}','${status}','${expireDate}','${createBy}',GETDATE());`;

      var sql = require("mssql");
      sql.connect(config, err => {
        new sql.Request().query(queryStr, (err, result) => {
          sql.close();
            if(err){
              res.status(500).json({
                error:err
              });

            } else {
              res.status(200).json({
                message: 'User created',
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
}

//******************* */

exports.getUserGroupByUserId = (req, res, next) => {

  var _userId = req.query.userId || '';
  logger.info( `API /userGroupByUserId - ${req.originalUrl} - ${req.ip} - ;USERID=${_userId} `);
  var fncName = 'getUserGroupByUserId';
  var queryStr = `
    SELECT B.GroupName,A.*
    FROM MIT_USERS_GROUP A
    LEFT JOIN MIT_GROUP  B ON A.GroupId = B.GroupId
    WHERE A.USERID = '${_userId}'
    `;

  const sql = require('mssql')
  const pool1 = new sql.ConnectionPool(config, err => {
    pool1.request() // or: new sql.Request(pool1)
    .query(queryStr, (err, result) => {
        // ... error checks
        if(err){
          console.log( fncName +' Quey db. Was err !!!' + err);
          res.status(201).json({
            message: err,
          });
        }else {
          res.status(200).json({
            message: fncName + "Quey db. successfully!",
            result: result.recordset
          });
        }
    })
  })
  pool1.on('error', err => {
    console.log("EROR>>"+err);
  })
}

exports.deleteUserGroupByGroupId = (req, res, next) => {

  var fncName = 'deleteUserGroupByGroupId';
  var _userId = req.params.userId || '';
  var _groupId = req.params.groupId || '';
  logger.info( `API /deleteUserGroupByGroupId - ${req.originalUrl} - ${req.ip} - ;USERID=${_userId}  ;_groupId=${_groupId}`);

  var queryStr = `  DELETE FROM MIT_USERS_GROUP
                    WHERE USERID = '${_userId}' AND GroupId ='${_groupId}'
    `;

  const sql = require('mssql')
  const pool1 = new sql.ConnectionPool(config, err => {
    pool1.request() // or: new sql.Request(pool1)
    .query(queryStr, (err, result) => {
        // ... error checks
        if(err){
          console.log( fncName +' Quey db. Was err !!!' + err);
          res.status(201).json({
            message: err,
          });
        }else {
          res.status(200).json({
            message: fncName + "Quey db. successfully!",
            result: result.recordset
          });
        }
    })
  })
  pool1.on('error', err => {
    console.log("EROR>>"+err);
  })
}


exports.addUserGroup = (req,res,next)=>{

  logger.info( `API /addUserGroup - ${req.originalUrl} - ${req.ip} - ${req.body.email}`);

  var userId = req.body.userId;
  var groupId = req.body.groupId;
  var remark = req.body.remark;
  var status = req.body.status;
  var expireDate = req.body.expireDate || '';
  var createBy = req.body.createBy || 'SYS';

      var queryStr = `INSERT INTO  MIT_USERS_GROUP (USERID,GroupId,Remark,STATUS,EXPIRE_DATE,CREATEBY,CREATEDATE)
                      VALUES('${userId}','${groupId}','${remark}','${status}','${expireDate}','${createBy}',GETDATE());`;

      var sql = require("mssql");
      sql.connect(config, err => {
        new sql.Request().query(queryStr, (err, result) => {
          sql.close();
            if(err){
              res.status(500).json({
                error:err
              });

            } else {
              res.status(200).json({
                message: 'User created',
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
}
