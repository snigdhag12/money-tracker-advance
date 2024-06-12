import React, { useState } from 'react';
import * as Mui from '@mui/material';
import '../styles/EditTransactionForm.css';

const EditTransactionForm = ({ transaction, onClose, onSubmit }) => {
  const [name, setName] = useState(transaction.name);
  const [datetime, setDatetime] = useState(new Date(transaction.datetime).toISOString().slice(0, -8));
  const [description, setDescription] = useState(transaction.description);
  const [price, setPrice] = useState(transaction.price);

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedTransaction = { ...transaction, name, datetime, description, price };
    onSubmit(updatedTransaction);
  };

  return (
    <Mui.Dialog open onClose={onClose}>
      <Mui.DialogTitle className="dialog-title">Edit Transaction</Mui.DialogTitle>
      <Mui.DialogContent>
        <form onSubmit={handleSubmit} className="form-container">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="form-input"
          />
          <input
            type="datetime-local"
            value={datetime}
            onChange={(e) => setDatetime(e.target.value)}
            className="form-input"
          />
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="form-input"
          />
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="form-input"
          />
          <div className="submit-button-container">
            <Mui.Button
              type="submit"
              className="submit-button"
              variant="outlined"
            >
              Submit
            </Mui.Button>
          </div>
        </form>
      </Mui.DialogContent>
    </Mui.Dialog>
  );
};

export default EditTransactionForm;
