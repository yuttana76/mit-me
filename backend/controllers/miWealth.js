const fs = require('fs');
const path = require('path');
const dbConfig = require('../config/db-config');
const mpamConfig = require('../config/mpam-config');
var logger = require("../config/winston");
const https = require('https')
const download = require('download');
const { check, validationResult } = require('express-validator');
var AdmZip = require('adm-zip');
var CronJob = require('cron').CronJob;
var mitLog = require('./mitLog');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0" //this is insecure

var config_BULK = mpamConfig.dbParameters_BULK;
var config = mpamConfig.dbParameters;
const sql = require("mssql");
const { throwError } = require('rxjs');
const { reject } = require('async');
const { json } = require('body-parser');

const PRODUCT_MF ='MF'
const PRODUCT_BOND ='BOND'
const PRODUCT_PF ='PF'

const PF_API_URL ='http://192.168.10.45'

exports.hellomi = (req, res, next) => {

  logger.info( ` hellomi ;originalUrl= ${req.originalUrl} ;remoteAddress=${req.connection.remoteAddress} `);

  function getLastWeek() {
    // var today = new Date();
    var today = new Date(2021,3,19);
    var lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
    return lastWeek;
  }

  var as_of_date  = '2021-03-01'
  // _dateArray = as_of_date.split("-")
  // var today = new Date(_dateArray[0],parseInt(_dateArray[1])-1,_dateArray[2]);
  // var _day = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
  // console.log(`lastWeek>> ${_day} `)


  res.status(200).json({message:'Hello MI.' + fcDayDec(as_of_date,2)});

}

function fcDayDec(_date,numDay){
  // var as_of_date  = '2021-03-01'
  _dateArray = _date.split("-")

  var today = new Date(_dateArray[0],parseInt(_dateArray[1])-1,_dateArray[2]);
  var _day = new Date(today.getFullYear(), today.getMonth(), today.getDate() - numDay);
  return _day
}

exports.getPortDetailByAgents_V2 = (req, res, next) => {
  logger.info('Welcome getPortDetailByAgents_V2');

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.error('API validate params ' + JSON.stringify({ errors: errors.array() }));
    return res.status(422).json({ errors: 'Request parameters.' });
  }

  var compCode = 'MPAM'
    let agent_list = req.query.agent_list;
    let as_of_date = req.query.as_of_date;

    agentArray = agent_list.split(',')
    processLicenseArray(compCode,agentArray,as_of_date).then((_data)=>{
      // logger.info(` RT data>${JSON.stringify(_data)}`)
      console.log('All Done!');
      res.status(200).json(_data);
    })

}


async function processLicenseArray(compCode,lic_array,as_of_date) {

  let processLiceseArray_RS=[]

  for (const lic_code of lic_array) {
    // _agent_data = await getPortfolio(compCode,lic_code,as_of_date)
    // logger.info( `Agent data>> ${JSON.stringify(_agent_data)}`)
    processLiceseArray_RS.push(await getPortfolio(compCode,lic_code,as_of_date));
  }

  return processLiceseArray_RS
}

// const MaskData = require(maskdata);

