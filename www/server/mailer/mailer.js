const nodemailer = require('nodemailer');

const sendMail = (to, subject, body) => {
    let transporter = nodemailer.createTransport({
        host: process.env.MAIL_SERVER,
        port: 587,
        secure: false,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        },
        tls:{
            ciphers:'SSLv3'
        }
    });
      
    let mailOptions = {
        from: process.env.MAIL_ADDRESS,
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
