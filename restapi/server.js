// ************************ REQUIREMENTS, CONNECTING TO DATABASE AND CORS POLICY ******************************

const mysql = require("mysql");
const cors = require("cors");

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
