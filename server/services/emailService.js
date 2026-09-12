const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  try {
    // If test environment or no host configured, mock email output cleanly
    if (!process.env.EMAIL_HOST || process.env.EMAIL_HOST.includes('mailtrap.io') || !process.env.EMAIL_USER) {
      console.log(`[Email Simulation -> ${options.email}]: "${options.subject}"`);
      console.log(`Body:\n${options.message || options.html}\n`);
      return true;
    }

    const transporter = nodemailer.createTransporter({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT || 587,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'EstateHub <no-reply@estatehub.com>',
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[Email Sent]: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error(`[Email Send Error]: ${error.message}`);
    return false;
  }
};

module.exports = { sendEmail };
