const express = require('express');
const cors = require('cors');
require('dotenv').config();
const Transaction = require('./models/Transaction.js');
const mongoose = require('mongoose');

const app = express();

app.use(cors());
app.use(express.json());

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

app.post('/api/transaction', async (req, res, next) => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        const transaction = await Transaction.create(req.body);
        res.json(transaction);
    } catch (error) {
        next(error); 
    }
});

app.get('/api/transactions', async (req, res, next) => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        const transactions = await Transaction.find();
        res.json(transactions);
    } catch (error) {
        next(error); 
    }
});

app.listen(4000, () => {
    console.log('Server is running on port 4000');
});