function PFlastFriday(_date){
  var friDay = null
  try{

    // Split new date
    _dateArray=_date.split('-')
    _date = _dateArray[2]
    _month = _dateArray[1]-1
    _year = _dateArray[0]


    var today = new Date(_year,_month,_date);
    var lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
    var date_last_week = lastWeek;
    var first = date_last_week.getDate() - date_last_week.getDay(); // First day is the day of the month - the day of the week
    var fri = first + 5; // last day is the first day + 6

    friDay_Date = new Date(date_last_week.setDate(fri));

    friDay =friDay_Date.getFullYear()+'-'+(friDay_Date.getMonth()+1)+'-'+friDay_Date.getDate()

  }catch(err){
    logger.error(`${err}`)
  }

  return friDay

}

 function getPortfolio(compCode,lic_code,as_of_date) {

  agentData={
    agent_code:lic_code,
  };

  let PF_as_of_date = PFlastFriday(as_of_date);

  return new Promise( function(resolve, reject) {

        customers=[];
              lic_funcArray=[];
              lic_funcArray.push(funMF_Get_MF_BOND_AccountByLicense_Query(compCode,lic_code,as_of_date));
              lic_funcArray.push(funcPF_PortDetailByAgent(lic_code,PF_as_of_date));

                Promise.all(lic_funcArray)
                .then(cust_data =>  {


                  // Masking id MF
                  MF_port=[]
                  cust_data[0] = cust_data[0].reduce((a, b) =>  {
                      _id = b['id_cust'];

                      // Mask & concat
                      // var first4 = _id.substring(0, 3);
                      // var last5 = _id.substring(_id.length - 5);
                      // mask = _id.substring(4, _id.length - 5).replace(/\d/g,"*");
                      // _id_mask =first4 + mask + last5+first4
                      // b['id_cust'] = _id_mask

                      // Concat id
                      var set1 = _id.substring(0, 3);
                      var set2 = _id.substring(3,6);
                      var set3 = _id.substring(6,9)
                      var set4 = _id.substring(9,13)
                      _id_mask =set2 + set4 + set3+set1+set3
                      b['id_cust'] = _id_mask

                      MF_port.push(b)
                      return b
                    }, {});

                    // Masking id PF
                    PF_port=[]
                    if(cust_data[1]){
                      cust_data[1] = cust_data[1].reduce((a, b) =>  {

                        _id = b['id_cust'];

                        // Concat id
                        var set1 = _id.substring(0, 3);
                        var set2 = _id.substring(3,6);
                        var set3 = _id.substring(6,9)
                        var set4 = _id.substring(9,13)
                        _id_mask =set2 + set4 + set3+set1+set3
                        b['id_cust'] = _id_mask

                        PF_port.push(b)
                        return b
                      }, {});
                    }

                    //PF  mapping & adjust JSON structure
                    newPF_port=[];
                    try {

                      Object.keys(PF_port).forEach(function (key) {
                        PF_port[key].portfolio.forEach(function (a) {
                          let A = a
                          A.id_cust=PF_port[key].id_cust
                          A.customer_name=PF_port[key].customer_name
                          delete A.outstanding_list
                          newPF_port.push(A)
                        });
                      });
                    }catch(err){
                      logger.error(`PF mapping & adjust JSON structure Error> ${JSON.stringify(err)}`)
                    }

                    cust_data[0] = MF_port
                    cust_data[1] = newPF_port

                  // Calculate
                  result = cust_data[0].reduce((a, b) =>  {

                        let customer ={};
                        // customer.customer_code = _id_mask//b['id']
                        customer.customer_code = b['id_cust']
                        customer.customer_name = b['fullName']
                        customer.referral = b['referral']
                        customer.as_of_date = as_of_date
                        customer.portfolio_code = b['acc']
                        customer.product = b['product']

                        if(customer.product === PRODUCT_MF){
                          customer.current_value = b['mf_sum_current_value']
                          customer.capital_value = b['mf_sum_capital_value']
                          customer.balance=(customer.current_value - customer.capital_value )
                          customer.balance_percent=((customer.current_value - customer.capital_value )/customer.capital_value)*100

                        }else if(customer.product === PRODUCT_BOND){
                          customer.current_value = b['bond_sum_amount']

                        }
                        else if(customer.product === PRODUCT_PF){

                        }
                        customers.push(customer)

                        return customers
                      }, {});

                    // Merge (MF,BOND) & PF
                      if(cust_data[1]){
                        cust_data[1].forEach(function(pf_port) {
                          //Rename
                          str = JSON.stringify(pf_port);
                          str = str.replace(/\"id_cust\":/g, "\"customer_code\":");
                          pf_port = JSON.parse(str);

                          customers.push(pf_port)
                      });
                    }
                    agentData.customers = customers

                    // // Grouping type 2
                    hash = customers.reduce((p,c) => (p[c.customer_code] ? p[c.customer_code].push(c) : p[c.customer_code] = [c],p) ,{}),
                    newData = Object.keys(hash).map(k => ({customer_code: k,as_of_date:hash[k][0].as_of_date ,customer_name:hash[k][0].customer_name,portfolios: hash[k]}));

                    // Modify all json data(MF,BOND,PF)
                    agentData.customers = newData.forEach(function (a) {
                      a.portfolios.forEach(function(b){
                        bb = b;
                        delete bb.customer_code
                        delete bb.customer_name
                        return bb
                      })
                    });

                   agentData.customers = newData

                    resolve(agentData)

                })
                .catch(err=>{

                  reject(err)
                });
  });
}

exports.getPortDetailByAgents = (req, res, next) => {
  logger.info('Welcome getPortDetailByAgents');
  try{

    var compCode = 'MPAM'
    let agent_list = req.query.agent_list;
    let as_of_date = req.query.as_of_date;

    logger.info(`*** ${compCode} ,${agent_list}, ${as_of_date}  `)

        fnArray=[];
        fnArray.push(funMF_GetAccountByLicenseList(compCode,agent_list,as_of_date));
        Promise.all(fnArray)
        .then(data => {

          // Do something here
          // logger.info( `DATA-> ${JSON.stringify(data)}`)

          res.status(200).json(data);

        }).catch(function(err) {
          logger.error(`xxx ${err}`)

          // res.status(500).json(`Was error on ${err} `);
        });

  } catch (error) {
    logger.error(JSON.stringify(error))
    res.status(500).json(error);
  }

}

