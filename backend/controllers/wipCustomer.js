
  // String -> sql.NVarChar
  // Number -> sql.Int
  // Boolean -> sql.Bit
  // Date -> sql.DateTime

const dbConfig = require("./config");
var sql = require("mssql");
var config = dbConfig.dbParameters;


exports.ExeWIPCustomer = (req, res, next) => {

  console.log("ExeWIPCustomer>> ",req.body.Cust_Code );
  var fncName = "ExeWIPCustomer";

  var customerObj = JSON.parse(req.body.customer);
  var ceAddressObj = JSON.parse(req.body.ceAddress);
  var maAddressObj = JSON.parse(req.body.maAddress);

  const sql = require("mssql");
  const pool1 = new sql.ConnectionPool(config, err => {
    pool1.request()
      .input('Cust_Code', sql.NVarChar,  customerObj.Cust_Code)
      .output('wfRef', sql.VarChar(20))
      .execute('[dbo].[MIT_Insert_WIP_customer]', (err, result) => {

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
