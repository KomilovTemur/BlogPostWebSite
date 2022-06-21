import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import sqlite3 from "sqlite3";
sqlite3.verbose();
const app = express();
const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(bodyParser.json());
const PORT = 3000;
app.use(cors());
app.set("view engine", "ejs");

var db = new sqlite3.Database("db/database.db");

app.get("/", (req, res) => {
  db.all("select * from blogs order by id DESC", (err, rows) => {
    res.render("index", { data: rows });
  });
});

app.get("/addNewPost", (req, res) => {
  res.render("add");
});

app.post("/addNewPost", urlencodedParser, (req, res) => {
  db.run(
    `insert into blogs (title, description, date) values ("${req.body.title}", "${req.body.description}", "${req.body.date}")`
  );
  res.redirect("/");
});

app.get("/delete/:deleteId", jsonParser, (req, res) => {
  db.run(`delete from blogs where id = ${req.params.deleteId}`);
  res.redirect("/");
});

app.get("/edit/:edit", (req, res) => {
  db.all(
    `select id, title, description from blogs where id = ${req.params.edit}`,
    (err, rows) => {
      res.render("edit", { data: rows });
    }
  );
});

app.post("/editPost", urlencodedParser, (req, res) => {
  db.run(
    `update blogs set title = "${req.body.title}", description = "${req.body.description}" where id = ${req.body.id}`
  );
  res.redirect("/");
});

app.listen(PORT);
