const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
    const user = req.query.username;
    const pass = req.query.password;

    if (user && pass)
    {
        // If the username is valid, add user object to users list
        if(isValid(user)) {
            users.push({"username": user, "password": pass});
            return res.status(200).json({message: `${user} has been registered!`});
        }
        else{
            return res.status(404).json({messgae: "User unavailable"});
        }
    }
    return res.status(404).json({message: "Invalid details"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  const sendResponse = (data) => {
    return new Promise((resolve) => {
      res.status(200).json(data);
      resolve();
    });
  };

  sendResponse({ books })
    .then(() => {
      // Handle any additional logic after sending the response
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while processing the request.' });
    });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;

  // Wrap the book lookup logic in a promise
  const findBookByISBN = new Promise((resolve, reject) => {
    // Access the book with the specified ISBN from your 'books' object
    const book = books[isbn];

    // Check if the book exists
    if (book) {
      resolve(book);
    } else {
      reject(new Error('Book not found'));
    }
  });

  findBookByISBN
    .then((book) => {
      res.json(book); // Send the book as JSON response
    })
    .catch((error) => {
      console.error(error);
      res.status(404).json({ error: 'Book not found' });
    });
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;

    // Wrap the book filtering logic in a promise
    const findBooksByAuthor = new Promise((resolve, reject) => {
    const filteredBooks = Object.values(books).filter(book => book.author === author);

    // Check if any books are found
    if (filteredBooks.length > 0) {
        resolve(filteredBooks);
    } else {
        reject(new Error('No books found for the author'));
    }
    });

    findBooksByAuthor
    .then((filteredBooks) => {
        res.json(filteredBooks); // Send the filtered books as JSON response
    })
    .catch((error) => {
        console.error(error);
        res.status(404).json({ error: 'No books found for the author' });
    });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    //Write your code here
    const title = req.params.title;

    console.log(title);

    const book = Object.values(books).filter(book => book.title === title);

    // Check if the book exists
    if (book) {
        res.json(book); // Send the book as JSON response
    } else {
        res.status(404).json({ error: 'Book not found' });
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;

    // Wrap the book filtering logic in a promise
    const findBooksByISBN = new Promise((resolve, reject) => {
      const filteredBooks = Object.keys(books).filter(key => key === isbn);
  
      // Check if any books are found
      if (filteredBooks.length > 0) {
        resolve(filteredBooks);
      } else {
        reject(new Error('No books found with the given ISBN'));
      }
    });
  
    findBooksByISBN
      .then((filteredBooks) => {
        res.json(books[filteredBooks]); // Send the filtered books as JSON response
      })
      .catch((error) => {
        console.error(error);
        res.status(404).json({ error: 'No books found with the given ISBN' });
      });
});

module.exports.general = public_users;
