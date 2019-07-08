exports.MPAM_MailParameters = {
    host: 'smtp.inetmail.cloud',//process.env.MAIL_SMTP,
    port: '587',//process.env.MAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
        user: 'wealthservice@merchantasset.co.th',//process.env.MAIL_USER, // generated ethereal user
        pass: 'Merchant@2019**'//process.env.MAIL_PASS // generated ethereal password
        // user: 'italert@merchantasset.co.th',//process.env.MAIL_USER, // generated ethereal user
        // pass: 'Merchant@2018**'//process.env.MAIL_PASS // generated ethereal password
    }
  }

  exports.GmailParameters = {
    host: 'smtp.gmail.com',
    port: '587',
    secure: false,
    auth: {
        user: 'yuttana76@gmail.com',
        pass: '41121225'
    }
  }

  exports.mail_form ='wealthservice@merchantasset.co.th';


  // exports.mail_toRM ='PW@merchantasset.co.th'; //
  exports.mailRM ='yuttana@merchantasset.co.th';

  //LED
  exports.FROM_LED_SYS ='yuttana@merchantasset.co.th';
  exports.TO_LED_RES ='yuttana@merchantasset.co.th';
  exports.LED_CLEANING_SUBJECT = 'LED Cleaning data result';

  exports.mailCompInfo_TH = `
  <br>
  <p>
  บริษัทหลักทรัพย์จัดการกองทุน เมอร์ชั่น พาร์ทเนอร์ จำกัด<br>
  942/170-171 ชาญอิสสระทาวเวอร์ 1 ชั้น 25 ถนนพระราม 4<br>
  แขวงสุริยวงศ์ เขตบางรัก กรุงเทพมหานคร 10500<br>
  โทร. 02 660 6677<br>
  แฟกซ์. 02 660 6678<br>
  เว็บไซต์ : www.merchantasset.co.th<br>
  อีเมล : info@merchantasset.co.th<br>
  </p>
  `;
