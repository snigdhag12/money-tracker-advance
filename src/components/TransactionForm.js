import React, { useEffect , useState } from 'react';
import { WithContext as ReactTags } from 'react-tag-input';
import '../styles/TransactionForm.css';

const TransactionForm = ({ setErrorMessage }) => {
  const [name, setName] = useState('');
  const [datetime, setDatetime] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [categories, setCategories] = useState([]); 
  const [selectedCategories, setSelectedCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      const response = await fetch(process.env.REACT_APP_API_URL + 'categories');
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      
      const data = await response.json();
      //console.log(data);
      setCategories(data.map(category => ({ id: category._id, text: category.text })));
    } catch (error) {
      console.error('Error fetching categories:', error.message);
      setErrorMessage('Failed to fetch categories. Please try again later.');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  function addNewTransaction(ev){
    console.log(selectedCategories, "catergories array");
    ev.preventDefault();
    
    const temp =  selectedCategories.map(category => category.text);
    console.log(temp);

    const url = process.env.REACT_APP_API_URL + 'transaction';

    fetch(url, {
      method: 'POST',
      headers: {'Content-type': 'application/json'},
      body: JSON.stringify({
        name: name, 
        price,
        description, 
        datetime,
        categories: selectedCategories.map(category => category.text) })
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
      setSelectedCategories([]);

      setTimeout(() => {
        window.location.reload();
      }, 500);

    }).catch(error => {
      console.error('Error adding transaction:', error.message);
      setErrorMessage('Failed to add transaction. Please try again later.');
    });
  }

  const handleDelete = (i) => {
    const updatedCategories = selectedCategories.slice(0, i).concat(selectedCategories.slice(i + 1));
    setSelectedCategories(updatedCategories);
  };

  const handleAddition = (category) => {
    setSelectedCategories([...selectedCategories, category]);
  };

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
        <ReactTags
          tags={selectedCategories}
          suggestions={categories}
          handleDelete={handleDelete}
          handleAddition={handleAddition}
          allowNew
          placeholder="Press Enter to Add category"
          editable
          maxTags={4}
          inputFieldPosition="top"
        />
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
