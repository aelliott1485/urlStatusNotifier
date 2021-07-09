const { checkStatus } = require('../src/statusChecker');
const axios = require('axios');
const nodemailer = require('nodemailer');

jest.mock('axios');
jest.mock('nodemailer');

const config = {
	URL_TO_CHECK: 'https://example.url',
	EXPECTED_STATUS: 200
};
describe('Status Checker', _ => {
	
	test('calls HTTP endpoints and updates last code', async function() {
		axios.get.mockImplementation(_ => Promise.resolve({ status: 200 }));
		await checkStatus(config);
		expect(config.lastCode).toBe(200);
	});
	test('notifies when status is not normal', async function() {
		const sendMailMock = jest.fn();
		nodemailer.createTransport.mockReturnValue({"sendMail": sendMailMock});
		axios.get.mockImplementation(() => Promise.resolve({ status: 500 }));
		await checkStatus(config);
		expect(sendMailMock).toHaveBeenCalled();
	});
	test('notifies when response is undefined', async function() {
		const sendMailMock = jest.fn();
		sendMailMock.mockReturnValue(_ => Promise.resolve({messageId: 4}));
		nodemailer.createTransport.mockReturnValue({"sendMail": sendMailMock});
		
		axios.get.mockImplementation(() => Promise.resolve());
		await checkStatus(config);	
		expect(sendMailMock).toHaveBeenCalled();

	});
	test('notifies only when status returns to normal', async function() {
		const sendMailMock = jest.fn();
		sendMailMock.mockReturnValue({messageId: 4});
		nodemailer.createTransport.mockReturnValue({"sendMail": sendMailMock});
		
		axios.get.mockImplementation(() => Promise.resolve({ status: 500 }));
		await checkStatus(config);	
		expect(sendMailMock).toHaveBeenCalled();
		
		axios.get.mockImplementation(() => Promise.resolve({ status: 500 }));
		await checkStatus(config);	
		expect(sendMailMock).toHaveBeenCalledTimes(1);
		
		axios.get.mockImplementation(() => Promise.resolve({ status: 200 }));
		await checkStatus(config);	
		expect(sendMailMock).toHaveBeenCalledTimes(2);
	});
});