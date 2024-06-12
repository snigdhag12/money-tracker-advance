export function calculateBalance(transactions) {
    return transactions.reduce((acc, transaction) => {
      return acc + transaction.price;
    }, 0);
  }