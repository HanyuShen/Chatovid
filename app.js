// --- IMPORTS
const express = require('express');
const express_session = require('express-session');
const path = require('path');
const mysql = require('mysql');
const body_parser = require('body-parser');
const bcrypt = require('bcryptjs');

// --- CONSTANTS
// -- hostname
const hostname = '127.0.0.1';
const port = 3000;

const email_pattern = new RegExp("[a-z0-9._%+-]+@student.manchester.ac.uk$");

// -- mysql
var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'chatovid',
	password : 'super_secret_password',
	database : 'chatovid'
});

// -- bcrypt
const bcrypt_salt_rounds = 10;

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
        connection.query('SELECT * FROM accounts WHERE username = ?', [username], 
            function(error, results, fields) {
                if (error) throw error;
                if (results.length > 0) {
                    hash = results[0].password;
                    bcrypt.compare(password, hash, function(err, result) {
                        if (err) throw err;

                        if (result) {
                            req.session.loggedin = true;
                            req.session.username = username;
                            res.redirect('/home');

                        } else {
                            res.send('Incorrect Username and/or Password!');
                        }			
                    });
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

app.post('/create_account', function(req, res) {
    var username = req.body.username.trim();
    var password = req.body.password.trim();
    var email = req.body.email.trim();

    // make sure all entries are present
    if (!(email && username && password)) {
        res.send('Please fill all fields!');
        res.end();
        return;
    }

    // check if the email is a valid UoM email
    if (!email_pattern.test(email)) {
        res.send('You need to provide a valid UoM student email.');
        res.end();
        return;
    }

    // check if the username exists in the database
    connection.query('SELECT * FROM accounts WHERE username = ? OR email = ?', [username, email], 
        function(error, results, fields) {
            if (error) throw error;
            if (results.length > 0) {
                res.send('This user already exists, or the email was already used!');
                res.end();
            } else { 
                // add a new user to the database
                // @TODO: add password hashing

                bcrypt.genSalt(bcrypt_salt_rounds, (err, salt) => {
                    bcrypt.hash(password, salt, (err, hash) => {
                        if(err) throw err;

                        connection.query('INSERT INTO `accounts` (`username`, `password`, `email`) VALUES (?, ?, ?);', [username, hash, email], 
                            function(error, results, fields) {
                                if (error) throw error;
                                if (results.length > 0) {
                                    req.session.loggedin = true;
                                    req.session.username = username;
                                }			

                                res.redirect('/login');
                                res.end();
                            });
                        // Set the hashed password and save the model
                    });
                 });
            }
        });

});

// -- FEEDBACK
app.get("/feedback", (req, res) => {
    res.sendFile(path.join(__dirname, 'html/feedback.html'));
});

// -- HOME
app.get("/home", (req, res) => {
    res.sendFile(path.join(__dirname, 'html/menu.html'));
});

// -- CHAT
app.get("/chat", (req, res) => {
    res.sendFile(path.join(__dirname, 'html/chatroom.html'));
});

// --- SERVER
app.listen(port, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
