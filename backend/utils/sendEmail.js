const env = require("../config/env");
const nodemailer = require("nodemailer");
const { buildMailTransport } = require("./mailTransport");

const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const transporter = await buildMailTransport();

    const mailOptions = {
      from: env.SMTP_FROM || env.SMTP_USER || "quotes@construction.local",
      to,
      subject,
      html,
      text: text || html?.replace(/<[^>]*>?/gm, "") || "",
    };

    const info = await transporter.sendMail(mailOptions);
    const previewUrl = nodemailer.getTestMessageUrl(info);
    console.log(`Email sent successfully to ${to} (MessageId: ${info.messageId})`);
    return {
      success: true,
      messageId: info.messageId,
      previewUrl,
      message: previewUrl ? `Preview: ${previewUrl}` : "Email sent successfully.",
    };
  } catch (error) {
    console.error("sendEmail failed:", error);
    return {
      success: false,
      message: error.message,
    };
  }
};

module.exports = sendEmail;
