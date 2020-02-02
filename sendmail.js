// The code below will execute correctly as of 2018-04-23.  Please use this as a reference guide for sending mail from
// the server, and not as a verbatim library / copy-paste snippet.  Executing this code as-is (as of 2018-04-23) will
// send an email to my personal account ('Alex Dziena <alexdziena@gmail.com>') with some test content and do nothing
// else.
//
// Please see the SAGE wiki page on using SMTP on the dev server,
// https://gudangdaya.atlassian.net/wiki/spaces/SAGE/pages/332988422/Sending+Email+from+SAGE+via+dev+SMTP+server
// , and the documentation for the nodemailer library,
// https://github.com/nodemailer/nodemailer
// ,for more information.
//
// Thanks,
// Alex ('Alex Dziena <alexdziena@gmail.com>')
//
// const nodemailer = require('nodemailer');
//
// transporter = nodemailer.createTransport(
//     {
//         host: 'dev.cu-sage.org',
//         port: 25,
//         secure: false,
//         auth: {
//             user: 'sage-sender',
//             pass: 'jEV68GCyfa@a'
//         },
//         logger: false,
//         debug: true
//     },
//     {
//         // default message fields
//
//         // sender info
//         from: 'SAGE <no-reply@cu-sage.org>',
//     }
// );
//
// let message = {
//     // Comma separated list of recipients
//     to: 'Alex Dziena <alexdziena@gmail.com>',
//
//     // Subject of the message
//     subject: 'Nodemailer test',
//
//     // plaintext body
//     text: 'Hello to myself!',
//
//     // HTML body
//     html:
//         '<p><b>Hello</b> to myself <img src="cid:note@example.com"/></p>' +
//         '<p>Here\'s a nyan cat for you as an embedded attachment:<br/><img src="cid:nyan@example.com"/></p>',
//
// };
//
// transporter.sendMail(message, (error, info) => {
//     if (error) {
//         console.log('Error occurred');
//         console.log(error.message);
//         return process.exit(1);
//     }
//
//     console.log('Message sent successfully!');
//     console.log(nodemailer.getTestMessageUrl(info));
//
//     // only needed when using pooled connections
//     transporter.close();
// });