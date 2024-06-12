import React from 'react';
import * as Mui from '@mui/material';
import '../styles/TransactionOptionsBox.css';

const TransactionOptionsBox = ({ selectedTransaction, handleEditTransaction, deleteTransaction, closeContextMenu }) => {
  return (
    <Mui.Dialog open={selectedTransaction !== null} onClose={closeContextMenu}>
      <Mui.DialogTitle className="dialog-title">Transaction Options</Mui.DialogTitle>
      <Mui.DialogContent>
        <Mui.DialogContentText className="dialog-content-text">
          Do you want to edit or delete the entry for "<strong>{selectedTransaction ? selectedTransaction.name : ''}</strong>"?
        </Mui.DialogContentText>
      </Mui.DialogContent>
      <Mui.DialogActions>
        <Mui.Button onClick={() => handleEditTransaction(selectedTransaction)} variant="outlined" className="dialog-button">
          Edit
        </Mui.Button>
        <Mui.Button onClick={() => deleteTransaction(selectedTransaction)} variant="outlined" className="dialog-button">
          Delete
        </Mui.Button>
        <Mui.Button onClick={closeContextMenu} variant="outlined" className="dialog-button">
          Close
        </Mui.Button>
      </Mui.DialogActions>
    </Mui.Dialog>
  );
};

export default TransactionOptionsBox;