exports.getPortDetailByPort = (req, res, next) => {
logger.info('Welocme getPortDetailByPort()')

const errors = validationResult(req);
if (!errors.isEmpty()) {
  logger.error('API validate params ' + JSON.stringify({ errors: errors.array() }));
  return res.status(422).json({ errors: 'Request parameters.' });
}

  try {
    var compCode = 'MPAM'
    let portfolio_code = req.query.portfolio_code;
    let as_of_date = req.query.as_of_date;
    let product = req.query.product;

        //MF
        if(product === PRODUCT_MF){

          fnArray=[];
          fnArray.push(funcMF_PortDetailByPortObject(compCode,portfolio_code,as_of_date));
          Promise.all(fnArray)
          .then(data => {
            res.status(200).json(data[0]);
          }).catch(function(err) {
            res.status(500).json(`Was error on ${product}`);
          })
          ;

        }else if (product === PRODUCT_BOND) {

          fnArray=[];
          fnArray.push(funcBOND_PortDetailByPortObject(compCode,portfolio_code,as_of_date));
          Promise.all(fnArray)
          .then(data => {
            res.status(200).json(data[0]);
          })
          .catch(function(err) {
            res.status(500).json(`Was error on ${product}`);
          })
          ;

        }else if (product === PRODUCT_PF) {

          // let as_of_date = PFlastFriday(as_of_date);
          // let as_of_date = PFlastFriday(as_of_date);

          fnArray=[];
          fnArray.push(funcPF_PortDetailByPort(portfolio_code,as_of_date));
          Promise.all(fnArray)
          .then(data => {

            // logger.info(`PF>> ${JSON.stringify(data)}`)
            var _pf = data[0];
            res.status(200).json(_pf[0]);

          })
          .catch(function(err) {
            res.status(500).json(`Was error on ${product}`);
          })
          ;
        }

    } catch (error) {
      logger.error(JSON.stringify(error))
      res.status(500).json('Was error');
    }
}


exports.getCommission = (req, res, next) => {

  const agent_list = req.query.agent_list;

  let data = {AccountID:'MPAM'  }

  res.status(200).json('API Commission. ' + JSON.stringify(data));
}

// **********************************************************

async  function funMF_GetAccountByLicenseList(compCode,agent_list,as_of_date){

  logger.info(`Welcome funMF_GetAccountByLicenseObject_v2()`)

  var arr = agent_list.split(",");
  let data=[]
  for(var i=0;i<arr.length;i++) {
    data.push(await funMF_GetAccountByLicenseObject(compCode,arr[i],as_of_date))
  }

//  Portfolio
  data = await func_MFPort(compCode,data,as_of_date);

  // data = await func_BONDPort(compCode,data,as_of_date);


  logger.info( `DONE !! `)
  return data;

}

async function func_BONDPort(compCode,data,as_of_date){

  return new Promise(async function(resolve, reject) {
      try{

        for(var i in data)
        {
          if (data[i].customers.length>0){

            lic_obj = data[i].customers;
            for(var j in lic_obj){

              // lic_obj[j].portfolio = []; // initial port
              logger.info(`***BOND account(XNO) > ${lic_obj[j].XNO}`)


                // fnMF_Array=[];
                // fnMF_Array.push(funcMF_PortDetailByPortObject(compCode,lic_obj[j].customer_code,as_of_date));// MF

                // await Promise.all(fnMF_Array)
                // .then( _port_data => {

                //   logger.info(` ****(port_data) *** ${JSON.stringify(_port_data)} `)

                //   accountObj_MF={
                //     "product": "MF",
                //     "as_of_date": as_of_date,
                //   }

                //   sum_current_value=0;
                //   sum_capital_value=0;

                //   if(_port_data[0].length>0){

                //     //Calculate sum current value
                //     sum_current_value = _port_data[0].reduce((a, b) => {
                //       sum_current_value +=b['current_value']
                //       return sum_current_value
                //     }, {});

                //   // //Calculate sum capital value
                //     sum_capital_value = _port_data[0].reduce((a, b) => {
                //       sum_capital_value +=b['capital_value'];
                //       return sum_capital_value
                //     }, {});

                //     accountObj_MF.portfolio_code = _port_data[0][0].Account_ID
                //     accountObj_MF.current_value=sum_current_value;
                //     accountObj_MF.capital_value=sum_capital_value;
                //     accountObj_MF.balance=sum_current_value-sum_capital_value;
                //     accountObj_MF.balance_percent= ((sum_current_value-sum_capital_value) /sum_capital_value)*100 ;

                //     accountObj_MF.outstanding_list=_port_data[0]
                //   }

                //   if(_port_data[1].length > 0){
                //     accountObj_MF.transaction_list= _port_data[1]
                //   }

                //   lic_obj[j].portfolio.push(accountObj_MF)

                // })
                // .catch(err=>{
                //   reject(err)
                // });

            }

            data[i].customers = lic_obj
          }
        }

      } catch (err) {
        logger.error(err)
        reject(err)
      }

  resolve(data)
  });

}


