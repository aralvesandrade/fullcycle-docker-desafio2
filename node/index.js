const express = require("express");
const mysql = require("mysql");
const { fakerPT_BR: faker } = require("@faker-js/faker");
require("dotenv").config();

const app = express();

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE,
};

function createConnection() {
  return mysql.createConnection(dbConfig);
}

function insertName(fullName) {
  return new Promise((resolve, reject) => {
    const db = createConnection();
    const sql = "INSERT INTO people (name) VALUES (?)";
    db.query(sql, fullName, (err, result) => {
      db.end();
      if (err) reject(err);
      console.log(`Person '${fullName}' inserted! Id: ${result.insertId}`);
      resolve(result);
    });
  });
}

function getAllNames() {
  return new Promise((resolve, reject) => {
    const db = createConnection();
    const sql = "SELECT * FROM people";
    db.query(sql, (err, result) => {
      db.end();
      if (err) reject(err);
      resolve(result);
    });
  });
}

app.get("/", async function (req, res) {
  try {
    const fullName = faker.person.fullName();
    await insertName(fullName);
    const result = await getAllNames();
    let names = "<ul>";
    result.forEach((row) => {
      names += `<li>${row.name}</li>`;
    });
    names += "</ul>";
    const html = `<h1>Full Cycle Rocks!</h1>${names}`;
    res.send(html);
  } catch (err) {
    throw err;
  }
});

const port = 3000;

app.listen(port, function () {
  console.log(`Listening on port ${port}!`);
});
