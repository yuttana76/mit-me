
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// var config = {
//   user: "mftsuser",
//   password: "P@ssw0rd",
//   server: "192.168.10.48",
//   database: "MFTS"
// };

var config = {
  user: process.env.AUTH_SRV_USER,
  password: process.env.AUTH_SRV_PWD,
  server: process.env.AUTH_SRV_IP,
  database: process.env.AUTH_SRV_db
};

const SALT_WORK_FACTOR = 10;

const TOKEN_SECRET_STRING = process.env.JWT_KEY;
const TOKEN_EXPIRES = '1h';

exports.createUser = (req,res,next)=>{
  // console.log('API /register>>', req.body.email,' ;pwd>>', req.body.password);
  var _userName = req.body.email
  bcrypt.hash(req.body.password, SALT_WORK_FACTOR)
  .then(hash =>{

      var queryStr = `INSERT INTO   [MFTS].[dbo].[MIT_USERS] VALUES('${_userName}','${hash}');`;
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
        sql.close();
        res.status(500).json({
          error:err
        });

      });
  });
}

exports.userLogin = (req, res, next) => {
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
       return res.status(401).json({
         message: 'Auth failed. 2'
       });
     }

     //Generate token
     const token = jwt.sign(
       {email: fetchedUser.recordset[0].EMAIL},
       TOKEN_SECRET_STRING,
       { expiresIn: TOKEN_EXPIRES},
     );
     //Return
     res.status(200).json({
       token: token,
       expiresIn: 3600,//3600 = 1h
       userData: fetchedUser.recordset[0].EMAIL,
     });
     sql.close();
   })
   .catch(err => {
       // NOT FOUND USER
       sql.close();
       return res.status(401).json({
         message: 'Auth failed. 3'
       });
   })

 sql.on("error", err => {
   // ... error handler
   sql.close();
   return res.status(401).json({
     message: 'Auth failed. 4'
   });

 });
}
