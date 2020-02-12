const dbConfig = require('../config/db-config');
const fs = require('fs');
const path = require('path');

var config = dbConfig.dbParameters;
const https = require('https')
const crypto = require('crypto');
var logger = require("../config/winston");

exports.OpenAccount = (req, res, next) => {


  // var content = req.body.fcIndCustomer.toString().replace(/\t/g, '').split('\r\n');
  // var fcIndCustomerOBJ = JSON.parse(content)

  var fcIndCustomerOBJ = JSON.parse(req.body.fcIndCustomer)
  var actionBy = req.body.actionBy;

  console.log("fcIndCustomerOBJ()" + JSON.stringify(fcIndCustomerOBJ));

  fnArray=[];
  fnArray.push(SaveWIPCustInfo(fcIndCustomerOBJ,actionBy));

  // Address
  if(fcIndCustomerOBJ.residence)
    fnArray.push(SaveMIT_WIP_CUST_ADDR(fcIndCustomerOBJ.cardNumber,fcIndCustomerOBJ.residence,1,actionBy));

  if(fcIndCustomerOBJ.current)
    fnArray.push(SaveMIT_WIP_CUST_ADDR(fcIndCustomerOBJ.cardNumber,fcIndCustomerOBJ.current,2,actionBy));

  if(fcIndCustomerOBJ.work)
    fnArray.push(SaveMIT_WIP_CUST_ADDR(fcIndCustomerOBJ.cardNumber,fcIndCustomerOBJ.work,3,actionBy));

  if(fcIndCustomerOBJ.mail_addrData)
    fnArray.push(SaveMIT_WIP_CUST_ADDR(fcIndCustomerOBJ.cardNumber,fcIndCustomerOBJ.mail_addrData,9,actionBy));

  // Children
    for (var i in fcIndCustomerOBJ.children) {
      if(fcIndCustomerOBJ.children[i])
        fnArray.push(saveMIT_WIP_CUST_CHILDREN(fcIndCustomerOBJ.cardNumber,fcIndCustomerOBJ.children[i],actionBy));
  }

  // Bank
  for (var i in fcIndCustomerOBJ.subscriptionBankAccounts) {
    if(fcIndCustomerOBJ.subscriptionBankAccounts[i])
      fnArray.push(saveMIT_WIP_CUST_BANK(fcIndCustomerOBJ.cardNumber,fcIndCustomerOBJ.subscriptionBankAccounts[i],'sub',actionBy));
  }

  for (var i in fcIndCustomerOBJ.redemptionBankAccounts) {
    if(fcIndCustomerOBJ.redemptionBankAccounts[i])
      fnArray.push(saveMIT_WIP_CUST_BANK(fcIndCustomerOBJ.cardNumber,fcIndCustomerOBJ.redemptionBankAccounts[i],'red',actionBy));
  }



  Promise.all(fnArray)
  .then(data => {
      res.status(200).json(data[0]);
  })
  .catch(error => {
    logger.error(error.message)
    res.status(401).json(error.message);
  });

}


