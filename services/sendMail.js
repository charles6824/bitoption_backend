// import nodemailer from 'nodemailer'
import nodemailer from 'nodemailer'


async function sendMail(to, subject, html) {
  try {
    // const transporter = nodemailer.createTransport({
    //   service: "gmail",
    //   auth: {
    //     user: "charlescharlesy@gmail.com",
    //     pass: "ktdx mfpw mwtp zfby",
    //   },
    // });

    let transporter = nodemailer.createTransport({
      host: '247bitoption.com',
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
          user: 'info@247bitoption.com', // generated ethereal user
          pass: '{NS_c@QI8M}_'  // generated ethereal password
      },
      tls:{
        rejectUnauthorized: true
      }
    });

    let mailOptions = {
      from: '"247Bitoption" <info@247bitoption.com>',
      to: to,
      subject: subject,
      html: html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

export default sendMail