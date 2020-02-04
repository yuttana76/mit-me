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

exports.getFC_CustomerInfo = (req, res, next) => {

  var custCode = req.params.cusCode;

  getFC_CustomerInfo(custCode).then( (data) =>{
    res.status(200).json({
      result: data
    });
  },err=>{
    res.status(401).json(err);
  });

}

/**
 Parameter
   mftsCustInfo;
   fcCustInfo;

 Return:
  0:succesful;
  9:error;
 */
exports.approveCustInfo = (req, res, next) => {

  console.log("approveCustInfo()");

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

  console.log("approveCustInfo()" + actionBy + " ;OBJ>" + JSON.stringify(fcCustInfoObj));
  update_CustomerInfo(fcCustInfoObj,actionBy).then( (data) =>{
    res.status(200).json(data);
  },err=>{
    res.status(401).json(err);
  });

}


function update_CustomerInfo(custObj,actionBy){

  console.log("update_CustomerInfo()" );

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
        ,CreateDate)
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
        ,getDate())

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
