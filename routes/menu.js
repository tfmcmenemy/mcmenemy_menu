const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  let todaysDate = new Date();
  todaysDate.setHours(todaysDate.getHours() - 4);
  let today = `${todaysDate.getFullYear()}-${
    todaysDate.getMonth() + 1
  }-${todaysDate.getDate()}`;

  req.app.locals.db
    .any("SELECT * FROM meals WHERE date >= $1 ORDER BY date asc", [today])
    .then((data) => {
      data.map((meal) => (meal.date = convertPostgresDateForEJS(meal.date)));
      res.render("menu", { data: data });
    });
});

router.post("/save", (req, res) => {
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
    req.app.locals.db
      .one(sqlEntry, dataFromFrontEnd)
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
    req.app.locals.db
      .one(sqlEntry, dataFromFrontEnd)
      .then((data) => {
        console.log(`A has been updated in the database:`);
        console.table(data);
        res.json({ mealID: data.meal_id });
      })
      .catch((err) => console.log(`There has been an error: ${err}`));
  }
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

module.exports = router;
