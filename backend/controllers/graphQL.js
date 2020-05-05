const mpamConfig = require('../config/mpam-config');
var config = mpamConfig.dbParameters;

//************** */ Functions
function queryDB(queryStr){

  const sql = require("mssql");

  return new Promise(function(resolve, reject) {
    const pool1 = new sql.ConnectionPool(config, err => {
      pool1.request()
        .query(queryStr, (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result.recordset);
          }
        });
    });
    pool1.on("error", err => {
      console.log("EROR>>" + err);
      reject(err);
    });
  });
}

exports.getAccount = (arg)=> {

// var getAccount = function(arg) {
  return queryDB(`SELECT * FROM Account_Info WHERE Cust_Code='${arg.Cust_Code}' `).then(row=>{
    return {
      Cust_Code: row[0].Cust_Code,
      First_Name_T: row[0].First_Name_T,
      Last_Name_T: row[0].Last_Name_T
    }
  })
};

//************** */ Functions

