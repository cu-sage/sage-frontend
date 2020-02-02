const nodemailer = require('nodemailer');

var sendInviteToClass = function(class_id, emails, callback) {
    console.log("Sending invitation to classid " + class_id + " to " + emails);
    var transporter = nodemailer.createTransport(
        {
            host: 'dev.cu-sage.org',
            port: 25,
            secure: false,
            auth: {
                user: 'sage-sender',
                pass: 'jEV68GCyfa@a'
            },
            logger: false,
            debug: true
        },
        {
            // default message fields

            // sender info
            from: 'SAGE <no-reply@cu-sage.org>',
        }
    );

    let message = {
        // Comma separated list of recipients; please set this to include your own email address.
        to: emails,

        // Subject of the message
        subject: 'Welcome to SAGE!',

        // plaintext body
        text: 'Invite for class id: ' + class_id,

        // HTML body
        html: '<p><img src="http://dev.cu-sage.org/public/images/logo.png"/></p>' +
        `<p>If you\'ve received this, email is working on dev. Invite for class id: ${class_id}</p>`,

    };

    transporter.sendMail(message, (error, info) => {
        if (error) {
            console.log('Error occurred');
            console.log(error.message);
            return process.exit(1);
        }

        callback();
    });
    return;
};

module.exports = {
    sendInviteToClass: sendInviteToClass
}