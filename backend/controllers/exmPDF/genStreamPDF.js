const fs = require('fs');
var qpdf = require('node-qpdf');
const path = require('path');

// Build paths
let { buildStreamPathHtml,buildStreamPathPdf } = require('./buildPaths');
const  createStreamUserPdfController = require('./createStreamUserPdf');
const logoPath = path.resolve('./backend/images/MPAM-logo.png');
const download_applePath = path.resolve('./backend/images/download_apple.png');
const download_googlePath = path.resolve('./backend/images/download_google.png');

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
      header{ height:50px;  }
      footer{ height:50px;  }

      /* Trick */
      body{
        display:flex;
        flex-direction:column;
        width: 17cm;
        height: 27.7cm;
        margin-top:50px;
        margin-left:50px;
      }

      footer{
        height: 150px;
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

      .download{
        margin:auto;
      }
      .download img{
        width:150px;
      }

      .nowrap{white-space: nowrap;}

      </style>
    </head>
    <body>
    <header><IMG SRC="${logoPath}" ></header>


    <br>
    <p class='txtRight'>วันที่ ${formatDate(new Date())}</p>
      <br>

    <p class='content'>
    ทางบริษัทหลักทรัพย์จัดการกองทุน เมอร์ชั่น พาร์ทเนอร์ จำกัด ขอนำส่ง User and Password ให้กับลูกค้าตามที่แนบมานี้ โดยการเข้าระบบในครั้งแรก ลูกค้าจะต้องเปลี่ยน password ใหม่ เพื่อความสะดวกและจดจำได้ง่ายในการใช้งานครั้งต่อไป
    </p>

      <br>

      <div class='content_user'>
      ${content}
      </div>
      <br>



      <div>
      <br>
      <p class='txtCenter'>ขอแสดงความนับถือ</p>
			<p class='txtCenter' >บริษัทหลักทรัพย์จัดการกองทุน เมอร์ชั่น พาร์ทเนอร์ จำกัด</p>
      </div>

      <br>
      <div class="download">
      <a href="https://itunes.apple.com/th/app/streaming-for-fund/id1170482366?l=th&amp;mt=8" target="_blank">
        <img src="${download_applePath}" class="img-responsive" width="200"></a>

      <a href="https://play.google.com/store/apps/details?id=com.settrade.streaming.fund" target="_blank">
        <img src="${download_googlePath}" class="img-responsive" width="220"></a>
      </div>

      <footer>
        <div class="footer">
          <p>ติดต่อสอบถามเพิ่มเติมได้ที่</p>
          <p>เบอร์โทร. Wealthservice : 02-6606689  E-mail : Wealthservice@merchantasset.co.th</p>
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

  const data = { "cusCode":"3101400507760","user":"MPAM001","password":"123","dob":"01Jan1976"}

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
            console.log("Succesfully created  >>" + _buildStreamPathPdf);

            fs.unlink(_buildStreamPathHtml, function (err) {
              console.log('html File deleted!' + _buildStreamPathHtml );
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
