const env = require("../config/env");
const sendEmail = require("../utils/sendEmail");

const sanitizeText = (value) => {
  if (!value || typeof value !== "string") return "";
  return value.trim().replace(/[<>"'`]/g, "");
};

const sendContactEmail = async (req, res) => {
  try {
    const {
      phoneNumber,
      emailAddress,
      message,
      website,
    } = req.body;

    if (website && website.trim() !== "") {
      return res.status(400).json({ message: "Spam detected. Please submit the form normally." });
    }

    const sanitizedPhoneNumber = sanitizeText(phoneNumber);
    const sanitizedEmailAddress = sanitizeText(emailAddress).toLowerCase();
    const sanitizedMessage = sanitizeText(message);

    const missing = [];
    if (!sanitizedPhoneNumber) missing.push("Phone Number");
    if (!sanitizedEmailAddress) missing.push("Email Address");
    if (!sanitizedMessage) missing.push("Message");

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (sanitizedEmailAddress && !emailRegex.test(sanitizedEmailAddress)) {
      return res.status(400).json({ message: "Please provide a valid email address." });
    }

    if (missing.length > 0) {
      return res.status(400).json({ message: `${missing.join(", ")} are required.` });
    }

    const html = `
      <h2>Contact Form Submission</h2>
      <p><strong>Phone Number:</strong> ${sanitizedPhoneNumber}</p>
      <p><strong>Email Address:</strong> ${sanitizedEmailAddress}</p>
      <p><strong>Message:</strong></p>
      <p>${sanitizedMessage.replace(/\n/g, "<br />")}</p>
    `;

    const text = `Contact Form Submission\n\nPhone Number: ${sanitizedPhoneNumber}\nEmail Address: ${sanitizedEmailAddress}\nMessage: ${sanitizedMessage}`;

    const contactRecipient = env.CONTACT_EMAIL || "melkamugatew11@gmail.com";
    console.log("Contact form recipient:", contactRecipient);

    const result = await sendEmail({
      to: contactRecipient,
      subject: "New Contact Form Submission",
      html,
      text,
      replyTo: sanitizedEmailAddress,
    });

    if (!result.success) {
      console.error("Contact email failed:", result.message);
      const responseMessage = result.message
        ? `Unable to send your message right now. Error: ${result.message}`
        : "Unable to send your message right now. Please try again later.";
      return res.status(500).json({ message: responseMessage });
    }

    res.status(200).json({ message: "Your message has been sent successfully." });
  } catch (error) {
    console.error("contactController sendContactEmail error:", error);
    res.status(500).json({ message: "Unexpected error sending your message. Please try again." });
  }
};

module.exports = {
  sendContactEmail,
};