function SaveWIPCustInfo(custObj,actionBy){

  if(custObj.cardNotExp=='Y')
      custObj.cardExpiryDate=null

  if(custObj.spouse.cardNotExp=='Y')
      custObj.spouse.cardExpDate=null


  var queryStr = `
  BEGIN TRANSACTION TranName;

  UPDATE MIT_WIP_CUST_INFO SET
   thFirstName=@thFirstName
  ,thLastName=@thLastName
  ,birthDate=@birthDate
  ,[mobileNumber]=@mobileNumber
  ,[email]=@email
  ,[occupationId]=@occupationId
  ,[occupationOther]=@occupationOther
  ,[businessTypeId]=@businessTypeId
  ,[businessTypeOther]=@businessTypeOther
  ,[monthlyIncomeLevel]=@monthlyIncomeLevel
  ,[incomeSource]=@incomeSource
  ,[incomeSourceOther]=@incomeSourceOther
  ,[companyName]=@companyName
  ,[identificationCardType]=@identificationCardType
  ,[passportCountry]=@passportCountry
  ,[title]=@title
  ,[titleOther]=@titleOther
  ,[enFirstName]=@enFirstName
  ,[enLastName]=@enLastName
  ,[cardExpiryDate]=@cardExpiryDate
  ,[cardNotExp]=@cardNotExp
  ,[maritalStatus]=@maritalStatus
  ,[SPidentificationCardType]=@SPidentificationCardType
  ,[SPpassportCountry]=@SPpassportCountry
  ,[SPcardNumber]=@SPcardNumber
  ,[SPtitle]=@SPtitle
  ,[SPtitleOther]=@SPtitleOther
  ,[SPthFirstName]=@SPthFirstName
  ,[SPthLastName]=@SPthLastName
  ,[SPidCardExpiryDate]=@SPidCardExpiryDate
  ,[SPcardNotExp]=@SPcardNotExp
  ,[SPphoneNumber]=@SPphoneNumber
  ,[committedMoneyLaundering]=@committedMoneyLaundering
  ,[politicalRelatedPerson]=@politicalRelatedPerson
  ,[rejectFinancialTransaction]=@rejectFinancialTransaction
  ,[confirmTaxDeduction]=@confirmTaxDeduction
  ,[nationality]=@nationality
  ,[cddScore]=@cddScore
  ,[cddDate]=@cddDate
  ,[canAcceptDerivativeInvestment]=@canAcceptDerivativeInvestment
  ,[canAcceptFxRisk]=@canAcceptFxRisk
  ,[accompanyingDocument]=@accompanyingDocument
  ,[gender]=@gender
  ,[incomeSourceCountry]=@incomeSourceCountry
  ,openFundConnextFormFlag=@openFundConnextFormFlag
  ,[vulnerableFlag]=@vulnerableFlag
  ,[vulnerableDetail]=@vulnerableDetail
  ,[ndidFlag]=@ndidFlag
  ,[ndidRequestId]=@ndidRequestId
  ,[suitabilityRiskLevel]=@suitabilityRiskLevel
  ,[suitabilityEvaluationDate]=@suitabilityEvaluationDate
  ,[fatca]=@fatca
  ,[fatcaDeclarationDate]=@fatcaDeclarationDate
  ,[workAddressSameAsFlag]=@workAddressSameAsFlag
  ,[currentAddressSameAsFlag]=@currentAddressSameAsFlag
  ,[mailSameAs]=@mailSameAs

  ,investmentObjective=@investmentObjective
  ,investmentObjectiveOther=@investmentObjectiveOther

  ,UpdateBy=@actionBy
  ,UpdateDate=getDate()
  WHERE cardNumber=@cardNumber

  IF @@ROWCOUNT=0
    BEGIN
      INSERT INTO  MIT_WIP_CUST_INFO (
        cardNumber
        ,thFirstName
        ,thLastName
        ,birthDate
        ,[mobileNumber]
        ,[email]
        ,[occupationId]
        ,[occupationOther]
        ,[businessTypeId]
        ,[businessTypeOther]
        ,[monthlyIncomeLevel]
        ,[incomeSource]
        ,[incomeSourceOther]
        ,[companyName]
        ,[identificationCardType]
        ,[passportCountry]
        ,[title]
        ,[titleOther]
        ,[enFirstName]
        ,[enLastName]
        ,[cardExpiryDate]
        ,[cardNotExp]
        ,[maritalStatus]
        ,[SPidentificationCardType]
        ,[SPpassportCountry]
        ,[SPcardNumber]
        ,[SPtitle]
        ,[SPtitleOther]
        ,[SPthFirstName]
        ,[SPthLastName]
        ,[SPidCardExpiryDate]
        ,[SPcardNotExp]
        ,[SPphoneNumber]
        ,[committedMoneyLaundering]
        ,[politicalRelatedPerson]
        ,[rejectFinancialTransaction]
        ,[confirmTaxDeduction]
        ,[nationality]
        ,[cddScore]
        ,[cddDate]
        ,[canAcceptDerivativeInvestment]
        ,[canAcceptFxRisk]
        ,[accompanyingDocument]
        ,[gender]
        ,[incomeSourceCountry]
        ,openFundConnextFormFlag
        ,[vulnerableFlag]
        ,[vulnerableDetail]
        ,[ndidFlag]
        ,[ndidRequestId]
        ,[suitabilityRiskLevel]
        ,[suitabilityEvaluationDate]
        ,[fatca]
        ,[fatcaDeclarationDate]
        ,[workAddressSameAsFlag]
        ,[currentAddressSameAsFlag]
        ,[mailSameAs]
        ,investmentObjective
        ,investmentObjectiveOther
        ,CreateBy
        ,CreateDate
        )
      VALUES(
        @cardNumber
        ,@thFirstName
        ,@thLastName
        ,@birthDate
        ,@mobileNumber
        ,@email
        ,@occupationId
        ,@occupationOther
        ,@businessTypeId
        ,@businessTypeOther
        ,@monthlyIncomeLevel
        ,@incomeSource
        ,@incomeSourceOther
        ,@companyName
        ,@identificationCardType
        ,@passportCountry
        ,@title
        ,@titleOther
        ,@enFirstName
        ,@enLastName
        ,@cardExpiryDate
        ,@cardNotExp
        ,@maritalStatus
        ,@SPidentificationCardType
        ,@SPpassportCountry
        ,@SPcardNumber
        ,@SPtitle
        ,@SPtitleOther
        ,@SPthFirstName
        ,@SPthLastName
        ,@SPidCardExpiryDate
        ,@SPcardNotExp
        ,@SPphoneNumber
        ,@committedMoneyLaundering
        ,@politicalRelatedPerson
        ,@rejectFinancialTransaction
        ,@confirmTaxDeduction
        ,@nationality
        ,@cddScore
        ,@cddDate
        ,@canAcceptDerivativeInvestment
        ,@canAcceptFxRisk
        ,@accompanyingDocument
        ,@gender
        ,@incomeSourceCountry
        ,@openFundConnextFormFlag
        ,@vulnerableFlag
        ,@vulnerableDetail
        ,@ndidFlag
        ,@ndidRequestId
        ,@suitabilityRiskLevel
        ,@suitabilityEvaluationDate
        ,@fatca
        ,@fatcaDeclarationDate
        ,@workAddressSameAsFlag
        ,@currentAddressSameAsFlag
        ,@mailSameAs
        ,@investmentObjective
        ,@investmentObjectiveOther
        ,@actionBy
        ,getDate()
        )
    END

  COMMIT TRANSACTION TranName;
  `;

  const sql = require('mssql')

  return new Promise(function(resolve, reject) {
    const pool1 = new sql.ConnectionPool(config, err => {
      pool1.request()
      .input("cardNumber", sql.VarChar(13), custObj.cardNumber)
      .input("thFirstName", sql.NVarChar(100), custObj.thFirstName)
      .input("thLastName", sql.NVarChar(100), custObj.thLastName)
      .input("birthDate", sql.VarChar(50), custObj.birthDate)
      .input("mobileNumber", sql.VarChar(20), custObj.mobileNumber)
      .input("email", sql.NVarChar(100), custObj.email)
      .input("occupationId", sql.VarChar(3), custObj.occupationId)
      .input("occupationOther", sql.NVarChar(100), custObj.occupationOther)
      .input("businessTypeId", sql.VarChar(3), custObj.businessTypeId)
      .input("businessTypeOther", sql.NVarChar(100), custObj.businessTypeOther)
      .input("monthlyIncomeLevel", sql.NVarChar(10), custObj.monthlyIncomeLevel)
      .input("incomeSource", sql.VarChar(100), custObj.incomeSource)
      .input("incomeSourceOther", sql.VarChar(100), custObj.incomeSourceOther)
      .input("companyName", sql.NVarChar(100), custObj.companyName)
      .input("identificationCardType", sql.VarChar(15), custObj.identificationCardType)
      .input("passportCountry", sql.VarChar(2), custObj.passportCountry)
      .input("title", sql.VarChar(5), custObj.title)
      .input("titleOther", sql.VarChar(50), custObj.titleOther)
      .input("enFirstName", sql.NVarChar(100), custObj.enFirstName)
      .input("enLastName", sql.NVarChar(100), custObj.enLastName)
      .input("cardExpiryDate", sql.NVarChar(50), custObj.cardExpiryDate)
      .input("cardNotExp", sql.VarChar(10), custObj.cardNotExp)
      .input("maritalStatus", sql.VarChar(10), custObj.maritalStatus)

      .input("SPidentificationCardType", sql.VarChar(15), custObj.spouse.cardType)
      .input("SPpassportCountry", sql.VarChar(2), custObj.spouse.passportCountry)
      .input("SPcardNumber", sql.VarChar(20), custObj.spouse.cardNumber)
      .input("SPtitle", sql.NVarChar(5), custObj.spouse.title)
      .input("SPtitleOther", sql.NVarChar(50), custObj.spouse.titleOther)
      .input("SPthFirstName", sql.NVarChar(100), custObj.spouse.firstName)
      .input("SPthLastName", sql.NVarChar(100), custObj.spouse.lastName)
      .input("SPidCardExpiryDate", sql.NVarChar(50), custObj.spouse.cardExpDate)
      .input("SPcardNotExp", sql.NVarChar(50), custObj.spouse.cardNotExp)
      .input("SPphoneNumber", sql.VarChar(20), custObj.spouse.phoneNumber)

      .input("committedMoneyLaundering", sql.VarChar(10), custObj.moneyLaundaring)
      .input("politicalRelatedPerson", sql.VarChar(10), custObj.politicalRelate)
      .input("rejectFinancialTransaction", sql.VarChar(10), custObj.rejectFinancial)

      .input("confirmTaxDeduction", sql.VarChar(10), custObj.confirmTaxDeduction)
      .input("nationality", sql.VarChar(2), custObj.nationality)
      .input("cddScore", sql.VarChar(1), custObj.cddScore)
      .input("cddDate", sql.NVarChar(50), custObj.cddDate)
      .input("canAcceptDerivativeInvestment", sql.VarChar(10), custObj.canAcceptDerivativeInvestment)
      .input("canAcceptFxRisk", sql.VarChar(10), custObj.canAcceptFxRisk)
      .input("accompanyingDocument", sql.VarChar(20), custObj.accompanyingDocument)
      .input("gender", sql.VarChar(6), custObj.gender)
      .input("incomeSourceCountry", sql.VarChar(2), custObj.incomeSourceCountry)
      .input("openFundConnextFormFlag", sql.VarChar(10), custObj.openFundConnextFormFlag)
      .input("vulnerableFlag", sql.VarChar(10), custObj.vulnerableFlag)
      .input("vulnerableDetail", sql.NVarChar(100), custObj.vulnerableDetail)
      .input("ndidFlag", sql.VarChar(10), custObj.ndidFlag)
      .input("ndidRequestId", sql.NVarChar(100), custObj.ndidRequestId)
      .input("suitabilityRiskLevel", sql.VarChar(1), custObj.suitabilityRiskLevel)
      .input("suitabilityEvaluationDate", sql.VarChar(50), custObj.suitabilityEvaluationDate)
      .input("fatca", sql.VarChar(10), custObj.fatca)
      .input("fatcaDeclarationDate", sql.VarChar(20), custObj.fatcaDeclarationDate)
      .input("workAddressSameAsFlag", sql.VarChar(10), custObj.workAddressSameAsFlag)
      .input("currentAddressSameAsFlag", sql.VarChar(10), custObj.currentAddressSameAsFlag)
      .input("mailSameAs", sql.VarChar(10), custObj.mailSameAs)

      .input("investmentObjective", sql.NVarChar(100), custObj.investmentObjective)
      .input("investmentObjectiveOther", sql.NVarChar(100), custObj.investmentObjectiveOther)

      .input("actionBy", sql.VarChar(50), actionBy)

      // .input("ProvinceName", sql.NVarChar(100), addrObj.province)
      .query(queryStr, (err, result) => {
        // console.log(JSON.stringify(result));
          if(err){
            const err_msg=err;
            logger.error('Messge:'+err_msg);
            resolve({code:'9',message:''+err_msg});
          }else {
            resolve({code:'0'});
          }
      })
    })
    pool1.on('error', err => {
      logger.error(err);
      reject(err);
    })
  });
}



