const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
const username = req.body.username;
    const password = req.body.password;
    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!doesExist(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
    try {
        const response = await axios.get('https://jubitpincy-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/');
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ message: "Error fetching the list of books", error: error.message });
    }
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;

    axios.get(`http://localhost:5000/books/isbn/${isbn}`)
    .then(response => {
        res.status(200).json(response.data);
    })
    .catch(error => {
        res.status(404).json({ message: `Book with ISBN: ${isbn} not found` });
    });
});
  
// Get book details based on author
public_users.get('/async-author/:author', async function (req, res) {
    const author = req.params.author;

    try {
        const response = await axios.get(`http://localhost:5000/books/author/${author}`);
        res.status(200).json(response.data);
    } catch (error) {
        res.status(404).json({ message: `Books by author: ${author} not found` });
    }
});

// Get all books based on title
public_users.get('/async-title/:title', async function (req, res) {
    const title = req.params.title;

    try {
        const response = await axios.get(`http://localhost:5000/books/title/${title}`);
        res.status(200).json(response.data);
    } catch (error) {
        res.status(404).json({ message: `Books with title: ${title} not found` });
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
