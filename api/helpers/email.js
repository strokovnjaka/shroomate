var Transporter = require('../../config/mail');

const send_email = (recipient, template, params, sender="noreply@shrooma.te") => {
    return new Promise((resolve, reject) => {
        var emailContent = require(`../templates/${template}`)
        var mailOpts = {
            from: sender,
            to: recipient,
            subject: emailContent.subject,
            text: emailContent.body(params)
        };
        Transporter.sendMail(mailOpts, function (error, info) {
            if (error)
                return reject(error);
            return resolve();
        });
    });
};

module.exports = {
    send_email,
};
