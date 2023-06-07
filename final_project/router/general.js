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
  return res.status(300).json({message: books});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    //Write your code here
    const isbn = req.params.isbn;

    // Access the book with the specified ISBN from your 'books' object
    const book = books[isbn];

    // Check if the book exists
    if (book) {
        res.json(book); // Send the book as JSON response
    } else {
        res.status(404).json({ error: 'Book not found' });
    }
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    //Write your code here
    const author = req.params.author;

    console.log(author);

    const book = Object.values(books).filter(book => book.author === author);

    // Check if the book exists
    if (book) {
        res.json(book); // Send the book as JSON response
    } else {
        res.status(404).json({ error: 'Book not found' });
    }
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
    //Write your code here
    const isbn = req.params.isbn;

    // Access the book with the specified ISBN from your 'books' object
    const book = books[isbn];
    const reviews = book.reviews;

    // Check if the book exists
    if (book) {
        res.json(reviews); // Send the book as JSON response
    } else {
        res.status(404).json({ error: 'Book not found' });
    }
});

module.exports.general = public_users;
