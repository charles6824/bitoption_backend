export const otpMessage = (name, otp) => {
	return `
  <!DOCTYPE html>
  <html lang="en">
      <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>247BitOption - OTP Verification</title>
          <link
              href="https://fonts.googleapis.com/css2?family=Inter:wght@300&display=swap"
              rel="stylesheet"
          />
          <style>
              * { 
                  margin: 0;
                  padding: 0;
                  box-sizing: border-box;
                  font-family: "Inter", sans-serif;
              }
              .container {
                  padding: 10px;
                  width: 650px;
              }
              .center-logo {
                  text-align: center;
              }
              .header-content p {
                  font-size: 25px;
                  color: rgb(29, 50, 98);
                  margin: 1em auto;
              }
              .header-content p span {
                  color: #ffc800;
              }
              .design {
                  background-color: rgb(29, 50, 98);
                  width: 100%;
                  height: 4px;
                  position: relative;
              }
              .design::before {
                  content: "";
                  background-color: #ffc800;
                  width: 100%;
                  position: absolute;
                  height: 4px;
                  bottom: -4px;
              }
              .salutation {
                  margin: 20px 0;
              }
              .m-text{
                  margin-bottom: 25px;
              }
              .list {
                  margin-top: 15px;
                  padding-bottom: 15px;
                  border-bottom: 2px solid rgba(29, 50, 98, 0.1);
              }
              .list p {
                  margin-bottom: 5px;
                  color: rgb(29, 50, 98);
                  font-weight: 600;
              }
  
              .list span{
                  font-size: 13px;
              }
  
              .pt-2{
                  padding-top: 1.5rem;
                  color: rgb(29, 50, 98);
                  font-weight: 600;
              }
              .footer {
                  margin: 17px 0;
                  font-size: 14px;
              }
              .que{
                  color: rgb(29, 50, 98);
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="center-logo">
                  <img src="" alt="">
              </div>
              <div class="header-content">
                  <p>OTP Verification</span> Guests</p>
              </div>
              <div class="design"></div>
              <div class="message">
                  <h4 class="salutation">Dear ${name},</h4>
                  <p class="m-text">
                  use ${otp} as your otp code to validate your password change
                  </p>
  
              </div>
              <div class="footer">
                  <p>
                  Thank you.
                  </p>
              </div>
          </div>
      </body>
  </html>
  
              `;
};

export const loginMessage = () => {};

export const registerMessage = (name) => {
	return `
  <!DOCTYPE html>
  <html lang="en">
      <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>247BitOption - Registration Message</title>
          <link
              href="https://fonts.googleapis.com/css2?family=Inter:wght@300&display=swap"
              rel="stylesheet"
          />
          <style>
              * { 
                  margin: 0;
                  padding: 0;
                  box-sizing: border-box;
                  font-family: "Inter", sans-serif;
              }
              .container {
                  padding: 10px;
                  width: 650px;
              }
              .center-logo {
                  text-align: center;
              }
              .header-content p {
                  font-size: 25px;
                  color: rgb(29, 50, 98);
                  margin: 1em auto;
              }
              .header-content p span {
                  color: #ffc800;
              }
              .design {
                  background-color: rgb(29, 50, 98);
                  width: 100%;
                  height: 4px;
                  position: relative;
              }
              .design::before {
                  content: "";
                  background-color: #ffc800;
                  width: 100%;
                  position: absolute;
                  height: 4px;
                  bottom: -4px;
              }
              .salutation {
                  margin: 20px 0;
              }
              .m-text{
                  margin-bottom: 25px;
              }
              .list {
                  margin-top: 15px;
                  padding-bottom: 15px;
                  border-bottom: 2px solid rgba(29, 50, 98, 0.1);
              }
              .list p {
                  margin-bottom: 5px;
                  color: rgb(29, 50, 98);
                  font-weight: 600;
              }
  
              .list span{
                  font-size: 13px;
              }
  
              .pt-2{
                  padding-top: 1.5rem;
                  color: rgb(29, 50, 98);
                  font-weight: 600;
              }
              .footer {
                  margin: 17px 0;
                  font-size: 14px;
              }
              .que{
                  color: rgb(29, 50, 98);
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="center-logo">
                  <img src="" alt="">
              </div>
              <div class="header-content">
                  <p>Registration <span> Message</span></p>
              </div>
              <div class="design"></div>
              <div class="message">
                  <h4 class="salutation">Dear ${name},</h4>
                  <p class="m-text">
                 A warm welcome to 247Bitoption.com
                  </p>

                  <p>We're thrilled to have you on board! Your registration is now complete, and you're all set to start exploring our platform.</p>
                  <p>Here's what you can expect:</p>
                  <ul>
                    <li>Secure and lightning-fast Bitcoin transactions with low fees</li>
                    <li>Grow your wealth by investing in Bitcoin.</li>
                    <li>Secured transactions with advanced encryption.</li>
                  </ul>

                  <h4>Need help?</h4>
                  <p class="m-text">If you have any questions or need assistance, please contact our support team at info@247bitoption.com</p>

                  <p>Thank you for choosing 247Bitoption! We're excited to have you as part of our community.</p>
  
              </div>
              <div class="footer">
                  <p>
                  Best Regards
                  </p>
              </div>
          </div>
      </body>
  </html>
  
              `;
};

