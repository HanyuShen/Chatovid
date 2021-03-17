// --- IMPORTS
const express = require('express');
const path = require('path');

// --- CONSTANTS
const hostname = '127.0.0.1';
const port = 3000;

// --- APP
const app = express();

// -- let the server use code from modules
app.use('/assets', express.static(path.join(__dirname, 'html/assets')))

// -- INDEX
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'html/index.html'));
});

// -- LOGIN
app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, 'html/login.html'));
});

// -- SIGNUP
app.get("/signup", (req, res) => {
    res.sendFile(path.join(__dirname, 'html/sign-up.html'));
});

// --- SERVER
app.listen(port, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
