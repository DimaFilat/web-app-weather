// Фреймворк веб-приложений.
if (process.env.NODE_ENV !== "prodaction") {
  require("dotenv").config();
}
const express = require("express");
const app = express();
// HTTP request logger middleware for node.js.
// Логгирование деталей запросов.
const morgan = require("morgan");
const session = require("express-session");
const path = require("path");
const cookieParser = require("cookie-parser");
const redis = require("redis");
const RedisStore = require("connect-redis")(session);
const client = redis.createClient();
const { cookiesCleaner } = require("./middleware/auth");
const THREE = require("three");

app.use(morgan("dev"));

// Обработка POST запросов.
// urlencoded.
app.use(express.urlencoded({ extended: true }));
// json.
app.use(express.json());

// initialize cookie-parser to allow us access the cookies stored in the browser.
app.use(cookieParser());

app.use(cookiesCleaner);

// Импорт маршрутов.
const indexRouter = require("./routes/index");

// Подключаем статику
app.use(express.static(path.join(__dirname, "public")));

// Подключаем views(hbs)
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

// Подключаем импортированные маршруты с определенным url префиксом.
app.use("/", indexRouter);

// Обработка ошибок.
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;
