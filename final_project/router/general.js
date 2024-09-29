const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const {username, password} = req.body;
  if (users[username]) {
        return res.status(400).send({ message: "Username already exists." });
    }
  if(username == null || password == null){
    res.send("Username and password required.");
  }
  else {
    users[username] = {
        "username" : req.body.username,
        "password": req.body.password
    };
    res.send("The user with username" + (' ') + (username) + " has been added.")
}
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const requestedauthor = req.params.author;
  let matchingbooks = [];
  for (let isbn in books){
    const book = books[isbn];
    if (book.author === requestedauthor){
        matchingbooks.push(book);
    }
  }
   if (matchingbooks.length > 0) {
    // If books are found, send them as the response
    res.status(200).send(matchingbooks);
  } else {
    // If no books are found, send a '404 Not Found' response
    res.status(404).send({ message: `No books found for author: ${requestedauthor}` });
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
const requestedtitle = req.params.title;
  let matchingbooks = [];
  for (let isbn in books){
    const book = books[isbn];
    if (book.title === requestedtitle){
        matchingbooks.push(book);
    }
  }
   if (matchingbooks.length > 0) {
    // If books are found, send them as the response
    res.status(200).send(matchingbooks);
  } else {
    // If no books are found, send a '404 Not Found' response
    res.status(404).send({ message: `No books found for title: ${requestedtitle}` });
  }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const requestedIsbn = req.params.isbn; 
    let matchingReviews = null; 
    for (let isbn in books) {
        if (isbn === requestedIsbn) { 
            matchingReviews = books[isbn].reviews; 
            break; 
        }
    }
    if (matchingReviews && Object.keys(matchingReviews).length > 0) {
        res.status(200).send(matchingReviews);
    } else {
        res.status(404).send({ message: `No reviews found for ISBN: ${requestedIsbn}` });
    }
});

module.exports.general = public_users;
