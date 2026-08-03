const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const http = require('http');
const mongoose = require('mongoose');
const Project = require('../models/Project');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/construction');
    const user = await User.findOne({ email: 'client@gmail.com' });
    if (!user) {
      console.log('No client user found');
      process.exit(1);
    }

    const token = jwt.sign({ id: user._id, email: user.email, role: user.role || 'client' }, process.env.JWT_SECRET || 'secret', { expiresIn: '8h' });
    console.log('TOKEN', token);

    const project = await Project.findOne({ 'payments.id': 'INV-20M-01' });
    console.log('BEFORE', JSON.stringify({
      projectId: project?._id?.toString(),
      payment: project?.payments?.find(p => p.id === 'INV-20M-01')
    }, null, 2));

    const payload = JSON.stringify({
      receiptUrl: 'https://example.com/receipt-test.png',
      paymentMethod: 'Telebirr',
      receiptRef: 'TEST-REF-001',
      projectId: project?._id?.toString(),
    });

    const req = http.request({
      hostname: '127.0.0.1',
      port: 5000,
      path: `/api/projects/${project?._id?.toString() || 'resolve'}/payments/INV-20M-01/receipt`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
        'Authorization': `Bearer ${token}`,
      },
    }, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', async () => {
        console.log('STATUS', res.statusCode);
        console.log('BODY', body);
        const updated = await Project.findOne({ 'payments.id': 'INV-20M-01' });
        const payment = updated?.payments?.find(p => p.id === 'INV-20M-01');
        console.log('AFTER', JSON.stringify({
          projectId: updated?._id?.toString(),
          payment: {
            status: payment?.status,
            receiptRef: payment?.receiptRef,
            receiptUrl: payment?.receiptUrl,
            submittedAt: payment?.submittedAt,
          },
        }, null, 2));
        await mongoose.disconnect();
      });
    });

    req.on('error', async (err) => {
      console.error('REQUEST_ERROR', err.message);
      await mongoose.disconnect();
      process.exit(1);
    });

    req.write(payload);
    req.end();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
