const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const TransactionSchema = new Schema({
    name: {type: String, required:true},
    price: {type: Number, required:true},
    description: {type: String},
    datetime: {type: Date, required: true},
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
    user_id: {type: String, required: true},
});

const TransactionModel = model('Transaction', TransactionSchema);

module.exports = TransactionModel;