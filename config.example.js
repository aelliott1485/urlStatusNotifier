module.exports = [
    {
        subject: 'test URL Check',
        to: 'recipient@email.com',
        expected: 200,
        intervalMinutes: 5,
        user: 'sender@email.com',
        sender: 'Zomis Games Check',
        pass: 'PW_FROM_EMAIL',
        url: 'https://example.com/'
    }
];