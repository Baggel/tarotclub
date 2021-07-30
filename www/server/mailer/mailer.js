const nodemailer = require('nodemailer');

const sendMail = (to, subject, body) => {
    let transporter = nodemailer.createTransport({
        host: process.env.MAIL_SERVER,
        port: 465,
        secure: true,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        }
    });
      
    let mailOptions = {
        from: process.env.MAIL_USER,
        to: to,
        subject: subject,
        text: body
    };
    
    // Return promise
    return transporter.sendMail(mailOptions);
}

module.exports = {
    sendMail,
}
