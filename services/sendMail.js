// import nodemailer from 'nodemailer'
import nodemailer from 'nodemailer'


async function sendMail(to, subject, html) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "charlescharlesy@gmail.com",
        pass: "ktdx mfpw mwtp zfby",
      },
    });

    let mailOptions = {
      from: '"247Bitoptions" <info@247bitoptions.com>',
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