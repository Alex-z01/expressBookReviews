const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const secretKey = "the-secret-key";

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    let match = users.filter((user) => {return user.username === username});

    if (match.length > 0) {return false;}
    return true;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    let validUsers = users.filter((user) => {
        return (user.username === username && user.password === password)
    });

    if(validUsers.length > 0) { return true;}
    return false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.query.username;
    const password = req.query.password;

    if(!username || !password){
        return res.status(404).json({message: "Error logging in"});
    }

    if(authenticatedUser(username, password)){
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });

        req.session.authorization = {
            accessToken, username
        }

        return res.status(200).send(`${username} successfully logged in!`);
    } 
    else {
        return res.status(208).json({message: "Invalid login, Check username and password."})
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn/:review", (req, res) => {
  //Write your code here
    const isbn = req.params.isbn;
    const review = req.params.review;
    const user = req.session.authorization.username;

    const book = books[isbn];
    if(book)
    {
        book.reviews[user] = review;
    }


    return res.status(300).json({message: book});
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const user = req.session.authorization.username;

    const book = books[isbn];
    
    if(book)
    {
        book.reviews = {};
        return res.status(200).json({message: `Deleted ${user}'s review. ${JSON.stringify(book)}`});
    }
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
