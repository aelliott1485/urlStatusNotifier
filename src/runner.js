"use strict";

const https = require('https');
const nodemailer = require('nodemailer');
const {checkStatus} = require('./statusChecker');

const checkInterval = setInterval(checkStatus, 60000);
checkStatus();
function exceptionHandler(e) {
    clearInterval(checkInterval);
}
