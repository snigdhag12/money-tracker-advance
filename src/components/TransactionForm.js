import React, { useState } from 'react';

const TransactionForm = ({ setErrorMessage }) => {
  const [name, setName] = useState('');
  const [datetime, setDatetime] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);

  function addNewTransaction(ev){
    //console.log("add new called");
    ev.preventDefault();

    const url = process.env.REACT_APP_API_URL + 'transaction';

    fetch(url, {
      method: 'POST',
      headers: {'Content-type': 'application/json'},
      body: JSON.stringify({
        name: name, 
        price,
        description, 
        datetime})
    }).then(response => {
      if (!response.ok) {
        throw new Error('Failed to add transaction');
      }
      return response.json();
    }).then(json => {
      console.log('result', json);
      setPrice(0);
      setName('');
      setDatetime('');
      setDescription('');
      setErrorMessage('');

      setTimeout(() => {
        window.location.reload();
      }, 500);

    }).catch(error => {
      console.error('Error adding transaction:', error.message);
      setErrorMessage('Failed to add transaction. Please try again later.');
    });
  }

  return (
    <form onSubmit={addNewTransaction}>
      <div className="basic">
        <input 
          type="number"
          value={price}
          onChange={(ev) => setPrice(ev.target.value)}
          placeholder={'Price (+/-)'}
          required
        />
        <input 
        type="text"
        value={name}
        onChange={ev => setName(ev.target.value)} 
        placeholder={'Spend on or earned from'}
        required
        />
        </div>
        <div className="fullcolumn">
        <input 
        type="datetime-local"
        max={new Date().toISOString().slice(0,new Date().toISOString().lastIndexOf(":"))}
        value={datetime}
        onChange={ev => setDatetime(ev.target.value)}
        required
        />
        <input type="text"
        value={description}
        onChange={ev => setDescription(ev.target.value)} 
        placeholder={'Additional Description'}/>
        </div>
        <div className='button-class'>
        <button type="submit">
          Add new transaction
        </button>
        </div>
        </form>
  );
};

export default TransactionForm;
