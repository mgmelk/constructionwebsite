const { buildMailTransport } = require("./utils/mailTransport");

(async () => {
  try {
    const transporter = await buildMailTransport();
    console.log("Transport OK");
    console.log(JSON.stringify({ transport: transporter.transport ? transporter.transport.name : transporter.options || null }));
  } catch (err) {
    console.error("Transport failed:", err.message);
    if (err.stack) console.error(err.stack);
    process.exit(1);
  }
})();