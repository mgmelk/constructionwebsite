const path = require('path');
const mongoose = require('mongoose');
const Project = require('../models/Project');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const DEFAULT_PAYMENTS = [
  { id: 'INV-20M-01', description: 'Phase 1 Milestone Payment (Mobilization & Initial Clearance)', amount: 20000000, date: '2026-08-01', status: 'Unpaid' },
  { id: 'INV-30M-02', description: 'Phase 2 Milestone Payment (Substructure & Foundation)', amount: 30000000, date: '2026-12-01', status: 'Unpaid' },
  { id: 'INV-50M-03', description: 'Phase 3 Milestone Payment (Superstructure & Floor Concrete)', amount: 50000000, date: '2027-06-01', status: 'Unpaid' },
  { id: 'INV-50M-04', description: 'Phase 4 Milestone Payment (MEP, Glass Facade & Final Handover)', amount: 50000000, date: '2028-05-01', status: 'Unpaid' },
];

async function updateProjectsWithMilestones() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB Connected successfully.');

  const result = await Project.updateMany(
    {},
    { $set: { budget: 150000000, paidAmount: 0, payments: DEFAULT_PAYMENTS } }
  );

  console.log('Updated projects in MongoDB:', result);
  const projects = await Project.find({});
  projects.forEach(p => {
    console.log(`\nProject: ${p.projectName}`);
    console.log(`Budget: ${p.budget.toLocaleString()} Birr | Paid to Date: ${p.paidAmount.toLocaleString()} Birr`);
    console.log('Milestone Payments Breakdown:');
    p.payments.forEach((m, idx) => {
      console.log(`  [${idx+1}] ${m.id}: ${(m.amount/1000000)} Million ETB - Status: ${m.status}`);
    });
  });

  await mongoose.connection.close();
}

updateProjectsWithMilestones().catch(console.error);
