const nodemailer = require('nodemailer');

const config = require('./config');

//reference https://nodemailer.com/about/
exports.sendMail = (req, res, next) =>{
    console.log('sendMail()>>' + JSON.stringify(req.body));
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport(config.mailParameters);

    // setup email data with unicode symbols
    let mailOptions = {
      from: req.body.from, // sender address
      to: req.body.to, // list of receivers
      subject: req.body.subject , // Subject line
      // text: 'Text here', // plain text body
      html: `<b> ${req.body.msg}</b>` // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);
      // Preview only available when sending through an Ethereal account
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
      // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
      res.status(200).json({ message: 'Send mail successful!' });
    });

}

