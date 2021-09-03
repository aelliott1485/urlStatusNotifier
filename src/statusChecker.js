"use strict";

const axios = require('axios');
const nodemailer = require('nodemailer');
module.exports = {
    checkStatus
};

function handleResponse(config, response) {
	const code = typeof response === 'undefined' ? 0 : response.status;
	const wasFailing = config.failing || false;
    config.failing = (code !== config.expected);
	if (wasFailing ^ config.failing) {
		sendEmail(config, code);
	}
}
async function sendEmail(config, code, message) {
    const text = `status code from ${config.url}: ${code}` + (message ? ' message: ' + message : '');
    const transporter = nodemailer.createTransport({
        service:'gmail',
        secure: false,
        auth: {
           user: config.user,
           pass: config.pass
        },
        debug: false,
        logger: true
    });
    const info = await transporter.sendMail({
        from: `"${config.sender}" <${config.user}>`, // sender address
        to: config.to, // list of receivers
        subject: config.subject, // Subject line
        text, // plain text body
        html: `<b>${text}</b>`, // html body
      });
	console.log("Message sent - messageId: %s", info.messageId);
}
function errorHandler(config, error) {
	let code = 0
	if (error.response && error.response.status) {
		code = error.response.status;
	}
	const wasFailing = config.failing || false;
	if (!wasFailing) {
		console.log('errorHandler() - calling sendEmail');
        sendEmail(config, code, error.message);
    }
    config.failing = true;
}

async function checkStatus(config) {
    console.log(`CHECKING STATUS of ${config.url}`, (new Date()).toLocaleString());
    const response = await axios.get(config.url).catch(errorHandler.bind(null, config));
	handleResponse(config, response);
}
function exceptionHandler(e) {
    clearInterval(checkInterval);
}
