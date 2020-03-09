const fs = require('fs');
// var qpdf = require('node-qpdf');
const path = require('path');
var logger = require("../../config/winston");
const  createStreamUserPdfController = require('./createStreamUserPdf');

// let { buildStreamPathHtml,buildStreamPathPdf } = require('./buildPaths');
const logoPath = path.resolve('./backend/images/MPAM-logo.png');

// D:\Merchants\apps\mit\backend\downloadFiles\files

exports.createKYCPDF=(data)=>{

  logger.info("Welcome CreateKYCPDF ");

  const buildStreamPathHtml = path.resolve('./backend/downloadFiles/files/')
  const buildStreamPathPdf = path.resolve('./backend/downloadFiles/files/')


  const fileHTML = data.Cust_Code+"_KYC.html";
  const filePDF = data.Cust_Code+"_KYC.pdf";
  // const secPDF = data.Cust_Code+"_SEC.pdf";
  // const _dob = data.dob;

  var _buildStreamPathHtml = buildStreamPathHtml+"/"+fileHTML;
  var _buildStreamPathPdf = buildStreamPathPdf+"/"+filePDF
  // var _secBuildStreamPathPdf = buildStreamPathPdf+"/"+secPDF
  // const HummusRecipe = require('hummus-recipe');

  return new Promise(function(resolve, reject) {

    /* Check if the file for `html` build exists in system or not */
    if (doesFileExist(_buildStreamPathHtml)) {
      console.log('Deleting old build file');
      /* If the file exists delete the file from system */
      fs.unlinkSync(_buildStreamPathHtml);
    }

    logger.info("Cust_Code>> " + data.Cust_Code);

    // const content = createContent(data);
    var suitHeader=`
    <table class="customers">
    <tr>
    <td>ID ${data.Cust_Code}</td>
    <td>${data.FullName}</td
    </tr>
    <tr>
    <td>Suit Date ${data.SuitDate}</td>
    <td>Risk score ${data.TotalScore}     Risk level ${data.RiskLevel}</td
    </tr>
    </table>
    `;

    var suitDetail='';
    AnsList=JSON.parse(data.Ans);
    AnsList.forEach(function(item) {
      suitDetail +=`<p>${item.id}.${item.name}</p>`;
        item.choices.forEach(function(choice){
          if(item.answer == choice.id){
            suitDetail +=`<p class='ans'> <input class='ans_checkbox' type="checkbox"  checked>(${choice.id}). ${choice.name}</input></p>`;
          }else{
            suitDetail +=`<p class='ans'>(${choice.id}). ${choice.name}</p>`;
          }
        });
    });

    logger.info("START createHtml()");
    // logger.info(JSON.stringify(data));

    var html='';
    try {
      html = createHtml(data,suitHeader,suitDetail);
    }
    catch (e) {
      console.log('Error createHtml():'+e);
      return reject(e);
    }

    /* write the generated html to file */
    fs.writeFileSync(_buildStreamPathHtml, html);
    // console.log('Succesfully created an HTML table');

    createStreamUserPdfController.creatPDFByPath(_buildStreamPathHtml,_buildStreamPathPdf).then(result=>{

      // Create security PDF
      // const pdfDoc = new HummusRecipe(_buildStreamPathPdf, _secBuildStreamPathPdf);
      // pdfDoc.encrypt({
      //         userPassword: _dob,
      //         ownerPassword: _dob,
      //         userProtectionFlag: 4
      //     }).endPDF(()=>{
      //       console.log("Succesfully created  >>" + _buildStreamPathPdf);

      //       // fs.unlink(_buildStreamPathHtml, function (err) {
      //       //   console.log('html File deleted!' + _buildStreamPathHtml );
      //       // });
      //     });

      resolve({
        pdfPath:_buildStreamPathPdf,
        filePDF:filePDF
        // filePDF:secPDF
      }
      );

    },()=>{
      console.log('PDF created !');
      // fs.unlink(_buildStreamPathPdf, function (err) {
      //               console.log('pdf File deleted!');
      //             });
    });
  });
}



/**
 * @description this method takes in a path as a string & returns true/false
 * as to if the specified file path exists in the system or not.
 * @param {String} filePath
 * @returns {Boolean}
 */
const doesFileExist = (filePath) => {
	try {
		fs.statSync(filePath); // get information of the specified file path.
		return true;
	} catch (error) {
		return false;
	}
};

// const createContent = (item) => `
//   <p>User name  ${item.user}</p>
//   <p>Password  ${item.password}</p>
// `;

