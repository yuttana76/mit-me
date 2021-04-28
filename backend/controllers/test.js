// https://www.npmjs.com/package/maskdata#mask-the-exact-substring-from-throughout-the-string

const logger = require('../config/winston');
// const { NAV_auditor } = require('./fundConnextAPI');


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
    // 3260 downloadNavAPIproc
    // 3303
    // 5414 fcNAV_ToDB

    // Validate ALLOTTEDTRANSACTIONS   2817
    // 2811 downloadAllotedAPIproc
    // 4095 fcAlloted_ToDB
    // 4176 fcAlloted_ToDB_BULK (developing)
    // 5520

    // Validate UNITHOLDERBALANCE
    // 2862 UnitholderBalanceAPIProc
    // 5006 fcUnitholderBalance_ToDB_BULK

    return true;

  }catch(e){
    logger.error(e.message);
  }

}


exports.validateFC_API_download('xxx')
