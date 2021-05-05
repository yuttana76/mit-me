// https://www.npmjs.com/package/maskdata#mask-the-exact-substring-from-throughout-the-string

const e = require('express');
const logger = require('../config/winston');
// const { NAV_auditor } = require('./fundConnextAPI');
const fs = require('fs');
const path = require('path');


function fundConnextBusinessDate(){
  var today = new Date();
  var returnDate_yyyymmddDate;

  if(today.getDay() == 1 ){
    today.setDate(today.getDate()-3);
    returnDate_yyyymmddDate = today.getFullYear()+''+("0" + (today.getMonth() + 1)).slice(-2)+''+("0" + today.getDate()).slice(-2);
  }else{
    today.setDate(today.getDate()-1);
    returnDate_yyyymmddDate = today.getFullYear()+''+("0" + (today.getMonth() + 1)).slice(-2)+''+("0" + today.getDate()).slice(-2);
  }

  console.log('fundConnextBusinessDate()'+returnDate_yyyymmddDate);
  return returnDate_yyyymmddDate
}


exports.validateFC_API_download =(req, res,businessDate)=>{

  const DOWNLOAD_DIR_BACKUP = path.resolve('./backend/downloadFiles/fundConnextBackup/');

  try{

    if(!businessDate){

      if(req && req.body && req.body.businessDate){
        businessDate = req.body.businessDate
      } else{
        businessDate = fundConnextBusinessDate();
      }

    }

    logger.info( `Welcome validateFC_API_download ${businessDate}` )

// validate NAV
// 20210428_MPAM_NAV.txt

    try{
      fileName = `${businessDate}_MPAM_NAV.txt`
      fs.readFile(DOWNLOAD_DIR_BACKUP +"/"+ fileName, function(err, data) {
        if(err) {
          logger.error(err.message);
        }else{
          var array = data.toString().split("\n");

          item_header = array[0].split('|');
          logger.info('**DATA item_header>>' + JSON.stringify(item_header))
          _num_data = item_header[2];
        }
      });


    }catch(e){
      // logger.error(e);
      reject(e);
    }



    // Validate ALLOTTEDTRANSACTIONS
    // 20210428_MPAM_ALLOTTEDTRANSACTIONS.txt

    // Validate UNITHOLDERBALANCE
    // 20210428_MPAM_UNITHOLDERBALANCE.txt

    return true;

  }catch(e){
    logger.error(e.message);
  }

}


exports.validateFC_API_download('20210428')
