const dbConfig = require('../config/db-config');
var config = dbConfig.dbParameters;
var fs = require('fs');

var builder = require('xmlbuilder');
var file = "booksxml.xml";
var dirPath = __dirname + "/../downloadFiles/xmlfiles/"+file;

exports.getCustAM = (req, res, next) => {

  console.log('Welcome getCustAM()');

  var fncName = 'getFunds()';

  var queryStr = `SELECT * FROM [MFTS_Fund]
  WHERE CURRENT_TIMESTAMP < ISNULL(End_Date,CURRENT_TIMESTAMP+1)
  ORDER  BY Amc_Id ,Thai_Name`;

  const sql = require('mssql')
  const pool1 = new sql.ConnectionPool(config, err => {
    pool1.request() // or: new sql.Request(pool1)
    .query(queryStr, (err, result) => {

        var xml = builder.create('bookstore');

        if(err){
          console.log( fncName +' Quey db. Was err !!!' + err);
          res.status(201).json({
            message: err,
          });
        }else {

          for(var i=0; i< result.rowsAffected; i++){

            xml.ele('book')
            .ele('Fund_Code', result.recordset[i]['Fund_Code']).up()
            .ele('Thai_Name', result.recordset[i]['Thai_Name']).up()
            .ele('Eng_Name', result.recordset[i]['Eng_Name']).end();

        }

        var xmldoc = xml.toString({ pretty: true });
        fs.writeFile(dirPath, xmldoc, function(err) {
            if(err) { return console.log(err); }
            console.log("The file was saved!");
            res.download(dirPath, file);
            // res.render('index', { title: 'Generate XML using NodeJS' });

          });

          // res.status(200).json({
          //   message: fncName + "Quey db. successfully!",
          //   result: result.recordset
          // });
        }
    })

  })

  pool1.on('recordset', columns => {
    // Emitted once for each recordset in a query
    console.log("recordset>>"+JSON.stringify(columns));
  })

  pool1.on('error', err => {
    console.log("EROR>>"+err);
  })
}