async function func_MFPort(compCode,data,as_of_date){

  return new Promise(async function(resolve, reject) {
      try{

        for(var i in data)
        {
          console.log(` license >> ${JSON.stringify(data[i].license)}`);
          if (data[i].customers.length>0){

            lic_obj = data[i].customers;
            for(var j in lic_obj){

              lic_obj[j].portfolio = [];

                fnMF_Array=[];
                fnMF_Array.push(funcMF_PortDetailByPortObject(compCode,lic_obj[j].customer_code,as_of_date));// MF

                await Promise.all(fnMF_Array)
                .then( _port_data => {

                  accountObj_MF={
                    "product": "MF",
                    "as_of_date": as_of_date,
                  }

                  sum_current_value=0;
                  sum_capital_value=0;

                  if(_port_data[0].length>0){

                    //Calculate sum current value
                    sum_current_value = _port_data[0].reduce((a, b) => {
                      sum_current_value +=b['current_value']
                      return sum_current_value
                    }, {});

                  // //Calculate sum capital value
                    sum_capital_value = _port_data[0].reduce((a, b) => {
                      sum_capital_value +=b['capital_value'];
                      return sum_capital_value
                    }, {});

                    accountObj_MF.portfolio_code = _port_data[0][0].Account_ID
                    accountObj_MF.current_value=sum_current_value;
                    accountObj_MF.capital_value=sum_capital_value;
                    accountObj_MF.balance=sum_current_value-sum_capital_value;
                    accountObj_MF.balance_percent= ((sum_current_value-sum_capital_value) /sum_capital_value)*100 ;

                    accountObj_MF.outstanding_list=_port_data[0]
                  }

                  if(_port_data[1].length > 0){
                    accountObj_MF.transaction_list= _port_data[1]
                  }

                  lic_obj[j].portfolio.push(accountObj_MF)

                })
                .catch(err=>{
                  reject(err)
                });
            }

            data[i].customers = lic_obj
          }
        }

      } catch (err) {
        logger.error(err)
        reject(err)
      }
  resolve(data)
  });

}


async function funMF_GetAccountByLicenseObject_2(compCode,agent_code,as_of_date){

  logger.info(`funMF_GetAccountByLicenseObject ${agent_code}`)

  let agentData={'license':agent_code,
  customers:[]};

  let customers=[]

  return new Promise(function(resolve, reject) {
      try{
       resolve(0)
      } catch (err) {
        reject(err)
      }
    });
}

async function funMF_GetAccountByLicenseObject(compCode,agent_code,as_of_date){

  logger.info(`funMF_GetAccountByLicenseObject ${agent_code}`)

  let agentData={'license':agent_code,
  customers:[]};

  let customers=[]

  return new Promise(function(resolve, reject) {
      try{
        // fnMF_Array
              lic_Array=[];
              lic_Array.push(funMF_GetAccountByLicenseQuery(compCode,agent_code,as_of_date));
                Promise.all(lic_Array)
                .then(cust_data => {
                      //Calculate sum current value
                  logger.info(` GET CUST >> ${JSON.stringify(cust_data)}`)

                      cust_data[0].reduce((a, b) => {

                        // return sum_current_value
                        let customer ={};
                        customer.customer_name = b['fullName']
                        customer.customer_code = b['Cust_Code']

                        customers.push(customer)

                      }, {});


                    agentData.customers = customers
                    resolve(agentData)

                })
                .catch(err=>{

                  reject(err)
                });

      } catch (err) {
        reject(err)
      }
    });

}


function funcMF_PortDetailByPortObject(compCode,portfolio_code,as_of_date){
  logger.info(`funcMF_PortDetailByPortObject()_XXXX compCode=${compCode} ;portfolio_code=${portfolio_code} ;as_of_date=${as_of_date}`)

   portdata={
      "product": PRODUCT_MF,
      "as_of_date": as_of_date,
      "portfolio_code": portfolio_code,
    }

  return new Promise(function(resolve, reject) {
    // fnMF_Array
    fnMF_Array=[];
    fnMF_Array.push(funcMF_PortDetailByPort_Query(compCode,portfolio_code,as_of_date));
    fnMF_Array.push(funcMF_TransactionPort_Query(portfolio_code,as_of_date));
        Promise.all(fnMF_Array)
        .then(data => {


            sum_current_value=0;
            sum_capital_value=0;

            if(data[0]){

              let portfolio_code =''
              //Calculate sum current value
              sum_current_value = data[0].reduce((a, b) => {

                  portfolio_code = b.portfolio_code
                  sum_current_value +=b['current_value']
                  sum_capital_value +=b['capital_value'];

                  return sum_current_value
                }, {});

              //Calculate sum capital value
              // sum_capital_value = data[0].reduce((a, b) => {
              //     sum_capital_value +=b['capital_value'];
              //     return sum_capital_value
              //   }, {});

                // Assign value
                // if(data[0][0])
                // portdata.portfolio_code = data[0][0].Account_ID
                portdata.portfolio_code = portfolio_code;
                portdata.current_value=sum_current_value;
                portdata.capital_value=sum_capital_value;
                portdata.balance=sum_current_value-sum_capital_value;
                portdata.balance_percent= ((sum_current_value-sum_capital_value) /sum_capital_value)*100 ;
                portdata.outstanding_list = data[0]

            };

            if(data[1]){
              portdata.transaction_list=data[1];
            }else{
              portdata.transaction_list=[];
            }

        resolve(portdata);
      }).catch(err=>{
        reject(err)
      });

  });

}


