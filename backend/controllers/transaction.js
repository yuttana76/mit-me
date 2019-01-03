const dbConfig = require('../config/db-config');

var config = dbConfig.dbParameters;
var logger = require('../config/winston');

exports.getTransactionByParams = (req, res, next) => {

  var queryStr = `select *
  FROM [MFTS_Transaction]
  WHERE 1=2
  ORDER  BY `;

  var sql = require("mssql");

  sql.connect(config, err => {
    // ... error checks

    // Callbacks
    new sql.Request().query(queryStr, (err, result) => {

      // ... error checks
        if(err){
          console.log('Was err !!!' + err);
          res.status(201).json({
            message: err,
          });
          sql.close();
        }

        res.status(200).json({
          message: "Connex  successfully!",
          result: result.recordset
        });
        sql.close();
    })
  });

  sql.on("error", err => {
    // ... error handler
    console.log('sql.on !!!' + err);
    sql.close();
  });
}

exports.getTransactionsRep = (req, res, next) => {
  var startDate = req.query.startDate || '';
  var endDate = req.query.endDate || startDate;
  var amcCode = req.query.amcCode || '';
  var fundCode = req.query.fundCode || '0';

  if(endDate == 'undefined')
     endDate= startDate;

  logger.info( `Query /getTransactionsRep - ${req.originalUrl} - ${req.ip} `);
  // logger.info( `Param >> ${startDate} - ${endDate} - ${amcCode}  - ${fundCode} `);

  var queryStr = `
  BEGIN
    Declare @startDate VARCHAR(30) = '${startDate}';
    Declare @endDate VARCHAR(30) = '${endDate}';
    Declare @fundCode VARCHAR(30) = '${fundCode}';

    SELECT
    ROW_NUMBER() OVER(ORDER BY B.Fund_Code ,Tran_Date) AS _row
    ,@startDate AS StartDate, @endDate AS EndDate,C.Amc_Code,C.Agent_Code,'Merchant' as Agent_Name
    ,C.Attend_Name, C.Attend_Tel,C.Attend_Fax
    ,B.Fund_Code,B.Eng_Name,C.Contact_Name,C.Contact_Tel,C.Contact_Fax

    ,x.Ref_No,x.Holder_Id,x.Title_Name_T+' '+ x.First_Name_T + ' ' +x.Last_Name_T AS fullName
    ,y.User_Name ,yy.License_Code
    ,a.TranType_Code,a.Tran_Date,a.Amount_Baht,a.Amount_Unit,a.Nav_Price,a.Status_Id
    ,[dbo].MIT_trans_getSwitchIn(a.Tran_No,a.TranType_Code)  as Fund_SI  -- Function get fund to switch in

      FROM MFTS_Transaction A
      LEFT JOIN IT_User y ON MK_Code= A.MktId
      LEFT JOIN MFTS_SalesCode yy ON Id= A.MktId
      LEFT JOIN MFTS_Account x ON X.Ref_No = A.Ref_No
      , MFTS_Fund B
      , MFTS_Amc C
      where A.Fund_Id = B.Fund_Id
      AND B.Amc_Id = C.Amc_Id
      AND C.Active_Flag =1
      AND A.Status_Id =7
      AND A.TranType_Code IN('B','S','SO')

      AND Tran_Date between @startDate and @endDate
      AND C.Amc_Code='${amcCode}'
      AND ( '0' = @fundCode OR B.Fund_Code = @fundCode)
      ORDER BY B.Fund_Code ,Tran_Date

    END
   `;
  //  logger.info( `Query /getTransactionsRep - QUERY >> ${queryStr} `);
  var sql = require("mssql");
  sql.connect(config, err => {
    // Callbacks
    new sql.Request().query(queryStr, (err, result) => {
        if(err){
          console.log('Was err !!!' + err);
          res.status(400).json({
            message: err,
          });
          sql.close();
        }
        sql.close();

        // console.log(result.recordsets.length) // count of recordsets returned by the procedure
        // console.log(result.recordsets[0].length) // count of rows contained in first recordset

        if(result.recordsets[0].length > 0){

          // var dataResult = JSON.parse(result)
          // if (dataResult.recordset)

          res.status(200).json({
            message: "Connex  successfully!",
            result: result.recordset || null
          });


        }else {
          res.status(404).json({
            message: "Not found data"
          });
        }

        sql.close();

    })
  });

  sql.on("error", err => {
    console.log('sql.on !!!' + err);
    logger.error(err);
    sql.close();
  });
}

