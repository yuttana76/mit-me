// https://github.com/puppeteer/puppeteer/blob/master/docs/api.md#pagepdfoptions
// https://www.npmjs.com/package/pdf-puppeteer
// https://handlebarsjs.com/guide/builtin-helpers.html#if

const fs = require('fs-extra');
const puppeteer = require('puppeteer');
const path = require('path');
var logger = require("../../config/winston");
var hbs = require("handlebars");
const moment = require('moment');

const filePDFsuffix ='fundConnextOpenAccount.pdf';
const createPath = path.resolve('./backend/downloadFiles/files/')
const pdfTemplate ='fcOpenAccount_template'

const child_partial_filePath = path.join(__dirname,'templates',`child_partial.hbs`);
const addr_partial_filePath = path.join(__dirname,'templates',`addr_partial.hbs`);

const compile = async function(templateName,data){
  const filePath = path.join(__dirname,'templates',`${templateName}.hbs`);
  const html = await fs.readFile(filePath,'utf-8');
  return hbs.compile(html)(data);
};

//{{dateFormat xxx 'DD/MM/YYYY'}}
hbs.registerHelper('dateFormat',function(value,format){
  if(value){
    return moment(value).format(format);
  }else{
    return '';
  }
});

hbs.registerHelper('isdefined', function (value) {
  return value !== undefined;
});

hbs.registerHelper('isset', function (value) {
  return value === '1';
});

hbs.registerHelper('isNotset', function (value) {
  return value !== '1';
});

hbs.registerHelper('isnull', function (value) {
  return value == null;
});

hbs.registerHelper('isNA', function (value) {
  return value === 'N/A';
});

hbs.registerHelper('isChecked', function (val1,val2) {
  return val1 === val2? 'checked':'';
});

hbs.registerHelper('isNotChecked', function (val1,val2) {
  return val1 !== val2? 'checked':'';
});

hbs.registerHelper('equal', function (val1,val2) {
  return val1 == val2;
});

hbs.registerHelper('isCheckedInclude', function (str,val) {
  return str.includes(val)? 'checked':'';
});

hbs.registerHelper("math", function(lvalue, operator, rvalue, options) {
  lvalue = parseFloat(lvalue);
  rvalue = parseFloat(rvalue);

  return {
      "+": lvalue + rvalue
  }[operator];
});


hbs.registerPartial('child_partial', fs.readFileSync(child_partial_filePath, 'utf8'));
hbs.registerPartial('addr_partial', fs.readFileSync(addr_partial_filePath, 'utf8'));

// Start function
const startPDF = async function(custCode,data) {

  var surveyinfo=data[0][0]
  surveyinfo['childrens'] = data[1][0]
  surveyinfo['AddrList'] = data[2][0]

  try{
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const content = await compile(pdfTemplate,surveyinfo);

    await page.setContent(content);
    await page.emulateMedia('screen');

    var createPdfPath = createPath+"/"+custCode+"_"+filePDFsuffix

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

exports.createFundConnextOpenAccount = async (custCode,data) => {
  // console.log("createFundConnextOpenAccount()"+JSON.stringify(fcdata));
  return new Promise(function(resolve, reject) {
    try{
      startPDF(custCode,data).then(result=>{
        resolve('Succesfully created an PDF table :' + result)
      });

    }catch(e){
      logger.error(e);
      reject(e);
    }
  });
}
