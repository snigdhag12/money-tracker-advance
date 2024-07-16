# MERN Money Tracker Advanced Project 🚀📊💰

Welcome to the advanced version of the MERN Money Tracker application! This project is a sophisticated clone of a MERN (MongoDB, Express.js, React.js, Node.js) Money Tracker app, allowing users to track their spending and earnings, view transactions, and calculate their balance in real-time.

[Link to basic version](https://github.com/snigdhag12/money-tracker)

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
- [Implementation Details](#implementation-details)
  - [Add Transaction](#add-transaction)
  - [Display Transactions](#display-transactions)
  - [Edit Transaction](#edit-transaction)
  - [Delete Transaction](#delete-transaction)
  - [Responsive Design](#responsive-design)
  - [Real-time Balance Calculation](#real-time-balance-calculation)
  - [Categorization and Filtering](#categorization-and-filtering)
  - [Sorting and Pagination](#sorting-and-pagination)
  - [Authorization](#authorization)
  - [Profiling](#profiling)
- [Upcoming Features](#upcoming-features)
    - [Accessibility and Localization](#accessibility-and-localization)
    - [Perfomance Testing](#performance-testing)
 

## Features ✨

- **Tag a Transaction**: Let users tag their transaction with labels.
- **Add Transaction**: Users can add new transactions with details such as name, price, datetime, description, and tags.
- **Display Transactions**: Transactions are displayed in a list format, showing name, description, price, datetime, and tags.
- **Real-time Balance Calculation**: The application calculates and displays the current balance in real-time based on all transactions.
- **Responsive Design**: The application is designed to be fully responsive and works well on various devices including phones.
- **Error Handling**: Enhanced error handling for adding transactions and fetching transaction data.
- **Categorization and Filtering**: Transactions can be tagged and filtered based on categories, with category-specific charts. (upcoming)
- **Sorting and Pagination**: Sort transactions by name, price, or datetime and paginate large sets of transactions.
- **CRUD Operations**: Full support for Create, Read, Update, and Delete operations on transactions.
- **Accessibility and Localization**: Improved accessibility features and support for multiple languages. (upcoming)

## Getting Started 🛠️

To run this project locally, follow these steps:

```bash
git clone <repository-url>
cd money-tracker-clone/src
npm install
npm start

//In terminal 2
cd money-tracker-clone/api
node ./index.js
```
Access the application:
Open your web browser and navigate to **http://localhost:3000** to view the application.

## Implementation Details ⚙️
### Add Transaction [POST]

Steps:

- Create a form in React to capture transaction details.
- On form submission, call the addTransaction function.

```javascript
app.post('/api/transaction', async (req, res, next) => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        const { name, price, description, datetime, categories } = req.body;

        const categoryDocs = await Promise.all(categories.map(async (cat) => {
            let category = await Category.findOne({ text: cat });
            if (!category) {
                category = await Category.create({ text: cat });
            }
            return category;
        }));

        const categoryIds = categoryDocs.map(category => category._id);
        const user_id = req.user._id;

        const transaction = await Transaction.create({
            name,
            price,
            description,
            datetime,
            categories: categoryIds,
            user_id 
        });

        res.json(transaction);
    } catch (error) {
        next(error); 
    }
});
```

![image](https://github.com/user-attachments/assets/f2d1cd2b-4dc6-4fd8-a8ef-997cdcb039e8)
Immediate Update:
![image](https://github.com/user-attachments/assets/782b9773-1c1a-40c4-b1a2-ea02b2076496)

### Display Transactions [GET]
Steps:

- Create a TransactionItem component.
- Map through the transactions array to render each TransactionItem.

```javascript
app.get('/api/transactions', async (req, res, next) => {
    try {
        const user_id = req.user._id;
        await mongoose.connect(process.env.MONGO_URL);
        const transactions = await Transaction.find({user_id}).populate('categories');
        res.json(transactions);
    } catch (error) {
        next(error); 
    }
});
```

### Edit Transactions [PUT/PATCH]
Steps:

- Create an edit form that pre-fills existing transaction details.
- On form submission, call the editTransaction function with the updated details.
- Update the state and balance in real-time.

```javascript
app.put('/api/transaction/:id', async (req, res, next) => {
    const { id } = req.params;
    const updatedTransactionData = req.body;
  
    try {
      await mongoose.connect(process.env.MONGO_URL);
      const updatedTransaction = await Transaction.findByIdAndUpdate(id, updatedTransactionData, { new: true });
  
      if (updatedTransaction) {
        res.json({ message: 'Transaction updated successfully', updatedTransaction });
      } else {
        res.status(404).json({ error: 'Transaction not found' });
      }
    } catch (error) {
      next(error);
    }
  });
```
**Note: :id is a route param here, check [link](https://github.com/snigdhag12/ExpressJS) to know more about express basics**
Select a Transaction > Select Edit
![image](https://github.com/user-attachments/assets/4c5d666a-3076-4305-af18-fbaace01d8c5)

![image](https://github.com/user-attachments/assets/81d0df7a-e82c-4d23-bf8c-92c50018fc32)

Sumbit post you do the changes.

### Delete Transaction
Steps:

- Add a delete option.
- On button click, call the deleteTransaction function with the transaction id.
- Update the state and balance in real-time.

```javascript
app.delete('/api/transaction/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
        await mongoose.connect(process.env.MONGO_URL);
        const result = await Transaction.findByIdAndDelete(id);
        if (result) {
            res.json({ message: 'Transaction deleted successfully' });
        } else {
            res.status(404).json({ error: 'Transaction not found' });
        }
    } catch (error) {
        next(error); 
    }
});
```
If you click delete option in above snippet the transaction is deleted from the DB.

### Real-time Balance Calculation
Do balance calculations in a seperate function which can be called anytime transaction update occurs.
```javascript

export function calculateBalance(transactions) {
    return transactions.reduce((acc, transaction) => {
      return acc + transaction.price;
    }, 0);
  }
```

TO DO: Analyse if using useEffect hook is the best implementation fot this, explore alternatives for better performance.

### Categorization 
Introducing React tag componenent to add category to each transaction. [Link](https://www.npmjs.com/package/react-tag-input)

### Sorting, Filtering and Pagination
You can either manually implement sorting by creating your own function and using [react-paginate](https://www.npmjs.com/package/react-paginate)
Explore Material UI Datagrid which makes all these functionalities easy to import: https://mui.com/x/react-data-grid/

![image](https://github.com/user-attachments/assets/8355c446-fe76-40fc-84fc-19e86552034c)


### Authorization and Profiling

Steps:

- Add Login and Signup Endpoints. 
- Use jsonwebtoken to create and verify JWTs.
- Create a middleware to authenticate requests using JWT.
- Protect routes by using the authentication middleware.
- Modify the transaction schema to include user_id and ensure transactions are associated with the correct user.
- Add user to the transaction schema and ensure only authorized user's transaction are displayed.
- Use session store/local store for maintaining user info.

```javascript
const requireAuth = async (req, res, next) => {
    //verify auth
    const { authorization } = req.headers;

    if(!authorization){
        return res.status(401).json({error: 'Auth required'});
    }

    const token = authorization.split(' ')[1];
    try{
        const {_id} = jwt.verify(token, process.env.SECRET)

        req.user = await User.findOne({_id}).select('_id');
        next();
    } catch(error){
        console.log(error)
        res.status(401).json({error: 'Request is not authorized'})
    }

}
```
![image](https://github.com/user-attachments/assets/d7f6c361-2778-42bb-964a-b9892a87aee0)
![image](https://github.com/user-attachments/assets/e4a23b81-55ba-411b-8024-3eec15854b33)

### Responsive Design
Steps:

- Use media queries to adjust the layout based on the viewport size.
- Ensure the application is fully responsive, providing a seamless experience on mobile, tablet, and desktop devices.
- Test the application on various devices and screen sizes to ensure responsiveness.

- Example css
```css
/* General styles */
.transaction-list {
  display: flex;
  flex-direction: column;
  padding: 10px;
}

/* Media query for tablets and larger screens */
@media (min-width: 768px) {
  .transaction-list {
    flex-direction: row;
    flex-wrap: wrap;
  }
  .transaction-item {
    flex: 1 0 48%; /* 2 items per row */
    margin: 1%;
  }
}

/* Media query for desktops and larger screens */
@media (min-width: 1024px) {
  .transaction-item {
    flex: 1 0 31%; /* 3 items per row */
    margin: 1%;
  }
}
```
![image](https://github.com/user-attachments/assets/4cc44849-970a-4704-8d8c-acd1c4cf6028)
![image](https://github.com/user-attachments/assets/98d8384f-cb26-41f8-a7eb-834745d7f99a)
![image](https://github.com/user-attachments/assets/3e20c690-49e2-4848-9d23-4450e0b698c9)




## Upcoming Features 🔮
This advanced project sets the foundation for further enhancements. Planned features include:

- Filtering based on tags and tag based dashboards for more interactive expense handling.
- Localization and accessibility improvements.
- Security enhancements and profiling.
- Performance Tools and Testing

### Accessibility and Localization
#### Accessibility
Accessibility (a11y) in web development ensures that websites and applications are usable by people with disabilities. It involves adhering to guidelines and standards set forth by the World Wide Web Consortium (W3C) to create inclusive experiences for all users.

**Tools and Frameworks for Accessibility:**

##### Web Content Accessibility Guidelines (WCAG):

WCAG provides a set of guidelines for making web content accessible. It covers areas such as text alternatives, keyboard accessibility, color contrast, and more.
Framework: Understanding and implementing WCAG guidelines directly in your HTML, CSS, and JavaScript.

##### Screen Readers:

Tools like VoiceOver (Mac), JAWS (Windows), and NVDA (Windows) simulate how visually impaired users navigate and interact with your site.
Framework: Ensure your site's content and navigation are understandable and navigable via screen readers.
##### Accessibility Auditing Tools:

Tools like Axe, Lighthouse (part of Google Chrome Developer Tools), and Wave evaluate your website for accessibility issues and provide actionable insights.
Framework: Integrate these tools into your development process to identify and fix accessibility issues early.

#### Localization
Localization involves adapting a product or content to a specific locale or language. It goes beyond translation to include cultural nuances and regional preferences.

**Tools and Frameworks for Localization:**

##### React-Intl:

A library for React applications that provides React components and an API to format dates, numbers, and strings, including translations.
Framework: Use React-Intl to manage messages and language switching in your React application.
##### i18next:

A JavaScript internationalization framework that provides a complete solution for translation management, including loading translations asynchronously.
Framework: Integrate i18next with your Node.js backend and React frontend for seamless translation management.
##### POEditor:

A localization management platform that helps manage localization files, collaborate with translators, and integrate translations into your application.
Framework: Use POEditor to streamline the localization process and manage translations efficiently.

#### Performance Testing

**Tools for Performance Testing:**

##### Lighthouse:

Lighthouse is an open-source tool developed by Google that audits the performance, accessibility, SEO, and best practices of web pages.
How It Works:
Run Lighthouse directly in Google Chrome's DevTools or as a Node module.
It generates a report with actionable suggestions for improving page load performance, including metrics like First Contentful Paint (FCP), Largest Contentful Paint (LCP), and Cumulative Layout Shift (CLS).

##### WebPageTest:

WebPageTest is an online tool that provides detailed insights into your website's performance from multiple locations and browsers.
How It Works:
Run tests from various locations and devices to simulate real-world conditions.
Provides metrics on load time, time to first byte (TTFB), and waterfall charts for resource loading analysis.

##### Google PageSpeed Insights:

PageSpeed Insights analyzes the content of a web page and generates suggestions to make it faster.
How It Works:
Enter a URL to run the analysis.
Provides both lab and field data (real-world performance data) along with opportunities and diagnostics for improvement.

Performance testing ensures that your application loads quickly and performs well under various conditions, contributing to a better user experience and improved SEO rankings.

This advanced Money Tracker application provides a robust foundation with comprehensive features, ensuring a seamless user experience across devices and accessibility needs. Stay tuned for further updates and enhancements! 🚀
