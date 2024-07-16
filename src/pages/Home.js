import EditTransactionForm from '../components/EditTransactionForm'; 
import TransactionForm from '../components/TransactionForm';
import TransactionTable from '../components/TransactionTable';
import TransactionOptionsBox from '../components/TransactionOptionsBox';
import { getTransactions, deleteTransaction, submitEditedTransaction } from '../crudUtilities';
import { calculateBalance } from '../miscUtilities';
import { useState, useEffect } from 'react'
import '../App.css';
import { useAuthContext } from '../hooks/useAuthContext'

const Home = () => { 
    const [transactions, setTransactions] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [balance, setBalance] = useState("0");
    const [fraction, setFraction] = useState("00");
    const { user } = useAuthContext(); 

    useEffect(() => {
        if(!user){
            setErrorMessage('Invalid user.');
            setBalance("0");
            setFraction("00");
            return
        }
        getTransactions(user)
          .then(transactions => {
            setTransactions(transactions);
            const calculatedBalance = calculateBalance(transactions).toFixed(2); 
            setBalance(calculatedBalance);
            const fractionalPart = getFractionalPart(calculatedBalance);
            console.log(fractionalPart + 'fraction');
            setFraction(fractionalPart?fractionalPart.toString().split('.')[1] : '00');
          })
          .catch(error => {
            console.error('Error fetching transactions:', error.message);
            setErrorMessage('Failed to fetch transactions. Please try again later.');
          });
      }, []);
    
      function openContextMenu(transaction) {
        setSelectedTransaction(transaction);
      }

      function getFractionalPart(number) {
        const str = number.toString();
        const parts = str.split('.');
        return parts.length > 1 ? parseFloat('0.' + parts[1]) : 0;
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
              deleteTransaction(user, transaction, setSelectedTransaction, setErrorMessage, closeContextMenu)} 
            closeContextMenu={closeContextMenu} 
          />
          {isEditDialogOpen && (
            <EditTransactionForm
              transaction={selectedTransaction}
              onClose={closeEditDialog}
              onSubmit={(updatedTransaction) => 
                submitEditedTransaction(user, updatedTransaction, setErrorMessage, closeEditDialog)}
            />
          )}
        </main>
    );
}
export default Home