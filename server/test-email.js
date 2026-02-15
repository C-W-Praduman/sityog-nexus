const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);  

resend.emails.send({
  from: 'onboarding@resend.dev',
  to: 'pradumanguptasimri@gmail.com',
  subject: 'Hello World',
  html: '<p>Congrats on sending your <strong>first email</strong>!</p>'
});