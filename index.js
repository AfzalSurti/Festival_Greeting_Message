const twilio = require('twilio');
const dotenv = require('dotenv');
dotenv.config();

const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const client = twilio(accountSid, authToken);

client.messages.create({
  from: 'whatsapp:+14155238886', // Twilio sandbox number
  to: 'whatsapp:+916355209044', // Your personal number
  body: 'Happy Diwali! 🪔 Greetings from our business!'
})
.then(msg => console.log('Sent:', msg.sid))
.catch(err => console.error(err));