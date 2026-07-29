const path = require('path');
const mongoose = require('mongoose');
const Project = require('../models/Project');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function updateProjectsBudget() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB Connected successfully.');

  const result = await Project.updateMany(
    {},
    { $set: { budget: 150000000, paidAmount: 0 } }
  );

  console.log('Updated projects in MongoDB:', result);
  const projects = await Project.find({}, 'projectName budget paidAmount');
  console.log('\nCurrent Projects Financial Summary:');
  projects.forEach(p => {
    console.log(`- ${p.projectName}: Budget=${p.budget.toLocaleString()} Birr, Paid=${p.paidAmount.toLocaleString()} Birr, Remaining=${(p.budget - p.paidAmount).toLocaleString()} Birr`);
  });

  await mongoose.connection.close();
}

updateProjectsBudget().catch(console.error);
