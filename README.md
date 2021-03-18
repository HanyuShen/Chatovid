# Chatovid

## Installing
Install node.js LTS ([LINK](https://nodejs.org/en/download/)).
Run `npm i` in the root project directory. This will fetch all modules into node_modules/. (I haven't included them in the repo because they weight like 150MB)

### Database
(this barely works right now)

You need to have a MySQL server installed. Right now the app expects the username `root` and password `test`. You'll need to run `mysql -uroot -ptest` to log into the server and then `source setup.sql`. This will create the database `chatovid` with a table called `accounts`.

## Running
Run `node app.js` to start the server.

The app can accessed at `localhost:3000`
