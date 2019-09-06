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
    <IMG SRC="${logoPath}" >

    <br>
    <p class='txtRight'>วันที่ (Date) ${formatDate(new Date())}</p>
      <br>
    <p class='content'>
        ทางบริษัทหลักทรัพย์จัดการกองทุน เมอร์ชั่น พาร์ทเนอร์ จำกัด มีความยินดีที่ลูกค้าประสงค์ใช้บริการซื้อขายกองทุนผ่าน Mobile App ดังนั้นทางบริษัทจัดการฯ ขอนำส่ง User and Password ให้กับลูกค้าตามที่แนบมานี้ โดยการเข้าระบบในครั้งแรก ลูกค้าจะต้องเปลี่ยน password ใหม่ เพื่อความสะดวกและจดจำได้ง่ายในการใช้งานครั้งต่อไป
    </p>
      <br>

      <div class='content_user'>
      ${content}
      </div>

      <br>
      <p class='txtCenter'>ขอแสดงความนับถือ</p>
			<p class='txtCenter' >บริษัทหลักทรัพย์จัดการกองทุน เมอร์ชั่น พาร์ทเนอร์ จำกัด</p>

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

  const data = { "cusCode":"123","user":"MPAM001","password":"123"}

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

  var _buildStreamPathHtml = buildStreamPathHtml+"/"+fileHTML;
  var _buildStreamPathPdf = buildStreamPathPdf+"/"+filePDF

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

      resolve({
        pdfPath:_buildStreamPathPdf,
        filePDF:filePDF
      }
      );

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
