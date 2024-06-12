/* eslint-disable no-undef */
import './App.css';
import React, { useState, useEffect } from "react";
import { DataGrid } from '@mui/x-data-grid';
import * as Mui from '@mui/material';

function App() {
  const [name, setName] = useState('');
  const [datetime, setDatetime] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  useEffect(() => {
    getTransactions()
      .then(setTransactions)
      .catch(error => {
        console.error('Error fetching transactions:', error.message);
        setErrorMessage('Failed to fetch transactions. Please try again later.');
      });
  }, []);

  async function getTransactions() {
    const url = process.env.REACT_APP_API_URL + 'transactions';
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  }

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
      getTransactions()
      .then(setTransactions)
      .catch(error => {
        console.error('Error fetching transactions:', error.message);
        setErrorMessage('Failed to fetch transactions. Please try again later.');
      });
    }).catch(error => {
      console.error('Error adding transaction:', error.message);
      setErrorMessage('Failed to add transaction. Please try again later.');
    });
  }

  async function deleteTransaction(transactionId) {
    const url = `${process.env.REACT_APP_API_URL}transaction/${transactionId}`;

    try {
      const response = await fetch(url, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete transaction');
      }

      setTransactions(transactions.filter(transaction => transaction._id !== transactionId));
      setSelectedTransaction(null);
    } catch (error) {
      console.error('Error deleting transaction:', error.message);
      setErrorMessage('Failed to delete transaction. Please try again later.');
    }
  }

  function openContextMenu(transactionId) {
    setSelectedTransaction(transactionId);
  }

  function closeContextMenu() {
    setSelectedTransaction(null);
  }

  function handleEditTransaction(transactionId) {
    // Implement edit logic here
    console.log('Edit transaction:', transactionId);
    closeContextMenu();
  }



  let balance = calculateBalance(transactions);

  function calculateBalance(transactions) {
    return transactions.reduce((acc, transaction) => {
      return acc + transaction.price;
    }, 0);
  }

  balance = balance.toFixed(2);
  const fraction = balance.split('.')[1];

  const TransactionTable = ({ transactions, errorMessage }) => {
    if (transactions.length === 0 || errorMessage !== '') {
      return null;
    }
  
    // eslint-disable-next-line no-undef
    const columnsData = [
      {
        field: 'name',
        headerName: 'Name',
        flex: 1,
        renderCell: (params) => (
          <div className="name" title={params.row.description || 'No description'}>
            {params.value}
          </div>
        ),
      },
      {
        field: 'datetime',
        headerName: 'Date & Time',
        flex: 1,
        valueGetter: (params) => {
          return (formatDateTime(params));
        },
        //sortComparator: (v1, v2) => new Date(v1) - new Date(v2),
        renderCell: (params) => (
          <div className="datetime">
            {formatDateTime(params.row.datetime)}
          </div>
        ),
      },
      {
        field: 'price',
        headerName: 'Price',
        flex: 1,
        renderCell: (params) => (
          <div className={`price ${params.value < 0 ? 'red' : 'green'}`}>
            {params.value < 0 ? params.value.toFixed(2) : `+${params.value.toFixed(2)}`}
          </div>
        ),
        //sortComparator: (v1, v2) => v1 - v2,
      },
    ];
  
    // eslint-disable-next-line no-undef
    const rowsData = transactions.map((transaction) => ({
      id: transaction._id,
      name: transaction.name,
      description: transaction.description,
      datetime: transaction.datetime,
      price: transaction.price,
    }));
    //console.log(rowsData);

    return (
      <div className='transactions'>
      <Mui.Paper style={{ background: 'transparent' }}>
        <DataGrid
          rows={rowsData}
          columns={columnsData}
          getRowClassName={() => 'transaction'}
          autoHeight
          style={{ border: 'none' }}
          classes={{
            columnHeader: 'col-header', 
          }}
          onRowSelectionModelChange={(id) => {
            console.log(id);
            openContextMenu(id[0]);
          }}
        />
      </Mui.Paper>
      </div>
    );
  };

  function formatDateTime(datetime) {
    const date = new Date(datetime);

    const padToTwoDigits = (num) => {
      return num.toString().padStart(2, '0');
    };

    const day = padToTwoDigits(date.getDate());
    const month = padToTwoDigits(date.getMonth() + 1);
    const year = date.getFullYear();
    const hours = padToTwoDigits(date.getHours());
    const minutes = padToTwoDigits(date.getMinutes());

    return `${day}-${month}-${year} ${hours}:${minutes}`;
  }

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
        </form>
    <TransactionTable transactions={transactions} errorMessage={errorMessage} />
    {errorMessage !== '' && <div className="error">{errorMessage}</div> }
    </main>
);
}

export default App;
