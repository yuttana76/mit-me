const express = require("express");

const router = express.Router();
/*
  config for your database
  Provider=SQLOLEDB.1;Password=P@ssw0rd;Persist Security Info=True;User ID=mftsuser;Initial Catalog=MFTS;Data Source=192.168.10.48;"
*/
var config = {
  user: "mftsuser",
  password: "P@ssw0rd",
  server: "192.168.10.48",
  database: "MFTS"
};

// REST 1
router.get("", (req, res, next) => {
  const posts = [
    {
      id: "fsfsf12s2f",
      title: "First",
      content: "First content"
    },
    {
      id: "fsfsf12s2f2",
      title: "Second",
      content: "Second content"
    }
  ];

  res.status(200).json({
    message: "Connex fetched successfully!",
    posts: posts
  });
});

// REST 2
router.get("/AccountInfo", (req, res, next) => {
  var sql = require("mssql");

  // connect to your database
  sql.connect(
    config,
    function(err) {
      if (err) console.log(err);

      // create Request object
      var request = new sql.Request();

      // query to the database and get the records
      request.query("select * from [MFTS].[dbo].[Account_Info]", function(
        err,
        recordset
      ) {
        if (err) console.log(err);

        // send records as a response
        res.send(recordset);
        sql.close();
      });
    }
  );
});

// REST 3 ES6 Tagged template literals
router.get("/Fund", (req, res, next) => {
  var sql = require("mssql");

  sql
    .connect(config)
    .then(() => {
      return sql.query`select * from [MFTS].[dbo].[MFTS_Fund]`;
      //return sql.query`select * from mytable where id = ${value}`
    })
    .then(result => {
      // console.dir(result)
      res.status(200).json({
        message: "Connex get Fund successfully!",
        result: result
      });
      sql.close();
    })
    .catch(err => {
      // ... error checks
      console.log(err);
    });

  sql.on("error", err => {
    // ... error handler
    console.log(err);
  });

});

//Callbacks
router.get("/FundCallbacks", (req, res, next) => {

  const tableName = '[MFTS].[dbo].[MFTS_Fund]';
  var queryStr = 'select * from [MFTS].[dbo].[MFTS_Fund]';

  var sql = require("mssql");
  var date1 = '2016-01/01';
  var date2= '2016-12-31';
  sql.connect(config, err => {
    // ... error checks

    // Query
    new sql.Request().query(queryStr, (err, result) => {

      // ... error checks
        if(err){
          console.log('Was err !!!' + err);
          sql.close();
        }

        res.status(200).json({
          message: "Connex get Fund successfully!",
          result: result
        });
        sql.close();
    })

  });

  sql.on("error", err => {
    // ... error handler
    console.log('sql.on !!!' + err);
    sql.close();
  });
});


//Callbacks
router.get("/Account", (req, res, next) => {

  const Card_Type = req.query.Card_Type;
  const param2 = req.query.param2;
  //console.log( `param 1 = ${param1} ; param 2 = ${param2}` );

  var queryStr = `select top 100 \
  A.Ref_No,  a.Account_No, a.Amc_Id, a.Client_Type, a.Holder_Id, a.Title_Name_T,  a.First_Name_T,  a.Last_Name_T,  a.Sex,  a.Email,  a.Tax_No,\
  b.Cust_Code,  b.Card_Type,  b.Title_Name_T,  b.First_Name_T,  b.Last_Name_T\
   FROM [MFTS].[dbo].[MFTS_Account] A,[MFTS].[dbo].[Account_Info] B\
   WHERE A.Account_No = B.Cust_Code \
   AND b.Card_Type='${Card_Type}' `;

  var sql = require("mssql");
  // var date1 = '2016-01/01';
  // var date2= '2016-12-31';
  sql.connect(config, err => {
    // ... error checks

    // Query
    new sql.Request().query(queryStr, (err, result) => {

      // ... error checks
        if(err){
          console.log('Was err !!!' + err);
          res.status(201).json({
            message: err,
          });
          sql.close();
        }

        res.status(200).json({
          message: "Connex get Fund successfully!",
          length: result.recordsets[0].length,
          result: result
        });
        sql.close();
    })

  });

  sql.on("error", err => {
    // ... error handler
    console.log('sql.on !!!' + err);
    sql.close();
  });
});

module.exports = router;
