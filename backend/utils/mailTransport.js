const env = require("../config/env");
const nodemailer = require("nodemailer");

const buildMailTransport = async () => {
  const smtpUser = env.SMTP_USER;
  const smtpPass = env.SMTP_PASS;

  console.log("SMTP config check:", {
    host: env.SMTP_HOST || "smtp.gmail.com",
    port: env.SMTP_PORT || 587,
    secure: env.SMTP_SECURE === "true",
    hasUser: Boolean(smtpUser),
    hasPass: Boolean(smtpPass),
  });

  if (smtpUser && smtpPass) {
    const transporter = nodemailer.createTransport({
      host: env.SMTP_HOST || "smtp.gmail.com",
      port: env.SMTP_PORT ? Number(env.SMTP_PORT) : 587,
      secure: env.SMTP_SECURE === "true",
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
