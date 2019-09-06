const fs = require('fs');
var qpdf = require('node-qpdf');


// Build paths
let { buildStreamPathHtml,buildStreamPathPdf } = require('./buildPaths');
const  createStreamUserPdfController = require('./createStreamUserPdf');


const createContent = (item) => `
  <div>
  <p>User name: ${item.user}</p>
  <p>Password: ${item.password}</p>
  </div>
`;
/**
 * @description Generate an `html` page with a populated table
 * @param {String} content
 * @returns {String}
 */
const createHtml = (content) => `
  <html>
    <head>
      <style>
      </style>
    </head>
    <body>
      ${content}
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

  buildStreamPathHtml = buildStreamPathHtml+"/"+fileHTML;
  buildStreamPathPdf = buildStreamPathPdf+"/"+filePDF
  buildStreamPathPdfX = buildStreamPathPdf+"/x"+filePDF

  return new Promise(function(resolve, reject) {

    /* Check if the file for `html` build exists in system or not */
    if (doesFileExist(buildStreamPathHtml)) {
      console.log('Deleting old build file');
      /* If the file exists delete the file from system */
      fs.unlinkSync(buildStreamPathHtml);
    }

    const content = createContent(data);
    const html = createHtml(content);

    /* write the generated html to file */
    fs.writeFileSync(buildStreamPathHtml, html);
    // console.log('Succesfully created an HTML table');

    createStreamUserPdfController.creatPDFByPath(buildStreamPathHtml,buildStreamPathPdf).then(result=>{

      resolve({
        pdfPath:buildStreamPathPdf,
        filePDF:filePDF
      }
      );

    });
  });
}
