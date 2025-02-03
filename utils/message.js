
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
  
              `
} 


export const loginMessage = () => {

}

export const registerMessage = () => {

}

