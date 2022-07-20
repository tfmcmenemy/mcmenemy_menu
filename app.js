const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
const { resourceLimits } = require("worker_threads");
const { response } = require("express");
const menuRoutes = require("./routes/menu");
const calendarRoutes = require("./routes/calendar");
require("dotenv").config();
const pgp = require("pg-promise")();

const PORT = 3000;

//Static files
app.use("/css", express.static("css"));
app.use("/images", express.static("images"));
app.use("/javascript", express.static("javascript"));

//Setting up EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//Setting up routes
app.use("/menu", menuRoutes);
app.use("/calendar", calendarRoutes);

//Database
const db = pgp(process.env.DATABASE_URL);
app.locals.db = db;

//Setup body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.render("login");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Connected to server...");
});