exports.getTransactionsHeader = (req, res, next) => {
  var startDate = req.query.startDate || '';
  var endDate = req.query.endDate || startDate;
  var amcCode = req.query.amcCode || '';
  var queryStr = `BEGIN
  Declare @startDate VARCHAR(30) = '${startDate}';
  Declare @endDate VARCHAR(30) = '${endDate}';
  Declare @amcCode VARCHAR(30) = '${amcCode}';

  select a.Amc_Code,a.Attend_Name,a.Attend_Tel,a.Attend_Fax,a.Email_Address
  ,@startDate + ' to ' + @endDate AS TransDate
  from MFTS_Amc a
  where Amc_Code= @amcCode
  END `;

  var sql = require("mssql");
  sql.connect(config, err => {
    // Callbacks
    new sql.Request().query(queryStr, (err, result) => {

      // ... error checks
        if(err){
          console.log('Was err !!!' + err);
          res.status(201).json({
            message: err,
          });
          sql.close();
        }

        res.status(200).json({
          message: "Connex  successfully!",
          result: result.recordset
        });
        sql.close();
    })
  });

  sql.on("error", err => {
    // ... error handler
    console.log('sql.on !!!' + err);
    sql.close();
  });
}



exports.getTransactionsByTransType = (req, res, next) => {
  var startDate = req.query.startDate || '';
  var endDate = req.query.endDate || startDate;
  var amcCode = req.query.amcCode || '';
  var fundCode = req.query.fundCode || '0';

  if(endDate == 'undefined')
     endDate= startDate;

  logger.info( `Query /getTransactionsRep - ${req.originalUrl} - ${req.ip} `);
  logger.info( `Param >> ${startDate} - ${endDate} - ${amcCode}  - ${fundCode} `);

  var queryStr = `
  BEGIN
    Declare @startDate VARCHAR(30) = '${startDate}';
    Declare @endDate VARCHAR(30) = '${endDate}';
    Declare @amcCode VARCHAR(30) = '${amcCode}';
    Declare @fundCode VARCHAR(30) = '${fundCode}';

    Declare @Amc_Code [varchar](50);
    Declare @Attend_Name [varchar](150);
    Declare @Email_Address [varchar](150);
    Declare @Attend_Tel [varchar](50);
    Declare @TransDate [varchar](50);
    Declare @Fund_Code [varchar](50);
    Declare @Holder_Id [varchar](50);
    Declare @HolderName [varchar](200);
    Declare @TranType_Code [varchar](10);
    Declare @Amount_Baht [numeric](18, 2);
    Declare @Amount_Unit [numeric](18, 4);
    Declare @Fund_SI [varchar](50);
    Declare @SUB_Baht [numeric](18, 2);
    Declare @SUB_Cheque [numeric](18, 2);
    Declare @SUB_ChequeDesc [varchar](200);
    Declare @RED_Baht [numeric](18, 2);
    Declare @RED_Unit [numeric](18, 4);
    Declare @SW_Baht [numeric](18, 2);
    Declare @SW_Unit [numeric](18, 4);
--
Declare @temp table(
   AmcCode [varchar](50)
   ,Attend_Name [varchar](150)
   ,Email_Address [varchar](150)
   ,Attend_Tel [varchar](50)
   ,TransDate [varchar](50)
   ,FundCode [varchar](50)
   ,Holder_Id [varchar](50)
   ,HolderName [varchar](200)
   ,SUB_Baht [numeric](18, 2)
   ,SUB_Cheque [numeric](18, 2)
   ,SUB_ChequeDesc [varchar](200)
   ,RED_Baht [numeric](18, 2)
   ,RED_Unit [numeric](18, 4)
   ,SW_Baht [numeric](18, 2)
   ,SW_Unit [numeric](18, 4)
   ,SW_ToFund [varchar](50)
)
    DECLARE MFTS_Transaction_cursor CURSOR LOCAL  FOR
        SELECT
        c.Amc_Code,c.Attend_Name,c.Email_Address,c.Attend_Tel
        ,convert(varchar, CONVERT(datetime, @startDate), 106) + ' - ' +	convert(varchar, CONVERT(datetime, @endDate), 106) AS TransDate
        ,B.Fund_Code
        ,x.Holder_Id
        ,x.Title_Name_T+' '+ x.First_Name_T + ' ' +x.Last_Name_T AS fullName
        ,a.TranType_Code
        ,a.Amount_Baht
        ,a.Amount_Unit
        ,[dbo].MIT_trans_getSwitchIn(a.Tran_No,a.TranType_Code)  as Fund_SI
        FROM MFTS_Transaction A
        LEFT JOIN IT_User y ON MK_Code= A.MktId
        LEFT JOIN MFTS_SalesCode yy ON Id= A.MktId
        LEFT JOIN MFTS_Account x ON X.Ref_No = A.Ref_No
        , MFTS_Fund B
        , MFTS_Amc C
        where A.Fund_Id = B.Fund_Id
        AND B.Amc_Id = C.Amc_Id
        AND C.Active_Flag =1
        AND A.Status_Id =7
        AND A.TranType_Code IN('B','S','SO')
        AND Tran_Date between @startDate and @endDate
        AND C.Amc_Code=@amcCode
        AND ( '0' = @fundCode OR B.Fund_Code = @fundCode)
        ORDER BY B.Fund_Code ,Tran_Date


    OPEN MFTS_Transaction_cursor
    FETCH NEXT FROM MFTS_Transaction_cursor
    INTO @Amc_Code,@Attend_Name,@Email_Address,@Attend_Tel,@TransDate,@Fund_Code,@Holder_Id,@HolderName,@TranType_Code,@Amount_Baht,@Amount_Unit,@Fund_SI

          WHILE @@FETCH_STATUS = 0
          BEGIN

            IF @TranType_Code IN('B','SI','TI')
                BEGIN
                    SET  @SUB_Baht = @Amount_Baht;

                END;
            ELSE IF @TranType_Code IN('S')
                BEGIN
                    SET  @RED_Baht = @Amount_Baht;
                    SET  @RED_Unit = @Amount_Unit;
                END;
            ELSE IF @TranType_Code IN('SO')
                BEGIN
                    SET  @SW_Baht = @Amount_Baht;
                    SET  @SW_Unit = @Amount_Unit;
                END;
            --
            INSERT INTO @temp
            SELECT @Amc_Code,@Attend_Name,@Email_Address,@Attend_Tel,@TransDate
            ,@Fund_Code,@Holder_Id,@HolderName,@SUB_Baht,@SUB_Cheque,@SUB_ChequeDesc,@RED_Baht,@RED_Unit,@SW_Baht,@SW_Unit,@Fund_SI

             -- Clear data
             SET @SUB_Baht =NULL;
             SET @RED_Baht = NULL;
             SET @SW_Baht = NULL;
             SET @RED_Unit = NULL;
             SET @SW_Unit = NULL;

            FETCH NEXT FROM MFTS_Transaction_cursor
            INTO @Amc_Code,@Attend_Name,@Email_Address,@Attend_Tel,@TransDate,@Fund_Code,@Holder_Id,@HolderName,@TranType_Code,@Amount_Baht,@Amount_Unit,@Fund_SI

          END

    CLOSE MFTS_Transaction_cursor
    DEALLOCATE MFTS_Transaction_cursor

-- OUTPUT
    SELECT * FROM @temp

    END
   `;

  //  logger.info( `Query /getTransactionsRep - QUERY >> ${queryStr} `);

  var sql = require("mssql");
  sql.connect(config, err => {
    // Callbacks
    new sql.Request().query(queryStr, (err, result) => {
        if(err){
          console.log('Was err !!!' + err);
          res.status(400).json({
            message: err,
          });
          sql.close();
        }
        sql.close();

        if(result.recordsets[0].length > 0){

          // var dataResult = JSON.parse(result)
          // if (dataResult.recordset)

          res.status(200).json({
            message: "Connex  successfully!",
            result: result.recordset || null
          });


        }else {
          res.status(404).json({
            message: "Not found data"
          });
        }

        sql.close();

    })
  });

  sql.on("error", err => {
    console.log('sql.on !!!' + err);
    logger.error(err);
    sql.close();
  });
}
