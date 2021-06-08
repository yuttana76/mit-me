/*
Upload File >
  user_info.csv
*/

const readline = require('readline');
const fs = require('fs');
var request = require("request");
var logger = require("../config/winston");
var st2faUtil = require("./st2fa_util");
const https = require('https')
const crypto = require('crypto');


var today = new Date();
var date = today.getFullYear()+""+(today.getMonth()+1)+""+today.getDate();
var time = today.getHours() +""+  today.getMinutes()
var dateTime = date+''+time;

const readPath = __dirname + '/readFiles/Streaming/2fa/';
const readFile = 'user_info_mpam.csv';
const encrypt_readFile = 'user_info_encrypted.csv';
const decrypt_readFile = 'user_info_decrypted.csv';

const bakPath = __dirname + '/readFiles/Streaming/2fa/backup/';
const bakFile =  dateTime+'-'+readFile;


/**
 * Source file: \backend\controllers\readFiles\Streaming\2fa\user_info_mpam.csv
 */
exports.createUserInfo=((req, res, next) =>{

  try{

    var source_line_no = 0;
    line_no = 0;
    let rFile = readline.createInterface({
      input: fs.createReadStream(readPath+readFile)
    });

    var writeStream = fs.createWriteStream(readPath+encrypt_readFile, );

    rFile.on('line', function(line) {

      if ( line && line.trim() != ""){
        if(line_no >= 1){

          var array = line.split(",");

          /**
           *Encrypt data
          * User=array[0] , Mobile=array[1] );
          */
          encrypted = st2faUtil.encrypt(array[1]);

          //Write to file
          writeStream.write(array[0] +","+encrypted.iv+","+encrypted.data+"\r\n");

        }else if(line_no ==0){
          // Insert header
          writeStream.write(line+"\r\n");
          var head_array = line.split(",");
          source_line_no = head_array[0]
        }
        line_no++;

      }
    });



    // end
    rFile.on('close', function(line) {
      console.log(`Write file : ${source_line_no}:${line_no}`);

      // Create file
      writeStream.end();

      line_no--;  //  Minus header counter
    if( source_line_no == line_no ){
      logger.info(`Successfully> ${source_line_no}:${line_no}`)

      // Backup file
      fs.rename(readPath+readFile, bakPath+bakFile,  (err) => {
        if (err) throw err;
        // console.log('Backup complete!');
      });

      res.status(200).json({
        message: "createUserInfo successfully!",
        code:"000"
      });

    }else{
      logger.error(`createUserInfo Fail> ${source_line_no}:${line_no}`)
      res.status(404).json({
        message: "encrypt was error(number of data)",
        code:"999"
      });
    }

    });

  }catch(err){
    logger.error(err)
    res.status(400).json({
      message: err.message,
      code:"999",
    });
  }

});


// D:\Merchants\apps\mit\backend\controllers/readFiles/Streaming/2fa/
exports.decryptUserInfo=((req, res, next) =>{
  var source_line_no = 0;
  line_no = 0;
  let rFile = readline.createInterface({
    input: fs.createReadStream(readPath+encrypt_readFile)
  });

  var writeStream = fs.createWriteStream(readPath+decrypt_readFile, );

  logger.info(` readPath>>${readPath}`)

  rFile.on('line', function(line) {

    if(line_no >= 1){
      var array = line.split(",");
      /**
       * array[0]:User , array[1]:IV ,array[2]:encrypted);
       */
      decrypted = st2faUtil.decrypt(array[2],array[1]);
      //Write to file
      writeStream.write(array[0] +","+decrypted+"\r\n");

    }else if(line_no == 0){
      // Insert header
      logger.info(`Write header ${line_no}`)

      writeStream.write(line+"\r\n");
      var head_array = line.split(",");
      source_line_no = head_array[0]
    }

    line_no++;

  });

  // end
  rFile.on('close', function(line) {
    logger.info(`Finish Decrypted file> ${source_line_no}:${line_no}`)
    writeStream.end();
  });

});

// exports.createUserInfo();
// exports.decryptUserInfo();

const HOST='https://open-api-test.settrade.com'
const BORKER_ID='503'
const APIKEY='oB3Pp1FksS86ffLW'
const API_SECRET	='AIH4VhPf54P62CkuROYiDqCiA9mcLm2IPzQ1SDKZ2/3P'


var EC = require("elliptic").ec;
var ec = new EC("secp256k1");

exports.login=((req, res, next) =>{

  console.log('Welcome Streaming 2FA login API.')

  // const PATH='/api/oam/v1/'+BORKER_ID+'/broker-apps/ADMIN/login';
  const PATH= ''.concat('/api/oam/v1/',BORKER_ID,'/broker-apps/ADMIN/login');

  var params='';

  var timestamp = new Date().getTime();
  console.log('***Timestamp>'+ timestamp)

  // crypto.createHash('sha256').update(pwd).digest('hex');
  var payload = ''.concat(APIKEY,'.',params,'.',timestamp)

  //Hash payload SHA256
  const msgHash = crypto.createHash('sha256').update(payload).digest('base64');
  // var shaMsg = crypto.createHash("sha256").update(myData.toString()).digest();

  //Sign payload ECDSA API_SECRET
  // mySign = ec.sign(msgHash, API_SECRET, {canonical: true});
  mySign = ec.sign(msgHash, API_SECRET);
  var signature = ''.concat(mySign.r,mySign.s)

  console.log('***msgHash>'+ msgHash)
  console.log('***signature>'+ JSON.stringify(mySign))

  var options= {
    host: HOST,
    path:PATH,
    method: "POST",
    headers: {
       "Content-Type": "application/json"
       ,"apiKey": APIKEY
       , "params": ""
       , "signature": signature
       , "timestamp": timestamp,

    },
  };

  console.log('***options>'+JSON.stringify(options))

  // START call
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0" //this is insecure

  const request = https.request(options,(res) => {
    var _chunk="";
    var i=0;
    res.setEncoding('utf8');
    res.on('data', (chunk) => {

      console.log("(chunk)>>"+ JSON.stringify(chunk));
      i++;
      // console.log("i>>"+i);
      _chunk=_chunk.concat(chunk);
    });

    res.on('end', () => {
      console.log('No more data in response.');
      // resolve(_chunk);
      console.log("(chunk)>>"+ JSON.stringify(_chunk));

      res.status(200).json({
        message: "Successfully!",
        code:"000",
        result: result
      });
    });
  });

  request.on('error', (e) => {
    // reject(e);
    logger.error('http error:'+e)

    res.status(400).json({
      message: e,
      code:"999",
    });
  });



});
