var createError = require("http-errors");
var express = require("express");
var helmet = require("helmet");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var session = require("express-session");
var mySQLStore = require("express-mysql-session")(session);

var authRouter = require("./controllers/authController");
var boardRouter = require("./controllers/boardController");
var starRouter = require("./controllers/starController");
var statRouter = require("./controllers/statController");
var cookieParser = require("cookie-parser");
/* configuring mysql-session */
var options = {
  host: "3.34.245.120",
  port: "3306",
  user: "nmomg",
  password: "123",
  database: "nmomg",
};
var sessionStore = new mySQLStore(options);

/* connect mysql */
var mysqlDB = require("./config/mysql/db.js");
mysqlDB.connect();

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    name: "session-cookie",
  })
);
app.use(cookieParser());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//현재 app.js 파일의 경로 + /public을 리턴한다.
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/board", boardRouter);
app.use("/star", starRouter);
app.use("/stat", statRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
