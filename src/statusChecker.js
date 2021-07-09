"use strict";

const axios = require('axios');
const nodemailer = require('nodemailer');
module.exports = {
    checkStatus
};

function handleResponse(config, response) {
	const code = typeof response === 'undefined' ? 0 : response.status;
    if (code !== (config.lastCode || config.EXPECTED_STATUS)) {
		console.log('calling sendEmail');
        sendEmail(config, code);
    }
    config.lastCode = code;
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
}
function errorHandler(config, error) {
    console.log('error', error);
    if (config.lastCode !== error.code) {
        sendEmail(config, error.code);
    }
    config.lastCode = error.code;
}

async function checkStatus(config) {
    console.log(`CHECKING STATUS of ${config.URL_TO_CHECK}`, (new Date()).toLocaleString());
    const response = await axios.get(config.URL_TO_CHECK).catch(errorHandler.bind(null, config));
	handleResponse(config, response);
}
function exceptionHandler(e) {
    clearInterval(checkInterval);
}
