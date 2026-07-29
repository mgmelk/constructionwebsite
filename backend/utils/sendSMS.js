const https = require("https");
const http = require("http");

/**
 * Utility to send real Mobile SMS messages using Twilio or AfroMessage API,
 * with console fallback logging if SMS keys are not configured.
 *
 * @param {Object} options
 * @param {string} options.to - Recipient phone number (e.g. "+251929581296" or "0929581296")
 * @param {string} options.message - Text body to send
 */
const sendSMS = async ({ to, message }) => {
  const provider = (process.env.SMS_PROVIDER || "afromessage").toLowerCase();

  // Normalize phone number for Ethiopian numbers if needed
  let formattedPhone = to ? String(to).trim() : "";
  if (formattedPhone.startsWith("0")) {
    formattedPhone = "+251" + formattedPhone.substring(1);
  } else if (!formattedPhone.startsWith("+") && formattedPhone.length === 9) {
    formattedPhone = "+251" + formattedPhone;
  }

  console.log(`\n[SMS Gateway Dispatch]`);
  console.log(`Provider: ${provider.toUpperCase()}`);
  console.log(`To: ${formattedPhone}`);
  console.log(`Message Body: "${message}"`);

  // --- Option 1: AfroMessage (Popular Ethiopian SMS Gateway) ---
  if (provider === "afromessage") {
    const apiKey = process.env.AFROMESSAGE_API_KEY;
    const senderId = process.env.AFROMESSAGE_SENDER_ID;

    if (!apiKey) {
      console.warn("⚠️  [SMS Notice] AFROMESSAGE_API_KEY is not set in backend/.env.");
      console.warn("⚠️  SMS details logged above for simulation/testing.");
      return { success: false, simulated: true, reason: "AFROMESSAGE_API_KEY missing" };
    }

    try {
      const postData = JSON.stringify({
        to: formattedPhone,
        message: message,
        sender: senderId || "",
      });

      const options = {
        hostname: "api.afromessage.com",
        port: 443,
        path: "/api/send-sms",
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(postData),
        },
      };

      return new Promise((resolve) => {
        const req = https.request(options, (res) => {
          let data = "";
          res.on("data", (chunk) => (data += chunk));
          res.on("end", () => {
            console.log(`✅ [AfroMessage Response] Status: ${res.statusCode}, Body: ${data}`);
            resolve({ success: res.statusCode >= 200 && res.statusCode < 300, response: data });
          });
        });

        req.on("error", (err) => {
          console.error("❌ [AfroMessage Error]", err.message);
          resolve({ success: false, error: err.message });
        });

        req.write(postData);
        req.end();
      });
    } catch (err) {
      console.error("❌ [SMS Dispatch Exception]", err.message);
      return { success: false, error: err.message };
    }
  }

  // --- Option 2: Twilio SMS ---
  if (provider === "twilio") {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromPhone = process.env.TWILIO_PHONE_NUMBER;

    if (!accountSid || !authToken || !fromPhone) {
      console.warn("⚠️  [SMS Notice] Twilio environment variables are missing in backend/.env.");
      console.warn("⚠️  SMS details logged above for simulation/testing.");
      return { success: false, simulated: true, reason: "Twilio credentials missing" };
    }

    try {
      const auth = Buffer.from(`${accountSid}:${authToken}`).toString("base64");
      const postData = new URLSearchParams({
        To: formattedPhone,
        From: fromPhone,
        Body: message,
      }).toString();

      const options = {
        hostname: "api.twilio.com",
        port: 443,
        path: `/2010-04-01/Accounts/${accountSid}/Messages.json`,
        method: "POST",
        headers: {
          "Authorization": `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
          "Content-Length": Buffer.byteLength(postData),
        },
      };

      return new Promise((resolve) => {
        const req = https.request(options, (res) => {
          let data = "";
          res.on("data", (chunk) => (data += chunk));
          res.on("end", () => {
            console.log(`✅ [Twilio Response] Status: ${res.statusCode}, Body: ${data}`);
            resolve({ success: res.statusCode >= 200 && res.statusCode < 300, response: data });
          });
        });

        req.on("error", (err) => {
          console.error("❌ [Twilio Error]", err.message);
          resolve({ success: false, error: err.message });
        });

        req.write(postData);
        req.end();
      });
    } catch (err) {
      console.error("❌ [SMS Dispatch Exception]", err.message);
      return { success: false, error: err.message };
    }
  }

  // Fallback if provider unknown
  console.warn(`⚠️  Unknown SMS provider "${provider}". Message logged above.`);
  return { success: false, simulated: true, reason: "Unknown provider" };
};

module.exports = sendSMS;