function funcBOND_PortDetailByPortObject(compCode,portfolio_code,as_of_date){

  portdata={
    "product": PRODUCT_BOND,
    "as_of_date": as_of_date,

  }

  return new Promise(function(resolve, reject) {
      try{

      fnBOND_Array=[];
      fnBOND_Array.push(funcBOND_PortDetailByPort_query(compCode,portfolio_code,as_of_date));
      Promise.all(fnBOND_Array)
      .then(data => {

        // logger.info(`BOND data>> ${JSON.stringify(data)}` )

        if(data[0].length<=0 ){
          reject(0)
        }

        //Calculate sum current value
        var _portfolio_code
        sum_amound=0;
        sum_amound = data[0].reduce((a, b) => {
          sum_amound +=b['balance']
          _portfolio_code=b.portfolio_code
          return sum_amound
        }, {});

        // portdata.customer_name = data[0][0].fullName

        portdata.portfolio_code = portfolio_code

        portdata.balance = sum_amound
        portdata.outstanding_list = data[0]

        // logger.info(`BOND RESOLVE >> ${JSON.stringify(portdata)}` )

        resolve(portdata)

      })
      .catch(function(err) {
        logger.error(err.message); // some coding error in handling happened
        reject(err)
      });

    }catch(err){
      logger.error(`ERROR on funcBOND_PortDetailByPortObject() ${err}`)
    }

  });

}


function funMF_Get_MF_BOND_AccountByLicense_Query(compCode,license_code,as_of_date) {

  logger.info(`funMF_Get_MF_BOND_AccountByLicense_Query()  ;CustCode: ${compCode} ;license_code:${license_code} ;as_of_date:${as_of_date} `);

  var fncName = "funMF_Get_MF_BOND_AccountByLicense_Query()";
  var queryStr = `

  BEGIN
  --DECLARE @license_code VARCHAR(20) ='039583'

  DECLARE @tempTable TABLE
  (id_cust VARCHAR(20)
  ,fullName  VARCHAR(100)
  ,product VARCHAR(20)
  ,acc VARCHAR(20)
  ,mf_sum_current_value [numeric](18, 2)
  ,mf_sum_capital_value [numeric](18, 2)
  ,bond_sum_amount [numeric](18, 2)
  ,referral VARCHAR(50)
  )

  DECLARE @customerCursor as CURSOR;
  DECLARE @mfCursor as CURSOR;

  DECLARE @id VARCHAR(20);
  DECLARE @fullName VARCHAR(100);
  DECLARE @product VARCHAR(20);
  DECLARE @acc VARCHAR(20);
  DECLARE @referral VARCHAR(100);
  -- Portfolio

  DECLARE @mf_sum_current_value [numeric](18, 2)=0
  DECLARE @mf_sum_capital_value [numeric](18, 2)=0

  DECLARE @bond_sum_amount [numeric](18, 2)=0

      -- BOND get cust by license
      SET @customerCursor = CURSOR FOR
      select  b.CustID as acc, ISNULL(b.IDcardNo,'-') as id_cust
      ,b.FName +' ' +   REPLACE(b.LName, SUBSTRING(b.LName, LEN(b.LName)-3,LEN(b.LName)), '***') as fullName
      , 'BOND' as product
      ,'' as referral
      from ITB_RM_Freelance a
      LEFT join ITB_Customers b on (b.FreelanceID=a.ID  OR b.RMID = a.ID )and  b.[Status]='A '
      where a.Code =@license_code
      and a.[status]='A'
      and b.IDcardNo is not null
      UNION
      -- LBDU get cust by license
      select  a.Cust_Code as acc, ISNULL(a.IT_PID_No,'-') as id_cust
      , a.First_Name_T +' ' +   REPLACE(a.Last_Name_T, SUBSTRING(a.Last_Name_T, LEN(a.Last_Name_T)-3,LEN(a.Last_Name_T)), '***') as full_name
      ,'MF'as product
      ,ISNULL(a.IT_Referral,'') as referral
      from Account_Info a
      where  a.IT_PID_No is not null
      and a.IT_PID_No != ''
      AND (IT_SAcode = @license_code
            OR a.MktId IN(select  Id
                      FROM VW_MFTS_SaleCode
                      WHERE License_Code =@license_code
                      ))
      order by id_cust,acc

      OPEN @customerCursor;
      FETCH NEXT FROM @customerCursor INTO @acc,@id,@fullName,@product,@referral
      WHILE @@FETCH_STATUS = 0
      BEGIN

      if @product='MF'BEGIN
          select @mf_sum_current_value = ISNULL(SUM( a.Unit_balance * a.NAV ),0) --AS sum_current_value
          ,@mf_sum_capital_value = ISNULL(SUM(a.Unit_balance * a.Average_Cost ),0)  --AS sum_capital_value
          from MIT_FC_UnitholderBalance A
          where A.Account_ID =@acc
          and Available_Amount>0
          AND Available_Unit_Balance>0
          and  CONVERT(DATETIME, businessDate) =
              (select   distinct top 1 businessDate
              from MIT_FC_UnitholderBalance
              where Account_ID = @acc
              and  CONVERT(DATETIME, businessDate) <= CONVERT(DATETIME, GETDATE())
              order by  businessDate desc )
          IF @@ROWCOUNT=0
          BEGIN
              SELECT @mf_sum_current_value=0,@mf_sum_capital_value=0
          END

          -- print @id + ' ' +@fullName +' '+  @product+' '+@acc +' '+ CONVERT(varchar(20), @mf_sum_current_value) +' '+ CONVERT(varchar(20), @mf_sum_capital_value )

        -- Insert temp table
        INSERT INTO @tempTable (id_cust,fullName,product,acc,mf_sum_current_value,mf_sum_capital_value,referral)
        VALUES  (@id,@fullName,@product,@acc,@mf_sum_current_value,@mf_sum_capital_value,@referral)

      END

      if @product='BOND'BEGIN

          SELECT @bond_sum_amount = SUM(ISNULL(b.Amount,0))
          FROM ITB_Customers a
          LEFT join  ITB_CustInstruments b ON b.CustCode  = a.custId and b.[Status]='A'
          LEFT join ITB_Instrument c ON  c.InstrumentID= b.InstrumentCode and c.[Status]='A'
          LEFT join ITB_Company d ON d.ID=c.IssuerID and d.[status]='A'
          where a.custId = @acc
          and  a.Status = 'A'
           IF @@ROWCOUNT=0
          BEGIN
              SELECT @bond_sum_amount=0
          END

          -- print @id + ' ' +@fullName +' '+  @product+' '+@acc   + ' ' +@bond_InstrumentDesc   + ' '+ @bond_OrderDate + ' '+ CONVERT(varchar(20), @bond_amount )
          -- Insert temp table
        INSERT INTO @tempTable (id_cust,fullName,product,acc,bond_sum_amount,referral)
        VALUES  (@id,@fullName,@product,@acc,@bond_sum_amount,@referral)

      END


      FETCH NEXT FROM @customerCursor INTO @acc,@id,@fullName,@product,@referral
      END
      CLOSE @customerCursor;
      DEALLOCATE @customerCursor;

      select * from @tempTable

  END

    `;

  // const sql = require("mssql");
  return new Promise(function(resolve, reject) {
    const pool1 = new sql.ConnectionPool(config, err => {
      pool1
        .request()
        .input("license_code", sql.VarChar(20), license_code)
        // .input("as_of_date", sql.VarChar(20), as_of_date)
        .query(queryStr, (err, result) => {
          if (err) {
            logger.error(`err`)
            reject(err);

          } else {
            // logger.info(`data -> ${JSON.stringify(result)}`)
            resolve(result.recordset);
          }
        });
    });
    pool1.on("error", err => {
      console.log("ERROR>>" + err);
      reject(err);
    });
  });
}


