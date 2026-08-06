const sendEmail = require("../utils/sendEmail");

const sanitizeText = (value) => {
  if (!value || typeof value !== "string") return "";
  return value.trim().replace(/[<>"'`]/g, "");
};

const sendContactEmail = async (req, res) => {
  try {
    const {
      fullName,
      phoneNumber,
      emailAddress,
      company,
      subject,
      message,
      website,
    } = req.body;

    if (website && website.trim() !== "") {
      return res.status(400).json({ message: "Spam detected. Please submit the form normally." });
    }

    const sanitizedFullName = sanitizeText(fullName);
    const sanitizedPhoneNumber = sanitizeText(phoneNumber);
    const sanitizedEmailAddress = sanitizeText(emailAddress).toLowerCase();
    const sanitizedCompany = sanitizeText(company);
    const sanitizedSubject = sanitizeText(subject);
    const sanitizedMessage = sanitizeText(message);

    const missing = [];
    if (!sanitizedFullName) missing.push("Full Name");
    if (!sanitizedPhoneNumber) missing.push("Phone Number");
    if (!sanitizedEmailAddress) missing.push("Email Address");
    if (!sanitizedSubject) missing.push("Subject");
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
      <p><strong>Full Name:</strong> ${sanitizedFullName}</p>
      <p><strong>Phone Number:</strong> ${sanitizedPhoneNumber}</p>
      <p><strong>Email Address:</strong> ${sanitizedEmailAddress}</p>
      <p><strong>Company:</strong> ${sanitizedCompany || "N/A"}</p>
      <p><strong>Subject:</strong> ${sanitizedSubject}</p>
      <p><strong>Message:</strong></p>
      <p>${sanitizedMessage.replace(/\n/g, "<br />")}</p>
    `;

    const text = `Contact Form Submission\n\nFull Name: ${sanitizedFullName}\nPhone Number: ${sanitizedPhoneNumber}\nEmail Address: ${sanitizedEmailAddress}\nCompany: ${sanitizedCompany || "N/A"}\nSubject: ${sanitizedSubject}\nMessage: ${sanitizedMessage}`;

    const contactRecipient = "melkamugatew11@gmail.com";
    console.log("Contact form recipient:", contactRecipient);

    const result = await sendEmail({
      to: contactRecipient,
      subject: `New Contact Form: ${sanitizedSubject}`,
      html,
      text,
      replyTo: sanitizedEmailAddress,
    });

    if (!result.success) {
      return res.status(500).json({ message: "Unable to send your message right now. Please try again later." });
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
