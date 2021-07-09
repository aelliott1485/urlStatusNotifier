"use strict";

const https = require('https');
const nodemailer = require('nodemailer');
const configFile = process.argv[2] || 'config';
const configs = require(__dirname + '/../' + configFile);
const {checkStatus} = require('./statusChecker');

configs.forEach(async config => {
    const boundCall = checkStatus.bind(null, config);
	const minutes = config.INTERVAL_MINUTES || 1;
    const checkInterval = setInterval(boundCall, minutes * 60000);
    await boundCall();
	//console.log('config after call: ', config)
    function exceptionHandler(e) {
        clearInterval(checkInterval);
    }
})

