export async function getTransactions(user) {
  if(!user){
    throw new Error('Invalid user');
  }
    const url = process.env.REACT_APP_API_URL + 'transactions';
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${user.token}`
      }
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  }

export async function deleteTransaction(user, transaction, setSelectedTransaction, setErrorMessage, closeContextMenu, updateTransaction) {
  if(!user){
    throw new Error('Invalid user');
  }
    const url = `${process.env.REACT_APP_API_URL}transaction/${transaction._id}`;

    try {
        const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
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
    updateTransaction();
    setTimeout(() => {
        window.location.reload();
    }, 500);
}

export function submitEditedTransaction(user, updatedTransaction, setErrorMessage) {
  if(!user){
    throw new Error('Invalid user');
  }
    fetch(`${process.env.REACT_APP_API_URL}transaction/${updatedTransaction._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json',
      'Authorization': `Bearer ${user.token}`
     },
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
    })
    .catch(error => {
      console.error('Error updating transaction:', error);
      setErrorMessage('Failed to update transaction. Please try again later.');
    });
    setTimeout(() => {
      window.location.reload();
    }, 500);
  }
