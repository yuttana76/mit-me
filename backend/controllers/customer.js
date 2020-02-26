// var Promise = require('bluebird');

const dbConfig = require('../config/db-config');
// var sql = require("mssql");
var config = dbConfig.dbParameters;
var logger = require('../config/winston');
const masterdataController = require('../controllers/masterdata')
exports.searchCustomers = (req, res, next) => {
  var fncName = "searchCustomers";

  var numPerPage = parseInt(req.query.pagesize, 10) || 10;
  var page = parseInt(req.query.page, 10) || 1;
  var custId = req.query.cust_id || false;
  var cust_name = req.query.cust_name || false;
  var whereCond = "";

  if (custId !== false) {
    whereCond = `Cust_Code like '%${custId}%'`;
    // whereCond = `CONTAINS(Cust_Code,${custId})`;
  } else {
    whereCond = `First_Name_T like N'%${cust_name}%'`;
    // whereCond = `CONTAINS(First_Name_T, ${cust_name})`;
  }

  var queryStr = `SELECT * FROM (
    SELECT ROW_NUMBER() OVER(ORDER BY Cust_Code) AS NUMBER,
           * FROM [Account_Info] WHERE ${whereCond}
      ) AS TBL
WHERE NUMBER BETWEEN ((${page} - 1) * ${numPerPage} + 1) AND (${page} * ${numPerPage})
ORDER BY Cust_Code`;

  const sql = require("mssql");
  const pool1 = new sql.ConnectionPool(config, err => {
    pool1
      .request() // or: new sql.Request(pool1)
      .query(queryStr, (err, result) => {
        // ... error checks
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


exports.getCustomer = (req, res, next) => {

  var fncName = 'getCustomer';
  var custCode = req.params.cusCode;

  var queryStr = `select *
  FROM [Account_Info]
  WHERE Cust_Code='${custCode}'`;

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

exports.getCustomerFullInfo = (req, res, next) => {

  var fncName = 'getCustomerFullInfo()';
  var custCode = req.params.cusCode;

  var queryStr = `select *
  FROM [Account_Info]
  WHERE Cust_Code='${custCode}'`;

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

exports.getORG_CustomerInfo = (req, res, next) => {

  var custCode = req.params.cusCode;

  fnArray=[];
  fnArray.push(getMFTS_CustomerInfo(custCode));
  fnArray.push(getMFTS_CustomerInfoExt(custCode));
  fnArray.push(getORG_Address(custCode,1));
  fnArray.push(getORG_Address(custCode,2));
  fnArray.push(getORG_Address(custCode,3));
  fnArray.push(getORG_Children(custCode));

  Promise.all(fnArray).then(values => {

      custInfo=values[0][0]
      custInfo["ext"] ={};

      if (values[1].length>0){
        custInfo.ext=values[1][0]
      }

      custInfo.ext.residence=[];
      if(values[2].length>0){
          custInfo.ext.residence=values[2][0]
      }

      custInfo.ext.current=[];
      if(values[3].length>0){
        custInfo.ext.current=values[3][0]
      }

      custInfo.ext.work=[];
      if(values[4].length>0){
        custInfo.ext.work=values[4][0]
      }

      if(values[5].length>0){
        custInfo.children=values[5]
      }

      res.status(200).json({
      result: custInfo
    });

  })
  .catch(error => {
    logger.error(error.message)
    res.status(500).json(error.message);
  });

}

exports.getFC_CustomerInfo = (req, res, next) => {

  // console.log('Welcome getFC_CustomerInfo()')
  var custCode = req.params.cusCode;

  fnArray=[];
  fnArray.push(getFC_CustomerInfo(custCode));
  fnArray.push(getFC_Address(custCode,1));
  fnArray.push(getFC_Address(custCode,2));
  fnArray.push(getFC_Address(custCode,3));
  fnArray.push(getFC_Children(custCode));

  Promise.all(fnArray).then(values => {

    // console.log('FC data>'+JSON.stringify(values))
      custInfo=values[0][0]

      if(values[1].length>0)
        custInfo.residence=values[1][0]

      // custInfo.current=[]
      if(values[2].length>0)
        custInfo.current=values[2][0]

      // custInfo.work=[]
      if(values[3].length>0)
        custInfo.work=values[3][0]

      if(values[4].length >0)
        custInfo.children=values[4]

      res.status(200).json({
      result: custInfo
    });
  })
  .catch(error => {
    logger.error(error.message)
    res.status(401).json(error.message);
  });
}


const getORG_Children = (cardNumber) => {
  return new Promise((resolve, reject) => {
      var fncName = 'getFC_Address() ';

      const sql = require('mssql')
      var queryStr = `
      SELECT
        *
      FROM [MIT_CUST_CHILDREN]
      WHERE cardNumber=@cardNumber  `;

      const pool1 = new sql.ConnectionPool(config, err => {
        pool1.request() // or: new sql.Request(pool1)
        .input("cardNumber", sql.VarChar(20), cardNumber)
        .query(queryStr, (err, result) => {
            if(err){
              logger.error(err);
              reject(fncName + err);
            }else {
              resolve(result.recordset);
            }
        })
      })
      pool1.on('error', err => {
        logger.error(err);
        resolve(err);
      })
  });
};

const getFC_Children = (cardNumber) => {
  return new Promise((resolve, reject) => {
      var fncName = 'getFC_Address() ';

      const sql = require('mssql')
      // var queryStr = `
      // SELECT
      //   [childCardNumber] AS cardNumber,
      //   [identificationCardType] AS cardType,
      //   [passportCountry] AS passportCountry,
      //   [idCardExpiryDate] AS cardExpDate,
      //   [title] AS title,
      //   [thFirstName] AS firstName,
      //   [thLastName] AS lastName,
      //   [birthDate] AS dob
      // FROM [MIT_FC_CUST_CHILDREN]
      // WHERE cardNumber=@cardNumber  `;

      var queryStr = `
      SELECT
        *
      FROM [MIT_FC_CUST_CHILDREN]
      WHERE cardNumber=@cardNumber  `;

      const pool1 = new sql.ConnectionPool(config, err => {
        pool1.request() // or: new sql.Request(pool1)
        .input("cardNumber", sql.VarChar(20), cardNumber)
        .query(queryStr, (err, result) => {
            if(err){
              logger.error(err);
              reject(fncName + err);
            }else {
              resolve(result.recordset);
            }
        })
      })
      pool1.on('error', err => {
        logger.error(err);
        resolve(err);
      })
  });
};


const getORG_Address = (cardNumber,seq) => {
  return new Promise((resolve, reject) => {
      var fncName = 'getFC_Address() ';

      const sql = require('mssql')
      var queryStr = `SELECT *
      FROM [MIT_CUST_ADDR]
      WHERE cardNumber=@cardNumber AND Addr_Seq=@Addr_Seq `;

      const pool1 = new sql.ConnectionPool(config, err => {
        pool1.request() // or: new sql.Request(pool1)
        .input("cardNumber", sql.VarChar(20), cardNumber)
        .input("Addr_Seq", sql.VarChar(20), seq)
        .query(queryStr, (err, result) => {
            if(err){
              logger.error(err);
              reject(fncName + err);
            }else {
              resolve(result.recordset);
            }
        })
      })
      pool1.on('error', err => {
        logger.error(err);
        resolve(err);
      })
  });
};


const getFC_Address = (cardNumber,seq) => {
  return new Promise((resolve, reject) => {
      var fncName = 'getFC_Address() ';

      const sql = require('mssql')
      var queryStr = `SELECT A.*
      ,ISNULL(A.[no],'') +' '+ISNULL(A.building,'')+' ชั้น' + ISNULL(a.[floor],'') +' '+ ISNULL(a.soi, '') +'ถ.'  +ISNULL(a.road,'') +' '+ISNULL(A.moo,'') + ' ' +ISNULL(A.subDistrict,'') +' '+ ISNULL(A.subDistrict,'') +' '+
ISNULL(A.province,'') +' '+ ISNULL(A.postalCode,'') AS printTxt
      FROM [MIT_FC_CUST_ADDR] A
      WHERE A.cardNumber=@cardNumber AND A.Addr_Seq=@Addr_Seq `;

      const pool1 = new sql.ConnectionPool(config, err => {
        pool1.request() // or: new sql.Request(pool1)
        .input("cardNumber", sql.VarChar(20), cardNumber)
        .input("Addr_Seq", sql.VarChar(20), seq)
        .query(queryStr, (err, result) => {
            if(err){
              logger.error(err);
              reject(fncName + err);
            }else {
              resolve(result.recordset);
            }
        })
      })
      pool1.on('error', err => {
        logger.error(err);
        resolve(err);
      })
  });
};


/**
 Parameter
   mftsCustInfo;
   fcCustInfo;

 Return:
  0:succesful;
  9:error;
 */
exports.approveCustInfo = (req, res, next) => {

  console.log("approveCustInfo()" );

  // var mftsCustInfoObj = JSON.parse(req.body.mftsCustInfo)
  var fcCustInfoObj = JSON.parse(req.body.fcCustInfo)
  var actionBy = req.body.actionBy;

// VALIDATE data

// CONVERT data.
// Card_Type
  switch (fcCustInfoObj.identificationCardType) {
    case 'CITIZEN_CARD':
      fcCustInfoObj.Card_Type = 'C';
      break;
    case 'PASSPORT':
      fcCustInfoObj.Card_Type = 'P';
      break;
    default:
      fcCustInfoObj.Card_Type = '';
  }

// GENDER
  switch (fcCustInfoObj.gender) {
    case 'Male':
      fcCustInfoObj.Sex = 'M';
      break;
    case 'Female':
      fcCustInfoObj.Sex = 'F';
      break;
    default:
      fcCustInfoObj.Sex = '';
  }

  fnArray=[];
  fnArray.push(update_CustomerInfo(fcCustInfoObj,actionBy));

  if(fcCustInfoObj.residence)
    fnArray.push(update_Address(fcCustInfoObj.residence,1,actionBy));

  if(fcCustInfoObj.current)
    fnArray.push(update_Address(fcCustInfoObj.current,2,actionBy));

  if(fcCustInfoObj.work)
    fnArray.push(update_Address(fcCustInfoObj.work,3,actionBy));

  //Update Children
    for (var i in fcCustInfoObj.children) {
        if(fcCustInfoObj.children[i])
          fnArray.push(update_Children(fcCustInfoObj.children[i],actionBy));
    }

  //ACCOUNT
  fnArray.push(update_CustAccountInDB(fcCustInfoObj.cardNumber,actionBy));

  //BANK ACCOUNT
  fnArray.push(update_CustBankInDB(fcCustInfoObj.cardNumber,actionBy));

  fnArray.push(update_SuitInDB(fcCustInfoObj.cardNumber,actionBy));



  Promise.all(fnArray)
  .then(data => {

    // console.log("approveCustInfo()" + JSON.stringify(data));
      res.status(200).json(data[0]);
  })
  .catch(error => {
    logger.error(error.message)
    res.status(401).json(error.message);
  });

}

// exports.approveCustInfo = (req, res, next) => {

//   console.log("approveCustInfo()");

//   // var mftsCustInfoObj = JSON.parse(req.body.mftsCustInfo)
//   var fcCustInfoObj = JSON.parse(req.body.fcCustInfo)
//   var actionBy = req.body.actionBy;

// // VALIDATE data

// // CONVERT data.
// // Card_Type
//   switch (fcCustInfoObj.identificationCardType) {
//     case 'CITIZEN_CARD':
//       fcCustInfoObj.Card_Type = 'C';
//       break;
//     case 'PASSPORT':
//       fcCustInfoObj.Card_Type = 'P';
//       break;
//     default:
//       fcCustInfoObj.Card_Type = '';
//   }

// // GENDER
//   switch (fcCustInfoObj.gender) {
//     case 'Male':
//       fcCustInfoObj.Sex = 'M';
//       break;
//     case 'Female':
//       fcCustInfoObj.Sex = 'F';
//       break;
//     default:
//       fcCustInfoObj.Sex = '';
//   }

//   // console.log("approveCustInfo()" + actionBy + " ;OBJ>" + JSON.stringify(fcCustInfoObj));
//   update_CustomerInfo(fcCustInfoObj,actionBy).then( (data) =>{
//     res.status(200).json(data);
//   },err=>{
//     res.status(401).json(err);
//   });

// }


function update_CustomerInfo(custObj,actionBy){

  // console.log("update_CustomerInfo()" +JSON.stringify(custObj));

  var queryStr = `
  BEGIN TRANSACTION TranName;

    DECLARE  @Nation_Code VARCHAR(10);

    SELECT @Nation_Code=Nation_Code
    FROM REF_Nations
    WHERE SET_Code= @SET_Code

    Update Account_Info SET
    Card_Type=@Card_Type
    ,First_Name_T=@First_Name_T
    ,Last_Name_T=@Last_Name_T
    ,Title_Name_E=@Title_Name_E
    ,First_Name_E=@First_Name_E
    ,Last_Name_E=@Last_Name_E
    ,Birth_Day=@Birth_Day
    ,Nation_Code=@Nation_Code
    ,Email=@Email
    ,Mobile=@Mobile
    ,Sex=@Sex
    WHERE Cust_Code=@Cust_Code

    -- Extension
    UPDATE MIT_ACCOUNT_INFO_EXT SET
    occupationId = @occupationId
    ,occupationOther=@occupationOther
    ,businessTypeId=@businessTypeId
    ,businessTypeOther=@businessTypeOther
    ,monthlyIncomeLevel=@monthlyIncomeLevel
    ,incomeSource=@incomeSource
    ,incomeSourceOther=@incomeSourceOther
    ,companyName=@companyName
    ,passportCountry=@passportCountry
    ,titleOther=@titleOther
    ,cardExpiryDate=@cardExpiryDate
    ,maritalStatus=@maritalStatus
    ,SPidentificationCardType=@SPidentificationCardType
    ,SPpassportCountry=@SPpassportCountry
    ,SPcardNumber=@SPcardNumber
    ,SPtitle=@SPtitle
    ,SPtitleOther=@SPtitleOther
    ,SPthFirstName=@SPthFirstName
    ,SPthLastName=@SPthLastName
    ,SPidCardExpiryDate=@SPidCardExpiryDate
    ,SPphoneNumber=@SPphoneNumber
    ,committedMoneyLaundering=@committedMoneyLaundering
    ,politicalRelatedPerson=@politicalRelatedPerson
    ,rejectFinancialTransaction=@rejectFinancialTransaction
    ,confirmTaxDeduction=@confirmTaxDeduction
    ,cddScore=@cddScore
    ,cddDate=@cddDate
    ,canAcceptDerivativeInvestment=@canAcceptDerivativeInvestment
    ,canAcceptFxRisk=@canAcceptFxRisk
    ,accompanyingDocument=@accompanyingDocument
    ,referalPerson=@referalPerson
    ,applicationDate=@applicationDate
    ,incomeSourceCountry=@incomeSourceCountry
    ,acceptBy=@acceptBy
    ,openFundConnextFormFlag=@openFundConnextFormFlag
    ,approved=@approved
    ,vulnerableFlag=@vulnerableFlag
    ,vulnerableDetail=@vulnerableDetail
    ,ndidFlag=@ndidFlag
    ,ndidRequestId=@ndidRequestId
    ,suitabilityRiskLevel=@suitabilityRiskLevel
    ,suitabilityEvaluationDate=@suitabilityEvaluationDate
    ,fatca=@fatca
    ,fatcaDeclarationDate=@fatcaDeclarationDate
    ,workAddressSameAsFlag=@workAddressSameAsFlag
    ,currentAddressSameAsFlag=@currentAddressSameAsFlag
    ,UpdateBy=@actionBy
    ,UpdateDate=getDate()
    ,MpamApproveBy =@actionBy
    ,MpamApproveDate=getDate()
    WHERE cardNumber=@cardNumber

    IF @@ROWCOUNT=0
    BEGIN
      INSERT INTO  MIT_ACCOUNT_INFO_EXT (cardNumber
        ,occupationId
        ,occupationOther
        ,businessTypeId
        ,businessTypeOther
        ,monthlyIncomeLevel
        ,incomeSource
        ,incomeSourceOther
        ,companyName
        ,passportCountry
        ,titleOther
        ,cardExpiryDate
        ,maritalStatus
        ,SPidentificationCardType
        ,SPpassportCountry
        ,SPcardNumber
        ,SPtitle
        ,SPtitleOther
        ,SPthFirstName
        ,SPthLastName
        ,SPidCardExpiryDate
        ,SPphoneNumber
        ,committedMoneyLaundering
        ,politicalRelatedPerson
        ,rejectFinancialTransaction
        ,confirmTaxDeduction
        ,cddScore
        ,cddDate
        ,canAcceptDerivativeInvestment
        ,canAcceptFxRisk
        ,accompanyingDocument
        ,referalPerson
        ,applicationDate
        ,incomeSourceCountry
        ,acceptBy
        ,openFundConnextFormFlag
        ,approved
        ,vulnerableFlag
        ,vulnerableDetail
        ,ndidFlag
        ,ndidRequestId
        ,suitabilityRiskLevel
        ,suitabilityEvaluationDate
        ,fatca
        ,fatcaDeclarationDate
        ,workAddressSameAsFlag
        ,currentAddressSameAsFlag
        ,CreateBy
        ,CreateDate
        ,MpamApproveBy
        ,MpamApproveDate
        )
      VALUES(@cardNumber
        ,@occupationId
        ,@occupationOther
        ,@businessTypeId
        ,@businessTypeOther
        ,@monthlyIncomeLevel
        ,@incomeSource
        ,@incomeSourceOther
        ,@companyName
        ,@passportCountry
        ,@titleOther
        ,@cardExpiryDate
        ,@maritalStatus
        ,@SPidentificationCardType
        ,@SPpassportCountry
        ,@SPcardNumber
        ,@SPtitle
        ,@SPtitleOther
        ,@SPthFirstName
        ,@SPthLastName
        ,@SPidCardExpiryDate
        ,@SPphoneNumber
        ,@committedMoneyLaundering
        ,@politicalRelatedPerson
        ,@rejectFinancialTransaction
        ,@confirmTaxDeduction
        ,@cddScore
        ,@cddDate
        ,@canAcceptDerivativeInvestment
        ,@canAcceptFxRisk
        ,@accompanyingDocument
        ,@referalPerson
        ,@applicationDate
        ,@incomeSourceCountry
        ,@acceptBy
        ,@openFundConnextFormFlag
        ,@approved
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

        ,@actionBy
        ,getDate()

        ,@actionBy  --MpamApproveBy
        ,getDate()  --MpamApproveDate
        )
        END

      COMMIT TRANSACTION TranName;
  `;

  const sql = require('mssql')

  return new Promise(function(resolve, reject) {
    const pool1 = new sql.ConnectionPool(config, err => {
      pool1.request()
      .input("Cust_Code", sql.VarChar(20), custObj.cardNumber)
      .input("Card_Type", sql.VarChar(10), custObj.Card_Type)
      .input("First_Name_T", sql.NVarChar(100), custObj.thFirstName)
      .input("Last_Name_T", sql.NVarChar(100), custObj.thLastName)
      .input("Title_Name_E", sql.NVarChar(100), custObj.title)
      .input("First_Name_E", sql.NVarChar(100), custObj.enFirstName)
      .input("Last_Name_E", sql.NVarChar(100), custObj.enLastName)
      .input("Birth_Day", sql.NVarChar(100), custObj.birthDate)
      .input("SET_Code", sql.NVarChar(100), custObj.nationality)
      .input("Email", sql.NVarChar(100), custObj.email)
      .input("Mobile", sql.VarChar(50), custObj.mobileNumber)
      .input("Sex", sql.VarChar(10), custObj.Sex)

      .input("cardNumber", sql.VarChar(20), custObj.cardNumber)
      .input("occupationId", sql.VarChar(10), custObj.occupationId)
      .input("occupationOther", sql.NVarChar(100), custObj.occupationOther)

      .input("businessTypeId", sql.VarChar(3), custObj.businessTypeId)
      .input("businessTypeOther", sql.NVarChar(100), custObj.businessTypeOther)
      .input("monthlyIncomeLevel", sql.VarChar(10), custObj.monthlyIncomeLevel)
      .input("incomeSource", sql.NVarChar(100), custObj.incomeSource)
      .input("incomeSourceOther", sql.NVarChar(100), custObj.incomeSourceOther)
      .input("companyName", sql.NVarChar(100), custObj.companyName)
      .input("passportCountry", sql.VarChar(2), custObj.passportCountry)
      .input("titleOther", sql.NVarChar(100), custObj.titleOther)
      .input("cardExpiryDate", sql.NVarChar(50), custObj.cardExpiryDate)
      .input("maritalStatus", sql.VarChar(10), custObj.maritalStatus)
      .input("SPidentificationCardType", sql.VarChar(15), custObj.SPidentificationCardType)
      .input("SPpassportCountry", sql.VarChar(2), custObj.SPpassportCountry)
      .input("SPcardNumber", sql.VarChar(13), custObj.SPcardNumber)
      .input("SPtitle", sql.VarChar(5), custObj.SPtitle)
      .input("SPtitleOther", sql.VarChar(50), custObj.SPtitleOther)
      .input("SPthFirstName", sql.VarChar(100), custObj.SPthFirstName)
      .input("SPthLastName", sql.VarChar(100), custObj.SPthLastName)
      .input("SPidCardExpiryDate", sql.VarChar(50), custObj.SPidCardExpiryDate)
      .input("SPphoneNumber", sql.VarChar(20), custObj.SPphoneNumber)
      .input("committedMoneyLaundering", sql.VarChar(10), custObj.committedMoneyLaundering)
      .input("politicalRelatedPerson", sql.VarChar(10), custObj.politicalRelatedPerson)
      .input("rejectFinancialTransaction", sql.VarChar(10), custObj.rejectFinancialTransaction)
      .input("confirmTaxDeduction", sql.VarChar(10), custObj.confirmTaxDeduction)
      .input("cddScore", sql.VarChar(1), custObj.cddScore)
      .input("cddDate", sql.VarChar(50), custObj.cddDate)
      .input("canAcceptDerivativeInvestment", sql.VarChar(10), custObj.canAcceptDerivativeInvestment)
      .input("canAcceptFxRisk", sql.VarChar(10), custObj.canAcceptFxRisk)
      .input("accompanyingDocument", sql.VarChar(20), custObj.accompanyingDocument)
      .input("referalPerson", sql.VarChar(100), custObj.referalPerson)
      .input("applicationDate", sql.VarChar(50), custObj.applicationDate)
      .input("incomeSourceCountry", sql.VarChar(2), custObj.incomeSourceCountry)
      .input("acceptBy", sql.VarChar(100), custObj.acceptBy)
      .input("openFundConnextFormFlag", sql.VarChar(10), custObj.openFundConnextFormFlag)
      .input("approved", sql.VarChar(10), custObj.approved)
      .input("vulnerableFlag", sql.VarChar(10), custObj.vulnerableFlag)
      .input("vulnerableDetail", sql.VarChar(100), custObj.vulnerableDetail)
      .input("ndidFlag", sql.VarChar(10), custObj.ndidFlag)
      .input("ndidRequestId", sql.NVarChar(100), custObj.ndidRequestId)
      .input("suitabilityRiskLevel", sql.VarChar(1), custObj.suitabilityRiskLevel)
      .input("suitabilityEvaluationDate", sql.VarChar(50), custObj.suitabilityEvaluationDate)
      .input("fatca", sql.VarChar(10), custObj.fatca)
      .input("fatcaDeclarationDate", sql.VarChar(50), custObj.fatcaDeclarationDate)
      .input("workAddressSameAsFlag", sql.VarChar(20), custObj.workAddressSameAsFlag)
      .input("currentAddressSameAsFlag", sql.VarChar(20), custObj.currentAddressSameAsFlag)

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


function update_Address(addrObj,seq,actionBy){

  // console.log("update_Address()");
  if(!addrObj.soi)
    addrObj.soi= '-';

  var queryStr = `
  BEGIN TRANSACTION TranName;

  DECLARE  @Country_ID VARCHAR(10);
  DECLARE  @Province_ID VARCHAR(10);
  DECLARE  @Amphur_ID VARCHAR(10);
  DECLARE  @Tambon_ID VARCHAR(10);

  select @Country_ID=Country_ID
  from REF_Countrys
  WHERE Country_Code=@country

  select @Province_ID=Province_ID
  from REF_Provinces
  where Name_Thai like '%'+LEFT(@province,6)+'%'

  select @Amphur_ID=Amphur_ID
  from REF_Amphurs
  where Name_Thai like '%'+LEFT(@district,6)+'%'
  AND Province_ID =@Province_ID

  select @Tambon_ID=Tambon_ID
  from REF_Tambons
  where Name_Thai like '%'+LEFT(@subDistrict,6)+'%'
  AND Amphur_ID=@Amphur_ID

  UPDATE Account_Address
  SET[Addr_No]=@no
    ,[Place]=@floor +' '+ @building+' ' +@soi
    ,[Road]=@road
    ,[Tambon_Id]=@Tambon_ID
    ,[Amphur_Id]=@Amphur_ID
    ,[Province_Id]=@Province_ID
    ,[Country_Id]=@Country_ID
    ,[Zip_Code]=@postalCode
    ,[Print_Address]=@printTxt
  WHERE Cust_Code=@cardNumber AND Addr_Seq=@Addr_Seq
  IF @@ROWCOUNT=0
  BEGIN
      INSERT INTO  Account_Address(Cust_Code
      ,Addr_Seq
      ,[Addr_No]
      ,[Place]
      ,[Road]
      ,[Tambon_Id]
      ,[Amphur_Id]
      ,[Province_Id]
      ,[Country_Id]
      ,[Zip_Code]
      ,[Print_Address]
      )
      VALUES(@cardNumber
      ,@Addr_Seq
      ,@no
      ,@floor +' '+ @building+' ' +@soi
      ,@road
      ,@Tambon_ID
      ,@Amphur_ID
      ,@Province_ID
      ,@Country_ID
      ,@postalCode
      ,@printTxt
      )
  END


    -- Extension
    UPDATE MIT_CUST_ADDR SET
     [no]=@no
    ,[floor]=@floor
    ,[building]=@building
    ,[soi]=@soi
    ,[road]=@road
    ,[moo]=@moo
    ,[subDistrict]=@Tambon_ID
    ,[district]=@Amphur_ID
    ,[province]=@Province_ID
    ,[postalCode]=@postalCode
    ,[country]=@country
    ,[phoneNumber]=@phoneNumber
    ,UpdateBy=@actionBy
    ,UpdateDate=getDate()
    WHERE cardNumber=@cardNumber AND Addr_Seq=@Addr_Seq

    IF @@ROWCOUNT=0
    BEGIN
      INSERT INTO  MIT_CUST_ADDR (
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
        ,@Tambon_ID
        ,@Amphur_ID
        ,@Province_ID
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
      .input("cardNumber", sql.VarChar(20), addrObj.cardNumber)
      .input("Addr_Seq", sql.VarChar(1), seq)
      .input("no", sql.NVarChar(100), addrObj.no)
      .input("floor", sql.NVarChar(100), addrObj.floor)
      .input("building", sql.NVarChar(100), addrObj.building)
      .input("soi", sql.NVarChar(100), addrObj.soi)
      .input("road", sql.NVarChar(100), addrObj.road)
      .input("moo", sql.NVarChar(100), addrObj.moo)
      .input("subDistrict", sql.NVarChar(100), addrObj.subDistrict)
      .input("district", sql.NVarChar(100), addrObj.district)
      .input("province", sql.NVarChar(100), addrObj.province)
      .input("postalCode", sql.NVarChar(100), addrObj.postalCode)
      .input("country", sql.NVarChar(100), addrObj.country)
      .input("phoneNumber", sql.NVarChar(100), addrObj.phoneNumber)
      .input("printTxt", sql.NVarChar(200), addrObj.printTxt)
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

function update_Children(childrenObj,actionBy){

  // console.log("update_Children()" + JSON.stringify(childrenObj));

  var queryStr = `
  BEGIN TRANSACTION TranName;

    UPDATE MIT_CUST_CHILDREN SET
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
      INSERT INTO  MIT_CUST_CHILDREN (
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
      .input("cardNumber", sql.VarChar(20), childrenObj.cardNumber)
      .input("childCardNumber", sql.VarChar(20), childrenObj.childCardNumber)
      .input("identificationCardType", sql.VarChar(20), childrenObj.identificationCardType)
      .input("passportCountry", sql.VarChar(20), childrenObj.passportCountry)
      .input("idCardExpiryDate", sql.VarChar(50), childrenObj.idCardExpiryDate)
      .input("title", sql.VarChar(20), childrenObj.title)
      .input("thFirstName", sql.NVarChar(100), childrenObj.thFirstName)
      .input("thLastName", sql.NVarChar(100), childrenObj.thLastName)
      .input("birthDate", sql.VarChar(50), childrenObj.birthDate)
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


function update_SuitInDB(cardNumber,actionBy){

  // console.log("update_AccountInDB()" + cardNumber);
  const sql = require('mssql')

  var queryStr = `

    BEGIN TRANSACTION TranName;

    MERGE MIT_CUST_SUIT AS target
        USING (SELECT * FROM MIT_FC_CUST_SUIT WHERE cardNumber= @cardNumber )AS source
        ON (target.cardNumber = source.cardNumber )
        WHEN MATCHED THEN
            UPDATE SET target.suitNo1 = source.suitNo1
            ,target.suitNo2 = source.suitNo2
            ,target.suitNo3 = source.suitNo3
            ,target.suitNo4 = source.suitNo4
            ,target.suitNo5 = source.suitNo5
            ,target.suitNo6 = source.suitNo6
            ,target.suitNo7 = source.suitNo7
            ,target.suitNo8 = source.suitNo8
            ,target.suitNo9 = source.suitNo9
            ,target.suitNo10 = source.suitNo10
            ,target.suitNo11 = source.suitNo11
            ,target.suitNo12 = source.suitNo12
            ,target.CreateBy = @actionBy
            ,target.CreateDate = getDate()
        WHEN NOT MATCHED THEN
            INSERT (cardNumber,suitNo1,suitNo2,suitNo3,suitNo4,suitNo5,suitNo6,suitNo7,suitNo8,suitNo9,suitNo10,suitNo11,suitNo12, CreateBy,CreateDate)
            VALUES (source.cardNumber,source.suitNo1,source.suitNo2,source.suitNo3,source.suitNo4,source.suitNo5,source.suitNo6,source.suitNo7,source.suitNo8,source.suitNo9,source.suitNo10
            ,source.suitNo11,source.suitNo12,@actionBy,getDate())   ;

    COMMIT TRANSACTION TranName;

  `;

  return new Promise(function(resolve, reject) {
    const pool1 = new sql.ConnectionPool(config, err => {
      pool1.request()
      .input("cardNumber", sql.VarChar(20), cardNumber)
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


function update_CustAccountInDB(cardNumber,actionBy){

  // console.log("update_AccountInDB()" + cardNumber);
  const sql = require('mssql')

  var queryStr = `

    BEGIN TRANSACTION TranName;

    DECLARE @AccountCursor as CURSOR;

    DECLARE @accountId as VARCHAR(20);
    DECLARE @icLicense as VARCHAR(20);
    DECLARE @accountOpenDate as VARCHAR(50);
    DECLARE @investmentObjective as NVARCHAR(50);
    DECLARE @investmentObjectiveOther as NVARCHAR(50);
    DECLARE @approvedDate as VARCHAR(50);
    DECLARE @mailingAddressSameAsFlag as NVARCHAR(50);
    DECLARE @openOmnibusFormFlag as VARCHAR(10);

    SET @AccountCursor = CURSOR FOR
    select accountId
      ,[icLicense]
      ,[accountOpenDate]
      ,[investmentObjective]
      ,[investmentObjectiveOther]
      ,[approvedDate]
      ,[mailingAddressSameAsFlag]
      ,[openOmnibusFormFlag]
    FROM MIT_FC_CUST_ACCOUNT where cardNumber= @cardNumber;

    OPEN @AccountCursor;

    FETCH NEXT FROM @AccountCursor INTO @accountId,@icLicense,@accountOpenDate,@investmentObjective,@investmentObjectiveOther,@approvedDate,@mailingAddressSameAsFlag,@openOmnibusFormFlag;

    WHILE @@FETCH_STATUS = 0
    BEGIN

    UPDATE MIT_CUST_ACCOUNT SET
            [icLicense]=@icLicense
            ,[accountOpenDate]=@accountOpenDate
            ,[investmentObjective]=@investmentObjective
            ,[investmentObjectiveOther]=@investmentObjectiveOther
            ,[approvedDate]=@approvedDate
            ,[mailingAddressSameAsFlag]=@mailingAddressSameAsFlag
            ,[openOmnibusFormFlag]=@openOmnibusFormFlag
        ,UpdateBy=@actionBy
        ,UpdateDate=getDate()
        WHERE cardNumber=@cardNumber AND accountId=@accountId

        IF @@ROWCOUNT=0
        BEGIN
          INSERT INTO  MIT_CUST_ACCOUNT (
            cardNumber
            ,[accountId]
            ,[icLicense]
            ,[accountOpenDate]
            ,[investmentObjective]
            ,[investmentObjectiveOther]
            ,[approvedDate]
            ,[mailingAddressSameAsFlag]
            ,[openOmnibusFormFlag]
            ,[CreateBy]
            ,[CreateDate]
            )
          VALUES(
            @cardNumber
            ,@accountId
            ,@icLicense
            ,@accountOpenDate
            ,@investmentObjective
            ,@investmentObjectiveOther
            ,@approvedDate
            ,@mailingAddressSameAsFlag
            ,@openOmnibusFormFlag
            ,@actionBy
            ,getDate()
            )
        END;

      FETCH NEXT FROM @AccountCursor INTO @accountId,@icLicense,@accountOpenDate,@investmentObjective,@investmentObjectiveOther,@approvedDate,@mailingAddressSameAsFlag,@openOmnibusFormFlag;
    END
    CLOSE @AccountCursor;
    DEALLOCATE @AccountCursor;

    COMMIT TRANSACTION TranName;

  `;

  return new Promise(function(resolve, reject) {
    const pool1 = new sql.ConnectionPool(config, err => {
      pool1.request()
      .input("cardNumber", sql.VarChar(20), cardNumber)
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



function update_CustBankInDB(cardNumber,actionBy){

  // console.log("update_AccountInDB()" + cardNumber);
  const sql = require('mssql')

  var queryStr = `

  BEGIN TRANSACTION TranName;

  DECLARE @BankCursor as CURSOR;

  DECLARE @accType as VARCHAR(10);
  DECLARE @accountId as VARCHAR(20);
  DECLARE @bankCode as VARCHAR(10);
  DECLARE @bankBranchCode as VARCHAR(10);
  DECLARE @bankAccountNo as VARCHAR(20);
  DECLARE @default as VARCHAR(10);
  DECLARE @finnetCustomerNo as VARCHAR(50);

  SET @BankCursor = CURSOR FOR
  SELECT
    [accType]
    ,[accountId]
    ,[bankCode]
    ,[bankBranchCode]
    ,[bankAccountNo]
    ,[default]
    ,[finnetCustomerNo]
  FROM MIT_FC_CUST_BANK where cardNumber= @cardNumber;

  OPEN @BankCursor;

  FETCH NEXT FROM @BankCursor INTO @accType,@accountId,@bankCode,@bankBranchCode,@bankAccountNo,@default,@finnetCustomerNo;

  WHILE @@FETCH_STATUS = 0
  BEGIN

   UPDATE MIT_CUST_BANK SET
    [accType]=@accType
    ,[bankCode]=@bankCode
    ,[bankBranchCode]=@bankBranchCode
    ,[bankAccountNo]=@bankAccountNo
    ,[default]=@default
    ,[finnetCustomerNo]=@finnetCustomerNo
      ,UpdateBy=@actionBy
      ,UpdateDate=getDate()
      WHERE cardNumber=@cardNumber
    AND bankAccountNo=@bankAccountNo
    AND accType=@accType

      IF @@ROWCOUNT=0
      BEGIN
        INSERT INTO  MIT_CUST_BANK (
       cardNumber
      ,[accType]
      ,[accountId]
      ,[bankCode]
      ,[bankBranchCode]
      ,[bankAccountNo]
      ,[default]
      ,[finnetCustomerNo]
          ,[CreateBy]
          ,[CreateDate]
          )
        VALUES(
       @cardNumber
          ,@accType
      ,@accountId
      ,@bankCode
      ,@bankBranchCode
      ,@bankAccountNo
      ,@default
      ,@finnetCustomerNo
          ,@actionBy
          ,getDate()
          )
      END;

    FETCH NEXT FROM @BankCursor INTO @accType,@accountId,@bankCode,@bankBranchCode,@bankAccountNo,@default,@finnetCustomerNo;
   END

  CLOSE @BankCursor;
  DEALLOCATE @BankCursor;

  COMMIT TRANSACTION TranName;

  `;

  return new Promise(function(resolve, reject) {
    const pool1 = new sql.ConnectionPool(config, err => {
      pool1.request()
      .input("cardNumber", sql.VarChar(20), cardNumber)
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


function update_Account(accObj,actionBy){

  console.log("update_Account()" + JSON.stringify(childrenObj));
  const sql = require('mssql')

  var queryStr = `
  BEGIN TRANSACTION TranName;

    UPDATE MIT_CUST_ACCOUNT SET
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
      INSERT INTO  MIT_CUST_ACCOUNT (
        cardNumber
        ,[accountId]
        ,[icLicense]
        ,[accountOpenDate]
        ,[investmentObjective]
        ,[investmentObjectiveOther]
        ,[approvedDate]
        ,[mailingAddressSameAsFlag]
        ,[openOmnibusFormFlag]
        ,[CreateBy]
        [CreateDate]
        )
      VALUES(
        @cardNumber
        ,@accountId
        ,@icLicense
        ,@accountOpenDate
        ,@investmentObjective
        ,@investmentObjectiveOther
        ,@approvedDate
        ,@mailingAddressSameAsFlag
        ,@openOmnibusFormFlag
        ,@actionBy
        ,getDate()
        )
        END

      COMMIT TRANSACTION TranName;
  `;

  return new Promise(function(resolve, reject) {
    const pool1 = new sql.ConnectionPool(config, err => {
      pool1.request()
      .input("cardNumber", sql.VarChar(20), accObj.cardNumber)
      .input("accountId", sql.VarChar(20), accObj.accountId)
      .input("icLicense", sql.VarChar(20), accObj.icLicense)
      .input("accountOpenDate", sql.VarChar(50), accObj.accountOpenDate)
      .input("investmentObjective", sql,NVarChar(50), accObj.investmentObjective)
      .input("investmentObjectiveOther", sql.NVarChar(50), accObj.investmentObjectiveOther)
      .input("approvedDate", sql.VarChar(50), accObj.approvedDate)
      .input("mailingAddressSameAsFlag", sql.VarChar(50), accObj.mailingAddressSameAsFlag)
      .input("openOmnibusFormFlag", sql.VarChar(10), accObj.openOmnibusFormFlag)
      .input("actionBy", sql.VarChar(50), actionBy)
      .query(queryStr, (err, result) => {

        console.log(JSON.stringify(result));
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

function getMFTS_CustomerInfo(custCode){

  var fncName = 'getMFTS_CustomerInfo() ';

  var queryStr = `select *
  FROM [Account_Info]
  WHERE Cust_Code= @Cust_Code`;
  const sql = require('mssql')

  return new Promise(function(resolve, reject) {

  const pool1 = new sql.ConnectionPool(config, err => {
    pool1.request() // or: new sql.Request(pool1)
    .input("Cust_Code", sql.VarChar(20), custCode)
    .query(queryStr, (err, result) => {
        if(err){
          logger.error(err);
          reject(fncName + err);
        }else {

          resolve(result.recordset);
        }
    })
  })
  pool1.on('error', err => {
    logger.error(err);
  })
  });
}

function getMFTS_CustomerInfoExt(cardNumber){

  var fncName = 'getMFTS_CustomerInfoExt() ';

  var queryStr = `
    SELECT *
    FROM MIT_ACCOUNT_INFO_EXT
    WHERE cardNumber= @cardNumber
  `;

  const sql = require('mssql')
  return new Promise(function(resolve, reject) {

  const pool1 = new sql.ConnectionPool(config, err => {
    pool1.request() // or: new sql.Request(pool1)
    .input("cardNumber", sql.VarChar(20), cardNumber)
    .query(queryStr, (err, result) => {
        if(err){
          logger.error(err);
          reject(fncName + err);
        }else {

          resolve(result.recordset);
        }
    })
  })
  pool1.on('error', err => {
    logger.error(err);
  })
  });
}

function getFC_CustomerInfo(cardNumber){

  var fncName = 'getFcCustomerInfo() ';

  var queryStr = `select *
  FROM [MIT_FC_CUST_INFO]
  WHERE cardNumber=@cardNumber `;

  const sql = require('mssql')

  return new Promise(function(resolve, reject) {

  const pool1 = new sql.ConnectionPool(config, err => {
    pool1.request() // or: new sql.Request(pool1)
    .input("cardNumber", sql.VarChar(20), cardNumber)
    .query(queryStr, (err, result) => {
        if(err){
          logger.error(err);
          reject(fncName + err);
        }else {

          resolve(result.recordset);
        }
    })
  })

  pool1.on('error', err => {
    logger.error(err);
  })


  });
}

exports.CreateCustomer = (req, res, next) => {
  console.log("CreateCustomer>>" );
  var customerObj = JSON.parse(req.body.customer);
  var ceAddressObj = JSON.parse(req.body.ceAddress);
  var maAddressObj = JSON.parse(req.body.maAddress);

  var accountInfoQuery = accountInfoQuery(customerObj);
  var getAccountAddrQuery_1 = addressQuery(customerObj.Cust_Code,1,ceAddressObj);
  var getAccountAddrQuery_2 = addressQuery(customerObj.Cust_Code,2,maAddressObj);

  var executeQueryList = [accountInfoQuery, getAccountAddrQuery_1 ,getAccountAddrQuery_2]
  const sql = require("mssql");
  const pool1 = new sql.ConnectionPool(config, err => {

  executeQueryList.forEach(function(element) {

    // Start Account Info Transaction 1
    var accInfoTransaction = new sql.Transaction(pool1);
    accInfoTransaction.begin(function(err) {
      var requestAccountInfo = new sql.Request(accInfoTransaction);

      requestAccountInfo.query(element, function(err, recordset) {
        if (err) {
          // console.log("Was error !!", err);
          accInfoTransaction.rollback(err => {
             res.status(400).json({
                message: 'Create Customer fail'
              });
          });
        } else {
          accInfoTransaction.commit(err => {
            // console.log("Cmmited !");
             res.status(201).json({
              message: 'Customer create successfully'
            });
          });
        }
      });
    });
    // End Account Info Transaction 1

  }); // ENd loop

  });
  pool1.on("error", err => {
    console.log("EROR>>" + err);
    pool1.close();
  });
};

exports.UpdateCustomer = (req, res, next) => {

};

// *************** Functions
function  accountInfoQuery(customerObj){
  var v_Cust_Code = customerObj.Cust_Code;
  var v_DOB = customerObj.Birth_Day;

  return `INSERT INTO  [Account_Info]
        VALUES(
        '${v_Cust_Code}'
        ,'${validStr(customerObj.Card_Type)}'
        ,'${validStr(customerObj.Group_Code)}'
        ,'${validStr(customerObj.Title_Name_T)}'
        ,'${validStr(customerObj.First_Name_T)}'
        ,'${validStr(customerObj.Last_Name_T)}'
        ,'${validStr(customerObj.Title_Name_E)}'
        ,'${validStr(customerObj.First_Name_E)}'
        ,'${validStr(customerObj.Last_Name_E)}'
         , CONVERT(datetime, '${v_DOB}')
        ,'${validStr(customerObj.Nation_Code)}'
        ,'${validStr(customerObj.Sex)}'
        ,'${validStr(customerObj.Tax_No)}'
        ,'${validStr(customerObj.Mobile)}'
        ,'${validStr(customerObj.Email)}'
        ,'${validStr(customerObj.MktId, 0)}'
        ,'${validStr(customerObj.Create_By)}'
        , CURRENT_TIMESTAMP
        ,'${validStr(customerObj.Modify_By)}'
        , NULL
        ,'${validStr(customerObj.IT_SentRepByEmail)}'
        );`;
}


function  addressQuery(v_Cust_Code,v_Addr_Seq,ceAddressObj){

  return  `INSERT INTO [Account_Address]
        VALUES(
        '${v_Cust_Code}'
        ,${v_Addr_Seq}
        ,'${validStr(ceAddressObj.Addr_No)}'
        ,'${validStr(ceAddressObj.Place)}'
        ,'${validStr(ceAddressObj.Road)}'
        ,'${validStr(ceAddressObj.Tambon_Id)}'
        ,'${validStr(ceAddressObj.Amphur_Id)}'
        ,'${validStr(ceAddressObj.Province_Id)}'
        ,'${validStr(ceAddressObj.Country_Id)}'
        ,'${validStr(ceAddressObj.Zip_Code)}'
        ,'${validStr(ceAddressObj.Print_Address)}'
        ,'${validStr(ceAddressObj.Tel)}'
        ,'${validStr(ceAddressObj.Fax)}'
        )`;
}
// *************** Utilities
function validStr(val, defaultVal = "") {
  if (val !== undefined && val !== null) {
    // v has a value
    return val;
  } else {
    // v does not have a value
    return defaultVal;
  }
}



// exports.getCDDinfo = (req, res, next) => {

//   var fncName = 'getCustomer';
//   var _custCode = req.params.cusCode;

//   logger.info( `API /cddInfo - ${req.originalUrl} - ${req.ip} - ${_custCode}`);

//   var queryStr = `
//   BEGIN

//   select top 1 a.Cust_Code,a.Title_Name_T,a.First_Name_T,a.Last_Name_T,a.Birth_Day,a.Mobile,a.Email
//   ,b.Account_No,b.Occupation_Code,b.Occupation_Desc
// ,b.Position_Code,b.Position,b.Politician_Desc
// ,b.BusinessType_Code
// ,b.Income,b.Income_Code,b.Income_Source,b.Income_Source_Code
// ,b.Modify_Date
//   FROM [Account_Info] a
//   left join MFTS_Account b on b.Account_No like a.Cust_Code
//   WHERE Cust_Code= @custCode
//   order by b.Modify_Date desc

//   END
//   `;

//   const sql = require('mssql')
//   const pool1 = new sql.ConnectionPool(config, err => {
//     pool1.request() // or: new sql.Request(pool1)
//     .input('custCode', sql.VarChar(50), _custCode)
//     .query(queryStr, (err, result) => {
//         // ... error checks
//         if(err){
//           console.log( fncName +' Quey db. Was err !!!' + err);
//           res.status(201).json({
//             message: err,
//           });
//         }else {
//           res.status(200).json({
//             message: fncName + "Quey db. successfully!",
//             result: result.recordset
//           });
//         }
//     })
//   })

//   pool1.on('error', err => {
//     // ... error handler
//     console.log("EROR>>"+err);
//   })
// }


// exports.saveCDDInfo = (req, res, next) => {

//   var fncName = 'saveCDDInfo';
//   var custCode = req.body.custCode

//   var actionBy = req.body.actionBy
//   var pid = req.body.pid
//   var title = req.body.title
//   var firstName = req.body.firstName
//   var lastName = req.body.lastName
//   var dob = req.body.dob
//   var email = req.body.email
//   var occupation = req.body.occupation
//   var position = req.body.position
//   var typeBusiness = req.body.typeBusiness
//   var incomeLevel = req.body.incomeLevel
//   var incomeSource = req.body.incomeSource

//   logger.info( `POST API /cddInfo - ${req.originalUrl} - ${req.ip} - ${custCode}`);


//   var queryStr = `
//   BEGIN
//   END
//   `;

//   const sql = require('mssql')
//   const pool1 = new sql.ConnectionPool(config, err => {
//     pool1.request() // or: new sql.Request(pool1)
//     // .input('custCode', sql.VarChar(50), _custCode)
//     .query(queryStr, (err, result) => {
//         // ... error checks
//         if(err){
//           console.log( fncName +' Quey db. Was err !!!' + err);
//           res.status(201).json({
//             message: err,
//           });
//         }else {
//           res.status(200).json({
//             message: fncName + "Quey db. successfully!",
//             result: result.recordset
//           });
//         }
//     })
//   })

//   pool1.on('error', err => {
//     // ... error handler
//     console.log("EROR>>"+err);
//   })
// }
