module.exports = [
    {
        subject: 'test URL Check',
        to: 'recipient@email.com',
        expected: 200,
        intervalMinutes: 5,
        user: 'sender@email.com',
        sender: 'URL check notifier',
        pass: 'PW_FROM_EMAIL',
        url: 'https://example.com/'
    }
];