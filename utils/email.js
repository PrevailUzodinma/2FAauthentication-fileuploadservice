const nodemailer = require("nodemailer");

const sendEmail = async (option) => {
  // Create a Transporter: the service that will send the email
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Define Email options
  const emailOptions = {
    from: "Kryptonia Support<support@kryptonia.com>",
    to: option.email,
    subject: option.subject,
    text: option.message,
  };

  await transporter.sendMail(emailOptions);
};

module.exports = sendEmail;
