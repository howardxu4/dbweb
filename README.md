DBWeb
=====

The SQL database web browser written by Nodejs, Bootstrap, Mysql, Sqlite3

Pre-required
-----------
* Install MySQL   https://dev.mysql.com/doc/refman/8.0/en/installing.html
* Install Nodejs  https://nodejs.org/en/download/

Download
-------
* On your machine run: git clone https://github.com/howardxu4/dbweb.git 
* cd to dbweb directory

Config
-----
* refer db/README.md to download sample database
* msql.conf -- MySQL database config (adjust host, user, password, database)
* sql3.conf -- SQLite3 database config (assign the path of database file) 

Setup
-----
* npm install
* npm start
* open localhost:3000 on your web browser
* npm stop

Usage
-----
* provide an web browser UI for accessing MySQL or SQLite database
* access your database table schema
* show the content of your table on a flexible way
* simple Create, Update, Read, Delete the row data in the table
* build the SQL statement to query and manipulate your database

Dependency
----------
* npm -- https://www.w3schools.com/nodejs/nodejs_npm.asp
* bootstrap -- https://getbootstrap.com/
* mysql -- https://www.npmjs.com/package/mysql
* sqlite3 -- https://www.npmjs.com/package/sqlite3

