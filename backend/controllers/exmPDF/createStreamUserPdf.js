const fs = require('fs');
const puppeteer = require('puppeteer');
// Build paths
const { buildStreamPathHtml, buildStreamPathPdf } = require('./buildPaths');

const printPdf = async (_htmlPath) => {
	console.log('Starting: Generating PDF Process, Kindly wait ..');
	/** Launch a headleass browser */
	const browser = await puppeteer.launch();
	/* 1- Ccreate a newPage() object. It is created in default browser context. */
	const page = await browser.newPage();
	/* 2- Will open our generated `.html` file in the new Page instance. */
	await page.goto(_htmlPath, { waitUntil: 'networkidle0' });
	/* 3- Take a snapshot of the PDF */
	const pdf = await page.pdf({
		format: 'A4',
		margin: {
			top: '20px',
			right: '20px',
			bottom: '20px',
			left: '20px'
		}
	});
	/* 4- Cleanup: close browser. */
	await browser.close();
	console.log('Ending: Generating PDF Process');
	return pdf;
};

const init = async (_htmlPath,_pdfPath) => {
	try {
		const pdf = await printPdf(_htmlPath);
		fs.writeFileSync(_pdfPath, pdf);
		console.log('Succesfully created an PDF table');
	} catch (error) {
		console.log('Error generating PDF', error);
	}
};

exports.creatPDF = (req,res,next)=>{

  return new Promise(function(resolve, reject) {

    init().then(result=>{
       resolve('Succesfully created an PDF table')

    })


  });
}



exports.creatPDFByPath = (_htmlPath,_pdfPath)=>{

  return new Promise(function(resolve, reject) {

    init(_htmlPath,_pdfPath).then(result=>{
       resolve('Succesfully created an PDF table')
    })


  });
}

