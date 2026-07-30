const connectDB = require('../config/db');
const mongoose = require('mongoose');
const Project = require('../models/Project');

async function run() {
  await connectDB();
  try {
    const proj = await Project.findOne().sort({ createdAt: 1 });
    if (!proj) {
      console.error('No projects found in DB. Create a project first.');
      process.exit(1);
    }

    const payment = (proj.payments && proj.payments.length > 0) ? proj.payments[0] : null;
    if (!payment) {
      console.error('Project has no payment items. See seedMilestones.js to create payments.');
      process.exit(1);
    }

    payment.status = 'Pending Approval';
    payment.receiptRef = payment.receiptRef || `REF-${Date.now().toString().slice(-6)}`;
    payment.receiptUrl = payment.receiptUrl || 'https://via.placeholder.com/800x600.png?text=Receipt+Test';
    payment.submittedAt = new Date();

    await proj.save();

    console.log('Marked project payment as Pending Approval:');
    console.log('Project:', proj.projectName || proj._id);
    console.log('Payment id:', payment.id || payment._id);
    console.log('ReceiptRef:', payment.receiptRef);
    process.exit(0);
  } catch (e) {
    console.error('Error:', e);
    process.exit(1);
  }
}

run();
