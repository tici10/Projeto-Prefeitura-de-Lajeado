const express = require("express")
const app = express()
const mysql = require("mysql")
const bcrypt = require("bcrypt")

require("dotenv").config()


const DB_HOST = process.env.DB_HOST
const DB_USER = process.env.DB_USER
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_DATABASE = process.env.DB_DATABASE
const DB_PORT = process.env.DB_PORT
console.log(process.env.DB_DATABASE);

const db = mysql.createPool({
  connectionLimit: 100,
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  port: DB_PORT
})

app.use(express.json())
app.post("/createUser", async (req, res) => {
  const { name, cpf, email, phone_number, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  db.getConnection(async (err, connection) => {
    if (err) throw err;

    const sqlSearch = "SELECT * FROM users WHERE full_name = ? OR cpf = ? OR email = ?";
    const search_query = mysql.format(sqlSearch, [name, cpf, email]);

    await connection.query(search_query, async (err, result) => {
      if (err) throw err;
      console.log("----> Search Results");
      console.log(result.length);

      if (result.length != 0) {
        connection.release();
        console.log("----> User already exists");
        res.sendStatus(409);
      } else {
        const sqlInsert = "INSERT INTO users (full_name, cpf, email, phone_number, password) VALUES (?, ?, ?, ?, ?)";
        const insert_query = mysql.format(sqlInsert, [name, cpf, email, phone_number, hashedPassword]);

        await connection.query(insert_query, (err, result) => {
          connection.release();
          if (err) throw err;
          console.log("----> Created new User");
          console.log(result.insertId);
          res.sendStatus(201);
        });
      }
    });
  });
});


const port = process.env.PORT

app.listen(port,
  ()=> console.log(`Server Started on port ${port}...`)
)