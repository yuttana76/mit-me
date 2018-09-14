const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const router = express.Router();
const SALT_WORK_FACTOR = 10;

const TOKEN_SECRET_STRING = 'secret_this_should_be_longer';
const TOKEN_EXPIRES = '1h';

var config = {
  user: "mftsuser",
  password: "P@ssw0rd",
  server: "192.168.10.48",
  database: "MFTS"
};

router.post("/register",(req,res,next)=>{
  // console.log('API /register>>', req.body.email,' ;pwd>>', req.body.password);
  var _userName = req.body.email
  bcrypt.hash(req.body.password, SALT_WORK_FACTOR)
  .then(hash =>{

      var queryStr = `INSERT INTO   [MFTS].[dbo].[MIT_USERS] VALUES('${_userName}','${hash}');`;
      var sql = require("mssql");

      sql.connect(config, err => {
        new sql.Request().query(queryStr, (err, result) => {
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
            sql.close();
        })
      });

      sql.on("error", err => {
        // ... error handler
        res.status(500).json({
          error:err
        });
        sql.close();
      });
  });

});

router.post("/login", (req, res, next) => {
   console.log('API /login>>', req.body.email,' ;pwd>>', req.body.password);

  let fetchedUser;
  let _userName = req.body.email
  let queryStr = `select * FROM [MFTS].[dbo].[MIT_USERS] WHERE EMAIL='${_userName}'`;
  const sql = require('mssql')

sql.connect(config).then(pool => {
    // Query
    return pool.request()
    .query(queryStr)})
    .then(user => {

      if(!user){
        return res.status(401).json({
          message: 'Auth failed.'
        });
      } else {
         //Return
         fetchedUser = user;
         return bcrypt.compare(req.body.password,user.recordset[0].PASSWD);
      }

      sql.close();
    })
    .then(result =>{

      if(!result){
        return res.status(401).json({
          message: 'Auth failed.'
        });
      }

      //Generate token
      const token = jwt.sign(
        {email: fetchedUser.email,userId: fetchedUser._id},
        TOKEN_SECRET_STRING,
        { expiresIn: TOKEN_EXPIRES}
      );

      // const token = jwt.sign(
      //   {email: fetchedUser.email,userId: fetchedUser._id},
      //   "secret_this_should_be_longer",
      //   { expiresIn: "1h"}
      // );

      //Return
      res.status(200).json({
        token: token,
        expiresIn: 3600//3600 = 1h
      });
      sql.close();
    })
    .catch(err => {
        return res.status(401).json({
          message: 'Auth failed.'
        });

        sql.close();
    })

  sql.on("error", err => {
    // ... error handler
    return res.status(401).json({
      message: 'Auth failed.'
    });
    sql.close();
  });
});

module.exports = router;
