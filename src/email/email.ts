import nodemailer from 'nodemailer';

require('dotenv').config();

const options = {
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || ''),
  secure: false,
  auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
  },
}

const transporter = nodemailer.createTransport(options);


export default transporter;