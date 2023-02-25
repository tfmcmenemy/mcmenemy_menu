const express = require("express");
const app = express();
// const ejs = require("ejs");
const bodyParser = require("body-parser");
const path = require("path");
const { resourceLimits } = require("worker_threads");
const { response } = require("express");
// const { redirect } = require("express/lib/response");
require("dotenv").config();
const pgp = require("pg-promise")();

//Database
const db = pgp(process.env.DATABASE_URL);
// let result = db.oneOrNone(`SELECT * FROM meals`).then((meal) => {
//   console.log(meal["sides"][0]);
// });

const PORT = 3000;

//Static files
app.use("/css", express.static("css"));
app.use("/images", express.static("images"));
app.use("/javascript", express.static("javascript"));

//Setting up EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//Setup body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

///////////////////////////////////////////////
///////////////////////////////////////////////
///////////////////////////////////////////////
//ROUTES
///////////////////////////////////////////////
///////////////////////////////////////////////
///////////////////////////////////////////////
app.get("/", (req, res) => {
  res.redirect("/menu");
});

app.get("/menu", (req, res) => {
  let todaysDate = new Date();
  let today = `${todaysDate.getFullYear()}-${
    todaysDate.getMonth() + 1
  }-${todaysDate.getDate()}`;

  db.any("SELECT * FROM meals WHERE date >= $1", [today]).then((data) => {
    data.map((meal) => (meal.date = convertPostgresDateForEJS(meal.date)));
    console.log(data[1]);
    res.render("main", { data: data });
  });
});

app.post("/save", (req, res) => {
  const dataFromFrontEnd = [
    req.query.entree,
    req.query.mealID,
    req.query.tomHome,
    req.query.timehome,
    req.query.date,
    req.query.conflicts,
    req.query.notes,
    req.query.sides,
  ];

  let sqlEntry = "";

  if (req.query.newCard == "true") {
    sqlEntry =
      "INSERT INTO meals(date,tom_home,time_home,conflicts,entree,sides,notes) VALUES($5,$3,$4,$6,$1, $8,$7) RETURNING *";
    db.one(sqlEntry, dataFromFrontEnd)
      .then((data) => {
        console.log(`A new record has been entered into the database:`);
        console.table(data);
        res.json({ mealID: data.meal_id });
      })
      .catch((err) => console.log(`There has been an error: ${err}`));
  }

  if (req.query.newCard == "false") {
    sqlEntry =
      "UPDATE meals SET entree = $1, tom_home = $3, time_home = $4, date = $5, conflicts = $6, notes = $7, sides = $8 WHERE meal_id = $2 RETURNING *";
    db.one(sqlEntry, dataFromFrontEnd)
      .then((data) => {
        console.log(`A has been updated in the database:`);
        console.table(data);
        res.json({ mealID: data.meal_id });
      })
      .catch((err) => console.log(`There has been an error: ${err}`));
  }
});

app.listen(PORT, () => {
  console.log("Connected to server...");
});

const convertPostgresDateForEJS = function (enterDate) {
  newDate = new Date(enterDate);
  year = newDate.getFullYear();
  month =
    newDate.getMonth() >= 9
      ? newDate.getMonth() + 1
      : "0".concat(newDate.getMonth() + 1);
  date =
    newDate.getDate() >= 10 ? newDate.getDate() : "0".concat(newDate.getDate());

  return `${year}-${month}-${date}`;
};
