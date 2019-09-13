const fs = require('fs');
var qpdf = require('node-qpdf');
const path = require('path');

// Build paths
let { buildStreamPathHtml,buildStreamPathPdf } = require('./buildPaths');
const  createStreamUserPdfController = require('./createStreamUserPdf');
const logoPath = path.resolve('./backend/images/MPAM-logo.png');

const createContent = (item) => `

  <p>User : ${item.user}</p>
  <p>Password: ${item.password}</p>

`;
/**
 * @description Generate an `html` page with a populated table
 * @param {String} content
 * @returns {String}
 */


// D:\Merchants\apps\mit\backend\images\MPAM-logo.png

const createHtml = (content) => `
  <html>
    <head>
      <style>

      html, body{ height:100%; margin:0; }
      header{ height:50px; background:lightcyan; }
      footer{ height:50px; background:PapayaWhip; }

      /* Trick */
      body{
        display:flex;
        flex-direction:column;
      }

      footer{
        margin-top:auto;
      }


      body{
        display:flex;
        width: 21cm;
        height: 29.7cm;
        margin: 30mm 45mm 30mm 45mm;
        }
      .txtRight{
        text-align: right;
        margin-left: 10px;
        margin-right: 10px;
      }

      .txtCenter{
        text-align: center;
      }
      .content{
        text-indent: 50px;
        text-align: justify;
        margin-left: 10px;
        margin-right: 10px;
      }

      .content_user{
        text-indent: 30%;
      }

      </style>
    </head>
    <body>
    <header><IMG SRC="${logoPath}" ></header>


    <br>
    <p class='txtRight'>วันที่ ${formatDate(new Date())}</p>
      <br>
    <p class='content'>
        ทางบริษัทหลักทรัพย์จัดการกองทุน เมอร์ชั่น พาร์ทเนอร์ จำกัด มีความยินดีที่ให้บริการแก่ลูกค้าผู้ประสงค์ใช้บริการซื้อขายกองทุนผ่าน Mobile App โดยการโหลด Streaming for fund ได้ทั้งทาง iOS และ Android
    </p>

    <p class='content'>
        <a href="https://apps.apple.com/th/app/streaming-for-fund/id1170482366?l=th">https://apps.apple.com/th/app/streaming-for-fund/id1170482366?l=th</a>
    </p>

    <p class='content'>
        <a href="https://play.google.com/store/apps/details?id=com.settrade.streaming.fund&hl=th">https://play.google.com/store/apps/details?id=com.settrade.streaming.fund&hl=th</a>
    </p>

    <p class='content'>
    ดังนั้นทางบริษัทจัดการฯ ขอนำส่ง User and Password ให้กับลูกค้าตามตามรายละเอียดข้างล่างนี้ โดยการเข้าระบบในครั้งแรก ลูกค้าจะต้องเปลี่ยน password ใหม่ เพื่อความสะดวกและจดจำได้ง่ายในการใช้งานครั้งต่อไป
    </p>

      <br>

      <div class='content_user'>
      ${content}
      </div>

      <br>
      <p class='txtCenter'>ขอแสดงความนับถือ</p>
			<p class='txtCenter' >บริษัทหลักทรัพย์จัดการกองทุน เมอร์ชั่น พาร์ทเนอร์ จำกัด</p>

      <footer>
      <div >
        <p>ติดต่อสอบถามเพิ่มเติมได้ที่</p>
        <p>เบอร์โทร. Wealthservice : 02-6606689</p>
        <p>E-mail : Wealthservice@merchantasset.co.th</p>
        </p>
      </div>
      </footer>
    </body>
  </html>
`;

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

exports.generatePDF = (req,res,next)=>{

  const data = { "cusCode":"123","user":"MPAM001","password":"123","dob":"01Jan1976"}

try {

  this.FNgenerateStreamingPDF(data).then(result=>{

    res.status(200).json({
      msg:'successful',
      path:buildStreamPathPdf,
      filePDF:result.filePDF
    });
  })
} catch (error) {
  console.log('Error generating table', error);
  res.status(401).json({
    msg:error
  });
}

}


exports.FNgenerateStreamingPDF=(data)=>{
  const fileHTML = data.cusCode+".html";
  const filePDF = data.cusCode+".pdf";
  const secPDF = data.cusCode+"_SEC.pdf";
  const _dob = data.dob;

  var _buildStreamPathHtml = buildStreamPathHtml+"/"+fileHTML;
  var _buildStreamPathPdf = buildStreamPathPdf+"/"+filePDF
  var _secBuildStreamPathPdf = buildStreamPathPdf+"/"+secPDF

  const HummusRecipe = require('hummus-recipe');

  return new Promise(function(resolve, reject) {

    /* Check if the file for `html` build exists in system or not */
    if (doesFileExist(_buildStreamPathHtml)) {
      console.log('Deleting old build file');
      /* If the file exists delete the file from system */
      fs.unlinkSync(_buildStreamPathHtml);
    }

    const content = createContent(data);
    const html = createHtml(content);

    /* write the generated html to file */
    fs.writeFileSync(_buildStreamPathHtml, html);
    // console.log('Succesfully created an HTML table');

    createStreamUserPdfController.creatPDFByPath(_buildStreamPathHtml,_buildStreamPathPdf).then(result=>{

      // Create security PDF
      const pdfDoc = new HummusRecipe(_buildStreamPathPdf, _secBuildStreamPathPdf);
      pdfDoc.encrypt({
              userPassword: _dob,
              ownerPassword: _dob,
              userProtectionFlag: 4
          }).endPDF(()=>{
            /* done! */
            fs.unlink(_buildStreamPathHtml, function (err) {
              console.log('html File deleted!');
            });

          });

      resolve({
        pdfPath:_buildStreamPathPdf,
        // filePDF:filePDF
        filePDF:secPDF
      }
      );

    },()=>{
      fs.unlink(_buildStreamPathPdf, function (err) {
                    console.log('pdf File deleted!');
                  });
    });
  });
}


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
