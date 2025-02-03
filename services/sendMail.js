// import nodemailer from 'nodemailer'
import nodemailer from 'nodemailer'


function sendMail(to, subject, html){
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "charlescharlesy@gmail.com",
      pass: "ktdx mfpw mwtp zfby",
    },
  });

  // setup email data with unicode symbols
  let mailOptions = {
      from: '"247Bitoptions" <info@247bitoptions.com>', 
      to: to,
      subject: subject,
      html: html
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);   
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  });
}

export default sendMail