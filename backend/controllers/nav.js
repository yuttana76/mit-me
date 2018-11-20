const dbConfig = require('./config');

var config = dbConfig.dbParameters;


exports.getNavMenu = (req, res, next) => {

  var userId = req.query.userId;

  console.log('userId>>' ,userId);

  var fncName = 'getNavMenu()';
  var queryStr = `    SELECT C.*
  from MIT_USERS_GROUP A
,MIT_Authority B
,MIT_ApplicationInfo C
WHERE A.USERID = '${userId}'
  AND A.[STATUS] ='A'
AND CURRENT_TIMESTAMP < ISNULL(A.EXPIRE_DATE,CURRENT_TIMESTAMP+1)
 AND B.MIT_GROUP =A.GroupId
  AND B.[Status]='A'
  AND CURRENT_TIMESTAMP < ISNULL(B.EXPIRE_DATE,CURRENT_TIMESTAMP+1)
AND B.AppId = C.AppId
order by C.menuGroup, C.menuOrder
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
