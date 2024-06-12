import React, { useState } from 'react';
import * as Mui from '@mui/material';

const EditTransactionForm = ({ transaction, onClose, onSubmit }) => {
  console.log(transaction);
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
<Mui.DialogTitle style={{ textAlign: 'center', fontSize: '1.5rem' }}>Edit Transaction</Mui.DialogTitle>
      <Mui.DialogContent>
        <form onSubmit={handleSubmit} style={{ width: '60%', margin: '0 auto' }}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ fontSize: '1rem', borderColor: '#e14478', borderWidth: '1px', borderRadius: '4px', width: '100%', marginBottom: '10px' }}
          />
          <input
            type="datetime-local"
            value={datetime}
            onChange={(e) => setDatetime(e.target.value)}
            style={{ fontSize: '1rem', borderColor: '#e14478', borderWidth: '1px', borderRadius: '4px', width: '100%', marginBottom: '10px' }}
          />
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ fontSize: '1rem', borderColor: '#e14478', borderWidth: '1px', borderRadius: '4px', width: '100%', marginBottom: '10px' }}
          />
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            style={{ fontSize: '1rem', borderColor: '#e14478', borderWidth: '1px', borderRadius: '4px', width: '100%', marginBottom: '10px' }}
          />
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
            <Mui.Button
              type="submit"
              style={{ borderColor: '#e14478', color: '#e14478' }}
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
