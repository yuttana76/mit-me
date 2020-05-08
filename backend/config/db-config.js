exports.msByQuery = (queryStr,_config)=>{

  const sql = require("mssql");
  return new Promise(function(resolve, reject) {
    const pool1 = new sql.ConnectionPool(_config, err => {
      pool1
      .request() // or: new sql.Request(pool1)
      .query(queryStr, (err, result) => {
          if (err) {
            console.log(fncName + " Quey db. Was err !!!" + err);
            reject(err);
          } else {
            resolve(result);
          }
        });
    });
    pool1.on("error", err => {
      console.log("ERROR>>" + err);
      reject(err);
    });
  });

}
