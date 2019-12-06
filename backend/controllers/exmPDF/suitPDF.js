const fs = require('fs');
// var qpdf = require('node-qpdf');
const path = require('path');
var logger = require("../../config/winston");
const  createStreamUserPdfController = require('./createStreamUserPdf');

// let { buildStreamPathHtml,buildStreamPathPdf } = require('./buildPaths');
const logoPath = path.resolve('./backend/images/MPAM-logo.png');
buildStreamPathHtml = path.resolve('./backend/controllers/readFiles/suit/')
buildStreamPathPdf = path.resolve('./backend/controllers/readFiles/suit/')

exports.suitCreatePDF=(data)=>{

  logger.info("Welcome suitCreatePDF ");

  const fileHTML = data.CustCode+"_Suit.html";
  const filePDF = data.CustCode+"_Suit.pdf";
  // const secPDF = data.CustCode+"_SEC.pdf";
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

    logger.info("CustCode>> " + data.CustCode);

    // const content = createContent(data);
    var result_content=`
    <table class="customers">
    <tr>
    <td>ID ${data.CustCode}</td>
    <td>${data.FullName}</td
    </tr>
    <tr>
    <td>Suit Date ${data.SuitDate}</td>
    <td>Risk score ${data.TotalScore}     Risk level ${data.RiskLevel}</td
    </tr>
    </table>
    `;

    var choosen_content='';
    AnsList=JSON.parse(data.Ans);

    AnsList.forEach(function(item) {
      choosen_content +=`<p>${item.id}.${item.name}</p>`;

        item.choices.forEach(function(choice){
          if(item.answer == choice.id){
            choosen_content +=`<p class='ans'> <input class='ans_checkbox' type="checkbox"  checked>(${choice.id}). ${choice.name}</input></p>`;
          }else{
            choosen_content +=`<p class='ans'>(${choice.id}). ${choice.name}</p>`;
          }

        });
    });

    const html = createHtml(result_content,choosen_content);
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

const createHtml = (result_content,choosen_content) => `
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
        font-size: large;
      }

      .content{
        // text-indent: 50px;
        text-align: justify;
        margin-left: 10px;
        margin-right: 10px;
        font-size: xx-small;
      }

      .ans{
        text-indent: 50px;

      }

     .ans_checkbox{
        position: relative;
        top: 4px;
     }

      .nowrap{white-space: nowrap;}

      .customers {
        font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;
        border-collapse: collapse;
        width: 100%;

        text-align: center;
        font-size: small;
      }

      .customers td, .customers th {
        border: 1px solid #ddd;
        padding: 8px;
      }

      .customers tr:nth-child(even){background-color: #f2f2f2;}

      .customers tr:hover {background-color: #ddd;}

      .customers th {
        padding-top: 12px;
        padding-bottom: 12px;
        text-align: left;
        background-color: #4CAF50;
        color: white;
      }




      </style>
    </head>
    <body>
    <header><IMG SRC="${logoPath}" ></header>

    <p class='txtCenter'>
      ผลการ ประเมิน Suitability Test
      </p>
      ${result_content}

      <p class='txtCenter'>
      แบบประเมิน Suitability Test
      </p>

      <div class='content'>
      ${choosen_content}
      <div>
      <br>

      <p class='txtCenter'>
      ส่วนที่ 2 ผลการประเมินความเหมาะสมในการลงทุน
      </p>

    <div>
    <table class="customers">
        <tr>
          <td>คะแนน</td>
          <td>ระดับ</td>
          <td>ประเภทนักลงทุน</td>
        </tr>

        <tr>
          <td>
              <span>น้อยกว่า 15</span>
          </td>
          <td>
              <span>1</span>
          </td>
          <td>
              <span>เสี่ยงต่ำ</span>
          </td>
        </tr>
        <tr>
          <td>
              <span>15-21</span>
          </td>
          <td>
              <span>2</span>
          </td>
          <td>
              <span>เสี่ยงปานกลางค่อนข้างต่ำ</span>
          </td>
        </tr>
        <tr >
          <td>
            <span >22-29</span>
          </td>
          <td>
            <span >3</span>
          </td>
          <td>
              <span >เสี่ยงปานกลางค่อนข้างสูง</span>
          </td>
        </tr>
        <tr>
          <td>
            <span >30-36</span>
          </td>
          <td>
              <span >4</span>
          </td>
          <td>
              <span >เสี่ยงสูง</span>
          </td>
        </tr>
        <tr>
          <td>
            <span >37 ขึ้นไป</span>
          </td>
          <td>
            <span >5</span>
          </td>
          <td>
              <span >เสี่ยงสูงมาก</span>
          </td>
        </tr>
    </table>
    </div>

      <p class='txtCenter'>
      ส่วนที่ 3 ตัวอย่างคำแนะนำเรื่องการจัดสรรการลงทุน
      </p>

      <div>

    <table class="customers">
        <tr>
          <td></td>
          <td colspan=5 >สัดส่วนการลงทุน</td>
		</tr>
        <tr>
        	<td>ประเภทผู้ลงทุน</td>
          <td>เงินฝากและตราสารหนี้ระยะสั้น</td>
          <td>ตราสารหนี้ภาครัฐที่มีอายุมากกว่า 1 ปี</td>
          <td>ตราสารหนี้ภาคเอกชน</td>
          <td>ตราสารทุน</td>
          <td>การลงทุนทางเลือก*</td>
        </tr>
        <tr>
          <td>
            <span >เสี่ยงต่ำ</span>
          </td>
          <td colspan=2 >
             <span >&gt;60%</span>
            </td>
          <td >
             <span >&lt;20% </span>
          </td>
          <td >
              <span >&lt;10% </span>
          </td>
          <td >
              <span >&lt;5% </span>
          </td>
        </tr>
        <tr>
          <td>
            <span >เสี่ยงปานกลางค่อนข้างต่ำ</span>
          </td>
          <td>
              <span >&lt;20% </span>
          </td>
          <td colspan=2 >
              <span >&lt;70% </span>
          </td>
          <td >
              <span >&lt;20% </span>
          </td>
          <td >
              <span >&lt;10% </span>
          </td>
        </tr>
        <tr>
          <td>
            <span >เสี่ยงปานกลางค่อนข้างสูง </span>
          </td>
          <td >
              <span >&lt;10% </span>
          </td>
          <td colspan=2 >
              <span >&lt;60% </span>
          </td>
          <td >
              <span >&lt;30% </span>
          </td>
          <td >
              <span >&lt;10% </span>
          </td>
        </tr>
        <tr>
          <td>
            <span >เสี่ยงสูง </span>
          </td>
          <td>
              <span >&lt;10% </span>
          </td>
          <td colspan=2 >
              <span >&lt;40% </span>
          </td>
          <td >
              <span >&lt;40% </span>
          </td>
          <td >
              <span >&lt;20% </span>
          </td>
        </tr>
        <tr>
          <td>
            <span >เสี่ยงสูงมาก</span>
          </td>
          <td>
              <span>&lt;5%</span>
          </td>
          <td colspan=2 >
              <span >&lt;30%</span>
          </td>
          <td >
              <span >&lt;60%</span>
          </td>
          <td >
              <span >&lt;30%</span>
          </td>
        </tr>
    </table>

    <p>*รวมถึง สินค้าโภคภัณฑ์ สัญญาซื้อขายล่วงหน้า</p>
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
