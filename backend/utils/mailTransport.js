const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

const nodemailer = require("nodemailer");

const buildMailTransport = async () => {
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  console.log("SMTP config check:", {
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_SECURE === "true",
    hasUser: Boolean(smtpUser),
    hasPass: Boolean(smtpPass),
  });

  if (smtpUser && smtpPass) {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    try {
      await transporter.verify();
      return transporter;
    } catch (error) {
      const detail = error?.response || error?.message || "Unknown SMTP error";
      throw new Error(`SMTP verification failed for ${smtpUser}. Check your Gmail App Password and that 2-Step Verification is enabled. Details: ${detail}`);
    }
  }

  const testAccount = await nodemailer.createTestAccount();
  return nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
};

module.exports = {
  buildMailTransport,
};
