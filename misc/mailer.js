const nodemailer = require('nodemailer')

//Creating or building the transport object
const transport = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.Gmail,
        pass: process.env.password
    },
    tls: {
        rejectUnauthorized: false
    }
});

// Making this whole file available
module.exports = {
    sendEmail(from, to, subject, html) {
        return new Promise((resolve, reject) => {
            transport.sendMail({ from, to, subject, html }, (err, info) => {
                if (err) reject(err);
                resolve(info);
            });
        });
    }
}