export const withdrawalOTP = (name, otp) => {
	return `
  <!DOCTYPE html>
  <html lang="en">
      <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>247BitOption - OTP Verification</title>
          <link
              href="https://fonts.googleapis.com/css2?family=Inter:wght@300&display=swap"
              rel="stylesheet"
          />
          <style>
              * { 
                  margin: 0;
                  padding: 0;
                  box-sizing: border-box;
                  font-family: "Inter", sans-serif;
              }
              .container {
                  padding: 10px;
                  width: 650px;
              }
              .center-logo {
                  text-align: center;
              }
              .header-content p {
                  font-size: 25px;
                  color: rgb(29, 50, 98);
                  margin: 1em auto;
              }
              .header-content p span {
                  color: #ffc800;
              }
              .design {
                  background-color: rgb(29, 50, 98);
                  width: 100%;
                  height: 4px;
                  position: relative;
              }
              .design::before {
                  content: "";
                  background-color: #ffc800;
                  width: 100%;
                  position: absolute;
                  height: 4px;
                  bottom: -4px;
              }
              .salutation {
                  margin: 20px 0;
              }
              .m-text{
                  margin-bottom: 25px;
              }
              .list {
                  margin-top: 15px;
                  padding-bottom: 15px;
                  border-bottom: 2px solid rgba(29, 50, 98, 0.1);
              }
              .list p {
                  margin-bottom: 5px;
                  color: rgb(29, 50, 98);
                  font-weight: 600;
              }
  
              .list span{
                  font-size: 13px;
              }
  
              .pt-2{
                  padding-top: 1.5rem;
                  color: rgb(29, 50, 98);
                  font-weight: 600;
              }
              .footer {
                  margin: 17px 0;
                  font-size: 14px;
              }
              .que{
                  color: rgb(29, 50, 98);
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="center-logo">
                  <img src="" alt="">
              </div>
              <div class="header-content">
                  <p>OTP Verification <span>For Withdrawal</span></p>
              </div>
              <div class="design"></div>
              <div class="message">
                  <h4 class="salutation">Dear ${name},</h4>
                  <p class="m-text">
                  use ${otp} as your otp code to validate your withdrawal
                  </p>
  
              </div>
              <div class="footer">
                  <p>
                  Thank you.
                  </p>
              </div>
          </div>
      </body>
  </html>
  
              `;
};
export const contactMessage = (
	firstName,
	lastName,
	email,
	subject,
	message
) => {
	return `
  <!DOCTYPE html>
  <html lang="en">
      <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>247BitOption - Contact Message</title>
          <link
              href="https://fonts.googleapis.com/css2?family=Inter:wght@300&display=swap"
              rel="stylesheet"
          />
          <style>
              * { 
                  margin: 0;
                  padding: 0;
                  box-sizing: border-box;
                  font-family: "Inter", sans-serif;
              }
              .container {
                  padding: 10px;
                  width: 650px;
              }
              .center-logo {
                  text-align: center;
              }
              .header-content p {
                  font-size: 25px;
                  color: rgb(29, 50, 98);
                  margin: 1em auto;
              }
              .header-content p span {
                  color: #ffc800;
              }
              .design {
                  background-color: rgb(29, 50, 98);
                  width: 100%;
                  height: 4px;
                  position: relative;
              }
              .design::before {
                  content: "";
                  background-color: #ffc800;
                  width: 100%;
                  position: absolute;
                  height: 4px;
                  bottom: -4px;
              }
              .salutation {
                  margin: 20px 0;
              }
              .m-text{
                  margin-bottom: 25px;
              }
              .list {
                  margin-top: 15px;
                  padding-bottom: 15px;
                  border-bottom: 2px solid rgba(29, 50, 98, 0.1);
              }
              .list p {
                  margin-bottom: 5px;
                  color: rgb(29, 50, 98);
                  font-weight: 600;
              }
  
              .list span{
                  font-size: 13px;
              }
  
              .pt-2{
                  padding-top: 1.5rem;
                  color: rgb(29, 50, 98);
                  font-weight: 600;
              }
              .footer {
                  margin: 17px 0;
                  font-size: 14px;
              }
              .que{
                  color: rgb(29, 50, 98);
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="center-logo">
                  <img src="" alt="">
              </div>
              <div class="header-content">
                  <p>Contact <span>For Message</span></p>
              </div>
              <div class="design"></div>
              <div class="message">
                  <h4 class="salutation">Dear Admin,</h4>
                  <p class="m-text">
                 You have received a contact message from ${firstName}. below are the details
                  </p>

                  <ul>
                      <li><strong>Full Name: </strong> ${firstName} ${lastName}</li>
                      <li><strong>Email: </strong> ${email}</li>
                      <li><strong>Subject: </strong> ${subject}</li>
                      <li><strong>Message: </strong> ${message}</li>
                  </ul>
  
              </div>
              <div class="footer">
                  <p>
                  Thank you.
                  </p>
              </div>
          </div>
      </body>
  </html>
  
              `;
};