function SaveMIT_WIP_CUST_ADDR(cardNumber,addrObj,seq,actionBy){

  // console.log("update_Address()");
  if(!addrObj.soi)
    addrObj.soi= '-';

  var queryStr = `
  BEGIN TRANSACTION TranName;

    -- Extension
    UPDATE MIT_WIP_CUST_ADDR SET
     [no]=@no
    ,[floor]=@floor
    ,[building]=@building
    ,[soi]=@soi
    ,[road]=@road
    ,[moo]=@moo
    ,[subDistrict]=@subDistrict
    ,[district]=@district
    ,[province]=@province
    ,[postalCode]=@postalCode
    ,[country]=@country
    ,[phoneNumber]=@phoneNumber
    ,UpdateBy=@actionBy
    ,UpdateDate=getDate()
    WHERE cardNumber=@cardNumber AND Addr_Seq=@Addr_Seq

    IF @@ROWCOUNT=0
    BEGIN
      INSERT INTO  MIT_WIP_CUST_ADDR (
        cardNumber
        ,Addr_Seq
        ,[no]
        ,[floor]
        ,[building]
        ,[soi]
        ,[road]
        ,[moo]
        ,[subDistrict]
        ,[district]
        ,[province]
        ,[postalCode]
        ,[country]
        ,[phoneNumber]
        ,CreateBy
        ,CreateDate
        )
      VALUES(@cardNumber
        ,@Addr_Seq
        ,@no
        ,@floor
        ,@building
        ,@soi
        ,@road
        ,@moo
        ,@subDistrict
        ,@district
        ,@province
        ,@postalCode
        ,@country
        ,@phoneNumber
        ,@actionBy
        ,getDate()
        )

        END

      COMMIT TRANSACTION TranName;
  `;

  const sql = require('mssql')

  return new Promise(function(resolve, reject) {
    const pool1 = new sql.ConnectionPool(config, err => {
      pool1.request()
      .input("cardNumber", sql.VarChar(20), cardNumber)
      .input("Addr_Seq", sql.VarChar(1), seq)
      .input("no", sql.NVarChar(100), addrObj.Addr_No)
      .input("floor", sql.NVarChar(100), addrObj.Floor)
      .input("building", sql.NVarChar(100), addrObj.Place)
      .input("soi", sql.NVarChar(100), addrObj.Soi)
      .input("Road", sql.NVarChar(100), addrObj.Road)
      .input("moo", sql.NVarChar(100), addrObj.Moo)
      .input("subDistrict", sql.NVarChar(100), addrObj.Tambon_Id)
      .input("district", sql.NVarChar(100), addrObj.Amphur_Id)
      .input("province", sql.NVarChar(100), addrObj.Province_Id)
      .input("postalCode", sql.NVarChar(100), addrObj.Zip_Code)
      .input("country", sql.NVarChar(100), addrObj.Country_Id)
      .input("phoneNumber", sql.NVarChar(100), addrObj.Tel)
      .input("actionBy", sql.VarChar(50), actionBy)

      // .input("ProvinceName", sql.NVarChar(100), addrObj.province)
      .query(queryStr, (err, result) => {
        // console.log(JSON.stringify(result));
          if(err){
            const err_msg=err;
            logger.error('Messge:'+err_msg);
            resolve({code:'9',message:''+err_msg});
          }else {
            resolve({code:'0'});
          }
      })
    })
    pool1.on('error', err => {
      logger.error(err);
      reject(err);
    })
  });
}


