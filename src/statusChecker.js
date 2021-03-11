"use strict";

const https = require('https');
const nodemailer = require('nodemailer');
const {EMAIL_SUBJECT, EMAIL_TO, SENDER_MAIL, SENDER_NAME, SENDER_PASS, URL_TO_CHECK} = require(__dirname + '/../config');


module.exports = {
    checkStatus
};
let lastCode = 200;

function handleResponse(response) {
    console.log('statusCode:', response.statusCode);
    if (response.statusCode > 399 || response.statusCode !== lastCode) {
        sendEmail(response.statusCode);
    }
    lastCode = response.statusCode;
}
async function sendEmail(code) {
    const text = `status code from ${URL_TO_CHECK}: ${code}`;
    const transporter = nodemailer.createTransport({
        service:'gmail',
        secure: false,
        auth: {
           user: SENDER_MAIL,
           pass: SENDER_PASS
        },
        debug: false,
        logger: true
    });
    const info = await transporter.sendMail({
        from: `"${SENDER_NAME}" <${SENDER_MAIL}>`, // sender address
        to: EMAIL_TO, // list of receivers
        subject: EMAIL_SUBJECT, // Subject line
        text, // plain text body
        html: `<b>${text}</b>`, // html body
      });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}
function errorHandler(error) {
    console.log('error', error);
    if (lastCode !== error.code) {
        sendEmail(error.code);
    }
    lastCode = error.code;
    //clearInterval()
}

function checkStatus() {
    const event = new Date();

    console.log(`CHECKING STATUS of ${URL_TO_CHECK}`, event.toLocaleString());
    https.get(URL_TO_CHECK, handleResponse)
    .on('error', errorHandler);
}
function exceptionHandler(e) {
    clearInterval(checkInterval);
}
