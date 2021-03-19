// --- IMPORTS
const express = require('express');
const express_session = require('express-session');
const path = require('path');
const mysql = require('mysql');
const body_parser = require('body-parser');

// --- CONSTANTS
// -- hostname
const hostname = '127.0.0.1';
const port = 3000;

// -- mysql
var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'chatovid',
	password : 'super_secret_password',
	database : 'chatovid'
});

// --- APP
const app = express();

app.use(express_session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.use(body_parser.urlencoded({extended: true}));
app.use(body_parser.json());

// -- serve html/assets under /assets
app.use('/assets', express.static(path.join(__dirname, 'html/assets')))

// -- INDEX (MAIN PAGE)
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'html/index.html'));
});

// -- LOGIN AND AUTH
app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, 'html/login.html'));
});

app.post('/auth', function(req, res) {
    var username = req.body.username;
    var password = req.body.password;

    if (username && password) {
        // ?TODO: Introduce error checking here, if the query fails the whole server goes down
        connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], 
            function(error, results, fields) {
                if (error) throw error;
                if (results.length > 0) {
                    req.session.loggedin = true;
                    req.session.username = username;
                    res.redirect('/home');
                } else {
                    res.send('Incorrect Username and/or Password!');
                }			

                res.end();
            });
    } else {
            res.send('Please enter Username and Password!');
            res.end();
    }
});

// -- SIGNUP
app.get("/signup", (req, res) => {
    res.sendFile(path.join(__dirname, 'html/sign-up.html'));
});

// -- FEEDBACK
app.get("/feedback", (req, res) => {
    res.sendFile(path.join(__dirname, 'html/feedback.html'));
});

// -- CHAT
app.get("/chat", (req, res) => {
    res.sendFile(path.join(__dirname, 'html/chatroom.html'));
});

// --- SERVER
app.listen(port, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
