// https://github.com/puppeteer/puppeteer/blob/master/docs/api.md#pagepdfoptions
// https://www.npmjs.com/package/pdf-puppeteer
// https://handlebarsjs.com/guide/builtin-helpers.html#if

const fs = require('fs-extra');
const puppeteer = require('puppeteer');
const path = require('path');
var logger = require("../../config/winston");
var hbs = require("handlebars");
// const data = require('./templates/database.json');
const moment = require('moment');

const filePDFName ='fundConnextOpenAccount.pdf';
const createPath = path.resolve('./backend/downloadFiles/files/')
const pdfTemplate ='fundConnextOpenAccount_template'

const compile = async function(templateName,data){
  const filePath = path.join(__dirname,'templates',`${templateName}.hbs`);
  const html = await fs.readFile(filePath,'utf-8');
  return hbs.compile(html)(data);
};

//{{dateFormat xxx 'DD/MM/YYYY'}}
hbs.registerHelper('dateFormat',function(value,format){
  return moment(value).format(format);
});

hbs.registerHelper('isdefined', function (value) {
  return value !== undefined;
});

hbs.registerHelper('isnull', function (value) {
  return value !== null;
});

hbs.registerHelper('isNA', function (value) {
  return value === 'N/A';
});

// Start function
const startPDF = async function(custCode,data) {
  try{
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const content = await compile(pdfTemplate,data);

    await page.setContent(content);
    await page.emulateMedia('screen');

    var createPdfPath = createPath+"/"+custCode+"_"+filePDFName

    await page.pdf({
      path:createPdfPath,
      format:'A4',
      printBackground:true
    });

    logger.info('Create pdf fundConnextOpenAccount successful.');
    await browser.close();

    return createPdfPath;

  }catch(e){
    // console.log('',e);
    logger.error(e);
  }
}

exports.createFundConnextOpenAccount = async (custCode,fcdata) => {
  return new Promise(function(resolve, reject) {
    try{
      startPDF(custCode,fcdata).then(result=>{
        resolve('Succesfully created an PDF table :' + result)
      });

    }catch(e){
      logger.error(e);
      reject(e);
    }
  });
}
