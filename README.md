# URL Status notifier
This utility will check URLs at intervals and notify recipient(s) when the status code changes

## Configuration
Clone repository

   git clone https://github.com/aelliott1485/urlStatusNotifier.git

Change to directory

    cd urlStatusNotifier

Install dependencies

    npm install
	
Copy the example configuration

    cp config.example.js config.js

Modify config.js accordingly. It can contain an array of options - for example:

   module.exports = [
    {
        subject: 'test URL Check',		//Email Subject 
        to: 'recipient@email.com',		//Recipient email addresses
        expected: 200,					//Expected status code
        intervalMinutes: 5,				//number of minutes to check
        user: 'sender@email.com',		//Sender Email address
        sender: 'Zomis Games Check',	//Sender Name
        pass: 'PW_FROM_EMAIL',			//app password - see https://nodemailer.com/usage/using-gmail/
        url: 'https://example.com/'		//URL to check
    }
    ];	
	
Run it

    npm run checks