function saveMIT_WIP_CUST_CHILDREN(cardNumber,childrenObj,actionBy){

  // console.log("saveMIT_WIP_CUST_CHILDREN()" + JSON.stringify(childrenObj));

  var queryStr = `
  BEGIN TRANSACTION TranName;

    UPDATE MIT_WIP_CUST_CHILDREN SET
    [identificationCardType]=@identificationCardType
    ,[passportCountry]=@passportCountry
    ,[idCardExpiryDate]=@idCardExpiryDate
    ,[title]=@title
    ,[thFirstName]=@thFirstName
    ,[thLastName]=@thLastName
    ,[birthDate]=@birthDate
    ,UpdateBy=@actionBy
    ,UpdateDate=getDate()
    WHERE cardNumber=@cardNumber AND childCardNumber=@childCardNumber

    IF @@ROWCOUNT=0
    BEGIN
      INSERT INTO  MIT_WIP_CUST_CHILDREN (
        cardNumber
        ,[childCardNumber]
        ,[identificationCardType]
        ,[passportCountry]
        ,[idCardExpiryDate]
        ,[title]
        ,[thFirstName]
        ,[thLastName]
        ,[birthDate]
        ,CreateBy
        ,CreateDate
        )
      VALUES(@cardNumber
        ,@childCardNumber
        ,@identificationCardType
        ,@passportCountry
        ,@idCardExpiryDate
        ,@title
        ,@thFirstName
        ,@thLastName
        ,@birthDate
        ,@actionBy
        ,getDate()
        )
        END
      COMMIT TRANSACTION TranName;
  `;

  const sql = require('mssql')

  return new Promise(function(resolve, reject) {
    const pool1 = new sql.ConnectionPool(config, err => {
      pool1.request()
      .input("cardNumber", sql.VarChar(20), cardNumber)
      .input("childCardNumber", sql.VarChar(20), childrenObj.cardNumber)
      .input("identificationCardType", sql.VarChar(20), childrenObj.cardType)
      .input("passportCountry", sql.VarChar(20), childrenObj.passportCountry)
      .input("idCardExpiryDate", sql.VarChar(50), childrenObj.cardExpDate)
      .input("title", sql.VarChar(20), childrenObj.title)
      .input("thFirstName", sql.NVarChar(100), childrenObj.firstName)
      .input("thLastName", sql.NVarChar(100), childrenObj.lastName)
      .input("birthDate", sql.VarChar(50), childrenObj.dob)
      .input("actionBy", sql.VarChar(50), actionBy)

      .query(queryStr, (err, result) => {

        // console.log(JSON.stringify(result));
          if(err){
            const err_msg=err;
            logger.error('Messge:'+err_msg);

            resolve({code:'9',message:''+err_msg});
          }else {
            resolve({code:'0'});
          }
      })
    })
    pool1.on('error', err => {
      console.log('err 2 ->' +err);
      logger.error(err);
      reject(err);
    })
  });
}

