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
  user: "",
  password: "",
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

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", true);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header(
    "Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS"
  );
  next();
});

// **************************** ENDPOINTS *****************************

// GET JOURNEYS WITH SEARCH AND PAGINATION
app.get("/journeys/search", (req, res) => {
  const { _page, _limit, _sort, _order, name_like } = req.query;
  const startIndex = (_page - 1) * _limit;

  // Fetch the journeys from the database with pagination
  const query = `SELECT * FROM journey WHERE departure_station_name LIKE '%${name_like}%' ORDER BY ${_sort} ${_order} LIMIT ${startIndex}, ${_limit}`;

  conn.query(query, (err, results) => {
    if (err) {
      res
        .status(500)
        .json({ error: "Failed to fetch journeys from the database" });
    } else {
      // Fetch the total count of journeys
      conn.query(
        "SELECT COUNT(*) AS totalCount FROM journey",
        (err, totalCount) => {
          if (err) {
            res
              .status(500)
              .json({ error: "Failed to fetch the total count of journeys" });
          } else {
            res.setHeader("X-Total-Count", totalCount[0].totalCount);
            res.status(200).json(results);
          }
        }
      );
    }
  });
});

// ADD JOURNEY
app.post("/journey/add", (req, res) => {
  const {
    formattedDepartureDate,
    formattedReturnDate,
    departureStationId,
    departureStation,
    returnStationId,
    returnStation,
    distance,
    duration,
  } = req.body;

  if (
    !formattedDepartureDate ||
    !formattedReturnDate ||
    !departureStationId ||
    !departureStation ||
    !returnStation ||
    !returnStationId ||
    !distance ||
    !duration
  ) {
    return res
      .status(400)
      .json({ error: true, message: "Missing required fields" });
  }

  conn.query(
    "INSERT INTO journey (departure_date, return_date, departure_station_id, departure_station_name, return_station_id, return_station_name, distance, duration) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [
      formattedDepartureDate,
      formattedReturnDate,
      departureStationId,
      departureStation,
      returnStationId,
      returnStation,
      distance,
      duration,
    ],
    (error, results, fields) => {
      if (error) {
        return res
          .status(500)
          .json({ error: true, message: "Failed to add journey" });
      } else {
        return res
          .status(201)
          .json({ success: true, message: "Journey added successfully" });
      }
    }
  );
});

// GET ALL STATIONS
app.get("/stations", (req, res) => {
  conn.query("SELECT * FROM station", (err, results) => {
    if (err) {
      res
        .status(500)
        .json({ error: "Failed to fetch stations from the database" });
    } else {
      res.status(200).json(results);
    }
  });
});

// GET STATIONS WITH SEARCH AND PAGINATION
app.get("/stations/search", (req, res) => {
  const { _page, _limit, address_like } = req.query;
  const startIndex = (_page - 1) * _limit;

  // Fetch the journeys from the database with pagination
  const query = `SELECT * FROM station WHERE osoite LIKE '%${address_like}%' LIMIT ${startIndex}, ${_limit}`;

  conn.query(query, (err, results) => {
    if (err) {
      res
        .status(500)
        .json({ error: "Failed to fetch stations from the database" });
    } else {
      // Fetch the total count of journeys
      conn.query(
        "SELECT COUNT(*) AS totalCount FROM station",
        (err, totalCount) => {
          if (err) {
            res
              .status(500)
              .json({ error: "Failed to fetch the total count of stations" });
          } else {
            res.setHeader("X-Total-Count", totalCount[0].totalCount);
            res.status(200).json(results);
          }
        }
      );
    }
  });
});

// SINGLE STATION VIEW
app.get("/station/:id", (req, res) => {
  const id = req.params.id;

  // Perform the database queries
  const stationQuery = `SELECT * FROM station WHERE stationid = ${id}`;
  const totalStartQuery = `SELECT COUNT(*) AS totalStart FROM journey WHERE departure_station_id = ${id}`;
  const totalEndQuery = `SELECT COUNT(*) AS totalEnd FROM journey WHERE return_station_id = ${id}`;
  const averageStartDistanceQuery = `SELECT AVG(distance) AS averageStartDistance FROM journey WHERE departure_station_id = ${id}`;
  const averageEndDistanceQuery = `SELECT AVG(distance) AS averageEndDistance FROM journey WHERE return_station_id = ${id}`;

  // Fetch station details
  conn.query(stationQuery, (err, stationRows) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: "An error occurred" });
    } else {
      if (stationRows.length === 0) {
        res.status(404).json({ error: "Station not found" });
      } else {
        const station = stationRows[0];

        // Fetch total number of journeys starting from the station
        conn.query(totalStartQuery, (err, totalStartRows) => {
          if (err) {
            console.log(err);
            res.status(500).json({ error: "An error occurred" });
          } else {
            const totalStart = totalStartRows[0].totalStart;

            // Fetch total number of journeys ending at the station
            conn.query(totalEndQuery, (err, totalEndRows) => {
              if (err) {
                console.log(err);
                res.status(500).json({ error: "An error occurred" });
              } else {
                const totalEnd = totalEndRows[0].totalEnd;

                // Fetch average distance of journeys starting from the station
                conn.query(
                  averageStartDistanceQuery,
                  (err, averageStartDistanceRows) => {
                    if (err) {
                      console.log(err);
                      res.status(500).json({ error: "An error occurred" });
                    } else {
                      const averageStartDistance =
                        averageStartDistanceRows[0].averageStartDistance;

                      // Fetch average distance of journeys ending to the station
                      conn.query(
                        averageEndDistanceQuery,
                        (err, averageEndDistanceRows) => {
                          if (err) {
                            console.log(err);
                            res
                              .status(500)
                              .json({ error: "An error occurred" });
                          } else {
                            const averageEndDistance =
                              averageEndDistanceRows[0].averageEndDistance;
                            // Combine the data and send the response
                            const responseData = {
                              station,
                              totalStart,
                              totalEnd,
                              averageStartDistance,
                              averageEndDistance,
                            };
                            res.json(responseData);
                          }
                        }
                      );
                    }
                  }
                );
              }
            });
          }
        });
      }
    }
  });
});

module.exports = app;
