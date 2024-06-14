import { DataGrid } from '@mui/x-data-grid';
import * as Mui from '@mui/material';
import '../styles/TransactionForm.css';

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


const TransactionTable = ({ transactions, errorMessage, openContextMenu }) => {
    if (transactions.length === 0 || errorMessage !== '') {
      return null;
    }
  
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
      },
      {
        field: 'categories',
        headerName: 'Categories',
        flex: 1,
        renderCell: (params) => (
            <div className='ReactTags__selected column-tag'>
                    {params.row.categories.map(cat => (                       
                        <span key={cat._id} className="ReactTags__tag tag-wrapper">
                            {cat.text}
                            {console.log(cat.text , params.row.name)}
                        </span>
                    ))}
            </div>
        ),
      },
    ];
  
    const rowsData = transactions.map((transaction) => ({
      id: transaction._id,
      name: transaction.name,
      description: transaction.description,
      datetime: transaction.datetime,
      price: transaction.price,
      categories: transaction.categories,
    }));

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
            const selectedRow = transactions.find(transaction => transaction._id === id[0]);
            openContextMenu(selectedRow);
          }}
        />
      </Mui.Paper>
      </div>
    );
  };

  export default TransactionTable;