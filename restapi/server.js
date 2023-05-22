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


// GET JOURNEYS
app.get("/journeys", (req, res) => {
  const { _page, _limit } = req.query;
  const startIndex = (_page - 1) * _limit;
  
  // Fetch the journeys from the database with pagination
  const query = `SELECT * FROM journey LIMIT ${startIndex}, ${_limit}`;

  conn.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ error: "Failed to fetch journeys from the database" });
    } else {
      // Fetch the total count of journeys
      conn.query("SELECT COUNT(*) AS totalCount FROM journey", (err, totalCount) => {
        if (err) {
          res.status(500).json({ error: "Failed to fetch the total count of journeys" });
        } else {
          res.setHeader("X-Total-Count", totalCount[0].totalCount);
          res.status(200).json(results);
        }
      });
    }
  });
});

// GET STATIONS
app.get("/stations", (req, res) => {
  const { _page, _limit } = req.query;
  const startIndex = (_page - 1) * _limit;
  
  // Fetch the journeys from the database with pagination
  const query = `SELECT * FROM station LIMIT ${startIndex}, ${_limit}`;

  conn.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ error: "Failed to fetch stations from the database" });
    } else {
      // Fetch the total count of journeys
      conn.query("SELECT COUNT(*) AS totalCount FROM station", (err, totalCount) => {
        if (err) {
          res.status(500).json({ error: "Failed to fetch the total count of stations" });
        } else {
          res.setHeader("X-Total-Count", totalCount[0].totalCount);
          res.status(200).json(results);
        }
      });
    }
  });
});