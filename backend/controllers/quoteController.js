const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

const Quote = require("../models/Quote");
const nodemailer = require("nodemailer");
const { buildMailTransport } = require("../utils/mailTransport");

const createQuoteRequest = async (req, res) => {
  try {
    const { fullName, email, phone, companyName, address, projectType, projectSize, details } = req.body;

    console.log("Quote request body:", req.body);

    // Validate required fields (companyName is optional for public requests)
    const missing = [];
    if (!fullName || !String(fullName).trim()) missing.push("fullName");
    if (!email || !String(email).trim()) missing.push("email");
    if (!phone || !String(phone).trim()) missing.push("phone");
    if (!projectType || !String(projectType).trim()) missing.push("projectType");
    if (!projectSize || !String(projectSize).trim()) missing.push("projectSize");
    if (!details || !String(details).trim()) missing.push("details");

    if (missing.length) {
      return res.status(400).json({ message: `Missing required fields: ${missing.join(", ")}` });
    }

    const quote = await Quote.create({
      fullName: String(fullName).trim(),
      email: String(email).trim().toLowerCase(),
      phone: String(phone).trim(),
      companyName: companyName ? String(companyName).trim() : "",
      address: address ? String(address).trim() : "",
      projectType: String(projectType).trim(),
      projectSize: String(projectSize).trim(),
      details: String(details).trim(),
    });

    res.status(201).json({ message: "Quote request submitted successfully.", quote });
  } catch (error) {
    console.error("Create quote error:", error);
    res.status(500).json({ message: error.message });
  }
};

const listQuoteRequests = async (req, res) => {
  try {
    const quotes = await Quote.find().sort({ createdAt: -1 });
    res.json({ quotes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const estimateQuote = async (req, res) => {
  try {
    const { id } = req.params;
    const { materialsCost, laborCost, otherCost, estimatedDays, message, budget } = req.body;

    if (materialsCost == null || laborCost == null || otherCost == null) {
      return res.status(400).json({ message: "Materials, labor and other costs are required." });
    }

    const quote = await Quote.findById(id);
    if (!quote) {
      return res.status(404).json({ message: "Quote request not found." });
    }

    const totalCost = Number(materialsCost) + Number(laborCost) + Number(otherCost);

    quote.budget = budget ? String(budget).trim() : "";
    quote.estimate = {
      materialsCost: Number(materialsCost),
      laborCost: Number(laborCost),
      otherCost: Number(otherCost),
      totalCost,
      estimatedDays: estimatedDays?.trim() || "",
      message: message?.trim() || "",
      sentAt: new Date(),
    };
    quote.status = "Estimated";
    await quote.save();

    res.json({ message: "Quote estimated successfully.", quote });
  } catch (error) {
    console.error("Estimate quote error:", error);
    res.status(500).json({ message: error.message });
  }
};

const sendQuoteEmail = async (req, res) => {
  try {
    const { id } = req.params;
    const { subject, message } = req.body;

    if (!subject || !message) {
      return res.status(400).json({ message: "Email subject and message are required." });
    }

    const quote = await Quote.findById(id);
    if (!quote) {
      return res.status(404).json({ message: "Quote request not found." });
    }

    if (!quote.estimate || !quote.estimate.totalCost) {
      return res.status(400).json({ message: "Quote must be estimated before sending email." });
    }

    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    if (!smtpUser || !smtpPass) {
      return res.status(500).json({
        message: "SMTP credentials are not configured. Set SMTP_USER and SMTP_PASS in backend/.env before sending emails.",
      });
    }

    const transporter = await buildMailTransport();
    const emailFrom = process.env.SMTP_FROM || smtpUser || "quotes@construction.local";
    const budgetValue = quote.budget && String(quote.budget).trim() ? String(quote.budget).trim() : "Not provided";
    const estimateSummary = [
      `Materials: ${quote.estimate.materialsCost}`,
      `Labor: ${quote.estimate.laborCost}`,
      `Other: ${quote.estimate.otherCost}`,
      `Total Cost: ${quote.estimate.totalCost}`,
      `Estimated Time: ${quote.estimate.estimatedDays || "Not provided"}`,
      `Budget: ${budgetValue}`,
    ].join("\n");

    const emailHtml = `
      <div>
        <h2>Project Cost Estimate</h2>
        <p><strong>Client:</strong> ${quote.fullName}</p>
        <p><strong>Company:</strong> ${quote.companyName || "Individual Client"}</p>
        <p><strong>Project Type:</strong> ${quote.projectType}</p>
        <p><strong>Project Size:</strong> ${quote.projectSize}</p>
        <p><strong>Details:</strong> ${quote.details}</p>
        <h3>Estimate</h3>
        <ul>
          <li>Materials: ${quote.estimate.materialsCost}</li>
          <li>Labor: ${quote.estimate.laborCost}</li>
          <li>Other: ${quote.estimate.otherCost}</li>
          <li><strong>Total Cost:</strong> ${quote.estimate.totalCost}</li>
          <li><strong>Estimated Time:</strong> ${quote.estimate.estimatedDays || "Not provided"}</li>
          <li><strong>Budget:</strong> ${budgetValue}</li>
        </ul>
        <p><strong>Message from the team:</strong></p>
        <p>${message.replace(/\n/g, "<br />")}</p>
      </div>
    `;

    const mailOptions = {
      from: emailFrom,
      to: quote.email,
      subject,
      text: `${message}\n\nEstimate Summary:\n${estimateSummary}`,
      html: emailHtml,
    };

    console.log("Sending quote email:", {
      from: emailFrom,
      to: quote.email,
      subject,
    });

    const info = await transporter.sendMail(mailOptions);
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log("Ethereal preview URL:", previewUrl);
    }

    quote.status = "Sent";
    await quote.save();

    const responseMessage = previewUrl
      ? `Quote email sent to client successfully. Preview: ${previewUrl}`
      : "Quote email sent to client successfully.";

    res.json({ message: responseMessage, quote, previewUrl });
  } catch (error) {
    console.error("Send quote email error:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createQuoteRequest,
  listQuoteRequests,
  estimateQuote,
  sendQuoteEmail,
};
