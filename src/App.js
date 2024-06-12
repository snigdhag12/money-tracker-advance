import './App.css';
import React, { useState, useEffect } from "react";
import EditTransactionForm from './components/EditTransactionForm'; 
import TransactionForm from './components/TransactionForm';
import TransactionTable from './components/TransactionTable';
import TransactionOptionsBox from './components/TransactionOptionsBox';
import { getTransactions, deleteTransaction, submitEditedTransaction } from './crudUtilities';
import { calculateBalance } from './miscUtilities';

function App() {
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

  function openContextMenu(transaction) {
    setSelectedTransaction(transaction);
  }

  function closeContextMenu() {
    setSelectedTransaction(null);
  }

  function handleEditTransaction(transaction) {
    setIsEditDialogOpen(true);
  }

  function closeEditDialog() {
    closeContextMenu();
    setIsEditDialogOpen(false);
  }

  let balance = calculateBalance(transactions);
  balance = balance.toFixed(2);
  const fraction = balance.split('.')[1];
  
  return (
    <main>
      <h1>₹{balance.split('.')[0]}.<span>{fraction}</span></h1>
      <TransactionForm setErrorMessage={setErrorMessage}/>
      <TransactionTable transactions={transactions} errorMessage={errorMessage} openContextMenu={openContextMenu} />
      {errorMessage !== '' && <div className="error">{errorMessage}</div> }
      <TransactionOptionsBox 
        selectedTransaction={selectedTransaction} 
        handleEditTransaction={handleEditTransaction} 
        deleteTransaction={(transaction) => 
          deleteTransaction(transaction, setSelectedTransaction, setErrorMessage, closeContextMenu)} 
        closeContextMenu={closeContextMenu} 
      />
      {isEditDialogOpen && (
        <EditTransactionForm
          transaction={selectedTransaction}
          onClose={closeEditDialog}
          onSubmit={(updatedTransaction) => 
            submitEditedTransaction(updatedTransaction, setErrorMessage, closeEditDialog)}
        />
      )}
    </main>
);
}

export default App;
