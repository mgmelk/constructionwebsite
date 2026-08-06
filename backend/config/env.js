const path = require('path');
const dotenv = require('dotenv');

const envPath = path.resolve(__dirname, '../.env');
const result = dotenv.config({ path: envPath });

if (result.error) {
  console.warn(`Warning: Could not load backend .env from ${envPath}: ${result.error.message}`);
} else {
  console.log(`Loaded backend env from ${envPath}`);
}

module.exports = process.env;
