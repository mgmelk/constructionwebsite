const nodemailer = require("nodemailer");

const sendEmail = async ({ to, subject, html, text }) => {
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (!smtpUser || !smtpPass) {
    console.warn("SMTP credentials missing. Email not sent via network. Logging to console:");
    console.log(`To: ${to}\nSubject: ${subject}\nText: ${text}`);
    return { success: false, message: "SMTP credentials not configured" };
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587,
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  const mailOptions = {
    from: process.env.SMTP_FROM || `WEMASTER Construction <${smtpUser}>`,
    to,
    subject,
    html,
    text: text || html.replace(/<[^>]*>?/gm, ""),
  };

  const info = await transporter.sendMail(mailOptions);
  console.log(`Email sent successfully to ${to} (MessageId: ${info.messageId})`);
  return { success: true, messageId: info.messageId };
};

module.exports = sendEmail;