function funMF_GetAccountByLicenseQuery(compCode,license_code,as_of_date) {

  logger.info(`funMF_GetAccountByLicenseQuery()  ;CustCode: ${compCode} ;license_code:${license_code} ;as_of_date:${as_of_date} `);

  var fncName = "funMF_GetAccountByLicenseQuery()";
  var queryStr = `
  BEGIN

  select distinct AAA.License_Code,AA.Cust_Code,AA.First_Name_T + ' ' + AA.Last_Name_T AS fullName,AA.IT_PID_No AS XNO
  from VW_MFTS_SaleCode AAA
  left join Account_Info AA on AA.MktId=AAA.Id
  where AAA.License_Code=@license_code
  order by fullName

  END
    `;

  // const sql = require("mssql");
  return new Promise(function(resolve, reject) {
    const pool1 = new sql.ConnectionPool(config, err => {
      pool1
        .request()
        .input("license_code", sql.VarChar(20), license_code)
        // .input("as_of_date", sql.VarChar(20), as_of_date)
        .query(queryStr, (err, result) => {
          if (err) {
            logger.error(`err`)
            reject(err);

          } else {
            // logger.info(`data -> ${JSON.stringify(result)}`)
            resolve(result.recordset);
          }
        });
    });
    pool1.on("error", err => {
      console.log("ERROR>>" + err);
      reject(err);
    });
  });
}

function funcMF_PortDetailByPort_Query(compCode,custCode,as_of_date) {

  logger.info(`funcMF_PortDetailByPort_Query()  ;CustCode: ${custCode} ;as_of_date:${as_of_date} `);

  var fncName = "funcMF_PortDetailByPort_Query()";
  var queryStr = `
  BEGIN

  /*
  @as_of_date = yyyyMMdd
  */

  select A.Account_ID as portfolio_code
  ,A.AMC_Code as amc
  ,A.Fund_Code as instrument
  ,a.Unit_balance as unit
  ,A.Average_Cost as price
  ,A.NAV as nav
  ,convert(varchar, convert(datetime ,A.NAVdate), 23)  as nav_date
  ,a.Unit_balance * a.NAV as current_value
  ,a.Unit_balance * a.Average_Cost as capital_value
  ,(A.Available_Amount -  (A.Unit_balance * A.Average_Cost))  as balance
  , (((A.Available_Amount -  (A.Unit_balance * A.Average_Cost)) / (A.Unit_balance * A.Average_Cost) ) * 100) AS balance_percent

      from MIT_FC_UnitholderBalance A
      where A.Account_ID =@custCode
      and Available_Amount>0
      AND Available_Unit_Balance>0
      and  CONVERT(DATETIME, businessDate) =
        (select   distinct top 1 businessDate
        from MIT_FC_UnitholderBalance
        where Account_ID = @custCode
        and  CONVERT(DATETIME, businessDate) <= CONVERT(DATETIME, @as_of_date)
        order by  businessDate desc )

  END
    `;

  // const sql = require("mssql");
  return new Promise(function(resolve, reject) {
    const pool1 = new sql.ConnectionPool(config, err => {
      pool1
        .request()
        .input("custCode", sql.VarChar(20), custCode)
        .input("as_of_date", sql.VarChar(20), as_of_date)
        .query(queryStr, (err, result) => {
          if (err) {
            console.log(fncName + " Query error !!!" + err);
            reject(err);

          } else {
            // console.log(" queryStr >>" + queryStr);
            // console.log(" Quey RS >>" + JSON.stringify(result));
            resolve(result.recordset);
          }
        });
    });
    pool1.on("error", err => {
      console.log("ERROR>>" + err);
      reject(err);
    });
  });
}


