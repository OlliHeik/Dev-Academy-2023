// ************************ REQUIREMENTS, CONNECTING TO DATABASE AND CORS POLICY ******************************

const mysql = require("mysql");
const cors = require("cors");
const express = require("express");

var app = express();
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true }));

app.listen(3004, () => console.log("Serveri valmiina portissa 3004"));

const conn = mysql.createConnection({
    host: "localhost",
    user: "sqluser",
    password: "password",
    database: "CityBikeApp",
    multipleStatements: true,
});  

conn.connect((err) => {
    if (err) {
      console.log("Virhe tietokantayhteydessä");
      return;
    }
    console.log("Yhteys muodostettu");
});

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS');
    next();
});

// **************************** ENDPOINTS *****************************


// GET ALL JOURNEYS, LIMIT TO 100 ROWS
app.get("/journeys", (req, res) => {
    conn.query("SELECT * FROM journey LIMIT 100", (err, rows) => {
      if (err) throw err;
      return res.status(200).json(rows);
    });
});

// GET ALL STATIONS, LIMIT TO 50 ROWS
app.get("/stations", (req, res) => {
  conn.query("SELECT * FROM station LIMIT 25", (err, rows) => {
    if (err) throw err;
    return res.status(200).json(rows);
  });
});