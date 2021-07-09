"use strict";

const axios = require('axios');
const nodemailer = require('nodemailer');
/*const {EMAIL_SUBJECT,
	EMAIL_TO, 
	EXPECTED_STATUS = 200, 
	SENDER_MAIL, 
	SENDER_NAME, 
	SENDER_PASS, 
	URL_TO_CHECK
} = require(__dirname + '/../config');*/


module.exports = {
    checkStatus
};
//let lastCode = EXPECTED_STATUS;

function handleResponse(config, response) {
	const code = typeof response === 'undefined' ? 0 : response.status;
    if (code !== (config.lastCode || config.EXPECTED_STATUS)) {
		console.log('calling sendEmail');
        sendEmail(config, code);
    }
    config.lastCode = code;
	//console.log('----------- set lastCode in config to ', response.statusCode);
}
async function sendEmail(config, code) {
    const text = `status code from ${config.URL_TO_CHECK}: ${code}`;
    const transporter = nodemailer.createTransport({
        service:'gmail',
        secure: false,
        auth: {
           user: config.SENDER_MAIL,
           pass: config.SENDER_PASS
        },
        debug: false,
        logger: true
    });
    const info = await transporter.sendMail({
        from: `"${config.SENDER_NAME}" <${config.SENDER_MAIL}>`, // sender address
        to: config.EMAIL_TO, // list of receivers
        subject: config.EMAIL_SUBJECT, // Subject line
        text, // plain text body
        html: `<b>${text}</b>`, // html body
      });
	console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  //console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}
function errorHandler(config, error) {
    console.log('error', error);
    if (config.lastCode !== error.code) {
        sendEmail(config, error.code);
    }
    config.lastCode = error.code;
    //clearInterval()
}

async function checkStatus(config) {
    console.log(`CHECKING STATUS of ${config.URL_TO_CHECK}`, (new Date()).toLocaleString());
    const response = await axios.get(config.URL_TO_CHECK).catch(errorHandler.bind(null, config));
	handleResponse(config, response);
}
function exceptionHandler(e) {
    clearInterval(checkInterval);
}
