
const bcrypt = require('bcryptjs');
var logger = require('../config/winston');
var V_RESULT;

const mpamConfig = require('../config/mpam-config');
var config = mpamConfig.dbParameters;

exports.splitRiskSuit = (req,res,next)=>{

  logger.info( `API /splitRiskSuit - ${req.originalUrl} - ${req.ip} `);
  console.log('API /splitRiskSuit');

  var queryStr = `
  select a.*
  from MIT_Suit_TMP a
  `;

  var sql = require("mssql");

  const pool1 = new sql.ConnectionPool(config, err => {
  pool1.request().query(queryStr, (err, result) => {

  // sql.connect(config, err => {
  //   new sql.Request().query(queryStr, (err, result) => {
      // sql.close();
        if(err){
          res.status(500).json({
            error:err
          });

        } else {

          //CALL FUNCTION
         // updateQN(result);
          V_RESULT =  result.recordset;
          updateQN(V_RESULT);

          res.status(200).json({
              message: 'Risk Transform success',
              result: result
          });

        }
    })
  });

  pool1.on('error', err => {
    // ... error handler
    console.log("EROR>>"+err);
    res.status(500).json({
      error:err
    });

  })

  // sql.on("error", err => {

  //   logger.error( `API /register - ${err}`);

  //   sql.close();
  //   res.status(500).json({
  //     error:err
  //   });
  // });

}

function updateQN(obj){
  //  console.log('V_RESULT >>' , JSON.stringify(obj) );

  var sql = require("mssql");
  // sql2.connect(config, err => {

  const pool1 = new sql.ConnectionPool(config, err => {
  var x =0;
  for(var i = 0; i < obj.length;i++){

    (function(j){

      // INSERT INTO MFTS_Suit (Suit_Id,Account_No,Document_Date,Series_Id,Active_Flag,Create_By,Create_Date)
      // VALUES()
      var Account_No =  obj[j].Account_No;
      var risk_level =  obj[j].risk_level;

      // INSERT INTO MFTS_Suit_Detail (Suit_Id,QId,CId)
      var jsonContent = JSON.parse(obj[j].suitability_form);
      var suitNo1 = jsonContent.suitNo1;
      var suitNo2 = jsonContent.suitNo2;
      var suitNo3 = jsonContent.suitNo3;
      var suitNo4 = jsonContent.suitNo4;
      var suitNo5 = jsonContent.suitNo5;
      var suitNo6 = jsonContent.suitNo6;
      var suitNo7 = jsonContent.suitNo7;
      var suitNo8 = jsonContent.suitNo8;
      var suitNo9 = jsonContent.suitNo9;
      var suitNo10 = jsonContent.suitNo10;
      var suitNo11 = jsonContent.suitNo11;
      var suitNo12 = jsonContent.suitNo12;

      if (suitNo1){
        x++;
      //-------------


      var queryStr = `
      UPDATE  MIT_Suit_TMP
      SET Q1='${suitNo1}',Q2='${suitNo2}',Q3='${suitNo3}',Q4='${suitNo4}',Q5='${suitNo5}',Q6='${suitNo6}',Q7='${suitNo7}',Q8='${suitNo8}'
      ,Q9='${suitNo9}',Q10='${suitNo10}',Q11='${suitNo11}',Q12='${suitNo12}'
      WHERE Account_No='${Account_No}'
      `;

      pool1.request().query(queryStr, (err, result) => {

          if(err){
            console.log(` ${Account_No} Insert ERROR >> ${queryStr}  MSG>>`,JSON.stringify(err) );
          } else {

            console.log(` ${x} Insert successful>> `,JSON.stringify(result));
          }
      })
      //-----------
    }

    })(i);
  }

});

sql.on("error", err => {

  logger.error( `API /register - ${err}`);
  sql.close();
  res.status(500).json({
    error:err
  });
});

}

// function fncGetMTFS_Choice(jsonObj) {

//   var fncName = 'fncGetMTFS_Choice';
//   var jsonContent = JSON.parse(jsonObj);

//   var queryStr = `
//   WITH OrderedOrders AS
//   (
//   SELECT ROW_NUMBER() OVER (ORDER BY QId) AS RowNumber
//          ,[CId]
//         ,[QId]
//         ,[Score]
//         ,[Description]
//         ,[Create_By]
//         ,[Create_Date]
//         ,[Modify_By]
//         ,[Modify_Date]

//     FROM [MFTS].[dbo].[MFTS_Suit_Question_Choice]
//     where QId =${jsonContent.QId}
//   )
//   SELECT  RowNumber, *
//   FROM OrderedOrders
//   WHERE RowNumber =${jsonContent.CId}
//   `;

//   const sql = require('mssql')
//   const pool1 = new sql.ConnectionPool(config, err => {

//     pool1.request() // or: new sql.Request(pool1)
//     .query(queryStr, (err, result) => {
//         // ... error checks
//         if(err){
//           console.log( fncName +' Quey db. Was err !!!' + err);
//           res.status(404).json({
//             message: err,
//           });
//         }else {
//           return `{"QId":"${jsonContent.QId}", "CId":"${result.recordset[0].CId}"}`;
//         }
//     })
//   })

//   pool1.on('error', err => {
//     // ... error handler
//     console.log("EROR>>"+err);
//   })

// }
