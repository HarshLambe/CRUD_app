const User = require('../models/cadetreg');
const express = require('express');
const router = express.Router();
const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');
const fs = require('fs');

// Authentication middleware
const authenticateUser = (req, res, next) => {
  // Assuming you have a user object stored in the request after authentication
  if (req.user) {
    next(); // User is authenticated, proceed to the next middleware or route handler
  } else {
    res.status(401).send('Unauthorized'); // User is not authenticated
  }
};

// Express route to render the EJS template for Excel
router.get('/render-excel', authenticateUser, async (req, res) => {
  try {
    const queryCriteria = { author: req.user._id };
    const users = await User.find(queryCriteria).exec();

    res.render('excelTemplate', { title: 'excel book', users });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Express route to export data to Excel
router.get('/export-excel', authenticateUser, async (req, res) => {
  try {

    const queryCriteria = { author: req.user._id };
    const users = await User.find(queryCriteria).exec();

    // Create an Excel workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('User Data');

    // Add headers
    worksheet.addRow(['Name', 'Email', 'Phone', 'Regiment No', 'ID', 'Enrollment Year',
      'Bloodgroup', 'Gender', 'Fathername', 'Mothername', 'Date Of Birth', 'Caste'
      , 'Address', 'Parentmob no', 'Aadhar Card No']);

    // Add data
    users.forEach((user) => {
      worksheet.addRow([user.name, user.email, user.phone, user.regimentno,
      user.id,
      user.year,

      user.Bloodgroup,
      user.gender,
      user.fathername,
      user.mothername,
      user.DOB,
      user.caste,
      user.Address,
      user.parentmobno,
      user.aadharno,
      ]);
    });

    // Set the Excel title dynamically
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=users.xlsx');

    // Write the Excel workbook to the response
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