export const feedbackMessage = (name, feedbackType, message) => {
	return `
  <!DOCTYPE html>
  <html lang="en">
      <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>247BitOption - Contact Message</title>
          <link
              href="https://fonts.googleapis.com/css2?family=Inter:wght@300&display=swap"
              rel="stylesheet"
          />
          <style>
              * { 
                  margin: 0;
                  padding: 0;
                  box-sizing: border-box;
                  font-family: "Inter", sans-serif;
              }
              .container {
                  padding: 10px;
                  width: 650px;
              }
              .center-logo {
                  text-align: center;
              }
              .header-content p {
                  font-size: 25px;
                  color: rgb(29, 50, 98);
                  margin: 1em auto;
              }
              .header-content p span {
                  color: #ffc800;
              }
              .design {
                  background-color: rgb(29, 50, 98);
                  width: 100%;
                  height: 4px;
                  position: relative;
              }
              .design::before {
                  content: "";
                  background-color: #ffc800;
                  width: 100%;
                  position: absolute;
                  height: 4px;
                  bottom: -4px;
              }
              .salutation {
                  margin: 20px 0;
              }
              .m-text{
                  margin-bottom: 25px;
              }
              .list {
                  margin-top: 15px;
                  padding-bottom: 15px;
                  border-bottom: 2px solid rgba(29, 50, 98, 0.1);
              }
              .list p {
                  margin-bottom: 5px;
                  color: rgb(29, 50, 98);
                  font-weight: 600;
              }
  
              .list span{
                  font-size: 13px;
              }
  
              .pt-2{
                  padding-top: 1.5rem;
                  color: rgb(29, 50, 98);
                  font-weight: 600;
              }
              .footer {
                  margin: 17px 0;
                  font-size: 14px;
              }
              .que{
                  color: rgb(29, 50, 98);
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="center-logo">
                  <img src="" alt="">
              </div>
              <div class="header-content">
                  <p>Contact <span>For Message</span></p>
              </div>
              <div class="design"></div>
              <div class="message">
                  <h4 class="salutation">Dear Admin,</h4>
                  <p class="m-text">
                 You have received a feedback message from ${name}. below are the details
                  </p>

                  <ul>
                      <li><strong>Full Name: </strong> ${name} </li>
                      <li><strong>Feedback Type: </strong> ${feedbackType}</li>
                      <li><strong>Message: </strong> ${message}</li>
                  </ul>
  
              </div>
              <div class="footer">
                  <p>
                  Thank you.
                  </p>
              </div>
          </div>
      </body>
  </html>
  
              `;
};
