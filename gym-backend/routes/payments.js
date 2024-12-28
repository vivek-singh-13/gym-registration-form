const express = require('express');
const router = express.Router();
const db = require('../db'); 

//console.log('Payments routes loaded');

router.get('/unpaidfees', (req, res) => {
    console.log('Accessing /payments/unpaidfees route');
    const unpaidFeesSql = `
        SELECT s.student_id, s.name, b.batch_id, b.batch_name
        FROM students s
        LEFT JOIN payments p ON s.student_id = p.student_id AND p.month_year = ?
        LEFT JOIN batches b ON p.batch_id = b.batch_id
        WHERE p.payment_id IS NULL;
    `;
    const currentMonth = new Date().toISOString().slice(0, 7); // Current month in YYYY-MM format
    db.query(unpaidFeesSql, [currentMonth], (err, results) => {
        if (err) {
            console.error('Error retrieving unpaid fees:', err);
            return res.status(500).json({ error: 'Failed to retrieve unpaid fees' });
        }
        res.status(200).json(results);
    });
});

// Get outstanding dues for students
router.get('/outstandingdues', (req, res) => {
    const duesSql = `
        SELECT s.student_id, s.name, SUM(b.fees) AS total_dues
        FROM students s
        LEFT JOIN payments p ON s.student_id = p.student_id
        LEFT JOIN batches b ON p.batch_id = b.batch_id
        WHERE p.payment_id IS NULL
        GROUP BY s.student_id;
    `;
    db.query(duesSql, (err, results) => {
        if (err) {
            console.error('Error calculating dues:', err);
            return res.status(500).json({ error: 'Failed to calculate dues' });
        }
        res.status(200).json(results);
    });
});


module.exports = router;