const createHtml = (data,_header,_content) => `
<!DOCTYPE html>
<html lang="en">
<head>
<title>CSS Template</title>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
* {
  box-sizing: border-box;
}

body {
  font-family: Arial, Helvetica, sans-serif;
}

table {
    border: solid;
    border-width: thin;
    width: 700.85pt;
}

table td p{
color:gray;
}

.header1 {
  text-align: start;
  font-size: 15.0pt;
  color: #0C45A1;
  text-indent: 5px;
}
.header2 {
    background-color: #1365BF;
    color: white;
    width:100%;
    text-indent: 5px;
}
.header3 p{
    color: #0C45A1;
    font-weight: bold;
    text-indent: 5px;
}

.content1{
text-indent: 20px;
}

.content2{
text-indent: 50px;
}

.sameLine{
display: inline-block
}

/* Responsive layout - makes the two columns/boxes stack on top of each other instead of next to each other, on small screens */
@media (max-width: 600px) {
  nav, article {
    width: 100%;
    height: auto;
  }
}
</style>
</head>
<body>

<table>
<tbody>
<tr>
<td >
<span class='header1 '>FundConnext </span>
</td>
</tr>

<tr class='header2'>
  <td>
  1. ข้อมูลส่วนบุคคลสำหรับประกอบการเปิดบัญชีกองทุนรวม Personal Information - For Mutual Fund Account
  </td>
 </tr>

<tr class='content1'>
  <td>
  <p>ประเภทบัตร*  {VAL1}</p> </td>
 </tr>
<tr class='content2 '>
  <td >
  <p >เลขที่ No.  ${data.Cust_Code}        Issuing Country {Thai}</p>
  <p class='sameLine'>วันหมดอายุ (ค.ศ.) Expiry Date: (ฺA.D.) {01/01/2020}    บัตรตลอดชีพ Not Expired</p>
  </td>
 </tr>

<tr class='content1'>
  <td>
  <p>เพศ Gender*  {VAL1}</p> </td>
 </tr>

 <tr class='content1'>
  <td>
  <p>คำนำหน้า Title*</p> </td>
 </tr>

 <tr class='content1'>
  <td>
  <p>ชื่อ - นามสกุล (ภาษาไทย)* ${data.FullName_th}</p> <p>มือถือ Mobile* ${data.Mobile} </p> </td>
 </tr>

 <tr class='content1'>
  <td>
  <p>Name - Surname (English)* ${data.FullName_en}</p> <p>อีเมล์ E-mail ${data.Email}</p></td>
 </tr>


 <tr class='content1 sameLine'>
  <td >
  <p>วันเดือนปีเกิด (ค.ศ.) Date of Birth (ฺA.D.)*  {123456789}   สัญชาติ Nationality* {01/01/2020}</p>
 </tr>

  <tr class='content1'>
  <td><p>
  สถานภาพ Marital Status*
  </p></td>
 </tr>

 <tr class='header3'>
  <td>
  <p>ข้อมูลคู่สมรส (ถ้ามี) Spouse Information (if any)</p>
  </td>
 </tr>
 <tr class='content1'>
  <td>
  <p>ประเภทบัตร*  {VAL1}</p> </td>
 </tr>
<tr class='content2'>
  <td >
  <p >เลขที่ No.  {123456789}        Issuing Country {Thai}</p>
  <p class='sameLine'>วันหมดอายุ (ค.ศ.) Expiry Date: (ฺA.D.) {01/01/2020}    บัตรตลอดชีพ Not Expired</p>
  </td>
 </tr>
 <tr class='content1'>
  <td>
  <p>คำนำหน้า Title*</p> </td>
 </tr>
 <tr class='content1'>
  <td>
  <p>ชื่อ - นามสกุล Name - Surname*    xxxx - yyyy  โทรศัพท์ Telephone{08-97765-331}</p>
  </td>
 </tr>

 <tr class='header3'>
  <td>
  <p>จำนวนบุตรหรือบุตรบุญธรรมที่ยังไม่บรรลุนิติภาวะ (อายุไม่ถึง 20 ปี และ ยังไม่ได้สมรส)</p>
  <p>Number of children who is under 20 and not married</p>
  </td>
 </tr>

 <tr class='content1'>
  <td>
  <p>ประเภทบัตร*  {VAL1}</p> </td>
 </tr>

<tr class='content2'>
  <td >
  <p >เลขที่ No.  {123456789}        Issuing Country {Thai}</p>
  <p class='sameLine'>วันหมดอายุ (ค.ศ.) Expiry Date: (ฺA.D.) {01/01/2020}    บัตรตลอดชีพ Not Expired</p>
  </td>
 </tr>
 <tr class='content1'>
  <td>
  <p>คำนำหน้า Title*</p> </td>
 </tr>
 <tr class='content1'>
  <td>
  <p>ชื่อ - นามสกุล Name - Surname*    xxxx - yyyy  โทรศัพท์ Telephone{08-97765-331}</p>
  </td>
 </tr>
  <tr class='content1'>
  <td>
  <p>วันเดือนปีเกิด (ค.ศ.) Date of Birth (ฺA.D.) </p>
  </td>
 </tr>

 <!--Address-->
 <tr class='header2'>
  <td>2. ที่อยู่ Address </td>
 </tr>

 <tr class='header3'>
  <td>
  <p>ที่อยู่ตามทะเบียนบ้าน / ที่อยู่ในประเทศเจ้าของสัญชาติ </p>
  <p>Residence Registration Address / Address in home country*</p>
  </td>
 </tr>

<tr class='content1'>
 <td>
  <p>เลขที่ Address No.        หมู่ที่ Moo No.         อาคาร/หมู่บ้าน Building/Mooban </p>
  <p>ชั้น Floor ซอย Soi       ถนน Road</p>
  <p>ตำบล Sub-district/Tambon    อำเภอ District/Amphur </p>
  <p>จังหวัด Province รหัสไปรษณีย์ Postal Code </p>
  <p>โทรศัพท์ Telephone</p>
 </td>
 </tr>
 <tr class='header3'>
  <td>
  <p>ที่อยู่ที่ทำงาน Workplace Address* </p>
  </td>
 </tr>

 <tr class='content1'>
  <td>
  <p>
  <input type="radio" name="workAddr">ตามทะเบียนบ้าน Same as Residence Registration Address
  <input type="radio" name="workAddr">อื่นๆ (โปรดระบุ) Other (Please specify)
  </p>
  <p>บริษัท Company name</p>
  </td>
 </tr>

 <tr class='header3'>
  <td>
  <p>ที่อยู่ปัจจุบัน Current Address*</p>
  </td>
 </tr>

  <tr class='content1'>
  <td>
  <p>
  <input type="radio" name="currentAddr">ตามทะเบียนบ้าน Same as Residence Registration Address
  <input type="radio" name="currentAddr">ตามที่ทำงาน Workplace Address
  <input type="radio" name="currentAddr">อื่นๆ (โปรดระบุ) Other (Please specify)
  </p>
  </td>
 </tr>
 <!--Background-->
 <tr class='header2'>
  <td>3. ข้อมูลเพิ่มเติม Background</td>
 </tr>

 <tr class='header3'>
  <td>
  <p>อาชีพ Occupation*</p>
  </td>
 </tr>

 <tr class='header3'>
  <td>
  <p>ประเภทธุรกิจ Business Type*</p>
  </td>
 </tr>

 <tr class='header3'>
  <td>
  <p>แหล่งที่มาของรายได้จากประเทศ Source of Income's Country*</p>
  </td>
 </tr>

  <tr class='header3'>
  <td>
  <p>แหล่งที่มาของรายได้ Source of Income*</p>
  </td>
 </tr>

 <tr class='header3'>
  <td>
  <p>ต่อเดือน (บาท) Monthly Income (Baht)*</p>
  </td>
 </tr>

  <tr class='header3'>
  <td>
  	<p>ท่านเคยมีประวัติการกระทำผิดกฏหมายฟอกเงินหรือไม่*</p>
	<p>Do you have any money laundering record?</p>
  </td>
 </tr>
<tr class='content1'>
 <td>
 <input type="radio" name="moneyLon">ใช่ Yes
  <input type="radio" name="moneyLon">ไม่ใช่ No
 </td>
 </tr>

 <tr class='header3'>
  <td>
  	<p>ท่านเป็นนักการเมืองหรือเกี่ยวข้องกับนักการเมือง หรือบุคคลที่มีสถานภาพทางการเมืองหรือไม่*</p>
	<p>Are you a politician or connected to any Political person?</p>
  </td>
 </tr>
<tr class='content1'>
 <td>
 <input type="radio" name="PoliticalRelate">ใช่ Yes
  <input type="radio" name="PoliticalRelate">ไม่ใช่ No
 </td>
 </tr>


<tr class='header3'>
  <td>
  	<p>ท่านเคยถูกปฏิเสธการรับทำธุรกรรมทางการเงินจากสถาบันทางการเงินอื่นหรือไม่*</p>
	<p>Have you ever been denied to process transaction from other financial institutions?</p>
  </td>
 </tr>

 <tr class='content1'>
 <td>
 <input type="radio" name="rejectFin">ใช่ Yes
  <input type="radio" name="rejectFin">ไม่ใช่ No
 </td>
 </tr>

</tbody>
</table

</body>
</html>

`;


function formatDate(date) {
  var monthNames = [
    "January", "February", "March",
    "April", "May", "June", "July",
    "August", "September", "October",
    "November", "December"
  ];

  var day = date.getDate();
  var monthIndex = date.getMonth();
  var year = date.getFullYear();

  return day + ' ' + monthNames[monthIndex] + ' ' + year;
}
