import React, { useState } from 'react';
import * as Mui from '@mui/material';
import '../styles/EditTransactionForm.css';
import { WithContext as ReactTags } from 'react-tag-input';

const EditTransactionForm = ({ transaction, onClose, onSubmit }) => {
  const [name, setName] = useState(transaction.name);
  const [datetime, setDatetime] = useState(new Date(transaction.datetime).toISOString().slice(0, -8));
  const [description, setDescription] = useState(transaction.description);
  const [price, setPrice] = useState(transaction.price);
  const [categories, setCategories] = useState(transaction.categories?.map(cat => ({ id: cat._id, text: cat.text })));

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedTransaction = { ...transaction, name, datetime, description, price, categories: categories.map(cat => cat.id) };
    onSubmit(updatedTransaction);
  };

  const handleDelete = (i) => {
    setCategories(categories.filter((tag, index) => index !== i));
  };

  const handleAddition = (tag) => {
    setCategories([...categories, tag]);
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
          {categories.length !== 0 && (
            <div className="form-input edit-form">
              {console.log(categories)}
              <ReactTags
                tags={categories}
                handleDelete={handleDelete}
                handleAddition={handleAddition}
                allowNew
                placeholder="Press Enter to Add category"
                editable
                maxTags={4}
                inputFieldPosition="top"
              />
            </div>
          )}
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
