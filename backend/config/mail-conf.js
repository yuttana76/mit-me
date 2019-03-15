exports.MPAM_MailParameters = {
    host: 'smtp.inetmail.cloud',//process.env.MAIL_SMTP,
    port: '587',//process.env.MAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
        user: 'italert@merchantasset.co.th',//process.env.MAIL_USER, // generated ethereal user
        pass: 'Merchant@2018**'//process.env.MAIL_PASS // generated ethereal password
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

  exports.mail_form ='it2@merchantasset.co.th';
