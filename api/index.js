const express = require('express');
const cors = require('cors');
require('dotenv').config();
const Transaction = require('./models/Transaction.js');
const Category = require('./models/Category.js');
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
        const { name, price, description, datetime, categories } = req.body;

        const categoryDocs = await Promise.all(categories.map(async (cat) => {
            let category = await Category.findOne({ text: cat });
            if (!category) {
                category = await Category.create({ text: cat });
            }
            return category;
        }));

        const categoryIds = categoryDocs.map(category => category._id);

        const transaction = await Transaction.create({
            name,
            price,
            description,
            datetime,
            categories: categoryIds 
        });

        res.json(transaction);
    } catch (error) {
        next(error); 
    }
});

app.get('/api/transactions', async (req, res, next) => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        const transactions = await Transaction.find().populate('categories');
        res.json(transactions);
    } catch (error) {
        next(error); 
    }
});

app.delete('/api/transaction/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
        await mongoose.connect(process.env.MONGO_URL);
        const result = await Transaction.findByIdAndDelete(id);
        if (result) {
            res.json({ message: 'Transaction deleted successfully' });
        } else {
            res.status(404).json({ error: 'Transaction not found' });
        }
    } catch (error) {
        next(error); 
    }
});

app.put('/api/transaction/:id', async (req, res, next) => {
    const { id } = req.params;
    const updatedTransactionData = req.body;
  
    try {
      await mongoose.connect(process.env.MONGO_URL);
      const updatedTransaction = await Transaction.findByIdAndUpdate(id, updatedTransactionData, { new: true });
  
      if (updatedTransaction) {
        res.json({ message: 'Transaction updated successfully', updatedTransaction });
      } else {
        res.status(404).json({ error: 'Transaction not found' });
      }
    } catch (error) {
      next(error);
    }
  });


app.get('/api/categories', async (req, res, next) => {
    try {
      await mongoose.connect(process.env.MONGO_URL);
      const categories = await Category.find();
      res.json(categories);
    } catch (error) {
      next(error);
    }
});

app.listen(4000, () => {
    console.log('Server is running on port 4000');
});
