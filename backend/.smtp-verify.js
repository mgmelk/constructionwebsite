const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const { buildMailTransport } = require('./utils/mailTransport');
(async () => {
  try {
    const transporter = await buildMailTransport();
    console.log('buildMailTransport succeeded');
    process.exit(0);
  } catch (err) {
    console.error('buildMailTransport failed:');
    console.error(err && err.stack ? err.stack : err);
    process.exit(1);
  }
})();
