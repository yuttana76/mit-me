const mpamConfig = require('../config/mpam-config');
var config = mpamConfig.dbParameters;

var logger = require('../config/winston');

exports.testAPI = (req, res, next) => {


  fnArray=[];
  fnArray.push(update_MFTS_Account('1770300019400','999'));
  Promise.all(fnArray)
  .then(data => {
      res.status(200).json('Test successful');
  })
  .catch(error => {
    logger.error(error.message)
    res.status(401).json(error.message);
  });

}

exports.searchCustomers = (req, res, next) => {
  var fncName = "searchCustomers";

  var numPerPage = parseInt(req.query.pagesize, 10) || 10;
  var page = parseInt(req.query.page, 10) || 1;
  var custId = req.query.cust_id || false;
  var cust_name = req.query.cust_name || false;
  var whereCond = "";


  var queryStr = `
  BEGIN
  DECLARE  @Cust_Code VARCHAR(20) ='${custId}';

  SELECT * FROM (
  SELECT ROW_NUMBER() OVER(ORDER BY Cust_Code) AS NUMBER
  ,Cust_Code,Title_Name_T,First_Name_T,Last_Name_T,Group_Code,Birth_Day
  FROM [Account_Info] WHERE Cust_Code =@Cust_Code

    ) AS TBL
  WHERE NUMBER BETWEEN ((${page} - 1) * ${numPerPage} + 1) AND (${page} * ${numPerPage})
  ORDER BY Cust_Code

  IF @@ROWCOUNT=0 BEGIN
  SELECT * FROM (
      SELECT ROW_NUMBER() OVER(ORDER BY cardNumber) AS NUMBER
      ,cardNumber AS Cust_Code,' (New) ' + title AS Title_Name_T,thFirstName AS First_Name_T ,thLastName AS Last_Name_T ,'1' AS Group_Code,birthDate AS Birth_Day
      FROM [MIT_FC_CUST_INFO] WHERE cardNumber =@Cust_Code

    ) AS TBL
  WHERE NUMBER BETWEEN ((${page} - 1) * ${numPerPage} + 1) AND (${page} * ${numPerPage})
  ORDER BY Cust_Code

  END
END
    `;


    // console.log('QUERY>' + queryStr);
  //   if (custId !== false) {
  //     whereCond = `Cust_Code = '${custId}'`;
  //     // whereCond = `Cust_Code like '%${custId}%'`;
  //   } else {
  //     whereCond = `First_Name_T like N'%${cust_name}%'`;
  //   }


  // var queryStr = `SELECT * FROM (
  //   SELECT ROW_NUMBER() OVER(ORDER BY Cust_Code) AS NUMBER,
  //          * FROM [Account_Info] WHERE ${whereCond}
  //     ) AS TBL
  //   WHERE NUMBER BETWEEN ((${page} - 1) * ${numPerPage} + 1) AND (${page} * ${numPerPage})
  //   ORDER BY Cust_Code`;

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

          // console.log('Query result>>' + JSON.stringify(result.recordsets[0].length !=0?result.recordsets[0]:result.recordsets[1]))
          res.status(200).json({
            message: fncName + "Quey db. successfully!",
            result: result.recordsets[0].length !=0?result.recordsets[0]:result.recordsets[1]
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

  // console.log('getCustomer()' + custCode)

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

  console.log('getORG_CustomerInfo() > ' + custCode)

  fnArray=[];
  fnArray.push(getMFTS_CustomerInfo(custCode));
  fnArray.push(getMFTS_CustomerInfoExt(custCode));
  fnArray.push(getORG_Address(custCode,1));
  fnArray.push(getORG_Address(custCode,2));
  fnArray.push(getORG_Address(custCode,3));
  fnArray.push(getORG_Children(custCode));

  Promise.all(fnArray).then(values => {

    // console.log('getORG_CustomerInfo(RS) >' + JSON.stringify(values))

      // if ( typeof values[0][0] !== 'undefined' && values[0][0] )
      if ( typeof values[0][0] === 'undefined' )  {
        res.status(204).json({msg:'Not fund Data'});

      }else{

        custInfo=values[0][0];
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

      }
  })
  .catch(error => {
    logger.error(error.message)
    res.status(500).json(error.message);
  });

}

exports.getFC_CustomerInfo = (req, res, next) => {

  var custCode = req.params.cusCode;

  // console.log('getFC_CustomerInfo() > ' + custCode)

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
      var fncName = 'getORG_Children() ';

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
      var fncName = 'getFC_Children() ';

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
      var fncName = 'getORG_Address() ';

      const sql = require('mssql')
      var queryStr = `SELECT
      A.Addr_No,
      [Place],
      [Road],

      [Tambon_Id],
      [Amphur_Id],
      [Province_Id],
      [Country_Id],
      [Zip_Code],
      [Print_Address] AS printTxt,
      [Tel],
      [Fax]
      FROM [Account_Address] A
      WHERE Cust_Code=@cardNumber AND Addr_Seq=@Addr_Seq
      `;

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
      var queryStr = `
      SELECT
      ISNULL(' '+A.[no],'') +' '+ISNULL(' '+A.building,'')+ISNULL(' ชั้น ' + a.[floor],'') +' '+ ISNULL(' ซ.'+a.soi, '')
      +ISNULL(' ถ.'+ a.road,'')
      +ISNULL(' หมู่'+A.moo,'')
      +ISNULL(' '+A.subDistrict,'')
      +ISNULL(' '+A.subDistrict,'')
      +ISNULL(' '+A.province,'')
      +ISNULL(' '+A.postalCode,'') AS printTxt
      ,A.*
      FROM [MIT_FC_CUST_ADDR] A
      WHERE A.cardNumber=@cardNumber AND A.Addr_Seq=@Addr_Seq
      `;

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
  fcCustInfoObj.Group_code='1';

  switch (fcCustInfoObj.title) {
    case 'MR':
      fcCustInfoObj.Title_Name_T = 'นาย';
      break;
    case 'MRS':
      fcCustInfoObj.Title_Name_T = 'นาง';
      break;
    case 'MISS':
      fcCustInfoObj.Title_Name_T = 'นางสาว';
      break;
    case 'OTHER':
      fcCustInfoObj.Title_Name_T = fcCustInfoObj.titleOther;
      break;
    default:
      fcCustInfoObj.Title_Name_T = 'อื่นๆ';
  }

  fcCustInfoObj.IT_SentRepByEmail='Y'

  fcCustInfoObj.IT_FundConnext='Y'

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
  //Updat customer & suit
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
  fnArray.push(update_MFTS_Suit(fcCustInfoObj.cardNumber,actionBy));
  //Suit by  account

  Promise.all(fnArray)
  .then(data => {

    // update_MFTS_Suit_Detail(fcCustInfoObj.cardNumber,actionBy).then(data =>{
    //   res.status(200).json(data);
    // })

    //  res.status(200).json(data[0]);

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

  // Convert Refer code 6 charactors
  var referalPerson = ""


  if(custObj.referalPerson){
    custObj.referalPerson = custObj.referalPerson.replace(/\s/g, '');// remove sapce
    referalPerson = custObj.referalPerson.substr(0, 6);
  }

  // Convert Date split 10 charactors
  if(custObj.birthDate)
    custObj.birthDate = custObj.birthDate.substr(0, 10);

  if(custObj.SPidCardExpiryDate)
    custObj.SPidCardExpiryDate = custObj.SPidCardExpiryDate.substr(0, 10);

  if(custObj.cddDate)
    custObj.cddDate = custObj.cddDate.substr(0, 10);

  if(custObj.applicationDate)
    custObj.applicationDate = custObj.applicationDate.substr(0, 10);

  if(custObj.suitabilityEvaluationDate)
    custObj.suitabilityEvaluationDate = custObj.suitabilityEvaluationDate.substr(0, 10);

  if(custObj.fatcaDeclarationDate)
    custObj.fatcaDeclarationDate = custObj.fatcaDeclarationDate.substr(0, 10);

  // Convert Boolean
  if(custObj.committedMoneyLaundering ==true){
    custObj.committedMoneyLaundering = '1'
  }else if(custObj.committedMoneyLaundering ==false){
    custObj.committedMoneyLaundering = '0'
  }

  // politicalRelatedPerson
  if(custObj.politicalRelatedPerson ==true){
    custObj.politicalRelatedPerson = '1'
  }else if(custObj.politicalRelatedPerson ==false){
    custObj.politicalRelatedPerson = '0'
  }

  // rejectFinancialTransaction
  if(custObj.rejectFinancialTransaction ==true){
    custObj.rejectFinancialTransaction = '1'
  }else if(custObj.rejectFinancialTransaction ==false){
    custObj.rejectFinancialTransaction = '0'
  }
  // confirmTaxDeduction
  if(custObj.confirmTaxDeduction ==true){
    custObj.confirmTaxDeduction = '1'
  }else if(custObj.confirmTaxDeduction ==false){
    custObj.confirmTaxDeduction = '0'
  }
  // canAcceptDerivativeInvestment
  if(custObj.canAcceptDerivativeInvestment ==true){
    custObj.canAcceptDerivativeInvestment = '1'
  }else if(custObj.canAcceptDerivativeInvestment ==false){
    custObj.canAcceptDerivativeInvestment = '0'
  }
  // canAcceptFxRisk
  if(custObj.canAcceptFxRisk ==true){
    custObj.canAcceptFxRisk = '1'
  }else if(custObj.canAcceptFxRisk ==false){
    custObj.canAcceptFxRisk = '0'
  }

  // openFundConnextFormFlag
  if(custObj.openFundConnextFormFlag ==true){
    custObj.openFundConnextFormFlag = '1'
  }else if(custObj.openFundConnextFormFlag ==false){
    custObj.openFundConnextFormFlag = '0'
  }

  // vulnerableFlag
  if(custObj.vulnerableFlag ==true){
    custObj.vulnerableFlag = '1'
  }else if(custObj.vulnerableFlag ==false){
    custObj.vulnerableFlag = '0'
  }

  // ndidFlag
  if(custObj.ndidFlag ==true){
    custObj.ndidFlag = '1'
  }else if(custObj.ndidFlag ==false){
    custObj.ndidFlag = '0'
  }

  // fatca
  if(custObj.fatca ==true){
    custObj.fatca = '1'
  }else if(custObj.fatca ==false){
    custObj.fatca = '0'
  }

  var queryStr = `
  BEGIN TRANSACTION TranName;

    DECLARE  @Nation_Code VARCHAR(10);
    DECLARE  @Create_By VARCHAR(20);
    DECLARE  @MktId VARCHAR(20);

    SELECT @Nation_Code=Nation_Code
    FROM REF_Nations
    WHERE SET_Code= @SET_Code


    --MktId
    select  @MktId=Id from MFTS_SalesCode
    where License_Code=@IT_SAcode

    --#BACKUP DATA
    DECLARE  @actionByInt int =999;
    DECLARE  @OLD_DATA  NVARCHAR(100);

    --Card_Type
    SELECT @OLD_DATA = Card_Type FROM Account_Info WHERE Cust_Code =@Cust_Code
    IF @OLD_DATA <> @Card_Type AND @@ROWCOUNT>0
    BEGIN
        INSERT INTO IT_Cust_Change_Log (Ref_No,Change_Type,OldData,NewData,Change_DateTime,Change_By)
        VALUES (@Cust_Code,'Card_Type',@OLD_DATA,@Card_Type,GETDATE(),@actionByInt);
    END;

    -- First_Name_T
    SELECT @OLD_DATA = First_Name_T FROM Account_Info WHERE Cust_Code =@Cust_Code
    IF @OLD_DATA <> @First_Name_T AND @@ROWCOUNT>0
    BEGIN
        INSERT INTO IT_Cust_Change_Log (Ref_No,Change_Type,OldData,NewData,Change_DateTime,Change_By)
        VALUES (@Cust_Code,'First_Name_T',@Old_data,@First_Name_T,GETDATE(),@actionByInt);
    END;

    -- Last_Name_T
    SELECT @OLD_DATA = Last_Name_T FROM Account_Info WHERE Cust_Code =@Cust_Code
    IF @OLD_DATA <> @Last_Name_T AND @@ROWCOUNT>0
    BEGIN
        INSERT INTO IT_Cust_Change_Log (Ref_No,Change_Type,OldData,NewData,Change_DateTime,Change_By)
        VALUES (@Cust_Code,'Last_Name_T',@Old_data,@Last_Name_T,GETDATE(),@actionByInt);
    END;

    -- Title_Name_E
    SELECT @OLD_DATA = Title_Name_E FROM Account_Info WHERE Cust_Code =@Cust_Code
    IF @OLD_DATA <> @Title_Name_E AND @@ROWCOUNT>0
    BEGIN
        INSERT INTO IT_Cust_Change_Log (Ref_No,Change_Type,OldData,NewData,Change_DateTime,Change_By)
        VALUES (@Cust_Code,'Title_Name_E',@Old_data,@Title_Name_E,GETDATE(),@actionByInt);
    END;

    -- First_Name_E
    SELECT @OLD_DATA = First_Name_E FROM Account_Info WHERE Cust_Code =@Cust_Code
    IF @OLD_DATA <> @First_Name_E AND @@ROWCOUNT>0
    BEGIN
        INSERT INTO IT_Cust_Change_Log (Ref_No,Change_Type,OldData,NewData,Change_DateTime,Change_By)
        VALUES (@Cust_Code,'First_Name_E',@Old_data,@First_Name_E,GETDATE(),@actionByInt);
    END;

    -- Last_Name_E
    SELECT @OLD_DATA = Last_Name_E FROM Account_Info WHERE Cust_Code =@Cust_Code
    IF @OLD_DATA <> @Last_Name_E AND @@ROWCOUNT>0
    BEGIN
        INSERT INTO IT_Cust_Change_Log (Ref_No,Change_Type,OldData,NewData,Change_DateTime,Change_By)
        VALUES (@Cust_Code,'Last_Name_E',@Old_data,@Last_Name_E,GETDATE(),@actionByInt);
    END;

    -- Birth_Day
    SELECT @OLD_DATA =  convert(varchar, ISNULL(Birth_Day,''), 23) FROM Account_Info WHERE Cust_Code =@Cust_Code
    IF CONVERT(DATE, @OLD_DATA) <> CONVERT(DATE, @Birth_Day) AND @@ROWCOUNT>0
    BEGIN
        INSERT INTO IT_Cust_Change_Log (Ref_No,Change_Type,OldData,NewData,Change_DateTime,Change_By)
        VALUES (@Cust_Code,'Birth_Day',@Old_data,@Birth_Day,GETDATE(),@actionByInt);
    END;

    -- Nation_Code
    SELECT @OLD_DATA = Nation_Code FROM Account_Info WHERE Cust_Code =@Cust_Code
    IF @OLD_DATA <> @Nation_Code AND @@ROWCOUNT>0
    BEGIN
        INSERT INTO IT_Cust_Change_Log (Ref_No,Change_Type,OldData,NewData,Change_DateTime,Change_By)
        VALUES (@Cust_Code,'Nation_Code',@Old_data,@Nation_Code,GETDATE(),@actionByInt);
    END;

    -- Email
    SELECT @OLD_DATA = Email FROM Account_Info WHERE Cust_Code =@Cust_Code
    IF @OLD_DATA <> @Email AND @@ROWCOUNT>0
    BEGIN
        INSERT INTO IT_Cust_Change_Log (Ref_No,Change_Type,OldData,NewData,Change_DateTime,Change_By)
        VALUES (@Cust_Code,'Email',@Old_data,@Email,GETDATE(),@actionByInt);
    END;

    -- Mobile
    SELECT @OLD_DATA = Email FROM Account_Info WHERE Cust_Code =@Cust_Code
    IF @OLD_DATA <> @Email AND @@ROWCOUNT>0
    BEGIN
        INSERT INTO IT_Cust_Change_Log (Ref_No,Change_Type,OldData,NewData,Change_DateTime,Change_By)
        VALUES (@Cust_Code,'Email',@Old_data,@Email,GETDATE(),@actionByInt);
    END;

    -- Sex
    SELECT @OLD_DATA = Sex FROM Account_Info WHERE Cust_Code =@Cust_Code
    IF @OLD_DATA <> @Sex AND @@ROWCOUNT>0
    BEGIN
        INSERT INTO IT_Cust_Change_Log (Ref_No,Change_Type,OldData,NewData,Change_DateTime,Change_By)
        VALUES (@Cust_Code,'Sex',@Old_data,@Sex,GETDATE(),@actionByInt);
    END;

    -- #MIT_ACCOUNT_INFO_EXT
    --occupationId = @occupationId
    SELECT @OLD_DATA = occupationId FROM MIT_ACCOUNT_INFO_EXT WHERE cardNumber =@Cust_Code
    IF @OLD_DATA <> @occupationId AND @@ROWCOUNT>0
    BEGIN
        INSERT INTO IT_Cust_Change_Log (Ref_No,Change_Type,OldData,NewData,Change_DateTime,Change_By)
        VALUES (@Cust_Code,'occupationId',@Old_data,@occupationId,GETDATE(),@actionByInt);
    END;

        -- ,occupationOther=@occupationOther
    SELECT @OLD_DATA = occupationOther FROM MIT_ACCOUNT_INFO_EXT WHERE cardNumber =@Cust_Code
    IF @OLD_DATA <> @occupationOther AND @@ROWCOUNT>0
    BEGIN
        INSERT INTO IT_Cust_Change_Log (Ref_No,Change_Type,OldData,NewData,Change_DateTime,Change_By)
        VALUES (@Cust_Code,'occupationOther',@Old_data,@occupationOther,GETDATE(),@actionByInt);
    END;

        -- ,businessTypeId=@businessTypeId
    SELECT @OLD_DATA = businessTypeId FROM MIT_ACCOUNT_INFO_EXT WHERE cardNumber =@Cust_Code
    IF @OLD_DATA <> @businessTypeId AND @@ROWCOUNT>0
    BEGIN
        INSERT INTO IT_Cust_Change_Log (Ref_No,Change_Type,OldData,NewData,Change_DateTime,Change_By)
        VALUES (@Cust_Code,'businessTypeId',@Old_data,@businessTypeId,GETDATE(),@actionByInt);
    END;

        -- ,businessTypeOther=@businessTypeOther
    SELECT @OLD_DATA = businessTypeOther FROM MIT_ACCOUNT_INFO_EXT WHERE cardNumber =@Cust_Code
    IF @OLD_DATA <> @businessTypeOther AND @@ROWCOUNT>0
    BEGIN
        INSERT INTO IT_Cust_Change_Log (Ref_No,Change_Type,OldData,NewData,Change_DateTime,Change_By)
        VALUES (@Cust_Code,'businessTypeOther',@Old_data,@businessTypeOther,GETDATE(),@actionByInt);
    END;

        -- ,monthlyIncomeLevel=@monthlyIncomeLevel
    SELECT @OLD_DATA = monthlyIncomeLevel FROM MIT_ACCOUNT_INFO_EXT WHERE cardNumber =@Cust_Code
    IF @OLD_DATA <> @monthlyIncomeLevel AND @@ROWCOUNT>0
    BEGIN
        INSERT INTO IT_Cust_Change_Log (Ref_No,Change_Type,OldData,NewData,Change_DateTime,Change_By)
        VALUES (@Cust_Code,'monthlyIncomeLevel',@Old_data,@monthlyIncomeLevel,GETDATE(),@actionByInt);
    END;

        -- ,incomeSource=@incomeSource
    SELECT @OLD_DATA = incomeSource FROM MIT_ACCOUNT_INFO_EXT WHERE cardNumber =@Cust_Code
    IF @OLD_DATA <> @incomeSource AND @@ROWCOUNT>0
    BEGIN
        INSERT INTO IT_Cust_Change_Log (Ref_No,Change_Type,OldData,NewData,Change_DateTime,Change_By)
        VALUES (@Cust_Code,'incomeSource',@Old_data,@incomeSource,GETDATE(),@actionByInt);
    END;

        -- ,incomeSourceOther=@incomeSourceOther
    SELECT @OLD_DATA = incomeSourceOther FROM MIT_ACCOUNT_INFO_EXT WHERE cardNumber =@Cust_Code
    IF @OLD_DATA <> @incomeSourceOther AND @@ROWCOUNT>0
    BEGIN
        INSERT INTO IT_Cust_Change_Log (Ref_No,Change_Type,OldData,NewData,Change_DateTime,Change_By)
        VALUES (@Cust_Code,'incomeSourceOther',@Old_data,@incomeSourceOther,GETDATE(),@actionByInt);
    END;

        -- ,companyName=@companyName
    SELECT @OLD_DATA = companyName FROM MIT_ACCOUNT_INFO_EXT WHERE cardNumber =@Cust_Code
    IF @OLD_DATA <> @companyName AND @@ROWCOUNT>0
    BEGIN
        INSERT INTO IT_Cust_Change_Log (Ref_No,Change_Type,OldData,NewData,Change_DateTime,Change_By)
        VALUES (@Cust_Code,'companyName',@Old_data,@companyName,GETDATE(),@actionByInt);
    END;

        -- ,passportCountry=@passportCountry
    SELECT @OLD_DATA = passportCountry FROM MIT_ACCOUNT_INFO_EXT WHERE cardNumber =@Cust_Code
    IF @OLD_DATA <> @passportCountry AND @@ROWCOUNT>0
    BEGIN
        INSERT INTO IT_Cust_Change_Log (Ref_No,Change_Type,OldData,NewData,Change_DateTime,Change_By)
        VALUES (@Cust_Code,'passportCountry',@Old_data,@passportCountry,GETDATE(),@actionByInt);
    END;

        -- ,titleOther=@titleOther
    SELECT @OLD_DATA = titleOther FROM MIT_ACCOUNT_INFO_EXT WHERE cardNumber =@Cust_Code
    IF @OLD_DATA <> @titleOther AND @@ROWCOUNT>0
    BEGIN
        INSERT INTO IT_Cust_Change_Log (Ref_No,Change_Type,OldData,NewData,Change_DateTime,Change_By)
        VALUES (@Cust_Code,'titleOther',@Old_data,@titleOther,GETDATE(),@actionByInt);
    END;

    -- ,cardExpiryDate=@cardExpiryDate
    SELECT @OLD_DATA =  convert(varchar, cardExpiryDate, 23) FROM MIT_ACCOUNT_INFO_EXT WHERE cardNumber =@Cust_Code
    IF CONVERT(DATE, @OLD_DATA) <> CONVERT(DATE, @cardExpiryDate) AND @@ROWCOUNT>0
    BEGIN
        INSERT INTO IT_Cust_Change_Log (Ref_No,Change_Type,OldData,NewData,Change_DateTime,Change_By)
        VALUES (@Cust_Code,'cardExpiryDate',@Old_data,@cardExpiryDate,GETDATE(),@actionByInt);
    END;

        -- ,maritalStatus=@maritalStatus
    SELECT @OLD_DATA = maritalStatus FROM MIT_ACCOUNT_INFO_EXT WHERE cardNumber =@Cust_Code
    IF @OLD_DATA <> @maritalStatus AND @@ROWCOUNT>0
    BEGIN
        INSERT INTO IT_Cust_Change_Log (Ref_No,Change_Type,OldData,NewData,Change_DateTime,Change_By)
        VALUES (@Cust_Code,'maritalStatus',@Old_data,@maritalStatus,GETDATE(),@actionByInt);
    END;

        -- ,SPidentificationCardType=@SPidentificationCardType
    SELECT @OLD_DATA = SPidentificationCardType FROM MIT_ACCOUNT_INFO_EXT WHERE cardNumber =@Cust_Code
    IF @OLD_DATA <> @SPidentificationCardType AND @@ROWCOUNT>0
    BEGIN
        INSERT INTO IT_Cust_Change_Log (Ref_No,Change_Type,OldData,NewData,Change_DateTime,Change_By)
        VALUES (@Cust_Code,'SPidentificationCardType',@Old_data,@SPidentificationCardType,GETDATE(),@actionByInt);
    END;

        -- ,SPpassportCountry=@SPpassportCountry
    SELECT @OLD_DATA = SPpassportCountry FROM MIT_ACCOUNT_INFO_EXT WHERE cardNumber =@Cust_Code
    IF @OLD_DATA <> @SPpassportCountry AND @@ROWCOUNT>0
    BEGIN
        INSERT INTO IT_Cust_Change_Log (Ref_No,Change_Type,OldData,NewData,Change_DateTime,Change_By)
        VALUES (@Cust_Code,'SPpassportCountry',@Old_data,@SPpassportCountry,GETDATE(),@actionByInt);
    END;

        -- ,SPcardNumber=@SPcardNumber
    SELECT @OLD_DATA = SPcardNumber FROM MIT_ACCOUNT_INFO_EXT WHERE cardNumber =@Cust_Code
    IF @OLD_DATA <> @SPcardNumber AND @@ROWCOUNT>0
    BEGIN
        INSERT INTO IT_Cust_Change_Log (Ref_No,Change_Type,OldData,NewData,Change_DateTime,Change_By)
        VALUES (@Cust_Code,'SPcardNumber',@Old_data,@SPcardNumber,GETDATE(),@actionByInt);
    END;

        -- ,SPtitle=@SPtitle
    SELECT @OLD_DATA = SPtitle FROM MIT_ACCOUNT_INFO_EXT WHERE cardNumber =@Cust_Code
    IF @OLD_DATA <> @SPtitle AND @@ROWCOUNT>0
    BEGIN
        INSERT INTO IT_Cust_Change_Log (Ref_No,Change_Type,OldData,NewData,Change_DateTime,Change_By)
        VALUES (@Cust_Code,'SPtitle',@Old_data,@SPtitle,GETDATE(),@actionByInt);
    END;

        -- ,SPtitleOther=@SPtitleOther
    SELECT @OLD_DATA = SPtitleOther FROM MIT_ACCOUNT_INFO_EXT WHERE cardNumber =@Cust_Code
    IF @OLD_DATA <> @SPtitleOther AND @@ROWCOUNT>0
    BEGIN
        INSERT INTO IT_Cust_Change_Log (Ref_No,Change_Type,OldData,NewData,Change_DateTime,Change_By)
        VALUES (@Cust_Code,'SPtitleOther',@Old_data,@SPtitleOther,GETDATE(),@actionByInt);
    END;

        -- ,SPthFirstName=@SPthFirstName
    SELECT @OLD_DATA = SPthFirstName FROM MIT_ACCOUNT_INFO_EXT WHERE cardNumber =@Cust_Code
    IF @OLD_DATA <> @SPthFirstName AND @@ROWCOUNT>0
    BEGIN
        INSERT INTO IT_Cust_Change_Log (Ref_No,Change_Type,OldData,NewData,Change_DateTime,Change_By)
        VALUES (@Cust_Code,'SPthFirstName',@Old_data,@SPthFirstName,GETDATE(),@actionByInt);
    END;

        -- ,SPthLastName=@SPthLastName
    SELECT @OLD_DATA = SPthLastName FROM MIT_ACCOUNT_INFO_EXT WHERE cardNumber =@Cust_Code
    IF @OLD_DATA <> @SPthLastName AND @@ROWCOUNT>0
    BEGIN
        INSERT INTO IT_Cust_Change_Log (Ref_No,Change_Type,OldData,NewData,Change_DateTime,Change_By)
        VALUES (@Cust_Code,'SPthLastName',@Old_data,@SPthLastName,GETDATE(),@actionByInt);
    END;

        -- ,SPidCardExpiryDate=@SPidCardExpiryDate
    SELECT @OLD_DATA = SPidCardExpiryDate FROM MIT_ACCOUNT_INFO_EXT WHERE cardNumber =@Cust_Code
    IF @OLD_DATA <> @SPidCardExpiryDate AND @@ROWCOUNT>0
    BEGIN
        INSERT INTO IT_Cust_Change_Log (Ref_No,Change_Type,OldData,NewData,Change_DateTime,Change_By)
        VALUES (@Cust_Code,'SPidCardExpiryDate',@Old_data,@SPidCardExpiryDate,GETDATE(),@actionByInt);
    END;

        -- ,SPphoneNumber=@SPphoneNumber
    SELECT @OLD_DATA = SPphoneNumber FROM MIT_ACCOUNT_INFO_EXT WHERE cardNumber =@Cust_Code
    IF @OLD_DATA <> @SPphoneNumber AND @@ROWCOUNT>0
    BEGIN
        INSERT INTO IT_Cust_Change_Log (Ref_No,Change_Type,OldData,NewData,Change_DateTime,Change_By)
        VALUES (@Cust_Code,'SPphoneNumber',@Old_data,@SPphoneNumber,GETDATE(),@actionByInt);
    END;

        -- ,committedMoneyLaundering=@committedMoneyLaundering
    SELECT @OLD_DATA = committedMoneyLaundering FROM MIT_ACCOUNT_INFO_EXT WHERE cardNumber =@Cust_Code
    IF @OLD_DATA <> @committedMoneyLaundering AND @@ROWCOUNT>0
    BEGIN
        INSERT INTO IT_Cust_Change_Log (Ref_No,Change_Type,OldData,NewData,Change_DateTime,Change_By)
        VALUES (@Cust_Code,'committedMoneyLaundering',@Old_data,@committedMoneyLaundering,GETDATE(),@actionByInt);
    END;

        -- ,politicalRelatedPerson=@politicalRelatedPerson
    SELECT @OLD_DATA = politicalRelatedPerson FROM MIT_ACCOUNT_INFO_EXT WHERE cardNumber =@Cust_Code
    IF @OLD_DATA <> @politicalRelatedPerson AND @@ROWCOUNT>0
    BEGIN
        INSERT INTO IT_Cust_Change_Log (Ref_No,Change_Type,OldData,NewData,Change_DateTime,Change_By)
        VALUES (@Cust_Code,'politicalRelatedPerson',@Old_data,@politicalRelatedPerson,GETDATE(),@actionByInt);
    END;

        -- ,rejectFinancialTransaction=@rejectFinancialTransaction
    SELECT @OLD_DATA = rejectFinancialTransaction FROM MIT_ACCOUNT_INFO_EXT WHERE cardNumber =@Cust_Code
    IF @OLD_DATA <> @rejectFinancialTransaction AND @@ROWCOUNT>0
    BEGIN
        INSERT INTO IT_Cust_Change_Log (Ref_No,Change_Type,OldData,NewData,Change_DateTime,Change_By)
        VALUES (@Cust_Code,'rejectFinancialTransaction',@Old_data,@rejectFinancialTransaction,GETDATE(),@actionByInt);
    END;

        -- ,confirmTaxDeduction=@confirmTaxDeduction
    SELECT @OLD_DATA = confirmTaxDeduction FROM MIT_ACCOUNT_INFO_EXT WHERE cardNumber =@Cust_Code
    IF @OLD_DATA <> @confirmTaxDeduction AND @@ROWCOUNT>0
    BEGIN
        INSERT INTO IT_Cust_Change_Log (Ref_No,Change_Type,OldData,NewData,Change_DateTime,Change_By)
        VALUES (@Cust_Code,'confirmTaxDeduction',@Old_data,@confirmTaxDeduction,GETDATE(),@actionByInt);
    END;

        -- ,cddScore=@cddScore
    SELECT @OLD_DATA = cddScore FROM MIT_ACCOUNT_INFO_EXT WHERE cardNumber =@Cust_Code
    IF @OLD_DATA <> @cddScore AND @@ROWCOUNT>0
    BEGIN
        INSERT INTO IT_Cust_Change_Log (Ref_No,Change_Type,OldData,NewData,Change_DateTime,Change_By)
        VALUES (@Cust_Code,'cddScore',@Old_data,@cddScore,GETDATE(),@actionByInt);
    END;

        -- ,cddDate=@cddDate
    SELECT @OLD_DATA =  convert(varchar, ISNULL(cddDate,''), 23) FROM MIT_ACCOUNT_INFO_EXT WHERE cardNumber =@Cust_Code
    IF @OLD_DATA <> @cddDate AND @@ROWCOUNT>0
    BEGIN
        INSERT INTO IT_Cust_Change_Log (Ref_No,Change_Type,OldData,NewData,Change_DateTime,Change_By)
        VALUES (@Cust_Code,'cddDate',@Old_data,@cddDate,GETDATE(),@actionByInt);
    END;


        -- ,canAcceptDerivativeInvestment=@canAcceptDerivativeInvestment
    SELECT @OLD_DATA = canAcceptDerivativeInvestment FROM MIT_ACCOUNT_INFO_EXT WHERE cardNumber =@Cust_Code
    IF @OLD_DATA <> @canAcceptDerivativeInvestment AND @@ROWCOUNT>0
    BEGIN
        INSERT INTO IT_Cust_Change_Log (Ref_No,Change_Type,OldData,NewData,Change_DateTime,Change_By)
        VALUES (@Cust_Code,'canAcceptDerivativeInvestment',@Old_data,@canAcceptDerivativeInvestment,GETDATE(),@actionByInt);
    END;

        -- ,canAcceptFxRisk=@canAcceptFxRisk
    SELECT @OLD_DATA = canAcceptFxRisk FROM MIT_ACCOUNT_INFO_EXT WHERE cardNumber =@Cust_Code
    IF @OLD_DATA <> @canAcceptFxRisk AND @@ROWCOUNT>0
    BEGIN
        INSERT INTO IT_Cust_Change_Log (Ref_No,Change_Type,OldData,NewData,Change_DateTime,Change_By)
        VALUES (@Cust_Code,'canAcceptFxRisk',@Old_data,@canAcceptFxRisk,GETDATE(),@actionByInt);
    END;

        -- ,accompanyingDocument=@accompanyingDocument
    SELECT @OLD_DATA = accompanyingDocument FROM MIT_ACCOUNT_INFO_EXT WHERE cardNumber =@Cust_Code
    IF @OLD_DATA <> @accompanyingDocument AND @@ROWCOUNT>0
    BEGIN
        INSERT INTO IT_Cust_Change_Log (Ref_No,Change_Type,OldData,NewData,Change_DateTime,Change_By)
        VALUES (@Cust_Code,'accompanyingDocument',@Old_data,@accompanyingDocument,GETDATE(),@actionByInt);
    END;

        -- ,referalPerson=@referalPerson
    SELECT @OLD_DATA = referalPerson FROM MIT_ACCOUNT_INFO_EXT WHERE cardNumber =@Cust_Code
    IF @OLD_DATA <> @referalPerson AND @@ROWCOUNT>0
    BEGIN
        INSERT INTO IT_Cust_Change_Log (Ref_No,Change_Type,OldData,NewData,Change_DateTime,Change_By)
        VALUES (@Cust_Code,'referalPerson',@Old_data,@referalPerson,GETDATE(),@actionByInt);
    END;

        -- ,applicationDate=@applicationDate
    SELECT @OLD_DATA =  convert(varchar, ISNULL(applicationDate,''), 23) FROM MIT_ACCOUNT_INFO_EXT WHERE cardNumber =@Cust_Code
    IF @OLD_DATA <> @applicationDate AND @@ROWCOUNT>0
    BEGIN
        INSERT INTO IT_Cust_Change_Log (Ref_No,Change_Type,OldData,NewData,Change_DateTime,Change_By)
        VALUES (@Cust_Code,'applicationDate',@Old_data,@applicationDate,GETDATE(),@actionByInt);
    END;

        -- ,incomeSourceCountry=@incomeSourceCountry
    SELECT @OLD_DATA = incomeSourceCountry FROM MIT_ACCOUNT_INFO_EXT WHERE cardNumber =@Cust_Code
    IF @OLD_DATA <> @incomeSourceCountry AND @@ROWCOUNT>0
    BEGIN
        INSERT INTO IT_Cust_Change_Log (Ref_No,Change_Type,OldData,NewData,Change_DateTime,Change_By)
        VALUES (@Cust_Code,'incomeSourceCountry',@Old_data,@incomeSourceCountry,GETDATE(),@actionByInt);
    END;

        -- ,acceptBy=@acceptBy
    SELECT @OLD_DATA = acceptBy FROM MIT_ACCOUNT_INFO_EXT WHERE cardNumber =@Cust_Code
    IF @OLD_DATA <> @acceptBy AND @@ROWCOUNT>0
    BEGIN
        INSERT INTO IT_Cust_Change_Log (Ref_No,Change_Type,OldData,NewData,Change_DateTime,Change_By)
        VALUES (@Cust_Code,'acceptBy',@Old_data,@acceptBy,GETDATE(),@actionByInt);
    END;

        -- ,openFundConnextFormFlag=@openFundConnextFormFlag
    SELECT @OLD_DATA = openFundConnextFormFlag FROM MIT_ACCOUNT_INFO_EXT WHERE cardNumber =@Cust_Code
    IF @OLD_DATA <> @openFundConnextFormFlag AND @@ROWCOUNT>0
    BEGIN
        INSERT INTO IT_Cust_Change_Log (Ref_No,Change_Type,OldData,NewData,Change_DateTime,Change_By)
        VALUES (@Cust_Code,'openFundConnextFormFlag',@Old_data,@openFundConnextFormFlag,GETDATE(),@actionByInt);
    END;

        -- ,approved=@approved
    SELECT @OLD_DATA = approved FROM MIT_ACCOUNT_INFO_EXT WHERE cardNumber =@Cust_Code
    IF @OLD_DATA <> @approved AND @@ROWCOUNT>0
    BEGIN
        INSERT INTO IT_Cust_Change_Log (Ref_No,Change_Type,OldData,NewData,Change_DateTime,Change_By)
        VALUES (@Cust_Code,'approved',@Old_data,@approved,GETDATE(),@actionByInt);
    END;

        -- ,vulnerableFlag=@vulnerableFlag
    SELECT @OLD_DATA = vulnerableFlag FROM MIT_ACCOUNT_INFO_EXT WHERE cardNumber =@Cust_Code
    IF @OLD_DATA <> @vulnerableFlag AND @@ROWCOUNT>0
    BEGIN
        INSERT INTO IT_Cust_Change_Log (Ref_No,Change_Type,OldData,NewData,Change_DateTime,Change_By)
        VALUES (@Cust_Code,'vulnerableFlag',@Old_data,@vulnerableFlag,GETDATE(),@actionByInt);
    END;

        -- ,vulnerableDetail=@vulnerableDetail
    SELECT @OLD_DATA = vulnerableDetail FROM MIT_ACCOUNT_INFO_EXT WHERE cardNumber =@Cust_Code
    IF @OLD_DATA <> @vulnerableDetail AND @@ROWCOUNT>0
    BEGIN
        INSERT INTO IT_Cust_Change_Log (Ref_No,Change_Type,OldData,NewData,Change_DateTime,Change_By)
        VALUES (@Cust_Code,'vulnerableDetail',@Old_data,@vulnerableDetail,GETDATE(),@actionByInt);
    END;

        -- ,ndidFlag=@ndidFlag
    SELECT @OLD_DATA = ndidFlag FROM MIT_ACCOUNT_INFO_EXT WHERE cardNumber =@Cust_Code
    IF @OLD_DATA <> @ndidFlag AND @@ROWCOUNT>0
    BEGIN
        INSERT INTO IT_Cust_Change_Log (Ref_No,Change_Type,OldData,NewData,Change_DateTime,Change_By)
        VALUES (@Cust_Code,'ndidFlag',@Old_data,@ndidFlag,GETDATE(),@actionByInt);
    END;

        -- ,ndidRequestId=@ndidRequestId
    SELECT @OLD_DATA = ndidRequestId FROM MIT_ACCOUNT_INFO_EXT WHERE cardNumber =@Cust_Code
    IF @OLD_DATA <> @ndidRequestId AND @@ROWCOUNT>0
    BEGIN
        INSERT INTO IT_Cust_Change_Log (Ref_No,Change_Type,OldData,NewData,Change_DateTime,Change_By)
        VALUES (@Cust_Code,'ndidRequestId',@Old_data,@ndidRequestId,GETDATE(),@actionByInt);
    END;

        -- ,suitabilityRiskLevel=@suitabilityRiskLevel
    SELECT @OLD_DATA = suitabilityRiskLevel FROM MIT_ACCOUNT_INFO_EXT WHERE cardNumber =@Cust_Code
    IF @OLD_DATA <> @suitabilityRiskLevel AND @@ROWCOUNT>0
    BEGIN
        INSERT INTO IT_Cust_Change_Log (Ref_No,Change_Type,OldData,NewData,Change_DateTime,Change_By)
        VALUES (@Cust_Code,'suitabilityRiskLevel',@Old_data,@suitabilityRiskLevel,GETDATE(),@actionByInt);
    END;

    --     -- ,suitabilityEvaluationDate=@suitabilityEvaluationDate
    SELECT @OLD_DATA =  convert(varchar, ISNULL(suitabilityEvaluationDate,''), 23) FROM MIT_ACCOUNT_INFO_EXT WHERE cardNumber =@Cust_Code
    IF @OLD_DATA <> @suitabilityEvaluationDate AND @@ROWCOUNT>0
    BEGIN
        INSERT INTO IT_Cust_Change_Log (Ref_No,Change_Type,OldData,NewData,Change_DateTime,Change_By)
        VALUES (@Cust_Code,'suitabilityEvaluationDate',@Old_data,@suitabilityEvaluationDate,GETDATE(),@actionByInt);
    END;

        -- ,fatca=@fatca
    SELECT @OLD_DATA = fatca FROM MIT_ACCOUNT_INFO_EXT WHERE cardNumber =@Cust_Code
    IF @OLD_DATA <> @fatca AND @@ROWCOUNT>0
    BEGIN
        INSERT INTO IT_Cust_Change_Log (Ref_No,Change_Type,OldData,NewData,Change_DateTime,Change_By)
        VALUES (@Cust_Code,'fatca',@Old_data,@fatca,GETDATE(),@actionByInt);
    END;

        -- ,fatcaDeclarationDate=@fatcaDeclarationDate
    SELECT @OLD_DATA =  convert(varchar, ISNULL(fatcaDeclarationDate,''), 23) FROM MIT_ACCOUNT_INFO_EXT WHERE cardNumber =@Cust_Code
    IF @OLD_DATA <> @fatcaDeclarationDate AND @@ROWCOUNT>0
    BEGIN
        INSERT INTO IT_Cust_Change_Log (Ref_No,Change_Type,OldData,NewData,Change_DateTime,Change_By)
        VALUES (@Cust_Code,'fatcaDeclarationDate',@Old_data,@fatcaDeclarationDate,GETDATE(),@actionByInt);
    END;

        -- ,workAddressSameAsFlag=@workAddressSameAsFlag
    SELECT @OLD_DATA = workAddressSameAsFlag FROM MIT_ACCOUNT_INFO_EXT WHERE cardNumber =@Cust_Code
    IF @OLD_DATA <> @workAddressSameAsFlag AND @@ROWCOUNT>0
    BEGIN
        INSERT INTO IT_Cust_Change_Log (Ref_No,Change_Type,OldData,NewData,Change_DateTime,Change_By)
        VALUES (@Cust_Code,'workAddressSameAsFlag',@Old_data,@workAddressSameAsFlag,GETDATE(),@actionByInt);
    END;

        -- ,currentAddressSameAsFlag=@currentAddressSameAsFlag
    SELECT @OLD_DATA = currentAddressSameAsFlag FROM MIT_ACCOUNT_INFO_EXT WHERE cardNumber =@Cust_Code
    IF @OLD_DATA <> @currentAddressSameAsFlag AND @@ROWCOUNT>0
    BEGIN
        INSERT INTO IT_Cust_Change_Log (Ref_No,Change_Type,OldData,NewData,Change_DateTime,Change_By)
        VALUES (@Cust_Code,'currentAddressSameAsFlag',@Old_data,@currentAddressSameAsFlag,GETDATE(),@actionByInt);
    END;

    --#BACKUP DATA

    --Begin Execute
    Update Account_Info SET
    Card_Type=@Card_Type
    ,Group_code=@Group_code
    ,Title_Name_T=@Title_Name_T
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
    ,IT_SAcode=@IT_SAcode
    ,IT_SentRepByEmail=@IT_SentRepByEmail
    ,IT_PID_No=@IT_PID_No
    ,IT_PID_ExpiryDate=@IT_PID_ExpiryDate
    ,Modify_Date=GETDATE()
    WHERE Cust_Code=@Cust_Code

    IF @@ROWCOUNT=0
    BEGIN
        INSERT INTO Account_Info(Cust_Code
          ,Card_Type
          ,Group_code
          ,Title_Name_T
          ,First_Name_T
          ,Last_Name_T
          ,Title_Name_E
          ,First_Name_E
          ,Last_Name_E
          ,Birth_Day
          ,Nation_Code
          ,Email
          ,Mobile
          ,Sex
          ,IT_SAcode
          ,IT_SentRepByEmail
          ,IT_PID_No
          ,IT_PID_ExpiryDate
          ,IT_FundConnext
          ,IT_FundConnextDT
          ,Create_By
          ,Create_Date
      ) VALUES(@Cust_Code
          ,@Card_Type
          ,@Group_code
          ,@Title_Name_T
          ,@First_Name_T
          ,@Last_Name_T
          ,@Title_Name_E
          ,@First_Name_E
          ,@Last_Name_E
          ,@Birth_Day
          ,@Nation_Code
          ,@Email
          ,@Mobile
          ,@Sex
          ,@IT_SAcode
          ,@IT_SentRepByEmail
          ,@IT_PID_No
          ,@IT_PID_ExpiryDate
          ,@IT_FundConnext
          ,GETDATE()
          ,@Create_By
          ,GETDATE()
      )
    END

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
      .input("Group_code", sql.VarChar(20), custObj.Group_code)
      .input("Card_Type", sql.VarChar(10), custObj.Card_Type)
      .input("Title_Name_T", sql.NVarChar(10), custObj.Title_Name_T)
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
      .input("IT_SAcode", sql.NVarChar(20), referalPerson)

      .input("IT_SentRepByEmail", sql.NVarChar(20), custObj.IT_SentRepByEmail)
      .input("IT_PID_No", sql.NVarChar(20), custObj.cardNumber)
      .input("IT_PID_ExpiryDate", sql.NVarChar(50), custObj.cardExpiryDate)
      .input("IT_FundConnext", sql.NVarChar(20), custObj.IT_FundConnext)

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
      .input("SPtitleOther", sql.NVarChar(50), custObj.SPtitleOther)
      .input("SPthFirstName", sql.NVarChar(100), custObj.SPthFirstName)
      .input("SPthLastName", sql.NVarChar(100), custObj.SPthLastName)
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
      .input("referalPerson", sql.NVarChar(100), referalPerson)
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


function update_MFTS_Account(cardNumber,actionBy){

    console.log("update_MFTS_Account()" + cardNumber);

    var queryStr = `
    BEGIN TRANSACTION TranName;

    --DECLARE  @cardNumber VARCHAR(50) ='1770300019400';
    --DECLARE  @actionBy VARCHAR(10) ='99';

    DECLARE  @Ref_No VARCHAR(12)='002';
    DECLARE  @accountId VARCHAR(50);
    DECLARE  @Title_Name_T VARCHAR(10);
    DECLARE  @First_Name_T VARCHAR(100);
    DECLARE  @Last_Name_T VARCHAR(100);
    DECLARE  @Title_Name_E VARCHAR(10);
    DECLARE  @First_Name_E VARCHAR(100);
    DECLARE  @Last_Name_E VARCHAR(100);
    DECLARE  @Birth_Day VARCHAR(50);
    DECLARE  @Sex VARCHAR(10);
    DECLARE  @Email VARCHAR(100);
    DECLARE  @Mobile_No VARCHAR(20);
    DECLARE  @PID_ExpiryDate VARCHAR(20);

    select  @Title_Name_T=title
    ,@First_Name_T=thFirstName
    ,@Last_Name_T=thLastName
    ,@Title_Name_E=title
    ,@First_Name_E=enFirstName
    ,@Last_Name_E=enLastName
    ,@Birth_Day=birthDate
    ,@Sex=gender

    ,@Email=email
    ,@Mobile_No=mobileNumber
    ,@PID_ExpiryDate=cardExpiryDate
    FROM MIT_FC_CUST_INFO
    where cardNumber = @cardNumber

    select  @Sex=case gender
      when 'Female' then 'F'
      when 'Male' then 'M'
      else null
      end
    FROM MIT_FC_CUST_INFO
    where cardNumber = @cardNumber

    select top 1 @accountId = accountId
    from MIT_FC_CUST_ACCOUNT where cardNumber= @cardNumber

    UPDATE MFTS_Account SET
    Title_Name_T=@Title_Name_T
    ,First_Name_T=@First_Name_T
    ,Last_Name_T=@Last_Name_T
    ,Title_Name_E=@Title_Name_E
    ,First_Name_E=@First_Name_E
    ,Last_Name_E=@Last_Name_E
    ,Birth_Day=@Birth_Day
    ,Sex=@Sex
    ,Email=@Email
    ,Mobile_No=@Mobile_No
    ,PID_ExpiryDate=@PID_ExpiryDate
    ,Modify_By=@actionBy
    ,Modify_Date=getDate()
    WHERE Account_No=@accountId AND PID_No=@cardNumber AND Ref_No=@Ref_No

    IF @@ROWCOUNT=0
    BEGIN
        INSERT INTO  MFTS_Account(
        Ref_No
        ,PID_No
        ,Account_No
        ,Title_Name_T
        ,First_Name_T
        ,Last_Name_T
        ,Title_Name_E
        ,First_Name_E
        ,Last_Name_E
        ,Birth_Day
        ,Sex
        ,Email
        ,Mobile_No
        ,PID_ExpiryDate
        ,Create_By
        ,Modify_By
        ,Create_Date
        ,Modify_Date
        )
        VALUES(
        @Ref_No
        ,@cardNumber
        ,@accountId
        ,@Title_Name_T
        ,@First_Name_T
        ,@Last_Name_T
        ,@Title_Name_E
        ,@First_Name_E
        ,@Last_Name_E
        ,@Birth_Day
        ,@Sex
        ,@Email
        ,@Mobile_No
        ,@PID_ExpiryDate
        ,@actionBy
        ,@actionBy
        ,getDate()
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

  -- BACKUP
  DECLARE  @actionByInt int =999;
  DECLARE  @OLD_DATA  NVARCHAR(100);

  -- Addr_No
  SELECT @OLD_DATA = Addr_No FROM Account_Address WHERE Cust_Code=@cardNumber AND Addr_Seq=@Addr_Seq
  IF @OLD_DATA <> @no AND @@ROWCOUNT>0
  BEGIN
      INSERT INTO IT_Cust_Change_Log (Ref_No,Change_Type,OldData,NewData,Change_DateTime,Change_By)
      VALUES (@cardNumber,'Addr_Seq:'+@Addr_Seq+' ;Addr_No',@Old_data,@no,GETDATE(),@actionByInt);
  END;

  -- Place

  -- @Road
  SELECT @OLD_DATA = Road FROM Account_Address WHERE Cust_Code=@cardNumber AND Addr_Seq=@Addr_Seq
  IF @OLD_DATA <> @Road AND @@ROWCOUNT>0
  BEGIN
      INSERT INTO IT_Cust_Change_Log (Ref_No,Change_Type,OldData,NewData,Change_DateTime,Change_By)
      VALUES (@cardNumber,'Addr_Seq:'+@Addr_Seq+' ;Road',@Old_data,@Road,GETDATE(),@actionByInt);
  END;

  -- Tambon_Id
  SELECT @OLD_DATA = Tambon_Id FROM Account_Address WHERE Cust_Code=@cardNumber AND Addr_Seq=@Addr_Seq
  IF @OLD_DATA <> @Tambon_Id AND @@ROWCOUNT>0
  BEGIN
      INSERT INTO IT_Cust_Change_Log (Ref_No,Change_Type,OldData,NewData,Change_DateTime,Change_By)
      VALUES (@cardNumber,'Addr_Seq:'+@Addr_Seq+' ;Tambon_Id',@Old_data,@Tambon_Id,GETDATE(),@actionByInt);
  END;

  -- Amphur_Id
  SELECT @OLD_DATA = Amphur_Id FROM Account_Address WHERE Cust_Code=@cardNumber AND Addr_Seq=@Addr_Seq
  IF @OLD_DATA <> @Amphur_ID AND @@ROWCOUNT>0
  BEGIN
      INSERT INTO IT_Cust_Change_Log (Ref_No,Change_Type,OldData,NewData,Change_DateTime,Change_By)
      VALUES (@cardNumber,'Addr_Seq:'+@Addr_Seq+' ;Amphur_Id',@Old_data,@Amphur_ID,GETDATE(),@actionByInt);
  END;

  -- Province_Id
  SELECT @OLD_DATA = Province_Id FROM Account_Address WHERE Cust_Code=@cardNumber AND Addr_Seq=@Addr_Seq
  IF @OLD_DATA <> @Province_ID AND @@ROWCOUNT>0
  BEGIN
      INSERT INTO IT_Cust_Change_Log (Ref_No,Change_Type,OldData,NewData,Change_DateTime,Change_By)
      VALUES (@cardNumber,'Addr_Seq:'+@Addr_Seq+' ;Province_ID',@Old_data,@Province_ID,GETDATE(),@actionByInt);
  END;

  -- Country_Id
  SELECT @OLD_DATA = Country_Id FROM Account_Address WHERE Cust_Code=@cardNumber AND Addr_Seq=@Addr_Seq
  IF @OLD_DATA <> @Country_ID AND @@ROWCOUNT>0
  BEGIN
      INSERT INTO IT_Cust_Change_Log (Ref_No,Change_Type,OldData,NewData,Change_DateTime,Change_By)
      VALUES (@cardNumber,'Addr_Seq:'+@Addr_Seq+' ;Country_ID',@Old_data,@Country_ID,GETDATE(),@actionByInt);
  END;

  -- Zip_Code
  SELECT @OLD_DATA = Zip_Code FROM Account_Address WHERE Cust_Code=@cardNumber AND Addr_Seq=@Addr_Seq
  IF @OLD_DATA <> @postalCode AND @@ROWCOUNT>0
  BEGIN
      INSERT INTO IT_Cust_Change_Log (Ref_No,Change_Type,OldData,NewData,Change_DateTime,Change_By)
      VALUES (@cardNumber,'Addr_Seq:'+@Addr_Seq+' ;Zip_Code',@Old_data,@postalCode,GETDATE(),@actionByInt);
  END;

  -- Tel
  SELECT @OLD_DATA = Tel FROM Account_Address WHERE Cust_Code=@cardNumber AND Addr_Seq=@Addr_Seq
  IF @OLD_DATA <> @phoneNumber AND @@ROWCOUNT>0
  BEGIN
      INSERT INTO IT_Cust_Change_Log (Ref_No,Change_Type,OldData,NewData,Change_DateTime,Change_By)
      VALUES (@cardNumber,'Addr_Seq:'+@Addr_Seq+' ;Tel',@Old_data,@phoneNumber,GETDATE(),@actionByInt);
  END;

  --EXECUTE
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
    ,[Tel]=@phoneNumber
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
      ,[Tel]
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
      ,@phoneNumber
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
  // Convert Date split 10 charactors
  if(childrenObj.idCardExpiryDate)
    childrenObj.idCardExpiryDate = childrenObj.idCardExpiryDate.substr(0, 10);

  if(childrenObj.birthDate)
    childrenObj.birthDate = childrenObj.birthDate.substr(0, 10);


  var queryStr = `
  BEGIN TRANSACTION TranName;

    --BACKUP
    DECLARE  @actionByInt int =999;
    DECLARE  @OLD_DATA  NVARCHAR(100);


    -- -- identificationCardType
    SELECT @OLD_DATA = ISNULL(identificationCardType,'') FROM MIT_CUST_CHILDREN WHERE cardNumber=@cardNumber AND childCardNumber=@childCardNumber
    IF @OLD_DATA <> @identificationCardType AND @@ROWCOUNT>0
    BEGIN
        INSERT INTO IT_Cust_Change_Log (Ref_No,Change_Type,OldData,NewData,Remark,Change_DateTime,Change_By)
        VALUES (@cardNumber,'identificationCardType',@Old_data,@identificationCardType,@childCardNumber,GETDATE(),@actionByInt);
    END;

    --     ,[passportCountry]=@passportCountry
    SELECT @OLD_DATA = ISNULL(passportCountry,'') FROM MIT_CUST_CHILDREN WHERE cardNumber=@cardNumber AND childCardNumber=@childCardNumber
    IF @OLD_DATA <> @passportCountry AND @@ROWCOUNT>0
    BEGIN
        PRINT N' Insert '
        INSERT INTO IT_Cust_Change_Log (Ref_No,Change_Type,OldData,NewData,Remark,Change_DateTime,Change_By)
        VALUES (@cardNumber,'passportCountry',@Old_data,@passportCountry,@childCardNumber,GETDATE(),@actionByInt);
    END;

    --     ,[idCardExpiryDate]=@idCardExpiryDate
    SELECT @OLD_DATA = convert(varchar, ISNULL(idCardExpiryDate,''), 23) FROM MIT_CUST_CHILDREN WHERE cardNumber=@cardNumber AND childCardNumber=@childCardNumber
    IF @OLD_DATA <> @idCardExpiryDate AND @@ROWCOUNT>0
    BEGIN
        INSERT INTO IT_Cust_Change_Log (Ref_No,Change_Type,OldData,NewData,Remark,Change_DateTime,Change_By)
        VALUES (@cardNumber,'idCardExpiryDate',@Old_data,@idCardExpiryDate,@childCardNumber,GETDATE(),@actionByInt);
    END;

    --     ,[title]=@title
    SELECT @OLD_DATA = ISNULL(title,'') FROM MIT_CUST_CHILDREN WHERE cardNumber=@cardNumber AND childCardNumber=@childCardNumber
    IF @OLD_DATA <> @title AND @@ROWCOUNT>0
    BEGIN
        INSERT INTO IT_Cust_Change_Log (Ref_No,Change_Type,OldData,NewData,Remark,Change_DateTime,Change_By)
        VALUES (@cardNumber,'title',@Old_data,@title,@childCardNumber,GETDATE(),@actionByInt);
    END;

    --     ,[thFirstName]=@thFirstName
    SELECT @OLD_DATA = ISNULL(thFirstName,'') FROM MIT_CUST_CHILDREN WHERE cardNumber=@cardNumber AND childCardNumber=@childCardNumber
    IF @OLD_DATA <> @thFirstName AND @@ROWCOUNT>0
    BEGIN
        INSERT INTO IT_Cust_Change_Log (Ref_No,Change_Type,OldData,NewData,Remark,Change_DateTime,Change_By)
        VALUES (@cardNumber,'thFirstName',@Old_data,@thFirstName,@childCardNumber,GETDATE(),@actionByInt);
    END;

    --     ,[thLastName]=@thLastName
    SELECT @OLD_DATA = ISNULL(thLastName,'') FROM MIT_CUST_CHILDREN WHERE cardNumber=@cardNumber AND childCardNumber=@childCardNumber
    IF @OLD_DATA <> @thLastName AND @@ROWCOUNT>0
    BEGIN
        INSERT INTO IT_Cust_Change_Log (Ref_No,Change_Type,OldData,NewData,Remark,Change_DateTime,Change_By)
        VALUES (@cardNumber,'thLastName',@Old_data,@thLastName,@childCardNumber,GETDATE(),@actionByInt);
    END;

    --     ,[birthDate]=@birthDate
    SELECT @OLD_DATA = convert(varchar, ISNULL(birthDate,''), 23) FROM MIT_CUST_CHILDREN WHERE cardNumber=@cardNumber AND childCardNumber=@childCardNumber
    IF @OLD_DATA <> @birthDate AND @@ROWCOUNT>0
    BEGIN
        INSERT INTO IT_Cust_Change_Log (Ref_No,Change_Type,OldData,NewData,Remark,Change_DateTime,Change_By)
        VALUES (@cardNumber,'birthDate',@Old_data,@birthDate,@childCardNumber,GETDATE(),@actionByInt);
    END;


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

  console.log("update_AccountInDB()" + cardNumber);
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

  logger.info("update_AccountInDB()" + cardNumber);
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
    DECLARE @MktId as VARCHAR(10);

    SET @AccountCursor = CURSOR FOR
    SELECT accountId
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

    SELECT  @MktId = Id from [MFTS_SalesCode] where License_Code = @icLicense
    UPDATE Account_Info SET MktId = @MktId where Cust_Code=@cardNumber

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


function update_MFTS_Suit(cardNumber,actionBy){

  console.log("update_MFTS_Suit()" + cardNumber);
  const sql = require('mssql')

  var queryStr = `

  BEGIN TRANSACTION TranName;

  -- Code here
  DECLARE @AccountCursor as CURSOR;
  DECLARE @Account_No as VARCHAR(20);
  DECLARE @suitabilityRiskLevel as VARCHAR(1);
  DECLARE @suitabilityEvaluationDate as date
  DECLARE @Risk_Profile as VARCHAR(100);
  DECLARE @Risk_Description as VARCHAR(500);
  DECLARE @RowCount as INT;
  DECLARE @Series_Id as INT;

  select @suitabilityRiskLevel=A.suitabilityRiskLevel
          ,@suitabilityEvaluationDate=A.suitabilityEvaluationDate
          ,@Risk_Profile=B.Risk_Profile
          ,@Risk_Description=B.Description
  from MIT_FC_CUST_INFO  A
  left join MFTS_Suit_Risk B  ON A.suitabilityRiskLevel =B.Risk_Level
  where cardNumber=@cardNumber

  SET @AccountCursor = CURSOR FOR
  select accountId
  FROM MIT_FC_CUST_ACCOUNT where cardNumber= @cardNumber;

  --Insert /Update  MFTS_Suit by @accountId
  OPEN @AccountCursor;
  FETCH NEXT FROM @AccountCursor INTO @Account_No;
  WHILE @@FETCH_STATUS = 0
  BEGIN

  select  @RowCount = COUNT(*)
  from MFTS_Suit
  WHERE Account_No=@Account_No
  AND CAST(Document_Date AS DATE) >= CAST(@suitabilityEvaluationDate AS DATE)  AND Active_Flag='A'

  IF @RowCount =0
  BEGIN

      SElECT @Series_Id =  Id FROM [MFTS_Suit_Series] WHERE  Active_Flag='A'

      UPDATE MFTS_Suit
      SET Active_Flag='I'
      WHERE Account_No=@Account_No

      INSERT INTO  MFTS_Suit (
          Series_Id
          ,Account_No
          --,Document_Date
          ,Risk_Level
          ,Risk_Level_Desc
          ,Active_Flag
          ,[Create_By]
          --,[Create_Date]
          )
      VALUES(
          @Series_Id
          ,@Account_No
          -- ,@suitabilityEvaluationDate
          ,@Risk_Profile
          ,@Risk_Description
          ,'A'
          ,@actionBy
          -- ,getDate()
          )
  END;

  FETCH NEXT FROM @AccountCursor INTO @Account_No;
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



function update_MFTS_Suit_Detail(cardNumber,actionBy){

  console.log("update_MFTS_Suit_Detail()" + cardNumber);
  const sql = require('mssql')

  var queryStr = `

  BEGIN TRANSACTION TranName;

      DECLARE  @actionByInt int =999;
      DECLARE @Quest4_CURSOR as CURSOR;

      DECLARE @Suit_Id as INT;
      DECLARE @QId as INT;
      DECLARE @CId as INT;
      DECLARE  @OLD_DATA  AS INT;

      DECLARE @suitNo1 as VARCHAR(20);
      DECLARE @suitNo2 as VARCHAR(20);
      DECLARE @suitNo3 as VARCHAR(20);
      DECLARE @suitNo4 as VARCHAR(20);
      DECLARE @suitNo4_split as VARCHAR(20);
      DECLARE @suitNo5 as VARCHAR(20);
      DECLARE @suitNo6 as VARCHAR(20);
      DECLARE @suitNo7 as VARCHAR(20);
      DECLARE @suitNo8 as VARCHAR(20);
      DECLARE @suitNo9 as VARCHAR(20);
      DECLARE @suitNo10 as VARCHAR(20);

      -- Get FundConnext Suit
      SELECT  @suitNo1=suitNo1,
      @suitNo2=suitNo2,
      @suitNo3=suitNo3,
      @suitNo4=suitNo4,
      @suitNo5=suitNo5,
      @suitNo6=suitNo6,
      @suitNo7=suitNo7,
      @suitNo8=suitNo8,
      @suitNo9=suitNo9,
      @suitNo10=suitNo10
      FROM MIT_CUST_SUIT  WHERE cardNumber=@cardNumber

      -- Insert Suit detail
      SELECT @Suit_Id = Suit_Id FROM MFTS_Suit WHERE Account_No=@cardNumber  AND Active_Flag='A'
      IF @@RowCount >0
      BEGIN

          -- **@suitNo1
          SELECT @QId =13
          SELECT @CId= a.CId FROM(
              select  ROW_NUMBER() OVER (ORDER BY CId) AS RowNumber ,*
              from MFTS_Suit_Question_Choice
              where QId=@QId
          ) a   WHERE  a.RowNumber =@suitNo1
          --BACKUP
          SELECT @OLD_DATA = CId FROM MFTS_Suit_Detail WHERE Suit_Id= @Suit_Id AND QId=@QId
          IF @OLD_DATA <> @CId AND @@ROWCOUNT>0
          BEGIN
              INSERT INTO IT_Cust_Change_Log (Ref_No,Change_Type,OldData,NewData,Change_DateTime,Change_By)
              VALUES (@cardNumber,'SuitNo1',@OLD_DATA,@CId,GETDATE(),@actionByInt);
          END;
          -- Update & Insert Value
          UPDATE MFTS_Suit_Detail SET CId=@CId WHERE Suit_Id= @Suit_Id AND QId=@QId
          IF @@ROWCOUNT = 0
          INSERT INTO MFTS_Suit_Detail(Suit_Id,QId,CId)VALUES(@Suit_Id,@QId,@CId)

          -- **@suitNo2
          SELECT @QId =14
          SELECT @CId= a.CId FROM(
              select  ROW_NUMBER() OVER (ORDER BY CId) AS RowNumber ,*
              from MFTS_Suit_Question_Choice
              where QId=@QId
          ) a   WHERE  a.RowNumber =@suitNo2
          --BACKUP
          SELECT @OLD_DATA = CId FROM MFTS_Suit_Detail WHERE Suit_Id= @Suit_Id AND QId=@QId
          IF @OLD_DATA <> @CId AND @@ROWCOUNT>0
          BEGIN
              INSERT INTO IT_Cust_Change_Log (Ref_No,Change_Type,OldData,NewData,Change_DateTime,Change_By)
              VALUES (@cardNumber,'SuitNo2',@OLD_DATA,@CId,GETDATE(),@actionByInt);
          END;
          -- Update & Insert Value
          UPDATE MFTS_Suit_Detail SET CId=@CId WHERE Suit_Id= @Suit_Id AND QId=@QId
          IF @@ROWCOUNT = 0
          INSERT INTO MFTS_Suit_Detail(Suit_Id,QId,CId)VALUES(@Suit_Id,@QId,@CId)

          --** @suitNo3
          SELECT @QId =15
          SELECT @CId= a.CId FROM(
              select  ROW_NUMBER() OVER (ORDER BY CId) AS RowNumber ,*
              from MFTS_Suit_Question_Choice
              where QId=@QId
          ) a   WHERE  a.RowNumber =@suitNo3
          --BACKUP
          SELECT @OLD_DATA = CId FROM MFTS_Suit_Detail WHERE Suit_Id= @Suit_Id AND QId=@QId
          IF @OLD_DATA <> @CId AND @@ROWCOUNT>0
          BEGIN
              INSERT INTO IT_Cust_Change_Log (Ref_No,Change_Type,OldData,NewData,Change_DateTime,Change_By)
              VALUES (@cardNumber,'SuitNo3',@OLD_DATA,@CId,GETDATE(),@actionByInt);
          END;
          -- Update & Insert Value
          UPDATE MFTS_Suit_Detail SET CId=@CId WHERE Suit_Id= @Suit_Id AND QId=@QId
          IF @@ROWCOUNT = 0
          INSERT INTO MFTS_Suit_Detail(Suit_Id,QId,CId)VALUES(@Suit_Id,@QId,@CId)

          --**@suitNo4 (Multiple choice)
          SELECT @QId =16

          -- Delete data on Question 16 (Multiple choice only)
          Delete MFTS_Suit_Detail WHERE Suit_Id=@Suit_Id AND QId=@QId

          SET @Quest4_CURSOR = CURSOR FOR
          SELECT * FROM dbo.splitstring(@suitNo4);
          OPEN @Quest4_CURSOR;
          FETCH NEXT FROM @Quest4_CURSOR INTO @suitNo4_split;
          WHILE @@FETCH_STATUS = 0
          BEGIN
              SELECT @CId= a.CId FROM(
                  select  ROW_NUMBER() OVER (ORDER BY CId) AS RowNumber ,*
                  from MFTS_Suit_Question_Choice
                  where QId=@QId
              ) a   WHERE  a.RowNumber =@suitNo4_split

          -- Insert New value
              INSERT INTO MFTS_Suit_Detail(Suit_Id,QId,CId)VALUES(@Suit_Id,@QId,@CId)
              --
              FETCH NEXT FROM @Quest4_CURSOR INTO @suitNo4_split;
          END

          --** @suitNo5
          SELECT @QId =17
          SELECT @CId= a.CId FROM(
              select  ROW_NUMBER() OVER (ORDER BY CId) AS RowNumber ,*
              from MFTS_Suit_Question_Choice
              where QId=@QId
          ) a   WHERE  a.RowNumber =@suitNo5
          --BACKUP
          SELECT @OLD_DATA = CId FROM MFTS_Suit_Detail WHERE Suit_Id= @Suit_Id AND QId=@QId
          IF @OLD_DATA <> @CId AND @@ROWCOUNT>0
          BEGIN
              INSERT INTO IT_Cust_Change_Log (Ref_No,Change_Type,OldData,NewData,Change_DateTime,Change_By)
              VALUES (@cardNumber,'SuitNo5',@OLD_DATA,@CId,GETDATE(),@actionByInt);
          END;
          -- Update & Insert Value
          UPDATE MFTS_Suit_Detail SET CId=@CId WHERE Suit_Id= @Suit_Id AND QId=@QId
          IF @@ROWCOUNT = 0
          INSERT INTO MFTS_Suit_Detail(Suit_Id,QId,CId)VALUES(@Suit_Id,@QId,@CId)

          --** @suitNo6
          SELECT @QId =18
          SELECT @CId= a.CId FROM(
              select  ROW_NUMBER() OVER (ORDER BY CId) AS RowNumber ,*
              from MFTS_Suit_Question_Choice
              where QId=@QId
          ) a   WHERE  a.RowNumber =@suitNo6
          --BACKUP
          SELECT @OLD_DATA = CId FROM MFTS_Suit_Detail WHERE Suit_Id= @Suit_Id AND QId=@QId
          IF @OLD_DATA <> @CId AND @@ROWCOUNT>0
          BEGIN
              INSERT INTO IT_Cust_Change_Log (Ref_No,Change_Type,OldData,NewData,Change_DateTime,Change_By)
              VALUES (@cardNumber,'SuitNo6',@OLD_DATA,@CId,GETDATE(),@actionByInt);
          END;
          -- Update & Insert Value
          UPDATE MFTS_Suit_Detail SET CId=@CId WHERE Suit_Id= @Suit_Id AND QId=@QId
          IF @@ROWCOUNT = 0
          INSERT INTO MFTS_Suit_Detail(Suit_Id,QId,CId)VALUES(@Suit_Id,@QId,@CId)

          --** @suitNo7
          SELECT @QId =19
          SELECT @CId= a.CId FROM(
              select  ROW_NUMBER() OVER (ORDER BY CId) AS RowNumber ,*
              from MFTS_Suit_Question_Choice
              where QId=@QId
          ) a   WHERE  a.RowNumber =@suitNo7
          --BACKUP
          SELECT @OLD_DATA = CId FROM MFTS_Suit_Detail WHERE Suit_Id= @Suit_Id AND QId=@QId
          IF @OLD_DATA <> @CId AND @@ROWCOUNT>0
          BEGIN
              INSERT INTO IT_Cust_Change_Log (Ref_No,Change_Type,OldData,NewData,Change_DateTime,Change_By)
              VALUES (@cardNumber,'SuitNo7',@OLD_DATA,@CId,GETDATE(),@actionByInt);
          END;
          -- Update & Insert Value
          UPDATE MFTS_Suit_Detail SET CId=@CId WHERE Suit_Id= @Suit_Id AND QId=@QId
          IF @@ROWCOUNT = 0
          INSERT INTO MFTS_Suit_Detail(Suit_Id,QId,CId)VALUES(@Suit_Id,@QId,@CId)

          --** @suitNo8
          SELECT @QId =20
          SELECT @CId= a.CId FROM(
              select  ROW_NUMBER() OVER (ORDER BY CId) AS RowNumber ,*
              from MFTS_Suit_Question_Choice
              where QId=@QId
          ) a   WHERE  a.RowNumber =@suitNo8
          --BACKUP
          SELECT @OLD_DATA = CId FROM MFTS_Suit_Detail WHERE Suit_Id= @Suit_Id AND QId=@QId
          IF @OLD_DATA <> @CId AND @@ROWCOUNT>0
          BEGIN
              INSERT INTO IT_Cust_Change_Log (Ref_No,Change_Type,OldData,NewData,Change_DateTime,Change_By)
              VALUES (@cardNumber,'SuitNo8',@OLD_DATA,@CId,GETDATE(),@actionByInt);
          END;
          -- Update & Insert Value
          UPDATE MFTS_Suit_Detail SET CId=@CId WHERE Suit_Id= @Suit_Id AND QId=@QId
          IF @@ROWCOUNT = 0
          INSERT INTO MFTS_Suit_Detail(Suit_Id,QId,CId)VALUES(@Suit_Id,@QId,@CId)

          --** @suitNo9
          SELECT @QId =21
          SELECT @CId= a.CId FROM(
              select  ROW_NUMBER() OVER (ORDER BY CId) AS RowNumber ,*
              from MFTS_Suit_Question_Choice
              where QId=@QId
          ) a   WHERE  a.RowNumber =@suitNo9
          --BACKUP
          SELECT @OLD_DATA = CId FROM MFTS_Suit_Detail WHERE Suit_Id= @Suit_Id AND QId=@QId
          IF @OLD_DATA <> @CId AND @@ROWCOUNT>0
          BEGIN
              INSERT INTO IT_Cust_Change_Log (Ref_No,Change_Type,OldData,NewData,Change_DateTime,Change_By)
              VALUES (@cardNumber,'SuitNo9',@OLD_DATA,@CId,GETDATE(),@actionByInt);
          END;
          -- Update & Insert Value
          UPDATE MFTS_Suit_Detail SET CId=@CId WHERE Suit_Id= @Suit_Id AND QId=@QId
          IF @@ROWCOUNT = 0
          INSERT INTO MFTS_Suit_Detail(Suit_Id,QId,CId)VALUES(@Suit_Id,@QId,@CId)

          --** @suitNo10
          SELECT @QId =22
          SELECT @CId= a.CId FROM(
              select  ROW_NUMBER() OVER (ORDER BY CId) AS RowNumber ,*
              from MFTS_Suit_Question_Choice
              where QId=@QId
          ) a   WHERE  a.RowNumber =@suitNo10
          --BACKUP
          SELECT @OLD_DATA = CId FROM MFTS_Suit_Detail WHERE Suit_Id= @Suit_Id AND QId=@QId
          IF @OLD_DATA <> @CId AND @@ROWCOUNT>0
          BEGIN
              INSERT INTO IT_Cust_Change_Log (Ref_No,Change_Type,OldData,NewData,Change_DateTime,Change_By)
              VALUES (@cardNumber,'SuitNo10',@OLD_DATA,@CId,GETDATE(),@actionByInt);
          END;
          -- Update & Insert Value
          UPDATE MFTS_Suit_Detail SET CId=@CId WHERE Suit_Id= @Suit_Id AND QId=@QId
          IF @@ROWCOUNT = 0
          INSERT INTO MFTS_Suit_Detail(Suit_Id,QId,CId)VALUES(@Suit_Id,@QId,@CId)

      END

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

function update_MFTS_Suit(cardNumber,actionBy){

  console.log("update_MFTS_Suit()" + cardNumber);
  const sql = require('mssql')

  var queryStr = `
  BEGIN TRANSACTION TranName;

  -- Code here
  DECLARE @AccountCursor as CURSOR;
  DECLARE @Account_No as VARCHAR(20);
  DECLARE @suitabilityRiskLevel as VARCHAR(1);
  DECLARE @suitabilityEvaluationDate as date
  DECLARE @Risk_Profile as VARCHAR(100);
  DECLARE @Risk_Description as VARCHAR(500);
  DECLARE @RowCount as INT;
  DECLARE @Series_Id as INT;

  select @suitabilityRiskLevel=A.suitabilityRiskLevel
          ,@suitabilityEvaluationDate=A.suitabilityEvaluationDate
          ,@Risk_Profile=B.Risk_Profile
          ,@Risk_Description=B.Description
  from MIT_FC_CUST_INFO  A
  left join MFTS_Suit_Risk B  ON A.suitabilityRiskLevel =B.Risk_Level
  where cardNumber=@cardNumber

  SET @AccountCursor = CURSOR FOR
  select accountId
  FROM MIT_FC_CUST_ACCOUNT where cardNumber= @cardNumber;

  --Insert /Update  MFTS_Suit by @accountId
  OPEN @AccountCursor;
  FETCH NEXT FROM @AccountCursor INTO @Account_No;
  WHILE @@FETCH_STATUS = 0
  BEGIN

  select  @RowCount = COUNT(*)
  from MFTS_Suit
  WHERE Account_No=@Account_No
  AND CAST(Document_Date AS DATE) >= CAST(@suitabilityEvaluationDate AS DATE)  AND Active_Flag='A'

  IF @@RowCount =0
  BEGIN

      SElECT @Series_Id =  Id FROM [MFTS_Suit_Series] WHERE  Active_Flag='A'

      UPDATE MFTS_Suit
      SET Active_Flag='I'
      WHERE Account_No=@Account_No

      INSERT INTO  MFTS_Suit (
          Series_Id
          ,Account_No
          ,Document_Date
          ,Risk_Level
          ,Risk_Level_Desc
          ,Active_Flag
          ,[Create_By]
          ,[Create_Date]
          )
      VALUES(
          @Series_Id
          ,@Account_No
          ,@suitabilityEvaluationDate
          ,@Risk_Profile
          ,@Risk_Description
          ,'A'
          ,@actionBy
          ,getDate()
          )
  END;

  FETCH NEXT FROM @AccountCursor INTO @Account_No;
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
  var queryStr = `
  select B.Nation_Desc,B.SET_Code
  ,A.*
  FROM [Account_Info] A
  LEFT JOIN REF_Nations B ON A.Nation_Code=B.Nation_Code
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