function funcBOND_PortDetailByPort_query(compCode,portfolio_code,as_of_date) {

  logger.info(`funcBOND_PortDetailByPort_query()   ;portfolio_code: ${portfolio_code} ;as_of_date:${as_of_date} `);

  var fncName = "funcBOND_PortDetailByPort_query()";
  var queryStr = `
  BEGIN

    SELECT  a.CustID AS portfolio_code
    ,b.InstrumentCode as instrument
    ,b.Amount as current_value
    ,convert(varchar, b.OrderDate, 23) as order_date
    ,c.InterestRate as InterestRate
    ,convert(varchar, c.MatureDate, 23) as MatureDate
    ,d.code +'-'+c.InstrumentTypeCode AS instrument_desc
    -- +'; Payment cycle:' +c.PaymentCycle
    -- + '; Payment period:'+c.PaymentPeriod
    -- + ' ;InstrumentLife:'+c.InstrumentLife
    -- + ' ;FirstPaymentDate:'+c.FirstPaymentDate AS instrument_desc
    FROM ITB_Customers a
    LEFT join  ITB_CustInstruments b ON b.CustCode  = a.custId and b.[Status]='A' and  CONVERT(DATETIME, b.OrderDate) <= CONVERT(DATETIME, @as_of_date)
    LEFT join ITB_Instrument c ON  c.InstrumentID= b.InstrumentCode and c.[Status]='A'
    LEFT join ITB_Company d ON d.ID=c.IssuerID and d.[status]='A'
    where CustCode = @CustCode
    and  a.Status = 'A'

  END
    `;

  // const sql = require("mssql");
  return new Promise(function(resolve, reject) {
    const pool1 = new sql.ConnectionPool(config, err => {
      pool1
        .request()
        .input("custCode", sql.VarChar(20), portfolio_code)
        .input("as_of_date", sql.VarChar(20), as_of_date)

        .query(queryStr, (err, result) => {
          if (err) {
            console.log(fncName + " Quey db. Was err !!!" + err);
            reject(err);

          } else {
            // console.log(" queryStr >>" + queryStr);
            // console.log(" Quey RS >>" + JSON.stringify(result));
            resolve(result.recordset);
          }
        });
    });
    pool1.on("error", err => {
      console.log("ERROR>>" + err);
      reject(err);
    });
  });
}


function funcMF_TransactionPort_Query(custCode,as_of_date) {

  logger.info(`funcMF_TransactionPort_Query()   ;CustCode: ${custCode}  ;as_of_date=${as_of_date}`);

  var fncName = "funcTransactionPort()";
  var queryStr = `

BEGIN

    DECLARE @tranasctionTable TABLE(transaction_id VARCHAR(20),fund_code  VARCHAR(30) ,transaction_code VARCHAR(10),transaction_date VARCHAR(40) , status VARCHAR(10) ,amount [numeric](18, 2),unit [numeric](18, 4))

    DECLARE @TransactionCursor as CURSOR;

    DECLARE @transactionID VARCHAR(20)
    DECLARE @transactionDate VARCHAR(20)
    DECLARE @fundCode VARCHAR(20)
    DECLARE @transactionCode VARCHAR(20)
    DECLARE @status VARCHAR(20) = 'WAITING'
    DECLARE @amount [numeric](18, 2)=0
    DECLARE @unit  [numeric](18, 4)=0


    SET @TransactionCursor = CURSOR FOR
    select  distinct a.transactionID,convert(varchar, a.transactionDate, 23) ,a.fundCode, a.transactionCode,a.amount ,a.unit
    from MIT_FC_TransAllotted A
    where accountID =@custCode
    and MONTH(a.transactionDate)=MONTH(CAST(@as_of_date as date))
    order BY transactionID desc ,a.fundCode

    OPEN @TransactionCursor;
    FETCH NEXT FROM @TransactionCursor INTO @transactionID,@transactionDate,@fundCode, @transactionCode,@amount,@unit
    WHILE @@FETCH_STATUS = 0
    BEGIN

      select @status = [status]
      from MIT_FC_TransAllotted
      where transactionID = @transactionID
      and [status]='ALLOTTED'
      IF @@ROWCOUNT=0  BEGIN
         select @status = 'WAITING'
      END
      ELSE BEGIN
         select @status = 'ALLOTTED'
      END

      INSERT INTO @tranasctionTable
      VALUES  (@transactionID,@fundCode,@transactionCode,@transactionDate,@status,@amount,@unit)

     FETCH NEXT FROM @TransactionCursor INTO @transactionID,@transactionDate,@fundCode, @transactionCode,@amount,@unit
    END
    CLOSE @TransactionCursor;
    DEALLOCATE @TransactionCursor;

     SELECT *  FROM @tranasctionTable

  END
    `;

  // const sql = require("mssql");
  return new Promise(function(resolve, reject) {
    const pool1 = new sql.ConnectionPool(config, err => {
      pool1
        .request()
        .input("custCode", sql.VarChar(20), custCode)
        .input("as_of_date", sql.VarChar(20), as_of_date)

        .query(queryStr, (err, result) => {
          if (err) {
            console.log(fncName + " Quey db. Was err !!!" + err);
            reject(err);

          } else {
            // console.log(" queryStr >>" + queryStr);
            // console.log(" Quey RS >>" + JSON.stringify(result));
            resolve(result.recordset);
          }
        });
    });
    pool1.on("error", err => {
      console.log("ERROR>>" + err);
      reject(err);
    });
  });
}


