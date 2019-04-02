const dbConfig = require('../config/db-config');
var prop = require('../config/backend-property');
var logger = require('../config/winston');
var config = dbConfig.dbParameters;

module.exports = {

/*
  getEmpObj : function (empName, callback) {
    let seletQuery = "SELECT * FROM Employee where employeeName = '" + empName + "'";
    con.query(seletQuery, function (err, result, fields) {
        if (err) throw err;
        callback(result);
    });
  },
*/
testMITlog : function(_userName,_module,log_msg,_ip,_url){

  logger.info(`Function testMITlog - ${_userName}`);

},

saveMITlog : function(_userName,_module,log_msg,_ip,_url,callback){

  logger.info(`API /saveMITlog - ;_userName= ${_userName} ;_module=${_module} ;log_msg=${log_msg} ;_ip=${_ip} ;_url=${_url}`);

  var queryStr = `
  BEGIN

    INSERT INTO MIT_LOG(LoginName,LogDateTime,module,log_msg,ip,url)
    VALUES('${_userName}',GETDATE(),'${_module}','${log_msg}','${_ip}','${_url}');

  END
  `;

  const sql = require('mssql')
  const pool1 = new sql.ConnectionPool(config, err => {
    pool1.request().query(queryStr, (err, result) => {

        if(err){
          throw err;

        }else {
          // return null;
          callback();
        }
      })
  })
}

}
