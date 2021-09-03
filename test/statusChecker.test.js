const { checkStatus } = require('../src/statusChecker');
const axios = require('axios');
const nodemailer = require('nodemailer');

jest.mock('axios');
jest.mock('nodemailer');

const config = {
	url: 'https://example.url',
	expected: 200
};
describe('Status Checker', _ => {
	let sendMailMock;
	beforeEach(function() {
		sendMailMock = jest.fn();
		sendMailMock.mockReturnValue({messageId: 4});
		nodemailer.createTransport.mockReturnValue({"sendMail": sendMailMock});	
	});
	test('notifies when status is not normal', async function() {
		axios.get.mockImplementation(() => Promise.resolve({ status: 500 }));
		await checkStatus(Object.assign({}, config));
		expect(sendMailMock).toHaveBeenCalled();
	});
	test('notifies when response is undefined', async function() {
		axios.get.mockImplementation(() => Promise.resolve());
		await checkStatus(Object.assign({}, config));
		expect(sendMailMock).toHaveBeenCalled();
	});
	test('notifies when error occurs', async function() {
		axios.get.mockImplementation(() => Promise.resolve({ status: 500 }));
		await checkStatus(Object.assign({}, config));
		expect(sendMailMock).toHaveBeenCalled();
	});
	test('notifies only when status returns to normal', async function() {		
		///*
		const configForReturnToNormal = Object.assign({}, config);
		axios.get.mockImplementation(() => Promise.reject({}));
		await checkStatus(configForReturnToNormal);
		expect(sendMailMock).toHaveBeenCalledTimes(1);
		//*/
		axios.get.mockImplementation(() => Promise.resolve({ status: 500 }));
		await checkStatus(configForReturnToNormal);
		expect(sendMailMock).toHaveBeenCalledTimes(1);
		
		axios.get.mockImplementation(() => Promise.resolve({ status: 500 }));
		await checkStatus(configForReturnToNormal);
		expect(sendMailMock).toHaveBeenCalledTimes(1);
		
		axios.get.mockImplementation(() => Promise.resolve({ status: 200 }));
		await checkStatus(configForReturnToNormal);	
		expect(sendMailMock).toHaveBeenCalledTimes(2);
	});
});
