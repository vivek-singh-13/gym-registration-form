const express = require('express');
const router = express.Router();
const db = require('../db'); 
const crypto = require('crypto');
const dotenv = require('dotenv');

dotenv.config();

const encryptionKey = process.env.KEY || 'your32characterlongsecretkey!'; // Must be 32 bytes
const ivLength = 16; // AES IV length

// Encrypt function
function encrypt(text) {
    const iv = crypto.randomBytes(ivLength); // Generate a random IV
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(encryptionKey), iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return {
        iv: iv.toString('hex'),
        encryptedData: encrypted,
    };
}

// Decrypt function
function decrypt(encryptedData, iv) {
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(encryptionKey), Buffer.from(iv, 'hex'));
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

// Register a new student
router.post('/register', (req, res) => {
    const { name, address, batch_id, amount, month_year } = req.body;

    // Validate required fields
    if (!name || !address || !batch_id || !amount || !month_year) {
        return res.status(400).json({ error: 'All fields (name, address, batch_id, amount, month_year) are required.' });
    }

    const currentMonth = new Date().toISOString().slice(0, 7); // Get the current month in YYYY-MM format
    console.log('Validating month_year:', month_year, 'against currentMonth:', currentMonth);

    if (month_year < currentMonth) {
        return res.status(400).json({ error: 'Payment for previous months is not allowed' });
    }

    // Encrypt personal information (name and address) as JSON
    const personalInfo = JSON.stringify({ name, address });
    const { encryptedData: encryptedPersonalInfo, iv } = encrypt(personalInfo);

    // Get batch fee from the batches table
    const getBatchFeeSql = `SELECT fees FROM batches WHERE batch_id = ?`;
    db.query(getBatchFeeSql, [batch_id], (err, results) => {
        if (err) {
            console.error('Error fetching batch fee:', err);
            return res.status(500).json({ error: 'Failed to retrieve batch fee' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Batch not found' });
        }

        const fee = results[0].fees; // Fee for the selected batch

        // Insert the student's personal info into the students table
        const insertStudentSql = `INSERT INTO students (personal_info, iv) VALUES (?, ?)`;
        db.query(insertStudentSql, [encryptedPersonalInfo, iv], (err, result) => {
            if (err) {
                console.error('Error inserting student:', err);
                return res.status(500).json({ error: 'Failed to register student' });
            }

            const studentId = result.insertId; // Retrieve the ID of the newly inserted student

            // Insert the payment into the payments table
            const insertPaymentSql = `
                INSERT INTO payments (student_id, batch_id, amount, month_year, payment_date)
                VALUES (?, ?, ?, ?, CURDATE())
            `;

            db.query(insertPaymentSql, [studentId, batch_id, fee, month_year], (err) => {
                if (err) {
                    console.error('Error inserting payment:', err);
                    return res.status(500).json({ error: 'Failed to process payment' });
                }
                res.status(200).json({ message: 'Student registered successfully' });
            });
        });
    });
});


module.exports = router;
