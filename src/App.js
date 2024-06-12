/* eslint-disable no-undef */
import './App.css';
import React, { useState, useEffect } from "react";
import { DataGrid } from '@mui/x-data-grid';
import * as Mui from '@mui/material';
import EditTransactionForm from './EditTransactionForm'; 

function App() {
  const [name, setName] = useState('');
  const [datetime, setDatetime] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

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

      setTimeout(() => {
        window.location.reload();
      }, 500);

    }).catch(error => {
      console.error('Error adding transaction:', error.message);
      setErrorMessage('Failed to add transaction. Please try again later.');
    });
  }

  async function deleteTransaction(transaction) {
    const url = `${process.env.REACT_APP_API_URL}transaction/${transaction._id}`;
    console.log(url);

    try {
      const response = await fetch(url, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete transaction');
      }

      setSelectedTransaction(null);
    } catch (error) {
      console.error('Error deleting transaction:', error.message);
      setErrorMessage('Failed to delete transaction. Please try again later.');
    }
    closeContextMenu();
    setTimeout(() => {
      window.location.reload();
    }, 500);
  }

  function openContextMenu(transaction) {
    setSelectedTransaction(transaction);
  }

  function closeContextMenu() {
    setSelectedTransaction(null);
  }

  function handleEditTransaction(transaction) {
    setIsEditDialogOpen(true);
    console.log('Edit transaction:', transaction);
  }

  function closeEditDialog() {
    closeContextMenu();
    setIsEditDialogOpen(false);
  }

  function submitEditedTransaction(updatedTransaction) {
    fetch(`${process.env.REACT_APP_API_URL}transaction/${updatedTransaction._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedTransaction)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to update transaction');
      }
      return response.json();
    })
    .then(json => {
      console.log('Transaction updated successfully:', json);
      // Optionally, update the state with the updated transaction
    })
    .catch(error => {
      console.error('Error updating transaction:', error);
      setErrorMessage('Failed to update transaction. Please try again later.');
    });
    closeEditDialog();
    setTimeout(() => {
      window.location.reload();
    }, 500);
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
            const selectedRow = transactions.find(transaction => transaction._id === id[0]);
            openContextMenu(selectedRow);
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
    <Mui.Dialog open={selectedTransaction !== null} onClose={closeContextMenu}>
        <Mui.DialogTitle>Transaction Options</Mui.DialogTitle>
        <Mui.DialogContent>
          <Mui.DialogContentText style={{ fontSize: '1.2rem', fontWeight: '500' }}>
          Do you want to edit or delete the entry for "<strong>{selectedTransaction ? selectedTransaction.name : ''}</strong>"?
          </Mui.DialogContentText>
        </Mui.DialogContent>
        <Mui.DialogActions>
          <Mui.Button onClick={() => handleEditTransaction(selectedTransaction)} style={{ borderColor: '#e14478', color: '#e14478' }} variant="outlined">
            Edit
          </Mui.Button>
          <Mui.Button onClick={() => deleteTransaction(selectedTransaction)} style={{ borderColor: '#e14478', color: '#e14478' }} variant="outlined">
            Delete
          </Mui.Button>
          <Mui.Button onClick={closeContextMenu} style={{ borderColor: '#e14478', color: '#e14478' }} variant="outlined">
            Close
          </Mui.Button>
        </Mui.DialogActions>
      </Mui.Dialog>

      {isEditDialogOpen && (
        <EditTransactionForm
          transaction={selectedTransaction}
          onClose={closeEditDialog}
          onSubmit={submitEditedTransaction}
        />
      )}
    </main>
);
}

export default App;
