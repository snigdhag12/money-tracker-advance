import './App.css';
import React, {useState, useEffect } from "react";

function App() {
  const [name, setName] = useState('');
  const [datetime, setDatetime] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    getTransactions()
      .then(setTransactions)
      .catch(error => {
        console.error('Error fetching transactions:', error.message);
        setErrorMessage('Failed to fetch transactions. Please try again later.');
      });
  }, [addNewTransaction]);

  

  async function getTransactions() {
    const url = process.env.REACT_APP_API_URL + 'transactions';
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  }

  function addNewTransaction(ev){
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
    }).catch(error => {
      console.error('Error adding transaction:', error.message);
      setErrorMessage('Failed to add transaction. Please try again later.');
    });
  }

  let balance = calculateBalance(transactions);

  function calculateBalance(transactions) {
    return transactions.reduce((acc, transaction) => {
      return acc + transaction.price;
    }, 0);
  }

  balance = balance.toFixed(2);
  const fraction = balance.split('.')[1];

  return (
    <main>
      <h1>₹{balance.split('.')[0]}.<span>{fraction}</span></h1>
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
        <div className="transactions">
          {transactions.length > 0 && errorMessage == '' && transactions.map(transaction => 
          <div className="transaction">
          <div className="left">
            <div className="name">{transaction.name}</div>
            <div className="description">{transaction.description==''?'No description':transaction.description}</div>
          </div>
          <div className="right">
            <div className={"price " + (transaction.price < 0?'red': 'green')}>
            {transaction.price < 0? transaction.price.toFixed(2): '+' + transaction.price.toFixed(2)}
            </div>
            <div className="datetime">{formatDateTime(transaction.datetime)}</div>
          </div>
          </div>
          )}
          {errorMessage != '' && <div className="error">{errorMessage}</div> }
        </div>
      </form>
    </main>
  );
}

function formatDateTime(datetime) {
  const date = new Date(datetime);
  return date.toISOString().slice(0, 16);
}

export default App;