function saveMIT_WIP_CUST_BANK(cardNumber,bankObj,accType,actionBy){

  // console.log("saveMIT_WIP_CUST_BANK()" + JSON.stringify(bankObj));

  var queryStr = `
  BEGIN TRANSACTION TranName;

    UPDATE MIT_WIP_CUST_BANK SET
    [bankCode]=@bankCode
    ,[bankBranchCode]=@bankBranchCode
    ,[default]=@default
    ,[finnetCustomerNo]=@finnetCustomerNo
    ,[accType]=@accType

    ,UpdateBy=@actionBy
    ,UpdateDate=getDate()

    WHERE cardNumber=@cardNumber AND bankAccountNo=@bankAccountNo

    IF @@ROWCOUNT=0
    BEGIN
      INSERT INTO  MIT_WIP_CUST_BANK (
        cardNumber
        ,[bankCode]
        ,[bankBranchCode]
        ,[bankAccountNo]
        ,[default]
        ,[finnetCustomerNo]
        ,[accType]
        ,CreateBy
        ,CreateDate
        )
      VALUES(
        @cardNumber
        ,@bankCode
        ,@bankBranchCode
        ,@bankAccountNo
        ,@default
        ,@finnetCustomerNo
        ,@accType
        ,@actionBy
        ,getDate()
        )
        END
      COMMIT TRANSACTION TranName;
  `;

  const sql = require('mssql')

  return new Promise(function(resolve, reject) {
    const pool1 = new sql.ConnectionPool(config, err => {
      pool1.request()
      .input("cardNumber", sql.VarChar(20), cardNumber)
      .input("bankCode", sql.VarChar(20), bankObj.bankCode)
      .input("bankBranchCode", sql.VarChar(20), bankObj.bankBranchCode)
      .input("bankAccountNo", sql.VarChar(20), bankObj.bankAccountNo)
      .input("default", sql.VarChar(20), bankObj.default)
      .input("finnetCustomerNo", sql.VarChar(20), bankObj.finnetCustomerNo)
      .input("accType", sql.VarChar(20), accType)

      .input("actionBy", sql.VarChar(50), actionBy)

      .query(queryStr, (err, result) => {

        // console.log(JSON.stringify(result));
          if(err){
            const err_msg=err;
            logger.error('Messge:'+err_msg);

            resolve({code:'9',message:''+err_msg});
          }else {
            resolve({code:'0'});
          }
      })
    })
    pool1.on('error', err => {
      console.log('err 2 ->' +err);
      logger.error(err);
      reject(err);
    })
  });
}