function funcPF_PortDetailByAgent(agentCode,as_of_date){

  logger.info(`Welcome funcPF_PortDetailByAgent() >${agentCode}  >${as_of_date}`)

  return new Promise( function(resolve, reject) {

    try{

    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0" //this is insecure

    /**
   * HTTPS REQUEST (START)
   */
        const request = require('request');
        var HTTPS_ENDPOIN =`${PF_API_URL}/getPortDetailByAgents?agent_list=${agentCode}&as_of_date=${as_of_date}`;
        const option = {
          'X-Auth-Token':'***',
        };
        logger.info(`Start CALL API`)
        request({url:HTTPS_ENDPOIN, headers:option}, function(err, response, body) {
          if(err) {
            logger.error(err);
            reject(err);
          }else{

            var pfObj = JSON.parse(body)

            // logger.info(`PF 1 >> ${JSON.stringify(JSON.parse(body))}`)

          if(pfObj.length<1){

            // Call PF API #2 (decresement date -1)
            try{
              var request_2 = require('request');
              let pf_cnt =1

                // Decrese  date
                var newDate = fcDayDec(as_of_date,1)
                new_as_of_date  = newDate.getFullYear()+'-'+(newDate.getMonth()+1) + '-'+newDate.getDate()

                  HTTPS_ENDPOIN =`${PF_API_URL}/getPortDetailByAgents?agent_list=${agentCode}&as_of_date=${new_as_of_date}`;
                 request_2({ url: HTTPS_ENDPOIN, headers: option }, function (err2, response2, body2) {

                  var pfObj2 = JSON.parse(body2);
                  if (pfObj2.length > 1) {
                    resolve(pfObj2);
                  }else{
                    resolve();
                  }

                });
            }catch(err){
              logger.error(err)
              reject()
            }

          }else{
            try{
              resolve(JSON.parse(body))
            }catch(err){

            }
          }


          }
        });
      /**
       * HTTPS REQUEST (END)
       */

     }catch(err){
        logger.error(err)
        reject()
    }

  });
}



function funcPF_PortDetailByPort(portfolio_code,as_of_date){

  logger.info(`Welcome funcPF_PortDetailByPort() ${portfolio_code} ${as_of_date}`);

  return new Promise(function(resolve, reject) {

    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0" //this is insecure

    /**
   * HTTPS REQUEST (START)
   */
  // getPortDetailByPort?portfolio_code=MGM200070&as_of_date=2021-03-01&product=PF

        const request = require('request');

        const HTTPS_ENDPOIN =`${PF_API_URL}/getPortDetailByPort?portfolio_code=${portfolio_code}&as_of_date=${as_of_date}&product=PF`;
    // const HTTPS_ENDPOIN =`http://192.168.10.45/getPortDetailByPort?portfolio_code=${portfolio_code}&as_of_date=${as_of_date}&product=PF`;
    // const HTTPS_ENDPOIN =`http://192.168.10.45/getPortDetailByPort?portfolio_code=PFIF180137&as_of_date=2021-03-01&product=PF`;
        const option = {
          'X-Auth-Token':'***',
        };

        // logger.info(`HTTPS_ENDPOIN>> ${HTTPS_ENDPOIN}`)

        logger.info(`Start CALL API`)
        request({url:HTTPS_ENDPOIN, headers:option}, function(err, response, body) {
          if(err) {
            logger.error(err);
            reject(err);
          }else{

            // logger.info(`response 1 >> ${JSON.stringify(JSON.parse(response))}`)

              try{
                resolve(JSON.parse(body))
              }catch(err){
                resolve()
              }


          }
        });
      /**
       * HTTPS REQUEST (END)
       */

  });
}
