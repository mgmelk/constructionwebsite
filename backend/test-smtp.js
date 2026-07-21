// test-smtp.js
// Usage: set SMTP env vars in backend/.env then run `node test-smtp.js` from the backend folder

require('dotenv').config();
const nodemailer = require('nodemailer');

(async () => {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!user || !pass) {
    console.error('Missing SMTP_USER or SMTP_PASS in backend/.env');
    process.exit(1);
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user,
      pass,
    },
  });

  try {
    await transporter.verify();
    console.log('SMTP verified: ready to send');

    // Optional: send a quick test email if TEST_RECIPIENT env is set
    const testRecipient = process.env.TEST_RECIPIENT;
    if (testRecipient) {
      const info = await transporter.sendMail({
        from: process.env.SMTP_FROM || user,
        to: testRecipient,
        subject: 'Test email from Construction app',
        text: 'This is a test email sent to verify SMTP settings.',
      });
      console.log('Sent test mail, messageId=', info.messageId);
      const preview = nodemailer.getTestMessageUrl(info);
      if (preview) console.log('Preview URL:', preview);
    } else {
      console.log('No TEST_RECIPIENT set — only verification performed.');
    }
  } catch (err) {
    console.error('SMTP verify/send error:');
    console.error(err);
    process.exitCode = 1;
  }
})();
