const axios = require("axios");

// create a function to send an email using Elastic Email's API:

const sendConfirmationEmail = async (email, confirmationLink) => {
    const data = {
      apikey: process.env.ELASTIC_EMAIL_API_KEY,
      from: 'theiprevail@gmail.com', // My sender email
      to: email,
      subject: 'Email Confirmation',
      bodyText: `Please confirm your email by clicking the following link: ${confirmationLink}`,
      isTransactional: true,
    };
  
    try {
      const response = await axios.post('https://api.elasticemail.com/v4/emails/transactional', new URLSearchParams(data));
      console.log('Email sent:', response.data);
    } catch (error) {
      console.error('Error sending email:', error.response ? error.response.data : error.message);
      throw new Error('Error sending confirmation email');
    }
  };

  module.exports = sendConfirmationEmail;